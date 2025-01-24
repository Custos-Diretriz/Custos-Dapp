import { executeCalls } from "@avnu/gasless-sdk";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { account, calls } = await req.json(); 
    if (!account || !calls) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const options = {
      baseUrl: "https://starknet.api.avnu.fi",
      apiKey: process.env.AVNU_KEY,
    };

    try {
      const transactionResponse = await executeCalls(account, calls, {}, options);
      return NextResponse.json({ transactionResponse }, { status: 200 });
    } catch (error) {
      console.error("Transaction failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error("Failed to process request:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
