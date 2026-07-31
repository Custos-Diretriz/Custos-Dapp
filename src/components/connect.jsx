"use client";
import React, { useContext } from "react";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar";
import { truncAddress } from "../utils/serializer";
import Image from "next/image";
import { cn } from "../lib/utils";
import { WalletContext } from "./walletprovider";
import DisconnectModal from "./DisconnectModal";
import ChainSelector from "./chainselector";

/** Email/phone → a short handle: "jerydam@gmail.com" becomes "jerydam". */
const shortHandle = (identifier) => {
  if (!identifier) return "";
  const at = identifier.indexOf("@");
  return at > 0 ? identifier.slice(0, at) : identifier;
};

/**
 * @param showChainSelector render the network switcher alongside the pill
 * @param compact           icon-first pill for tight spots (mobile header, collapsed rail)
 * @param full              stretch to the container width (mobile drawer)
 * @param maxLabelChars     hard cap on the social-login handle (sidebar uses 4)
 */
function ConnectButtonComponent({
  showChainSelector = true,
  compact = false,
  full = false,
  maxLabelChars,
}) {
  const {
    address,
    isGuest,
    ready,
    openWalletModal,
    disconnectWallet,
    isEmbedded,
    loginIdentifier,
    loginName,
  } = useContext(WalletContext);
  const [showDisconnectModal, setShowDisconnectModal] = React.useState(false);

  const handle = isEmbedded
    ? loginName || shortHandle(loginIdentifier)
    : "";

  let label;
  if (handle) {
    if (maxLabelChars) {
      label = handle.slice(0, maxLabelChars);
    } else {
      label = handle.length > 14 ? `${handle.slice(0, 12)}…` : handle;
    }
  } else {
    label = truncAddress(address);
  }

  const pillShell = cn(
    "cursor-pointer border-gradient2 rounded-full p-[1px] text-[#ededef]",
    "transition-transform duration-200 active:scale-[0.97]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70",
    full ? "w-full" : "w-auto"
  );

  const pillInner = cn(
    "flex h-11 items-center gap-2 rounded-full bg-[#121212]",
    compact ? "px-2.5" : "px-3.5",
    full && "w-full justify-center"
  );

  return (
    <div className={cn("flex flex-col", full ? "w-full" : "w-auto")}>
      <div
        className={cn(
          "flex items-center gap-2",
          full ? "w-full flex-col items-stretch" : "justify-end"
        )}
      >
        {showChainSelector && <ChainSelector full={full} />}

        <div className={cn("flex min-w-0", full ? "w-full" : "justify-end")}>
          {!ready ? (
            <div
              className={cn(
                "flex h-11 items-center rounded-full bg-[#121212] px-4 text-sm text-[#19B1D2]",
                full && "w-full justify-center"
              )}
            >
              <span className="animate-pulse">Connecting…</span>
            </div>
          ) : !isGuest ? (
            <button
              type="button"
              className={pillShell}
              onClick={() => setShowDisconnectModal(true)}
              aria-label={`Wallet ${label} — open account menu`}
            >
              <span className={pillInner}>
                <Image
                  className="shrink-0 rounded-full"
                  src={generateAvatarURL(address)}
                  alt=""
                  width={24}
                  height={24}
                />
                <span
                  className={cn(
                    "truncate text-sm",
                    compact ? "max-w-[9ch] max-[380px]:hidden" : "max-w-[14ch]"
                  )}
                >
                  {label}
                </span>
              </span>
            </button>
          ) : (
            <button
              type="button"
              className={pillShell}
              onClick={openWalletModal}
              aria-label="Connect a wallet"
            >
              <span className={pillInner}>
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#0094FF]" />
                <span className="whitespace-nowrap text-sm">Connect</span>
              </span>
            </button>
          )}
        </div>
      </div>

      {ready && isGuest && !compact && (
        <p
          className={cn(
            "mt-1 text-[10px] leading-tight text-[#19B1D2]",
            full ? "text-center" : "text-right"
          )}
        >
          Guest mode — evidence still saved onchain
        </p>
      )}

      <DisconnectModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        onDisconnect={async () => {
          await disconnectWallet();
          setShowDisconnectModal(false);
        }}
        address={address}
      />
    </div>
  );
}

export default ConnectButtonComponent;
