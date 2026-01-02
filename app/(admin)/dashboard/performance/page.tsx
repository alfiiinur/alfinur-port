"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  RefreshCw,
  Download,
  FileJson,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Layers,
  Zap,
  Package,
} from "lucide-react";
import type { TestReport } from "@/lib/testing/runner/types";

// Import section components
import { OverviewSection } from "./components/OverviewSection";
import { BundleAnalysisSection } from "./components/BundleAnalysisSection";
import { ComponentPerformanceSection } from "./components/ComponentPerformanceSection";
import { APIPerformanceSection } from "./components/APIPerformanceSection";
import { DatabasePerformanceSection } from "./components/DatabasePerformanceSection";
import { MemoryUsageSection } from "./components/MemoryUsageSection";
import { WebVitalsSection } from "./components/WebVitalsSection";
import { TestCoverageSection } from "./components/TestCoverageSection";

export default function PerformanceDashboardPage() {
  const [report, setReport] = useState<TestReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPerformanceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/performance");
      if (!response.ok) {
        throw new Error("Failed to fetch performance data");
      }
      const data = await response.json();
      setReport(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const runAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/performance", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to run performance analysis");
      }
      const data = await response.json();
      setReport(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const exportToJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // For PDF export, we'll use the browser's print functionality
    window.print();
  };

  useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Performance Dashboard
          </h2>
          <p className="text-muted-foreground">
            Monitor and analyze application performance metrics
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToJSON}
            disabled={!report || loading}
          >
            <FileJson className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToPDF}
            disabled={!report || loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={runAnalysis} disabled={loading} size="sm">
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Analyzing..." : "Run Analysis"}
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && !report && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 py-8">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Loading performance data...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {report && (
        <>
          {/* Overview Section */}
          <OverviewSection report={report} />

          {/* Tabbed Sections */}
          <Tabs defaultValue="bundle" className="print:hidden">
            <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
              <TabsTrigger value="bundle" className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Bundle</span>
              </TabsTrigger>
              <TabsTrigger
                value="components"
                className="flex items-center gap-1"
              >
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Components</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">API</span>
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-1">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Database</span>
              </TabsTrigger>
              <TabsTrigger value="memory" className="flex items-center gap-1">
                <HardDrive className="h-4 w-4" />
                <span className="hidden sm:inline">Memory</span>
              </TabsTrigger>
              <TabsTrigger value="vitals" className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Web Vitals</span>
              </TabsTrigger>
              <TabsTrigger value="coverage" className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Coverage</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bundle" className="mt-4">
              <BundleAnalysisSection data={report.bundleAnalysis} />
            </TabsContent>

            <TabsContent value="components" className="mt-4">
              <ComponentPerformanceSection data={report.componentProfile} />
            </TabsContent>

            <TabsContent value="api" className="mt-4">
              <APIPerformanceSection
                data={report.apiTests}
                batchResult={report.apiBatchResult}
              />
            </TabsContent>

            <TabsContent value="database" className="mt-4">
              <DatabasePerformanceSection data={report.databaseProfile} />
            </TabsContent>

            <TabsContent value="memory" className="mt-4">
              <MemoryUsageSection data={report.memoryProfile} />
            </TabsContent>

            <TabsContent value="vitals" className="mt-4">
              <WebVitalsSection
                metrics={report.webVitals}
                analysis={report.webVitalsAnalysis}
              />
            </TabsContent>

            <TabsContent value="coverage" className="mt-4">
              <TestCoverageSection
                summary={report.summary}
                coverageReport={report.coverageReport}
              />
            </TabsContent>
          </Tabs>

          {/* Print-friendly sections (shown only when printing) */}
          <div className="hidden print:block space-y-6">
            <BundleAnalysisSection data={report.bundleAnalysis} />
            <ComponentPerformanceSection data={report.componentProfile} />
            <APIPerformanceSection
              data={report.apiTests}
              batchResult={report.apiBatchResult}
            />
            <DatabasePerformanceSection data={report.databaseProfile} />
            <MemoryUsageSection data={report.memoryProfile} />
            <WebVitalsSection
              metrics={report.webVitals}
              analysis={report.webVitalsAnalysis}
            />
            <TestCoverageSection
              summary={report.summary}
              coverageReport={report.coverageReport}
            />
          </div>

          {/* Recommendations */}
          {report.recommendations && report.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
