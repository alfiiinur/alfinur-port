import Bottom from "@/components/public/shared/footer/bottom";
import ChatWidget from "@/components/public/chat/ChatWidget";
import { Header } from "@/components/public/shared/navbar/header";
import { getSiteSettings } from "@/lib/settings";
import { MaintenancePage } from "@/components/public/shared/MaintenancePage";
import { LoadingWrapper } from "@/components/public/shared/LoadingWrapper";

export default async function PublicLayout({
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
      {settings.showFooter && <Bottom />}
      {settings.showChatWidget && <ChatWidget />}
    </LoadingWrapper>
  );
}
