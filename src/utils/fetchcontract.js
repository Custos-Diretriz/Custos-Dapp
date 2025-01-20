"use client";
import crimeAbi from "./coverCrimeAbi.json";
import agreementAbi from "./agreementAbi.json";
import { Contract, RpcProvider } from "starknet";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/components/walletprovider";
import { useNotification } from "@/context/NotificationProvider";
import { useAccount } from "@starknet-react/core";

export const provider = new RpcProvider({
  nodeUrl: process.env.NEXT_PUBLIC_BASE_URL,
});

const contractConfigs = {
  crime: {
    abi: crimeAbi,
    address:
      "0x020bd5ec01c672e69e3ca74df376620a6be8a2b104ab70a9f0885be00dd38fb9",
  },
  agreement: {
    abi: agreementAbi,
    address:
      "0x02aab9906df2dec1c371495f1e3d7f367a5cddc48179d7aee959ed4dc3a1662d",
  },
};


// Hook to read data from a contract
export const UseReadContractData = () => {
  const { openNotification } = useNotification();

  const fetchData = async (contractName, methodName, params = []) => {
    try {
      const contractConfig = contractConfigs[contractName];
      if (!contractConfig) {
        openNotification(
          "error",
          "",
          `Contract "${contractName}" not found in configurations.`
        );
        throw new Error(
          `Contract "${contractName}" not found in configurations.`
        );
      }

      // console.log('called', contractConfig)
      const contract = new Contract(
        contractConfig.abi,
        contractConfig.address,
        provider
      );

      // console.log('calling result')
      const result =
        params.length > 0
          ? await contract[methodName](...params)
          : await contract[methodName]();
      console.log("result", result);
      return result;

      // setData(result);
    } catch (err) {
      // setError(err);
      console.log(err);
    } finally {
      // setLoading(false);
    }
    // return result;
  };

  return { fetchData };
};

// Hook to write data to a contract
export const UseWriteToContract = () => {
  const {connector} = useContext(WalletContext);
  const { openNotification } = useNotification();

  
  const writeToContract = async (contractName, methodName, params = []) => {
    try {
      if (!connector.account /*|| !account.account*/) {
        openNotification("error", "", "Wallet not connected");
        throw new Error("Wallet not connected");
      }

      const contractConfig = contractConfigs[contractName];
      if (!contractConfig) {
        openNotification(
          "error",
          "",
          `Contract "${contractName}" not found in configurations.`
        );
        throw new Error(
          `Contract "${contractName}" not found in configurations.`
        );
      }

      const contract = new Contract(
        contractConfig.abi,
        contractConfig.address,
        connector.account
      );

      const result =
        params.length > 0
          ? await contract[methodName](...params)
          : await contract[methodName]();

      return result;
    } catch (err) {
      openNotification("error", "", "Contract interaction failed");
      console.error("Contract interaction failed", err);
      throw err;
    }
  };

  return { writeToContract };
};

// Hook to sign a message using the wallet extension
export const UseSignMessage = () => {
  const {connector} = useContext(WalletContext);
  const { openNotification } = useNotification();

  const signMessage = async (message) => {
    try {
      if (!connector.account) {
        openNotification("error", "", "Wallet not connected");
        throw new Error("Wallet not connected");
      }

      const signature = await connector.account.signMessage(message);
      console.log("Signature:", signature);
      return signature;
    } catch (err) {
      openNotification("error", "", "Message signing failed");
      console.error("Message signing failed", err);
      throw err;
    }
  };

  return { signMessage };
};
