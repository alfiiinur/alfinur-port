"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  HardDrive,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { MemoryProfileResult } from "@/lib/testing/memory-profiler/types";

interface MemoryUsageSectionProps {
  data?: MemoryProfileResult;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function MemoryUsageSection({ data }: MemoryUsageSectionProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Memory Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No memory profiling data available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const chartData = data.snapshots.map((snapshot, index) => ({
    time: index,
    heapUsed: snapshot.heapUsed / (1024 * 1024),
    heapTotal: snapshot.heapTotal / (1024 * 1024),
  }));

  // Prepare pie chart data for allocation breakdown
  const pieData = Object.entries(data.allocationBreakdown).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const heapUsagePercent =
    (data.averageUsage / data.snapshots[0]?.heapTotal) * 100 || 0;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peak Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBytes(data.peakUsage)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBytes(data.averageUsage)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              {data.growthRate > 0 ? (
                <TrendingUp className="h-4 w-4 text-yellow-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                data.growthRate > 1024 * 1024
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {formatBytes(data.growthRate)}/s
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Leak Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                data.leakWarnings.length > 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {data.leakWarnings.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Memory Usage Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              Memory Usage Over Time (MB)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="time"
                    className="fill-muted-foreground"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Time (samples)",
                      position: "bottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    className="fill-muted-foreground"
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)} MB`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="heapUsed"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="Heap Used"
                  />
                  <Line
                    type="monotone"
                    dataKey="heapTotal"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="Heap Total"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Allocation Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Allocation Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatBytes(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Memory Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Memory Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Min Usage</span>
                <span className="font-medium">
                  {formatBytes(data.minUsage)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Max Usage</span>
                <span className="font-medium">
                  {formatBytes(data.peakUsage)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Profiling Duration
                </span>
                <span className="font-medium">
                  {(data.profilingDuration / 1000).toFixed(1)}s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Heap Usage</span>
                <span
                  className={`font-medium ${
                    heapUsagePercent > 80
                      ? "text-red-500"
                      : heapUsagePercent > 60
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {heapUsagePercent.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Threshold Exceeded
                </span>
                <Badge
                  variant={data.thresholdExceeded ? "destructive" : "outline"}
                >
                  {data.thresholdExceeded ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leak Warnings */}
      {data.leakWarnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Memory Leak Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.leakWarnings.map((warning, index) => (
                <div key={index} className="p-4 bg-red-500/10 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge
                        variant={
                          warning.severity === "high"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {warning.severity}
                      </Badge>
                      {warning.component && (
                        <span className="ml-2 text-sm font-medium">
                          {warning.component}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Growth: {formatBytes(warning.growthRate)}/s
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{warning.message}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Duration: {(warning.duration / 1000).toFixed(1)}s | Start:{" "}
                    {formatBytes(warning.startHeapUsed)} | End:{" "}
                    {formatBytes(warning.endHeapUsed)}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Memory leaks can cause application crashes. Check for uncleared
              intervals, event listeners, or growing data structures.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
