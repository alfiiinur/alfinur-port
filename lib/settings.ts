import { prisma } from "@/lib/prisma";

export type SiteSettings = {
  id: string;
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialGithub: string;
  socialLinkedin: string;
  socialTwitter: string;
  socialInstagram: string;
  socialYoutube: string;
  showHome: boolean;
  showAbout: boolean;
  showProjects: boolean;
  showBlogs: boolean;
  showDesign: boolean;
  showServices: boolean;
  showContact: boolean;
  showHeroSection: boolean;
  showTestimonials: boolean;
  showNewsletter: boolean;
  showChatWidget: boolean;
  showFaq: boolean;
  showGallery: boolean;
  showFooter: boolean;
  metaTitle: string;
  metaDescription: string;
  googleAnalyticsId: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
};

const defaultSettings: SiteSettings = {
  id: "default",
  siteName: "MyPortfolio",
  siteTagline: "Creative Developer",
  siteDescription: "Personal portfolio website",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  socialGithub: "",
  socialLinkedin: "",
  socialTwitter: "",
  socialInstagram: "",
  socialYoutube: "",
  showHome: true,
  showAbout: true,
  showProjects: true,
  showBlogs: true,
  showDesign: true,
  showServices: true,
  showContact: true,
  showHeroSection: true,
  showTestimonials: true,
  showNewsletter: true,
  showChatWidget: true,
  showFaq: true,
  showGallery: true,
  showFooter: true,
  metaTitle: "",
  metaDescription: "",
  googleAnalyticsId: "",
  maintenanceMode: false,
  maintenanceMessage:
    "We are currently under maintenance. Please check back soon.",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    return settings || defaultSettings;
  } catch {
    return defaultSettings;
  }
}
