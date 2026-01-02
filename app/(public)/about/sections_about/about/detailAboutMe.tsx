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
      <section className="py-12 sm:py-20 md:py-32 px-4 sm:px-6 bg-white dark:bg-black transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-1 gap-8 lg:gap-12 items-center">
            {/* Stats Section with side-by-side layout */}
            <div className="mb-12 sm:mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                {/* Left side - Title & Description */}
                <div>
                  <SectionLabel text={t("statistics")} />
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold dark:text-white mt-4 sm:mt-6 tracking-tight leading-tight text-black">
                    {t("numbersThatSpeak")}
                  </h2>
                  <p className="dark:text-gray-400 mt-4 sm:mt-6 text-xs sm:text-sm md:text-base leading-relaxed max-w-md text-black">
                    {t("statisticsDescription")}
                  </p>
                </div>

                {/* Right side - Stats Grid */}
                <div>
                  <StatsGrid />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
