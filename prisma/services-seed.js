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

const services = [
  {
    name: "Landing Page Website",
    slug: "landing-page-website",
    description:
      "Professional landing page design with modern UI/UX, responsive design, and optimized for conversions.",
    icon: "layout",
    price: 2500000,
    priceType: "STARTING_FROM",
    currency: "IDR",
    features: [
      "Responsive Design",
      "SEO Optimized",
      "Contact Form",
      "Analytics Integration",
      "1 Month Support",
    ],
    category: "Web Development",
    isPopular: false,
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Company Profile Website",
    slug: "company-profile-website",
    description:
      "Complete company profile website with multiple pages, CMS integration, and professional design.",
    icon: "building",
    price: 5000000,
    priceType: "STARTING_FROM",
    currency: "IDR",
    features: [
      "Up to 10 Pages",
      "CMS Integration",
      "Blog Section",
      "Contact Form",
      "SEO Optimized",
      "3 Months Support",
    ],
    category: "Web Development",
    isPopular: true,
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "E-Commerce Website",
    slug: "ecommerce-website",
    description:
      "Full-featured e-commerce platform with product management, payment gateway, and order tracking.",
    icon: "shopping-cart",
    price: 15000000,
    priceType: "STARTING_FROM",
    currency: "IDR",
    features: [
      "Product Management",
      "Payment Gateway",
      "Order Tracking",
      "Customer Dashboard",
      "Inventory System",
      "6 Months Support",
    ],
    category: "E-Commerce",
    isPopular: true,
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "Custom Web Application",
    slug: "custom-web-application",
    description:
      "Tailored web application built to your specific business requirements with modern tech stack.",
    icon: "code",
    price: null,
    priceType: "CONTACT_US",
    currency: "IDR",
    features: [
      "Custom Development",
      "API Integration",
      "Database Design",
      "User Authentication",
      "Admin Dashboard",
      "Ongoing Support",
    ],
    category: "Web Development",
    isPopular: false,
    isActive: true,
    sortOrder: 4,
  },
  {
    name: "IT Consulting",
    slug: "it-consulting",
    description:
      "Expert IT consulting services to help optimize your technology infrastructure and digital strategy.",
    icon: "lightbulb",
    price: 500000,
    priceType: "HOURLY",
    currency: "IDR",
    features: [
      "Technology Assessment",
      "Digital Strategy",
      "System Architecture",
      "Security Audit",
      "Performance Optimization",
    ],
    category: "IT Consulting",
    isPopular: false,
    isActive: true,
    sortOrder: 5,
  },
  {
    name: "UI/UX Design",
    slug: "ui-ux-design",
    description:
      "User-centered design services including wireframing, prototyping, and visual design.",
    icon: "palette",
    price: 3000000,
    priceType: "STARTING_FROM",
    currency: "IDR",
    features: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Visual Design",
      "Design System",
      "Usability Testing",
    ],
    category: "Design",
    isPopular: false,
    isActive: true,
    sortOrder: 6,
  },
];

const testimonials = [
  {
    name: "Ahmad Rizki",
    role: "CEO",
    company: "TechStart Indonesia",
    avatar: null,
    content:
      "Sangat puas dengan hasil website company profile kami. Desainnya modern, responsif, dan sesuai dengan brand identity perusahaan. Tim sangat profesional dan komunikatif selama proses pengerjaan.",
    rating: 5,
    projectType: "Company Profile",
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    name: "Sarah Wijaya",
    role: "Marketing Director",
    company: "Fashion House",
    avatar: null,
    content:
      "E-commerce website yang dibuat sangat user-friendly dan membantu meningkatkan penjualan online kami hingga 150%. Fitur-fiturnya lengkap dan mudah dikelola.",
    rating: 5,
    projectType: "E-Commerce",
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
  },
  {
    name: "Budi Santoso",
    role: "Founder",
    company: "Startup Digital",
    avatar: null,
    content:
      "Konsultasi IT yang diberikan sangat membantu dalam menentukan tech stack yang tepat untuk startup kami. Rekomendasi yang diberikan sangat valuable dan implementable.",
    rating: 5,
    projectType: "IT Consulting",
    isActive: true,
    isFeatured: false,
    sortOrder: 3,
  },
  {
    name: "Diana Putri",
    role: "Owner",
    company: "Kopi Nusantara",
    avatar: null,
    content:
      "Landing page yang dibuat berhasil meningkatkan conversion rate kami. Desainnya menarik dan loading-nya cepat. Sangat recommended!",
    rating: 4,
    projectType: "Landing Page",
    isActive: true,
    isFeatured: false,
    sortOrder: 4,
  },
  {
    name: "Michael Chen",
    role: "CTO",
    company: "FinTech Solutions",
    avatar: null,
    content:
      "Custom web application yang dikembangkan sangat sesuai dengan kebutuhan bisnis kami. Kode bersih, well-documented, dan mudah untuk di-maintain.",
    rating: 5,
    projectType: "Web Application",
    isActive: true,
    isFeatured: true,
    sortOrder: 5,
  },
];

