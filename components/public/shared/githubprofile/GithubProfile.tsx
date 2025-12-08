"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Book, ExternalLink, GitFork, Github, Star } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { RoundedButton } from "../RoundedButton";
import { FALLBACK_REPOS } from "@/components/dataMock/repo-task";

interface PinnedRepo {
  owner: string;
  repo: string;
  link: string;
  description: string;
  image: string;
  website: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
}

const GITHUB_USERNAME = "alfiiinur";

export const GithubProfile = () => {
  const { theme } = useTheme();
  const [pinnedRepos, setPinnedRepos] = useState<PinnedRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPinned = async () => {
      try {
        const res = await fetch(
          `https://gh-pinned-repos.egoist.dev/?username=${GITHUB_USERNAME}`
        );
        if (res.ok) {
          const data = await res.json();
          setPinnedRepos(data.length > 0 ? data : FALLBACK_REPOS);
        } else {
          throw new Error("API down");
        }
      } catch (err) {
        console.log("Using fallback repos");
        setPinnedRepos(FALLBACK_REPOS);
      } finally {
        setLoading(false);
      }
    };

    fetchPinned();
  }, []);

  // Responsive settings for GitHub Calendar
  const responsiveCalendar = {
    blockSize: window.innerWidth < 640 ? 10 : 14,
    blockMargin: window.innerWidth < 640 ? 3 : 5,
    fontSize: window.innerWidth < 640 ? 12 : 14,
  };

  return (
    <section className="w-full py-12 sm:py-16 lg:py-24 space-y-12 lg:space-y-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-anton text-black dark:text-white flex flex-col sm:flex-row items-center gap-3">
            <Github className="w-10 h-10 sm:w-12 sm:h-12" />
            <span>Open Source & Contributions</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            I love building in public. Here are some of my favorite projects.
          </p>
        </div>

        <RoundedButton href="/about" className="w-fit mx-auto sm:mx-0">
          See More on GitHub
        </RoundedButton>
      </div>

      {/* Pinned Repos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-48">
                <CardHeader>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5" />
                  </div>
                </CardContent>
              </Card>
            ))
          : pinnedRepos.map((repo) => (
              <Link
                href={repo.link}
                key={repo.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="h-full border-2 border-transparent hover:border-black dark:hover:border-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 rounded-xl overflow-hidden">
                  <CardHeader className="p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Book className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <span className="font-semibold text-base sm:text-lg truncate">
                          {repo.owner}/
                          <span className="text-blue-600 dark:text-blue-400">
                            {repo.repo}
                          </span>
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>

                    <CardDescription className="text-sm sm:text-base line-clamp-3 mb-4">
                      {repo.description || "No description available."}
                    </CardDescription>

                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: repo.languageColor || "#888",
                          }}
                        />
                        <span className="truncate max-w-24">
                          {repo.language || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 flex-shrink-0" />
                        <span>{repo.stars?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4 flex-shrink-0" />
                        <span>{repo.forks?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
      </div>

      {/* GitHub Contributions Calendar */}
      <div className="space-y-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-anton text-center uppercase italic text-black dark:text-white">
          <Github className="inline-block w-12 h-12 sm:w-16 sm:h-16 mr-3" />
          Contribution Graph
        </h2>

        <div className="w-full overflow-x-auto pb-4 ">
          <div className="p-6 overflow-x-auto flex justify-center items-center bg-gray-50 dark:bg-gray-100  border-0 rounded-2xl shadow-none ">
            <GitHubCalendar
              username={GITHUB_USERNAME}
              blockSize={responsiveCalendar.blockSize}
              blockMargin={responsiveCalendar.blockMargin}
              fontSize={responsiveCalendar.fontSize}
              colorScheme={theme === "dark" ? "dark" : "light"}
              theme={{
                light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
                dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
              }}
              hideColorLegend={window.innerWidth < 640}
              hideMonthLabels={window.innerWidth < 480}
              hideTotalCount={window.innerWidth < 640}
              style={{ margin: "0 auto" }}
            />
          </div>
        </div>

        {/* Optional: Mobile fallback message */}
        <p className="text-center text-sm text-muted-foreground block sm:hidden">
          Scroll horizontally to see full contribution history
        </p>
      </div>
    </section>
  );
};
