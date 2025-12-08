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

interface BlogStat {
  id: string;
  title: string;
  fullTitle: string;
  slug: string;
  views: number;
  comments: number;
}

interface BlogAnalyticsChartProps {
  topBlogs: BlogStat[];
  allBlogs: BlogStat[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
];

export default function BlogAnalyticsChart({
  topBlogs,
  allBlogs,
}: BlogAnalyticsChartProps) {
  // Data for pie chart (top 5 blogs by views)
  const pieData = topBlogs.slice(0, 5).map((blog, index) => ({
    name: blog.title,
    value: blog.views,
    color: COLORS[index],
  }));

  // Data for bar chart
  const barData = topBlogs.map((blog) => ({
    name: blog.title,
    views: blog.views,
    comments: blog.comments,
  }));

  if (allBlogs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Belum ada data blog untuk ditampilkan
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart - Views per Blog */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Top 10 Blog - Views & Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 11 }}
                  className="fill-muted-foreground"
                />
                <YAxis className="fill-muted-foreground" />
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
        </CardContent>
      </Card>

      {/* Pie Chart - Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Views (Top 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
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
        </CardContent>
      </Card>

      {/* Table - All Blogs Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Semua Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Blog</th>
                  <th className="text-right py-2 font-medium">Views</th>
                  <th className="text-right py-2 font-medium">Comments</th>
                </tr>
              </thead>
              <tbody>
                {allBlogs.map((blog, index) => (
                  <tr key={blog.id} className="border-b last:border-0">
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-5">
                          {index + 1}.
                        </span>
                        <span title={blog.fullTitle}>{blog.title}</span>
                      </div>
                    </td>
                    <td className="text-right py-2 font-medium text-blue-500">
                      {blog.views}
                    </td>
                    <td className="text-right py-2 font-medium text-green-500">
                      {blog.comments}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