const faqs = [
  {
    question: "Berapa lama waktu pengerjaan website?",
    answer:
      "Waktu pengerjaan bervariasi tergantung kompleksitas project:\n- Landing Page: 1-2 minggu\n- Company Profile: 2-4 minggu\n- E-Commerce: 4-8 minggu\n- Custom Application: 8-16 minggu\n\nWaktu ini dapat berubah tergantung feedback dan revisi dari klien.",
    category: "Process",
    isActive: true,
    sortOrder: 1,
  },
  {
    question: "Apakah harga sudah termasuk hosting dan domain?",
    answer:
      "Harga yang tertera belum termasuk biaya hosting dan domain. Kami dapat membantu setup hosting dan domain dengan biaya tambahan, atau klien dapat menggunakan hosting dan domain yang sudah dimiliki.",
    category: "Pricing",
    isActive: true,
    sortOrder: 2,
  },
  {
    question: "Bagaimana sistem pembayaran?",
    answer:
      "Sistem pembayaran kami:\n- 50% DP di awal project\n- 50% pelunasan setelah project selesai\n\nUntuk project besar, pembayaran dapat dibagi menjadi beberapa termin sesuai milestone yang disepakati.",
    category: "Pricing",
    isActive: true,
    sortOrder: 3,
  },
  {
    question: "Apakah ada garansi setelah website selesai?",
    answer:
      "Ya, kami memberikan garansi maintenance gratis sesuai paket yang dipilih:\n- Landing Page: 1 bulan\n- Company Profile: 3 bulan\n- E-Commerce: 6 bulan\n\nSetelah masa garansi, tersedia paket maintenance bulanan.",
    category: "Support",
    isActive: true,
    sortOrder: 4,
  },
  {
    question: "Teknologi apa yang digunakan?",
    answer:
      "Kami menggunakan teknologi modern dan terkini:\n- Frontend: React, Next.js, TypeScript\n- Backend: Node.js, Python\n- Database: PostgreSQL, MongoDB\n- CMS: Custom CMS, WordPress, Strapi\n\nPemilihan teknologi disesuaikan dengan kebutuhan project.",
    category: "Technical",
    isActive: true,
    sortOrder: 5,
  },
  {
    question: "Apakah website akan SEO friendly?",
    answer:
      "Ya, semua website yang kami buat sudah dioptimasi untuk SEO dengan:\n- Struktur HTML semantic\n- Meta tags optimization\n- Fast loading speed\n- Mobile responsive\n- Schema markup\n- Sitemap & robots.txt",
    category: "Technical",
    isActive: true,
    sortOrder: 6,
  },
  {
    question: "Bagaimana proses revisi?",
    answer:
      "Setiap paket sudah termasuk revisi:\n- Landing Page: 2x revisi\n- Company Profile: 3x revisi\n- E-Commerce: 5x revisi\n\nRevisi tambahan dapat dikenakan biaya sesuai scope perubahan.",
    category: "Process",
    isActive: true,
    sortOrder: 7,
  },
  {
    question: "Apakah bisa request fitur custom?",
    answer:
      "Tentu! Kami sangat terbuka untuk fitur custom sesuai kebutuhan bisnis Anda. Silakan diskusikan kebutuhan Anda dan kami akan memberikan estimasi biaya dan waktu pengerjaan.",
    category: "General",
    isActive: true,
    sortOrder: 8,
  },
];

async function seedServices() {
  try {
    console.log("🚀 Starting services seeding...");

    // Seed Services
    console.log("\n📦 Seeding Services...");
    for (const service of services) {
      await prisma.service.upsert({
        where: { slug: service.slug },
        update: service,
        create: service,
      });
      console.log(`  ✅ ${service.name}`);
    }

    // Seed Testimonials
    console.log("\n💬 Seeding Testimonials...");
    for (const testimonial of testimonials) {
      await prisma.testimonial.create({
        data: testimonial,
      });
      console.log(`  ✅ ${testimonial.name} - ${testimonial.company}`);
    }

    // Seed FAQs
    console.log("\n❓ Seeding FAQs...");
    for (const faq of faqs) {
      await prisma.faq.create({
        data: faq,
      });
      console.log(`  ✅ ${faq.question.substring(0, 40)}...`);
    }

    console.log("\n🎉 Services seeding completed!");
    console.log(`📊 Summary:`);
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Testimonials: ${testimonials.length}`);
    console.log(`   - FAQs: ${faqs.length}`);
  } catch (error) {
    console.error("❌ Error seeding services:", error);
    throw error;
  }
}

seedServices()
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
