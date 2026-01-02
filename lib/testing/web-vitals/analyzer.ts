/**
 * Web Vitals Analyzer Implementation
 * Measures and analyzes Core Web Vitals metrics
 * Requirements: 8.1
 */

import {
  WebVitalsMetrics,
  WebVitalsIssue,
  WebVitalsAnalysisResult,
  IWebVitalsAnalyzer,
  WebVitalsConfig,
  DEFAULT_WEB_VITALS_CONFIG,
  WebVitalsMetricType,
  MetricRating,
} from "./types";

/**
 * Optimization suggestions for each metric type
 */
const OPTIMIZATION_SUGGESTIONS: Record<WebVitalsMetricType, string[]> = {
  lcp: [
    "Optimize and compress images, use modern formats like WebP or AVIF",
    "Preload critical resources using <link rel='preload'>",
    "Use a CDN to reduce server response time",
    "Remove render-blocking resources",
    "Implement server-side rendering or static generation",
  ],
  fid: [
    "Break up long JavaScript tasks into smaller chunks",
    "Use web workers for heavy computations",
    "Defer non-critical JavaScript",
    "Minimize main thread work",
    "Reduce JavaScript execution time",
  ],
  cls: [
    "Always include width and height attributes on images and videos",
    "Reserve space for dynamic content with CSS aspect-ratio",
    "Avoid inserting content above existing content",
    "Use transform animations instead of properties that trigger layout",
    "Preload fonts and use font-display: optional",
  ],
};

/**
 * WebVitalsAnalyzer class implementation
 */
export class WebVitalsAnalyzer implements IWebVitalsAnalyzer {
  private config: WebVitalsConfig;

  constructor(config: Partial<WebVitalsConfig> = {}) {
    this.config = { ...DEFAULT_WEB_VITALS_CONFIG, ...config };
  }

  /**
   * Measure Core Web Vitals for a given URL
   * This implementation provides a simulation for testing purposes.
   * In production, use Playwright or Lighthouse for real measurements.
   * Requirements: 8.1
   */
  async measure(url: string): Promise<WebVitalsMetrics> {
    // Validate URL
    if (!url || typeof url !== "string") {
      throw new Error("Invalid URL provided");
    }

    try {
      new URL(url);
    } catch {
      throw new Error(`Invalid URL format: ${url}`);
    }

    // In a real implementation, this would use Playwright or Lighthouse
    // For now, we return simulated metrics that can be used for testing
    // The actual measurement would be done via:
    // 1. Playwright with web-vitals library injection
    // 2. Lighthouse CI
    // 3. Chrome DevTools Protocol

    return this.simulateMetrics(url);
  }

  /**
   * Simulate metrics for testing purposes
   * In production, replace with actual Playwright/Lighthouse measurement
   */
  private simulateMetrics(url: string): WebVitalsMetrics {
    // Generate deterministic but varied metrics based on URL hash
    const hash = this.hashString(url);

    return {
      lcp: 1000 + (hash % 3000), // 1000-4000ms range
      fid: 10 + (hash % 200), // 10-210ms range
      cls: (hash % 30) / 100, // 0-0.3 range
      ttfb: 100 + (hash % 1000), // 100-1100ms range
      fcp: 500 + (hash % 2000), // 500-2500ms range
    };
  }

  /**
   * Simple string hash function for deterministic simulation
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Check metrics against thresholds and identify issues
   * Requirements: 8.2, 8.3, 8.4
   */
  checkThresholds(metrics: WebVitalsMetrics): WebVitalsIssue[] {
    const issues: WebVitalsIssue[] = [];

    // Check LCP threshold (2500ms)
    if (metrics.lcp > this.config.lcpThresholdMs) {
      issues.push({
        metric: "lcp",
        value: metrics.lcp,
        threshold: this.config.lcpThresholdMs,
        suggestion: this.getOptimizationSuggestion("lcp", metrics.lcp),
      });
    }

    // Check FID threshold (100ms)
    if (metrics.fid > this.config.fidThresholdMs) {
      issues.push({
        metric: "fid",
        value: metrics.fid,
        threshold: this.config.fidThresholdMs,
        suggestion: this.getOptimizationSuggestion("fid", metrics.fid),
      });
    }

    // Check CLS threshold (0.1)
    if (metrics.cls > this.config.clsThreshold) {
      issues.push({
        metric: "cls",
        value: metrics.cls,
        threshold: this.config.clsThreshold,
        suggestion: this.getOptimizationSuggestion("cls", metrics.cls),
      });
    }

    return issues;
  }

