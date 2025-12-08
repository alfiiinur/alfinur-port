import { FAQCategoryData } from "@/components/dataMock/faq";
import { AccordionItem } from "./AccordionItems";

interface FAQCategoryProps {
  category: FAQCategoryData;
}

export const FAQCategory = ({ category }: FAQCategoryProps) => {
  return (
    <div id={category.id} className="scroll-mt-24 mb-12">
      <h2 className="font-serif text-2xl text-gray-800 mb-6">
        {category.title}
      </h2>
      <div className="flex flex-col">
        {category.items.map((item, index) => (
          <AccordionItem
            key={index}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </div>
  );
};