// Conditional import to prevent build errors when package is not available
let fetchBuildTypedData: any = null;
try {
  const gaslessSdk = require('@avnu/gasless-sdk');
  fetchBuildTypedData = gaslessSdk.fetchBuildTypedData;
} catch (e) {
  console.warn('@avnu/gasless-sdk not available');
}
import { NextResponse } from 'next/server';

export async function POST(req: Request): Promise<Response> {
  const { userAddress, calls, gasTokenAddress, maxGasTokenAmount, accountClassHash } = await req.json();
  if (!userAddress || !Array.isArray(calls)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  
  try {
    if (!fetchBuildTypedData) {
      return NextResponse.json({ error: 'Gasless SDK not available' }, { status: 503 });
    }

    const options = {
      baseUrl: "https://starknet.api.avnu.fi",
      apiKey: process.env.AVNU_KEY
    };

    // Prepare the unsigned transaction
    const typedData = await fetchBuildTypedData(
      userAddress,
      calls,
      gasTokenAddress,
      maxGasTokenAmount,
      options,
      accountClassHash
    );

    // const replacer = (key, value) => 
    //   typeof value === 'bigint' ? value.toString() : value;

    return NextResponse.json({ typedData }, { status: 200 });

  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || 'Transaction preparation failed' },
      { status: 500 }
    );
  }
}