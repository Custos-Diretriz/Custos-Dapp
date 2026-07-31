import { BrowserProvider, Contract, JsonRpcProvider } from "ethers";
import { AGREEMENT_ABI } from "../lib/chains";

/** SHA-256 of a string, as the bytes32 the contract expects. */
export async function hashText(text) {
  const bytes = new TextEncoder().encode(text ?? "");
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return (
    "0x" +
    Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

function readContract(chain) {
  if (!chain?.agreementAddress) {
    throw new Error(`No AgreementRegistry configured for ${chain?.name}`);
  }
  const provider = new JsonRpcProvider(chain.rpcUrl);
  return new Contract(chain.agreementAddress, AGREEMENT_ABI, provider);
}

/** Users sign their own agreement transactions — no relayer here. */
async function writeContract(chain, privyWallet) {
  if (!privyWallet) throw new Error("Connect a wallet to sign this agreement");
  const eip1193 = await privyWallet.getEthereumProvider();
  const signer = await new BrowserProvider(eip1193).getSigner();
  return new Contract(chain.agreementAddress, AGREEMENT_ABI, signer);
}

/** One shape for both chains, so the cards don't have to branch. */
function normalize(a) {
  return {
    id: Number(a.id),
    creator: a.creator,
    second_party_address: a.secondPartyAddress,
    agreement_title: a.agreementTitle,
    content_hash: a.contentHash,
    first_party_id_hash: a.firstPartyIdHash,
    second_party_id_hash: a.secondPartyIdHash,
    timestamp: Number(a.timestamp) * 1000,
    validate_signature: a.validateSignature,
    onchain: true,
  };
}

/**
 * Anchor a completed agreement. Only digests go onchain — the document and
 * the identity images stay in the backend.
 */
export async function createAgreement({
  chain,
  privyWallet,
  content,
  secondPartyAddress,
  firstPartyValidId,
  secondPartyValidId,
  agreementTitle,
}) {
  const contract = await writeContract(chain, privyWallet);

  const tx = await contract.createAgreement(
    await hashText(content),
    secondPartyAddress,
    await hashText(firstPartyValidId),
    await hashText(secondPartyValidId),
    agreementTitle || ""
  );
  const receipt = await tx.wait();

  // agreementId is the first indexed arg → topics[1] of our own log
  const log = receipt.logs.find(
    (l) => l.address.toLowerCase() === chain.agreementAddress.toLowerCase()
  );
  const agreementId = log ? Number(BigInt(log.topics[1])) : null;

  return { txHash: receipt.hash, agreementId };
}

export async function validateAgreement({ chain, privyWallet, agreementId }) {
  const contract = await writeContract(chain, privyWallet);
  const tx = await contract.validateAgreement(agreementId);
  const receipt = await tx.wait();
  return { txHash: receipt.hash };
}

export async function getAgreementDetails({ chain, agreementId }) {
  return normalize(await readContract(chain).getAgreementDetails(agreementId));
}

/** Every agreement this address is party to, paged. */
export async function getUserAgreements({ chain, userAddress, pageSize = 50 }) {
  if (!userAddress) return [];
  const contract = readContract(chain);

  const out = [];
  let offset = 0;
  let total = Infinity;

  while (offset < total) {
    const [page, tot] = await contract.getUserAgreementsPaginated(
      userAddress,
      offset,
      pageSize
    );
    total = Number(tot);
    if (!page.length) break;
    for (const a of page) out.push(normalize(a));
    offset += page.length;
  }
  return out.sort((a, b) => b.timestamp - a.timestamp);
}

/** Does the document the backend served match what was anchored? */
export async function verifyContent({ chain, agreementId, content }) {
  return readContract(chain).verifyContent(agreementId, await hashText(content));
}