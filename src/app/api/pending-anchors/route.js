import { NextResponse } from "next/server";
import { Wallet, JsonRpcProvider, isAddress, getAddress } from "ethers";
import { CHAINS, CHAIN_TYPES } from "../../../lib/chains";
import { listPendingAnchors } from "../../../lib/pendingAnchors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const chainKey = searchParams.get("chainKey");
    const userAddress = searchParams.get("userAddress");

    const chain = CHAINS[chainKey];
    if (!chain || chain.type !== CHAIN_TYPES.EVM) {
      return NextResponse.json({ error: "Unsupported chain" }, { status: 400 });
    }

    let target;
    if (userAddress && isAddress(userAddress)) {
      target = getAddress(userAddress);
    } else {
      if (!process.env.GUEST_PRIVATE_KEY) return NextResponse.json([]);
      const provider = new JsonRpcProvider(chain.rpcUrl);
      target = new Wallet(process.env.GUEST_PRIVATE_KEY, provider).address;
    }

    const rows = await listPendingAnchors({
      userAddress: target,
      chainKey: chain.key,
    });

    return NextResponse.json(
      rows.map((r) => ({
        uri: r.file_hash,
        contentHash: r.content_hash,
        user: target,
        isGuest: r.is_guest,
        timestamp: new Date(r.created_at).getTime(),
        attempts: r.attempts,
        pending: true,
      }))
    );
  } catch (error) {
    console.error("pending-anchors error:", error);
    return NextResponse.json([]);
  }
}