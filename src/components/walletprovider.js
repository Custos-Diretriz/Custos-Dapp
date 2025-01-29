"use client";
import React, { createContext, useEffect, useState } from "react";
import { connect, disconnect } from "starknetkit";
import { InjectedConnector } from "starknetkit/injected";
import { http, createConfig, WagmiProvider, createStorage } from "wagmi";
import { mainnet as ethMainnet, polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, walletConnect, metaMask } from "wagmi/connectors";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useNotification } from "@/context/NotificationProvider";
import { padAddress } from "@/utils/serializer";

const queryClient = new QueryClient();

export const WalletContext = createContext();

const createWagmiConfig = () => {
  if (typeof window === "undefined") return null;

  const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
  const chains = [ethMainnet, polygon];

  return createConfig({
    chains,
    transports: {
      [ethMainnet.id]: http(),
      [polygon.id]: http(),
    },
    connectors: [
      metaMask({ chains }),
      walletConnect({
        projectId,
        showQrModal: true,
        chains,
      }),
    ],
    storage: createStorage({ storage: window.localStorage }),
  });
};

export const WalletProvider = ({ children }) => {
  const [config] = useState(() => createWagmiConfig());
  const [wallet, setWallet] = useState(null);
  const [connection, setConnection] = useState(null);
  const [data, setConnectorData] = useState(null);
  const [address, setAdd] = useState("");
  const { openNotification } = useNotification();
  const [walletType, setWalletType] = useState(null);

  // Inside WalletProvider
  const connectStarknetWallet = async (walletId) => {
    try {
      console.log("Attempting to connect to wallet:", walletId);

      // Initialize the connector based on wallet type
      let selectedConnector;
      if (walletId === "argentX") {
        selectedConnector = new InjectedConnector({
          options: { id: "argentX" },
        });
      } else if (walletId === "braavos") {
        selectedConnector = new InjectedConnector({
          options: { id: "braavos" },
        });
      }

      console.log("Created connector:", selectedConnector);

      const result = await connect({
        connectors: [selectedConnector],
        // Remove modalMode to let starknetkit handle the flow
      });

      console.log("Connection result:", result);

      if (result?.wallet?.isConnected) {
        setWallet(result.wallet);
        setConnection(result.wallet.account);
        setConnectorData(result.wallet.selectedAddress);
        setWalletType("starknet");

        const cleanedAddress = padAddress(result.wallet.selectedAddress);
        setAdd(cleanedAddress);

        openNotification(
          "success",
          "Wallet Connected",
          `Connected to ${walletId} successfully!`
        );

        console.log("Wallet connected successfully:", {
          address: cleanedAddress,
          wallet: result.wallet,
        });
      } else {
        console.log("No wallet connection in result:", result);
      }
    } catch (error) {
      console.error("Detailed Starknet connection error:", {
        error,
        message: error.message,
        stack: error.stack,
      });

      openNotification(
        "error",
        "Connection Failed",
        error.message || "Failed to connect Starknet wallet. Please try again."
      );
    }
  };

  const connectEthereumWallet = async (connectorType) => {
    if (!config) return;

    try {
      const connector =
        connectorType === "metamask"
          ? config.connectors[0]
          : config.connectors[1];

      const result = await connector.connect();

      if (result?.accounts?.[0]) {
        const ethAddress = result.accounts[0];
        setWalletType("ethereum");
        setAdd(ethAddress);
        setWallet({
          isConnected: true,
          account: ethAddress,
          selectedAddress: ethAddress,
        });
        setConnection({ account: ethAddress });

        openNotification(
          "success",
          "Wallet Connected",
          "Your Ethereum wallet has been connected successfully!"
        );
      }
    } catch (error) {
      console.error("Ethereum connection error:", error);
      openNotification(
        "error",
        "Connection Failed",
        error.message || "Failed to connect Ethereum wallet. Please try again."
      );
    }
  };

  const disconnectWallet = async () => {
    try {
      if (walletType === "starknet") {
        await disconnect();
      } else if (walletType === "ethereum" && config) {
        for (const connector of config.connectors) {
          if (connector.disconnect) {
            await connector.disconnect();
          }
        }
      }

      setWallet(null);
      setConnection(null);
      setConnectorData(null);
      setWalletType(null);
      setAdd("");

      openNotification(
        "success",
        "Wallet Disconnected",
        "Your wallet has been disconnected successfully!"
      );
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0 && walletType === "ethereum") {
        setAdd(accounts[0]);
        setWallet({
          isConnected: true,
          account: accounts[0],
          selectedAddress: accounts[0],
        });
      }
    };

    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, [walletType]);

  if (!config) {
    return (
      <WalletContext.Provider
        value={{
          wallet,
          data,
          connection,
          connectStarknetWallet,
          connectEthereumWallet,
          disconnectWallet,
          address,
          walletType,
        }}
      >
        {children}
      </WalletContext.Provider>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={config.chains}>
          <WalletContext.Provider
            value={{
              wallet,
              data,
              connection,
              connectStarknetWallet,
              connectEthereumWallet,
              disconnectWallet,
              address,
              walletType,
            }}
          >
            {children}
          </WalletContext.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
