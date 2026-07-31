/* eslint-disable react/no-unescaped-entities */
"use client";
import { useContext, useEffect, useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import useIdentityVerification from "../../../utils/verification";
import { GlobalStateContext } from "../../../context/GlobalStateProvider";
import { useRouter } from "next/navigation";
import { provider, UseWriteToContract } from "../../../utils/fetchcontract";
import Image from "next/image";
import { hexToNumber, stringToByteArray } from "../../../utils/serializer";
import SuccessScreen from "./Success";
import Loading from "../../../components/loading";
import { useNotification } from "../../../context/NotificationProvider";
import { WalletContext } from "../../../components/walletprovider";
import { CHAIN_TYPES } from "../../../lib/chains";
import { createAgreement } from "../../../utils/evmAgreement";

const ValidateAgreementModal = ({
  fullname,
  agreementId,
  agreementToken,
  onClose,
  agreement,
}) => {
  const { verifyIdentity, loading, result, error } = useIdentityVerification();
  const [isPending, setIsPending] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const { globalState, setGlobalState } = useContext(GlobalStateContext);
  const router = useRouter();
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const { writeToContract, isLoading, isError } = UseWriteToContract();
  const { openNotification } = useNotification();

  const { selectedChain } = useContext(WalletContext);
  const { wallets } = useWallets();
  const isEvm = selectedChain?.type === CHAIN_TYPES.EVM;

  const privyWallet =
    wallets?.find((w) => w.walletClientType === "privy") || wallets?.[0] || null;

  /** Tell the backend which onchain id this agreement got. */
  const linkAgreementId = async (id) => {
    const formData = new FormData();
    formData.append("agreement_id", id);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/agreement/agreement/update_by_access_token/?access_token=${encodeURIComponent(
      agreement?.access_token || ""
    )}`;

    const response = await fetch(url, { method: "PUT", body: formData });
    if (!response.ok) throw new Error("Failed to link the onchain agreement");
  };

  // ---------------- EVM ----------------

  const validateEvm = async () => {
    const { agreementId: newId } = await createAgreement({
      chain: selectedChain,
      privyWallet,
      content: agreement?.content || "",
      secondPartyAddress: agreement?.second_party_address,
      firstPartyValidId: agreement?.first_party_valid_id || "",
      secondPartyValidId: agreement?.second_party_valid_id || "",
      agreementTitle: agreement?.agreementType || "",
    });

    if (newId == null) throw new Error("Could not read the new agreement id");
    await linkAgreementId(newId);
  };

  // ---------------- Starknet ----------------

  const validateStarknet = async () => {
    if (!writeToContract) {
      throw new Error("writeToContract function is not available");
    }

    const params = [
      `"${stringToByteArray(agreement?.content || "N/A")}"`,
      agreement?.second_party_address || "N/A",
      `"${stringToByteArray(agreement?.first_party_valid_id || "N/A")}"`,
      `"${stringToByteArray(agreement?.second_party_valid_id || "N/A")}"`,
      `"${stringToByteArray(agreement?.agreementType || "N/A")}"`,
    ];

    const result = await writeToContract(
      "agreement",
      "create_agreement",
      params
    );

    const txReceipt = await provider.waitForTransaction(
      result.transaction_hash
    );

    let newId;
    if (txReceipt.isSuccess()) {
      newId = hexToNumber(txReceipt.events[0]?.keys?.[1]);
    }
    if (newId == null) throw new Error("Could not read the new agreement id");
    await linkAgreementId(newId);
  };

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      if (!agreement?.second_party_address) {
        throw new Error("This agreement has no second party address");
      }

      if (isEvm) await validateEvm();
      else await validateStarknet();

      setIsSuccess(true);
      openNotification("success", "Agreement anchored onchain", "");
    } catch (err) {
      console.error("Contract interaction failed", err);
      openNotification(
        "error",
        "",
        err.shortMessage || err.message || "Contract interaction failed"
      );
      setIsSuccess(false);
    } finally {
      setIsValidating(false);
      setIsResultModalOpen(true);
    }
  };

  const handleContinue = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/agreement/terms_and_condition/`
        );
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        setTermsAndConditions(data[0]?.content || "");
      } catch (error) {
        console.error("Error fetching terms:", error);
        setTermsAndConditions("Failed to load terms and conditions");
      }
    };

    fetchTermsAndConditions();
  }, []);

  return (
    <div className="p-3 h-screen bg-[#00000095] w-full flex items-center justify-center text-white text-transparent rounded-lg absolute left-0 z-50 top-0">
      {loading || isValidating ? (
        <div className="text-center">
          <Loading text="Agreement is being created onchain... please wait" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error}</div>
      ) : (
        <div className="box w-[30%] min-w-[300px]">
          <div className="bo p-4 h-fit rounded-[23px] validate-gradient flex flex-col gap-4">
            <h3 className="text-lg font-bold mb-4">Validate Agreement</h3>

            {currentStep === 1 && (
              <>
                <strong>Second Party's Full Name:</strong>
                <p className="py-2 text-[#9B9292] px-4 border border-[#ffffff46] rounded-lg">
                  {agreement?.second_party_fullname || "N/A"}
                </p>

                <strong>Second Party's ID</strong>
                <div className="py-2 px-4 border border-[#ffffff46] rounded-lg">
                  {agreement?.second_party_valid_id ? (
                    <Image
                      src={agreement.second_party_valid_id}
                      alt="Valid ID"
                      width={200}
                      height={200}
                      className="object-contain"
                      onError={(e) => {
                        e.target.src = "/default-id-placeholder.png";
                      }}
                    />
                  ) : (
                    <span className="text-[#9B9292]">No ID provided</span>
                  )}
                </div>

                <strong>Wallet Address:</strong>
                <p className="py-2 px-4 text-[#9B9292] border border-[#ffffff46] rounded-lg overflow-x-auto scrollbar-hide">
                  {agreement?.second_party_address || "No address provided"}
                </p>
              </>
            )}

            {currentStep === 2 && (
              <>
                <strong>Terms and Conditions</strong>
                <textarea
                  className="w-full p-4 text-[#9B9292] bg-transparent border border-[#ffffff46] rounded-lg"
                  rows="6"
                  readOnly
                  value={termsAndConditions}
                  placeholder="Loading terms and conditions..."
                />
                <p className="text-[11px] text-[#9B9292]">
                  Only a fingerprint of this agreement is written to{" "}
                  {selectedChain?.name}. The document itself stays private.
                </p>
              </>
            )}

            <div className="flex justify-between gap-2">
              <button
                onClick={onClose}
                className="hover:opacity-75 transition-opacity"
              >
                <Image
                  src="/cancleAgreement.png"
                  alt="Cancel"
                  width={170}
                  height={120}
                  className="h-auto"
                />
              </button>

              {currentStep === 2 ? (
                <button
                  onClick={handleValidate}
                  disabled={isValidating}
                  className="hover:opacity-75 transition-opacity"
                >
                  <Image
                    src="/FinalValidateButton.png"
                    alt="Validate"
                    width={150}
                    height={120}
                    className="h-auto"
                  />
                </button>
              ) : (
                <button
                  onClick={handleContinue}
                  className="hover:opacity-75 transition-opacity"
                >
                  <Image
                    src="/ContinueAgreement.png"
                    alt="Continue"
                    width={150}
                    height={40}
                    className="h-auto"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isResultModalOpen && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <SuccessScreen
            onClose={() => {
              setIsResultModalOpen(false);
              onClose();
            }}
            isSuccess={isSuccess}
            message={
              isSuccess
                ? "Agreement successfully saved onchain!"
                : "Failed to save agreement. Please try again."
            }
          />
        </div>
      )}
    </div>
  );
};

export default ValidateAgreementModal;