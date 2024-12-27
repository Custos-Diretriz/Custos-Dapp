import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import ValidateAgreementModal from "./validateAgreement";
import SignAgreementModal from "./signagreementmodal";
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import parse from 'html-react-parser';
import { byteArrayToString, hexTimestampToFormattedDate, numberToHex, padAddress } from "@/utils/serializer";
import { WalletContext } from "@/components/walletprovider";
import { useNotification } from "@/context/NotificationProvider";
import { provider, UseWriteToContract } from "@/utils/fetchcontract";


const detectContentFormat = (content) => {
  if (content.startsWith("<") || content.includes("<html ")) {
    return "html";
  } else if (content.includes("**") || content.includes("#")) {
    return "markdown";
  } else {
    return "text";
  }
};

const renderContent = (content) => {
  const contentFormat = detectContentFormat(content);
  switch (contentFormat) {
    case "html":
      const cleanHtml = DOMPurify.sanitize(content);
      return parse(cleanHtml);
    case "markdown":
      return <ReactMarkdown>{content}</ReactMarkdown>;
    default:
      return <span>{content}</span>;
  }
};

export const AgreementCard = ({
  agreement,
  printAgreement,
  toggleSignModal,
}) => {


  const router = useRouter();  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(false)
  const { address } = useContext(WalletContext);
  const { openNotification } = useNotification();

  const { writeToContract, isLoading, isError } = UseWriteToContract();




  const handleCardClick = () => {
    
      router.push(`/agreement/onchain/${agreement.id}/`);
   
  };

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      if (!writeToContract) {
        throw new Error("writeToContract function is not available");
      }

      const params = [
        
        agreement.id,
      ];
      console.log("Parameters for createAgreement:", params);
      if (params.some((param) => param == null)) {
        throw new Error("One or more parameters are null or undefined");
      }
      const result = await writeToContract(
        "agreement",
        "validate_agreement",
        params
      );

      const txReceipt = await provider.waitForTransaction(
        result.transaction_hash
      );
      // let agreement_id;
      // if (txReceipt.isSuccess()) {
      //   const events = txReceipt.events;
      //   console.log("All events:", events);

      //   agreement_id = events[0].keys[1];
      //   agreement_id = hexToNumber(agreement_id);
      //   console.log(agreement_id);
      //   console.log("agreement_id", agreement_id);
      // }

      if (result && result.transaction_hash) {
        setIsValidating(false);
        // const formData = new FormData();
        // formData.append("agreement_id", agreement_id);

        // Construct the URL with the access_token as a query parameter
        // const url = `https://custosbackend.onrender.com/agreement/agreement/update_by_access_token/?access_token=${encodeURIComponent(
        //   agreement.access_token
        // )}`;

        // const response = await fetch(url, {
        //   method: "DELETE",
        //   body: formData,
        // });

        // if (true) {
        //   setIsSuccess(true);

          openNotification("success", "Agreement validation Success", "");
        // } else {
        //   openNotification(
        //     "error",
        //     "",
        //     "Failed to update agreement validation status"
        //   );
        //   throw new Error("Failed to update agreement validation status");
        // }
      } else {
        setIsValidating(false);
        openNotification("error", "", "Agreement Validation failed");
        throw new Error("Transaction hash not received");
      }
    } catch (err) {
      openNotification("error", "", "Contract interaction failed");
      console.error("Contract interaction failed", err);
      setIsSuccess(false);
      setIsValidating(false);
    } finally {
      setIsValidating(false);
    }
  };

  // validate_agreement

  // console.log("fetchedagrrement", agreement);

  return (
    <>
      <div
        
        className="p-3 text-base space-y-[1em] flex flex-col justify-between bg-gradient-to- border-gradient2 bg-[#97c7fe09] h-[20em] backdrop-blur-sm  text-transparent rounded-[1em] relative w-full cursor-pointer"
      >
        <div 
        onClick={handleCardClick}
        className="relative border-[#43b2ea38] h-[80%] overflow-clip flex flex-col gap-0 backdrop-blur-sm shadow-2xl border-[0.01px] rounded-lg p-2 items-start w-full">
          <div className="w-full flex justify-between">
            <h2 className="text-[16px] box w-fit flex text-wrap font-bold bg-gradient-to-r br  px-[16px] py-[8px] from-[#19B1D2] to-[#0094FF] bg-clip-text text-transparent">
              {byteArrayToString(agreement.agreement_title)}
            </h2>
          </div>
          <div className="br w-[75%] overflow-hidden flex px-4 font-bold min-h-[4em] max-h-[4em] text-[10px] text-[#f3f2f294] whitespace-nowrap border-gradient2">
            <p className="py-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
              Second Party Address: {numberToHex(agreement.second_party_address)}
            </p>
          </div>
          <div className="w-fit font-bold flex items-start justify-start text-left space-x-0 text-[0.7em] text-white text-nowrap mt-4 mb-4">
            Time Stamp :
            <span className="text-center align-middle font-bold bg-gradient-to-r from-[#19B1D2] to-[#0094FF] bg-clip-text text-transparent">
              {hexTimestampToFormattedDate(agreement.timestamp)}
            </span>
          </div>
          <div className="text-wrap w-fit text-white">
            <p className="max-h-[8em] overflow-hidden font-bold text-[0.7em] text-left">
              {renderContent(byteArrayToString(agreement.content))}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center w-full ">
          <button
            onClick={(e) => {
              e.stopPropagation();
              printAgreement(agreement);
            }}
          >
            <div className="button-transition">
              <img
                src="./PrintAgreement.png"
                width={"80%"}
                alt="C"
              />
            </div>
          </button>

          {padAddress(numberToHex(agreement.creator)) !== address ? (
            <button
              onClick={handleValidate}
              disabled={
                agreement.validate_signature
              }
              className={`w-fit px-2 py-2 text-white rounded-[2em] border-slate-800 shadow-lg transform hover:scale-105 transition-transform duration-300 border-gradient bg-opacity-50 backdrop-filter backdrop-blur-lg flex items-center justify-center relative text-[0.8em] ${
                
                agreement.validate_signature
                  ? " opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {agreement.validate_signature? isValidating ? ' Validating' : 'Validate Agreement' : 'Validated'}
            </button>
          ) : (
            <button
              // onClick={handleSignClick}
              disabled={true}
              className={`w-fit px-2 py-2 text-white rounded-[2em] border-slate-800 shadow-lg transform hover:scale-105 transition-transform duration-300 border-gradient2 bg-opacity-50 backdrop-filter backdrop-blur-lg flex items-center justify-center relative text-[0.8em] ${
                !agreement.second_party_signature
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-not-allowed opacity-50"
              }`}
            >
              {agreement.validated ? 'validated' : 'Awaiting Approval' }
            </button>
          )}
        </div>
      </div>

    </>
  );
};

export const PendingAgreementCard = ({
  agreement,
  printAgreement,
  toggleSignModal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);

  const router = useRouter();
  const formattedDate = format(
    new Date(agreement.created_at),
    "EEEE, do MMMM yyyy. hh:mm:ss aaaa"
  );

  const handleCardClick = () => {
    if (agreement.access_token) {
      router.push(`/agreement/access_token/${agreement.access_token}`);
    } else {
      router.push(`/agreement/id/${agreement.id}`);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (agreement?.access_token) {
      router.push(`/agreement/access_token/${agreement?.access_token}/edit`);
    } else {
      router.push(`/agreement/${agreement.id}/edit`);
    }
  };

  const handleValidateClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleSignClick = (e) => {
    e.stopPropagation();
    setIsSignModalOpen(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="p-3 text-base space-y-[1em] flex flex-col justify-between bg-gradient-to- border-gradient2 bg-[#97c7fe09] backdrop-blur-sm  text-transparent rounded-[1em] relative w-full cursor-pointer"
      >
        <div className="relative border-[#43b2ea38] min-h-[70%] max-h-[70%] overflow-clip flex flex-col gap-0 backdrop-blur-sm shadow-2xl border-[0.01px] rounded-lg p-2 items-start w-full">
          <div className="w-full flex justify-between">
            <h2 className="text-[16px] box w-fit flex text-wrap font-bold bg-gradient-to-r br  px-[16px] py-[8px] from-[#19B1D2] to-[#0094FF] bg-clip-text text-transparent">
              {agreement.agreementType}
            </h2>
            {agreement.access_token && (
              <Image
                src={"/pencil-edit.svg"}
                height={24}
                width={24}
                alt="edit"
                onClick={handleEditClick}
                className="cursor-pointer"
              />
            )}
          </div>
          <div className="br w-[75%] overflow-hidden flex px-4 font-bold min-h-[4em] max-h-[4em] text-[10px] text-[#f3f2f294] whitespace-nowrap border-gradient2">
            <p className="py-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
              Second Party Address: {agreement.second_party_address}
            </p>
          </div>
          <div className="w-fit font-bold flex items-start justify-start text-left space-x-0 text-[0.7em] text-white text-nowrap mt-4 mb-4">
            Time Stamp :
            <span className="text-center align-middle text-wrap font-bold bg-gradient-to-r from-[#19B1D2] to-[#0094FF] bg-clip-text text-transparent">
              {formattedDate}
            </span>
          </div>
          <div className="text-wrap w-fit text-white">
            <p className="max-h-[8em] overflow-hidden font-bold text-[0.7em] text-left">
              {renderContent(agreement.content)}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center w-full ">
          <button
            onClick={(e) => {
              e.stopPropagation();
              printAgreement(agreement);
            }}
          >
            <div className="button-transition">
              <img
                src="./PrintAgreement.png"
                width={"80%"}
                alt="Connect Wallet"
              />
            </div>
          </button>

          {agreement.access_token ? (
            <button
              onClick={handleValidateClick}
              disabled={
                !agreement.second_party_signature ||
                agreement.agreement_id !== null
              }
              className={`w-fit px-4 py-2 text-white rounded-[2em] border-slate-800 shadow-lg transform hover:scale-105 transition-transform duration-300 border-gradient2 bg-opacity-50 backdrop-filter backdrop-blur-lg flex items-center justify-center relative text-[1em] md:text-[0.8em] sm:text-[0.7em] ${
                !agreement.second_party_signature ||
                agreement.agreement_id !== null
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Validate Agreement
            </button>
          ) : (
            <button
              onClick={handleSignClick}
              disabled={agreement.second_party_signature != null || undefined}
              className={`w-fit px-2 py-2 text-white rounded-[2em] border-slate-800 shadow-lg transform hover:scale-105 transition-transform duration-300 border-gradient2 bg-opacity-50 backdrop-filter backdrop-blur-lg flex items-center justify-center relative text-[0.8em] ${
                !agreement.second_party_signature
                  ? ""
                  : "cursor-not-allowed opacity-50"
              }`}
            >
              Sign Agreement
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ValidateAgreementModal
          fullname={agreement.second_party_fullname}
          agreementId={agreement.id}
          agreementToken={agreement.access_token}
          onClose={() => setIsModalOpen(false)}
          agreement={agreement}
        />
      )}

      {isSignModalOpen && (
        <SignAgreementModal
          fullname={agreement.second_party_fullname}
          agreementId={agreement.id}
          onClose={() => setIsSignModalOpen(false)}
        />
      )}
    </>
  );
};
