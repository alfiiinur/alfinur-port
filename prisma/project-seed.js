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

const projects = [
  {
    title: "KoalaErs - Media Pembelajaran Collaborative Filtering",
    slug: "koalaers-media-pembelajaran-collaborative-filtering",
    description:
      "Platform media pembelajaran interaktif yang menggunakan algoritma Collaborative Filtering untuk memberikan rekomendasi materi belajar yang dipersonalisasi. Sistem ini menganalisis pola belajar pengguna dan memberikan saran konten yang relevan berdasarkan preferensi dan kemajuan belajar.",
    thumbnail: "/projects/koalaers-thumbnail.jpg",
    images: [],
    media: [],
    category: "Web Application",
    client: "Educational Institution",
    link: "https://koalaers.example.com",
    tags: [
      "Education",
      "Machine Learning",
      "Collaborative Filtering",
      "React",
      "Python",
      "Recommendation System",
    ],
    published: true,
  },
  {
    title: "DigiMark Pro - Digital Marketing Agency Website",
    slug: "digimark-pro-digital-marketing-agency",
    description:
      "Website modern untuk agensi digital marketing dengan desain yang bold dan dinamis. Menampilkan portfolio kampanye, layanan SEO, social media marketing, dan content creation dengan animasi interaktif dan UI yang engaging.",
    thumbnail: "/projects/digimark-thumbnail.jpg",
    images: [],
    media: [],
    category: "Website",
    client: "DigiMark Agency",
    link: "https://digimark.example.com",
    tags: [
      "Digital Marketing",
      "Agency",
      "SEO",
      "Next.js",
      "Framer Motion",
      "Landing Page",
    ],
    published: true,
  },
  {
    title: "LeatherCraft - E-Commerce Premium Leather Goods",
    slug: "leathercraft-ecommerce-premium-leather",
    description:
      "Platform e-commerce premium untuk produk kulit handmade dengan fitur product customization, 3D product viewer, dan seamless checkout experience. Desain elegan yang mencerminkan kualitas produk artisan leather goods.",
    thumbnail: "/projects/leathercraft-thumbnail.jpg",
    images: [],
    media: [],
    category: "E-Commerce",
    client: "LeatherCraft Indonesia",
    link: "https://leathercraft.example.com",
    tags: [
      "E-Commerce",
      "Leather",
      "Premium",
      "3D Viewer",
      "Shopify",
      "Product Customization",
    ],
    published: true,
  },
];
const moreProjects = [
  {
    title: "ArchiHome - Rumah Arsitektur Modern",
    slug: "archihome-rumah-arsitektur-modern",
    description:
      "Website showcase untuk firma arsitektur yang menampilkan portfolio desain rumah modern, minimalis, dan kontemporer. Fitur virtual tour 360°, gallery proyek, dan konsultasi online untuk calon klien.",
    thumbnail: "/projects/archihome-thumbnail.jpg",
    images: [],
    media: [],
    category: "Website",
    client: "ArchiHome Studio",
    link: "https://archihome.example.com",
    tags: [
      "Architecture",
      "Real Estate",
      "Virtual Tour",
      "Portfolio",
      "Next.js",
      "3D Gallery",
    ],
    published: true,
  },
  {
    title: "CryptoVerse - Futuristic Crypto Trading Platform",
    slug: "cryptoverse-futuristic-crypto-trading",
    description:
      "Platform trading cryptocurrency dengan desain futuristik dan UI yang immersive. Menampilkan real-time charts, portfolio tracking, NFT marketplace integration, dan advanced trading tools dengan tema cyberpunk aesthetic.",
    thumbnail: "/projects/cryptoverse-thumbnail.jpg",
    images: [],
    media: [],
    category: "Web Application",
    client: "CryptoVerse Inc",
    link: "https://cryptoverse.example.com",
    tags: [
      "Crypto",
      "Trading",
      "Futuristic",
      "NFT",
      "Web3",
      "Real-time",
      "Dashboard",
    ],
    published: true,
  },
  {
    title: "Wanderlust - Travel & Adventure Platform",
    slug: "wanderlust-travel-adventure-platform",
    description:
      "Platform travel booking dengan pengalaman visual yang stunning. Menampilkan destinasi wisata dengan foto dan video berkualitas tinggi, itinerary planner, dan booking system terintegrasi untuk hotel, flight, dan aktivitas.",
    thumbnail: "/projects/wanderlust-thumbnail.jpg",
    images: [],
    media: [],
    category: "Website",
    client: "Wanderlust Travel",
    link: "https://wanderlust.example.com",
    tags: [
      "Travel",
      "Booking",
      "Tourism",
      "Adventure",
      "Next.js",
      "Maps Integration",
    ],
    published: true,
  },
  {
    title: "MetaConnect - Web3 Social Platform",
    slug: "metaconnect-web3-social-platform",
    description:
      "Platform sosial berbasis Web3 dengan fitur decentralized identity, NFT profile pictures, token-gated communities, dan crypto wallet integration. Desain modern dengan glassmorphism dan gradient aesthetics.",
    thumbnail: "/projects/metaconnect-thumbnail.jpg",
    images: [],
    media: [],
    category: "Web Application",
    client: "MetaConnect DAO",
    link: "https://metaconnect.example.com",
    tags: [
      "Web3",
      "Social Media",
      "NFT",
      "Blockchain",
      "Decentralized",
      "Ethereum",
      "Wallet Connect",
    ],
    published: true,
  },
  {
    title: "SolarTech - Renewable Energy Solutions",
    slug: "solartech-renewable-energy-solutions",
    description:
      "Website untuk perusahaan energi surya dengan kalkulator penghematan energi interaktif, showcase produk panel surya, dan sistem booking konsultasi. Desain clean dan eco-friendly yang mencerminkan nilai sustainability.",
    thumbnail: "/projects/solartech-thumbnail.jpg",
    images: [],
    media: [],
    category: "Website",
    client: "SolarTech Energy",
    link: "https://solartech.example.com",
    tags: [
      "Solar Energy",
      "Renewable",
      "Green Tech",
      "Calculator",
      "Sustainability",
      "Clean Energy",
    ],
    published: true,
  },
  {
    title: "ArchStudio - Architecture Landing Page",
    slug: "archstudio-architecture-landing-page",
    description:
      "Landing page premium untuk studio arsitektur dengan parallax scrolling, project showcase dengan hover effects yang elegan, dan contact form terintegrasi. Desain minimalis dengan typography yang bold dan whitespace yang optimal.",
    thumbnail: "/projects/archstudio-thumbnail.jpg",
    images: [],
    media: [],
    category: "Landing Page",
    client: "ArchStudio Design",
    link: "https://archstudio.example.com",
    tags: [
      "Architecture",
      "Landing Page",
      "Minimalist",
      "Parallax",
      "Portfolio",
      "Premium Design",
    ],
    published: true,
  },
];

