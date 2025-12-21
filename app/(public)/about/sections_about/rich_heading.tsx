import RichHeading from "@/components/public/shared/hiding/HidingRich";
import { InlineImage } from "@/components/public/shared/hiding/InlineImage.";

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
          A creative developer
          <InlineImage src={iconCode} alt="Code Icon" className="bg-white" />
          passionate about building
          <InlineImage
            src={iconDesign}
            alt="Design Icon"
            className="bg-white"
          />
          modern web applications with cutting-edge
          <InlineImage
            src={iconSolution}
            alt="Solution Icon"
            className="bg-blue-50"
          />
          technologies.
        </RichHeading>
      </section>
    </>
  );
};
