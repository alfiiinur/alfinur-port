"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

const services = [
  "Creative Direction",
  "Photography",
  "Film & Commercials",
  "Music Videos",
  "Other",
];

const budgets = ["Under $5K", "$5K-$10K", "$10K-$25K", "$25K-$50K", "$50K+"];

export default function ContactFormSlider() {
  const [step, setStep] = useState(1); // 1 | 2 | 3

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ganti dengan logika kirim email / API kamu
    console.log("Form submitted:", {
      service: selectedService,
      budget: selectedBudget,
      ...formData,
    });

    alert("Thank you! Your message has been sent.");
    // Reset form jika perlu
    setStep(1);
    setSelectedService(null);
    setSelectedBudget(null);
    setFormData({ name: "", email: "", company: "", message: "" });
  };

  // Validasi tiap step
  const canProceed =
    (step === 1 && selectedService) ||
    (step === 2 && selectedBudget) ||
    (step === 3 &&
      selectedService &&
      selectedBudget &&
      formData.name &&
      formData.email &&
      formData.message);

  return (
    <div className="xl:col-span-2 bg-black rounded-xl p-5 dark:bg-white">
      <div className="mb-10">
        <h1 className="font-bold text-3xl md:text-4xl italic text-white dark:text-black">LET,S COLLABORATE 🙌</h1>
        <p className="text-sm md:text-md text-gray-600 dark:text-gray-400">You have question, we will to answer your question. Discover experiences you wont find anywhere else - throughfully designed to immerse you in the heart of the destination.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-16">
        {/* Progress Dots */}
        <div className="flex items-center justify-center md:justify-start gap-8 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  step >= i ? "bg-black dark:bg-white scale-110" : "bg-gray-300"
                }`}
              />
              {i < 3 && <div className="w-20 md:w-32 h-px bg-gray-300 mx-4" />}
            </div>
          ))}
        </div>

        {/* Step 1: Service */}
        <div
          className={`space-y-8 transition-all duration-500 ${
            step === 1 ? "block" : "hidden"
          }`}
        >
          <Label className="block text-xs font-bold uppercase tracking-widest text-gray-600">
            1. What service are you interested in?
          </Label>
          <div className="flex flex-wrap gap-3">
            {services.map((service) => (
              <Button
                type="button"
                key={service}
                variant={selectedService === service ? "default" : "outline"}
                size="sm"
                className={`rounded-full border-[#EDECE8] bg-[#EDECE8] text-sm font-medium hover:bg-gray-300 ${
                  selectedService === service
                    ? "bg-black text-white hover:bg-black/90"
                    : "text-black"
                }`}
                onClick={() => setSelectedService(service)}
              >
                {service}
              </Button>
            ))}
          </div>
        </div>

        {/* Step 2: Budget */}
        <div
          className={`space-y-8 transition-all duration-500 ${
            step === 2 ? "block" : "hidden"
          }`}
        >
          <Label className="block text-xs font-bold uppercase tracking-widest text-gray-600">
            2. Project budget range
          </Label>
          <div className="flex flex-wrap gap-3">
            {budgets.map((budget) => (
              <Button
                type="button"
                key={budget}
                variant={selectedBudget === budget ? "default" : "outline"}
                size="sm"
                className={`rounded-full border-[#EDECE8] bg-[#EDECE8] text-sm font-medium hover:bg-gray-300 ${
                  selectedBudget === budget
                    ? "bg-black text-white hover:bg-black/90"
                    : "text-black"
                }`}
                onClick={() => setSelectedBudget(budget)}
              >
                {budget}
              </Button>
            ))}
          </div>
        </div>

        {/* Step 3: Details */}
        <div
          className={`space-y-8 transition-all duration-500 ${
            step === 3 ? "block" : "hidden"
          }`}
        >
          <Label className="block text-xs font-bold uppercase tracking-widest text-gray-600">
            3. Tell me about your project
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <Input
                placeholder="Your Name *"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Input
                type="email"
                placeholder="Email Address *"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Input
                placeholder="Company / Brand (optional)"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>

            <Textarea
              placeholder="Project details, timeline, ideas... *"
              className="min-h-60 resize-none"
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-10 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={handlePrev}
            disabled={step === 1}
            className="flex items-center gap-2 text-base"
          >
            <ArrowLeft size={20} />
            Previous
          </Button>

          <div className="flex gap-4">
            {step < 3 ? (
              <Button
                type="button"
                size="lg"
                disabled={!canProceed}
                onClick={handleNext}
                className="flex items-center gap-3 bg-black text-white hover:bg-black/90"
              >
                Next
                <ArrowRight size={20} />
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                disabled={!canProceed}
                className="flex items-center gap-3 bg-black text-white hover:bg-black/90 px-8"
              >
                Send Message
                <ArrowRight size={20} />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
