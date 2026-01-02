"use client";

import RichHeading from "@/components/public/shared/hiding/HidingRich";
import { InlineImage } from "@/components/public/shared/hiding/InlineImage.";
import { FlipText, SlickyText, RevealText } from "@/components/ui/flip-text";
import { useLanguage } from "@/lib/hooks/useLanguage";

const iconCode = "/frontend/iconWeb/internet-world.gif";
const iconDesign = "/frontend/iconWeb/server-security.gif";
const iconSolution = "/frontend/iconWeb/technical-support.png";

export const RichHeadingSection = () => {
  const { t, language } = useLanguage();

  // Get flip words based on language
  const flipWords = [
    t("richHeadingCreative"),
    t("richHeadingPassionate"),
    t("richHeadingInnovative"),
    t("richHeadingDedicated"),
  ];

  return (
    <>
      <section className="bg-white min-h-[50vh] flex items-center justify-center mt-20 dark:bg-black">
        <RichHeading
          badge={t("richHeadingBadge")}
          description={t("richHeadingDescription")}
        >
          <SlickyText text={language === "id" ? "Seorang" : "A"} delay={0} />{" "}
          <FlipText
            words={flipWords}
            className="text-blue-500"
            duration={2500}
          />{" "}
          <SlickyText text={t("richHeadingDeveloper")} delay={0.1} />
          <InlineImage src={iconCode} alt="Code Icon" className="bg-white" />
          <RevealText text={t("richHeadingPassionateAbout")} delay={0.3} />
          <InlineImage
            src={iconDesign}
            alt="Design Icon"
            className="bg-white"
          />
          <SlickyText text={t("richHeadingModernWeb")} delay={0.5} />
          <InlineImage
            src={iconSolution}
            alt="Solution Icon"
            className="bg-blue-50"
          />
          <RevealText text={t("richHeadingTechnologies")} delay={0.7} />
        </RichHeading>
      </section>
    </>
  );
};
