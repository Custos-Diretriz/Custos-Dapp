import { BrowserProvider, Contract, JsonRpcProvider, hexlify } from "ethers";
import { AGREEMENT_ABI } from "../lib/chains";
import { sha256Hex } from "./verify";

/** SHA-256 of a string, as a bytes32 value the contract accepts. */
export async function hashText(text) {
  const bytes = new TextEncoder().encode(text ?? "");
  return "0x" + (await sha256Hex(bytes.buffer));
}

function readContract(chain) {
  if (!chain?.agreementAddress) {
    throw new Error(`No AgreementRegistry configured for ${chain?.name}`);
  }
  const provider = new JsonRpcProvider(chain.rpcUrl);
  return new Contract(chain.agreementAddress, AGREEMENT_ABI, provider);
}

/** privyWallet comes from useWallets() — the user signs this themselves. */
async function writeContract(chain, privyWallet) {
  const eip1193 = await privyWallet.getEthereumProvider();
  const signer = await new BrowserProvider(eip1193).getSigner();
  return new Contract(chain.agreementAddress, AGREEMENT_ABI, signer);
}

/**
 * Anchor an agreement. Only digests are sent — content and identity
 * documents stay in the backend.
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
    agreementTitle
  );
  const receipt = await tx.wait();

  // agreementId is the first indexed arg → topics[1] of our event
  const created = receipt.logs.find(
    (l) => l.address.toLowerCase() === chain.agreementAddress.toLowerCase()
  );
  const agreementId = created ? Number(BigInt(created.topics[1])) : null;

  return { txHash: receipt.hash, agreementId };
}

export async function validateAgreement({ chain, privyWallet, agreementId }) {
  const contract = await writeContract(chain, privyWallet);
  const tx = await contract.validateAgreement(agreementId);
  const receipt = await tx.wait();
  return { txHash: receipt.hash };
}

export async function getAgreementDetails({ chain, agreementId }) {
  const a = await readContract(chain).getAgreementDetails(agreementId);
  return {
    id: Number(a.id),
    creator: a.creator,
    secondPartyAddress: a.secondPartyAddress,
    agreementTitle: a.agreementTitle,
    contentHash: a.contentHash,
    firstPartyIdHash: a.firstPartyIdHash,
    secondPartyIdHash: a.secondPartyIdHash,
    timestamp: Number(a.timestamp) * 1000,
    validateSignature: a.validateSignature,
  };
}

/** Does the document the backend just served match what was anchored? */
export async function verifyContent({ chain, agreementId, content }) {
  return readContract(chain).verifyContent(agreementId, await hashText(content));
}