import { StaticImageData } from "next/image";
import { ReactNode } from "react";

export interface AwardData {
  id: string | number;
  name: string;
  description: string;
  year: string;
  certificateUrl?: string; // URL to certificate file (PDF/image)
  certificateImage?: string; // Preview image of certificate
  popupImages?: string[]; // Custom popup images for hover effect
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
