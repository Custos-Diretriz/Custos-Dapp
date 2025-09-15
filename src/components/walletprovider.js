"use client";
import React, { createContext, useEffect, useState } from "react";
import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { InjectedConnector } from "starknetkit/injected";
import { WebWalletConnector } from "starknetkit/webwallet";
import { mainnet } from "@starknet-react/chains";
import { connect, disconnect } from "starknetkit";

import { RpcProvider, Account } from "starknet";
import { useNotification } from "../context/NotificationProvider";
import { padAddress } from "../utils/serializer";

export const WalletContext = createContext();
const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

// Initialize StarkNet.js provider
const provider = new RpcProvider({
  nodeUrl: process.env.NEXT_PUBLIC_BASE_URL
});

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [connection, setConnection] = useState(null);
  const [data, setConnectorData] = useState(null);
  const [address, setAdd] = useState("");
  const [starknetJsAccount, setStarknetJsAccount] = useState(null);
  const { openNotification } = useNotification();

  const handleWalletConnect = (wallet) => {
    if (wallet?.account) {
      try {
        // Create StarkNet.js account instance
        // const starknetAccount = new Account(
        //   provider,
        //   wallet.account.address,
        //   wallet.account.signer
        // );
        
        // setStarknetJsAccount(starknetAccount);
        setWallet(wallet);
        setConnection(wallet.account);
        setConnectorData(wallet.selectedAddress);
        
        const cleanedAddress = padAddress(wallet.selectedAddress);
        setAdd(cleanedAddress);
        
        openNotification(
          "success",
          "Wallet Connected",
          "Your wallet has been connected successfully!"
        );
      } catch (error) {
        console.error("Error creating StarkNet.js account:", error);
        openNotification(
          "error",
          "Connection Error",
          "Failed to initialize wallet connection"
        );
      }
    }
  };

  useEffect(() => {
    const starknetConnect = async () => {
      try {
        const { wallet } = await connect({
          connectors: [
            new ArgentMobileConnector({
              options: {
                dappName: "CUSTOS DIRETRIZ",
                projectId: process.env.NEXT_PUBLIC_ID,
                chainId: "SN_MAIN",
                url: process.env.NEXT_PUBLIC_WEBSITE,
                icons: [process.env.NEXT_PUBLIC_WEBSITE],
                rpcUrl: process.env.NEXT_PUBLIC_BASE_URL,
              },
            }),
            new InjectedConnector({ options: { id: "argentX" } }),
            new InjectedConnector({ options: { id: "braavos" } }),
            new WebWalletConnector(),
          ],
          modalMode: "canAsk",
        });

        if (wallet) handleWalletConnect(wallet);
      } catch (error) {
        console.error("Connection error:", error);
      }
    };
    starknetConnect();
  }, []);

  const connectWallet = async () => {
    try {
      const { wallet } = await connect({
        connectors: [
          new ArgentMobileConnector({
            options: {
              dappName: "CUSTOS DIRETRIZ",
              projectId: process.env.NEXT_PUBLIC_ID,
              chainId: "SN_MAIN",
              url: process.env.NEXT_PUBLIC_WEBSITE,
              icons: [process.env.NEXT_PUBLIC_WEBSITE],
              rpcUrl: process.env.NEXT_PUBLIC_BASE_URL,
            },
          }),
          new InjectedConnector({ options: { id: "argentX" } }),
          new InjectedConnector({ options: { id: "braavos" } }),
          new WebWalletConnector(),
        ],
        modalMode: "canAsk",
      });

      if (wallet) handleWalletConnect(wallet);
    } catch (error) {
      console.error("Connection error:", error);
      openNotification("error", "Connection Failed", error.message);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      setWallet(null);
      setConnection(null);
      setConnectorData(null);
      // setStarknetJsAccount(null);
      setAdd("");
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        data,
        connection,
        connectWallet,
        disconnectWallet,
        address,
        // starknetJsAccount,
        provider
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};