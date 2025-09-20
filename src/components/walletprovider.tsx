"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { InjectedConnector } from "starknetkit/injected";
import { WebWalletConnector } from "starknetkit/webwallet";
import { connect, disconnect } from "starknetkit";

import { RpcProvider } from "starknet";
import { useNotification } from "../context/NotificationProvider";
import { padAddress } from "../utils/serializer";

interface WalletAccount {
  address: string;
  signer: any;
}

interface Wallet {
  account: WalletAccount;
  selectedAddress: string;
}

interface WalletContextValue {
  wallet: Wallet | null;
  data: string | null;
  connection: WalletAccount | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  address: string;
  provider: RpcProvider;
}

export const WalletContext = createContext<WalletContextValue | undefined>(undefined);
const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

// Initialize StarkNet.js provider
const provider = new RpcProvider({
  nodeUrl: process.env.NEXT_PUBLIC_BASE_URL
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps): React.JSX.Element => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [connection, setConnection] = useState<WalletAccount | null>(null);
  const [data, setConnectorData] = useState<string | null>(null);
  const [address, setAdd] = useState<string>("");
  const { openNotification } = useNotification();

  const handleWalletConnect = useCallback((wallet: Wallet): void => {
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
  }, [openNotification]);

  useEffect(() => {
    const starknetConnect = async () => {
      try {
        const { wallet } = await connect({
          connectors: [
            new ArgentMobileConnector({
              dappName: "CUSTOS DIRETRIZ",
              projectId: process.env.NEXT_PUBLIC_ID,
              chainId: "SN_MAIN" as any,
              url: process.env.NEXT_PUBLIC_WEBSITE,
              icons: [process.env.NEXT_PUBLIC_WEBSITE || ""],
              rpcUrl: process.env.NEXT_PUBLIC_BASE_URL,
            }),
            new InjectedConnector({ options: { id: "argentX" } }),
            new InjectedConnector({ options: { id: "braavos" } }),
            new WebWalletConnector(),
          ],
          modalMode: "canAsk",
        });

        if (wallet) handleWalletConnect(wallet as any);
      } catch (error) {
        console.error("Connection error:", error);
      }
    };
    starknetConnect();
  }, [handleWalletConnect]);

  const connectWallet = async (): Promise<void> => {
    try {
      const { wallet } = await connect({
        connectors: [
          new ArgentMobileConnector({
            dappName: "CUSTOS DIRETRIZ",
            projectId: process.env.NEXT_PUBLIC_ID,
            chainId: "SN_MAIN" as any,
            url: process.env.NEXT_PUBLIC_WEBSITE,
            icons: [process.env.NEXT_PUBLIC_WEBSITE || ""],
            rpcUrl: process.env.NEXT_PUBLIC_BASE_URL,
          }),
          new InjectedConnector({ options: { id: "argentX" } }),
          new InjectedConnector({ options: { id: "braavos" } }),
          new WebWalletConnector(),
        ],
        modalMode: "canAsk",
      });

      if (wallet) handleWalletConnect(wallet as any);
    } catch (error) {
      console.error("Connection error:", error);
      
      openNotification("error", "Connection Failed", (error as any)?.message ?? "");
    }
  };

  const disconnectWallet = async (): Promise<void> => {
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

  const value: WalletContextValue = {
    wallet,
    data,
    connection,
    connectWallet,
    disconnectWallet,
    address,
    provider,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextValue => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};