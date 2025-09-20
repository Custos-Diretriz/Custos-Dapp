import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    const fileName = form.get('fileName');

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const pinataJwt = process.env.PINATA_JWT || process.env.IPFS_PINATA_JWT || process.env.NFT_STORAGE_TOKEN;
    if (!pinataJwt) {
      return NextResponse.json({ error: 'Server misconfigured: missing PINATA_JWT' }, { status: 500 });
    }

    const uploadForm = new FormData();
    uploadForm.append('file', file, typeof fileName === 'string' ? fileName : 'upload');

    const pinRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pinataJwt}`,
      },
      body: uploadForm,
    });

    if (!pinRes.ok) {
      const text = await pinRes.text();
      return NextResponse.json({ error: `Pinata error: ${pinRes.status} ${text}` }, { status: 502 });
    }

    const data = await pinRes.json();
    return NextResponse.json({ ipfsHash: data.IpfsHash }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 });
  }
}

