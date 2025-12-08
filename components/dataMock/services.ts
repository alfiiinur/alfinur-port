export interface ServiceStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  priceDetail?: string;
  features: string[];
  popular?: boolean;
  steps: ServiceStep[];
}

export const servicesData: ServiceCard[] = [
  {
    id: "web-design",
    title: "Website Design",
    category: "Design",
    description: "Modern, responsive websites tailored to your brand identity",
    price: "$2,500",
    priceDetail: "Starting from",
    popular: true,
    features: [
      "Responsive Design",
      "SEO Optimized",
      "Fast Loading",
      "Cross-browser Compatible",
      "Mobile First Approach",
    ],
    steps: [
      {
        step: 1,
        title: "Discovery & Research",
        description:
          "Understanding your business goals, target audience, and competitors",
        icon: "🔍",
      },
      {
        step: 2,
        title: "Planning & Strategy",
        description:
          "Creating wireframes, sitemap, and defining the project scope",
        icon: "📋",
      },
      {
        step: 3,
        title: "Design & Prototype",
        description:
          "Crafting visual designs and interactive prototypes for approval",
        icon: "🎨",
      },
      {
        step: 4,
        title: "Development",
        description: "Building the website with clean code and best practices",
        icon: "💻",
      },
      {
        step: 5,
        title: "Testing & Launch",
        description:
          "Quality assurance, bug fixes, and deployment to production",
        icon: "🚀",
      },
    ],
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    category: "Design",
    description:
      "Eye-catching visuals that communicate your message effectively",
    price: "$500",
    priceDetail: "Per project",
    features: [
      "Brand Identity",
      "Logo Design",
      "Marketing Materials",
      "Social Media Graphics",
      "Print Design",
    ],
    steps: [
      {
        step: 1,
        title: "Brief & Consultation",
        description:
          "Discussing your vision, brand values, and design requirements",
        icon: "💬",
      },
      {
        step: 2,
        title: "Concept Development",
        description: "Creating initial design concepts and mood boards",
        icon: "💡",
      },
      {
        step: 3,
        title: "Design Refinement",
        description: "Iterating based on feedback to perfect the design",
        icon: "✨",
      },
      {
        step: 4,
        title: "Finalization",
        description: "Preparing final files in all required formats",
        icon: "✅",
      },
      {
        step: 5,
        title: "Delivery & Support",
        description: "Providing design files and usage guidelines",
        icon: "📦",
      },
    ],
  },
  {
    id: "it-consulting",
    title: "IT Consulting",
    category: "Consulting",
    description:
      "Strategic technology guidance to optimize your business operations",
    price: "$150",
    priceDetail: "Per hour",
    features: [
      "Technology Assessment",
      "System Architecture",
      "Security Audit",
      "Performance Optimization",
      "Digital Transformation",
    ],
    steps: [
      {
        step: 1,
        title: "Initial Assessment",
        description:
          "Evaluating current infrastructure and identifying pain points",
        icon: "🔎",
      },
      {
        step: 2,
        title: "Analysis & Planning",
        description: "Developing a comprehensive strategy and roadmap",
        icon: "📊",
      },
      {
        step: 3,
        title: "Implementation",
        description:
          "Executing solutions with minimal disruption to operations",
        icon: "⚙️",
      },
      {
        step: 4,
        title: "Training & Documentation",
        description: "Empowering your team with knowledge and resources",
        icon: "📚",
      },
      {
        step: 5,
        title: "Ongoing Support",
        description: "Providing continuous monitoring and optimization",
        icon: "🛠️",
      },
    ],
  },
];
