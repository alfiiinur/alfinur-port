import { getSiteSettings } from "@/lib/settings";
import { MaintenancePage } from "@/components/public/shared/MaintenancePage";

export default async function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  // Show maintenance page if enabled
  if (settings.maintenanceMode) {
    return <MaintenancePage message={settings.maintenanceMessage} />;
  }

  // Layout tanpa navbar dan footer - hanya content
  return <>{children}</>;
}
