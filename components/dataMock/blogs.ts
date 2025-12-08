export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author?: string;
  image?: string;
  featured?: boolean;
  content?: string;
}

export interface BlogCategory {
  name: string;
  count: number;
}

export const blogCategories: BlogCategory[] = [
  { name: "All", count: 24 },
  { name: "Acquisitions", count: 8 },
  { name: "Market", count: 12 },
  { name: "Finance", count: 4 },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "market-changes-2025-trends",
    title: "Market changes in 2025, all the trends",
    excerpt:
      "Exploring the latest market trends and what they mean for investors and businesses in the coming year.",
    category: "Market Now",
    readTime: "7 min read",
    date: "2024-12-01",
    author: "John Anderson",
    featured: true,
    content: `The real estate market is experiencing unprecedented changes as we approach 2025. Understanding these trends is crucial for investors, homeowners, and industry professionals alike.

## Key Market Trends

The landscape of real estate is shifting dramatically. From technological innovations to changing buyer preferences, several factors are reshaping how we think about property investment and ownership.

### Digital Transformation

Technology continues to revolutionize the real estate industry. Virtual tours, AI-powered property valuations, and blockchain-based transactions are becoming mainstream. These innovations are making the buying and selling process more efficient and transparent.

### Sustainability Focus

Environmental consciousness is no longer optional. Properties with green certifications and sustainable features are commanding premium prices. Solar panels, energy-efficient systems, and eco-friendly materials are becoming standard expectations rather than luxury additions.

### Remote Work Impact

The shift to remote and hybrid work models has fundamentally changed housing preferences. Suburban and rural areas are seeing increased demand as buyers prioritize space and quality of life over proximity to urban centers.

## Investment Opportunities

Smart investors are adapting their strategies to capitalize on these trends. Multi-family properties in emerging markets, sustainable developments, and tech-enabled buildings are showing strong returns.

### Market Predictions

Experts predict continued growth in specific sectors, with particular emphasis on properties that offer flexibility, sustainability, and technological integration. The key is to stay informed and adapt quickly to changing conditions.`,
  },
  {
    id: "2",
    slug: "increasing-mortgage-rates",
    title: "Increasing Mortgage in the years",
    excerpt:
      "Understanding the factors driving mortgage rate increases and how to navigate the changing landscape.",
    category: "Acquisitions",
    readTime: "5 min read",
    date: "2024-11-28",
    author: "Sarah Mitchell",
    featured: true,
    content: `Mortgage rates have been on an upward trajectory, affecting both first-time buyers and seasoned investors. This comprehensive guide will help you understand the factors at play and how to make informed decisions.

## Understanding Rate Increases

Multiple economic factors contribute to rising mortgage rates. Federal Reserve policies, inflation concerns, and global economic conditions all play significant roles in determining the cost of borrowing.

### Impact on Buyers

Higher rates mean increased monthly payments and reduced purchasing power. However, this doesn't mean homeownership is out of reach. Strategic planning and understanding your options can help you navigate this challenging environment.

## Strategies for Success

Consider adjustable-rate mortgages for short-term ownership plans, explore first-time buyer programs, and work on improving your credit score to secure better rates. Timing and preparation are crucial in today's market.`,
  },
  {
    id: "3",
    slug: "homes-becoming-working-places",
    title: "How homes are becoming working places",
    excerpt:
      "The evolution of home offices and how modern architecture adapts to remote work culture.",
    category: "Architecture",
    readTime: "6 min read",
    date: "2024-11-25",
    author: "Michael Chen",
    content: `The traditional separation between home and workplace is dissolving. Modern architecture is responding to this shift with innovative designs that seamlessly integrate professional and personal spaces.

## The New Home Office

Today's home offices are far more sophisticated than a desk in the corner. Dedicated spaces with proper lighting, soundproofing, and ergonomic design are becoming essential features in new constructions and renovations.

### Design Considerations

Natural light, acoustic treatment, and flexible layouts are key considerations. Architects are creating spaces that can adapt to different work styles and family needs, ensuring functionality without sacrificing aesthetics.`,
  },
  {
    id: "4",
    slug: "mortgage-trends-predictions",
    title: "Increasing Mortgage in the years",
    excerpt:
      "A deep dive into mortgage trends and predictions for the real estate market.",
    category: "Architecture",
    readTime: "8 min read",
    date: "2024-11-22",
    author: "Emily Rodriguez",
    content: `Long-term mortgage trends reveal fascinating patterns that can help predict future market movements. This analysis examines historical data and expert forecasts to provide actionable insights.`,
  },
  {
    id: "5",
    slug: "sustainable-architecture-modern-living",
    title: "Sustainable Architecture for Modern Living",
    excerpt:
      "How eco-friendly design principles are shaping the future of residential and commercial spaces.",
    category: "Market",
    readTime: "6 min read",
    date: "2024-11-20",
    author: "David Park",
    content: `Sustainable architecture is no longer a niche concept—it's the future of building design. From passive solar design to green roofs, eco-friendly features are becoming standard in modern construction.`,
  },
  {
    id: "6",
    slug: "investment-strategies-2025",
    title: "Investment Strategies for 2025",
    excerpt:
      "Expert insights on property investment opportunities and risk management strategies.",
    category: "Finance",
    readTime: "9 min read",
    date: "2024-11-18",
    author: "Jennifer Lee",
    content: `Successful real estate investment requires careful planning and strategic thinking. This guide outlines proven strategies for maximizing returns while managing risk in today's dynamic market.`,
  },
  {
    id: "7",
    slug: "rise-of-smart-homes",
    title: "The Rise of Smart Homes",
    excerpt:
      "Technology integration in modern homes and its impact on property values.",
    category: "Market",
    readTime: "5 min read",
    date: "2024-11-15",
    author: "Robert Taylor",
    content: `Smart home technology is transforming how we interact with our living spaces. From automated climate control to advanced security systems, these innovations are adding significant value to properties.`,
  },
  {
    id: "8",
    slug: "commercial-real-estate-outlook",
    title: "Commercial Real Estate Outlook",
    excerpt:
      "Analyzing the commercial property market and emerging opportunities for investors.",
    category: "Acquisitions",
    readTime: "7 min read",
    date: "2024-11-12",
    author: "Amanda White",
    content: `The commercial real estate sector is evolving rapidly. Understanding current trends and future projections is essential for investors looking to capitalize on emerging opportunities in this dynamic market.`,
  },
];

// Helper function to get blog post by slug
export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

// Helper function to get related posts
export function getRelatedPosts(
  currentSlug: string,
  limit: number = 3
): BlogPost[] {
  const currentPost = getBlogBySlug(currentSlug);
  if (!currentPost) return [];

  return blogPosts
    .filter(
      (post) =>
        post.slug !== currentSlug && post.category === currentPost.category
    )
    .slice(0, limit);
}

export interface Office {
  id: string;
  name: string;
  location: string;
  address: string;
  image?: string;
}

export const offices: Office[] = [
  {
    id: "1",
    name: "Main Office",
    location: "Los Angeles",
    address: "Open Park S, Covina del Mar, CA 92625",
  },
  {
    id: "2",
    name: "Secondary Office",
    location: "Los Angeles",
    address: "383 Larkpur Ave, Covina del Mar, CA 92625",
  },
  {
    id: "3",
    name: "Law & Mortgage Office",
    location: "Los Angeles",
    address: "574 La Veta Ave, Covina del Mar, CA 92625",
  },
];
