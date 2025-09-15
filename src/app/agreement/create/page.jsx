/* eslint-disable react/no-unescaped-entities */
"use client";
import { UseWriteToContract } from "../../../utils/fetchcontract";
import { useState, useContext, useRef, useEffect } from "react";
import { FaArrowLeft, FaLongArrowAltRight } from "react-icons/fa";
import { Header } from "../components/AgreementNav";
import { redirect } from "next/navigation";
import { WalletContext } from "../../../components/walletprovider";
import Modal from "react-modal";
import SuccessScreen from "../components/Success";
import SignaturePad from "react-signature-canvas";
import { base64ToImageFile } from "../../../utils/serializer";
import { useAccount } from "@starknet-react/core";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
import Image from "next/image";
import AgreementTemplate from "../agreementTemplate/page";
// import { Input } from "../../components/ui/input";
import CreateAgreementWithAi from "../withAi/page";

// Arrays for select options
const agreementTypeOptions = [
  { value: "", label: "Select an option" },
  { value: "Non-Disclosure Agreement", label: "Non-Disclosure Agreement" },
  { value: "Allocation of Rights", label: "Allocation of Rights" },
  {
    value: "Material Transfer Agreement",
    label: "Material Transfer Agreement",
  },
  { value: "Data Use Agreement", label: "Data Use Agreement" },
  { value: "Consortium Agreement", label: "Consortium Agreement" },
  {
    value: "Memorandum of Understanding",
    label: "Memorandum of Understanding",
  },
  {
    value: "Sponsored Research Agreement",
    label: "Sponsored Research Agreement",
  },
  { value: "Teaming Agreement", label: "Teaming Agreement" },
];

const idTypeOptions = [
  { value: "", label: "Select Your ID type" },
  { value: "International Passport", label: "International Passport" },
  { value: "National Identification", label: "National Identification" },
  { value: "Work Id card", label: "Work Identity" },
  { value: "School identification", label: "School Identity" },
  { value: "Others", label: "Others" },
];

const signatureTypeOptions = [
  { value: "", label: "Select Signature Type" },
  { value: "draw", label: "Draw Signature" },
  { value: "upload", label: "Upload Signature" },
];

