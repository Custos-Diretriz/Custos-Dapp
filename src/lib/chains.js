export const CHAIN_TYPES = {
  EVM: "evm",
  STARKNET: "starknet",
};

export const CHAINS = {
  celosepolia: {
    key: "celosepolia",
    type: CHAIN_TYPES.EVM,
    name: "Celo Sepolia",
    chainId: 11142220,
    chainIdHex: "0xaa044c",
    rpcUrl: "https://forno.celo-sepolia.celo-testnet.org",
    explorer: "https://celo-sepolia.blockscout.com",
    nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
    contractAddress: "0xD1059539a04Df897C226C8952d976202fb70E3B0",
    agreementAddress: "0xCBD5CDfAe27C4140c0b69B35E56BdD7672839B1F",
  },
  starknet: {
    key: "starknet",
    type: CHAIN_TYPES.STARKNET,
    name: "Starknet",
    chainIdText: "SN_MAIN",
    explorer: "https://starkscan.co",
    contractAddress:
      "0x020bd5ec01c672e69e3ca74df376620a6be8a2b104ab70a9f0885be00dd38fb9",
  },
};

export const DEFAULT_CHAIN_KEY = "celosepolia";
export const DEFAULT_CHAIN = CHAINS[DEFAULT_CHAIN_KEY];

/** Only chains that actually have a deployed contract show in the selector. */
export const availableChains = () =>
  Object.values(CHAINS).filter((c) => !!c.contractAddress);

export const getChain = (key) => CHAINS[key] || DEFAULT_CHAIN;

export const txUrl = (chain, hash) =>
  chain?.explorer ? `${chain.explorer}/tx/${hash}` : null;

export const CRIME_RECORD_ABI = [
  "function storeEvidence(string fileHash, string contentHash, address user) external",
  "function storeEvidenceBatch(string[] fileHashes, string[] contentHashes, address user) external",
  "function getEvidencePaginated(address user, uint256 offset, uint256 limit) view returns (tuple(string fileHash, string contentHash, uint256 timestamp)[] page, uint256 total)",
  "function getEvidenceCount(address user) view returns (uint256)",
  "function getAllEvidencePaginated(uint256 offset, uint256 limit) view returns (tuple(address user, string fileHash, string contentHash, uint256 timestamp, bool isGuest)[] page, uint256 total)",
  "function getUsers() view returns (address[])",
  "function getUserCount() view returns (uint256)",
  "function totalEvidence() view returns (uint256)",
  "function recorder() view returns (address)",
  "function paused() view returns (bool)",
  "event EvidenceStored(address indexed user, string fileHash, string contentHash, uint256 timestamp, bool isGuest)",
];
const AGREEMENT_TUPLE =
  "tuple(uint256 id, address creator, address secondPartyAddress, string agreementTitle, bytes32 contentHash, bytes32 firstPartyIdHash, bytes32 secondPartyIdHash, uint256 timestamp, bool validateSignature)";

export const AGREEMENT_ABI = [
  "function createAgreement(bytes32 contentHash, address secondPartyAddress, bytes32 firstPartyIdHash, bytes32 secondPartyIdHash, string agreementTitle) external returns (uint256)",
  "function validateAgreement(uint256 agreementId) external",
  `function getAgreementDetails(uint256 agreementId) view returns (${AGREEMENT_TUPLE})`,
  "function verifyContent(uint256 agreementId, bytes32 hash) view returns (bool)",
  "function getUserAgreementCount(address user) view returns (uint256)",
  `function getUserAgreementsPaginated(address user, uint256 offset, uint256 limit) view returns (${AGREEMENT_TUPLE}[] page, uint256 total)`,
  "function agreementCount() view returns (uint256)",
  "event AgreementCreated(uint256 indexed agreementId, address indexed creator, address indexed secondPartyAddress, bytes32 contentHash, uint256 timestamp)",
  "event AgreementValidated(uint256 indexed agreementId, address indexed creator, uint256 timestamp)",
];

/** Chains with an agreement contract deployed. */
export const agreementChains = () =>
  Object.values(CHAINS).filter((c) => !!c.agreementAddress);