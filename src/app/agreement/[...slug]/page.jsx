"use client";
import React, { useContext, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import Slugnav from "../components/slugnav";
import { format } from "date-fns";
import Image from "next/image";
import { useNotification } from "../../../context/NotificationProvider";
import Loading from "../../../components/loading";
import { WalletContext } from "../../../components/walletprovider";
import { UseReadContractData } from "../../../utils/fetchcontract";
import {
  byteArrayToString,
  hexTimestampToFormattedDate,
  numberToHex,
} from "../../../utils/serializer";
import { CHAIN_TYPES } from "../../../lib/chains";
import { getAgreementDetails, verifyContent } from "../../../utils/evmAgreement";

// Remove markdown editor imports and use ReactQuill instead
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const truncateMiddle = (value, lead = 10, tail = 8) => {
  const str = String(value ?? "");
  return str.length > lead + tail + 1
    ? `${str.slice(0, lead)}…${str.slice(-tail)}`
    : str;
};

const AgreementSlug = ({ params }) => {
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState({});
  // Force content format to HTML now that we got ReactQuill
  const [contentFormat, setContentFormat] = useState("html");
  const [contentVerified, setContentVerified] = useState(null);

  const { openNotification } = useNotification();
  const { address, selectedChain } = useContext(WalletContext);
  const { fetchData } = UseReadContractData();

  const slug = params?.slug || [];
  const [key, value] = slug;
  const isOnchain = key === "onchain";

  useEffect(() => {
    if (key === "access_token") {
      setAccessToken(value || params?.agreementAccessToken);
      fetchAgreementByAccessToken(value);
    } else if (key === "onchain") {
      getOnchainAgreement(value);
    } else {
      fetchAgreementById(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value, selectedChain?.key]);

  // ------------------------------------------------------------------
  // Backend reads
  // ------------------------------------------------------------------

  const fetchAgreementById = async (agreementId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/agreement/agreement/${agreementId}/`
      );
      if (response.ok) {
        const data = await response.json();
        setAgreement(data);
        initializeEditableFields(data);
      } else {
        console.error("Failed to fetch agreement by ID");
        openNotification("error", "", "Failed to fetch agreement by ID");
      }
    } catch (error) {
      console.error("Error fetching agreement by ID:", error);
      openNotification("error", "Error fetching agreement by ID", `${error}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgreementByAccessToken = async (token) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/agreement/agreement/access_token/?access_token=${token}`
      );
      if (response.ok) {
        const data = await response.json();
        setAgreement(data);
        initializeEditableFields(data);
      } else {
        console.error("Failed to fetch agreement by access token");
        openNotification(
          "error",
          "",
          "Failed to fetch agreement by access token"
        );
      }
    } catch (error) {
      console.error("Error fetching agreement by access token:", error);
      openNotification(
        "error",
        "Error fetching agreement by access token",
        `${error}`
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // Onchain read
  // ------------------------------------------------------------------

  const getOnchainAgreement = async (id) => {
    setLoading(true);
    setContentVerified(null);
    try {
      if (selectedChain?.type === CHAIN_TYPES.EVM) {
        const onchain = await getAgreementDetails({
          chain: selectedChain,
          agreementId: id,
        });

        // content lives in the backend now — the chain holds only its hash
        let content = "";
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/agreement/agreement/by_agreement_id/?agreement_id=${id}`
          );
          if (res.ok) content = (await res.json())?.content || "";
        } catch (e) {
          console.warn("Could not load agreement content:", e?.message);
        }

        if (content) {
          try {
            setContentVerified(
              await verifyContent({
                chain: selectedChain,
                agreementId: id,
                content,
              })
            );
          } catch (e) {
            console.warn("Verification unavailable:", e?.message);
          }
        }

        setAgreement({
          onchain: true,
          agreementType: onchain.agreement_title,
          second_party_address: onchain.second_party_address,
          first_party_address: onchain.creator,
          first_party_id_hash: onchain.first_party_id_hash,
          second_party_id_hash: onchain.second_party_id_hash,
          content_hash: onchain.content_hash,
          validate_signature: onchain.validate_signature,
          content,
          created_at: onchain.timestamp, // ms since epoch
        });
      } else {
        const d = await fetchData("agreement", "get_agreement_details", [id]);
        setAgreement({
          onchain: true,
          starknet: true,
          agreementType: byteArrayToString(d.agreement_title),
          second_party_address: numberToHex(d.second_party_address),
          first_party_address: numberToHex(d.creator),
          first_party_valid_id: byteArrayToString(d.first_party_valid_id),
          second_party_valid_id: byteArrayToString(d.second_party_valid_id),
          content: byteArrayToString(d.content),
          created_at: hexTimestampToFormattedDate(d.timestamp),
        });
      }

      setContentFormat("html");
    } catch (error) {
      openNotification("error", "Error fetching agreement details", `${error}`);
      console.error("Error fetching agreement details:", error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // Editing (backend agreements only)
  // ------------------------------------------------------------------

  const initializeEditableFields = (data) => {
    setEditableFields({
      content: data?.content,
      email: data?.email,
      first_party_country: data?.first_party_country,
      first_party_id_type: data?.first_party_id_type,
    });
    setContentFormat("html"); // ensure rich HTML editing
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    setLoading(true);
    openNotification("info", "saving agreement..");
    try {
      const formData = new FormData();
      Object.entries(editableFields).forEach(([field, val]) => {
        if (val !== null && val !== "") {
          formData.append(field, val);
        }
      });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/agreement/agreement/update_by_access_token/?access_token=${accessToken}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const updatedAgreement = await response.json();
        openNotification("success", "Agreement updated successfully");
        setAgreement(updatedAgreement);
        setIsEditing(false);
      } else {
        console.error("Failed to save edited agreement");
        openNotification("error", "", "Failed to save edited agreement");
      }
    } catch (error) {
      console.error("Error saving edited agreement:", error);
      openNotification("error", "Error saving edited agreement", `${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditableFields((prev) => ({ ...prev, [field]: value }));
  };

  // ------------------------------------------------------------------
  // Render helpers
  // ------------------------------------------------------------------

  // Use DOMPurify to sanitize HTML and render the content
  const renderContent = (content) => {
    if (!content) {
      return (
        <span className="text-[#8E9A9A]">
          No content available for this agreement.
        </span>
      );
    }
    return (
      <div
        className="agreement-content-wrapper"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      />
    );
  };

  function formatDate(date) {
    if (!date) return "Unknown";
    const d = new Date(date);
    return Number.isNaN(d.getTime())
      ? String(date)
      : format(d, "EEEE, do MMMM yyyy. hh:mm:ss aaaa");
  }

  if (loading) {
    return (
      <div className="text-[#EAFBFF] flex justify-center items-center h-screen">
        <Loading text={`Loading Agreement from  Blockchain...`} />
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="text-[#EAFBFF] flex justify-center items-center h-screen">
        Agreement not found
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#EAFBFF] w-full overflow-x-clip flex flex-col">
      <Slugnav agreement={agreement} />
      <div className="p-4 rounded-lg shadow-lg bg-gradient-to-r w-full">
        <div className="w-full flex max-lg:flex-col header align-baseline justify-start gap-4 mb-8">
          <div className="w-full px-3 max-md:px-0">
            <span className="text-sm">Agreement Type</span>
            <span className="text-[0.8em] mt-2 w-fit flex text-wrap font-bold bg-gradient-to-r br border-slate-800 px-2 py-[0.8em] border border-gradient from-[#19B1D2] to-[#0094FF] bg-clip-text text-transparent">
              {agreement?.agreementType}
            </span>
          </div>

          <div className="w-full px-3 max-md:px-0">
            <span className="text-sm">Second Party Address</span>
            <span className="br w-fit mt-2 overflow-hidden flex border-slate-800 px-2 py-[0.8em] border border-gradient text-[0.7em] text-[#9B9292] whitespace-nowrap overflow-ellipsis">
              {agreement?.second_party_address}
            </span>
          </div>
          <div className="flex-col w-full items-end text-end gap-3 flex">
            {accessToken && (
              <div
                className="w-full gap-2 flex items-center justify-end max-lg:justify-start cursor-pointer"
                onClick={isEditing ? handleSave : handleEditClick}
              >
                <span className="bg-gradient-to-r from-[#19B1D2] to-[#0094FF] text-[1.2em] bg-clip-text text-transparent">
                  {isEditing ? "Save Agreement" : "Edit Agreement"}
                </span>
                <Image
                  src={isEditing ? "/upload.svg" : "/edit-blue.svg"}
                  alt={isEditing ? "Save Icon" : "Edit Icon"}
                  width={20}
                  height={20}
                />
              </div>
            )}
            <div className="w-full flex flex-col lg:flex-row gap-2 justify-end max-lg:items-start">
              <span className="flex-shrink-0 text-sm">Time Stamp:</span>
              <span className="bg-gradient-to-r from-[#19B1D2] to-[#0094FF] bg-clip-text text-left text-transparent">
                {agreement?.starknet
                  ? agreement?.created_at
                  : formatDate(agreement?.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* the point of hashing: proof the document is unaltered */}
          {isOnchain && contentVerified !== null && (
            <p
              className={`w-fit rounded-full px-3 py-1 text-xs ${
                contentVerified
                  ? "bg-[#0094FF]/15 text-[#0094FF]"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {contentVerified
                ? `Content verified against ${selectedChain?.name}`
                : "Warning: this content does not match what was anchored onchain"}
            </p>
          )}

          {isOnchain && agreement?.validate_signature && (
            <p className="w-fit rounded-full bg-[#0094FF]/15 px-3 py-1 text-xs text-[#0094FF]">
              Signature validated by the creator
            </p>
          )}

          <div className="flex flex-col gap-2">
            <strong className="text-lg">Content:</strong>
            {isEditing ? (
              <div className="w-full">
                <ReactQuill
                  value={editableFields.content}
                  onChange={(content) => handleInputChange("content", content)}
                  className="w-full p-2 bg-[#091219] text-[#EAFBFF] border border-[#19B1D2] rounded"
                />
              </div>
            ) : (
              <div className="py-4 rounded-lg font-normal text-sm">
                {renderContent(agreement?.content)}
              </div>
            )}
          </div>

          {!isOnchain && (
            <div className="flex flex-col gap-2">
              <strong className="text-lg">Email:</strong>
              {isEditing ? (
                <input
                  type="email"
                  value={editableFields?.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full p-2 bg-[#091219] text-[#EAFBFF] border border-[#19B1D2] rounded"
                />
              ) : (
                <span className="text-sm">{agreement.email || "N/A"}</span>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <strong className="text-lg">First Party Address:</strong>
            <span className="text-sm break-all">
              {agreement?.first_party_address}
            </span>
          </div>

          {/* EVM stores only digests — render those, not a broken image */}
          {agreement?.first_party_id_hash ? (
            <div className="flex flex-col gap-2">
              <strong className="text-lg">First Party ID Fingerprint:</strong>
              <span
                className="w-fit rounded-lg bg-white/[0.04] px-3 py-2 font-mono text-[11px] text-[#9B9292]"
                title={agreement.first_party_id_hash}
              >
                {truncateMiddle(agreement.first_party_id_hash, 14, 10)}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <strong className="text-lg">First Party Valid ID:</strong>
              <Image
                src={agreement?.first_party_valid_id || "/not-found-image.png"}
                alt="First Party ID"
                className="w-[16em] h-[10em] bg-[#091219] object-cover rounded-lg"
                width={100}
                height={100}
              />
            </div>
          )}

          {!isOnchain && (
            <>
              <div className="flex flex-col gap-2">
                <strong className="text-lg">First Party Country:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableFields.first_party_country}
                    onChange={(e) =>
                      handleInputChange("first_party_country", e.target.value)
                    }
                    className="w-full p-2 bg-[#091219] text-[#EAFBFF] border border-[#19B1D2] rounded"
                  />
                ) : (
                  <span className="text-sm">
                    {agreement?.first_party_country || "N/A"}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <strong className="text-lg">First Party ID Type:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableFields.first_party_id_type}
                    onChange={(e) =>
                      handleInputChange("first_party_id_type", e.target.value)
                    }
                    className="w-full p-2 bg-[#091219] text-[#EAFBFF] border border-[#19B1D2] rounded"
                  />
                ) : (
                  <span className="text-sm">
                    {agreement?.first_party_id_type}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <strong className="text-sm">First Party Signature:</strong>
                <Image
                  src={
                    agreement?.first_party_signature || "/not-found-image.png"
                  }
                  alt="First Party Signature"
                  className="w-[16em] h-[10em] bg-white object-cover rounded-lg"
                  width={100}
                  height={100}
                />
              </div>
            </>
          )}

          {agreement?.second_party_id_hash && (
            <div className="flex flex-col gap-2">
              <strong className="text-lg">Second Party ID Fingerprint:</strong>
              <span
                className="w-fit rounded-lg bg-white/[0.04] px-3 py-2 font-mono text-[11px] text-[#9B9292]"
                title={agreement.second_party_id_hash}
              >
                {truncateMiddle(agreement.second_party_id_hash, 14, 10)}
              </span>
            </div>
          )}

          {!isOnchain && (
            <>
              <div className="flex flex-col gap-2">
                <strong className="text-lg">Second Party Address:</strong>
                <span className="text-sm break-all">
                  {agreement.second_party_address}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <strong className="text-lg">Second Party Valid ID:</strong>
                <Image
                  src={
                    agreement?.second_party_valid_id || "/not-found-image.png"
                  }
                  alt="Second Party ID"
                  width={100}
                  height={100}
                  className="w-[16em] h-[10em] bg-white object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <strong className="text-lg">Second Party Country:</strong>
                <span className="text-sm">
                  {agreement.second_party_country || "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <strong className="text-lg">Second Party ID Type:</strong>
                <span className="text-sm">
                  {agreement.second_party_id_type || "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <strong className="text-sm">Second Party Signature:</strong>
                <Image
                  src={
                    agreement?.second_party_signature || "/not-found-image.png"
                  }
                  alt="Second Party Signature"
                  width={100}
                  height={100}
                  className="w-[16em] h-[10em] bg-white object-cover rounded-lg"
                />
              </div>
            </>
          )}

          {isOnchain && agreement?.content_hash && (
            <div className="flex flex-col gap-2 pt-4 border-t border-white/[0.06]">
              <strong className="text-sm text-[#8E9A9A]">
                Content fingerprint (SHA-256):
              </strong>
              <span className="break-all font-mono text-[11px] text-[#9B9292]">
                {agreement.content_hash}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgreementSlug;