/**
 * Load Tester Types
 * Defines interfaces for load testing configuration, results, and metrics
 * Requirements: 5.1
 */

/**
 * Configuration for a load test
 */
export interface LoadTestConfig {
  /** Target URL to test */
  targetUrl: string;
  /** Number of concurrent users to simulate */
  concurrentUsers: number;
  /** Total duration of the test in milliseconds */
  duration: number;
  /** Time to ramp up to full concurrent users in milliseconds */
  rampUpTime: number;
  /** HTTP method to use (default: GET) */
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  /** Request headers */
  headers?: Record<string, string>;
  /** Request body for POST/PUT/PATCH */
  body?: unknown;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Result of a single request during load testing
 */
export interface RequestResult {
  /** Response time in milliseconds */
  responseTime: number;
  /** HTTP status code */
  statusCode: number;
  /** Whether the request was successful (2xx status) */
  success: boolean;
  /** Error message if request failed */
  error?: string;
  /** Timestamp when request was made */
  timestamp: number;
}

/**
 * Result of a load test
 */
export interface LoadTestResult {
  /** Requests per second achieved */
  throughput: number;
  /** 50th percentile latency in milliseconds */
  latencyP50: number;
  /** 95th percentile latency in milliseconds */
  latencyP95: number;
  /** 99th percentile latency in milliseconds */
  latencyP99: number;
  /** Percentage of requests that failed (0-1) */
  errorRate: number;
  /** Endpoints identified as bottlenecks */
  bottleneckEndpoints: string[];
  /** Stability issues detected */
  stabilityIssues: string[];
  /** Total number of requests made */
  totalRequests: number;
  /** Number of successful requests */
  successfulRequests: number;
  /** Number of failed requests */
  failedRequests: number;
  /** Average response time in milliseconds */
  averageLatency: number;
  /** Minimum response time in milliseconds */
  minLatency: number;
  /** Maximum response time in milliseconds */
  maxLatency: number;
  /** Test duration in milliseconds */
  testDuration: number;
  /** Baseline response time (first few requests average) */
  baselineLatency: number;
  /** Individual request results */
  requestResults: RequestResult[];
}

/**
 * Default configuration values
 */
export const DEFAULT_LOAD_TEST_CONFIG: Partial<LoadTestConfig> = {
  method: "GET",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Thresholds for identifying issues
 */
export interface LoadTestThresholds {
  /** Error rate threshold (default: 0.01 = 1%) */
  errorRateThreshold: number;
  /** Response time increase percentage to flag as bottleneck (default: 0.5 = 50%) */
  responseTimeIncreaseThreshold: number;
}

/**
 * Default threshold values
 */
export const DEFAULT_LOAD_TEST_THRESHOLDS: LoadTestThresholds = {
  errorRateThreshold: 0.01,
  responseTimeIncreaseThreshold: 0.5,
};

/**
 * Interface for the LoadTester
 */
export interface ILoadTester {
  /**
   * Run a load test with the given configuration
   * @param config Load test configuration
   * @returns Load test results
   */
  runTest(config: LoadTestConfig): Promise<LoadTestResult>;

  /**
   * Identify bottleneck endpoints from load test results
   * @param results Load test results
   * @returns Array of bottleneck endpoint URLs
   */
  identifyBottlenecks(results: LoadTestResult): string[];

  /**
   * Generate a human-readable report from load test results
   * @param results Load test results
   * @returns Formatted report string
   */
  generateReport(results: LoadTestResult): string;
}
