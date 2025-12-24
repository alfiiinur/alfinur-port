import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import ServicesHero from "./components/ServicesHero";
import ServicesGrid from "./components/ServicesGrid";
import ServicesShowcase from "./components/ServicesShowcase";
import WorkProcess from "./components/WorkProcess";
import HeadingService from "./components/HeadingService";
import TestimonialPage from "./components/Testimonial";
import FAQSection from "./components/FaqSection";
import ServicesSite from "./components/ServicesSite";
import ProcessDetail from "./components/ProcessDetail";

async function getServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

async function getFaqs() {
  return prisma.faq.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}

export default async function Services() {
  const [services, testimonials, faqs, settings] = await Promise.all([
    getServices(),
    getTestimonials(),
    getFaqs(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Container */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <HeadingService
          titleLine1="let's talk"
          titleLine2="design"
          topDescription="We transform spaces into timeless experiences through bold ideas and meticulous craftsmanship."
          bottomDescription="From concept to completion, our interdisciplinary team combines strategy, architecture, and storytelling to create interiors that don't just look good — they feel alive. Whether it's a boutique hotel, flagship retail, or a private residence, every project is a signature."
          badgeText="Featured Project 2025"
          imageSrc="/img/room.jpg"
          imageAlt="Luxury interior design project"
        />
        {/* Hero Section */}
        <ServicesHero />

        {/* Services Grid */}
        <ServicesGrid services={services} />

        {/* Work Process */}
        <WorkProcess />
      </div>
      {/* Process Detail - Full Screen Sections */}
      <ProcessDetail />

      {/* Services Showcase - Bento Grid */}
      <ServicesShowcase />
      {settings.showTestimonials && (
        <TestimonialPage testimonials={testimonials} />
      )}
      <ServicesSite
        title={
          <>
            We build fast, beautiful
            <br />
            and scalable websites
          </>
        }
        topDescription="From landing pages to complex web apps with Next.js, Nuxt, Remix, and modern stack."
        mediaItems={[
          {
            id: 1,
            type: "image",
            src: "/img/room.jpg",
            alt: "Dashboard web app",
          },
          {
            id: 2,
            type: "video",
            src: "/video/videonote.mp4",
            alt: "Interactive dashboard demo",
          },
        ]}
        bottomLabel="Web Development"
        bottomContent={
          <>
            Clean code · Lightning performance · SEO friendly · Fully responsive
          </>
        }
      />
      {settings.showFaq && <FAQSection faqs={faqs} />}
    </div>
  );
}
