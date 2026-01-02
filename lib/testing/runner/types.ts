/**
 * Test Runner Types
 * Defines interfaces for test orchestration, reporting, and summary
 * Requirements: 10.1
 */

import type { BundleAnalysisResult } from "../bundle-analyzer/types";
import type { ComponentProfileResult } from "../component-profiler/types";
import type { APITestResult, BatchTestResult } from "../api-tester/types";
import type { DatabaseProfileResult } from "../database-profiler/types";
import type { MemoryProfileResult } from "../memory-profiler/types";
import type { LoadTestResult } from "../load-tester/types";
import type {
  WebVitalsMetrics,
  WebVitalsAnalysisResult,
} from "../web-vitals/types";
import type { AnimationProfileResult } from "../animation-profiler/types";
import type { MediaAnalysisResult } from "../media-analyzer/types";

/**
 * Test execution status
 */
export type TestStatus = "passed" | "failed" | "skipped" | "error";

/**
 * Summary of test execution results
 */
export interface TestSummary {
  /** Total number of tests executed */
  totalTests: number;
  /** Number of tests that passed */
  passed: number;
  /** Number of tests that failed */
  failed: number;
  /** Number of tests that were skipped */
  skipped: number;
  /** Code coverage percentage (0-100) */
  coverage: number;
  /** Total execution time in milliseconds */
  executionTime: number;
}

/**
 * Module coverage information
 */
export interface ModuleCoverage {
  /** Module name or path */
  moduleName: string;
  /** Lines covered */
  linesCovered: number;
  /** Total lines */
  totalLines: number;
  /** Coverage percentage (0-100) */
  coveragePercent: number;
  /** Whether coverage is below threshold */
  belowThreshold: boolean;
}

/**
 * Coverage report details
 */
export interface CoverageReport {
  /** Overall coverage percentage (0-100) */
  overallCoverage: number;
  /** Coverage by module */
  modules: ModuleCoverage[];
  /** Modules with coverage below threshold */
  lowCoverageModules: string[];
  /** Untested code paths */
  untestedPaths: string[];
  /** Coverage threshold used */
  threshold: number;
}

/**
 * Individual test result
 */
export interface TestResult {
  /** Test name or identifier */
  name: string;
  /** Test status */
  status: TestStatus;
  /** Execution time in milliseconds */
  duration: number;
  /** Error message if test failed */
  error?: string;
  /** Stack trace if test failed */
  stackTrace?: string;
  /** Test file path */
  filePath?: string;
}

/**
 * Complete test report aggregating all profiler results
 */
export interface TestReport {
  /** Timestamp when the report was generated */
  timestamp: Date;
  /** Total duration of all tests in milliseconds */
  duration: number;
  /** Summary of test execution */
  summary: TestSummary;
  /** Coverage report details */
  coverageReport?: CoverageReport;
  /** Bundle analysis results */
  bundleAnalysis?: BundleAnalysisResult;
  /** Component profiling results */
  componentProfile?: ComponentProfileResult;
  /** API test results */
  apiTests?: APITestResult[];
  /** Batch API test results with summary */
  apiBatchResult?: BatchTestResult;
  /** Database profiling results */
  databaseProfile?: DatabaseProfileResult;
  /** Memory profiling results */
  memoryProfile?: MemoryProfileResult;
  /** Load test results */
  loadTest?: LoadTestResult;
  /** Web Vitals metrics */
  webVitals?: WebVitalsMetrics;
  /** Web Vitals analysis results */
  webVitalsAnalysis?: WebVitalsAnalysisResult;
  /** Animation profiling results */
  animationProfile?: AnimationProfileResult;
  /** Media analysis results */
  mediaAnalysis?: MediaAnalysisResult;
  /** Individual test results */
  testResults?: TestResult[];
  /** Aggregated recommendations from all profilers */
  recommendations: string[];
}

/**
 * Configuration for the test runner
 */
