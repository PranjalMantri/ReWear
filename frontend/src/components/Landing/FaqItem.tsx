import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FAQ> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <h3 className="text-lg font-medium text-slate-800">{question}</h3>
        <span className="p-1 bg-slate-100 rounded-full">
          {isOpen ? (
            <Minus className="w-5 h-5 text-emerald-600" />
          ) : (
            <Plus className="w-5 h-5 text-slate-500" />
          )}
        </span>
      </button>
      {isOpen && (
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-slate-600 leading-relaxed">{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqItem;
export type { FAQ };
