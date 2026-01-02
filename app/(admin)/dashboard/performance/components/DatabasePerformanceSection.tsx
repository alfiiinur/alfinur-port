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
import {
  Database,
  AlertTriangle,
  Clock,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import type { DatabaseProfileResult } from "@/lib/testing/database-profiler/types";

interface DatabasePerformanceSectionProps {
  data?: DatabaseProfileResult;
}

export function DatabasePerformanceSection({
  data,
}: DatabasePerformanceSectionProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No database profiling data available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group queries by model for chart
  const queryByModel = data.queries.reduce((acc, q) => {
    const model = q.model || "Unknown";
    if (!acc[model]) {
      acc[model] = { count: 0, totalTime: 0 };
    }
    acc[model].count++;
    acc[model].totalTime += q.executionTime;
    return acc;
  }, {} as Record<string, { count: number; totalTime: number }>);

  const chartData = Object.entries(queryByModel).map(([model, stats]) => ({
    name: model,
    count: stats.count,
    avgTime: stats.totalTime / stats.count,
  }));

  const truncateQuery = (query: string, maxLength: number = 60) => {
    if (query.length <= maxLength) return query;
    return query.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalQueries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4 text-yellow-500" />
              Slow Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                data.slowQueries.length > 0
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {data.slowQueries.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-red-500" />
              N+1 Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                data.n1Patterns.length > 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {data.n1Patterns.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Execution Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                data.averageExecutionTime > 50
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {data.averageExecutionTime.toFixed(1)}ms
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Query Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Queries by Model</CardTitle>
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
                  dataKey="count"
                  fill="#3b82f6"
                  name="Query Count"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="avgTime"
                  fill="#10b981"
                  name="Avg Time (ms)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Slow Queries Table */}
      {data.slowQueries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Slow Queries (&gt;100ms)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead className="text-right">Execution Time</TableHead>
                  <TableHead className="text-right">Rows</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.slowQueries.map((query, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-xs max-w-[300px]">
                      <span title={query.query}>
                        {truncateQuery(query.query)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {query.model || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-yellow-500 font-medium">
                      {query.executionTime}ms
                    </TableCell>
                    <TableCell className="text-right">
                      {query.rowsAffected}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* N+1 Query Patterns */}
      {data.n1Patterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              N+1 Query Patterns Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.n1Patterns.map((pattern, index) => (
                <div
                  key={index}
                  className="p-4 bg-red-500/10 rounded-lg space-y-3"
                >
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Parent Query
                    </h4>
                    <code className="text-xs bg-muted p-2 rounded block mt-1 overflow-x-auto">
                      {pattern.parentQuery}
                    </code>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Child Queries ({pattern.childCount} queries)
                    </h4>
                    <div className="space-y-1 mt-1">
                      {pattern.childQueries.slice(0, 3).map((query, qIndex) => (
                        <code
                          key={qIndex}
                          className="text-xs bg-muted p-2 rounded block overflow-x-auto"
                        >
                          {query}
                        </code>
                      ))}
                      {pattern.childQueries.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          ... and {pattern.childQueries.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-green-500/10 rounded">
                    <Lightbulb className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm text-green-500">
                        Suggested Fix
                      </h4>
                      <code className="text-xs block mt-1">
                        {pattern.suggestedFix}
                      </code>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Estimated time wasted: {pattern.estimatedTimeWasted}ms
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
