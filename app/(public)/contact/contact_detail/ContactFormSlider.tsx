"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";

const services = [
  {
    id: "web-development",
    label: "Web Development",
    description: "Website, Web App, E-commerce",
  },
  {
    id: "ui-ux-design",
    label: "UI/UX Design",
    description: "Interface & Experience Design",
  },

  {
    id: "it-consulting",
    label: "IT Consulting",
    description: "Technical Strategy & Planning",
  },
  {
    id: "branding",
    label: "Branding",
    description: "Logo, Identity, Guidelines",
  },
  { id: "other", label: "Other", description: "Custom Project Request" },
];

const budgets = [
  { id: "under-5m", label: "< Rp 5 Juta", description: "Small project" },
  { id: "5m-15m", label: "Rp 5-15 Juta", description: "Medium project" },
  { id: "15m-50m", label: "Rp 15-50 Juta", description: "Large project" },
  { id: "50m-100m", label: "Rp 50-100 Juta", description: "Enterprise" },
  { id: "above-100m", label: "> Rp 100 Juta", description: "Custom quote" },
  { id: "discuss", label: "Let's Discuss", description: "Flexible budget" },
];

const timelines = [
  { id: "asap", label: "ASAP", description: "Start immediately" },
  { id: "1-2-weeks", label: "1-2 Weeks", description: "Quick turnaround" },
  { id: "1-month", label: "1 Month", description: "Standard timeline" },
  { id: "2-3-months", label: "2-3 Months", description: "Complex project" },
  { id: "flexible", label: "Flexible", description: "No rush" },
];

