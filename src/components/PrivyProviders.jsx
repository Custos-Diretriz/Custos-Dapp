"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { defineChain } from "viem";
import { celo, base } from "viem/chains";

const celoSepolia = defineChain({
  id: 11142220,
  name: "Celo Sepolia",
  nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://forno.celo-sepolia.celo-testnet.org"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://celo-sepolia.blockscout.com" },
  },
  testnet: true,
});

const site = process.env.NEXT_PUBLIC_WEBSITE;

export default function PrivyProviders({ children }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    console.error("NEXT_PUBLIC_PRIVY_APP_ID is missing — EVM login is disabled.");
    return children;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        defaultChain: celo,
        supportedChains: [celo, celoSepolia, base],

        loginMethods: ["email", "sms", "google", "wallet"],

        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: false,
          showWalletUIs: false, // replaces removed noPromptOnSignature
        },

        appearance: {
          theme: "dark",
          accentColor: "#0094FF",
          logo: "/logo.svg",
          walletList: ["metamask", "rainbow", "coinbase_wallet", "wallet_connect"],
          showWalletLoginFirst: false,
        },

        ...(site
          ? {
              legal: {
                termsAndConditionsUrl: `${site}/terms`,
                privacyPolicyUrl: `${site}/privacy`,
              },
            }
          : {}),
      }}
    >
      {children}
    </PrivyProvider>
  );
}