  /**
   * Get optimization suggestion based on metric type and severity
   */
  private getOptimizationSuggestion(
    metric: WebVitalsMetricType,
    value: number
  ): string {
    const suggestions = OPTIMIZATION_SUGGESTIONS[metric];
    const severity = this.calculateSeverity(metric, value);

    // Return more urgent suggestions for worse values
    const index = Math.min(
      Math.floor(severity * suggestions.length),
      suggestions.length - 1
    );

    return suggestions[index];
  }

  /**
   * Calculate severity (0-1) based on how much the threshold is exceeded
   */
  private calculateSeverity(
    metric: WebVitalsMetricType,
    value: number
  ): number {
    let threshold: number;
    let maxBad: number;

    switch (metric) {
      case "lcp":
        threshold = this.config.lcpThresholdMs;
        maxBad = 4000; // 4s is considered poor
        break;
      case "fid":
        threshold = this.config.fidThresholdMs;
        maxBad = 300; // 300ms is considered poor
        break;
      case "cls":
        threshold = this.config.clsThreshold;
        maxBad = 0.25; // 0.25 is considered poor
        break;
      default:
        return 0;
    }

    if (value <= threshold) return 0;
    return Math.min((value - threshold) / (maxBad - threshold), 1);
  }

  /**
   * Identify the element causing LCP
   * Requirements: 8.2
   */
  async identifyLCPElement(url: string): Promise<string> {
    // In production, this would use Playwright to:
    // 1. Navigate to the URL
    // 2. Inject web-vitals library
    // 3. Capture the LCP element via PerformanceObserver

    // For testing, return a simulated element based on URL
    const hash = this.hashString(url);
    const elements = [
      "img.hero-image",
      "div.main-content > h1",
      "video.background-video",
      "img.featured-image",
      "section.hero > img",
    ];

    return elements[hash % elements.length];
  }

  /**
   * Identify elements causing CLS
   * Requirements: 8.3
   */
  async identifyCLSElements(url: string): Promise<string[]> {
    // In production, this would use Playwright to:
    // 1. Navigate to the URL
    // 2. Monitor layout shifts via PerformanceObserver
    // 3. Identify elements that shifted

    // For testing, return simulated elements
    const hash = this.hashString(url);
    const allElements = [
      "img:not([width])",
      "iframe.dynamic-embed",
      "div.ad-container",
      "img.lazy-load",
      "div.dynamic-content",
      "span.web-font",
    ];

    // Return 1-3 elements based on hash
    const count = 1 + (hash % 3);
    return allElements.slice(0, count);
  }

  /**
   * Identify JavaScript files blocking the main thread
   * Requirements: 8.4
   */
  async identifyBlockingJS(url: string): Promise<string[]> {
    // In production, this would use Lighthouse or Chrome DevTools Protocol to:
    // 1. Analyze network requests
    // 2. Identify render-blocking scripts
    // 3. Measure main thread blocking time

    // For testing, return simulated blocking scripts
    const hash = this.hashString(url);
    const scripts = [
      "/js/analytics.js",
      "/js/vendor.bundle.js",
      "/js/main.bundle.js",
      "https://cdn.example.com/widget.js",
      "/js/polyfills.js",
    ];

    // Return 0-3 scripts based on hash
    const count = hash % 4;
    return scripts.slice(0, count);
  }

