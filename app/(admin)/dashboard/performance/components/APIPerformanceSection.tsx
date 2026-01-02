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
  Globe,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type {
  APITestResult,
  BatchTestResult,
} from "@/lib/testing/api-tester/types";

interface APIPerformanceSectionProps {
  data?: APITestResult[];
  batchResult?: BatchTestResult;
}

export function APIPerformanceSection({
  data,
  batchResult,
}: APIPerformanceSectionProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            API Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No API test data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((result) => ({
    name: result.endpoint.replace("/api/", ""),
    responseTime: result.responseTime,
    payloadSize: result.payloadSize / 1024,
  }));

  const summary = batchResult?.summary || {
    totalEndpoints: data.length,
    successfulTests: data.filter(
      (r) => r.statusCode >= 200 && r.statusCode < 300
    ).length,
    failedTests: data.filter((r) => r.statusCode >= 400).length,
    slowEndpoints: data.filter((r) => r.isSlowEndpoint).length,
    averageResponseTime:
      data.reduce((acc, r) => acc + r.responseTime, 0) / data.length,
    minResponseTime: Math.min(...data.map((r) => r.responseTime)),
    maxResponseTime: Math.max(...data.map((r) => r.responseTime)),
    totalErrors: data.reduce((acc, r) => acc + r.errors.length, 0),
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return "text-green-500";
    if (statusCode >= 400 && statusCode < 500) return "text-yellow-500";
    return "text-red-500";
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-500";
      case "POST":
        return "bg-green-500";
      case "PUT":
        return "bg-yellow-500";
      case "DELETE":
        return "bg-red-500";
      case "PATCH":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Endpoints Tested
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalEndpoints}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {summary.successfulTests}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4 text-yellow-500" />
              Slow Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                summary.slowEndpoints > 0 ? "text-yellow-500" : "text-green-500"
              }`}
            >
              {summary.slowEndpoints}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                summary.averageResponseTime > 500
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {summary.averageResponseTime.toFixed(0)}ms
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Response Time by Endpoint (ms)
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
                  dataKey="responseTime"
                  fill="#3b82f6"
                  name="Response Time (ms)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Endpoint Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Endpoint Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead className="text-right">Response Time</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Payload</TableHead>
                <TableHead>Issues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Badge
                      className={`${getMethodColor(result.method)} text-white`}
                    >
                      {result.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {result.endpoint}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      result.isSlowEndpoint ? "text-yellow-500" : ""
                    }`}
                  >
                    {result.responseTime}ms
                  </TableCell>
                  <TableCell
                    className={`text-right ${getStatusColor(
                      result.statusCode
                    )}`}
                  >
                    {result.statusCode}
                  </TableCell>
                  <TableCell className="text-right">
                    {(result.payloadSize / 1024).toFixed(1)} KB
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {result.isSlowEndpoint && (
                        <Badge variant="secondary" className="text-xs">
                          Slow
                        </Badge>
                      )}
                      {result.errors.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {result.errors.length} error(s)
                        </Badge>
                      )}
                      {!result.isSlowEndpoint && result.errors.length === 0 && (
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

      {/* Slow Endpoints Warning */}
      {summary.slowEndpoints > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Slow Endpoints (&gt;500ms)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data
                .filter((r) => r.isSlowEndpoint)
                .map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${getMethodColor(
                          result.method
                        )} text-white`}
                      >
                        {result.method}
                      </Badge>
                      <span className="font-mono text-sm">
                        {result.endpoint}
                      </span>
                    </div>
                    <span className="text-yellow-500 font-medium">
                      {result.responseTime}ms
                    </span>
                  </div>
                ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Consider optimizing database queries, adding caching, or reducing
              payload size for these endpoints.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error Statistics */}
      {summary.totalErrors > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Error Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data
                .filter((r) => r.errors.length > 0)
                .map((result, index) => (
                  <div key={index} className="p-3 bg-red-500/10 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge
                        className={`${getMethodColor(
                          result.method
                        )} text-white`}
                      >
                        {result.method}
                      </Badge>
                      <span className="font-mono text-sm">
                        {result.endpoint}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {result.errors.map((error, errIndex) => (
                        <li key={errIndex} className="text-sm text-red-500">
                          [{error.type}] {error.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
