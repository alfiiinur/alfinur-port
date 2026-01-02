/**
 * Web Vitals Analyzer Types
 * Defines interfaces for Core Web Vitals measurement and analysis
 * Requirements: 8.1
 */

/**
 * Core Web Vitals metrics
 */
export interface WebVitalsMetrics {
  /** Largest Contentful Paint in milliseconds */
  lcp: number;
  /** First Input Delay in milliseconds */
  fid: number;
  /** Cumulative Layout Shift (unitless) */
  cls: number;
  /** Time to First Byte in milliseconds */
  ttfb: number;
  /** First Contentful Paint in milliseconds */
  fcp: number;
}

/**
 * Types of Web Vitals metrics that can have issues
 */
export type WebVitalsMetricType = "lcp" | "fid" | "cls";

/**
 * An issue identified during Web Vitals analysis
 */
export interface WebVitalsIssue {
  /** The metric that has an issue */
  metric: WebVitalsMetricType;
  /** The measured value */
  value: number;
  /** The threshold that was exceeded */
  threshold: number;
  /** The DOM element causing the issue (if identifiable) */
  element?: string;
  /** Optimization suggestion */
  suggestion: string;
}

/**
 * Result of a Web Vitals analysis session
 */
export interface WebVitalsAnalysisResult {
  /** The URL that was analyzed */
  url: string;
  /** Timestamp of the analysis */
  timestamp: number;
  /** Measured metrics */
  metrics: WebVitalsMetrics;
  /** Issues identified based on thresholds */
  issues: WebVitalsIssue[];
  /** Overall score (0-100) */
  score: number;
  /** Optimization recommendations */
  recommendations: string[];
}

/**
 * Configuration options for Web Vitals analysis
 */
export interface WebVitalsConfig {
  /** LCP threshold in milliseconds (default: 2500ms) */
  lcpThresholdMs: number;
  /** FID threshold in milliseconds (default: 100ms) */
  fidThresholdMs: number;
  /** CLS threshold (default: 0.1) */
  clsThreshold: number;
  /** TTFB threshold in milliseconds (default: 800ms) */
  ttfbThresholdMs: number;
  /** FCP threshold in milliseconds (default: 1800ms) */
  fcpThresholdMs: number;
  /** Timeout for page load in milliseconds */
  timeoutMs: number;
}

/**
 * Default configuration values based on Google's Core Web Vitals thresholds
 */
export const DEFAULT_WEB_VITALS_CONFIG: WebVitalsConfig = {
  lcpThresholdMs: 2500,
  fidThresholdMs: 100,
  clsThreshold: 0.1,
  ttfbThresholdMs: 800,
  fcpThresholdMs: 1800,
  timeoutMs: 30000,
};

/**
 * Rating levels for Web Vitals metrics
 */
export type MetricRating = "good" | "needs-improvement" | "poor";

/**
 * Detailed metric result with rating
 */
export interface MetricResult {
  /** The metric name */
  name: string;
  /** The measured value */
  value: number;
  /** The threshold for "good" rating */
  threshold: number;
  /** Rating based on the value */
  rating: MetricRating;
}

/**
 * Element information for LCP/CLS analysis
 */
export interface ElementInfo {
  /** CSS selector for the element */
  selector: string;
  /** Tag name of the element */
  tagName: string;
  /** Element's contribution to the metric */
  contribution: number;
  /** Additional details about the element */
  details?: string;
}

/**
 * Blocking resource information for FID analysis
 */
export interface BlockingResource {
  /** URL of the blocking resource */
  url: string;
  /** Type of resource (script, stylesheet, etc.) */
  type: string;
  /** Time the resource blocked the main thread in ms */
  blockingTime: number;
}

/**
 * Interface for the WebVitalsAnalyzer
 */
export interface IWebVitalsAnalyzer {
  /**
   * Measure Core Web Vitals for a given URL
   * @param url The URL to measure
   * @returns Web Vitals metrics
   */
  measure(url: string): Promise<WebVitalsMetrics>;

  /**
   * Check metrics against thresholds and identify issues
   * @param metrics The metrics to check
   * @returns Array of issues found
   */
  checkThresholds(metrics: WebVitalsMetrics): WebVitalsIssue[];

  /**
   * Identify the element causing LCP
   * @param url The URL to analyze
   * @returns CSS selector or description of the LCP element
   */
  identifyLCPElement(url: string): Promise<string>;

  /**
   * Identify elements causing CLS
   * @param url The URL to analyze
   * @returns Array of CSS selectors for elements causing layout shifts
   */
  identifyCLSElements(url: string): Promise<string[]>;

  /**
   * Identify JavaScript files blocking the main thread
   * @param url The URL to analyze
   * @returns Array of blocking script URLs
   */
  identifyBlockingJS(url: string): Promise<string[]>;

  /**
   * Run a complete analysis and return detailed results
   * @param url The URL to analyze
   * @returns Complete analysis result
   */
  analyze(url: string): Promise<WebVitalsAnalysisResult>;

  /**
   * Generate a human-readable report from analysis results
   * @param result The analysis result to format
   * @returns Formatted report string
   */
  generateReport(result: WebVitalsAnalysisResult): string;

  /**
   * Get the rating for a specific metric value
   * @param metric The metric type
   * @param value The measured value
   * @returns Rating (good, needs-improvement, or poor)
   */
  getMetricRating(metric: WebVitalsMetricType, value: number): MetricRating;
}
