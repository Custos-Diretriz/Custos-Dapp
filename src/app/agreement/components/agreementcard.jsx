import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ValidateAgreementModal from "./validateAgreement";
import SignAgreementModal from "./signagreementmodal";
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import parse from 'html-react-parser';

const detectContentFormat = (content) => {
  if (content.startsWith('<')) {
    return 'html';
  } else if (content.includes('**') || content.includes('#')) {
    return 'markdown';
  } else {
    return 'plain';
  }
};

const renderContent = (content) => {
  const contentFormat = detectContentFormat(content);
  switch (contentFormat) {
    case 'html':
      const cleanHtml = DOMPurify.sanitize(content);
      return parse(cleanHtml);
    case 'markdown':
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
  // const formattedDate = format(new Date(agreement[3]), "EEEE, do MMMM yyyy. hh:mm:ss aaaa");

  const handleCardClick = () => {
    router.push(`/agreement/${agreement[0]}`);
  };

  const handleValidateClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <div
      onClick={handleCardClick}
      className="p-3 text-base space-y-[1em] flex flex-col bg-gradient-to-r border-gradient backdrop-blur-2xl from-[#19B1D2] to-[#0094FF] bg-clip-text text-transparent rounded-lg relative w-full cursor-pointer overflow-clip max-h-[30em]"
    >
      <div className="relative border-[#4404245e] h-[220px] overflow-clip flex flex-col gap-4 backdrop-blur-sm shadow-2xl border-[0.01px] rounded-lg p-2 items-start w-full">
        <div className="w-full flex justify-between">
          <h2 className="text-[0.8em] w-fit flex text-wrap font-bold bg-gradient-to-r br border-slate-800 px-2 py-[0.8] border from-[#19B1D2] to-[#0094FF] bg-clip-text text-transparent">
            {agreement[1]}
          </h2>
        </div>
        <div className="br w-[96%] overflow-hidden flex border-slate-800 px-2 py-[0.8] border text-[0.7em] text-[#9B9292] whitespace-nowrap overflow-ellipsis">
          {`Second Party Address: ${agreement[2]}`}
        </div>
        <div className="w-fit flex items-center justify-start space-x-14 text-[1.2em] text-white">
          Time Stamp:{" "}
          <span className="text-[1em] font-bold bg-gradient-to-r from-[#19B1D2] to-[#0094FF] bg-clip-text text-transparent">
            {agreement[3]}
          </span>
        </div>
        <div className="text-wrap w-fit text-white">
          <p className="max-h text-[0.7em]">{agreement[1]}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center w-full m-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            printAgreement(agreement);
          }}
          className="w-fit px-2 py-2 text-white rounded-[2em] shadow-lg transform hover:scale-105 transition-transform duration-300 border-gradient bg-[#0094FF] flex items-center justify-center relative text-[0.8em]"
        >
          Print Agreement
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSignModal();
          }}
          className="w-fit px-2 py-2 text-white rounded-[2em] border-slate-800 shadow-lg transform hover:scale-105 transition-transform duration-300 border-gradient2 bg-opacity-50 backdrop-filter backdrop-blur-lg flex items-center justify-center relative text-[0.8em]"
        >
          Validate Agreement
        </button>
      </div>
    </div>
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
    if (agreement.access_token) {
      router.push(`/agreement/access_token/${agreement.access_token}/edit`);
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
        className="p-3 text-base space-y-[1em] flex flex-col justify-between bg-gradient-to- border-gradient bg-[#97c7fe09] h-[20em] backdrop-blur-sm  text-transparent rounded-[1em] relative w-full cursor-pointer"
      >
        <div className="relative border-[#43b2ea38] h-[80%] overflow-clip flex flex-col gap-4 backdrop-blur-sm shadow-2xl border-[0.01px] rounded-lg p-2 items-start w-full">
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
          <div className="br w-[75%] overflow-hidden flex px-4 font-bold min-h-[4em] max-h-[4em] text-[10px] text-[#f3f2f294] whitespace-nowrap border-gradient">
            <p className="py-2 whitespace-nowrap overflow-hidden overflow-ellipsis">Second Party Address: {agreement.second_party_address}</p>
          </div>
          <div className="w-fit font-bold flex items-center justify-start text-center space-x-14 text-[0.7em] text-white">
            Time Stamp :
            <span className="text-center align-middle font-bold bg-gradient-to-r from-[#19B1D2] to-[#0094FF] bg-clip-text text-transparent">
              {formattedDate}
            </span>
          </div>
          <div className="text-wrap w-fit text-white">
            <p className="max-h-[8em] overflow-hidden font-bold text-[0.7em]">
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
              disabled={!agreement.second_party_signature || agreement.agreement_id !== null}
              className={`w-fit px-2 py-2 text-white rounded-[2em] border-slate-800 shadow-lg transform hover:scale-105 transition-transform duration-300 border-gradient bg-opacity-50 backdrop-filter backdrop-blur-lg flex items-center justify-center relative text-[0.8em] ${
                !agreement.second_party_signature || agreement.agreement_id !== null ? " opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Validate Agreement
            </button>
          ) : (
            <button
              onClick={handleSignClick}
              disabled={agreement.second_party_signature != null || undefined}
              className={`w-fit px-2 py-2 text-white rounded-[2em] border-slate-800 shadow-lg transform hover:scale-105 transition-transform duration-300 border-gradient bg-opacity-50 backdrop-filter backdrop-blur-lg flex items-center justify-center relative text-[0.8em] ${
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
