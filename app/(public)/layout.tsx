import Bottom from "@/components/public/shared/footer/bottom";
import FloatingChat from "@/components/public/shared/FloatingChat";
import { Header } from "@/components/public/shared/navbar/header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Bottom />
      <FloatingChat />
    </>
  );
}
