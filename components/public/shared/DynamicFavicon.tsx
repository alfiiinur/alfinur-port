"use client";

import { useEffect, useState, useCallback } from "react";

export default function DynamicFavicon() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const updateFavicon = useCallback((url: string) => {
    if (!url) return;

    // Update or create favicon link
    let faviconLink = document.querySelector(
      "link[rel='icon']"
    ) as HTMLLinkElement;
    if (!faviconLink) {
      faviconLink = document.createElement("link");
      faviconLink.rel = "icon";
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = url;

    // Update or create shortcut icon
    let shortcutLink = document.querySelector(
      "link[rel='shortcut icon']"
    ) as HTMLLinkElement;
    if (!shortcutLink) {
      shortcutLink = document.createElement("link");
      shortcutLink.rel = "shortcut icon";
      document.head.appendChild(shortcutLink);
    }
    shortcutLink.href = url;

    // Update or create apple-touch-icon
    let appleLink = document.querySelector(
      "link[rel='apple-touch-icon']"
    ) as HTMLLinkElement;
    if (!appleLink) {
      appleLink = document.createElement("link");
      appleLink.rel = "apple-touch-icon";
      document.head.appendChild(appleLink);
    }
    appleLink.href = url;
  }, []);

  useEffect(() => {
    // Check localStorage first for cached logo
    const cachedLogo = localStorage.getItem("siteLogo");
    const cacheTime = localStorage.getItem("siteLogoCacheTime");
    const now = Date.now();

    // Use cache if it's less than 5 minutes old
    if (cachedLogo && cacheTime && now - parseInt(cacheTime) < 5 * 60 * 1000) {
      setLogoUrl(cachedLogo);
      updateFavicon(cachedLogo);
      return;
    }

    // Fetch fresh logo from API
    const fetchLogo = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.siteLogo) {
            setLogoUrl(data.siteLogo);
            updateFavicon(data.siteLogo);
            // Cache in localStorage
            localStorage.setItem("siteLogo", data.siteLogo);
            localStorage.setItem("siteLogoCacheTime", now.toString());
          }
        }
      } catch (error) {
        console.error("Error fetching site logo:", error);
        // Use cached logo if fetch fails
        if (cachedLogo) {
          setLogoUrl(cachedLogo);
          updateFavicon(cachedLogo);
        }
      }
    };

    fetchLogo();
  }, [updateFavicon]);

  // Re-apply favicon on visibility change (when user comes back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && logoUrl) {
        updateFavicon(logoUrl);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [logoUrl, updateFavicon]);

  return null;
}
