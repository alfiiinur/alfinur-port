"use client";
import { ArrowDown, Heart, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface AccordionItemProps {
  question: string;
  answer: string;
}

export const AccordionItem = ({ question, answer }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden mb-3 transition-colors duration-300">
      {/* Header (Question) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center px-6 py-5 text-left transition-colors duration-300 ${
          isOpen ? "bg-gray-50" : "bg-white hover:bg-gray-50"
        }`}
      >
        <span className="text-sm md:text-base font-medium text-gray-800">
          {question}
        </span>
        <ArrowDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Content (Answer) */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden bg-gray-50">
          <div className="px-6 pb-6 pt-2">
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              {answer}
            </p>

            {/* Helper Action (Is this helpful?) */}
            <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
              <span className="text-xs font-bold text-gray-500">
                Is this helpful?
              </span>
              <div className="flex gap-3">
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Heart size={14} />
                </button>
                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                  <ThumbsUp size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};