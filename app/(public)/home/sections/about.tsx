import { AboutHero } from "./about/aboutHero";
import { PrincipalsSection } from "./about/principlasSection";
import { ServicesSection } from "./about/ServicesSection";

export default function AboutPage() {
  return (
    <main className="bg-white text-black max-w-7xl mx-auto py-12 px-4">
      <AboutHero />
      {/* <PrincipalsSection /> */}
      <ServicesSection />
    </main>
  );
}
