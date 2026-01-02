"use client";

import { RoundedButton } from "@/components/public/shared/RoundedButton";
import { TestimonialSlider } from "./testimonials/testimonialSlider";
import { useLanguage } from "@/lib/hooks/useLanguage";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  avatar: string | null;
  content: string;
  rating: number;
  projectType: string | null;
  media?: string[];
  isFeatured: boolean;
}

interface TestimonialPageProps {
  testimonials: Testimonial[];
}

export default function TestimonialPage({
  testimonials,
}: TestimonialPageProps) {
  const { language, t } = useLanguage();

  if (testimonials.length === 0) {
    return null;
  }

  const descEn = "Hear what others have to say about working with me.";
  const descId =
    "Dengarkan apa yang orang lain katakan tentang bekerja dengan saya.";

  const workWithMeEn = "Work With Me";
  const workWithMeId = "Bekerja Dengan Saya";

  return (
    <div className="bg-black dark:bg-white m-5 rounded-2xl p-10">
      <div className="flex justify-between items-center italic">
        <div>
          <h2 className="text-anton text-6xl md:text-7xl font-bold font-anton text-white dark:text-black text-left uppercase mb-6">
            {t("testimonials")}
          </h2>
          <p className="text-md md:text-lg text-left text-gray-500 mx-auto mb-10 dark:text-gray-400">
            {language === "id" ? descId : descEn}
          </p>
        </div>

        <RoundedButton
          href="/contact"
          className="bg-white text-black dark:text-white dark:bg-black"
        >
          {language === "id" ? workWithMeId : workWithMeEn}
        </RoundedButton>
      </div>

      <TestimonialSlider testimonials={testimonials} />
    </div>
  );
}
