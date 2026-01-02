"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Layers, AlertTriangle, Clock, RefreshCw } from "lucide-react";
import type { ComponentProfileResult } from "@/lib/testing/component-profiler/types";

interface ComponentPerformanceSectionProps {
  data?: ComponentProfileResult;
}

export function ComponentPerformanceSection({
  data,
}: ComponentPerformanceSectionProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Component Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No component profiling data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.rankedByRenderTime.slice(0, 10).map((m) => ({
    name:
      m.componentName.length > 15
        ? m.componentName.substring(0, 15) + "..."
        : m.componentName,
    renderTime: m.renderTime,
    renderCount: m.renderCount,
  }));

  const isSlowComponent = (name: string) => data.slowComponents.includes(name);
  const hasExcessiveRerenders = (name: string) =>
    data.excessiveRerenders.includes(name);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Components Profiled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4 text-red-500" />
              Slow Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                data.slowComponents.length > 0
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {data.slowComponents.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <RefreshCw className="h-4 w-4 text-yellow-500" />
              Excessive Re-renders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                data.excessiveRerenders.length > 0
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {data.excessiveRerenders.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Render Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                data.metrics.reduce((acc, m) => acc + m.renderTime, 0) /
                data.metrics.length
              ).toFixed(1)}
              ms
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Render Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Render Time by Component (ms)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
                <Bar
                  dataKey="renderTime"
                  fill="#3b82f6"
                  name="Render Time (ms)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Component Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Component Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead className="text-right">Render Time</TableHead>
                <TableHead className="text-right">Render Count</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rankedByRenderTime.map((metric, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {metric.componentName}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      metric.renderTime > 16 ? "text-red-500" : ""
                    }`}
                  >
                    {metric.renderTime.toFixed(2)}ms
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      hasExcessiveRerenders(metric.componentName)
                        ? "text-yellow-500"
                        : ""
                    }`}
                  >
                    {metric.renderCount}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {isSlowComponent(metric.componentName) && (
                        <Badge variant="destructive" className="text-xs">
                          Slow
                        </Badge>
                      )}
                      {hasExcessiveRerenders(metric.componentName) && (
                        <Badge variant="secondary" className="text-xs">
                          Re-renders
                        </Badge>
                      )}
                      {!isSlowComponent(metric.componentName) &&
                        !hasExcessiveRerenders(metric.componentName) && (
                          <Badge
                            variant="outline"
                            className="text-xs text-green-500"
                          >
                            OK
                          </Badge>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Critical Components */}
      {(data.slowComponents.length > 0 ||
        data.excessiveRerenders.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Performance Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.slowComponents.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    Slow Components (&gt;16ms)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.slowComponents.map((name, index) => (
                      <Badge key={index} variant="destructive">
                        {name}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    These components exceed the 16ms threshold for 60fps
                    rendering. Consider optimizing with React.memo, useMemo, or
                    useCallback.
                  </p>
                </div>
              )}
              {data.excessiveRerenders.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-yellow-500" />
                    Excessive Re-renders (&gt;5/sec)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.excessiveRerenders.map((name, index) => (
                      <Badge key={index} variant="secondary">
                        {name}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    These components re-render too frequently. Check for
                    unnecessary state updates or missing dependency arrays.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
