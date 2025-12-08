import { StaticImageData } from "next/image";
import { ReactNode } from "react";

export interface AwardData {
  id: string | number;
  name: string;
  description: string;
  year: string;
}

export interface TestimonialData {
  id: string | number;
  quote: string;
  authorName: string;
  authorRole: string;
  authorImage: string | StaticImageData;
  companyLogo?: ReactNode;
  isHighlight?: boolean;
  highlightStat?: string;
  highlightText?: string;
}

export interface AchievementsSectionProps {
  label?: string;
  title?: string;
  awards: AwardData[];
  testimonials: TestimonialData[];
}
