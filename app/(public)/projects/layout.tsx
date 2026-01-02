import Bottom from "@/components/public/shared/footer/bottom";
import ChatWidget from "@/components/public/chat/ChatWidget";
import { getSiteSettings } from "@/lib/settings";
import { MaintenancePage } from "@/components/public/shared/MaintenancePage";

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  // Show maintenance page if enabled
  if (settings.maintenanceMode) {
    return <MaintenancePage message={settings.maintenanceMessage} />;
  }

  return (
    <>
      {/* No Header/Navbar - langsung scroll */}
      {children}
      {settings.showFooter && <Bottom />}
      {settings.showChatWidget && <ChatWidget />}
    </>
  );
}
