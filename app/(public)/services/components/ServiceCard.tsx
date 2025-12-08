"use client";

import { ServiceCard as ServiceCardType } from "@/components/dataMock/services";
import { useState } from "react";

interface ServiceCardProps {
  service: ServiceCardType;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className="group relative flex flex-col h-full">
      {/* Popular Badge */}
      {service.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
            POPULAR
          </span>
        </div>
      )}

      {/* Card Container */}
      <div
        className={`relative flex flex-col h-full bg-white dark:bg-card border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
          service.popular
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
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {service.title}
        </h3>

        {/* Description - Fixed Height for alignment */}
        <p className="text-gray-500 mb-6 min-h-[3rem]">{service.description}</p>

        {/* Price */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {service.price}
            </span>
            {service.priceDetail && (
              <span className="text-sm text-gray-500">
                {service.priceDetail}
              </span>
            )}
          </div>
        </div>

        {/* === CONDITIONAL CONTENT AREA === */}
        {/* Gunakan flex-grow agar tombol selalu terdorong ke bawah jika konten sedikit */}
        <div className="flex-grow">
          {/* 1. Features List (HANYA TAMPIL JIKA SHOWSTEPS FALSE) */}
          {!showSteps && (
            <ul className="space-y-3 mb-6 animate-in fade-in duration-300">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  {/* SVG Check Icon */}
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
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          )}

          {/* 2. Steps Section (HANYA TAMPIL JIKA SHOWSTEPS TRUE) */}
          {showSteps && (
            <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-4">
                {service.steps.map((step) => (
                  <div
                    key={step.step}
                    className="flex gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold text-gray-900 mb-1">
                        {step.title}
                      </h5>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Toggle Steps Button */}
        <button
          onClick={() => setShowSteps(!showSteps)}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 border ${
            showSteps
              ? "bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200" // Style saat mode "Hide" (Neutral)
              : "bg-gray-900 text-white border-transparent hover:bg-gray-800 hover:shadow-lg" // Style saat mode "View" (Primary)
          }`}
        >
          {showSteps ? "Back to Features" : "View Process"}
        </button>
      </div>
    </div>
  );
}
