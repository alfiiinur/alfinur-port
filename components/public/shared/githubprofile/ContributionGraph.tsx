"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionWeek {
  days: ContributionDay[];
}

interface ContributionData {
  total: number;
  weeks: ContributionWeek[];
}

interface ActivityStats {
  commits: number;
  issues: number;
  pullRequests: number;
  codeReview: number;
}

interface ContributedRepo {
  name: string;
  url: string;
}

interface ContributionGraphProps {
  activityStats?: ActivityStats;
  contributedRepos?: ContributedRepo[];
  totalRepos?: number;
}

const GITHUB_USERNAME = "alfiiinur";
const MONTHS = [
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

// Fetch real contribution data from GitHub
const fetchContributions = async (
  username: string,
  year: number
): Promise<ContributionData> => {
  try {
    // Use GitHub's contribution calendar scraper API
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`
    );

    if (res.ok) {
      const data = await res.json();
      const weeks: ContributionWeek[] = [];
      let total = 0;

      // Group contributions by week
      const contributions = data.contributions || [];
      let currentWeek: ContributionDay[] = [];

      contributions.forEach(
        (
          day: { date: string; count: number; level: number },
          index: number
        ) => {
          const level = Math.min(day.level, 4) as 0 | 1 | 2 | 3 | 4;
          total += day.count;

          currentWeek.push({
            date: day.date,
            count: day.count,
            level,
          });

          // Start new week every 7 days
          if (currentWeek.length === 7 || index === contributions.length - 1) {
            weeks.push({ days: [...currentWeek] });
            currentWeek = [];
          }
        }
      );

      return { total: data.total?.lastYear || total, weeks };
    }
    throw new Error("API failed");
  } catch {
    // Fallback to generated data if API fails
    return generateFallbackContributions(year);
  }
};

// Seeded random for consistent fallback results
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate fallback contribution data
const generateFallbackContributions = (year: number): ContributionData => {
  const weeks: ContributionWeek[] = [];
  const startDate = new Date(year - 1, 11, 1);
  const endDate = new Date(year, 11, 31);

  let currentDate = new Date(startDate);
  let totalContributions = 0;
  let seed = year * 1000;

  while (currentDate <= endDate) {
    const week: ContributionDay[] = [];

    for (let i = 0; i < 7; i++) {
      if (currentDate <= endDate) {
        seed++;
        const random = seededRandom(seed);
        let level: 0 | 1 | 2 | 3 | 4 = 0;
        let count = 0;

        if (random > 0.7) {
          if (random > 0.95) {
            level = 4;
            count = Math.floor(seededRandom(seed + 1) * 10) + 8;
          } else if (random > 0.85) {
            level = 3;
            count = Math.floor(seededRandom(seed + 1) * 5) + 5;
          } else if (random > 0.75) {
            level = 2;
            count = Math.floor(seededRandom(seed + 1) * 3) + 2;
          } else {
            level = 1;
            count = Math.floor(seededRandom(seed + 1) * 2) + 1;
          }
          totalContributions += count;
        }

        week.push({
          date: currentDate.toISOString().split("T")[0],
          count,
          level,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    if (week.length > 0) {
      weeks.push({ days: week });
    }
  }

  return { total: totalContributions, weeks };
};

const DEFAULT_CONTRIBUTED_REPOS: ContributedRepo[] = [
  {
    name: "Riset-Sistem-Rekomendasi-CF/Fro...",
    url: "https://github.com/alfiiinur",
  },
  {
    name: "alfiiinur/setBasedImplentasi",
    url: "https://github.com/alfiiinur/setBasedImplentasi",
  },
  {
    name: "alfiiinur/arsitektur-website",
    url: "https://github.com/alfiiinur/arsitektur-website",
  },
];

export const ContributionGraph = ({
  activityStats: propActivityStats,
  contributedRepos: propContributedRepos,
  totalRepos: propTotalRepos,
}: ContributionGraphProps) => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [contributions, setContributions] = useState<ContributionData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const years = [2025, 2024, 2023, 2022, 2021];

  // Use props or defaults
  const activityStats = propActivityStats || {
    commits: 87,
    issues: 0,
    pullRequests: 13,
    codeReview: 0,
  };

  const contributedRepos = propContributedRepos || DEFAULT_CONTRIBUTED_REPOS;
  const totalRepos = propTotalRepos || 19;

  useEffect(() => {
    setLoading(true);
    fetchContributions(GITHUB_USERNAME, selectedYear)
      .then((data) => {
        setContributions(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedYear]);

  const getLevelColor = useCallback((level: number) => {
    const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
    return colors[level] || colors[0];
  }, []);

  const handleMouseEnter = useCallback(
    (day: ContributionDay, e: React.MouseEvent) => {
      setHoveredDay(day);
      setTooltipPos({ x: e.clientX, y: e.clientY });
    },
    []
  );

  return (
    <div className="w-full space-y-6">
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Contribution Calendar Section */}
        <div className="flex-1 bg-[#0d1117] rounded-lg border border-[#30363d] p-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-[#8b949e]">
              {contributions?.total || 0} contributions in the last year
            </h3>
            <button className="text-xs text-[#8b949e] hover:text-[#58a6ff] flex items-center gap-1">
              Contribution settings
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                <path d="M6 8.5l-4-4h8l-4 4z" />
              </svg>
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="overflow-x-auto pb-2">
            {loading ? (
              <div className="h-[120px] flex items-center justify-center">
                <div className="animate-spin w-6 h-6 border-2 border-[#39d353] border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="min-w-[750px]">
                {/* Month Labels */}
                <div className="flex mb-1 ml-8">
                  {MONTHS.map((month, i) => (
                    <span
                      key={`${month}-${i}`}
                      className="text-[10px] text-[#8b949e] flex-1 text-center"
                    >
                      {month}
                    </span>
                  ))}
                </div>

                {/* Grid with Day Labels */}
                <div className="flex">
                  {/* Day Labels */}
                  <div className="flex flex-col justify-around pr-2 w-8">
                    {DAYS.map((day, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-[#8b949e] h-[13px] leading-[13px]"
                      >
                        {day}
                      </span>
                    ))}
                  </div>

                  {/* Contribution Squares */}
                  <div className="flex gap-[3px]">
                    {contributions?.weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-[3px]">
                        {week.days.map((day, dayIndex) => (
                          <motion.div
                            key={day.date}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: weekIndex * 0.01 + dayIndex * 0.005,
                            }}
                            className="w-[11px] h-[11px] rounded-sm cursor-pointer hover:ring-1 hover:ring-[#8b949e]"
                            style={{
                              backgroundColor: getLevelColor(day.level),
                            }}
                            onMouseEnter={(e) => handleMouseEnter(day, e)}
                            onMouseLeave={() => setHoveredDay(null)}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-[#8b949e]">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="w-[11px] h-[11px] rounded-sm"
                      style={{ backgroundColor: getLevelColor(level) }}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Year Selector */}
        <div className="lg:w-24 flex lg:flex-col gap-1">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={cn(
                "px-3 py-2 text-sm rounded-md transition-all font-medium",
                selectedYear === year
                  ? "bg-[#238636] text-white"
                  : "bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-white"
              )}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Overview Section */}
      <div className="bg-[#0d1117] rounded-lg border border-[#30363d] p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Contributed Repos */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#21262d] rounded-full mb-4">
              <div className="w-5 h-5 rounded-full bg-linear-to-br from-purple-500 to-pink-500" />
              <span className="text-xs text-[#8b949e]">
                @Riset-Sistem-Rekome...
              </span>
            </div>

            <h4 className="text-sm font-medium text-[#c9d1d9] mb-3">
              Activity overview
            </h4>

            <div className="flex items-start gap-2 text-[#8b949e] text-sm">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z" />
              </svg>
              <div>
                <span>Contributed to</span>
                <div className="mt-1 space-y-0.5">
                  {contributedRepos.map((repo, i) => (
                    <a
                      key={i}
                      href={repo.url}
                      className="block text-[#58a6ff] hover:underline"
                    >
                      {repo.name}
                    </a>
                  ))}
                  <span className="text-[#8b949e]">
                    and {totalRepos} other repositories
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Radar Chart */}
          <div className="flex-1 flex items-center justify-center">
            <ActivityRadarChart stats={activityStats} />
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 px-2 py-1 text-xs bg-[#1b1f23] text-white rounded shadow-lg pointer-events-none"
          style={{
            left: tooltipPos.x + 10,
            top: tooltipPos.y - 30,
          }}
        >
          <strong>{hoveredDay.count} contributions</strong> on{" "}
          {new Date(hoveredDay.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      )}
    </div>
  );
};

// Activity Radar Chart Component
const ActivityRadarChart = ({ stats }: { stats: ActivityStats }) => {
  const centerX = 100;
  const centerY = 100;
  const radius = 70;

  const labels = [
    { key: "codeReview", label: "Code review", angle: -90 },
    { key: "issues", label: "Issues", angle: 0 },
    { key: "pullRequests", label: "Pull requests", angle: 90 },
    { key: "commits", label: "Commits", angle: 180 },
  ];

  const getPoint = (angle: number, value: number) => {
    const rad = (angle * Math.PI) / 180;
    const r = (value / 100) * radius;
    return {
      x: centerX + r * Math.cos(rad),
      y: centerY + r * Math.sin(rad),
    };
  };

  const commitPoint = getPoint(180, stats.commits);
  const issuePoint = getPoint(0, stats.issues || 5);
  const prPoint = getPoint(90, stats.pullRequests);
  const reviewPoint = getPoint(-90, stats.codeReview || 5);

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {/* Grid circles */}
      {[0.25, 0.5, 0.75, 1].map((scale, i) => (
        <circle
          key={i}
          cx={centerX}
          cy={centerY}
          r={radius * scale}
          fill="none"
          stroke="#30363d"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      ))}

      {/* Axis lines */}
      {labels.map(({ angle }, i) => {
        const end = getPoint(angle, 100);
        return (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={end.x}
            y2={end.y}
            stroke="#30363d"
            strokeWidth="1"
          />
        );
      })}

      {/* Data shape */}
      <polygon
        points={`${commitPoint.x},${commitPoint.y} ${reviewPoint.x},${reviewPoint.y} ${issuePoint.x},${issuePoint.y} ${prPoint.x},${prPoint.y}`}
        fill="rgba(57, 211, 83, 0.2)"
        stroke="#39d353"
        strokeWidth="2"
      />

      {/* Data points */}
      <circle cx={commitPoint.x} cy={commitPoint.y} r="4" fill="#39d353" />
      <circle cx={reviewPoint.x} cy={reviewPoint.y} r="4" fill="#39d353" />
      <circle cx={issuePoint.x} cy={issuePoint.y} r="4" fill="#39d353" />
      <circle cx={prPoint.x} cy={prPoint.y} r="4" fill="#39d353" />

      {/* Labels */}
      <text
        x={centerX - 60}
        y={centerY + 5}
        fill="#8b949e"
        fontSize="10"
        textAnchor="end"
      >
        {stats.commits}%
      </text>
      <text
        x={centerX - 60}
        y={centerY + 18}
        fill="#8b949e"
        fontSize="10"
        textAnchor="end"
      >
        Commits
      </text>

      <text x={centerX} y={20} fill="#8b949e" fontSize="10" textAnchor="middle">
        Code review
      </text>

      <text
        x={centerX + 70}
        y={centerY + 5}
        fill="#8b949e"
        fontSize="10"
        textAnchor="start"
      >
        Issues
      </text>

      <text
        x={centerX}
        y={195}
        fill="#8b949e"
        fontSize="10"
        textAnchor="middle"
      >
        {stats.pullRequests}%
      </text>
      <text
        x={centerX}
        y={182}
        fill="#8b949e"
        fontSize="10"
        textAnchor="middle"
      >
        Pull requests
      </text>
    </svg>
  );
};

export default ContributionGraph;
