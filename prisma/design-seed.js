import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// UI Design - 5 items
const uiDesigns = [
  {
    title: "Modern Dashboard UI Kit",
    slug: "modern-dashboard-ui-kit",
    description:
      "A comprehensive dashboard UI kit featuring clean layouts, data visualization components, and dark/light mode support. Perfect for admin panels and analytics platforms.",
    image: "/designs/ui/dashboard-ui-kit.jpg",
    media: [],
    category: "UI",
    tags: ["Dashboard", "UI Kit", "Admin Panel", "Dark Mode", "Analytics"],
    published: true,
  },
  {
    title: "E-Commerce Mobile App Design",
    slug: "ecommerce-mobile-app-design",
    description:
      "Complete mobile app design for e-commerce platform with product listings, cart, checkout flow, and user profile screens. Designed with modern iOS and Android guidelines.",
    image: "/designs/ui/ecommerce-mobile-app.jpg",
    media: [],
    category: "UI",
    tags: ["Mobile App", "E-Commerce", "iOS", "Android", "Shopping"],
    published: true,
  },
  {
    title: "SaaS Landing Page Design",
    slug: "saas-landing-page-design",
    description:
      "High-converting SaaS landing page design with hero section, features showcase, pricing tables, testimonials, and CTA sections. Optimized for conversions.",
    image: "/designs/ui/saas-landing-page.jpg",
    media: [],
    category: "UI",
    tags: ["Landing Page", "SaaS", "Web Design", "Conversion", "Marketing"],
    published: true,
  },
];
const moreUiDesigns = [
  {
    title: "Fintech Banking App Interface",
    slug: "fintech-banking-app-interface",
    description:
      "Modern fintech banking application interface with account overview, transaction history, money transfer, and investment tracking features.",
    image: "/designs/ui/fintech-banking-app.jpg",
    media: [],
    category: "UI",
    tags: ["Fintech", "Banking", "Mobile App", "Finance", "Investment"],
    published: true,
  },
  {
    title: "Healthcare Patient Portal",
    slug: "healthcare-patient-portal",
    description:
      "User-friendly healthcare patient portal design with appointment booking, medical records, prescription management, and telemedicine features.",
    image: "/designs/ui/healthcare-portal.jpg",
    media: [],
    category: "UI",
    tags: ["Healthcare", "Medical", "Portal", "Telemedicine", "Patient"],
    published: true,
  },
];

