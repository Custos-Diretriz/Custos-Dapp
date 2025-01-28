/* eslint-disable react/no-unescaped-entities */
// /* eslint-disable react/no-unescaped-entities */
"use client";
import { UseWriteToContract } from "@/utils/fetchcontract";
import { useState, useContext, useRef, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Header } from "../components/AgreementNav";
import { redirect } from "next/navigation";
import { WalletContext } from "@/components/walletprovider";
import Modal from "react-modal";
import SuccessScreen from "../components/Success";
import SignaturePad from "react-signature-canvas";
import { base64ToImageFile } from "@/utils/serializer";
import { useAccount } from "@starknet-react/core";
import "react-quill/dist/quill.snow.css";
import TurndownService from "turndown";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AgreementModal = () => {
  const [modalStep, setModalStep] = useState(1);
  const [idNumber, setIdNumber] = useState("");
  const [agreementType, setAgreementType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [initCreationLoad, setInitCreationLoad] = useState(false);
  const [country, setCountry] = useState("");
  const [idType, setIdType] = useState("");
  const [idImage, setIdImage] = useState("");
  const [agreementTitle, setAgreementTitle] = useState("");
  const [signatureType, setSignatureType] = useState("");
  const signaturePadRef = useRef(null);
  const [uploadedSignature, setUploadedSignature] = useState(null);
  const [secondPartyAddress, setSecondPartyAddress] = useState("");
  const [firstpartyFullname, setfirstpartyFullname] = useState("");
  const [secondPartyFullname, setSecondPartyFullname] = useState("");

  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [errors, setErrors] = useState({});
  const { address } = useContext(WalletContext);
  const turndownService = new TurndownService();

  // Fetch country list from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://countrylist-j.vercel.app/api/countries"
        );
        const data = await response.json();
        setCountries(data);
        setFilteredCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm, countries]);

  const {
    sendTransaction,
    transaction,
    isPending,
    isLoading,
    error,
    data,
    isSuccess,
  } = UseWriteToContract("agreement", "createAgreement", [
    content,
    secondPartyAddress,
    "firstPartyName",
    idNumber,
  ]);

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedSignature(file);
    }
  };
  // const creatoraddress = useAccount()?.address;
  const handleSubmit = async (event) => {
    event.preventDefault();
    const markdown = turndownService.turndown(content);
    const mergedContent = `<!-- HTML Content -->\n${content}\n\n<!-- Markdown Content -->\n${markdown}`;

    const formData = new FormData();
    formData.append("agreementType", agreementType);
    formData.append("content", mergedContent);
    formData.append("country", searchTerm);
    formData.append("first_party_address", address);
    formData.append("first_party_id_type", idType);
    formData.append("first_party_valid_id", idImage);
    formData.append("second_party_address", secondPartyAddress);
    formData.append("first_party_fullname", firstpartyFullname);
    formData.append("second_party_fullname", secondPartyFullname);

    if (signatureType === "draw") {
      if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
        alert("Please draw your signature before submitting.");
        return;
      }
      const base64Signature = signaturePadRef.current.toDataURL();
      console.log(base64Signature);
      let signatureData = base64ToImageFile(base64Signature, "signature.png");
      formData.append("first_party_signature", signatureData);
    }

    if (signatureType === "upload" && uploadedSignature) {
      formData.append("first_party_signature", uploadedSignature);
    }

    try {
      setInitCreationLoad(true);
      const res = await fetch(
        "https://custosbackend.onrender.com/agreement/agreement/",
        {
          method: "POST",
          headers: {
            // Don't set Content-Type header; fetch will set it automatically for FormData
            // "Content-Type": "application/json",
            // Add any necessary authentication headers here
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        setErrors(errorData);
        setInitCreationLoad(false);
        return;
      }

      const data = await res.json();
      setInitCreationLoad(false);
      setIsModalOpen(true); // Open the success modal
      setTimeout(() => {
        setIsModalOpen(false);
        window.location.href = "/agreement";
      }, 4000);
    } catch (err) {
      console.error(err.message);
      setInitCreationLoad(false);
      setErrors({ general: err.message });
    }
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // Handle form submission here
  //   sendTransaction(transaction);
  //   console.log("Form submitted:", {
  //     agreementType,
  //     content,
  //     country,
  //     idType,
  //     idNumber,
  //     secondPartyAddress,
  //   });
  // };

  const renderStep = () => {
    switch (modalStep) {
      case 1:
        return (
          <div className="text-white flex flex-col items-center justify-center space-y-6 mb-8 ">
            <label
              htmlFor="agreementType"
              className="font-[500] text-[24px] text-white"
            >
              Select the type of agreement you want to create
            </label>
            <select
              id="agreementType"
              name="agreementType"
              value={agreementType}
              onChange={(e) => setAgreementType(e.target.value)}
              className="mt-1 focus:outline-none w-full border-[#BEBDBD] focus-visible:top-10 focus:border-[#19B1D2] active:border-[#0094FF] px-2 py-3 rounded-md bg-transparent border shadow-sm text-white sm:text-sm"
            >
              <option className="bg-[#04080C] text-white" value="">
                Select an option
              </option>
              <option
                className="bg-[#04080C] text-white"
                value="Non-Disclosure Agreement"
              >
                Non-Disclosure Agreement
              </option>
              <option
                className="bg-[#04080C] text-white"
                value="Allocation of Rights"
              >
                Allocation of Rights
              </option>
              <option
                className="bg-[#04080C] text-white"
                value="Material Transfer Agreement"
              >
                Material Transfer Agreement
              </option>
              <option
                className="bg-[#04080C] text-white"
                value="Data Use Agreement"
              >
                Data Use Agreement
              </option>
              <option
                className="bg-[#04080C] text-white"
                value="Consortium Agreement"
              >
                Consortium Agreement
              </option>
              <option
                className="bg-[#04080C] text-white"
                value="Memorandum of Understanding"
              >
                Memorandum of Understanding
              </option>
              <option
                className="bg-[#04080C] text-white"
                value="Sponsored Research Agreement"
              >
                Sponsored Research Agreement
              </option>
              <option
                className="bg-[#04080C] text-white"
                value="Teaming Agreement"
              >
                Teaming Agreement
              </option>
            </select>
          </div>
        );
      case 2:
        return (
          <>
            <h1 className="text-white text-[1.2em]">Agreement Content</h1>
            <div>
              <ReactQuill
                value={content}
                onChange={(value) => setContent(value)}
                placeholder="Write or Paste the Content of Your Agreement Here"
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "blockquote", "code-block"],
                    [{ align: [] }],
                    ["clean"],
                    [{ color: [] }, { background: [] }],
                  ],
                }}
                formats={[
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "list",
                  "bullet",
                  "link",
                  "blockquote",
                  "code-block",
                  "align",
                  "color",
                  "background",
                ]}
              />
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="text-white flex flex-col">
              <label
                htmlFor="country"
                className="font-[500] text-[1em] text-white"
              >
                Country
              </label>
              {/* Search Input */}
              <input
                type="text"
                id="country"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setDropdownVisible(true)} // Show dropdown on focus
                onBlur={() => setTimeout(() => setDropdownVisible(false), 200)} // Hide dropdown with a slight delay
                placeholder="Search for a country"
                className="focus:outline-none w-full border-[#BEBDBD] focus:border-[#19B1D2] px-2 py-3 rounded-md bg-transparent border shadow-sm text-white sm:text-sm"
              />

              {/* Dropdown List */}
              {dropdownVisible && (
                <div className="absolute bg-gray-800 border border-gray-700 rounded-md mt-20 max-h-40 overflow-y-auto z-10">
                  {filteredCountries.map((country) => (
                    <div
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country.name);
                        setSearchTerm(country.name); // Set the selected country as the search term
                        setDropdownVisible(false); // Hide dropdown
                      }}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-700"
                    >
                      {country.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* {selectedCountry && (
              <p className="mt-2 text-sm text-gray-400">
                Selected Country:{" "}
                <span className="font-medium">{selectedCountry}</span>
              </p>
            )} */}
            <div className="mb-4">
              <label
                htmlFor="idType"
                className="font-[500] text-[1em] text-white"
              >
                Identity Type
              </label>
              <select
                placeholder="Select ID Type"
                id="idType"
                name="idType"
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="mt-1 focus:outline-none w-full border-[#BEBDBD] focus-visible:top-10 focus:border-[#19B1D2] active:border-[#0094FF] px-2 py-3 rounded-md bg-transparent border shadow-sm text-white sm:text-sm"
              >
                <option value="" className="bg-[#04080C] text-white">
                  Select Your ID type
                </option>
                <option
                  className="bg-[#04080C] text-white"
                  value="International Passport"
                >
                  International Passport
                </option>
                <option
                  className="bg-[#04080C] text-white"
                  value="National Identification"
                >
                  National Identification
                </option>
                <option
                  className="bg-[#04080C] text-white"
                  value="Work Id card"
                >
                  Work Identity
                </option>
                <option
                  className="bg-[#04080C] text-white"
                  value="School identification"
                >
                  School Identity
                </option>
                <option className="bg-[#04080C] text-white" value="Others">
                  Others
                </option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="idImage"
                className="font-[500] text-[1em] text-white"
              >
                Upload Your ID Image
              </label>
              <input
                type="file"
                id="idImage"
                name="idImage"
                accept="image/*"
                onChange={(e) => setIdImage(e.target.files[0])}
                className="mt-1 focus:outline-none w-full border-[#BEBDBD] focus-visible:top-10 focus:border-[#19B1D2] active:border-[#0094FF] px-2 py-3 rounded-md bg-transparent border shadow-sm text-white sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="fullname"
                className="font-[500] text-[1em] text-white"
              >
                First Party FulNname
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={firstpartyFullname}
                onChange={(e) => setfirstpartyFullname(e.target.value)}
                className="mt-1 focus:outline-none w-full border-[#BEBDBD] focus-visible:top-10 focus:border-[#19B1D2] active:border-[#0094FF] px-2 py-3 rounded-md bg-transparent border shadow-sm text-white sm:text-sm"
              />
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="mb-4">
              <label
                htmlFor="secondPartyName"
                className="font-[500] text-[1em] text-white"
              >
                Second Party's FullName
              </label>
              <input
                type="text"
                id="secondPartyName"
                name="secondPartyName"
                value={secondPartyFullname}
                onChange={(e) => setSecondPartyFullname(e.target.value)}
                className="mt-1 focus:outline-none w-full border-[#BEBDBD] focus-visible:top-10 focus:border-[#19B1D2] active:border-[#0094FF] px-2 py-3 rounded-md bg-transparent border shadow-sm text-white sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="secondPartyAddress"
                className="font-[500] text-[1em] text-white"
              >
                Second Party's Wallet Address
              </label>
              <input
                type="text"
                id="secondPartyAddress"
                name="secondPartyAddress"
                value={secondPartyAddress}
                onChange={(e) => setSecondPartyAddress(e.target.value)}
                className="mt-1 focus:outline-none w-full border-[#BEBDBD] focus-visible:top-10 focus:border-[#19B1D2] active:border-[#0094FF] px-2 py-3 rounded-md bg-transparent border shadow-sm text-white sm:text-sm"
              />
            </div>

            <strong>Signature Type</strong>
            <select
              value={signatureType}
              onChange={(e) => setSignatureType(e.target.value)}
              className="mt-1 w-full border-[#BEBDBD] px-2 py-3 rounded-md bg-transparent border shadow-sm text-[#9B9292] sm:text-sm"
            >
              <option value="">Select Signature Type</option>
              <option value="draw">Draw Signature</option>
              <option value="upload">Upload Signature</option>
            </select>

            {signatureType === "draw" && (
              <div className="signature-draw-container my-4 border border-[#ffffff46] rounded-lg p-4">
                <SignaturePad
                  ref={signaturePadRef}
                  canvasProps={{
                    className: "signature-pad w-full h-32 bg-white",
                  }}
                />
                <button
                  className="text-red-500 mt-2"
                  onClick={() => signaturePadRef.current.clear()}
                >
                  Clear Signature
                </button>
              </div>
            )}

            {signatureType === "upload" && (
              <div className="upload-signature-container my-4">
                <input type="file" onChange={handleSignatureUpload} />
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full px-4 flex flex-col gap-8 overflow-clip  justify-center items-center h-[80vh]">
      <div className="rounded-2xl box border-gradien  p-6">
        <div className="sh"></div>
        <form className=" w-full space-y-5" onSubmit={handleSubmit}>
          {modalStep > 1 && (
            <button
              type="button"
              onClick={() => setModalStep(modalStep - 1)}
              className="w-fit rounded-[2em] hover:text-[#A02294] items-center text-white font-bold justify-center flex"
              disabled={modalStep === 1}
            >
              <FaArrowLeft className="mr-2" /> <p className="">Previous</p>
            </button>
          )}
          <div className="w-full flex-col flex gap-4">
            {errors.general && (
              <span className="text-red-500">{errors.general}</span>
            )}
            {errors.second_party_address && (
              <span className="text-red-500">
                {"second_party_address: " + errors.second_party_address[0]}
              </span>
            )}
            {errors.first_party_id_type && (
              <span className="text-red-500">
                {"first_party_id_type: " + errors.first_party_id_type[0]}
              </span>
            )}
            {errors.country && (
              <span className="text-red-500">
                {"country: " + errors.country[0]}
              </span>
            )}
            {errors.content && (
              <span className="text-red-500">
                {"content: " + errors.content[0]}
              </span>
            )}
            {errors.agreementTitle && (
              <span className="text-red-500">
                {"agreement Title: " + errors.agreementTitle[0]}
              </span>
            )}
            {errors.agreementType && (
              <span className="text-red-500">
                {"Agreement Type: " + errors.agreementType[0]}
              </span>
            )}
          </div>
          {renderStep()}
          <div className="flex justify-between flex-row-reverse gap-8">
            {modalStep !== 4 && (
              <button
                type="button"
                onClick={() => setModalStep(modalStep + 1)}
                className="bg-gradient-to-r from-[#19B1D2] to-[#0094FF] sm:w-[156px] w-full rounded-[2em] text-white font-bold py-2 px-4 border-gradient shadow-[0_0_0_1px_#0094FF,0_0_0_3px_rgba(28,167,214,0.41)] transition-transform transform hover:scale-105 active:shadow-none border-gradient"
              >
                Continue
              </button>
            )}

            {modalStep == 4 && (
              <button
                type="submit"
                className="bg-gradient-to-r from-[#19B1D2] to-[#0094FF] sm:w-[156px] w-full rounded-[2em] text-white font-bold py-2 px-4 border-gradient shadow-[0_0_0_1px_#0094FF,0_0_0_3px_rgba(28,167,214,0.41)] transition-transform transform hover:scale-105 active:shadow-none border-gradient"
              >
                {initCreationLoad ? "Creating" : "Create"}
              </button>
            )}
            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full rounded-[2em] sm:w-[156px] text-white font-bold py-2 px-6 border-[#9B9292] border bg-gradient-to-b from-[#04080C] to-[#09131A] shadow-[0_0_6px_1px_rgba(132,129,129,0.21),0_0_0_2px_rgba(132,129,129,0.16)] transition-transform transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <SuccessScreen
          onClose={() => setIsModalOpen(false)}
          isSuccess={true}
          message={`Agreement between ${firstpartyFullname} and ${secondPartyFullname} Created Successfully`}
        />
      </Modal>
    </div>
  );
};

export default AgreementModal;
