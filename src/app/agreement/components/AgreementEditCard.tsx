import { handleClientScriptLoad } from "next/script";
import AgreementModal from "../create/page"; 
import React from "react";

interface AgreementEditCardProps {
  title: string;
  content: string;
  onBack: () => void;
}

const AgreementEditCard = ({ title, content, onBack }: AgreementEditCardProps): React.JSX.Element => {
    const [templateCreate, setTemplateCreate] = React.useState(false);

    const handleClick = (): void => {
        setTemplateCreate(true);
    }

    return (
        <div>
            {!templateCreate ? <div className="w-full flex flex-col items-center py-8 gap-6">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="mt-2 text-gray-300 w-[80%]">{content}</p>
                <div className="flex items-center gap-10 mt-5">
                    <button onClick={onBack} className="px-3 py-1 bg-blue-00 rounded">Return</button>
                    <button className="px-3 py-1 border-gradient rounded" onClick={handleClick}>Continue</button>
                </div>
            </div>
                :
                <AgreementModal />}
        </div>
    )
};

export default AgreementEditCard;
