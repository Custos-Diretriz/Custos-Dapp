"use client";

import React, { useContext, useEffect, useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar";
import { padAddress, truncAddress } from "@/utils/serializer";
import Image from "next/image";
// import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
// import { connect, useStarknetkitConnectModal } from "starknetkit";
// import { useNotification } from "@/context/NotificationProvider";
import { connects, WalletContext } from "./walletprovider";

function ConnectButtoncomponent() {
  const [connected, setConnected] = useState(null);
  const { connection, connectWallet, disconnectWallet, address, wallet } =
    useContext(WalletContext);

  useEffect(() => {
    console.log("connected account; ", address);
    setConnected(wallet);
  }, [wallet, connected]);

  // const {account, address, status} = useAccount();

  // const { connectAsync, connectors } = useConnect();
  //   const { disconnect } = useDisconnect({});

  //   const { starknetkitConnectModal } = useStarknetkitConnectModal({
  //     connectors: connects, modalMode: "canAsk", dappName: "Custos Diretriz"
  //   });

  //     const connectWallet = async () => {
  //         const {wallet, connectorData, connector} = await connect({ connectors: connects, dappName: "CUSTOS DIRETRIZ", modalMode: "canAsk" })
  // console.log('starknetkit account: ', connector.account);
  // console.log('connector: ', connector);

  //         if (account) {
  //         setConnection(connector.account);
  //         openNotification("success", "Wallet Connected", "Your wallet has been connected successfully!");
  //         const cleanedAddress = padAddress(address);
  //         setAdd(cleanedAddress);
  //         }

  //     };

  const handleConnect = async () => {
    console.log("Attempting to connect wallet...");
    await connectWallet();
  };

  return (
    <div className="justify-end flex max-w-[13em] overflow-hidden w-fit items-end">
      {connected ? (
        <div
          className="cursor-pointer border-gradient2 w-full rounded-full text-[#ededef]  p-[1px]"
          onClick={disconnectWallet}
        >
          <div className="bg-[#121212] border-gradient2 rounded-full py-2 px-3 flex gap-2">
            <Image
              className="rounded-full"
              src={generateAvatarURL(address)}
              alt=""
              width={24}
              height={24}
            />
            <span
              // onClick={disconnectWallet}
              className="w-full bg-transparent rounded-full overflow-hidden text-sm"
            >
              {truncAddress(address)}
            </span>
          </div>
        </div>
      ) : (
        <div
          className="w-full backdrop-blur-[10px] border-gradient2 cursor-pointer p-[2px] rounded-[100px]"
          onClick={handleConnect}
        >
          <div className="bg-[#121212] rounded-[100px]">
            <button className="flex items-center text-white text-sm py-3 px-6 rounded-[100px] hover:bg-gradient-to-r from-[#19B1D2] to-[#0094FF] hover:bg-[#209af1] transition-colors duration-300 ease-in-out">
              <span>Connect Wallet</span>
              <FaLongArrowAltRight className="ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default ConnectButtoncomponent;
