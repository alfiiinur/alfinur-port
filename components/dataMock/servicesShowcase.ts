export interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  image?: string;
  bgColor: string;
  size: "small" | "medium" | "large";
}

export const showcaseItems: ShowcaseItem[] = [
  {
    id: "brand-strategy",
    title: "Brand Strategy & Identity",
    category: "Branding",
    bgColor: "bg-slate-800",
    size: "small",
  },
  {
    id: "ui-design",
    title: "UI & UX Design & Development",
    category: "Design",
    bgColor: "bg-slate-700",
    size: "small",
  },
  {
    id: "featured-work",
    title: "Featured Project",
    category: "Web Design",
    bgColor: "bg-amber-200",
    size: "large",
  },
  {
    id: "3d-design",
    title: "3D & Graphic Design",
    category: "3D Design",
    bgColor: "bg-purple-300",
    size: "medium",
  },
  {
    id: "consulting",
    title: "Consulting Campaign & Strategy",
    category: "Consulting",
    bgColor: "bg-slate-800",
    size: "medium",
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
