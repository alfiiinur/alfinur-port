import { RoundedButton } from "@/components/public/shared/RoundedButton";
import { TestimonialSlider } from "./testimonials/testimonialSlider";

export default function TestimonialPage() {
  return (
    <>
      <div className="bg-black dark:bg-white m-5 rounded-2xl p-10">
        <div className="flex justify-between items-center italic">
          <div>
            <h2 className="text-anton text-6xl md:text-7xl font-bold font-anton text-white dark:text-black text-left uppercase mb-6">
              {" "}
              Testimonials
            </h2>
            <p className="text-md md:text-lg text-left text-gray-500  mx-auto mb-10 dark:text-gray-400 ">
              Hear what others have to say about working with me.
            </p>
          </div>

          <RoundedButton
            href="/contact"
            className="bg-white text-black dark:text-white dark:bg-black "
          >
            Work With Me
          </RoundedButton>
        </div>

        <TestimonialSlider />
      </div>
    </>
  );
}
