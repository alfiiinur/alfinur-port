// Data list service dengan detail
export interface ServiceItem {
  id: number;
  name: string;
  title: string;
  description: string;
  image: string;
  label: string;
}

export const services: string[] = [
  "Logo Design",
  "Visual Refreshment",
  "Brand Guidelines",
  "Infographic Design",
  "Brand Implementation",
  "Social Media Design",
  "Stationary Design",
  "Print Design",
  "Pitch Deck Design",
];

export const serviceDetails: ServiceItem[] = [
  {
    id: 1,
    name: "Logo Design",
    title: "Logo\nDesign",
    description:
      "We craft memorable logos that capture your brand essence and create lasting impressions across all touchpoints.",
    image: "/img/room.jpg",
    label: "LOGO",
  },
  {
    id: 2,
    name: "Visual Refreshment",
    title: "Visual\nRefreshment",
    description:
      "Revitalize your existing brand with modern updates while maintaining the core identity your audience knows.",
    image: "/img/room.jpg",
    label: "VISUAL",
  },
  {
    id: 3,
    name: "Brand Guidelines",
    title: "Brand\nGuidelines",
    description:
      "Comprehensive brand books that ensure consistency across all channels and team members.",
    image: "/img/room.jpg",
    label: "BRAND",
  },
  {
    id: 4,
    name: "Infographic Design",
    title: "Infographic\nDesign",
    description:
      "Transform complex data into visually compelling stories that engage and inform your audience.",
    image: "/img/room.jpg",
    label: "INFOGRAPHIC",
  },
  {
    id: 5,
    name: "Brand Implementation",
    title: "Brand\nImplementation",
    description:
      "Seamless rollout of your brand identity across all platforms, materials, and touchpoints.",
    image: "/img/room.jpg",
    label: "IMPLEMENT",
  },
  {
    id: 6,
    name: "Social Media Design",
    title: "Social Media\nDesign",
    description:
      "Scroll-stopping social content that builds engagement and strengthens your online presence.",
    image: "/img/room.jpg",
    label: "SOCIAL",
  },
  {
    id: 7,
    name: "Stationary Design",
    title: "Stationary\nDesign",
    description:
      "Professional business cards, letterheads, and corporate materials that leave lasting impressions.",
    image: "/img/room.jpg",
    label: "STATIONARY",
  },
  {
    id: 8,
    name: "Print Design",
    title: "Print\nDesign",
    description:
      "High-impact print materials from brochures to packaging that communicate your brand story.",
    image: "/img/room.jpg",
    label: "PRINT",
  },
  {
    id: 9,
    name: "Pitch Deck Design",
    title: "Pitch Deck\nDesign",
    description:
      "Persuasive presentation designs that help you win clients, investors, and opportunities.",
    image: "/img/room.jpg",
    label: "PITCH",
  },
];

// Default content
export const defaultServiceContent = {
  id: 0,
  title: "Graphic &\nBranding\nDesign",
  description:
    "We design cohesive visual identities—from logos to brand systems—that scale with your business.",
  image: "/frontend/webImg/26.png",
  label: "CELERO",
};
