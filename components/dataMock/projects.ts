export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  thumbnail: string;
  images: string[];
  client: string;
  date: string;
  tags: string[];
  link?: string;
}

export const projectCategories = [
  "All",
  "Web Design",
  "Mobile App",
  "Branding",
  "UI/UX",
  "Illustration",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug);
};

export const getRelatedProjects = (
  slug: string,
  limit: number = 3
): Project[] => {
  const currentProject = getProjectBySlug(slug);
  if (!currentProject) return [];

  return projects
    .filter(
      (project) =>
        project.slug !== slug && project.category === currentProject.category
    )
    .slice(0, limit);
};

export const projects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform Redesign",
    slug: "ecommerce-platform-redesign",
    category: "Web Design",
    description:
      "Complete redesign of an e-commerce platform focusing on user experience and conversion optimization. The project involved extensive user research, wireframing, and iterative design processes.",
    thumbnail: "/img/project-1.jpg",
    images: ["/img/project-1.jpg", "/img/project-1-2.jpg"],
    client: "TechStore Inc.",
    date: "2024-01",
    tags: ["E-Commerce", "UX Design", "Responsive"],
    link: "https://example.com",
  },
  {
    id: "2",
    title: "Finance Mobile App",
    slug: "finance-mobile-app",
    category: "Mobile App",
    description:
      "A comprehensive mobile banking application with intuitive interface for managing personal finances, investments, and transactions.",
    thumbnail: "/img/project-2.jpg",
    images: ["/img/project-2.jpg"],
    client: "FinBank",
    date: "2024-02",
    tags: ["Mobile", "Finance", "iOS", "Android"],
  },
  {
    id: "3",
    title: "Brand Identity System",
    slug: "brand-identity-system",
    category: "Branding",
    description:
      "Complete brand identity development including logo design, color palette, typography, and brand guidelines for a startup company.",
    thumbnail: "/img/project-3.jpg",
    images: ["/img/project-3.jpg"],
    client: "StartupX",
    date: "2024-03",
    tags: ["Logo", "Brand Guidelines", "Visual Identity"],
  },
  {
    id: "4",
    title: "Healthcare Dashboard",
    slug: "healthcare-dashboard",
    category: "UI/UX",
    description:
      "An intuitive dashboard for healthcare professionals to monitor patient data, appointments, and medical records efficiently.",
    thumbnail: "/img/project-4.jpg",
    images: ["/img/project-4.jpg"],
    client: "MedCare Solutions",
    date: "2024-04",
    tags: ["Dashboard", "Healthcare", "Data Visualization"],
  },
  {
    id: "5",
    title: "Digital Art Collection",
    slug: "digital-art-collection",
    category: "Illustration",
    description:
      "A series of digital illustrations created for marketing campaigns and social media content.",
    thumbnail: "/img/project-5.jpg",
    images: ["/img/project-5.jpg"],
    client: "Creative Agency",
    date: "2024-05",
    tags: ["Digital Art", "Illustration", "Marketing"],
  },
  {
    id: "6",
    title: "Restaurant Website",
    slug: "restaurant-website",
    category: "Web Design",
    description:
      "Modern and elegant website design for a fine dining restaurant with online reservation system and menu showcase.",
    thumbnail: "/img/project-6.jpg",
    images: ["/img/project-6.jpg"],
    client: "Gourmet Kitchen",
    date: "2024-06",
    tags: ["Restaurant", "Web Design", "Booking System"],
  },
];
