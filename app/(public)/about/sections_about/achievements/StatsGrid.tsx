"use client";

import { motion } from "framer-motion";

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

const stats: StatItem[] = [
  { value: "15", suffix: "+", label: "CLIENTS" },
  { value: "2", suffix: "+", label: "YEARS EXPERIENCE" },
  { value: "5", suffix: "+", label: "PROBLEMS SOLVED" },
  { value: "98", suffix: "%", label: "CLIENT SATISFACTION" },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 border border-slate-800/60">
      {stats.map((stat, index) => (
        <StatItem key={index} stat={stat} index={index} />
      ))}
    </div>
  );
}

function StatItem({ stat, index }: { stat: StatItem; index: number }) {
  // Border logic untuk grid effect
  const borderClasses = `
    ${
      index % 2 !== 1
        ? "border-r border-slate-800/60"
        : "lg:border-r lg:border-slate-800/60"
    }
    ${index < 2 ? "border-b border-slate-800/60 lg:border-b-0" : ""}
    ${index !== 3 ? "lg:border-r" : "lg:border-r-0"}
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative ${borderClasses}`}
    >
      {/* Cell container */}
      <div className="relative p-8 md:p-12 overflow-hidden transition-all duration-500">
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/10 transition-all duration-500" />

        {/* Corner dots on hover */}
        <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-purple-500 transition-colors duration-300" />
        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-purple-500 transition-colors duration-300" />
        <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors duration-300" />
        <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors duration-300" />

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Number with suffix */}
          <div className="flex items-baseline justify-center gap-0.5 mb-3">
            <motion.span
              className="text-5xl md:text-6xl lg:text-7xl font-bold dark:text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-500 "
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {stat.value}
            </motion.span>
            {stat.suffix && (
              <span className="text-4xl md:text-5xl lg:text-6xl font-bold dark:text-white group-hover:text-purple-400 transition-colors duration-500">
                {stat.suffix}
              </span>
            )}
          </div>

          {/* Label */}
          <p className="text-[10px] md:text-xs font-medium tracking-[0.2em] text-gray-500 uppercase group-hover:text-gray-400 transition-colors duration-300">
            {stat.label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
