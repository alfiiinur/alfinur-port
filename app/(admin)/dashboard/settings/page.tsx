"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  Globe,
  Navigation,
  Layout,
  Search,
  AlertTriangle,
  Save,
  Loader2,
  Share2,
  Camera,
  Image,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type SiteSettings = {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  siteLogo: string;
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
  contactFormType: string;
  metaTitle: string;
  metaDescription: string;
  googleAnalyticsId: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
      setLogoPreview(data.siteLogo || "");
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (type: "success" | "error", message: string) => {
    setModalType(type);
    setModalMessage(message);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, siteLogo: logoPreview }),
      });

      // Clear logo cache so it refreshes immediately
      localStorage.removeItem("siteLogo");
      localStorage.removeItem("siteLogoCacheTime");

      // Update favicon immediately if logo changed
      if (logoPreview) {
        localStorage.setItem("siteLogo", logoPreview);
        localStorage.setItem("siteLogoCacheTime", Date.now().toString());
      }

      showModal("success", "Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      showModal("error", "Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSetting = <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K]
  ) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Site Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your website configuration and visibility
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-flex">
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger value="navbar" className="gap-2">
            <Navigation className="h-4 w-4" />
            <span className="hidden sm:inline">Navbar</span>
          </TabsTrigger>
          <TabsTrigger value="sections" className="gap-2">
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Sections</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Maintenance</span>
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Logo Upload Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Site Logo / Favicon
              </h2>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/30">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Site Logo"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <Image className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <label
                    htmlFor="logo-upload"
                    className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Upload logo untuk favicon browser. Rekomendasi: 512x512px,
                  format PNG/ICO
                </p>
                {logoPreview && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLogoPreview("")}
                  >
                    Remove Logo
                  </Button>
                )}
              </div>
            </Card>

            {/* Site Info Card */}
            <Card className="p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">
                General Information
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSetting("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteTagline">Tagline</Label>
                  <Input
                    id="siteTagline"
                    value={settings.siteTagline}
                    onChange={(e) =>
                      updateSetting("siteTagline", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) =>
                      updateSetting("siteDescription", e.target.value)
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) =>
                      updateSetting("contactEmail", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) =>
                      updateSetting("contactPhone", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contactAddress">Address</Label>
                  <Textarea
                    id="contactAddress"
                    value={settings.contactAddress}
                    onChange={(e) =>
                      updateSetting("contactAddress", e.target.value)
                    }
                    rows={2}
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="socialGithub">GitHub URL</Label>
                <Input
                  id="socialGithub"
                  value={settings.socialGithub}
                  onChange={(e) =>
                    updateSetting("socialGithub", e.target.value)
                  }
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialLinkedin">LinkedIn URL</Label>
                <Input
                  id="socialLinkedin"
                  value={settings.socialLinkedin}
                  onChange={(e) =>
                    updateSetting("socialLinkedin", e.target.value)
                  }
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialTwitter">Twitter/X URL</Label>
                <Input
                  id="socialTwitter"
                  value={settings.socialTwitter}
                  onChange={(e) =>
                    updateSetting("socialTwitter", e.target.value)
                  }
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialInstagram">Instagram URL</Label>
                <Input
                  id="socialInstagram"
                  value={settings.socialInstagram}
                  onChange={(e) =>
                    updateSetting("socialInstagram", e.target.value)
                  }
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialYoutube">YouTube URL</Label>
                <Input
                  id="socialYoutube"
                  value={settings.socialYoutube}
                  onChange={(e) =>
                    updateSetting("socialYoutube", e.target.value)
                  }
                  placeholder="https://youtube.com/@channel"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Navbar Tab */}
        <TabsContent value="navbar">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Navbar Menu Visibility
            </h2>
            <p className="text-muted-foreground mb-6">
              Toggle which menu items appear in the navigation bar
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { key: "showHome", label: "Home" },
                { key: "showAbout", label: "About" },
                { key: "showProjects", label: "Projects" },
                { key: "showBlogs", label: "Blog" },
                { key: "showDesign", label: "Design" },
                { key: "showServices", label: "Services" },
                { key: "showContact", label: "Contact" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <Label htmlFor={item.key} className="font-medium">
                    {item.label}
                  </Label>
                  <Switch
                    id={item.key}
                    checked={
                      settings[item.key as keyof SiteSettings] as boolean
                    }
                    onCheckedChange={(checked) =>
                      updateSetting(item.key as keyof SiteSettings, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Section Visibility</h2>
            <p className="text-muted-foreground mb-6">
              Control which sections are displayed on your website
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { key: "showHeroSection", label: "Hero Section" },
                { key: "showTestimonials", label: "Testimonials" },
                { key: "showNewsletter", label: "Newsletter" },
                { key: "showChatWidget", label: "Chat Widget" },
                { key: "showFaq", label: "FAQ Section" },
                { key: "showGallery", label: "Gallery" },
                { key: "showFooter", label: "Footer" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <Label htmlFor={item.key} className="font-medium">
                    {item.label}
                  </Label>
                  <Switch
                    id={item.key}
                    checked={
                      settings[item.key as keyof SiteSettings] as boolean
                    }
                    onCheckedChange={(checked) =>
                      updateSetting(item.key as keyof SiteSettings, checked)
                    }
                  />
                </div>
              ))}
            </div>

            {/* Contact Form Type */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Contact Form Type</h3>
              <p className="text-muted-foreground mb-4">
                Choose which contact form to display on the contact page
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    settings.contactFormType === "detail"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  }`}
                  onClick={() => updateSetting("contactFormType", "detail")}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        settings.contactFormType === "detail"
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      }`}
                    />
                    <span className="font-medium">Detail Form</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">
                    Multi-step form with service selection, budget, timeline,
                    and detailed project information
                  </p>
                </div>
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    settings.contactFormType === "simple"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  }`}
                  onClick={() => updateSetting("contactFormType", "simple")}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        settings.contactFormType === "simple"
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      }`}
                    />
                    <span className="font-medium">Simple Form</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">
                    Basic form with name, email, phone, and message fields only
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">SEO & Analytics</h2>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={settings.metaTitle}
                  onChange={(e) => updateSetting("metaTitle", e.target.value)}
                  placeholder="Your site title for search engines"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaDescription}
                  onChange={(e) =>
                    updateSetting("metaDescription", e.target.value)
                  }
                  placeholder="Brief description for search engines (150-160 characters)"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  value={settings.googleAnalyticsId}
                  onChange={(e) =>
                    updateSetting("googleAnalyticsId", e.target.value)
                  }
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Maintenance Mode</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <div>
                  <Label htmlFor="maintenanceMode" className="font-medium">
                    Enable Maintenance Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, visitors will see a maintenance page
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    updateSetting("maintenanceMode", checked)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={settings.maintenanceMessage}
                  onChange={(e) =>
                    updateSetting("maintenanceMessage", e.target.value)
                  }
                  rows={3}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Success/Error Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto mb-4">
              {modalType === "success" ? (
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              )}
            </div>
            <DialogTitle className="text-xl">
              {modalType === "success" ? "Success!" : "Error"}
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              {modalMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => setModalOpen(false)}
              className="min-w-[100px]"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
