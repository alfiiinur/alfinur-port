import AboutPageSection from "../about/about";
import TestimonialPage from "../services/components/Testimonial";
import { HeroGrids } from "./grids/heroGrids";

import { SectionHeader } from "./sections/headers";
import PortfolioSection from "./sections/portfolio";
import { ProcessSection } from "./sections/process";
import ServicesSection from "./sections/services";

export default function HomePage() {
  return (
    <>
      <section className="bg-white dark:bg-black min-h-screen pb-20">
        <div>
          <SectionHeader />
          <HeroGrids />
          <PortfolioSection />
          <ServicesSection />
          <ProcessSection />
          <AboutPageSection />
          <TestimonialPage />
        </div>
      </section>
    </>
  );
}
