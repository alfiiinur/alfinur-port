"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Grid3X3, List, LayoutGrid, ChevronDown } from "lucide-react";

interface Skill {
  name: string;
  icon: string;
}

interface SkillCategory {
  name: string;
  skills: Skill[];
  bgColor: string;
  borderColor: string;
}

const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    bgColor:
      "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    skills: [
      {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
      {
        name: "Tailwind",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
      },
    ],
  },
  {
    name: "Backend",
    bgColor:
      "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    skills: [
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      },
      {
        name: "Express",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
      },
      {
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      },
      {
        name: "Prisma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg",
      },
    ],
  },
  {
    name: "DevOps & Tools",
    bgColor:
      "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    skills: [
      {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      },
      {
        name: "Docker",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
      },
      {
        name: "AWS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
      },
      {
        name: "Vercel",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
      },
    ],
  },
  {
    name: "Design",
    bgColor:
      "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30",
    borderColor: "border-pink-200 dark:border-pink-800",
    skills: [
      {
        name: "Figma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      },
      {
        name: "Photoshop",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg",
      },
      {
        name: "Illustrator",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg",
      },
      {
        name: "Canva",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg",
      },
    ],
  },
  {
    name: "IT Support",
    bgColor:
      "bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30",
    borderColor: "border-teal-200 dark:border-teal-800",
    skills: [
      {
        name: "Windows",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows11/windows11-original.svg",
      },
      {
        name: "Linux",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
      },
      {
        name: "Networking",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cisco/cisco-original.svg",
      },
      {
        name: "VMware",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vsphere/vsphere-original.svg",
      },
    ],
  },
];

type ViewMode = "category" | "grid" | "list";

export default function TechnicalExpertise() {
  const [viewMode, setViewMode] = useState<ViewMode>("category");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const allSkills = skillCategories.flatMap((cat) =>
    cat.skills.map((skill) => ({ ...skill, category: cat.name }))
  );

  const viewOptions = [
    { value: "category" as ViewMode, label: "Category", icon: LayoutGrid },
    { value: "grid" as ViewMode, label: "Grid", icon: Grid3X3 },
    { value: "list" as ViewMode, label: "List", icon: List },
  ];

  const currentView = viewOptions.find((v) => v.value === viewMode);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block"
            >
              Technical Expertise
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
            >
              Skills & Tools
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {currentView && <currentView.icon className="w-4 h-4" />}
              <span>View: {currentView?.label}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-10"
                >
                  {viewOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setViewMode(option.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                        viewMode === option.value
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "category" && (
            <CategoryView categories={skillCategories} />
          )}
          {viewMode === "grid" && <GridView skills={allSkills} />}
          {viewMode === "list" && <ListView skills={allSkills} />}
        </AnimatePresence>
      </div>
    </section>
  );
}

function CategoryView({ categories }: { categories: SkillCategory[] }) {
  return (
    <motion.div
      key="category"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {categories.map((category, categoryIndex) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: categoryIndex * 0.1 }}
          className={`${category.bgColor} rounded-2xl p-6 border ${category.borderColor} hover:shadow-lg transition-shadow`}
        >
          <div className="grid grid-cols-2 gap-2 mb-4">
            {category.skills.map((skill) => (
              <motion.div
                key={skill.name}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex items-center justify-center p-4    transition-all cursor-pointer"
              >
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
            {category.name}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function GridView({ skills }: { skills: Array<Skill & { category: string }> }) {
  return (
    <motion.div
      key="grid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4"
    >
      {skills.map((skill, index) => (
        <motion.div
          key={`${skill.category}-${skill.name}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.02 }}
          whileHover={{ scale: 1.1, y: -5 }}
          className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <Image
            src={skill.icon}
            alt={skill.name}
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400 text-center truncate w-full">
            {skill.name}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

function ListView({ skills }: { skills: Array<Skill & { category: string }> }) {
  return (
    <motion.div
      key="list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-3"
    >
      {skills.map((skill, index) => (
        <motion.div
          key={`${skill.category}-${skill.name}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.02 }}
          whileHover={{ x: 5 }}
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <Image
            src={skill.icon}
            alt={skill.name}
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {skill.name}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {skill.category}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
