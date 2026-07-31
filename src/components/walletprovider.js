"use client";
import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { InjectedConnector } from "starknetkit/injected";
import { WebWalletConnector } from "starknetkit/webwallet";
import { connect, disconnect } from "starknetkit";
import { RpcProvider } from "starknet";
import { useNotification } from "../context/NotificationProvider";
import { padAddress } from "../utils/serializer";
import {
  CHAINS,
  CHAIN_TYPES,
  DEFAULT_CHAIN,
  DEFAULT_CHAIN_KEY,
  availableChains,
  getChain,
} from "../lib/chains";

export const WalletContext = createContext();

const CHAIN_STORAGE_KEY = "custos:selected-chain";

export const CONNECTION_METHODS = {
  GUEST: "guest",
  PRIVY: "privy",       // all EVM — embedded or external
  STARKNETKIT: "starknetkit", // Starknet only
};

const starknetProvider = new RpcProvider({
  nodeUrl: process.env.NEXT_PUBLIC_BASE_URL,
});

const starknetConnectors = () => [
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
];

export const WalletProvider = ({ children }) => {
  const {
    ready: privyReady,
    authenticated,
    user,
    login: privyLogin,
    logout: privyLogout,
  } = usePrivy();
  const { wallets } = useWallets();

  const [selectedChain, setSelectedChain] = useState(DEFAULT_CHAIN);
  const [switching, setSwitching] = useState(false);
  const [method, setMethod] = useState(CONNECTION_METHODS.GUEST);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  // starknet
  const [wallet, setWallet] = useState(null);
  const [connection, setConnection] = useState(null);
  const [data, setConnectorData] = useState(null);
  const [starknetAddress, setStarknetAddress] = useState("");

  const { openNotification } = useNotification();
  const chains = useMemo(() => availableChains(), []);

  const isEvm = selectedChain.type === CHAIN_TYPES.EVM;

  // Privy's active EVM wallet — embedded first, else the linked external one
  const privyWallet = useMemo(() => {
    if (!wallets?.length) return null;
    return (
      wallets.find((w) => w.walletClientType === "privy") || wallets[0] || null
    );
  }, [wallets]);

  const evmAddress = authenticated && privyWallet ? privyWallet.address : "";

  // the address downstream code attributes evidence to
  const address = isEvm ? evmAddress : starknetAddress;
  const isGuest = !address;

  const isEmbedded = privyWallet?.walletClientType === "privy";
  const loginIdentifier =
    user?.email?.address || user?.phone?.number || user?.google?.email || null;

  // Preferred short label for social logins — Google gives us a full name, so
  // the first name beats the email local-part when it's there.
  const loginName = user?.google?.name?.trim().split(/\s+/)[0] || null;

  // ------------------------------------------------------------------
  // Starknet (starknetkit — preserves the AVNU gasless path)
  // ------------------------------------------------------------------

  const handleStarknetConnect = useCallback(
    (w, notify = true) => {
      if (!w?.account) return;
      setWallet(w);
      setConnection(w.account);
      setConnectorData(w.selectedAddress);
      setStarknetAddress(padAddress(w.selectedAddress));
      setMethod(CONNECTION_METHODS.STARKNETKIT);
      if (notify) {
        openNotification(
          "success",
          "Wallet Connected",
          "Your Starknet wallet is connected."
        );
      }
    },
    [openNotification]
  );

  const clearStarknet = useCallback(async () => {
    try {
      await disconnect();
    } catch (_) {}
    setWallet(null);
    setConnection(null);
    setConnectorData(null);
    setStarknetAddress("");
  }, []);

  const connectStarknet = useCallback(
    async (notify = true) => {
      const { wallet: w } = await connect({
        connectors: starknetConnectors(),
        modalMode: "canAsk",
      });
      if (w) handleStarknetConnect(w, notify);
      return !!w;
    },
    [handleStarknetConnect]
  );

  // ------------------------------------------------------------------
  // EVM (Privy)
  // ------------------------------------------------------------------

  const ensurePrivyChain = useCallback(
    async (chain) => {
      if (!privyWallet) return;
      const current = Number(
        String(privyWallet.chainId).replace("eip155:", "")
      );
      if (current === chain.chainId) return;
      await privyWallet.switchChain(chain.chainId);
    },
    [privyWallet]
  );

  const connectEvm = useCallback(
    async (chain) => {
      if (!privyReady) {
        openNotification("error", "Still loading", "Give it a second and try again.");
        return;
      }
      await clearStarknet();
      if (!authenticated) {
        privyLogin(); // Privy renders its own modal
        return;
      }
      await ensurePrivyChain(chain);
      setMethod(CONNECTION_METHODS.PRIVY);
    },
    [privyReady, authenticated, privyLogin, ensurePrivyChain, clearStarknet, openNotification]
  );

  // keep Privy's network aligned with the selected chain
  useEffect(() => {
    if (!privyReady || !authenticated || !privyWallet || !isEvm) return;
    ensurePrivyChain(selectedChain).catch((e) =>
      console.warn("Privy chain sync skipped:", e?.message)
    );
  }, [
    privyReady,
    authenticated,
    privyWallet,
    isEvm,
    selectedChain,
    ensurePrivyChain,
  ]);

  useEffect(() => {
    if (!privyReady || !authenticated || !isEvm) return;
    if (!privyWallet) {
      console.warn(
        "Privy authenticated but no wallet — enable embedded wallet creation in the Privy dashboard."
      );
    }
  }, [privyReady, authenticated, isEvm, privyWallet]);
  // reflect Privy auth state into `method`
  useEffect(() => {
    if (!privyReady) return;
    if (authenticated && privyWallet && isEvm) {
      setMethod(CONNECTION_METHODS.PRIVY);
    } else if (!authenticated && !starknetAddress) {
      setMethod(CONNECTION_METHODS.GUEST);
    }
  }, [privyReady, authenticated, privyWallet, isEvm, starknetAddress]);

  // ------------------------------------------------------------------
  // Unified API
  // ------------------------------------------------------------------
  useEffect(() => {
    console.log("[privy]", { privyReady, authenticated, wallets: wallets?.length });
  }, [privyReady, authenticated, wallets]);
  
  const openWalletModal = useCallback(() => setWalletModalOpen(true), []);
  const closeWalletModal = useCallback(() => setWalletModalOpen(false), []);

  /**
   * connectWallet(methodKey?) — with no argument it picks by chain:
   * EVM chains go through Privy, Starknet through starknetkit.
   */
  const connectWallet = useCallback(
    async (methodKey) => {
      const target =
        methodKey ||
        (isEvm ? CONNECTION_METHODS.PRIVY : CONNECTION_METHODS.STARKNETKIT);

      // close our modal first so react-modal's focus trap can't fight
      // Privy's dialog for the email/OTP input
      closeWalletModal();

      try {
        if (target === CONNECTION_METHODS.PRIVY) {
          if (!isEvm) {
            const evmChain = chains.find((c) => c.type === CHAIN_TYPES.EVM);
            if (evmChain) {
              setSelectedChain(evmChain);
              localStorage.setItem(CHAIN_STORAGE_KEY, evmChain.key);
            }
            await connectEvm(evmChain || DEFAULT_CHAIN);
          } else {
            await connectEvm(selectedChain);
          }
        } else if (target === CONNECTION_METHODS.STARKNETKIT) {
          if (authenticated) await privyLogout();
          if (isEvm) {
            setSelectedChain(CHAINS.starknet);
            localStorage.setItem(CHAIN_STORAGE_KEY, "starknet");
          }
          await connectStarknet();
        }
      } catch (error) {
        console.error("Connection error:", error);
        openNotification("error", "Connection Failed", error.message);
      }
    },
    [
      isEvm,
      chains,
      selectedChain,
      authenticated,
      privyLogout,
      connectEvm,
      connectStarknet,
      closeWalletModal,
      openNotification,
    ]
  );

  /**
   * Switch chains, keeping the session alive where the stacks allow it.
   *   EVM -> EVM : Privy switches network, session preserved
   *   EVM -> SN  : Privy stays logged in but idle; prompt starknetkit if
   *                the user was connected
   *   SN  -> EVM : disconnect starknetkit; Privy session resumes if present
   * Guests just change chain — nothing to tear down.
   */
  const switchChain = useCallback(
    async (chainKey) => {
      const chain = getChain(chainKey);
      if (!chain || chain.key === selectedChain.key) return;

      const from = selectedChain;
      const wasConnected = !!address;
      setSwitching(true);

      try {
        if (from.type === CHAIN_TYPES.EVM && chain.type === CHAIN_TYPES.EVM) {
          if (authenticated && privyWallet) await ensurePrivyChain(chain);
        } else if (chain.type === CHAIN_TYPES.EVM) {
          await clearStarknet();
          if (authenticated && privyWallet) await ensurePrivyChain(chain);
          setMethod(
            authenticated ? CONNECTION_METHODS.PRIVY : CONNECTION_METHODS.GUEST
          );
        } else {
          // moving to Starknet
          if (wasConnected) {
            const ok = await connectStarknet(false);
            if (!ok) setMethod(CONNECTION_METHODS.GUEST);
          } else {
            setMethod(CONNECTION_METHODS.GUEST);
          }
        }

        setSelectedChain(chain);
        localStorage.setItem(CHAIN_STORAGE_KEY, chain.key);
        openNotification(
          "success",
          "Chain switched",
          `Now recording on ${chain.name}`
        );
      } catch (error) {
        console.error("Switch error:", error);
        openNotification("error", "Switch failed", error.message);
      } finally {
        setSwitching(false);
      }
    },
    [
      selectedChain,
      address,
      authenticated,
      privyWallet,
      ensurePrivyChain,
      clearStarknet,
      connectStarknet,
      openNotification,
    ]
  );

  const disconnectWallet = useCallback(async () => {
    try {
      await clearStarknet();
      if (authenticated) await privyLogout();
      setMethod(CONNECTION_METHODS.GUEST);
      openNotification(
        "success",
        "Disconnected",
        "Recording as guest — evidence is still anchored onchain."
      );
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  }, [authenticated, privyLogout, clearStarknet, openNotification]);

  // ------------------------------------------------------------------
  // Boot: restore chain, silently resume a Starknet session
  // ------------------------------------------------------------------

  useEffect(() => {
    const saved = localStorage.getItem(CHAIN_STORAGE_KEY);
    const chain = saved ? getChain(saved) : DEFAULT_CHAIN;
    setSelectedChain(chain);

    if (chain.type !== CHAIN_TYPES.STARKNET) return;
    (async () => {
      try {
        const { wallet: w } = await connect({
          connectors: starknetConnectors(),
          modalMode: "neverAsk",
        });
        if (w) handleStarknetConnect(w, false);
      } catch (e) {
        console.warn("Starknet silent reconnect skipped:", e?.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WalletContext.Provider
      value={{
        // chain
        selectedChain,
        switchChain,
        switching,
        chains,
        defaultChainKey: DEFAULT_CHAIN_KEY,

        // connection
        method,
        methods: CONNECTION_METHODS,
        ready: privyReady,
        walletModalOpen,
        openWalletModal,
        closeWalletModal,
        connectWallet,
        disconnectWallet,

        // privy detail (for UI copy)
        isEmbedded,
        loginIdentifier,
        loginName,

        // starknet (existing consumers unchanged)
        wallet,
        data,
        connection,
        provider: starknetProvider,

        // unified
        address,
        isGuest,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};