  /**
   * Run a complete analysis and return detailed results
   * Requirements: 8.1, 8.2, 8.3, 8.4
   */
  async analyze(url: string): Promise<WebVitalsAnalysisResult> {
    const metrics = await this.measure(url);
    const issues = this.checkThresholds(metrics);

    // Identify problematic elements for each issue
    for (const issue of issues) {
      if (issue.metric === "lcp") {
        issue.element = await this.identifyLCPElement(url);
      } else if (issue.metric === "cls") {
        const clsElements = await this.identifyCLSElements(url);
        issue.element = clsElements.join(", ");
      } else if (issue.metric === "fid") {
        const blockingJS = await this.identifyBlockingJS(url);
        if (blockingJS.length > 0) {
          issue.element = blockingJS.join(", ");
        }
      }
    }

    // Calculate overall score (0-100)
    const score = this.calculateScore(metrics);

    // Generate recommendations
    const recommendations = this.generateRecommendations(metrics, issues);

    return {
      url,
      timestamp: Date.now(),
      metrics,
      issues,
      score,
      recommendations,
    };
  }

  /**
   * Calculate overall performance score (0-100)
   */
  private calculateScore(metrics: WebVitalsMetrics): number {
    // Weight each metric
    const lcpScore = this.getMetricScore("lcp", metrics.lcp);
    const fidScore = this.getMetricScore("fid", metrics.fid);
    const clsScore = this.getMetricScore("cls", metrics.cls);

    // Weighted average (LCP: 25%, FID: 25%, CLS: 25%, others: 25%)
    const ttfbScore = this.getTTFBScore(metrics.ttfb);
    const fcpScore = this.getFCPScore(metrics.fcp);

    return Math.round(
      lcpScore * 0.25 +
        fidScore * 0.25 +
        clsScore * 0.25 +
        (ttfbScore + fcpScore) * 0.125
    );
  }

  /**
   * Get score (0-100) for a specific metric
   */
  private getMetricScore(metric: WebVitalsMetricType, value: number): number {
    const rating = this.getMetricRating(metric, value);
    switch (rating) {
      case "good":
        return 100;
      case "needs-improvement":
        return 50;
      case "poor":
        return 0;
    }
  }

  /**
   * Get TTFB score
   */
  private getTTFBScore(value: number): number {
    if (value <= this.config.ttfbThresholdMs) return 100;
    if (value <= this.config.ttfbThresholdMs * 2) return 50;
    return 0;
  }

  /**
   * Get FCP score
   */
  private getFCPScore(value: number): number {
    if (value <= this.config.fcpThresholdMs) return 100;
    if (value <= this.config.fcpThresholdMs * 1.5) return 50;
    return 0;
  }

  /**
   * Generate recommendations based on metrics and issues
   */
  private generateRecommendations(
    metrics: WebVitalsMetrics,
    issues: WebVitalsIssue[]
  ): string[] {
    const recommendations: string[] = [];

    // Add recommendations for each issue
    for (const issue of issues) {
      const suggestions = OPTIMIZATION_SUGGESTIONS[issue.metric];
      // Add top 2 suggestions for each issue
      recommendations.push(...suggestions.slice(0, 2));
    }

    // Add general recommendations based on metrics
    if (metrics.ttfb > this.config.ttfbThresholdMs) {
      recommendations.push(
        "Improve server response time - consider caching, CDN, or server optimization"
      );
    }

    if (metrics.fcp > this.config.fcpThresholdMs) {
      recommendations.push(
        "Reduce time to first paint by optimizing critical rendering path"
      );
    }

    // Remove duplicates
    return [...new Set(recommendations)];
  }

