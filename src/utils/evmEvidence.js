import { Contract, JsonRpcProvider } from "ethers";
import { CRIME_RECORD_ABI } from "../lib/chains";

function readContract(chain) {
  if (!chain?.contractAddress) {
    throw new Error(`No CrimeRecord contract configured for ${chain?.name}`);
  }
  const provider = new JsonRpcProvider(chain.rpcUrl);
  return new Contract(chain.contractAddress, CRIME_RECORD_ABI, provider);
}

/**
 * Save a file hash onchain. The guest wallet signs every tx server-side.
 * userAddress: connected wallet address, or null for guest sessions —
 * the server substitutes its own (guest) address when null.
 */
export async function saveEvidence({ chain, fileHash, userAddress }) {
  const res = await fetch("/api/guest-save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileHash,
      chainKey: chain.key,
      userAddress: userAddress || null,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Onchain save failed");
  }
  return res.json(); // { txHash, user, isGuest }
}

/** Batch save — used by emergency recovery. */
export async function saveEvidenceBatch({ chain, fileHashes, userAddress }) {
  const res = await fetch("/api/guest-save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileHashes,
      chainKey: chain.key,
      userAddress: userAddress || null,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Onchain batch save failed");
  }
  return res.json();
}

/** The guest/recorder address for a chain. */
export async function getRecorderAddress(chain) {
  return readContract(chain).recorder();
}

/** One address's evidence. Omit userAddress to read guest-session records. */
export async function getEvidence({ chain, userAddress }) {
  const contract = readContract(chain);
  const target = userAddress || (await contract.recorder());
  const records = await contract.getEvidence(target);
  return records
    .map((r) => ({
      user: target,
      fileHash: r.fileHash,
      timestamp: Number(r.timestamp) * 1000,
      isGuest: false,
    }))
    .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Everything — guest-session records plus every connected user's records.
 * Pages through the global log so it stays safe as the log grows.
 */
export async function getAllEvidence({ chain, pageSize = 200 }) {
  const contract = readContract(chain);
  const out = [];
  let offset = 0;
  let total = Infinity;

  while (offset < total) {
    const [page, tot] = await contract.getAllEvidencePaginated(offset, pageSize);
    total = Number(tot);
    if (!page.length) break;
    for (const r of page) {
      out.push({
        user: r.user,
        fileHash: r.fileHash,
        timestamp: Number(r.timestamp) * 1000,
        isGuest: r.isGuest,
      });
    }
    offset += page.length;
  }
  return out.sort((a, b) => b.timestamp - a.timestamp);
}

export async function getUsers({ chain }) {
  return readContract(chain).getUsers();
}