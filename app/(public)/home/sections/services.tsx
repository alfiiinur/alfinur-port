import { ServicesMarquee } from "@/components/public/shared/ServicesMarque";
import { HeroServices } from "./services/hero";
import { ServiceDetail } from "./services/detail";

export default function ServicesSection() {
  return (
    <>
      <HeroServices />
      {/* <ServicesMarquee /> */}
      <ServiceDetail />
    </>
  );
}
