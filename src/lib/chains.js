import { sepolia } from "@starknet-react/chains";

export const CHAIN_TYPES = {
  EVM: "evm",
  STARKNET: "starknet",
};

export const CHAINS = {
  celo: {
    key: "celo",
    type: CHAIN_TYPES.EVM,
    name: "Celo",
    chainId: 42220,
    chainIdHex: "0xa4ec",
    rpcUrl: "https://forno.celo.org",
    explorer: "https://celoscan.io",
    nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
    contractAddress: process.env.NEXT_PUBLIC_CELO_CONTRACT,
  },
  celosepolia: {
    key: "celosepolia",
    type: CHAIN_TYPES.EVM,
    name: "Celo Sepolia",
    chainId: 11142220,
    chainIdHex: "0xaa044c",
    rpcUrl: "https://forno.celo-sepolia.celo-testnet.org",
    explorer: "https://celo-sepolia.blockscout.com",
    nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
    contractAddress: process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT,
  },
  base: {
    key: "base",
    type: CHAIN_TYPES.EVM,
    name: "Base",
    chainId: 8453,
    chainIdHex: "0x2105",
    rpcUrl: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    contractAddress: process.env.NEXT_PUBLIC_BASE_CONTRACT,
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

export const DEFAULT_CHAIN_KEY = "celo";
export const DEFAULT_CHAIN = CHAINS[DEFAULT_CHAIN_KEY];

/** Only chains that actually have a deployed contract show in the selector. */
export const availableChains = () =>
  Object.values(CHAINS).filter((c) => !!c.contractAddress);

export const getChain = (key) => CHAINS[key] || DEFAULT_CHAIN;

export const txUrl = (chain, hash) =>
  chain?.explorer ? `${chain.explorer}/tx/${hash}` : null;

export const CRIME_RECORD_ABI = [
  "function storeEvidence(string fileHash, address user) external",
  "function storeEvidenceBatch(string[] fileHashes, address user) external",
  "function getEvidence(address user) view returns (tuple(string fileHash, uint256 timestamp)[])",
  "function getEvidenceCount(address user) view returns (uint256)",
  "function getAllEvidence() view returns (tuple(address user, string fileHash, uint256 timestamp, bool isGuest)[])",
  "function getAllEvidencePaginated(uint256 offset, uint256 limit) view returns (tuple(address user, string fileHash, uint256 timestamp, bool isGuest)[] page, uint256 total)",
  "function getGuestEvidence() view returns (tuple(string fileHash, uint256 timestamp)[])",
  "function getUsers() view returns (address[])",
  "function getUserCount() view returns (uint256)",
  "function totalEvidence() view returns (uint256)",
  "function recorder() view returns (address)",
  "event EvidenceStored(address indexed user, string fileHash, uint256 timestamp, bool isGuest)",
];