// Reusable select component using mapping
const MappedSelect = ({ id, name, value, onChange, options, className }) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    >
      {options.map((option, idx) => (
        <option
          key={idx}
          value={option.value}
          className="bg-[#04080C] text-white"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Stepper Config
const stepperConfig = [
  {
    name: "Agreement Type",
  },
  {
    name: "Agreement Content",
  },
  {
    name: "Verify Identity",
  },
  {
    name: "2nd party address",
  },
];

const AgreementModal = ({ initialStep, ttitle, tcontent, agreement }) => {
  const [modalStep, setModalStep] = useState(initialStep || 0);
  const [idNumber, setIdNumber] = useState("");
  const [agreementType, setAgreementType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState(tcontent || "");
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

  const [selectedAgreement, setSelectedAgreement] = useState(agreement || null);
  const [errors, setErrors] = useState({});
  const { address } = useContext(WalletContext);
  const [margins, setMargins] = useState({
    marginLeft: "100px",
    marginRight: "100px",
  });

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

  const handleAgreementSelection = (agreement) => {
    setSelectedAgreement(agreement);
  };

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

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedSignature(file);
    }
  };

  // Validation for each step before proceeding
  const validateCurrentStep = () => {
    let currentErrors = {};
    if (modalStep === 0) {
      if (!agreementType) {
        currentErrors.agreementType = "Agreement Type is required.";
      }
    } else if (modalStep === 1) {
      if (!content.trim()) {
        currentErrors.content = "Agreement Content cannot be empty.";
      }
    } else if (modalStep === 2) {
      if (!searchTerm) {
        currentErrors.country = "Country is required.";
      }
      if (!idType) {
        currentErrors.idType = "ID Type is required.";
      }
      if (!idImage) {
        currentErrors.idImage = "ID Image is required.";
      }
      if (!firstpartyFullname.trim()) {
        currentErrors.firstpartyFullname = "First Party Fullname is required.";
      }
    } else if (modalStep === 3) {
      if (!secondPartyFullname.trim()) {
        currentErrors.secondPartyFullname =
          "Second Party Fullname is required.";
      }
      if (!secondPartyAddress.trim()) {
        currentErrors.secondPartyAddress = "Second Party Address is required.";
      }
      if (!signatureType) {
        currentErrors.signatureType = "Signature type must be selected.";
      } else {
        if (signatureType === "draw") {
          if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
            currentErrors.signature = "Signature is required.";
          }
        } else if (signatureType === "upload") {
          if (!uploadedSignature) {
            currentErrors.signature = "Please upload your signature.";
          }
        }
      }
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setModalStep(modalStep + 1);
    }
  };

  // Render errors dynamically
  const renderErrors = () => {
    return Object.values(errors).map((err, idx) => (
      <span key={idx} className="text-red-500">
        {err}
      </span>
    ));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate before submission (step 3)
    if (!validateCurrentStep()) {
      return;
    }

    const formData = new FormData();
    formData.append("agreementType", agreementType);
    formData.append("content", content);
    formData.append("country", searchTerm);
    formData.append("first_party_address", address);
    formData.append("first_party_id_type", idType);
    formData.append("first_party_valid_id", idImage);
    formData.append("second_party_address", secondPartyAddress);
    formData.append("first_party_fullname", firstpartyFullname);
    formData.append("second_party_fullname", secondPartyFullname);

    if (signatureType === "draw") {
      const base64Signature = signaturePadRef.current.toDataURL();
      let signatureData = base64ToImageFile(base64Signature, "signature.png");
      formData.append("first_party_signature", signatureData);
    }

    if (signatureType === "upload" && uploadedSignature) {
      formData.append("first_party_signature", uploadedSignature);
    }

    try {
      setInitCreationLoad(true);
      const res = await fetch(
        "${process.env.NEXT_PUBLIC_BACKEND_URL}/agreement/agreement/",
        {
          method: "POST",
          headers: {
            // Don't set Content-Type header; fetch will set it automatically for FormData
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

  const renderStep = () => {
    switch (modalStep) {
      case 0:
        return (
          <div className="text-white flex flex-col items-center justify-center space-y-6 mb-8 ">
            <label
              htmlFor="agreementType"
              className="font-[500] text-[24px] text-white"
            >
              Select the type of agreement you want to create
            </label>
            <MappedSelect
              id="agreementType"
              name="agreementType"
              value={agreementType}
              onChange={(e) => setAgreementType(e.target.value)}
              className="mt-1 focus:outline-none w-full border-[#BEBDBD] focus-visible:top-10 focus:border-[#19B1D2] active:border-[#0094FF] px-2 py-3 rounded-md bg-transparent border shadow-sm text-white sm:text-sm"
              options={agreementTypeOptions}
            />
          </div>
        );
      case 1:
        return (
          <>
            <h1 className="text-white text-[1.2em]">Agreement Content</h1>
            <div>
              <MDEditor
                value={content}
                onChange={setContent}
                placeholder="Write or Paste the Content of Your Agreement Here"
                className="custom-editor"
                height="350px"
              />
            </div>
          </>
        );
      case 2:
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
                onFocus={() => setDropdownVisible(true)}
                onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
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
                        setSearchTerm(country.name);
                        setDropdownVisible(false);
                      }}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-700"
                    >
                      {country.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="idType"
                className="font-[500] text-[1em] text-white"
              >
                Identity Type
              </label>
              <MappedSelect
                id="idType"
                name="idType"
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="mt-1 focus:outline-none w-full border-[#BEBDBD] focus-visible:top-10 focus:border-[#19B1D2] active:border-[#0094FF] px-2 py-3 rounded-md bg-transparent border shadow-sm text-white sm:text-sm"
                options={idTypeOptions}
              />
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
                First Party FullNname
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
      case 3:
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
            <MappedSelect
              id="signatureType"
              name="signatureType"
              value={signatureType}
              onChange={(e) => setSignatureType(e.target.value)}
              className="mt-1 w-full border-[#BEBDBD] px-2 py-3 rounded-md bg-transparent border shadow-sm text-[#9B9292] sm:text-sm"
              options={signatureTypeOptions}
            />

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

  // Stepper Component
  const Stepper = () => {
    const [margins, setMargins] = useState({ marginLeft: 0, marginRight: 0 });
    const stepRef = useRef([]);

    useEffect(() => {
      if (stepRef.current.length > 0) {
        setMargins({
          marginLeft: stepRef.current[0].offsetWidth / 2,
          marginRight:
            stepRef.current[stepperConfig.length - 1].offsetWidth / 2,
        });
      }
    }, [stepperConfig]);
    return (
      <div className="relative w-full md:w-[55%] flex justify-between items-center mb-5">
        {/* Circles */}
        {stepperConfig.map((step, index) => (
          <div
            ref={(el) => (stepRef.current[index] = el)}
            key={index}
            className="flex flex-col items-center justify-center"
            style={{ marginLeft: index !== 0 ? "20px" : "0" }}
          >
            <div
              className={`w-7 h-7 rounded-full flex justify-center items-center mb-4 z-20 ${
                modalStep > index
                  ? "bg-[#0094FF] text-white"
                  : modalStep === index
                  ? "bg-transparent text-[#0094FF] border-[1px] border-[#0094FF]"
                  : "bg-transparent text-white border-[1px] border-red"
              }`}
            >
              {index + 1}
            </div>
            <div className="lg:block hidden text-sm text-[#EAFBFF] ">
              {step.name}
            </div>
          </div>
        ))}

        {/* Progress Bar */}
        <div
          className="progress-bar absolute top-[25%] left-0 h-[1px] "
          style={{
            width: `calc(100% - ${margins.marginLeft + margins.marginRight}px)`,
            marginLeft: margins.marginLeft + 30,
            marginRight: margins.marginRight,
          }}
        >
          {stepperConfig.map((step, index) => (
            <>
              {index < stepperConfig.length - 1 && (
                <div
                  key={index}
                  className={`progress-segment invisible lg:visible absolute top-0 h-full ${
                    modalStep > index
                      ? "bg-[#0094FF] transition-all duration-500 ease-in"
                      : "bg-white"
                  }`}
                  style={{
                    left: `${(index / (stepperConfig.length - 1)) * 100}%`,
                    width: `${100 / (stepperConfig.length - 1) - 10}%`,
                  }}
                />
              )}
            </>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full sm:flex-ro flex flex-col items-center justify-center">
      {/* <div className="flex justify-between "> */}
      <div className="flex justify-between  w-full mt-[1%]">
        <button
          className="sm:w-fit w-full sm:flex justify-between  hidden   z-20 items-start text-[#EAFBFF] px-4 sm:px-0"
          onClick={() => window.history.back()}
        >
          <div className="sm:w-fit w-full  flex justify-start items-centr">
            <FaArrowLeft className="mr-2 mt-[3px] text-[#EAFBFF]" />
            <p className="text-[#EAFBFF] font-bold">Back</p>
          </div>
        </button>
        <div className="flex items-center gap-2">
          {" "}
          <div className="w-[1em] h-[1em] bg-blue-500 rounded-full"></div>
          <p> step 1 of 8</p>
        </div>
      </div>
      <div className="w-full px-4 flex flex-col gap-8 overflow-clip  justify-center items-center h-auto">
        {/* Agreement Selection Section */}
        {!selectedAgreement && (
          <div className="w-full flex flex-col justify-center items-center text-center">
            <h2 className="text-[#EAFBFF] text-[24px] md:text-[28px]">
              Choose the Best Way to Create Your Agreement
            </h2>
            <div className="space-y-4 md:space-x-4 md:space-y-0 mt-8 flex flex-col md:flex-row">
              {/* Card 1: AI Lawyer */}
              <div
                onClick={() => handleAgreementSelection("C")}
                className="cursor-pointer"
              >
                <div
                  className="w-full md:w-[268px] h-[360px] bg-[radial-gradient(13.75%_27.94%_at_50%_50%,_rgba(39,_73,_98,_0.1)_0%,_rgba(45,_72,_92,_0.2)_100%)] 
      rounded-[20px] flex flex-col items-center justify-center p-4 
      border-[2px] border-[transparent] 
      group transition-all duration-300 ease-in-out relative"
                >
                  <div className="w-[80px] h-[80px] z-30 flex items-center justify-center">
                    {/* You can use an AI icon or a placeholder image */}
                    <Image
                      src="/agreementWithAi.svg"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover rounded-t-[20px]"
                      alt="AI Lawyer"
                    />
                  </div>
                  <div className="flex z-20 flex-col justify-center items-center w-full h-[50%] rounded-b-[20px] p-4">
                    <p className="text-[#EAFBFF] text-[20px] font-[500] mb-2 mt-12 text-center">
                      Create your Agreement with Custos AI Lawyer
                    </p>
                    <p className="text-[#EAFBFF] text-[14px] font-[400] text-center">
                      In 60 seconds, Custos AI Lawyer will create a Lawyer
                      Standard agreement for you
                    </p>
                  </div>
                  <div className="group-hover:bg-[radial-gradient(13.75%_27.94%_at_50%_50%,_rgba(39,_73,_98,_0.2)_0%,_rgba(45,_72,_92,_0.4)_100%)] w-full h-full absolute inset-0 rounded-[20px] transition-all duration-300 ease-in-out"></div>
                </div>
              </div>
              {/* Card 2: Template */}
              <div
                onClick={() => handleAgreementSelection("A")}
                className="cursor-pointer"
              >
                <div
                  className="w-full md:w-[268px] h-[360px] bg-[radial-gradient(13.75%_27.94%_at_50%_50%,_rgba(39,_73,_98,_0.1)_0%,_rgba(45,_72,_92,_0.2)_100%)] 
              rounded-[20px] flex flex-col items-center justify-center p-4 
              border-[2px] border-[transparent] 
              group transition-all duration-300 ease-in-out relative"
                >
                  <div className="w-[80px] h-[80px] z-30">
                    <Image
                      src="/template.svg"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover rounded-t-[20px]"
                    />
                  </div>
                  <div className="flex z-20 flex-col justify-center items-center w-full h-[50%]  rounded-b-[20px] p-4">
                    <p className="text-[#EAFBFF] text-[20px] font-[500] mb-2 mt-12">
                      Start with a ready template
                    </p>
                    <p className="text-[#EAFBFF] text-[14px] font-[400]">
                      Save time by customizing one of our ready-to-use agreement
                      templates.
                    </p>
                  </div>
                  <div className="group-hover:bg-[radial-gradient(13.75%_27.94%_at_50%_50%,_rgba(39,_73,_98,_0.2)_0%,_rgba(45,_72,_92,_0.4)_100%)] w-full h-full absolute inset-0 rounded-[20px] transition-all duration-300 ease-in-out"></div>
                </div>
              </div>

              {/* Card 3: Build from scratch */}
              <div
                onClick={() => handleAgreementSelection("B")}
                className="cursor-pointer"
              >
                <div
                  className="w-full md:w-[268px] h-[360px] bg-[radial-gradient(13.75%_27.94%_at_50%_50%,_rgba(39,_73,_98,_0.1)_0%,_rgba(45,_72,_92,_0.2)_100%)] 
              rounded-[20px] flex flex-col items-center justify-center p-4 
              border-[2px] border-[transparent] 
              group transition-all duration-300 ease-in-out relative"
                >
                  <div className="w-[80px] h-[80px] z-30">
                    <Image
                      src="/Notepen.svg"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover rounded-t-[20px]"
                    />
                  </div>
                  <div className="flex z-20 flex-col justify-center items-center w-full h-[50%]  rounded-b-[20px] p-4">
                    <p className="text-[#EAFBFF] text-[20px] font-[500] mt-12 mb-2">
                      Build your agreement from scratch
                    </p>
                    <p className="text-[#EAFBFF] text-[14px] font-[400]">
                      Create and customize every detail for a unique, tailored
                      agreement
                    </p>
                  </div>
                  <div className="group-hover:bg-[radial-gradient(13.75%_27.94%_at_50%_50%,_rgba(39,_73,_98,_0.2)_0%,_rgba(45,_72,_92,_0.4)_100%)] w-full h-full absolute inset-0 rounded-[20px] transition-all duration-300 ease-in-out"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedAgreement === "A" && <AgreementTemplate />}

        {selectedAgreement === "B" && (
          <>
            <Stepper />
            <div className="rounded-2xl box border-gradien  p-6">
              <div className="sh"></div>
              <form className=" w-full space-y-5" onSubmit={handleSubmit}>
                {modalStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setModalStep(modalStep - 1)}
                    className="w-fit rounded-[2em] hover:text-[#A02294] items-center text-white font-bold justify-center flex"
                    // disabled={modalStep === 1}
                  >
                    <FaArrowLeft className="mr-2" />{" "}
                    <p className="">Previous</p>
                  </button>
                )}
                <div className="w-full flex-col flex gap-4">
                  {renderErrors()}
                </div>
                {renderStep()}
                <div className="flex justify-between flex-row-reverse gap-8">
                  {modalStep !== 3 && (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-[#19B1D2] to-[#0094FF] sm:w-[156px] w-full rounded-[2em] text-white font-bold py-2 px-4 border-gradient2 shadow-[0_0_0_1px_#0094FF,0_0_0_3px_rgba(28,167,214,0.41)] transition-transform transform hover:scale-105 active:shadow-none border-gradient2 "
                    >
                      Continue
                    </button>
                  )}

                  {modalStep === 3 && (
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-[#19B1D2] to-[#0094FF] sm:w-[156px] w-full rounded-[2em] text-white font-bold py-2 px-4 border-gradient2 shadow-[0_0_0_1px_#0094FF,0_0_0_3px_rgba(28,167,214,0.41)] transition-transform transform hover:scale-105 active:shadow-none border-gradient2 "
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
          </>
        )}

        {selectedAgreement === "C" && (
          <>
            <CreateAgreementWithAi />
          </>
        )}
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
    </div>
  );
};

// Replace default export to provide a no-prop page component required by Next.js
export default function Page() {
  return <AgreementModal />;
}
