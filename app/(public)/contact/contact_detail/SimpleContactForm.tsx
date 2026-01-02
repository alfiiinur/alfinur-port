"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/hooks/useLanguage";

export default function SimpleContactForm() {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  // Translations
  const texts = {
    en: {
      title: "Get In Touch",
      subtitle: "Have a question or want to work together? Send me a message!",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone Number",
      message: "Message",
      messagePlaceholder: "Tell me about your project or question...",
      submit: "Send Message",
      sending: "Sending...",
      successTitle: "Message Sent! 🎉",
      successDesc:
        "Thank you for reaching out. I will respond to your message within 1-2 business days.",
      sendAnother: "Send Another Message",
      errorMsg: "Failed to send message. Please try again.",
      required: "Required",
    },
    id: {
      title: "Hubungi Saya",
      subtitle:
        "Punya pertanyaan atau ingin bekerja sama? Kirim pesan kepada saya!",
      firstName: "Nama Depan",
      lastName: "Nama Belakang",
      email: "Email",
      phone: "Nomor Telepon",
      message: "Pesan",
      messagePlaceholder: "Ceritakan tentang proyek atau pertanyaan Anda...",
      submit: "Kirim Pesan",
      sending: "Mengirim...",
      successTitle: "Pesan Terkirim! 🎉",
      successDesc:
        "Terima kasih telah menghubungi. Saya akan merespons pesan Anda dalam 1-2 hari kerja.",
      sendAnother: "Kirim Pesan Lain",
      errorMsg: "Gagal mengirim pesan. Silakan coba lagi.",
      required: "Wajib",
    },
  };

  const t = texts[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone || null,
          company: null,
          service: "General Inquiry",
          budget: null,
          timeline: null,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setIsSuccess(true);
    } catch {
      setError(t.errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    });
    setIsSuccess(false);
    setError(null);
  };

  const isValid = formData.firstName && formData.email && formData.message;

  if (isSuccess) {
    return (
      <div className="xl:col-span-2 bg-black rounded-xl p-8 dark:bg-white flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white dark:text-black mb-4 text-center">
          {t.successTitle}
        </h2>
        <p className="text-gray-400 dark:text-gray-600 text-center mb-8 max-w-md">
          {t.successDesc}
        </p>
        <Button onClick={resetForm} variant="outline" className="rounded-full">
          {t.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <div className="xl:col-span-2 bg-black rounded-xl p-6 md:p-8 dark:bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-2xl md:text-3xl text-white dark:text-black mb-2">
          {t.title}
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-600">{t.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-400 flex items-center gap-1">
              {t.firstName} <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="John"
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="bg-gray-900 border-gray-700 text-white dark:bg-gray-100 dark:border-gray-300 dark:text-black"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-gray-400">{t.lastName}</Label>
            <Input
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="bg-gray-900 border-gray-700 text-white dark:bg-gray-100 dark:border-gray-300 dark:text-black"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-400 flex items-center gap-1">
              {t.email} <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="john@example.com"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-gray-900 border-gray-700 text-white dark:bg-gray-100 dark:border-gray-300 dark:text-black"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-gray-400">{t.phone}</Label>
            <Input
              placeholder="08123456789"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="bg-gray-900 border-gray-700 text-white dark:bg-gray-100 dark:border-gray-300 dark:text-black"
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-400 flex items-center gap-1">
            {t.message} <span className="text-red-500">*</span>
          </Label>
          <Textarea
            placeholder={t.messagePlaceholder}
            className="min-h-32 resize-none bg-gray-900 border-gray-700 text-white dark:bg-gray-100 dark:border-gray-300 dark:text-black"
            required
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full bg-white text-black hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800 py-6 text-lg font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t.sending}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {t.submit}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
