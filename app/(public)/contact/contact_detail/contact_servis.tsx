"use client";

import ContactFormSlider from "./ContactFormSlider";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "alfinurdanialin900@gmail.com",
    href: "mailto:alfinurdanialin900@gmail.com",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+62 81217221460",
    href: "https://wa.me/6281217221460",
  },
  {
    icon: MapPin,
    label: "Lokasi",
    value: "Surabaya, Indonesia",
    href: null,
  },
  {
    icon: Clock,
    label: "Jam Kerja",
    value: "Sen - Jum, 09:00 - 18:00",
    href: null,
  },
];

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/alfii_nur1/" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/alfinur/" },
  { name: "GitHub", href: "https://github.com/alfiiinur" },
  { name: "Dribbble", href: "https://dribbble.com/alfiii2" },
];

export default function ContactServis() {
  return (
    <section className="min-h-screen bg-white dark:bg-black py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
            Contact
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-black dark:text-white leading-tight mb-6">
            Let&apos;s Work
            <br />
            Together
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
            Have a project idea or want to collaborate? I'm ready to help you
            realize your digital vision.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Contact Info */}
          <div className="space-y-12">
            {/* Contact Details */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Hubungi Saya
              </h3>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
                      <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {item.label}
                      </p>
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="text-sm font-medium text-black dark:text-white hover:underline"
                        >
                          {item.value}
                        </Link>
                      ) : (
                        <p className="text-sm font-medium text-black dark:text-white">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Follow Me
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full text-sm font-medium text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    {social.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Response */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
              <h4 className="font-semibold text-black dark:text-white mb-2">
                Respon Cepat ⚡
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Saya biasanya merespons dalam 24 jam. Untuk project urgent,
                hubungi via WhatsApp.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-2">
            <ContactFormSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
