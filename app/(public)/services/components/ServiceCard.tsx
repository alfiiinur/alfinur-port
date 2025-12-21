"use client";

import { Star } from "lucide-react";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  price: number | null;
  priceType: string;
  currency: string;
  features: string[];
  category: string;
  isPopular: boolean;
}

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const formatPrice = () => {
    if (service.priceType === "CONTACT_US") return "Contact Us";
    if (!service.price) return "-";

    const formatted = new Intl.NumberFormat("id-ID").format(service.price);

    switch (service.priceType) {
      case "STARTING_FROM":
        return `Rp ${formatted}`;
      case "HOURLY":
        return `Rp ${formatted}`;
      default:
        return `Rp ${formatted}`;
    }
  };

  const getPriceLabel = () => {
    switch (service.priceType) {
      case "STARTING_FROM":
        return "Starting from";
      case "HOURLY":
        return "Per hour";
      case "FIXED":
        return "Fixed price";
      default:
        return "";
    }
  };

  return (
    <div className="group relative flex flex-col h-full">
      {/* Popular Badge */}
      {service.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            POPULAR
          </span>
        </div>
      )}

      {/* Card Container */}
      <div
        className={`relative flex flex-col h-full bg-white dark:bg-card border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
          service.isPopular
            ? "border-blue-500 dark:border-blue-400"
            : "border-gray-100 hover:border-blue-500 dark:border-gray-800 dark:hover:border-blue-500"
        }`}
      >
        {/* Category Badge */}
        <div className="inline-block mb-4">
          <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
            {service.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 mb-6 min-h-[3rem] line-clamp-2">
          {service.description}
        </p>

        {/* Price */}
        <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatPrice()}
            </span>
          </div>
          {service.priceType !== "CONTACT_US" && (
            <span className="text-sm text-gray-500">{getPriceLabel()}</span>
          )}
        </div>

        {/* Features List */}
        <div className="flex-grow">
          <ul className="space-y-3 mb-6">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <a
          href="/contact"
          className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 hover:shadow-lg text-center"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
