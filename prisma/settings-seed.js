require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding site settings...");

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "MyPortfolio",
      siteTagline: "Creative Developer",
      siteDescription:
        "Personal portfolio website showcasing my work and skills",
      contactEmail: "alfinurdanialin900@gmail.com",
      contactPhone: "",
      contactAddress: "",
      socialGithub: "",
      socialLinkedin: "",
      socialTwitter: "",
      socialInstagram: "",
      socialYoutube: "",
      showHome: true,
      showAbout: true,
      showProjects: true,
      showBlogs: true,
      showDesign: true,
      showServices: true,
      showContact: true,
      showHeroSection: true,
      showTestimonials: true,
      showNewsletter: true,
      showChatWidget: true,
      showFaq: true,
      showGallery: true,
      showFooter: true,
      metaTitle: "",
      metaDescription: "",
      googleAnalyticsId: "",
      maintenanceMode: false,
      maintenanceMessage:
        "We are currently under maintenance. Please check back soon.",
    },
  });

  console.log("Site settings seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
