import type { Metadata } from "next";
import {
  Anton,
  Libre_Baskerville,
  Poppins,
  Stack_Sans_Notch,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/public/theme-provider";
import { Header } from "@/components/public/shared/navbar/header";
import Bottom from "@/components/public/shared/footer/bottom";

const fontStackSans = Stack_Sans_Notch({
  variable: "--font-stack-sans-notch",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const fontAnton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
});

const fontLibre = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const fontPoppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ALFI NUR - Portfolio",
  description: "Website portfolio of Alfi Nur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontAnton.variable} ${fontLibre.variable} ${fontPoppins.variable} ${fontStackSans.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />

          {children}
          <Bottom />
        </ThemeProvider>
      </body>
    </html>
  );
}
