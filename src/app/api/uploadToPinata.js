import { PinataSDK } from "pinata-web3";
import formidable from "formidable";
import fs from "fs";
import { Blob, File } from "buffer";

export const config = {
  api: {
    bodyParser: false,
  },
};

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY_URL,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new formidable.IncomingForm({
    maxFileSize: 50 * 1024 * 1024,
    multiples: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "File parsing error" });
    }

    const file = files.file;

    const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "File type not allowed" });
    }

    if (file.size > 50 * 1024 * 1024) {
      return res.status(400).json({ error: "File size too large" });
    }

    try {
      const fileData = fs.readFileSync(file.filepath);
      const blob = new Blob([fileData], { type: file.mimetype });

      const pinataFile = new File(
        [blob],
        file.originalFilename || "uploaded-file",
        { type: file.mimetype }
      );

      const result = await pinata.upload.file(pinataFile);
      return res.status(200).json({ cid: result.IpfsHash });
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      return res.status(500).json({ error: "Failed to upload file to IPFS" });
    }
  });
}
