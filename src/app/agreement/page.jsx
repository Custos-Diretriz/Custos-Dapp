"use client";
import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import {
  AgreementCard,
  PendingAgreementCard,
} from "./components/agreementcard";
import NoAgreementscreen from "./components/noAgreementscreen";
import AgreementNav from "./components/AgreementNav";
import SignAgreementModal from "./components/signagreementmodal";
import { WalletContext } from "../../components/walletprovider";
// import { UseReadContractData } from "@/utils/fetchcontract";
import agreementAbi from "../../utils/agreementAbi.json";
import { UseReadContractData } from "../../utils/fetchcontract";
import Loading from "../../components/loading";
import { useNotification } from "../../context/NotificationProvider";

function AgreementList() {
  const [loadingAgreements, setLoadingAgreements] = useState(false);
  const [loadingPendingAgreements, setLoadingPendingAgreements] =
    useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [pendingAgreements, setPendingAgreements] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [totalAgreements, setTotalAgreements] = useState([]);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const { address } = useContext(WalletContext);
  console.log("new address", address);

  const [activeTab, setActiveTab] = useState("all");

  const { openNotification } = useNotification();
  const { fetchData } = UseReadContractData();
  useEffect(() => {
    const fetchAgreements = async () => {
      setLoadingAgreements(true);
      try {
        // Ensure fetchData returns an array of promises
        const agreementsDetails = await fetchData(
          "agreement",
          "get_user_agreements",
          [address]
        );
        // Check if agreementsDetails is an array
        if (Array.isArray(agreementsDetails)) {
          setAgreements(agreementsDetails);
          console.log("agreements are", agreementsDetails);
        } else {
          openNotification("error", "", "fetchData did not return an array");
          throw new Error("fetchData did not return an array");
        }
      } catch (error) {
        openNotification(
          "error",
          "Error fetching agreement details",
          `${error}`
        );
        console.error("Error fetching agreement details:", error);
      } finally {
        setLoadingAgreements(false);
      }
    };

    if (address) {
      fetchAgreements();
    }
  }, [address]);

  useEffect(() => {
    const FetchPendingAgreements = async () => {
      setLoadingPendingAgreements(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/agreement/agreement/by_party/?address=${address}`
        );
        const data = await res.json();
        console.log("response::", data);
        setPendingAgreements(data);
      } catch (error) {
        openNotification("error", "Error fetching agreements", `${error}`);
        console.error("Error fetching agreements:", error);
      } finally {
        setLoadingPendingAgreements(false);
      }
    };

    if (address) {
      FetchPendingAgreements();
    } else {
      setPendingAgreements(null);
    }
  }, [address]);

  const printAgreement = (agreement) => {
    const printContent = `
      <h1>${agreement.title}</h1>
      <p>Second Party Address: ${agreement.secondPartyAddress}</p>
      <p>Created by  : ${agreement.creatorName}</p>
      <p>${agreement.content}</p>
    `;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const toggleSignModal = (agreement) => {
    setSelectedAgreement(agreement);
    setShowAgreementModal(!showAgreementModal);
  };

  const renderAgreements = () => {
    if (activeTab === "all") {
      return agreements.length > 0 || pendingAgreements?.length > 0 ? (
        <div className="grid w-full gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {pendingAgreements?.map((agreement, index) => (
            <PendingAgreementCard
              key={index}
              agreement={agreement}
              printAgreement={printAgreement}
              toggleSignModal={toggleSignModal}
            />
          ))}
          {agreements.map((agreement, index) => (
            <AgreementCard
              key={index}
              agreement={agreement}
              printAgreement={printAgreement}
              toggleSignModal={toggleSignModal}
            />
          ))}
        </div>
      ) : (
        <NoAgreementscreen />
      );
    }

    if (activeTab == "pending") {
      const filteredPendingAgreements = pendingAgreements?.filter(
        (agreement) => {
          if (agreement.access_token != null) {
            console.log('agreement with first pt')
            return agreement.second_party_signature == null || agreement.agreement_id == null;
          } else if (agreement.access_token == null) {
            console.log('agreement with sec pt')
            return agreement.agreement_id == null && agreement.second_party_signature == null;
          }
          return false;
        }
      );

      return filteredPendingAgreements?.length > 0 ? (
        <div className="grid w-full gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredPendingAgreements.map((agreement, index) => (
            <PendingAgreementCard
              key={index}
              agreement={agreement}
              printAgreement={printAgreement}
              toggleSignModal={toggleSignModal}
            />
          ))}
        </div>
      ) : (
        <NoAgreementscreen />
      );
    }

    if (activeTab === "signed") {
      const signedAgreements = pendingAgreements?.filter(
        (agreement) => agreement.second_party_signature !== null
      );

      return signedAgreements?.length > 0 ? (
        <div className="grid w-full gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {signedAgreements.map((agreement, index) => (
            <PendingAgreementCard
              key={index}
              agreement={agreement}
              printAgreement={printAgreement}
              toggleSignModal={toggleSignModal}
            />
          ))}
        </div>
      ) : (
        <NoAgreementscreen />
      );
    }

    if (activeTab === "validated") {
      return agreements.length > 0 || pendingAgreements?.length > 0 ? (
        <div className="grid w-full gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {agreements.map((agreement, index) => (
            <AgreementCard
              key={index}
              agreement={agreement}
              printAgreement={printAgreement}
              toggleSignModal={toggleSignModal}
            />
          ))}
        </div>
      ) : (
        <NoAgreementscreen />
      );
    }}

  return (
    <div className="w-full flex flex-col">
      {/* Secondary Navbar */}
      <AgreementNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        text={"Agreement"}
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