  /**
   * Generate a human-readable report from analysis results
   */
  generateReport(result: WebVitalsAnalysisResult): string {
    const lines: string[] = [];

    lines.push("=".repeat(60));
    lines.push("WEB VITALS ANALYSIS REPORT");
    lines.push("=".repeat(60));
    lines.push("");

    // URL and timestamp
    lines.push(`URL: ${result.url}`);
    lines.push(`Analyzed: ${new Date(result.timestamp).toISOString()}`);
    lines.push(`Overall Score: ${result.score}/100`);
    lines.push("");

    // Core Web Vitals
    lines.push("CORE WEB VITALS");
    lines.push("-".repeat(40));

    const lcpRating = this.getMetricRating("lcp", result.metrics.lcp);
    const fidRating = this.getMetricRating("fid", result.metrics.fid);
    const clsRating = this.getMetricRating("cls", result.metrics.cls);

    lines.push(
      `LCP (Largest Contentful Paint): ${
        result.metrics.lcp
      }ms ${this.getRatingIcon(lcpRating)}`
    );
    lines.push(
      `FID (First Input Delay): ${result.metrics.fid}ms ${this.getRatingIcon(
        fidRating
      )}`
    );
    lines.push(
      `CLS (Cumulative Layout Shift): ${result.metrics.cls.toFixed(
        3
      )} ${this.getRatingIcon(clsRating)}`
    );
    lines.push("");

    // Additional metrics
    lines.push("ADDITIONAL METRICS");
    lines.push("-".repeat(40));
    lines.push(`TTFB (Time to First Byte): ${result.metrics.ttfb}ms`);
    lines.push(`FCP (First Contentful Paint): ${result.metrics.fcp}ms`);
    lines.push("");

    // Issues
    if (result.issues.length > 0) {
      lines.push("ISSUES FOUND");
      lines.push("-".repeat(40));
      for (const issue of result.issues) {
        lines.push(
          `🔴 ${issue.metric.toUpperCase()}: ${
            issue.value
          } exceeds threshold of ${issue.threshold}`
        );
        if (issue.element) {
          lines.push(`   Element: ${issue.element}`);
        }
        lines.push(`   Suggestion: ${issue.suggestion}`);
        lines.push("");
      }
    } else {
      lines.push("✅ No issues found - all metrics within thresholds");
      lines.push("");
    }

    // Recommendations
    if (result.recommendations.length > 0) {
      lines.push("RECOMMENDATIONS");
      lines.push("-".repeat(40));
      for (const rec of result.recommendations) {
        lines.push(`• ${rec}`);
      }
      lines.push("");
    }

    lines.push("=".repeat(60));

    return lines.join("\n");
  }

  /**
   * Get rating icon for display
   */
  private getRatingIcon(rating: MetricRating): string {
    switch (rating) {
      case "good":
        return "🟢 Good";
      case "needs-improvement":
        return "🟡 Needs Improvement";
      case "poor":
        return "🔴 Poor";
    }
  }

  /**
   * Get the rating for a specific metric value
   */
  getMetricRating(metric: WebVitalsMetricType, value: number): MetricRating {
    switch (metric) {
      case "lcp":
        if (value <= this.config.lcpThresholdMs) return "good";
        if (value <= 4000) return "needs-improvement";
        return "poor";
      case "fid":
        if (value <= this.config.fidThresholdMs) return "good";
        if (value <= 300) return "needs-improvement";
        return "poor";
      case "cls":
        if (value <= this.config.clsThreshold) return "good";
        if (value <= 0.25) return "needs-improvement";
        return "poor";
      default:
        return "good";
    }
  }
}

/**
 * Create a WebVitalsAnalyzer instance with default config
 */
export function createWebVitalsAnalyzer(
  config?: Partial<WebVitalsConfig>
): WebVitalsAnalyzer {
  return new WebVitalsAnalyzer(config);
}

/**
 * Analyze metrics directly (useful for testing)
 */
export function analyzeMetrics(
  metrics: WebVitalsMetrics,
  config?: Partial<WebVitalsConfig>
): { issues: WebVitalsIssue[]; score: number } {
  const analyzer = new WebVitalsAnalyzer(config);
  const issues = analyzer.checkThresholds(metrics);

  // Calculate score
  const lcpScore =
    analyzer.getMetricRating("lcp", metrics.lcp) === "good"
      ? 100
      : analyzer.getMetricRating("lcp", metrics.lcp) === "needs-improvement"
      ? 50
      : 0;
  const fidScore =
    analyzer.getMetricRating("fid", metrics.fid) === "good"
      ? 100
      : analyzer.getMetricRating("fid", metrics.fid) === "needs-improvement"
      ? 50
      : 0;
  const clsScore =
    analyzer.getMetricRating("cls", metrics.cls) === "good"
      ? 100
      : analyzer.getMetricRating("cls", metrics.cls) === "needs-improvement"
      ? 50
      : 0;

  const score = Math.round((lcpScore + fidScore + clsScore) / 3);

  return { issues, score };
}