export default function ContactFormSlider() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          service:
            services.find((s) => s.id === selectedService)?.label ||
            selectedService,
          budget:
            budgets.find((b) => b.id === selectedBudget)?.label ||
            selectedBudget,
          timeline:
            timelines.find((t) => t.id === selectedTimeline)?.label ||
            selectedTimeline,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setIsSuccess(true);
    } catch (err) {
      setError("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedBudget(null);
    setSelectedTimeline(null);
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    setIsSuccess(false);
    setError(null);
  };

  // Validation per step
  const canProceed =
    (step === 1 && selectedService) ||
    (step === 2 && selectedBudget) ||
    (step === 3 && selectedTimeline) ||
    (step === 4 && formData.name && formData.email && formData.message);

  if (isSuccess) {
    return (
      <div className="xl:col-span-2 bg-black rounded-xl p-8 dark:bg-white flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white dark:text-black mb-4 text-center">
          Pesan Terkirim! 🎉
        </h2>
        <p className="text-gray-400 dark:text-gray-600 text-center mb-8 max-w-md">
          Terima kasih telah menghubungi kami. Kami akan segera merespons pesan
          Anda dalam 1-2 hari kerja.
        </p>
        <Button onClick={resetForm} variant="outline" className="rounded-full">
          Kirim Pesan Lain
        </Button>
      </div>
    );
  }

  return (
    <div className="xl:col-span-2 bg-black rounded-xl p-6 md:p-8 dark:bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-2xl md:text-3xl text-white dark:text-black mb-2">
          Mari Berkolaborasi 🚀
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-600">
          Ceritakan project Anda dan kami akan membantu mewujudkannya.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[
            { num: 1, label: "Layanan" },
            { num: 2, label: "Budget" },
            { num: 3, label: "Timeline" },
            { num: 4, label: "Detail" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step >= s.num
                      ? "bg-white text-black dark:bg-black dark:text-white"
                      : "bg-gray-700 text-gray-400 dark:bg-gray-200 dark:text-gray-500"
                  }`}
                >
                  {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                </div>
                <span className="text-[10px] mt-1 text-gray-500 hidden md:block">
                  {s.label}
                </span>
              </div>
              {i < 3 && (
                <div
                  className={`w-8 md:w-16 h-0.5 mx-2 ${
                    step > s.num
                      ? "bg-white dark:bg-black"
                      : "bg-gray-700 dark:bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Service Selection */}
        <div className={`space-y-6 ${step === 1 ? "block" : "hidden"}`}>
          <div>
            <Label className="block text-sm font-bold text-white dark:text-black mb-2">
              Layanan apa yang Anda butuhkan?
            </Label>
            <p className="text-xs text-gray-500 mb-4">
              Pilih satu layanan yang paling sesuai
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {services.map((service) => (
              <button
                type="button"
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedService === service.id
                    ? "border-white bg-white/10 dark:border-black dark:bg-black/10"
                    : "border-gray-700 hover:border-gray-500 dark:border-gray-300 dark:hover:border-gray-400"
                }`}
              >
                <span className="font-semibold text-white dark:text-black block">
                  {service.label}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  {service.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Budget Selection */}
        <div className={`space-y-6 ${step === 2 ? "block" : "hidden"}`}>
          <div>
            <Label className="block text-sm font-bold text-white dark:text-black mb-2">
              Berapa estimasi budget Anda?
            </Label>
            <p className="text-xs text-gray-500 mb-4">
              Ini membantu kami menyesuaikan solusi terbaik
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {budgets.map((budget) => (
              <button
                type="button"
                key={budget.id}
                onClick={() => setSelectedBudget(budget.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedBudget === budget.id
                    ? "border-white bg-white/10 dark:border-black dark:bg-black/10"
                    : "border-gray-700 hover:border-gray-500 dark:border-gray-300 dark:hover:border-gray-400"
                }`}
              >
                <span className="font-semibold text-white dark:text-black block text-sm">
                  {budget.label}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  {budget.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Timeline Selection */}
        <div className={`space-y-6 ${step === 3 ? "block" : "hidden"}`}>
          <div>
            <Label className="block text-sm font-bold text-white dark:text-black mb-2">
              Kapan project ini harus selesai?
            </Label>
            <p className="text-xs text-gray-500 mb-4">
              Pilih timeline yang realistis untuk hasil terbaik
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {timelines.map((timeline) => (
              <button
                type="button"
                key={timeline.id}
                onClick={() => setSelectedTimeline(timeline.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedTimeline === timeline.id
                    ? "border-white bg-white/10 dark:border-black dark:bg-black/10"
                    : "border-gray-700 hover:border-gray-500 dark:border-gray-300 dark:hover:border-gray-400"
                }`}
              >
                <span className="font-semibold text-white dark:text-black block">
                  {timeline.label}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  {timeline.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Contact Details */}
        <div className={`space-y-6 ${step === 4 ? "block" : "hidden"}`}>
          <div>
            <Label className="block text-sm font-bold text-white dark:text-black mb-2">
              Informasi Kontak & Detail Project
            </Label>
            <p className="text-xs text-gray-500 mb-4">
              Isi data Anda agar kami bisa menghubungi Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-gray-400">Nama Lengkap *</Label>
              <Input
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-gray-900 border-gray-700 text-white dark:bg-gray-100 dark:border-gray-300 dark:text-black"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-400">Email *</Label>
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
              <Label className="text-xs text-gray-400">No. WhatsApp</Label>
              <Input
                placeholder="08123456789"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="bg-gray-900 border-gray-700 text-white dark:bg-gray-100 dark:border-gray-300 dark:text-black"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-400">
                Perusahaan / Brand
              </Label>
              <Input
                placeholder="PT. Example"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="bg-gray-900 border-gray-700 text-white dark:bg-gray-100 dark:border-gray-300 dark:text-black"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-gray-400">Detail Project *</Label>
            <Textarea
              placeholder="Ceritakan tentang project Anda: tujuan, fitur yang diinginkan, referensi desain, dll..."
              className="min-h-32 resize-none bg-gray-900 border-gray-700 text-white dark:bg-gray-100 dark:border-gray-300 dark:text-black"
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
          </div>

          {/* Summary */}
          <div className="p-4 bg-gray-900 dark:bg-gray-100 rounded-xl">
            <p className="text-xs text-gray-400 dark:text-gray-600 mb-2">
              Ringkasan:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedService && (
                <span className="px-3 py-1 bg-white/10 dark:bg-black/10 rounded-full text-xs text-white dark:text-black">
                  {services.find((s) => s.id === selectedService)?.label}
                </span>
              )}
              {selectedBudget && (
                <span className="px-3 py-1 bg-white/10 dark:bg-black/10 rounded-full text-xs text-white dark:text-black">
                  {budgets.find((b) => b.id === selectedBudget)?.label}
                </span>
              )}
              {selectedTimeline && (
                <span className="px-3 py-1 bg-white/10 dark:bg-black/10 rounded-full text-xs text-white dark:text-black">
                  {timelines.find((t) => t.id === selectedTimeline)?.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-800 dark:border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={handlePrev}
            disabled={step === 1}
            className="text-gray-400 hover:text-white dark:hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              disabled={!canProceed}
              onClick={handleNext}
              className="bg-white text-black hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800"
            >
              Lanjut
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!canProceed || isSubmitting}
              className="bg-white text-black hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800 px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  Kirim Pesan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
