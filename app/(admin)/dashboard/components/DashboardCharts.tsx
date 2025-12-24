"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface ContentItem {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface BlogItem {
  name: string;
  views: number;
  comments: number;
  [key: string]: string | number;
}

interface ReactionItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface DashboardChartsProps {
  contentDistribution: ContentItem[];
  topBlogs: BlogItem[];
  reactionStats: ReactionItem[];
}

const REACTION_COLORS: Record<string, string> = {
  LIKE: "#3b82f6",
  DISLIKE: "#6b7280",
  LOVE: "#ef4444",
  LAUGH: "#eab308",
  SAD: "#8b5cf6",
  ANGRY: "#f97316",
};

export default function DashboardCharts({
  contentDistribution,
  topBlogs,
  reactionStats,
}: DashboardChartsProps) {
  const hasContent = contentDistribution.some((c) => c.value > 0);
  const hasBlogs = topBlogs.length > 0;
  const hasReactions = reactionStats.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Content Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Content Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {hasContent ? (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {contentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No published content yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Blogs Bar Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Top Blogs Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {hasBlogs ? (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topBlogs}
                  margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="name"
                    angle={-30}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    className="fill-muted-foreground"
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="views"
                    fill="#3b82f6"
                    name="Views"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="comments"
                    fill="#10b981"
                    name="Comments"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No blog data yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reactions Distribution */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg">Reactions Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {hasReactions ? (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reactionStats}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis type="number" className="fill-muted-foreground" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    className="fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]}>
                    {reactionStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={REACTION_COLORS[entry.name] || "#6b7280"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No reactions yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
