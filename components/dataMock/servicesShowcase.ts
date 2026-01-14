export interface ShowcaseItem {
  id: string;
  title: { en: string; id: string };
  category: { en: string; id: string };
  bgColor: string;
  size: "small" | "medium" | "large";
  media?: string;
  mediaType?: "image" | "video";
}

export const showcaseItems: ShowcaseItem[] = [
  {
    id: "brand-strategy",
    title: {
      en: "Brand Strategy & Identity",
      id: "Strategi & Identitas Merek",
    },
    category: {
      en: "Branding",
      id: "Branding",
    },
    bgColor: "bg-slate-800",
    size: "small",
    media: "/frontend/servis/servis1.png",
    mediaType: "image",
  },
  {
    id: "ui-design",
    title: {
      en: "UI & UX Design & Development",
      id: "Desain & Pengembangan UI/UX",
    },
    category: {
      en: "Design",
      id: "Desain",
    },
    bgColor: "bg-slate-700",
    size: "small",
    media: "/frontend/servis/servis2.png",
    mediaType: "image",
  },
  {
    id: "featured-work",
    title: {
      en: "Featured Project",
      id: "Proyek Unggulan",
    },
    category: {
      en: "Web Design",
      id: "Desain Web",
    },
    bgColor: "bg-amber-200",
    size: "medium",
    media: "/frontend/servis/servis3.png",
    mediaType: "image",
  },
  {
    id: "ai-work",
    title: {
      en: "AI Project",
      id: "Proyek AI",
    },
    category: {
      en: "AI Project",
      id: "Proyek AI",
    },
    bgColor: "bg-amber-200",
    size: "medium",
    media: "/frontend/servis/servis6.png",
    mediaType: "image",
  },
  {
    id: "IT Support",
    title: {
      en: "IT Support",
      id: "IT Support",
    },
    category: {
      en: "IT Support",
      id: "IT Support",
    },
    bgColor: "bg-purple-300",
    size: "medium",
    media: "/frontend/servis/servis4.png",
    mediaType: "image",
  },
  {
    id: "consulting",
    title: {
      en: "Consulting Campaign & Strategy",
      id: "Konsultasi Kampanye & Strategi",
    },
    category: {
      en: "Consulting",
      id: "Konsultasi",
    },
    bgColor: "bg-slate-800",
    size: "medium",
    media: "/frontend/servis/servis5.png",
    mediaType: "image",
  },
];

export interface WorkProcessStep {
  number: string;
  title: string;
  description: string;
  image?: string;
}

export const workProcessSteps: WorkProcessStep[] = [
  {
    number: "01",
    title: "DISCOVER",
    description:
      "We start by understanding your business, goals, and challenges. Through research and analysis, we identify opportunities and define the project scope.",
  },
  {
    number: "02",
    title: "DEFINE",
    description:
      "We create a detailed plan, set clear objectives, and establish the project roadmap. This phase ensures alignment between your vision and our execution.",
  },
  {
    number: "03",
    title: "DESIGN",
    description:
      "Our creative team brings ideas to life through wireframes, prototypes, and visual designs. We iterate based on your feedback to achieve perfection.",
  },
  {
    number: "04",
    title: "DELIVER",
    description:
      "We develop, test, and launch your project with precision. Post-launch support ensures everything runs smoothly and exceeds expectations.",
  },
];