export interface TestRunnerConfig {
  /** Enable bundle analysis */
  bundleAnalysis: {
    enabled: boolean;
    sizeThresholdKB: number;
    thirdPartyThreshold: number;
  };
  /** Enable component profiling */
  componentProfiling: {
    enabled: boolean;
    renderTimeThresholdMs: number;
    rerenderThreshold: number;
  };
  /** Enable API testing */
  apiTesting: {
    enabled: boolean;
    responseTimeThresholdMs: number;
    endpoints: string[];
  };
  /** Enable database profiling */
  databaseProfiling: {
    enabled: boolean;
    queryTimeThresholdMs: number;
  };
  /** Enable memory profiling */
  memoryProfiling: {
    enabled: boolean;
    heapThresholdPercent: number;
    trackingIntervalMs: number;
  };
  /** Enable load testing */
  loadTesting: {
    enabled: boolean;
    concurrentUsers: number;
    duration: number;
    errorRateThreshold: number;
  };
  /** Enable Web Vitals measurement */
  webVitals: {
    enabled: boolean;
    lcpThresholdMs: number;
    fidThresholdMs: number;
    clsThreshold: number;
  };
  /** Enable animation profiling */
  animationProfiling: {
    enabled: boolean;
    fpsThreshold: number;
  };
  /** Enable media analysis */
  mediaAnalysis: {
    enabled: boolean;
    imageSizeThresholdKB: number;
  };
  /** Coverage threshold percentage (default: 70%) */
  coverageThreshold: number;
}

/**
 * Default test runner configuration
 */
export const DEFAULT_TEST_RUNNER_CONFIG: TestRunnerConfig = {
  bundleAnalysis: {
    enabled: true,
    sizeThresholdKB: 250,
    thirdPartyThreshold: 0.5,
  },
  componentProfiling: {
    enabled: true,
    renderTimeThresholdMs: 16,
    rerenderThreshold: 5,
  },
  apiTesting: {
    enabled: true,
    responseTimeThresholdMs: 500,
    endpoints: [],
  },
  databaseProfiling: {
    enabled: true,
    queryTimeThresholdMs: 100,
  },
  memoryProfiling: {
    enabled: true,
    heapThresholdPercent: 0.8,
    trackingIntervalMs: 1000,
  },
  loadTesting: {
    enabled: false,
    concurrentUsers: 10,
    duration: 30000,
    errorRateThreshold: 0.01,
  },
  webVitals: {
    enabled: true,
    lcpThresholdMs: 2500,
    fidThresholdMs: 100,
    clsThreshold: 0.1,
  },
  animationProfiling: {
    enabled: true,
    fpsThreshold: 30,
  },
  mediaAnalysis: {
    enabled: true,
    imageSizeThresholdKB: 500,
  },
  coverageThreshold: 70,
};

/**
 * Interface for the TestRunner
 */
export interface ITestRunner {
  /**
   * Run all enabled tests and profilers
   * @returns Complete test report
   */
  runAllTests(): Promise<TestReport>;

  /**
   * Calculate code coverage from test results
   * @returns Coverage report
   */
  calculateCoverage(): Promise<CoverageReport>;

  /**
   * Generate a human-readable report from test results
   * @param report The test report to format
   * @returns Formatted report string
   */
  generateReport(report: TestReport): string;

  /**
   * Check if coverage meets threshold
   * @param coverage Coverage percentage
   * @param threshold Threshold percentage (default from config)
   * @returns True if coverage meets threshold
   */
  checkCoverageThreshold(coverage: number, threshold?: number): boolean;

  /**
   * Get modules with coverage below threshold
   * @param coverageReport Coverage report to analyze
   * @returns Array of module names with low coverage
   */
  getLowCoverageModules(coverageReport: CoverageReport): string[];

  /**
   * Aggregate recommendations from all profiler results
   * @param report Test report with profiler results
   * @returns Array of all recommendations
   */
  aggregateRecommendations(report: TestReport): string[];
}
