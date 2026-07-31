"use client";
import React, { useEffect, useRef, useState } from "react";
import ValidateAgreementModal from "./validateAgreement";
import SignAgreementModal from "./signagreementmodal";
import { printAgreement, downloadAgreement } from "../../../utils/pdfUtils";
import PageHeader from "../../../components/dapps/PageHeader";

const Slugnav = ({ agreement }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const exportRef = useRef(null);

  useEffect(() => {
    if (!showOptions) return;
    const onClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showOptions]);

  const handleValidateClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleSignClick = (e) => {
    e.stopPropagation();
    setIsSignModalOpen(true);
  };

  const canValidate = agreement && agreement.access_token;

  const actionClass =
    "inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0094FF]/70 sm:w-auto";

  return (
    <div className="rounded-2xl bg-gradient-to-t from-[#04080C] to-[#09131A] px-4 py-4 shadow-2xl sm:px-6">
      <PageHeader
        title="Agreement"
        subtitle={agreement?.agreement_title || agreement?.agreementType}
        actions={
          // stacks on phones instead of disappearing below md
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div className="relative w-full sm:w-auto" ref={exportRef}>
              <button
                type="button"
                onClick={() => setShowOptions((s) => !s)}
                aria-expanded={showOptions}
                aria-haspopup="menu"
                className={`${actionClass} border-gradient2 bg-white/[0.04] text-white backdrop-blur-lg hover:bg-white/[0.1]`}
              >
                Export Agreement
              </button>

              {showOptions && (
                <div
                  role="menu"
                  className="absolute right-0 z-30 mt-2 w-full min-w-[12rem] overflow-hidden rounded-xl border border-white/10 bg-[#0B141A] shadow-lg sm:w-48"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      if (agreement) printAgreement(agreement);
                      setShowOptions(false);
                    }}
                    className="block w-full px-4 py-3 text-left text-sm text-[#EAFBFF] transition-colors hover:bg-white/[0.06]"
                  >
                    Print Agreement
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      if (agreement) downloadAgreement(agreement);
                      setShowOptions(false);
                    }}
                    className="block w-full px-4 py-3 text-left text-sm text-[#EAFBFF] transition-colors hover:bg-white/[0.06]"
                  >
                    Download PDF
                  </button>
                </div>
              )}
            </div>

            {canValidate ? (
              <button
                type="button"
                onClick={handleValidateClick}
                disabled={
                  !agreement.second_party_signature ||
                  agreement.validate_signature
                }
                className={`${actionClass} bg-[#0094FF] font-medium text-white hover:bg-[#0b84dc] disabled:cursor-not-allowed disabled:border disabled:border-white/15 disabled:bg-transparent disabled:text-gray-500`}
              >
                {agreement.validate_signature ||
                (agreement.access_token && agreement.second_party_signature)
                  ? "Validate Agreement"
                  : "Validated"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSignClick}
                disabled={
                  agreement &&
                  (agreement.second_party_signature ||
                    agreement.validate_signature)
                }
                className={`${actionClass} bg-[#0094FF] font-medium text-white hover:bg-[#0b84dc] disabled:cursor-not-allowed disabled:border disabled:border-white/15 disabled:bg-transparent disabled:text-gray-500`}
              >
                Sign Agreement
              </button>
            )}
          </div>
        }
      />

      {isModalOpen && agreement && (
        <ValidateAgreementModal
          fullname={agreement.second_party_fullname}
          agreementId={agreement.id}
          agreementToken={agreement.access_token}
          onClose={() => setIsModalOpen(false)}
          agreement={agreement}
        />
      )}

      {isSignModalOpen && agreement && (
        <SignAgreementModal
          fullname={agreement.second_party_fullname}
          agreementId={agreement.id}
          onClose={() => setIsSignModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Slugnav;