// Combine all projects
const allProjects = [...projects, ...moreProjects];

// Main seeding function
async function seedProjects() {
  try {
    // Get admin user
    const admin = await prisma.user.findUnique({
      where: { email: "admin@admin.com" },
    });

    if (!admin) {
      console.error("Admin user not found. Please run the main seed first.");
      return;
    }

    console.log("🚀 Starting project seeding...");

    // Count by category
    const categoryCounts = {};

    // Create projects
    for (const projectData of allProjects) {
      const project = await prisma.project.upsert({
        where: { slug: projectData.slug },
        update: {
          title: projectData.title,
          description: projectData.description,
          thumbnail: projectData.thumbnail,
          images: projectData.images,
          media: projectData.media,
          category: projectData.category,
          client: projectData.client,
          link: projectData.link,
          tags: projectData.tags,
          published: projectData.published,
        },
        create: {
          title: projectData.title,
          slug: projectData.slug,
          description: projectData.description,
          thumbnail: projectData.thumbnail,
          images: projectData.images,
          media: projectData.media,
          category: projectData.category,
          client: projectData.client,
          link: projectData.link,
          tags: projectData.tags,
          published: projectData.published,
          authorId: admin.id,
        },
      });

      // Count categories
      categoryCounts[projectData.category] =
        (categoryCounts[projectData.category] || 0) + 1;
      console.log(`✅ Created/Updated project: ${project.title}`);
    }

    console.log("🎉 Project seeding completed successfully!");
    console.log(`📊 Summary:`);
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count}`);
    });
    console.log(`   - Total: ${allProjects.length} projects`);
  } catch (error) {
    console.error("❌ Error seeding projects:", error);
    throw error;
  }
}

// Run the seeding
seedProjects()
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
