import { prisma } from "@/lib/prisma";
import AboutPageSection from "../about/about";
import TestimonialPage from "../services/components/Testimonial";
import { HeroGrids } from "./grids/heroGrids";

import { SectionHeader } from "./sections/headers";
import PortfolioSection from "./sections/portfolio";
import { ProcessSection } from "./sections/process";
import ServicesSection from "./sections/services";
import { LightRays } from "@/components/ui/light-rays";

async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export default async function HomePage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <section className="bg-white dark:bg-black min-h-screen pb-20 overflow-x-hidden">
        {/* Light Rays Effect */}
        <LightRays
          className="z-0"
          count={8}
          color="rgba(196, 241, 53, 0.15)"
          blur={40}
          speed={12}
          length="80vh"
        />
        <div className="overflow-x-hidden">
          <SectionHeader />
          <HeroGrids />
          <PortfolioSection />
          <ServicesSection />
          <ProcessSection />
          <AboutPageSection />
          <TestimonialPage testimonials={testimonials} />
        </div>
      </section>
    </>
  );
}
