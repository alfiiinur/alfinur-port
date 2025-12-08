import {
  AwardData,
  TestimonialData,
} from "@/app/(public)/about/sections_about/achievements/types";

export const awards: AwardData[] = [
  {
    id: 1,
    name: "Awwwards Site of the Year",
    description: "Recognized for outstanding design and user experience",
    year: "2024",
  },
  {
    id: 2,
    name: "CSS Design Awards",
    description: "Best UI, UX and Innovation",
    year: "2024",
  },
  // ...
];

export const testimonials: TestimonialData[] = [
  {
    id: 1,
    quote: "Working with this team increased our conversion rate dramatically.",
    authorName: "Sarah Chen",
    authorRole: "CMO at TechCorp",
    authorImage: "/img/room.jpg",
    isHighlight: true,
    highlightStat: "8X",
    highlightText: "Increase in conversion rate",
  },
  {
    id: 2,
    quote: "The best creative partner we've ever had. Period.",
    authorName: "Michael Rivera",
    authorRole: "CEO at StartupX",
    authorImage: "/img/room.jpg",
  },
  // ...
];
