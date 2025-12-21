"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  MessageSquareQuote,
  HelpCircle,
  Inbox,
} from "lucide-react";
import ServicesTab from "./components/ServicesTab";
import TestimonialsTab from "./components/TestimonialsTab";
import FaqsTab from "./components/FaqsTab";
import ContactSubmissionsTab from "./components/ContactSubmissionsTab";

const menuOptions = [
  {
    value: "contact",
    label: "Contact Submissions",
    icon: Inbox,
    description: "View and manage contact form submissions",
  },
  {
    value: "services",
    label: "Services & Pricing",
    icon: DollarSign,
    description: "Manage your service offerings and pricing",
  },
  {
    value: "testimonials",
    label: "Testimonials",
    icon: MessageSquareQuote,
    description: "Manage client testimonials and reviews",
  },
  {
    value: "faqs",
    label: "FAQs",
    icon: HelpCircle,
    description: "Manage frequently asked questions",
  },
];

export default function ServicesPage() {
  const [activeSection, setActiveSection] = useState("contact");

  const currentOption = menuOptions.find((opt) => opt.value === activeSection);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Services Management</h1>
          <p className="text-muted-foreground">
            Manage your services pricing, testimonials, and FAQs
          </p>
        </div>

        {/* Dropdown Selector */}
        <Select value={activeSection} onValueChange={setActiveSection}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue>
              <div className="flex items-center gap-2">
                {currentOption && (
                  <>
                    <currentOption.icon className="h-4 w-4" />
                    <span>{currentOption.label}</span>
                  </>
                )}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {menuOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-3 py-1">
                  <option.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Section Info Card */}
      {currentOption && (
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
          <div className="p-2 bg-primary/10 rounded-lg">
            <currentOption.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">{currentOption.label}</h2>
            <p className="text-sm text-muted-foreground">
              {currentOption.description}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mt-6">
        {activeSection === "contact" && <ContactSubmissionsTab />}
        {activeSection === "services" && <ServicesTab />}
        {activeSection === "testimonials" && <TestimonialsTab />}
        {activeSection === "faqs" && <FaqsTab />}
      </div>
    </div>
  );
}
