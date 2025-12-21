import ServiceCard from "./ServiceCard";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  price: number | null;
  priceType: string;
  currency: string;
  features: string[];
  category: string;
  isPopular: boolean;
}

interface ServicesGridProps {
  services: Service[];
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No services available at the moment.
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
