"use client";
import React, { useContext, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import Slugnav from "../components/slugnav";
import { format } from "date-fns";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";
import mammoth from "mammoth";
import { useNotification } from "@/context/NotificationProvider";
import Loading from "@/components/loading";
import { WalletContext } from "@/components/walletprovider";
import { UseReadContractData } from "@/utils/fetchcontract";
import {
  byteArrayToString,
  hexTimestampToFormattedDate,
  numberToHex,
} from "@/utils/serializer";
// import { useNotification } from "@/contexts/NotificationContext";

const AgreementSlug = ({ params }, agreementparam) => {
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState({});
  const [contentFormat, setContentFormat] = useState("plain");
  const { openNotification } = useNotification();
  const router = useRouter();
  const { address } = useContext(WalletContext);
  const slug = params?.slug || [];
  const [key, value] = slug;

  useEffect(() => {
    if (key === "access_token") {
      setAccessToken(value || params?.agreementAccessToken);

      fetchAgreementByAccessToken(value);
    } else if (key == "onchain") {
      console.log("here at last");
      getOnchainAgreement(value);
    } else {
      fetchAgreementById(value);
    }
  }, [key, value]);

  const fetchAgreementById = async (agreementId) => {
    // console.log(agreementId);

    try {
      const response = await fetch(
        `https://custosbackend.onrender.com/agreement/agreement/${agreementId}/`
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
        `https://custosbackend.onrender.com/agreement/agreement/access_token/?access_token=${token}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);

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
        "Error feching agreement by access token",
        `${error}`
      );
    } finally {
      setLoading(false);
    }
  };

  const { fetchData } = UseReadContractData();

  const detectContentFormat = (content) => {
    if (content.startsWith("<") || content.includes("<html ")) {
      return "html";
    } else if (content.includes("**") || content.includes("#")) {
      return "markdown";
    } else {
      return "text";
    }
  };
  const getOnchainAgreement = async (id) => {
    setLoading(true);
    try {
      // Fetch on-chain agreement details
      const agreementsDetails = await fetchData(
        "agreement",
        "get_agreement_details",
        [id]
      );

      // Process and transform the on-chain data
      const transformedAgreement = {
        agreementType: byteArrayToString(agreementsDetails.agreement_title),
        second_party_address: numberToHex(
          agreementsDetails.second_party_address
        ),
        first_party_address: numberToHex(agreementsDetails.creator),
        first_party_valid_id: byteArrayToString(
          agreementsDetails.first_party_valid_id
        ),
        second_party_valid_id: byteArrayToString(
          agreementsDetails.second_party_valid_id
        ),
        content: byteArrayToString(agreementsDetails.content),
        created_at: hexTimestampToFormattedDate(agreementsDetails.timestamp),
      };

      setContentFormat(detectContentFormat(transformedAgreement.content));
      setAgreement(transformedAgreement);
    } catch (error) {
      openNotification("error", "Error fetching agreement details", `${error}`);
      console.error("Error fetching agreement details:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeEditableFields = (data) => {
    setEditableFields({
      content: data?.content,
      email: data?.email,
      first_party_country: data?.first_party_country,
      first_party_id_type: data?.first_party_id_type,
    });
    setContentFormat(detectContentFormat(data?.content));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(!true);

    try {
      const formData = new FormData();
      Object.entries(editableFields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(
        `https://custosbackend.onrender.com/agreement/agreement/update_by_access_token/?access_token=${accessToken}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const updatedAgreement = await response.json();
        setAgreement(updatedAgreement);
        setIsEditing(false);
      } else {
        console.error("Failed to save edited agreement");
        openNotification("error", "", "Failed to save edited agreement");
      }
    } catch (error) {
      console.error("Error saving edited agreement:", error);
      openNotification("error", "Error saving edited agreement", `${error}`);
    }
  };

  const handleInputChange = (field, value) => {
    setEditableFields((prev) => ({ ...prev, [field]: value }));
  };

  const renderContent = (content) => {
    const ContentWrapper = ({ children }) => (
      <div className="agreement-content-wrapper">{children}</div>
    );

    switch (contentFormat) {
      case "html":
        const cleanHtml = DOMPurify.sanitize(content);
        return <ContentWrapper>{parse(cleanHtml)}</ContentWrapper>;
      case "markdown":
        return (
          <ContentWrapper>
            <ReactMarkdown>{content}</ReactMarkdown>
          </ContentWrapper>
        );
      default:
        return <ContentWrapper>{content}</ContentWrapper>;
    }
  };

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

  function formatDate(date) {
    format(new Date(date), "EEEE, do MMMM yyyy. hh:mm:ss aaaa");
  }

  return (
    <div className="space-y-4 text-[#EAFBFF] w-full overflow-clip flex flex-col">
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
                {key == "onchain"
                  ? agreement?.created_at
                  : formatDate(agreement?.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {key == "onchain" ? (
            ""
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <strong className="text-lg">Agreement Title:</strong>
                <span className="text-sm">
                  {/* {agreement.agreement_id || "N/A"} */}
                  <div className="box w-fit p-2">
                    <div className="sh"></div>
                  </div>
                </span>
              </div>
            </>
          )}
          <div className="flex flex-col gap-2">
            <strong className="text-lg">Content:</strong>
            {isEditing ? (
              <div className="w-full">
                <textarea
                  value={editableFields.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  rows="10"
                  className="w-full p-2 bg-[#091219] text-[#EAFBFF] border border-[#19B1D2] rounded"
                />
                <select
                  value={contentFormat}
                  onChange={(e) => setContentFormat(e.target.value)}
                  className="mt-2 w-full p-2 bg-[#091219] text-[#EAFBFF] border border-[#19B1D2] rounded"
                >
                  <option value="plain">Plain Text</option>
                  <option value="html">HTML</option>
                  <option value="markdown">Markdown</option>
                </select>
              </div>
            ) : (
              <div className=" py-4 rounded-lg font-normal text-sm">
                {renderContent(agreement?.content)}
              </div>
            )}
          </div>
          {key == "onchain" ? (
            ""
          ) : (
            <>
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
            </>
          )}
          <div className="flex flex-col gap-2">
            <strong className="text-lg">First Party Address:</strong>
            <span className="text-sm">{agreement?.first_party_address}</span>
          </div>
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
          {key == "onchain" ? (
            ""
          ) : (
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
                  src={agreement?.first_party_signature || "/not-found-image.png"}
                  alt="First Party Signature"
                  className="w-[16em] h-[10em] bg-white object-cover rounded-lg"
                  width={100}
                  height={100}
                />
              </div>
            </>
          )}
          {key == "onchain" ? (
            ""
          ) : (
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
                    value={editableFields?.first_party_id_type}
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
                  src={agreement?.first_party_signature || "/not-found-image.png"}
                  alt="First Party Signature"
                  width={20}
                  height={20}
                  className="w-[16em] h-[10em] bg-white object-cover rounded-lg"
                />
              </div>
            </>
          )}
          <div className="flex flex-col gap-2">
            <strong className="text-lg">Second Party Address:</strong>
            <span className="text-sm">{agreement.second_party_address}</span>
          </div>
          <div className="flex flex-col gap-2">
            <strong className="text-lg">Second Party Valid ID:</strong>
            <span className="text-sm">
              <Image
                src={agreement?.second_party_valid_id || "/not-found-image.png"}
                alt="First Party Signature"
                width={20}
                height={20}
                className="w-[16em] h-[10em] bg-white object-cover rounded-lg"
              />
            </span>
          </div>

          {key == "onchain" ? (
            ""
          ) : (
            <>
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
                  alt="First Party Signature"
                  width={20}
                  height={20}
                  className="w-[16em] h-[10em] bg-white object-cover rounded-lg"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgreementSlug;
