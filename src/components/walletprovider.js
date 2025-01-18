"use client";
import React, { createContext, useState, useEffect } from "react";
// import { connect, disconnect } from "starknetkit";
import { ArgentMobileConnector, StarknetKitConnector } from "starknetkit/argentMobile";
import { useNotification } from "@/context/NotificationProvider";
import { padAddress } from "@/utils/serializer";
import { InjectedConnector } from "starknetkit/injected";
import { WebWalletConnector } from "starknetkit/webwallet";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const {
    openNotification,
  } = useNotification();
  const [connection, setConnection] = useState(null);
  const [account, setAccount] = useState("");
  const [address, setAddress] = useState("");



  const connectWallet = async () => {
    const { wallet, connectorData } = await connect({
      connectors: [
        ArgentMobileConnector.init({
          options: {
            dappName: "CUSTOS DIRETRIZ",
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
    })

    console.log("wallet is ",wallet);
    console.log("wallet is ",connectorData.account);
    console.log("connectordata is ",connectorData);
    
    // await starknet?.enable({ starknetVersion: "v4" })
    if ( connectorData ) {
      setConnection(connectorData);
      setAccount(connectorData.account);
      openNotification("success", "Wallet Connected", "Your wallet has been connected successfully!");
      const cleanedAddress = padAddress(connectorData.account);
      setAddress(cleanedAddress);
    }
  };

  const disconnectWallet = async () => {
    await disconnect();
    setConnection(null);
    setAccount("");
    setAddress("");
  };

  return (
    <WalletContext.Provider
      value={{ connection, account, address, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};
