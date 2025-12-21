import ContactServis from "./contact_detail/contact_servis";
import { ContactSection } from "./contact_detail/contact_page";
import LocationSection from "@/components/public/shared/maps/LocationMaps";

export default function ContactPage() {
  return (
    <div>
      <ContactServis />
      <ContactSection />
      <LocationSection />
    </div>
  );
}
