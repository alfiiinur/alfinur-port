"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";
import type {
  WebVitalsMetrics,
  WebVitalsAnalysisResult,
} from "@/lib/testing/web-vitals/types";

interface WebVitalsSectionProps {
  metrics?: WebVitalsMetrics;
  analysis?: WebVitalsAnalysisResult;
}

interface VitalGaugeProps {
  name: string;
  value: number;
  threshold: number;
  unit: string;
  description: string;
}

function VitalGauge({
  name,
  value,
  threshold,
  unit,
  description,
}: VitalGaugeProps) {
  const percentage = Math.min((value / (threshold * 2)) * 100, 100);
  const isGood = value <= threshold;
  const isNeedsImprovement = value > threshold && value <= threshold * 1.5;

  const getColor = () => {
    if (isGood) return "bg-green-500";
    if (isNeedsImprovement) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = () => {
    if (isGood) return "text-green-500";
    if (isNeedsImprovement) return "text-yellow-500";
    return "text-red-500";
  };

  const getRating = () => {
    if (isGood) return "Good";
    if (isNeedsImprovement) return "Needs Improvement";
    return "Poor";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{name}</span>
          <Badge
            variant={
              isGood
                ? "outline"
                : isNeedsImprovement
                ? "secondary"
                : "destructive"
            }
          >
            {getRating()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${getTextColor()}`}>
          {value.toFixed(name === "CLS" ? 3 : 0)}
          {unit}
        </div>
        <div className="mt-2">
          <Progress value={percentage} className={`h-2 ${getColor()}`} />
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>0</span>
          <span>
            Threshold: {threshold}
            {unit}
          </span>
          <span>
            {threshold * 2}
            {unit}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}

export function WebVitalsSection({ metrics, analysis }: WebVitalsSectionProps) {
  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No Web Vitals data available</p>
        </CardContent>
      </Card>
    );
  }

  const score = analysis?.score || 0;
  const getScoreColor = () => {
    if (score >= 90) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className={`text-6xl font-bold ${getScoreColor()}`}>
              {score}
            </div>
            <div className="flex-1">
              <Progress value={score} className="h-4" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>
          {analysis?.url && (
            <p className="text-sm text-muted-foreground mt-4">
              Analyzed URL: {analysis.url}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Core Web Vitals Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <VitalGauge
          name="LCP"
          value={metrics.lcp}
          threshold={2500}
          unit="ms"
          description="Largest Contentful Paint - measures loading performance"
        />
        <VitalGauge
          name="FID"
          value={metrics.fid}
          threshold={100}
          unit="ms"
          description="First Input Delay - measures interactivity"
        />
        <VitalGauge
          name="CLS"
          value={metrics.cls}
          threshold={0.1}
          unit=""
          description="Cumulative Layout Shift - measures visual stability"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              TTFB (Time to First Byte)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                metrics.ttfb <= 800 ? "text-green-500" : "text-yellow-500"
              }`}
            >
              {metrics.ttfb}ms
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Server response time (threshold: 800ms)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              FCP (First Contentful Paint)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                metrics.fcp <= 1800 ? "text-green-500" : "text-yellow-500"
              }`}
            >
              {metrics.fcp}ms
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Time to first content render (threshold: 1800ms)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Issues */}
      {analysis?.issues && analysis.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Issues Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.issues.map((issue, index) => (
                <div key={index} className="p-4 bg-yellow-500/10 rounded-lg">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">
                      {issue.metric.toUpperCase()}
                    </Badge>
                    <span className="text-sm">
                      {issue.value.toFixed(issue.metric === "cls" ? 3 : 0)} /{" "}
                      {issue.threshold}
                    </span>
                  </div>
                  {issue.element && (
                    <p className="mt-2 text-sm">
                      <span className="text-muted-foreground">Element: </span>
                      <code className="bg-muted px-1 rounded">
                        {issue.element}
                      </code>
                    </p>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">
                    {issue.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Issues */}
      {(!analysis?.issues || analysis.issues.length === 0) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <span>All Core Web Vitals are within acceptable thresholds!</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {analysis?.recommendations && analysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              Optimization Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
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
