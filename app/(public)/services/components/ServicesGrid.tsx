"use client";

import { useLanguage } from "@/lib/hooks/useLanguage";
import ServiceCard from "./ServiceCard";

interface Service {
  id: string;
  name: string;
  nameId?: string | null;
  slug: string;
  description: string;
  descriptionId?: string | null;
  icon: string;
  price: number | null;
  priceType: string;
  currency: string;
  features: string[];
  featuresId?: string[];
  category: string;
  categoryId?: string | null;
  isPopular: boolean;
  showPrice?: boolean;
}

interface ServicesGridProps {
  services: Service[];
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  const { language } = useLanguage();

  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {language === "id"
          ? "Tidak ada layanan tersedia saat ini."
          : "No services available at the moment."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