// Poster Design - 10 items
const posterDesigns = [
  {
    title: "Tech Conference 2025 Poster",
    slug: "tech-conference-2025-poster",
    description:
      "Eye-catching poster design for technology conference featuring futuristic elements, bold typography, and vibrant gradient colors.",
    image: "/designs/poster/tech-conference-poster.jpg",
    media: [],
    category: "Poster",
    tags: ["Conference", "Technology", "Event", "Futuristic", "Typography"],
    published: true,
  },
  {
    title: "Music Festival Summer Vibes",
    slug: "music-festival-summer-vibes",
    description:
      "Vibrant summer music festival poster with tropical elements, neon colors, and dynamic composition that captures the energy of live music.",
    image: "/designs/poster/music-festival-poster.jpg",
    media: [],
    category: "Poster",
    tags: ["Music", "Festival", "Summer", "Event", "Neon"],
    published: true,
  },
  {
    title: "Environmental Awareness Campaign",
    slug: "environmental-awareness-campaign",
    description:
      "Impactful environmental awareness poster highlighting climate change issues with powerful imagery and compelling call-to-action messaging.",
    image: "/designs/poster/environmental-poster.jpg",
    media: [],
    category: "Poster",
    tags: ["Environment", "Climate", "Awareness", "Campaign", "Nature"],
    published: true,
  },
  {
    title: "Startup Launch Event Poster",
    slug: "startup-launch-event-poster",
    description:
      "Professional startup launch event poster with modern geometric design, clean typography, and corporate color scheme.",
    image: "/designs/poster/startup-launch-poster.jpg",
    media: [],
    category: "Poster",
    tags: ["Startup", "Launch", "Business", "Event", "Corporate"],
    published: true,
  },
  {
    title: "Art Exhibition Gallery Poster",
    slug: "art-exhibition-gallery-poster",
    description:
      "Elegant art exhibition poster featuring minimalist design, artistic typography, and sophisticated color palette for gallery events.",
    image: "/designs/poster/art-exhibition-poster.jpg",
    media: [],
    category: "Poster",
    tags: ["Art", "Exhibition", "Gallery", "Minimalist", "Culture"],
    published: true,
  },
];
const morePosterDesigns = [
  {
    title: "Fitness Gym Motivation Poster",
    slug: "fitness-gym-motivation-poster",
    description:
      "High-energy fitness motivation poster with dynamic athlete imagery, bold motivational quotes, and intense color gradients.",
    image: "/designs/poster/fitness-gym-poster.jpg",
    media: [],
    category: "Poster",
    tags: ["Fitness", "Gym", "Motivation", "Sports", "Health"],
    published: true,
  },
  {
    title: "Film Festival Cinema Poster",
    slug: "film-festival-cinema-poster",
    description:
      "Cinematic film festival poster with dramatic lighting, movie reel elements, and classic Hollywood-inspired typography.",
    image: "/designs/poster/film-festival-poster.jpg",
    media: [],
    category: "Poster",
    tags: ["Film", "Cinema", "Festival", "Movie", "Entertainment"],
    published: true,
  },
  {
    title: "Food & Culinary Event Poster",
    slug: "food-culinary-event-poster",
    description:
      "Appetizing culinary event poster featuring gourmet food photography, elegant typography, and warm inviting colors.",
    image: "/designs/poster/food-culinary-poster.jpg",
    media: [],
    category: "Poster",
    tags: ["Food", "Culinary", "Restaurant", "Gourmet", "Event"],
    published: true,
  },
  {
    title: "Gaming Tournament Esports Poster",
    slug: "gaming-tournament-esports-poster",
    description:
      "Dynamic esports tournament poster with gaming elements, neon lighting effects, and competitive gaming atmosphere.",
    image: "/designs/poster/gaming-esports-poster.jpg",
    media: [],
    category: "Poster",
    tags: ["Gaming", "Esports", "Tournament", "Competition", "Neon"],
    published: true,
  },
  {
    title: "Fashion Week Runway Poster",
    slug: "fashion-week-runway-poster",
    description:
      "Sophisticated fashion week poster with haute couture aesthetics, elegant model silhouettes, and luxury brand styling.",
    image: "/designs/poster/fashion-week-poster.jpg",
    media: [],
    category: "Poster",
    tags: ["Fashion", "Runway", "Luxury", "Style", "Haute Couture"],
    published: true,
  },
];

