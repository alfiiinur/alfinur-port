import RichHeading from "@/components/public/shared/hiding/HidingRich";
import { InlineImage } from "@/components/public/shared/hiding/InlineImage.";
const iconTeam = "/img/room.jpg"; // Icon Orang
const iconTarget = "/img/room.jpg"; // Icon Target/Bunga
const iconChart = "/img/room.jpg"; // Icon Chart
export const RichHeadingSection = () => {
  return (
    <>
      <section className="bg-white min-h-[50vh] flex items-center justify-center mt-20 dark:bg-black">
        <RichHeading
          badge="About Us"
          description="We're crafting an all-in-one platform designed for modern marketing teams to track and optimize their growth effortlessly."
        >
          {/* Disini kita menyusun Teks dan Image secara Inline */}
          A passionate team
          <InlineImage
            src={iconTeam}
            alt="Team Icon"
            className="bg-orange-50"
          />
          dedicated to driving your
          <InlineImage
            src={iconTarget}
            alt="Success Icon"
            className="bg-red-50"
          />
          success with cutting-edge marketing attribution
          <InlineImage
            src={iconChart}
            alt="Chart Icon"
            className="bg-blue-50"
          />
          solutions.
        </RichHeading>
      </section>
    </>
  );
};
