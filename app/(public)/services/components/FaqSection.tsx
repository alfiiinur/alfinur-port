"use client";

import { useState } from "react";
import { ArrowDown, Heart, ThumbsUp } from "lucide-react";

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FaqSectionProps {
  faqs: Faq[];
}

// Accordion Item Component
const AccordionItem = ({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden mb-3 transition-colors duration-300">
      <button
        onClick={onToggle}
        className={`w-full flex justify-between items-center px-6 py-5 text-left transition-colors duration-300 ${
          isOpen
            ? "bg-gray-50 dark:bg-gray-900"
            : "bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900"
        }`}
      >
        <span className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200">
          {question}
        </span>
        <ArrowDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden bg-gray-50 dark:bg-gray-900">
          <div className="px-6 pb-6 pt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 whitespace-pre-wrap">
              {answer}
            </p>

            <div className="flex items-center gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
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

// Sidebar Navigation Component
const SidebarNav = ({
  categories,
  activeCategory,
  onCategoryClick,
}: {
  categories: string[];
  activeCategory: string;
  onCategoryClick: (category: string) => void;
}) => {
  return (
    <nav className="hidden md:block sticky top-24 h-fit">
      <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-6">
        Topics
      </h3>
      <ul className="flex flex-col gap-3">
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => onCategoryClick(category)}
              className={`text-sm transition-colors block text-left ${
                activeCategory === category
                  ? "text-gray-900 dark:text-white font-medium underline"
                  : "text-gray-400 hover:text-gray-900 dark:hover:text-white hover:underline"
              }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// FAQ Category Component
const FAQCategory = ({
  title,
  faqs,
  openItems,
  onToggle,
}: {
  title: string;
  faqs: Faq[];
  openItems: Set<string>;
  onToggle: (id: string) => void;
}) => {
  return (
    <div
      id={title.toLowerCase().replace(/\s+/g, "-")}
      className="scroll-mt-24 mb-12"
    >
      <h2 className="font-serif text-2xl text-gray-800 dark:text-gray-200 mb-6">
        {title}
      </h2>
      <div className="flex flex-col">
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
            isOpen={openItems.has(faq.id)}
            onToggle={() => onToggle(faq.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default function FAQSection({ faqs }: FaqSectionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("");

  if (faqs.length === 0) {
    return null;
  }

  // Group FAQs by category
  const faqsByCategory = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, Faq[]>);

  const categories = Object.keys(faqsByCategory);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    const element = document.getElementById(
      category.toLowerCase().replace(/\s+/g, "-")
    );
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen bg-white dark:bg-black py-20 px-6 md:px-12">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <h1 className="text-5xl md:text-6xl text-gray-900 dark:text-white mb-4">
          Everything you need <br /> to know
        </h1>
        <p className="text-xs text-gray-400 font-medium">
          Last update: December 2025
        </p>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Sidebar (3 Kolom) */}
        <div className="md:col-span-3">
          <SidebarNav
            categories={categories}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
          />
        </div>

        {/* FAQ List (9 Kolom) */}
        <div className="md:col-span-9">
          {categories.map((category) => (
            <FAQCategory
              key={category}
              title={category}
              faqs={faqsByCategory[category]}
              openItems={openItems}
              onToggle={toggleItem}
            />
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Still have questions?
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
}
