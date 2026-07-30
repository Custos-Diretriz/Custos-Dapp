"use client";
import React, { useContext } from "react";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar";
import { truncAddress } from "../utils/serializer";
import Image from "next/image";
import { WalletContext } from "./walletprovider";
import DisconnectModal from "./DisconnectModal";
import WalletModal from "./WalletModal";
import ChainSelector from "./chainselector";

function ConnectButtonComponent({ showChainSelector = true }) {
  const {
    address,
    isGuest,
    ready,
    openWalletModal,
    disconnectWallet,
    isEmbedded,
    loginIdentifier,
  } = useContext(WalletContext);
  const [showDisconnectModal, setShowDisconnectModal] = React.useState(false);

  return (
    <>
      <div className="flex items-center gap-2 justify-end">
        {showChainSelector && <ChainSelector />}

        <div className="justify-end flex max-w-[13em] overflow-hidden w-fit items-end">
          {!ready ? (
            <div className="rounded-full py-2 px-4 bg-[#121212] text-[#19B1D2] text-sm">
              …
            </div>
          ) : !isGuest ? (
            <div
              className="cursor-pointer border-gradient2 w-full rounded-full text-[#ededef] p-[1px]"
              onClick={() => setShowDisconnectModal(true)}
            >
              <div className="bg-[#121212] border-gradient2 rounded-full py-2 px-3 flex gap-2 items-center">
                <Image
                  className="rounded-full"
                  src={generateAvatarURL(address)}
                  alt="avatar"
                  width={24}
                  height={24}
                />
                <span className="text-sm">
                  {isEmbedded && loginIdentifier
                    ? loginIdentifier.length > 14
                      ? `${loginIdentifier.slice(0, 12)}…`
                      : loginIdentifier
                    : truncAddress(address)}
                </span>
              </div>
            </div>
          ) : (
            <div
              className="cursor-pointer border-gradient2 w-full rounded-full text-[#ededef] p-[1px]"
              onClick={openWalletModal}
            >
              <div className="bg-[#121212] border-gradient2 rounded-full py-2 px-4 flex gap-2 items-center">
                <span className="text-sm">Connect</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {ready && isGuest && (
        <p className="text-[10px] text-[#19B1D2] text-right mt-1">
          Guest mode — evidence still saved onchain
        </p>
      )}

      <WalletModal />

      <DisconnectModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        onDisconnect={async () => {
          await disconnectWallet();
          setShowDisconnectModal(false);
        }}
        address={address}
      />
    </>
  );
}

export default ConnectButtonComponent;