// Product Design - 5 items
const productDesigns = [
  {
    title: "Smart Watch Product Showcase",
    slug: "smart-watch-product-showcase",
    description:
      "Premium smart watch product visualization with 3D rendering, multiple angle views, and lifestyle context shots for marketing materials.",
    image: "/designs/product/smart-watch-showcase.jpg",
    media: [],
    category: "Product",
    tags: ["Smart Watch", "Wearable", "3D Render", "Tech", "Lifestyle"],
    published: true,
  },
  {
    title: "Wireless Earbuds Packaging Design",
    slug: "wireless-earbuds-packaging-design",
    description:
      "Modern wireless earbuds packaging design with premium unboxing experience, sustainable materials concept, and brand identity integration.",
    image: "/designs/product/earbuds-packaging.jpg",
    media: [],
    category: "Product",
    tags: ["Earbuds", "Packaging", "Audio", "Premium", "Branding"],
    published: true,
  },
  {
    title: "Skincare Product Line Design",
    slug: "skincare-product-line-design",
    description:
      "Elegant skincare product line design featuring minimalist bottle designs, cohesive brand identity, and luxury cosmetic aesthetics.",
    image: "/designs/product/skincare-product-line.jpg",
    media: [],
    category: "Product",
    tags: ["Skincare", "Cosmetics", "Beauty", "Packaging", "Luxury"],
    published: true,
  },
  {
    title: "Coffee Brand Packaging System",
    slug: "coffee-brand-packaging-system",
    description:
      "Artisanal coffee brand packaging system with bag designs, label variations, and complete brand identity for specialty coffee roasters.",
    image: "/designs/product/coffee-packaging.jpg",
    media: [],
    category: "Product",
    tags: ["Coffee", "Packaging", "Branding", "Food", "Artisanal"],
    published: true,
  },
  {
    title: "Sustainable Water Bottle Design",
    slug: "sustainable-water-bottle-design",
    description:
      "Eco-friendly reusable water bottle design with sustainable materials, ergonomic form factor, and modern minimalist aesthetics.",
    image: "/designs/product/water-bottle-design.jpg",
    media: [],
    category: "Product",
    tags: ["Sustainable", "Eco-Friendly", "Bottle", "Product", "Green"],
    published: true,
  },
];
// Social Media Design - 5 items
const socialMediaDesigns = [
  {
    title: "Instagram Story Templates Pack",
    slug: "instagram-story-templates-pack",
    description:
      "Versatile Instagram story templates pack with 20+ designs for promotions, quotes, announcements, and engagement posts. Fully customizable in Figma.",
    image: "/designs/social-media/instagram-story-templates.jpg",
    media: [],
    category: "Social Media",
    tags: ["Instagram", "Stories", "Templates", "Social Media", "Marketing"],
    published: true,
  },
  {
    title: "LinkedIn Professional Post Kit",
    slug: "linkedin-professional-post-kit",
    description:
      "Professional LinkedIn post templates for business content, thought leadership, company updates, and career-related posts with corporate styling.",
    image: "/designs/social-media/linkedin-post-kit.jpg",
    media: [],
    category: "Social Media",
    tags: ["LinkedIn", "Professional", "Business", "Corporate", "B2B"],
    published: true,
  },
  {
    title: "TikTok Video Thumbnail Pack",
    slug: "tiktok-video-thumbnail-pack",
    description:
      "Eye-catching TikTok video thumbnail designs optimized for maximum engagement with bold text overlays and trending visual styles.",
    image: "/designs/social-media/tiktok-thumbnail-pack.jpg",
    media: [],
    category: "Social Media",
    tags: ["TikTok", "Thumbnail", "Video", "Viral", "Engagement"],
    published: true,
  },
  {
    title: "Twitter/X Brand Campaign Kit",
    slug: "twitter-x-brand-campaign-kit",
    description:
      "Complete Twitter/X campaign kit with header designs, post templates, thread visuals, and engagement graphics for brand marketing.",
    image: "/designs/social-media/twitter-campaign-kit.jpg",
    media: [],
    category: "Social Media",
    tags: ["Twitter", "X", "Campaign", "Brand", "Marketing"],
    published: true,
  },
  {
    title: "YouTube Channel Branding Package",
    slug: "youtube-channel-branding-package",
    description:
      "Complete YouTube channel branding package including banner, thumbnails, end screens, and intro/outro graphics for content creators.",
    image: "/designs/social-media/youtube-branding-package.jpg",
    media: [],
    category: "Social Media",
    tags: ["YouTube", "Branding", "Channel", "Thumbnails", "Creator"],
    published: true,
  },
];

// Combine all designs
const allDesigns = [
  ...uiDesigns,
  ...moreUiDesigns,
  ...posterDesigns,
  ...morePosterDesigns,
  ...productDesigns,
  ...socialMediaDesigns,
];

// Main seeding function
async function seedDesigns() {
  try {
    // Get admin user
    const admin = await prisma.user.findUnique({
      where: { email: "admin@admin.com" },
    });

    if (!admin) {
      console.error("Admin user not found. Please run the main seed first.");
      return;
    }

    console.log("🎨 Starting design seeding...");

    // Count by category
    const categoryCounts = {
      UI: 0,
      Poster: 0,
      Product: 0,
      "Social Media": 0,
    };

    // Create designs
    for (const designData of allDesigns) {
      const design = await prisma.design.upsert({
        where: { slug: designData.slug },
        update: {
          title: designData.title,
          description: designData.description,
          image: designData.image,
          media: designData.media,
          category: designData.category,
          tags: designData.tags,
          published: designData.published,
        },
        create: {
          title: designData.title,
          slug: designData.slug,
          description: designData.description,
          image: designData.image,
          media: designData.media,
          category: designData.category,
          tags: designData.tags,
          published: designData.published,
          authorId: admin.id,
        },
      });

      categoryCounts[designData.category]++;
      console.log(`✅ Created/Updated design: ${design.title}`);
    }

    console.log("🎉 Design seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - UI Designs: ${categoryCounts["UI"]}`);
    console.log(`   - Poster Designs: ${categoryCounts["Poster"]}`);
    console.log(`   - Product Designs: ${categoryCounts["Product"]}`);
    console.log(`   - Social Media Designs: ${categoryCounts["Social Media"]}`);
    console.log(`   - Total: ${allDesigns.length} designs`);
  } catch (error) {
    console.error("❌ Error seeding designs:", error);
    throw error;
  }
}

// Run the seeding
seedDesigns()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
