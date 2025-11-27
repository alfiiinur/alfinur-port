"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Book, ExternalLink, GitFork, Star } from "lucide-react";
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

  return (
    <section className="w-full py-16 space-y-12">
      {/* JUDUL */}
      <div className="flex justify-between ">
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold font-anton text-black dark:text-white  ">
            Open Source & Contributions
          </h2>
          <p className="mt-3 text-muted-foreground ">
            I love building in public. Here are some of my favorite projects.
          </p>
        </div>
        <RoundedButton href="/about" className="mt-6 float-right">
          See More on GitHub
        </RoundedButton>
      </div>

      {/* GRID REPO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mt-2" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5 mt-2" />
                </CardContent>
              </Card>
            ))
          : pinnedRepos.map((repo) => (
              <Link
                href={repo.link}
                key={repo.repo}
                target="_blank"
                className="block group"
              >
                <Card className="h-full border-2 border-transparent hover:border-black dark:hover:border-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Book className="w-5 h-5 text-muted-foreground" />
                        <span className="font-semibold text-lg group-hover:underline">
                          {repo.owner}/
                          <span className="text-blue-600 dark:text-blue-400">
                            {repo.repo}
                          </span>
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base line-clamp-2">
                      {repo.description || "No description available."}
                    </CardDescription>

                    <div className="flex items-center gap-5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: repo.languageColor || "#888",
                          }}
                        />
                        <span>{repo.language || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{repo.stars || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        <span>{repo.forks || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>

      {/* GITHUB CALENDAR + TAHUN (Custom Fix) */}
      <div className="space-y-4 pt-4">
        <h2 className="text-4xl md:text-6xl font-bold font-anton text-black dark:text-white text-center uppercase italic">
          GitHub Contributions
        </h2>
        <Card className="p-6 overflow-x-auto flex justify-center items-center bg-white dark:bg-black/20 shadow-none border-0">
          <GitHubCalendar
            username={GITHUB_USERNAME}
            colorScheme={theme === "dark" ? "dark" : "light"}
            blockSize={12}
            blockMargin={4}
            fontSize={14}
            // Kamu bisa kustomisasi warna agar sesuai tema websitemu
            theme={{
              light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
          />
        </Card>
      </div>
    </section>
  );
};
