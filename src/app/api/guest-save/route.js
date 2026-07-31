import { NextResponse } from "next/server";
import {
  Contract,
  Wallet,
  JsonRpcProvider,
  isAddress,
  getAddress,
} from "ethers";
import { CHAINS, CHAIN_TYPES, CRIME_RECORD_ABI } from "../../../lib/chains";
import { queueFailedAnchors } from "../../../lib/pendingAnchors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// simple in-memory rate limit so the guest wallet's gas can't be drained
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip) || { count: 0, start: now };
  if (now - entry.start > WINDOW_MS) {
    hits.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count++;
  hits.set(ip, entry);
  return entry.count > MAX_PER_WINDOW;
}

const validHash = (h) =>
  typeof h === "string" && h.length > 0 && h.length <= 200;

/**
 * ABI/argument mismatches are our bug, not a chain failure — retrying can
 * never fix them, so fail loudly instead of filling the draft table.
 */
const isOurBug = (e) =>
  e.code === "INVALID_ARGUMENT" ||
  /no matching fragment|unconfigured name/i.test(e.message || "");

export async function POST(req) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const {
      fileHash,
      contentHash,
      fileHashes,
      contentHashes,
      chainKey,
      userAddress,
    } = await req.json();

    const chain = CHAINS[chainKey];
    if (!chain || chain.type !== CHAIN_TYPES.EVM || !chain.contractAddress) {
      return NextResponse.json({ error: "Unsupported chain" }, { status: 400 });
    }
    if (!process.env.GUEST_PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Recorder wallet not configured" },
        { status: 500 }
      );
    }

    const batch = Array.isArray(fileHashes) ? fileHashes : null;
    if (batch) {
      if (!batch.length || batch.length > 50 || !batch.every(validHash)) {
        return NextResponse.json({ error: "Invalid batch" }, { status: 400 });
      }
    } else if (!validHash(fileHash)) {
      return NextResponse.json({ error: "Invalid file hash" }, { status: 400 });
    }

    const provider = new JsonRpcProvider(chain.rpcUrl);
    const guestWallet = new Wallet(process.env.GUEST_PRIVATE_KEY, provider);
    const contract = new Contract(
      chain.contractAddress,
      CRIME_RECORD_ABI,
      guestWallet
    );

    // connected wallet address when the client supplied a valid one;
    // otherwise the recorder files it under its own address
    const isGuest = !userAddress || !isAddress(userAddress);
    const user = isGuest ? guestWallet.address : getAddress(userAddress);

    // contentHash is optional — the contract accepts ""
    const hashes = batch || [fileHash];
    const contents = batch
      ? (contentHashes || []).length === batch.length
        ? contentHashes
        : batch.map(() => "")
      : [contentHash || ""];

    try {
      const tx = batch
        ? await contract.storeEvidenceBatch(batch, contents, user)
        : await contract.storeEvidence(fileHash, contents[0], user);
      const receipt = await tx.wait();

      // anchored — nothing goes to the database
      return NextResponse.json({
        txHash: receipt.hash,
        user,
        isGuest,
        count: hashes.length,
      });
    } catch (chainError) {
      const reason = chainError.shortMessage || chainError.message;

      if (isOurBug(chainError)) {
        console.error("guest-save encoding error (not queued):", chainError);
        return NextResponse.json({ error: reason }, { status: 500 });
      }

      // genuine chain failure — the file is on IPFS, so keep the CID as a draft
      console.error("onchain save failed, queueing:", reason);
      await queueFailedAnchors({
        fileHashes: hashes,
        contentHashes: contents,
        chainKey: chain.key,
        user,
        isGuest,
        reason,
      });

      return NextResponse.json(
        { queued: true, user, isGuest, count: hashes.length, reason },
        { status: 202 }
      );
    }
  } catch (error) {
    console.error("guest-save error:", error);
    return NextResponse.json(
      { error: error.shortMessage || error.message || "Failed to save onchain" },
      { status: 500 }
    );
  }
}