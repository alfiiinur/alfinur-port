"use client";

import RichHeading from "@/components/public/shared/hiding/HidingRich";
import { InlineImage } from "@/components/public/shared/hiding/InlineImage.";
import { FlipText, SlickyText, RevealText } from "@/components/ui/flip-text";

const iconCode = "/frontend/iconWeb/internet-world.gif";
const iconDesign = "/frontend/iconWeb/server-security.gif";
const iconSolution = "/frontend/iconWeb/technical-support.png";

export const RichHeadingSection = () => {
  return (
    <>
      <section className="bg-white min-h-[50vh] flex items-center justify-center mt-20 dark:bg-black">
        <RichHeading
          badge="About Me"
          description="I'm a passionate IT Developer from Indonesia, dedicated to creating innovative digital solutions that combine creativity with technical excellence."
        >
          <SlickyText text="A" delay={0} />{" "}
          <FlipText
            words={["creative", "passionate", "innovative", "dedicated"]}
            className="text-blue-500"
            duration={2500}
          />{" "}
          <SlickyText text="developer" delay={0.1} />
          <InlineImage src={iconCode} alt="Code Icon" className="bg-white" />
          <RevealText text="passionate about building" delay={0.3} />
          <InlineImage
            src={iconDesign}
            alt="Design Icon"
            className="bg-white"
          />
          <SlickyText
            text="modern web applications with cutting-edge"
            delay={0.5}
          />
          <InlineImage
            src={iconSolution}
            alt="Solution Icon"
            className="bg-blue-50"
          />
          <RevealText text="technologies." delay={0.7} />
        </RichHeading>
      </section>
    </>
  );
};
