/**
 * Fetch a file from IPFS by CID and recompute its SHA-256 digest so the
 * recording can be verified against what was anchored onchain.
 */
export async function fetchAndHash(
  cid,
  gateway = "https://gateway.pinata.cloud/ipfs"
) {
  const res = await fetch(`${gateway}/${cid}`);
  if (!res.ok) throw new Error(`Could not retrieve ${cid} from IPFS`);

  const buffer = await res.arrayBuffer();
  const blob = new Blob([buffer]);

  return {
    blob,
    url: URL.createObjectURL(blob),
    sha256: await sha256Hex(buffer),
    cid,
  };
}

export async function sha256Hex(bufferOrBlob) {
  const buffer =
    bufferOrBlob instanceof Blob
      ? await bufferOrBlob.arrayBuffer()
      : bufferOrBlob;
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}