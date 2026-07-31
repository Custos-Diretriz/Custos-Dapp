import { NextResponse } from "next/server";
import { PinataSDK } from "pinata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});

export async function GET() {
  try {
    const index = {};
    let pageToken;

    do {
      const page = await pinata.files.private.list().limit(100).pageToken(pageToken);
      for (const f of page.files || []) {
        index[f.cid] = { name: f.name, createdAt: f.created_at };
      }
      pageToken = page.next_page_token;
    } while (pageToken);

    return NextResponse.json({ index });
  } catch (error) {
    console.error("ipfs-index error:", error);
    return NextResponse.json({ index: {} });
  }
}