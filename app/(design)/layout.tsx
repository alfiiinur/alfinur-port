import { Header } from "@/components/public/shared/navbar/header";
import ChatWidget from "@/components/public/chat/ChatWidget";
import { getSiteSettings } from "@/lib/settings";
import { MaintenancePage } from "@/components/public/shared/MaintenancePage";
import { LoadingWrapper } from "@/components/public/shared/LoadingWrapper";

export default async function DesignLayout({
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
    <LoadingWrapper>
      <Header />
      {children}
      {/* No footer - DesignFooter is included in the page */}
      {settings.showChatWidget && <ChatWidget />}
    </LoadingWrapper>
  );
}
