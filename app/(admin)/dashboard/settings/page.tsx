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
  Settings,
  Globe,
  Navigation,
  Layout,
  Search,
  AlertTriangle,
  Save,
  Loader2,
  Share2,
} from "lucide-react";

type SiteSettings = {
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

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
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
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">General Information</h2>
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
                  onChange={(e) => updateSetting("siteTagline", e.target.value)}
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
    </div>
  );
}
