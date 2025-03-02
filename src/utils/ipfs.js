export async function uploadFileToPinata(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/uploadToPinata", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "Failed to upload file to Pinata");

    return data.cid;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    return null;
  }
}

export function fetchFileFromIPFS(cid) {
  if (!cid) return null;
  return `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${cid}`;
}
