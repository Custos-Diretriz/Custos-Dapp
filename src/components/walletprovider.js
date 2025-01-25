"use client";
import React, { createContext, useEffect, useState } from "react";
import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { InjectedConnector } from "starknetkit/injected";
import { WebWalletConnector } from "starknetkit/webwallet";
import { mainnet } from "@starknet-react/chains";
import { connect, disconnect } from "starknetkit";

// import { StarknetConfig, alchemyProvider, publicProvider} from "@starknet-react/core";
import { useNotification } from "@/context/NotificationProvider";
import { padAddress } from "@/utils/serializer";

export const WalletContext = createContext();
const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [connection, setConnection] = useState(null);
  const [data, setConnectorData] = useState(null);
  const [address, setAdd] = useState("");
  const { openNotification } = useNotification();

  useEffect(() => {
    const starknetConnect = async () => {
      const { wallet } = await connect({
        connectors: [
          new ArgentMobileConnector({
            options: {
              dappName: "CUSTOS DIRETRIZ",
              projectId: process.env.NEXT_PUBLIC_ID, // wallet connect project id
              chainId: "SN_MAIN",
              url: process.env.NEXT_PUBLIC_WEBSITE,
              icons: [process.env.NEXT_PUBLIC_WEBSITE],
              rpcUrl: process.env.NEXT_PUBLIC_BASE_URL,
            },
          }),
          new InjectedConnector({
            options: { id: "argentX" },
          }),
          new InjectedConnector({
            options: { id: "braavos" },
          }),
          new WebWalletConnector(),
        ],
        modalMode: "canAsk",
      });

      if (wallet && wallet.isConnected) {
        setWallet(wallet);
        setConnection(wallet.account);

        setConnectorData(wallet.selectedAddress);
        openNotification(
          "success",
          "Wallet Connected",
          "Your wallet has been connected successfully!"
        );
        const cleanedAddress = padAddress(wallet.selectedAddress);
        setAdd(cleanedAddress);
      }
    };
    starknetConnect();
  }, []);

  const connectWallet = async () => {
    const { wallet } = await connect({
      connectors: [
        new ArgentMobileConnector({
          options: {
            dappName: "CUSTOS DIRETRIZ",
            projectId: process.env.NEXT_PUBLIC_ID, // wallet connect project id
            chainId: "SN_MAIN",
            url: process.env.NEXT_PUBLIC_WEBSITE,
            icons: [process.env.NEXT_PUBLIC_WEBSITE],
            rpcUrl: process.env.NEXT_PUBLIC_BASE_URL,
          },
        }),
        new InjectedConnector({
          options: { id: "argentX" },
        }),
        new InjectedConnector({
          options: { id: "braavos" },
        }),
        new WebWalletConnector(),
      ],
      modalMode: "canAsk",
    });

    if (wallet && wallet.isConnected) {
      setWallet(wallet);
      setConnection(wallet.account);
      // console.log("setconnection is:", wallet.selectedAddress);

      setConnectorData(wallet.selectedAddress);
      openNotification(
        "success",
        "Wallet Connected",
        "Your wallet has been connected successfully!"
      );
      const cleanedAddress = padAddress(wallet.selectedAddress);
      setAdd(cleanedAddress);
    }
  };

  const disconnectWallet = async () => {
    disconnect();
    setWallet(null);
    setConnection(null);
    setConnectorData(null);
  };

  const chain = [mainnet];

  return (
    // <StarknetConfig
    //   chains={chain}
    //   provider={alchemyProvider({apiKey})}
    //   connectors={connects}
    // >
    <WalletContext.Provider
      value={{
        wallet,
        data,
        connection,
        connectWallet,
        disconnectWallet,
        address,
      }}
    >
      {children}
    </WalletContext.Provider>
    // </StarknetConfig>
  );
};