import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import ValidateAgreementModal from "./validateAgreement";
import SignAgreementModal from "./signagreementmodal";
import { PrinterIcon } from "@heroicons/react/outline";
import { cn } from "../../../lib/utils";
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import parse from 'html-react-parser';
import { byteArrayToString, hexTimestampToFormattedDate, numberToHex, padAddress } from "../../../utils/serializer";
import { WalletContext } from "../../../components/walletprovider";
import { useNotification } from "../../../context/NotificationProvider";
import { provider, UseWriteToContract } from "../../../utils/fetchcontract";


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

const truncateMiddle = (value, lead = 10, tail = 8) => {
  const str = String(value ?? "");
  return str.length > lead + tail + 1
    ? `${str.slice(0, lead)}…${str.slice(-tail)}`
    : str;
};

export const CardActionButton = ({ children, className, ...props }) => (
  <button
    type="button"
    className={cn(
      "border-gradient2 inline-flex h-10 w-full items-center justify-center rounded-full bg-white/[0.04] px-4 text-xs font-medium text-white",
      "transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100",
      "sm:w-auto sm:text-sm",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

/**
 * One card layout for both onchain and pending agreements: fluid height,
 * clamped excerpt, and a footer that stacks on narrow screens instead of
 * squeezing the action button.
 */
export const AgreementCardShell = ({
  title,
  counterparty,
  timestamp,
  content,
  onOpen,
  onPrint,
  onEdit,
  action,
}) => (
  <article className="border-gradient2 relative flex w-full flex-col rounded-2xl bg-[#97c7fe09] p-3 backdrop-blur-sm sm:p-4">
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.();
        }
      }}
      className="flex flex-1 cursor-pointer flex-col gap-3 rounded-xl border-[0.5px] border-[#43b2ea38] p-3 text-left transition-colors hover:border-[#43b2ea70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="min-w-0 break-words bg-gradient-to-r from-[#19B1D2] to-[#0094FF] bg-clip-text text-base font-bold text-transparent">
          {title}
        </h2>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit agreement"
            className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors hover:bg-white/10"
          >
            <Image src="/pencil-edit.svg" height={18} width={18} alt="" />
          </button>
        )}
      </div>

      <p
        className="truncate rounded-lg bg-white/[0.04] px-3 py-2 font-mono text-[11px] text-[#f3f2f2b0]"
        title={String(counterparty ?? "")}
      >
        <span className="text-[#8E9A9A]">Second party: </span>
        {truncateMiddle(counterparty)}
      </p>

      <p className="text-[11px] font-semibold text-white">
        <span className="text-[#8E9A9A]">Time stamp: </span>
        <span className="bg-gradient-to-r from-[#19B1D2] to-[#0094FF] bg-clip-text text-transparent">
          {timestamp}
        </span>
      </p>

      <div className="agreement-card-excerpt line-clamp-4 break-words text-xs leading-relaxed text-[#cfd8da]">
        {content}
      </div>
    </div>

    <div className="mt-3 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrint?.();
        }}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 text-xs text-[#EAFBFF] transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70 sm:text-sm"
      >
        <PrinterIcon className="h-4 w-4 shrink-0" aria-hidden />
        Print
      </button>
      {action}
    </div>
  </article>
);

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
        // const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/agreement/agreement/update_by_access_token/?access_token=${encodeURIComponent(
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
    <AgreementCardShell
      title={byteArrayToString(agreement.agreement_title)}
      counterparty={numberToHex(agreement.second_party_address)}
      timestamp={hexTimestampToFormattedDate(agreement.timestamp)}
      content={renderContent(byteArrayToString(agreement.content))}
      onOpen={handleCardClick}
      onPrint={() => printAgreement(agreement)}
      action={
        padAddress(numberToHex(agreement.creator)) !== address ? (
          <CardActionButton
            onClick={handleValidate}
            disabled={agreement.validate_signature}
          >
            {agreement.validate_signature
              ? isValidating
                ? "Validating"
                : "Finalized"
              : "Validated"}
          </CardActionButton>
        ) : (
          <CardActionButton disabled>
            {agreement.validated
              ? !agreement.validate_signature
                ? "Awaiting Approval"
                : "Finalized"
              : "Finalized"}
          </CardActionButton>
        )
      }
    />
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
      <AgreementCardShell
        title={agreement.agreementType}
        counterparty={agreement.second_party_address}
        timestamp={formattedDate}
        content={renderContent(agreement.content)}
        onOpen={handleCardClick}
        onPrint={() => printAgreement(agreement)}
        onEdit={agreement.access_token ? handleEditClick : undefined}
        action={
          agreement.access_token ? (
            <CardActionButton
              onClick={handleValidateClick}
              disabled={
                !agreement.second_party_signature ||
                agreement.agreement_id !== null
              }
            >
              Validate Agreement
            </CardActionButton>
          ) : (
            <CardActionButton
              onClick={handleSignClick}
              disabled={agreement.second_party_signature != null}
            >
              Sign Agreement
            </CardActionButton>
          )
        }
      />

      {isModalOpen && (
        <ValidateAgreementModal
          fullname={agreement?.second_party_fullname}
          agreementId={agreement?.id}
          agreementToken={agreement?.access_token}
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
