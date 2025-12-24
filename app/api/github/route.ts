"use server";

import { NextResponse } from "next/server";

const GITHUB_USERNAME = "alfiiinur";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  homepage: string;
  owner: {
    login: string;
  };
}

// Language colors mapping
const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Shell: "#89e051",
  Jupyter: "#DA5B0B",
};

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    // Fetch user profile
    const userRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}`,
      { headers, next: { revalidate: 3600 } }
    );

    if (!userRes.ok) {
      throw new Error("Failed to fetch user");
    }

    const user: GitHubUser = await userRes.json();

    // Fetch repos (sorted by updated)
    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`,
      { headers, next: { revalidate: 3600 } }
    );

    if (!reposRes.ok) {
      throw new Error("Failed to fetch repos");
    }

    const repos: GitHubRepo[] = await reposRes.json();

    // Transform repos data
    const transformedRepos = repos.map((repo) => ({
      owner: repo.owner.login,
      repo: repo.name,
      link: repo.html_url,
      description: repo.description || "",
      website: repo.homepage || undefined,
      language: repo.language || "Unknown",
      languageColor: languageColors[repo.language] || "#888888",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    }));

    // Fetch contribution data using GitHub Events API
    const eventsRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`,
      { headers, next: { revalidate: 3600 } }
    );

    let activityStats = {
      commits: 0,
      issues: 0,
      pullRequests: 0,
      codeReview: 0,
    };

    if (eventsRes.ok) {
      const events = await eventsRes.json();
      events.forEach((event: { type: string }) => {
        switch (event.type) {
          case "PushEvent":
            activityStats.commits++;
            break;
          case "IssuesEvent":
            activityStats.issues++;
            break;
          case "PullRequestEvent":
            activityStats.pullRequests++;
            break;
          case "PullRequestReviewEvent":
            activityStats.codeReview++;
            break;
        }
      });

      // Normalize to percentages
      const total =
        activityStats.commits +
        activityStats.issues +
        activityStats.pullRequests +
        activityStats.codeReview;
      if (total > 0) {
        activityStats = {
          commits: Math.round((activityStats.commits / total) * 100),
          issues: Math.round((activityStats.issues / total) * 100),
          pullRequests: Math.round((activityStats.pullRequests / total) * 100),
          codeReview: Math.round((activityStats.codeReview / total) * 100),
        };
      }
    }

    // Get contributed repos from events
    const contributedReposSet = new Set<string>();
    if (eventsRes.ok) {
      const events = await eventsRes.json();
      events.forEach((event: { repo?: { name: string; url: string } }) => {
        if (event.repo) {
          contributedReposSet.add(event.repo.name);
        }
      });
    }

    const contributedRepos = Array.from(contributedReposSet)
      .slice(0, 5)
      .map((name) => ({
        name: name.length > 30 ? name.substring(0, 27) + "..." : name,
        url: `https://github.com/${name}`,
      }));

    return NextResponse.json({
      user: {
        login: user.login,
        name: user.name,
        avatar: user.avatar_url,
        bio: user.bio,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
        url: user.html_url,
      },
      repos: transformedRepos,
      activityStats,
      contributedRepos,
      totalRepos: contributedReposSet.size,
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
