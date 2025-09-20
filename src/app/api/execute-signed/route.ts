// Conditional import to prevent build errors when package is not available
let fetchExecuteTransaction: any = null;
try {
  const gaslessSdk = require('@avnu/gasless-sdk');
  fetchExecuteTransaction = gaslessSdk.fetchExecuteTransaction;
} catch (e) {
  console.warn('@avnu/gasless-sdk not available');
}
import { NextResponse } from 'next/server';
import 'dotenv/config'

export async function POST(req: Request): Promise<Response> {
  const { userAddress, typedData, signature, deploymentData } = await req.json();

  try {
    if (!fetchExecuteTransaction) {
      return NextResponse.json({ error: 'Gasless SDK not available' }, { status: 503 });
    }

    const options = {
      baseUrl: "https://starknet.api.avnu.fi",
      apiKey: process.env.AVNU_KEY
    };

    const parsedSignature = {
      r: BigInt(signature.r),
      s: BigInt(signature.s)
    };

    // Execute the signed transaction
    const result = await fetchExecuteTransaction(
      userAddress,
      JSON.stringify(typedData),
      parsedSignature,
      options,
      deploymentData
    );
    return NextResponse.json({ transactionHash: result.transactionHash }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || 'Transaction execution failed' },
      { status: 500 }
    );
  }
}