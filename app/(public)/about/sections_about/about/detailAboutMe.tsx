"use client";

import { techstack } from "@/components/dataMock/techstack";
import { MarqueTemp } from "@/components/public/shared/MarqueTemp";
import SectionLabel from "@/components/public/shared/SectionLabel";
import StatsGrid from "../achievements/StatsGrid";
import { useLanguage } from "@/lib/hooks/useLanguage";

export const DetailAboutMe = () => {
  const { t } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto py-8 sm:py-12 px-4 overflow-hidden">
      <div className="overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-black dark:text-white mb-4 sm:mb-8 italic">
            {t("technicalExpertise")}
          </h1>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-black dark:text-white mb-4 sm:mb-8 italic">
            {t("skillsTitle")}
          </h1>
        </div>

        <MarqueTemp reviews={techstack} size="md" />
      </div>
    </section>
  );
};
