"use client";
import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import {
  AgreementCard,
  PendingAgreementCard,
} from "./components/agreementcard";
import NoAgreementscreen from "./components/noAgreementscreen";
import AgreementNav from "./components/AgreementNav";
import { WalletContext } from "../../components/walletprovider";
import { UseReadContractData } from "../../utils/fetchcontract";
import Loading from "../../components/loading";
import { useNotification } from "../../context/NotificationProvider";
import { CHAIN_TYPES } from "../../lib/chains";
import { getUserAgreements } from "../../utils/evmAgreement";
import {
  byteArrayToString,
  hexTimestampToFormattedDate,
  numberToHex,
} from "../../utils/serializer";

function AgreementList() {
  const [loadingAgreements, setLoadingAgreements] = useState(false);
  const [loadingPendingAgreements, setLoadingPendingAgreements] =
    useState(false);
  const [pendingAgreements, setPendingAgreements] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const { address, selectedChain } = useContext(WalletContext);

  const [activeTab, setActiveTab] = useState("all");

  const { openNotification } = useNotification();
  const { fetchData } = UseReadContractData();

  const isEvm = selectedChain?.type === CHAIN_TYPES.EVM;

  // ---------------- onchain ----------------

  const loadEvm = useCallback(async () => {
    return getUserAgreements({ chain: selectedChain, userAddress: address });
  }, [selectedChain, address]);

  /** Decode Cairo values into the same shape evmAgreement returns. */
  const loadStarknet = useCallback(async () => {
    const raw = await fetchData("agreement", "get_user_agreements", [address]);
    if (!Array.isArray(raw)) return [];

    return raw.map((a) => ({
      id: Number(a.id ?? 0),
      creator: numberToHex(a.creator),
      second_party_address: numberToHex(a.second_party_address),
      agreement_title: byteArrayToString(a.agreement_title),
      content: byteArrayToString(a.content),
      timestamp: a.timestamp,
      validate_signature: a.validate_signature,
      onchain: true,
      starknet: true,
    }));
  }, [fetchData, address]);

  useEffect(() => {
    if (!address) {
      setAgreements([]);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setLoadingAgreements(true);
      try {
        const result = isEvm ? await loadEvm() : await loadStarknet();
        if (!cancelled) setAgreements(result);
      } catch (error) {
        console.error("Error fetching agreement details:", error);
        openNotification(
          "error",
          "Error fetching agreement details",
          error.shortMessage || `${error}`
        );
        if (!cancelled) setAgreements([]);
      } finally {
        if (!cancelled) setLoadingAgreements(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isEvm, selectedChain?.key]);

  // ---------------- backend ----------------

  useEffect(() => {
    if (!address) {
      setPendingAgreements([]);
      return;
    }

    const FetchPendingAgreements = async () => {
      setLoadingPendingAgreements(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/agreement/agreement/by_party/?address=${address}`
        );
        const data = await res.json();
        setPendingAgreements(Array.isArray(data) ? data : []);
      } catch (error) {
        openNotification("error", "Error fetching agreements", `${error}`);
        console.error("Error fetching agreements:", error);
        setPendingAgreements([]);
      } finally {
        setLoadingPendingAgreements(false);
      }
    };

    FetchPendingAgreements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  /**
   * Content isn't onchain anymore — only its hash. The backend row carries
   * the readable document, joined here by the agreement_id it stores.
   */
  const onchainAgreements = useMemo(() => {
    const byId = new Map();
    for (const row of pendingAgreements || []) {
      if (row.agreement_id != null) byId.set(Number(row.agreement_id), row);
    }

    return agreements.map((a) => {
      const row = byId.get(a.id);
      return row
        ? {
            ...a,
            content: a.content ?? row.content,
            access_token: row.access_token,
            second_party_fullname: row.second_party_fullname,
            backendId: row.id,
          }
        : a;
    });
  }, [agreements, pendingAgreements]);

  /** Backend rows already anchored shouldn't render twice. */
  const unanchoredPending = useMemo(
    () => (pendingAgreements || []).filter((a) => a.agreement_id == null),
    [pendingAgreements]
  );

  const printAgreement = (agreement) => {
    const printContent = `
      <h1>${agreement.agreement_title || agreement.agreementType || "Agreement"}</h1>
      <p>Second party: ${agreement.second_party_address || ""}</p>
      <p>Created by: ${agreement.creator || agreement.first_party_address || ""}</p>
      <div>${agreement.content || ""}</div>
    `;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const gridClass =
    "grid w-full gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";

  const renderList = (pending, onchain) =>
    pending.length > 0 || onchain.length > 0 ? (
      <div className={gridClass}>
        {pending.map((agreement, index) => (
          <PendingAgreementCard
            key={`p-${agreement.id ?? index}`}
            agreement={agreement}
            printAgreement={printAgreement}
          />
        ))}
        {onchain.map((agreement, index) => (
          <AgreementCard
            key={`o-${agreement.id ?? index}`}
            agreement={agreement}
            printAgreement={printAgreement}
          />
        ))}
      </div>
    ) : (
      <NoAgreementscreen />
    );

  const renderAgreements = () => {
    if (activeTab === "all") {
      return renderList(unanchoredPending, onchainAgreements);
    }

    if (activeTab === "pending") {
      return renderList(
        unanchoredPending.filter((a) => a.second_party_signature == null),
        []
      );
    }

    if (activeTab === "signed") {
      return renderList(
        unanchoredPending.filter((a) => a.second_party_signature != null),
        []
      );
    }

    if (activeTab === "validated") {
      return renderList([], onchainAgreements);
    }

    return null;
  };

  const tabCounts = {
    all: onchainAgreements.length + unanchoredPending.length,
    pending: unanchoredPending.filter((a) => a.second_party_signature == null)
      .length,
    signed: unanchoredPending.filter((a) => a.second_party_signature != null)
      .length,
    validated: onchainAgreements.length,
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <AgreementNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        text="Agreements"
        counts={tabCounts}
      />

      <div className="w-full">
        {loadingAgreements || loadingPendingAgreements ? (
          <Loading text="Loading Agreements..." />
        ) : (
          renderAgreements()
        )}
      </div>
    </div>
  );
}

export default AgreementList;