"use client";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Book, ChevronDown, ExternalLink, GitFork, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RoundedButton } from "../RoundedButton";
import { FALLBACK_REPOS } from "@/components/dataMock/repo-task";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/lib/hooks/useLanguage";

const INITIAL_DISPLAY_COUNT = 6;

export const GithubProfile = () => {
  const { t } = useLanguage();
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  const displayedRepos = FALLBACK_REPOS.slice(0, displayCount);
  const hasMore = displayCount < FALLBACK_REPOS.length;
  const remainingCount = FALLBACK_REPOS.length - displayCount;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 6, FALLBACK_REPOS.length));
  };

  return (
    <section className="w-full py-12 sm:py-16 lg:py-24 space-y-12 lg:space-y-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-anton text-black dark:text-white flex flex-col sm:flex-row items-center gap-3">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>{t("openSourceContributions")}</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            {t("loveBuildingPublic")}
          </p>
        </div>

        <RoundedButton
          href="https://github.com/alfiiinur"
          className="w-fit mx-auto sm:mx-0"
        >
          {t("seeMoreOnGithub")}
        </RoundedButton>
      </div>

      {/* Repos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {displayedRepos.map((repo, index) => (
          <AnimatePresence key={repo.repo} mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                href={repo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="h-full border-2 border-transparent hover:border-black dark:hover:border-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 rounded-xl overflow-hidden">
                  <CardHeader className="p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Book className="w-5 h-5 text-muted-foreground shrink-0" />
                        <span className="font-semibold text-base sm:text-lg truncate">
                          {repo.owner}/
                          <span className="text-blue-600 dark:text-blue-400">
                            {repo.repo}
                          </span>
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>

                    <CardDescription className="text-sm sm:text-base line-clamp-3 mb-4">
                      {repo.description || "No description available."}
                    </CardDescription>

                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{
                            backgroundColor: repo.languageColor || "#888",
                          }}
                        />
                        <span className="truncate max-w-24">
                          {repo.language || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 shrink-0" />
                        <span>{repo.stars?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4 shrink-0" />
                        <span>{repo.forks?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          </AnimatePresence>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <button
            onClick={handleLoadMore}
            className="group flex items-center gap-2 px-6 py-3 rounded-full border-2 border-black dark:border-white text-black dark:text-white font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
          >
            <span>
              {t("loadMore")} ({remainingCount} {t("remaining")})
            </span>
            <ChevronDown
              size={18}
              className="transition-transform group-hover:translate-y-1"
            />
          </button>
        </motion.div>
      )}
    </section>
  );
};
