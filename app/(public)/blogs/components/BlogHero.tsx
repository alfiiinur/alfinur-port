"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useLanguage } from "@/lib/hooks/useLanguage";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  createdAt: Date;
}

interface BlogHeroProps {
  featuredBlog?: Blog | null;
}

export default function BlogHero({ featuredBlog }: BlogHeroProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      description:
        "Explore articles on web development, design patterns, and modern technology. Discover insights and tutorials to level up your skills.",
      topics: "Topics",
      topicsValue: "Tech & Design",
      updated: "Updated",
      featured: "Featured",
    },
    id: {
      description:
        "Jelajahi artikel tentang pengembangan web, pola desain, dan teknologi modern. Temukan wawasan dan tutorial untuk meningkatkan keahlian Anda.",
      topics: "Topik",
      topicsValue: "Teknologi & Desain",
      updated: "Diperbarui",
      featured: "Unggulan",
    },
  };

  const t = content[language];

  const formattedDate = new Date().toLocaleDateString(
    language === "id" ? "id-ID" : "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <section className="min-h-screen bg-white dark:bg-black">
      {/* Hero Content */}
      <div className="container mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left - Big Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[15vw] md:text-[12vw] lg:text-[8vw] font-black text-black dark:text-white uppercase leading-[0.9] tracking-tighter">
              ALFI
              <br />
              JOURNAL
            </h1>
          </motion.div>

          {/* Right - Description & Meta */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:pt-8"
          >
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
              {t.description}
            </p>

            <div className="flex gap-12 md:gap-16">
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                  {t.topics}
                </span>
                <span className="text-sm md:text-base font-bold text-foreground uppercase">
                  {t.topicsValue}
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                  {t.updated}
                </span>
                <span className="text-sm md:text-base font-bold text-foreground uppercase">
                  {formattedDate}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hero Image - Full Width with Grayscale Effect */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative w-full"
      >
        {/* Background grayscale layer */}
        <div className="absolute inset-0 -left-[10%] -right-[10%] h-full">
          <div className="relative w-full h-full">
            <Image
              src={featuredBlog?.thumbnail || "/img/room.jpg"}
              alt="Background"
              fill
              className="object-cover grayscale opacity-30 dark:opacity-20"
            />
          </div>
        </div>

        {/* Main Image */}
        <div className="container mx-auto px-4 md:px-8 relative">
          <div className="relative aspect-video md:aspect-21/9 rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={featuredBlog?.thumbnail || "/img/room.jpg"}
              alt={featuredBlog?.title || "Featured Blog"}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

            {/* Featured Badge */}
            {featuredBlog && (
              <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8">
                <span className="inline-block text-xs font-medium bg-white/90 dark:bg-black/80 text-black dark:text-white px-3 py-1 rounded-full mb-3">
                  {t.featured} • {featuredBlog.category}
                </span>
                <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-2xl">
                  {featuredBlog.title}
                </h2>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Spacer */}
      <div className="h-16 md:h-24" />
    </section>
  );
}
