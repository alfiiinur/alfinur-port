import ContactServis from "./contact_detail/contact_servis";
import { ContactSection } from "./contact_detail/contact_page";
import LocationSection from "@/components/public/shared/maps/LocationMaps";
import FAQPage from "@/components/public/shared/faq/Faq";

export default function ContactPage() {
  return (
    <div>
      <ContactServis />
      <ContactSection />
      <LocationSection/>
      <FAQPage/>
    </div>
  );
}
