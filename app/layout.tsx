import { ThemeProvider } from "@/components/public/theme-provider";
import { LanguageProvider } from "@/lib/hooks/useLanguage";
import DynamicFavicon from "@/components/public/shared/DynamicFavicon";
import { Metadata } from "next";
import {
  Anton,
  Libre_Baskerville,
  Poppins,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

const fontSpaceGrotesk = Space_Grotesk({
  variable: "--font-stack-sans-notch",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${fontAnton.variable} ${fontLibre.variable} ${fontPoppins.variable} ${fontSpaceGrotesk.variable} antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <DynamicFavicon />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
