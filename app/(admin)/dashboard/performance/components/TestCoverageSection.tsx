"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileCode,
  Clock,
} from "lucide-react";
import type { TestSummary, CoverageReport } from "@/lib/testing/runner/types";

interface TestCoverageSectionProps {
  summary?: TestSummary;
  coverageReport?: CoverageReport;
}

export function TestCoverageSection({
  summary,
  coverageReport,
}: TestCoverageSectionProps) {
  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Test Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No test coverage data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const passRate =
    summary.totalTests > 0
      ? ((summary.passed / summary.totalTests) * 100).toFixed(1)
      : "0";

  const chartData =
    coverageReport?.modules.map((m) => ({
      name: m.moduleName.split("/").pop() || m.moduleName,
      coverage: m.coveragePercent,
      threshold: coverageReport.threshold,
    })) || [];

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalTests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Passed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {summary.passed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <XCircle className="h-4 w-4 text-red-500" />
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {summary.failed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Skipped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {summary.skipped}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(summary.executionTime)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pass Rate and Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Test Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div
                className={`text-4xl font-bold ${
                  parseFloat(passRate) >= 90
                    ? "text-green-500"
                    : parseFloat(passRate) >= 70
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {passRate}%
              </div>
              <div className="flex-1">
                <Progress value={parseFloat(passRate)} className="h-4" />
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-green-500">
                    {summary.passed} passed
                  </span>
                  <span className="text-red-500">{summary.failed} failed</span>
                  <span className="text-yellow-500">
                    {summary.skipped} skipped
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Code Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div
                className={`text-4xl font-bold ${
                  summary.coverage >= 70
                    ? "text-green-500"
                    : summary.coverage >= 50
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {summary.coverage.toFixed(1)}%
              </div>
              <div className="flex-1">
                <Progress value={summary.coverage} className="h-4" />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>0%</span>
                  <span>Threshold: {coverageReport?.threshold || 70}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coverage by Module Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Coverage by Module</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
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
                    domain={[0, 100]}
                  />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="coverage"
                    fill="#3b82f6"
                    name="Coverage %"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module Coverage Table */}
      {coverageReport?.modules && coverageReport.modules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Module Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead className="text-right">Lines Covered</TableHead>
                  <TableHead className="text-right">Total Lines</TableHead>
                  <TableHead className="text-right">Coverage</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coverageReport.modules.map((module, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">
                      {module.moduleName}
                    </TableCell>
                    <TableCell className="text-right">
                      {module.linesCovered}
                    </TableCell>
                    <TableCell className="text-right">
                      {module.totalLines}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        module.belowThreshold
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {module.coveragePercent.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      {module.belowThreshold ? (
                        <Badge variant="destructive" className="text-xs">
                          Below Threshold
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs text-green-500"
                        >
                          OK
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Low Coverage Modules Warning */}
      {coverageReport?.lowCoverageModules &&
        coverageReport.lowCoverageModules.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Low Coverage Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {coverageReport.lowCoverageModules.map((module, index) => (
                  <Badge key={index} variant="secondary">
                    {module}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                These modules have coverage below the {coverageReport.threshold}
                % threshold. Consider adding more tests.
              </p>
            </CardContent>
          </Card>
        )}

      {/* Untested Paths */}
      {coverageReport?.untestedPaths &&
        coverageReport.untestedPaths.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCode className="h-5 w-5 text-red-500" />
                Untested Code Paths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {coverageReport.untestedPaths.map((path, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {path}
                    </code>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
