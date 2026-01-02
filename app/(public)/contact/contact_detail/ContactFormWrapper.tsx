"use client";

import { useEffect, useState } from "react";
import ContactFormSlider from "./ContactFormSlider";
import SimpleContactForm from "./SimpleContactForm";

interface Settings {
  contactFormType?: string;
}

export default function ContactFormWrapper() {
  const [formType, setFormType] = useState<string>("detail");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data: Settings = await res.json();
          setFormType(data.contactFormType || "detail");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="xl:col-span-2 bg-black rounded-xl p-8 dark:bg-white flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gray-700 dark:bg-gray-300 rounded-full" />
          <div className="h-4 w-32 bg-gray-700 dark:bg-gray-300 rounded" />
        </div>
      </div>
    );
  }

  return formType === "simple" ? <SimpleContactForm /> : <ContactFormSlider />;
}
