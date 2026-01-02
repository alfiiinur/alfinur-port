"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Percent,
  Activity,
} from "lucide-react";
import type { TestReport } from "@/lib/testing/runner/types";

interface OverviewSectionProps {
  report: TestReport;
}

export function OverviewSection({ report }: OverviewSectionProps) {
  const { summary } = report;

  // Calculate health score based on various metrics
  const calculateHealthScore = (): number => {
    let score = 100;

    // Deduct for failed tests
    if (summary.totalTests > 0) {
      const failRate = summary.failed / summary.totalTests;
      score -= failRate * 30;
    }

    // Deduct for low coverage
    if (summary.coverage < 70) {
      score -= (70 - summary.coverage) * 0.5;
    }

    // Deduct for bundle warnings
    if (report.bundleAnalysis?.warnings?.length) {
      score -= Math.min(report.bundleAnalysis.warnings.length * 5, 15);
    }

    // Deduct for memory leak warnings
    if (report.memoryProfile?.leakWarnings?.length) {
      score -= Math.min(report.memoryProfile.leakWarnings.length * 10, 20);
    }

    // Deduct for slow API endpoints
    if (report.apiTests) {
      const slowEndpoints = report.apiTests.filter(
        (t) => t.isSlowEndpoint
      ).length;
      score -= Math.min(slowEndpoints * 5, 15);
    }

    return Math.max(0, Math.round(score));
  };

  const healthScore = calculateHealthScore();

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10";
    if (score >= 60) return "bg-yellow-500/10";
    return "bg-red-500/10";
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Health Score */}
      <Card className={getHealthBgColor(healthScore)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${getHealthColor(healthScore)}`}>
            {healthScore}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {healthScore >= 80
              ? "Good"
              : healthScore >= 60
              ? "Needs Work"
              : "Critical"}
          </p>
        </CardContent>
      </Card>

      {/* Tests Passed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Passed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-500">
            {summary.passed}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            of {summary.totalTests} tests
          </p>
        </CardContent>
      </Card>

      {/* Tests Failed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <XCircle className="h-4 w-4 text-red-500" />
            Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-500">
            {summary.failed}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.skipped} skipped
          </p>
        </CardContent>
      </Card>

      {/* Coverage */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <Percent className="h-4 w-4" />
            Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-bold ${
              summary.coverage >= 70 ? "text-green-500" : "text-yellow-500"
            }`}
          >
            {summary.coverage.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.coverage >= 70 ? "Above threshold" : "Below 70%"}
          </p>
        </CardContent>
      </Card>

      {/* Execution Time */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {formatDuration(summary.executionTime)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Total execution</p>
        </CardContent>
      </Card>

      {/* Warnings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Warnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-500">
            {(report.bundleAnalysis?.warnings?.length || 0) +
              (report.memoryProfile?.leakWarnings?.length || 0) +
              (report.webVitalsAnalysis?.issues?.length || 0)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Total issues</p>
        </CardContent>
      </Card>
    </div>
  );
}
