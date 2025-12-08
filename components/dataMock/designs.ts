export interface Design {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  year: string;
  client?: string;
  image?: string;
  images?: string[];
  featured?: boolean;
  content?: string;
}

export interface DesignCategory {
  name: string;
  count: number;
}

export const designCategories: DesignCategory[] = [
  { name: "All", count: 12 },
  { name: "Web Design", count: 5 },
  { name: "Branding", count: 3 },
  { name: "UI/UX", count: 4 },
];

export const designs: Design[] = [
  {
    id: "1",
    slug: "modern-ecommerce-platform",
    title: "Modern E-commerce Platform",
    description:
      "A sleek and intuitive e-commerce platform with advanced filtering and seamless checkout experience.",
    category: "Web Design",
    tags: ["E-commerce", "React", "Tailwind"],
    year: "2024",
    client: "TechStore Inc.",
    featured: true,
    content: `A comprehensive e-commerce solution designed to provide users with an exceptional shopping experience. The platform features advanced product filtering, real-time inventory updates, and a streamlined checkout process.

## Project Overview

This project aimed to create a modern, user-friendly e-commerce platform that could handle high traffic while maintaining excellent performance. The design focuses on clarity, ease of navigation, and conversion optimization.

### Key Features

- Advanced product search and filtering
- Real-time inventory management
- One-click checkout process
- Responsive design for all devices
- Integrated payment gateway
- Customer review system

### Design Process

The design process began with extensive user research to understand shopping behaviors and pain points. We created multiple prototypes and conducted A/B testing to optimize the user flow.

### Results

The platform achieved a 45% increase in conversion rates and a 60% reduction in cart abandonment compared to the previous version.`,
  },
  {
    id: "2",
    slug: "fintech-mobile-app",
    title: "FinTech Mobile App",
    description:
      "A secure and user-friendly mobile banking application with advanced financial management features.",
    category: "UI/UX",
    tags: ["Mobile", "Finance", "iOS"],
    year: "2024",
    client: "SecureBank",
    featured: true,
    content: `A revolutionary mobile banking app that puts financial control in users' hands. The app combines security with simplicity, making complex financial operations accessible to everyone.`,
  },
  {
    id: "3",
    slug: "sustainable-brand-identity",
    title: "Sustainable Brand Identity",
    description:
      "Complete brand identity for an eco-friendly startup, including logo, color palette, and brand guidelines.",
    category: "Branding",
    tags: ["Logo", "Brand Identity", "Sustainability"],
    year: "2024",
    client: "GreenLife Co.",
    content: `A comprehensive brand identity that reflects the company's commitment to sustainability and environmental responsibility.`,
  },
  {
    id: "4",
    slug: "saas-dashboard-redesign",
    title: "SaaS Dashboard Redesign",
    description:
      "Complete overhaul of a complex analytics dashboard, improving usability and data visualization.",
    category: "UI/UX",
    tags: ["Dashboard", "Analytics", "SaaS"],
    year: "2024",
    client: "DataViz Pro",
    featured: true,
    content: `Transforming complex data into actionable insights through intuitive design and smart visualizations.`,
  },
  {
    id: "5",
    slug: "restaurant-website",
    title: "Premium Restaurant Website",
    description:
      "Elegant website for a fine dining restaurant with online reservation system and menu showcase.",
    category: "Web Design",
    tags: ["Restaurant", "Booking", "Luxury"],
    year: "2023",
    client: "La Cuisine",
    content: `A sophisticated web presence that captures the essence of fine dining and makes reservations effortless.`,
  },
  {
    id: "6",
    slug: "fitness-app-ui",
    title: "Fitness Tracking App",
    description:
      "Motivating and intuitive fitness app design with workout tracking and progress visualization.",
    category: "UI/UX",
    tags: ["Mobile", "Fitness", "Health"],
    year: "2023",
    client: "FitLife",
    content: `An engaging fitness app that motivates users to achieve their health goals through gamification and social features.`,
  },
  {
    id: "7",
    slug: "tech-startup-branding",
    title: "Tech Startup Branding",
    description:
      "Modern and bold brand identity for an AI-powered tech startup, including logo and marketing materials.",
    category: "Branding",
    tags: ["Logo", "Tech", "AI"],
    year: "2023",
    client: "NeuralTech",
    content: `A cutting-edge brand identity that communicates innovation and technological excellence.`,
  },
  {
    id: "8",
    slug: "real-estate-platform",
    title: "Real Estate Platform",
    description:
      "Comprehensive property listing platform with virtual tours and advanced search capabilities.",
    category: "Web Design",
    tags: ["Real Estate", "3D Tours", "Search"],
    year: "2023",
    client: "HomeFind",
    content: `A powerful real estate platform that makes property hunting easier with virtual tours and smart search.`,
  },
  {
    id: "9",
    slug: "coffee-shop-branding",
    title: "Artisan Coffee Shop Brand",
    description:
      "Warm and inviting brand identity for a local coffee shop, including packaging and signage.",
    category: "Branding",
    tags: ["Coffee", "Packaging", "Local"],
    year: "2023",
    client: "Brew & Co.",
    content: `A cozy brand identity that captures the warmth and community spirit of a neighborhood coffee shop.`,
  },
  {
    id: "10",
    slug: "education-platform",
    title: "Online Learning Platform",
    description:
      "Interactive e-learning platform with course management and student progress tracking.",
    category: "Web Design",
    tags: ["Education", "LMS", "Interactive"],
    year: "2023",
    client: "EduTech",
    content: `An engaging learning platform that makes education accessible and enjoyable for students of all ages.`,
  },
  {
    id: "11",
    slug: "healthcare-app",
    title: "Telemedicine App",
    description:
      "Secure healthcare app connecting patients with doctors through video consultations.",
    category: "UI/UX",
    tags: ["Healthcare", "Telemedicine", "Mobile"],
    year: "2023",
    client: "HealthConnect",
    content: `A trusted telemedicine platform that brings quality healthcare to patients wherever they are.`,
  },
  {
    id: "12",
    slug: "portfolio-website",
    title: "Creative Portfolio Website",
    description:
      "Stunning portfolio website for a photographer showcasing their work in an immersive gallery.",
    category: "Web Design",
    tags: ["Portfolio", "Photography", "Gallery"],
    year: "2023",
    client: "Alex Photography",
    content: `A visually striking portfolio that lets the photography speak for itself while providing seamless navigation.`,
  },
];

// Helper functions
export function getDesignBySlug(slug: string): Design | undefined {
  return designs.find((design) => design.slug === slug);
}

export function getRelatedDesigns(
  currentSlug: string,
  limit: number = 3
): Design[] {
  const currentDesign = getDesignBySlug(currentSlug);
  if (!currentDesign) return [];

  return designs
    .filter(
      (design) =>
        design.slug !== currentSlug &&
        design.category === currentDesign.category
    )
    .slice(0, limit);
}
