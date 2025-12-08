"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import ContactFormSlider from "./ContactFormSlider";

const services = [
  "Creative Direction",
  "Photography",
  "Film & Commercials",
  "Music Videos",
  "Other",
];

const budgets = ["Under $5K", "$5K-$10K", "$10K-$25K", "$25K-$50K", "$50K+"];

export default function ContactServis() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  return (
    <section className="min-h-screen bg-white dark:bg-black py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:max-w-screen-2xl">
        {/* Mobile Header */}
        <div className="mb-12 md:hidden">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-black">
            Niko Lius
          </h1>
          <h2 className="mt-8 text-6xl font-bold leading-tight tracking-tighter">
            LET,S TALK
          </h2>
        </div>

        {/* Main Grid – 1 column on mobile → 2 columns on md → 4 columns on xl */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4 xl:gap-0">
          {/* COLUMN 1: Brand & Info */}
          <div className="space-y-12 border-b border-gray-200 pb-12 md:border-b-0 md:pb-0 xl:border-r xl:pr-12">
            {/* Desktop Title */}
            <div className="hidden md:block">
              <h1 className="mb-20 text-xl font-bold uppercase tracking-wider">
                Niko Lius
              </h1>
              <h2 className="mb-10 text-8xl font-bold leading-[0.85] tracking-tighter lg:text-9xl">
                LET,S <br /> TALK
              </h2>
            </div>

            <p className="max-w-xs text-base font-medium leading-relaxed text-gray-700">
              Every great project begins with a conversation. Whether
              you&apos;re looking to collaborate on a campaign, bring a concept
              to life on screen, or simply exchange ideas, I&apos;d love to hear
              from you.
            </p>

            <div className="mt-16 space-y-4 text-sm font-bold md:mt-32">
              {[
                { label: "Email", value: "hello@nikolius.com" },
                { label: "LinkedIn", value: "Niko Lius" },
                { label: "Instagram", value: "@niko lius" },
                { label: "X", value: "Niko Lius" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-2 gap-4 md:grid-cols-[100px_1fr]"
                >
                  <span className="text-gray-600">{item.label}</span>
                  <span className="uppercase text-[#EB5939]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 2: Navigation (hidden on mobile, shown on md+) */}
          <div className="hidden border-b border-gray-200 pb-12 md:block md:border-b-0 xl:border-r xl:pl-12 xl:pr-12">
            <div className="space-y-3 text-lg font-medium">
              {["Home", "About", "Projects", "Blog", "Services", "Contact"].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="block transition-colors hover:text-gray-500"
                  >
                    {link}
                  </a>
                )
              )}
            </div>

            {/* Mobile Social Links (only visible < xl) */}
            <div className="mt-20 space-y-3 xl:hidden">
              {["LinkedIn", "Instagram", "Twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="block text-lg transition-colors hover:text-gray-500"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 3+4: Form Area – stacked on small screens */}
          <div className="xl:col-span-2 xl:border-l xl:pl-12">
            {/* Form Grid – 1 col mobile → 2 col xl */}
            <div className="grid grid-cols-1 gap-16 xl:grid-cols-2 xl:gap-20">
              <ContactFormSlider />
              {/* Left Form Fields */}
              <div className="space-y-12">
                {/* Services */}
                <div>
                  <Label className="mb-4 block text-xs font-bold uppercase tracking-widest text-gray-600">
                    Service
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {services.map((service) => (
                      <Button
                        key={service}
                        variant={
                          selectedService === service ? "default" : "outline"
                        }
                        size="sm"
                        className={`rounded-full border-[#EDECE8] bg-[#EDECE8] text-sm font-medium hover:bg-gray-300 ${
                          selectedService === service
                            ? "bg-black text-white hover:bg-black/90"
                            : ""
                        }`}
                        onClick={() => setSelectedService(service)}
                      >
                        {service}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <Label className="mb-4 block text-xs font-bold uppercase tracking-widest text-gray-600">
                    Budget
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {budgets.map((budget) => (
                      <Button
                        key={budget}
                        variant={
                          selectedBudget === budget ? "default" : "outline"
                        }
                        size="sm"
                        className={`rounded-full border-[#EDECE8] bg-[#EDECE8] text-sm font-medium hover:bg-gray-300 ${
                          selectedBudget === budget
                            ? "bg-black text-white hover:bg-black/90"
                            : ""
                        }`}
                        onClick={() => setSelectedBudget(budget)}
                      >
                        {budget}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h1 className="text-6xl md:text-7xl font-bold text-black dark:text-white">
                    LET,S CONNECT TO ME..
                  </h1>
                </div>
              </div>

              {/* Right Form Fields */}
              <div className="space-y-12">
                {/* Top Right CTA (visible on all sizes now) */}
                <div className="flex justify-end"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only bottom navigation & socials */}
        <div className="mt-16 border-t border-gray-200 pt-12 md:hidden">
          <div className="space-y-8 text-center">
            <div className="space-y-3">
              {["Home", "About", "Projects", "Blog", "Services", "Contact"].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-lg font-medium transition-colors hover:text-gray-500"
                  >
                    {link}
                  </a>
                )
              )}
            </div>
            <div className="space-y-3 pt-8">
              {["LinkedIn", "Ig", "Tw"].map((social, i) => (
                <a
                  key={social}
                  href="#"
                  className="mx-4 inline-block text-2xl transition-colors hover:text-gray-500"
                >
                  {["LinkedIn", "Instagram", "Twitter"][i]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
