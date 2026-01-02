"use client";

import { FAQCategoryData } from "@/components/dataMock/faq";
import { AccordionItem } from "./AccordionItems";

interface FAQCategoryProps {
  category: FAQCategoryData;
  language: "en" | "id";
}

export const FAQCategory = ({ category, language }: FAQCategoryProps) => {
  return (
    <div id={category.id} className="scroll-mt-24 mb-12">
      <h2 className="font-serif text-2xl text-gray-800 mb-6">
        {category.title[language]}
      </h2>
      <div className="flex flex-col">
        {category.items.map((item, index) => (
          <AccordionItem
            key={index}
            question={item.question[language]}
            answer={item.answer[language]}
            language={language}
          />
        ))}
      </div>
    </div>
  );
};
