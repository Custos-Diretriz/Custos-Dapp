"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGlobalState } from "../../../context/GlobalStateProvider";
import SignaturePad from "react-signature-canvas";
import useIdentityVerification from "../../../utils/verification";
import { useNotification } from "../../../context/NotificationProvider";
import { Buffer } from 'buffer';
import { base64ToImageFile } from "../../../utils/serializer";

interface SignAgreementModalProps {
  fullname: string;
  agreementId: string;
  agreementToken: string;
  onClose: () => void;
}

const SignAgreementModal = ({
  fullname,
  agreementId,
  agreementToken,
  onClose,
}: SignAgreementModalProps): React.JSX.Element => {
  const { verifyIdentity, loading, result, error } = useIdentityVerification();
  const [currentStep, setCurrentStep] = useState(1);
  const [signatureType, setSignatureType] = useState("");
  const [idType, setIdType] = useState("");
  const [country, setCountry] = useState("");
  const [uploadedSignature, setUploadedSignature] = useState<File | null>(null);
  const [uploadedId, setUploadedId] = useState<File | null>(null); // New state for uploaded ID
  const signaturePadRef = useRef<any>(null);
  const [termsAndConditions, setTermsAndConditions] = useState('false');
  const { globalState } = useGlobalState();
  const router = useRouter();

  const { openNotification } = useNotification();

  // Function to handle continue button click
  const handleContinue = () => {
    setCurrentStep((prevStep) => prevStep + 1); // Go to next step
  };

  // Function to handle signature upload
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedSignature(file); // Store the uploaded signature image
    }
  };

  // Function to handle ID upload
  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedId(file);
    }
  };



  const handleSignAgreement = async () => {
    let signatureData = null;
  
    try {
      if (signatureType === "draw") {
        if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
          alert("Please draw your signature before submitting.");
          return;
        }
        const base64Signature = signaturePadRef.current.toDataURL();
        console.log(base64Signature)
        signatureData = base64ToImageFile(base64Signature, "signature.png");
      }
  
      if (signatureType === "upload" && uploadedSignature) {
        signatureData = uploadedSignature;
      }
  
      if (!signatureData || !uploadedId) {
        alert("Please provide a valid signature and ID before submitting.");
        return;
      }
  
      const formData = new FormData();
      formData.append("second_party_signature", signatureData);
      formData.append("second_party_valid_id", uploadedId);
      formData.append("second_party_id_type", idType);
      formData.append("second_party_country", country);
  
      // Debugging FormData
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/agreement/agreement/${agreementId}/sign/`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      openNotification("success", "Sign Agreement", "Agreement Signed Successfully");
      onClose();
    } catch (error: unknown) {
      console.error("Error during agreement signing:", error);
      alert(`An error occurred: ${(error as Error).message || "Unknown error"}`);
    }
  };
  

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/agreement/terms_and_condition/`
        );
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        setTermsAndConditions(data[0].content);
        console.log(data);
      } catch (error) {
        console.error("Error fetching terms and conditions:", error);
      }
    };

    fetchTermsAndConditions();
  }, []);
  


  return (
    <div className="p-3 h-screen bg-[#00000095] w-full flex items-center justify-center text-white rounded-lg absolute left-0 z-50 top-0">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error}</div>
      ) : (
        <div className="box w-[30%]">
          <div className="p-4 h-fit rounded-[23px] validate-gradient flex flex-col gap-4">
            <h3 className="text-lg font-bold mb-4">Sign the Agreement</h3>

            {currentStep === 1 && (
              <>
                <strong>Country</strong>
                <input
                  type="text"
                  onChange={(e) => setCountry(e.target.value)}
                  className="py-2 text-[#9B9292] px-4 border border-[#ffffff46] rounded-lg bg-transparent"
                />
                <strong>Identity Type</strong>
                <select
                  onChange={(e) => setIdType(e.target.value)}
                  className="mt-1 w-full border-[#BEBDBD] px-2 py-3 rounded-md bg-transparent border shadow-sm text-[#9B9292] sm:text-sm"
                >
                  <option value="" className="bg-[#04080C] text-[#9B9292]">
                    {" "}
                    Select ID type{" "}
                  </option>
                  <option
                    value="International Passport"
                    className="bg-[#04080C] text-[#9B9292]"
                  >
                    {" "}
                    International Passport{" "}
                  </option>
                  <option
                    value="National Identification"
                    className="bg-[#04080C] text-[#9B9292]"
                  >
                    {" "}
                    National Identification{" "}
                  </option>
                  <option
                    value="Work Id card"
                    className="bg-[#04080C] text-[#9B9292]"
                  >
                    {" "}
                    Work Identity{" "}
                  </option>
                </select>
                {/* <strong>Identity Number</strong>
                <input
                  type="text"
                  placeholder="Enter Your Id number"
                  className="py-2 text-[#9B9292] px-4 border border-[#ffffff46] rounded-lg bg-transparent"
                /> */}
                <strong>Upload Id</strong>
                <input
                  type="file"
                  onChange={handleIdUpload}
                  className="py-2 px-4 border border-[#ffffff46] rounded-lg bg-transparent"
                />{" "}
                {/* Add onChange to capture uploaded ID */}
              </>
            )}

            {currentStep === 2 && (
              <>
                <strong>Terms and Conditions</strong>
                <textarea
                  className="w-full p-4 text-[#9B9292] bg-transparent border border-[#ffffff46] rounded-lg"
                  rows={6}
                  readOnly
                  value={termsAndConditions}
                />

                <strong>Signature Type</strong>
                <select
                  value={signatureType}
                  onChange={(e) => setSignatureType(e.target.value)}
                  className="mt-1 w-full border-[#ffffff46] px-2 py-3 rounded-md bg-transparent border shadow-sm text-[#9B9292] sm:text-sm"
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
            )}

            <div className="flex justify-between">
              <div className="button-transition">
                <Image
                  src="/cancleAgreement.png"
                  alt="Cancel Agreement"
                  onClick={onClose}
                  width={200}
                  height={200}
                />
              </div>
              {currentStep === 2 ? (
                <div className="button-transition">
                  <Image
                    src="/SignAgreement.png"
                    alt="Sign Agreement"
                    onClick={handleSignAgreement}
                    width={200}
                    height={200}

                  />
                </div>
              ) : (
                <div className="button-transition">
                  <Image
                    src="/ContinueAgreement.png"
                    alt="Continue Agreement"
                    onClick={handleContinue}
                    width={200}
                    height={200}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignAgreementModal;
