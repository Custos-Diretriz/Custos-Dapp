import { NextResponse } from "next/server";
import { Contract, Wallet, JsonRpcProvider, isAddress, getAddress } from "ethers";
import { CHAINS, CHAIN_TYPES, CRIME_RECORD_ABI } from "../../../lib/chains";
import {
  listPendingAnchors,
  markAnchored,
  markRetryFailed,
} from "../../../lib/pendingAnchors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { chainKey, userAddress } = await req.json();

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

    const provider = new JsonRpcProvider(chain.rpcUrl);
    const guestWallet = new Wallet(process.env.GUEST_PRIVATE_KEY, provider);
    const contract = new Contract(
      chain.contractAddress,
      CRIME_RECORD_ABI,
      guestWallet
    );

    // no wallet connected → drain the guest wallet's own queue
    const target =
      userAddress && isAddress(userAddress)
        ? getAddress(userAddress)
        : guestWallet.address;

    const pending = await listPendingAnchors({
      userAddress: target,
      chainKey: chain.key,
    });

    let anchored = 0;
    const failures = [];

    for (const row of pending) {
      try {
        const tx = await contract.storeEvidence(
          row.file_hash,
          row.content_hash || "",
          target
        );
        const receipt = await tx.wait();
        await markAnchored({ id: row.id, txHash: receipt.hash });
        anchored++;
      } catch (e) {
        const reason = e.shortMessage || e.message;
        failures.push(reason);
        await markRetryFailed({
          id: row.id,
          attempts: row.attempts,
          reason,
        });
        // gas or auth problems hit every row identically — stop early
        if (/insufficient funds|not authorized|paused/i.test(reason)) break;
      }
    }

    return NextResponse.json({
      pending: pending.length,
      anchored,
      lastError: failures[failures.length - 1] || null,
    });
  } catch (error) {
    console.error("anchor-retry error:", error);
    return NextResponse.json(
      { error: error.shortMessage || error.message || "Retry failed" },
      { status: 500 }
    );
  }
}