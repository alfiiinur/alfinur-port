import ServicesHero from "./components/ServicesHero";
import ServicesGrid from "./components/ServicesGrid";
import ServicesShowcase from "./components/ServicesShowcase";
import WorkProcess from "./components/WorkProcess";
import HeadingService from "./components/HeadingService";
import TestimonialPage from "./components/Testimonial";
import FAQPage from "@/components/public/shared/faq/Faq";
import ServicesSite from "./components/ServicesSite";

export default function Services() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Container */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <HeadingService
          titleLine1="let's talk"
          titleLine2="design"
          topDescription="We transform spaces into timeless experiences through bold ideas and meticulous craftsmanship."
          bottomDescription="From concept to completion, our interdisciplinary team combines strategy, architecture, and storytelling to create interiors that don’t just look good — they feel alive. Whether it’s a boutique hotel, flagship retail, or a private residence, every project is a signature."
          badgeText="Featured Project 2025"
          imageSrc="/img/room.jpg"
          imageAlt="Luxury interior design project"
        />
        {/* Hero Section */}
        <ServicesHero />

        {/* Services Grid */}
        <ServicesGrid />

        {/* Work Process */}
        <WorkProcess />
      </div>
      {/* Services Showcase - Bento Grid */}
      <ServicesShowcase />
      <TestimonialPage />
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
            src: "/video/videonote.mp4", // pastikan file ada di /public/videos/
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
      <FAQPage />
    </div>
  );
}
