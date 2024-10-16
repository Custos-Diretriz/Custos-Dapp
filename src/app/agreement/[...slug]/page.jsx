/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import DOMPurify from 'dompurify';
import Slugnav from "../components/slugnav";
import { format } from "date-fns";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import parse from 'html-react-parser';
import { useRouter } from 'next/navigation';
import mammoth from "mammoth";

const Page = ({ params }) => {
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState({});
  const [contentFormat, setContentFormat] = useState('plain');
  const router = useRouter();

  const slug = params?.slug || [];
  const [key, value] = slug;

  useEffect(() => {
    if (key === "access_token") {
      setAccessToken(value || params.agreementAccessToken);
      fetchAgreementByAccessToken(value);
    } else {
      fetchAgreementById(value);
    }
  }, [key, value]);

  const fetchAgreementById = async (agreementId) => {
    try {
      const response = await fetch(`https://custosbackend.onrender.com/agreement/agreement/${agreementId}/`);
      if (response.ok) {
        const data = await response.json();
        setAgreement(data);
        initializeEditableFields(data);
      } else {
        console.error("Failed to fetch agreement by ID");
      }
    } catch (error) {
      console.error("Error fetching agreement by ID:", error);
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
        setAgreement(data);
        initializeEditableFields(data);
      } else {
        console.error("Failed to fetch agreement by access token");
      }
    } catch (error) {
      console.error("Error fetching agreement by access token:", error);
    } finally {
      setLoading(false);
    }
  };

  const detectContentFormat = (content) => {
    if (content.startsWith('<')) {
      return 'html';
    } else if (content.includes('**') || content.includes('#')) {
      return 'markdown';
    } else {
      return 'plain';
    }
  };

  const initializeEditableFields = (data) => {
    setEditableFields({
      content: data.content,
      email: data.email,
      first_party_country: data.first_party_country,
      first_party_id_type: data.first_party_id_type,
    });
    setContentFormat(detectContentFormat(data.content));
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

      const response = await fetch(`https://custosbackend.onrender.com/agreement/agreement/update_by_access_token/?access_token=${accessToken}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedAgreement = await response.json();
        setAgreement(updatedAgreement);
        setIsEditing(false);
      } else {
        console.error('Failed to save edited agreement');
      }
    } catch (error) {
      console.error('Error saving edited agreement:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditableFields(prev => ({ ...prev, [field]: value }));
  };


  const renderContent = (content) => {
    const ContentWrapper = ({ children }) => (
      <div className="agreement-content-wrapper">{children}</div>
    );
  
    switch (contentFormat) {
      case 'html':
        const cleanHtml = DOMPurify.sanitize(content);
        return (
          <ContentWrapper>
            {parse(cleanHtml)}
          </ContentWrapper>
        );
      case 'markdown':
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
    return <div className="text-[#EAFBFF] flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!agreement) {
    return <div className="text-[#EAFBFF] flex justify-center items-center h-screen">Agreement not found</div>;
  }

  const formattedDate = format(
    new Date(agreement?.created_at),
    "EEEE, do MMMM yyyy. hh:mm:ss aaaa"
  );

  return (
    <div className="space-y-4 text-[#EAFBFF] w-full overflow-clip flex flex-col">
      <Slugnav agreement={agreement} />
      <div className="p-4 rounded-lg shadow-lg bg-gradient-to-r w-full">
        <div className="w-full flex header flex-col md:flex-row align-baseline justify-start gap-4 mb-8">
          <div className="w-full px-3">
            <span className="text-sm">Agreement Type</span>
            <span className="text-[0.8em] mt-2 w-fit flex text-wrap font-bold bg-gradient-to-r br border-slate-800 px-2 py-[0.8em] border border-gradient from-[#19B1D2] to-[#0094FF] bg-clip-text text-transparent">
              {agreement.agreementType}
            </span>
          </div>
          <div className="w-full px-3">
            <span className="text-sm">Second Party Address</span>
            <span className="br w-fit mt-2 overflow-hidden flex border-slate-800 px-2 py-[0.8em] border border-gradient text-[0.7em] text-[#9B9292] whitespace-nowrap overflow-ellipsis">
              {agreement.second_party_address}
            </span>
          </div>
          <div className="flex-col w-full items-end text-end gap-3 flex">
            {accessToken && (
              <div
                className="w-full gap-2 flex items-center justify-end cursor-pointer"
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
            <div className="w-full flex flex-col md:flex-row gap-2 justify-end">
              <span className="flex-shrink-0 text-sm">Time Stamp:</span>
              <span className="bg-gradient-to-r from-[#19B1D2] to-[#0094FF] bg-clip-text text-transparent">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <strong className="text-lg">Agreement Title:</strong>
            <span className="text-sm">
              {/* {agreement.agreement_id || "N/A"} */}
              <div className="box w-fit p-2">
                <sh></sh>
                <p className="">Employment Contract Between Custos Direct'z and Mercy</p>
              </div>
            </span>
          </div>
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
                {/* {renderContent(agreement.content)} */}
                Below is a draft of a Non-Disclosure Employment Contract between
                Custos Diretriz and Mercy. This contract includes
                confidentiality, employment terms, and other essential clauses
                to protect both parties' interests. --- ### Non-Disclosure
                Employment Contract **This Employment Agreement** ("Agreement")
                is made and entered into on this [Day] day of [Month], [Year],
                by and between: **Custos Diretriz** [Address] [City, State, Zip
                Code] ("Employer") and **Mercy** [Address] [City, State, Zip
                Code] ("Employee") ### 1. **Employment Terms** 1.1 **Position**:
                The Employer agrees to employ the Employee in the position of
                [Position Title]. 1.2 **Start Date**: The Employee shall
                commence employment on [Start Date]. 1.3 **Duties**: The
                Employee agrees to perform the duties and responsibilities
                assigned by the Employer, including but not limited to [brief
                description of duties]. 1.4 **Compensation**: The Employee will
                receive a salary of [Salary Amount] per [Month/Year], paid
                [Weekly/Bi-weekly/Monthly]. 1.5 **Benefits**: The Employee will
                be eligible for benefits including [list benefits, e.g., health
                insurance, retirement plans, etc.]. ### 2. **Confidential
                Information** 2.1 **Definition**: For the purposes of this
                Agreement, "Confidential Information" shall include any and all
                non-public information, knowledge, or data disclosed to the
                Employee by the Employer, whether oral, written, graphic, or
                electronic, including but not limited to: - Business plans and
                strategies - Financial information - Marketing plans - Product
                designs - Customer and supplier lists - Trade secrets -
                Intellectual property 2.2 **Obligations**: The Employee agrees:
                - Not to disclose Confidential Information to any third party
                without the Employer's written consent. - To use the
                Confidential Information only for the purposes of fulfilling
                their employment duties. - To take all necessary precautions to
                protect the confidentiality of the information. 2.3 **Return of
                Materials**: Upon termination of employment, the Employee agrees
                to return all documents, materials, and property belonging to
                the Employer, including any Confidential Information. ### 3.
                **Intellectual Property** 3.1 **Assignment**: The Employee
                agrees that any work product, inventions, designs, or
                developments created during the course of employment that relate
                to the Employer’s business shall be the property of the
                Employer. 3.2 **Disclosure**: The Employee agrees to disclose
                promptly any such work product to the Employer. ### 4. **Term
                and Termination** 4.1 **Term**: This Agreement shall continue
                until terminated by either party in accordance with this
                Section. 4.2 **Termination by Employer**: The Employer may
                terminate this Agreement at any time with or without cause,
                provided [notice period, e.g., two weeks’] notice is given. 4.3
                **Termination by Employee**: The Employee may terminate this
                Agreement at any time by providing [notice period, e.g., two
                weeks’] written notice to the Employer. 4.4 **Effect of
                Termination**: Upon termination, the Employee shall cease all
                use of Confidential Information and shall return all materials
                as outlined in Section 2.3. ### 5. **Non-Competition and
                Non-Solicitation** 5.1 **Non-Competition**: During the term of
                employment and for a period of [duration, e.g., one year]
                following termination, the Employee agrees not to engage in any
                business that competes directly with the Employer. 5.2
                **Non-Solicitation**: During the term of employment and for a
                period of [duration, e.g., one year] following termination, the
                Employee agrees not to solicit or induce any employee or
                contractor of the Employer to leave their position or work for a
                competing business. ### 6. **General Provisions** 6.1
                **Governing Law**: This Agreement shall be governed by and
                construed in accordance with the laws of the State of [State].
                6.2 **Entire Agreement**: This Agreement constitutes the entire
                agreement between the parties and supersedes all prior
                agreements or understandings, whether written or oral, relating
                to the subject matter hereof. 6.3 **Amendments**: This Agreement
                may only be amended or modified by a written instrument signed
                by both parties. 6.4 **Severability**: If any provision of this
                Agreement is found to be invalid or unenforceable, the remaining
                provisions shall remain in full force and effect. 6.5
                **Waiver**: The waiver by either party of any breach of this
                Agreement shall not operate as a waiver of any subsequent
                breach. **IN WITNESS WHEREOF**, the parties have executed this
                Agreement as of the day and year first above written. ---
                **Employer** Custos Diretriz By: _______________________________
                Name: [Name] Title: [Title] Date: [Date] --- **Employee** Mercy
                By: _______________________________ Name: Mercy Date: [Date] ---
                Feel free to customize the placeholders (like [Position Title],
                [Start Date], [Salary Amount], [State], etc.) to fit the
                specific details of your agreement. If you need further
                customization or additional clauses, let me know!
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <strong className="text-lg">Email:</strong>
            {isEditing ? (
              <input
                type="email"
                value={editableFields.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full p-2 bg-[#091219] text-[#EAFBFF] border border-[#19B1D2] rounded"
              />
            ) : (
              <span className="text-sm">{agreement.email || "N/A"}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <strong className="text-lg">First Party Address:</strong>
            <span className="text-sm">{agreement.first_party_address}</span>
          </div>
          <div className="flex flex-col gap-2">
            <strong className="text-lg">First Party Valid ID:</strong>
            <img
              src={agreement.first_party_valid_id}
              alt="First Party ID"
              className="w-[6em] h-[6em] object-cover rounded-lg"
            />
          </div>
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
              <span className="text-sm">{agreement.first_party_country || "N/A"}</span>
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
              <span className="text-sm">{agreement.first_party_id_type}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <strong className="text-sm">First Party Signature:</strong>
            <img
              src={agreement.first_party_signature}
              alt="First Party Signature"
              className="w-[6em] h-[6em] object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <strong className="text-lg">Second Party Address:</strong>
            <span className="text-sm">{agreement.second_party_address}</span>
          </div>
          <div className="flex flex-col gap-2">
            <strong className="text-lg">Second Party Valid ID:</strong>
            <span className="text-sm">{agreement.second_party_valid_id || "N/A"}</span>
          </div>
          <div className="flex flex-col gap-2">
            <strong className="text-lg">Second Party Country:</strong>
            <span className="text-sm">{agreement.second_party_country || "N/A"}</span>
          </div>
          <div className="flex flex-col gap-2">
            <strong className="text-lg">Second Party ID Type:</strong>
            <span className="text-sm">{agreement.second_party_id_type || "N/A"}</span>
          </div>
          <div className="flex flex-col gap-2">
            <strong className="text-lg">Second Party Signature:</strong>
            <span className="text-sm">{agreement.second_party_signature || "N/A"}</span>
          </div>
          <div className="flex flex-col gap-2">
            <strong className="text-lg">Created At:</strong>
            <span className="text-sm">{new Date(agreement.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;