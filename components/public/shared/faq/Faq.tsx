"use client";

import { faqData } from "@/components/dataMock/faq";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { SidebarNav } from "./SidebarNav.";
import { FAQCategory } from "./FaqCategory";

export default function FAQPage() {
  const { language } = useLanguage();

  // Extract topics untuk sidebar dengan bahasa yang sesuai
  const topics = faqData.map((cat) => ({
    id: cat.id,
    title: cat.title[language],
  }));

  const content = {
    en: {
      heading: "Everything you need",
      headingLine2: "to know",
      lastUpdate: "Last update: May 12, 2025",
    },
    id: {
      heading: "Semua yang perlu Anda",
      headingLine2: "ketahui",
      lastUpdate: "Terakhir diperbarui: 12 Mei 2025",
    },
  };

  const t = content[language];

  return (
    <main className="min-h-screen bg-white text-gray-900 py-20 px-6 md:px-12">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <h1 className="text-5xl md:text-6xl text-gray-900 mb-4">
          {t.heading} <br /> {t.headingLine2}
        </h1>
        <p className="text-xs text-gray-400 font-medium">{t.lastUpdate}</p>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Sidebar (3 Kolom) */}
        <div className="md:col-span-3">
          <SidebarNav topics={topics} language={language} />
        </div>

        {/* FAQ List (9 Kolom) */}
        <div className="md:col-span-9">
          {faqData.map((category) => (
            <FAQCategory
              key={category.id}
              category={category}
              language={language}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
