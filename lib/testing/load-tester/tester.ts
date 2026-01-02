/**
 * Load Tester Implementation
 * Simulates concurrent users and measures performance under load
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

import {
  LoadTestConfig,
  LoadTestResult,
  RequestResult,
  ILoadTester,
  DEFAULT_LOAD_TEST_CONFIG,
  LoadTestThresholds,
  DEFAULT_LOAD_TEST_THRESHOLDS,
} from "./types";

/**
 * Calculate percentile from sorted array
 */
function calculatePercentile(
  sortedValues: number[],
  percentile: number
): number {
  if (sortedValues.length === 0) return 0;
  const index = Math.ceil((percentile / 100) * sortedValues.length) - 1;
  return sortedValues[Math.max(0, Math.min(index, sortedValues.length - 1))];
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * LoadTester class implementation
 */
export class LoadTester implements ILoadTester {
  private thresholds: LoadTestThresholds;

  constructor(thresholds: Partial<LoadTestThresholds> = {}) {
    this.thresholds = { ...DEFAULT_LOAD_TEST_THRESHOLDS, ...thresholds };
  }

  /**
   * Make a single request and measure response time
   */
  private async makeRequest(
    url: string,
    config: LoadTestConfig
  ): Promise<RequestResult> {
    const startTime = performance.now();
    const timestamp = Date.now();

    try {
      const controller = new AbortController();
      const timeout = config.timeout || DEFAULT_LOAD_TEST_CONFIG.timeout!;
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const fetchOptions: RequestInit = {
        method: config.method || DEFAULT_LOAD_TEST_CONFIG.method,
        headers: {
          ...DEFAULT_LOAD_TEST_CONFIG.headers,
          ...config.headers,
        },
        signal: controller.signal,
      };

      if (
        config.body &&
        ["POST", "PUT", "PATCH"].includes(config.method || "GET")
      ) {
        fetchOptions.body =
          typeof config.body === "string"
            ? config.body
            : JSON.stringify(config.body);
      }

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      const responseTime = performance.now() - startTime;
      const success = response.status >= 200 && response.status < 300;

      return {
        responseTime,
        statusCode: response.status,
        success,
        timestamp,
        error: success ? undefined : `HTTP ${response.status}`,
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      let errorMessage = "Unknown error";

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorMessage = "Request timeout";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        responseTime,
        statusCode: 0,
        success: false,
        timestamp,
        error: errorMessage,
      };
    }
  }

  /**
   * Run concurrent requests for a batch
   */
  private async runConcurrentBatch(
    url: string,
    config: LoadTestConfig,
    concurrentCount: number
  ): Promise<RequestResult[]> {
    const promises: Promise<RequestResult>[] = [];

    for (let i = 0; i < concurrentCount; i++) {
      promises.push(this.makeRequest(url, config));
    }

    return Promise.all(promises);
  }

  /**
   * Calculate baseline latency from initial requests
   */
  private calculateBaselineLatency(results: RequestResult[]): number {
    const baselineCount = Math.min(10, results.length);
    if (baselineCount === 0) return 0;

    const baselineResults = results.slice(0, baselineCount);
    const successfulResults = baselineResults.filter((r) => r.success);

    if (successfulResults.length === 0) return 0;

    const sum = successfulResults.reduce((acc, r) => acc + r.responseTime, 0);
    return sum / successfulResults.length;
  }

  /**
   * Run a load test with the given configuration
   * Requirements: 5.1, 5.4
   */
  async runTest(config: LoadTestConfig): Promise<LoadTestResult> {
    const allResults: RequestResult[] = [];
    const startTime = Date.now();
    const endTime = startTime + config.duration;
    const rampUpEndTime = startTime + config.rampUpTime;

    // Calculate interval between batches (aim for ~10 batches per second max)
    const batchInterval = Math.max(
      100,
      config.duration / (config.concurrentUsers * 10)
    );

    while (Date.now() < endTime) {
      const currentTime = Date.now();

      // Calculate current concurrent users based on ramp-up
      let currentConcurrentUsers: number;
      if (currentTime < rampUpEndTime) {
        const rampProgress = (currentTime - startTime) / config.rampUpTime;
        currentConcurrentUsers = Math.max(
          1,
          Math.floor(config.concurrentUsers * rampProgress)
        );
      } else {
        currentConcurrentUsers = config.concurrentUsers;
      }

      // Run a batch of concurrent requests
      const batchResults = await this.runConcurrentBatch(
        config.targetUrl,
        config,
        currentConcurrentUsers
      );
      allResults.push(...batchResults);

      // Wait before next batch
      await sleep(batchInterval);
    }

    const testDuration = Date.now() - startTime;
    return this.calculateResults(allResults, testDuration, config.targetUrl);
  }

  /**
   * Calculate load test results from request results
   * Requirements: 5.4
   */
  private calculateResults(
    results: RequestResult[],
    testDuration: number,
    targetUrl: string
  ): LoadTestResult {
    if (results.length === 0) {
      return this.createEmptyResult(testDuration, targetUrl);
    }

    const successfulResults = results.filter((r) => r.success);
    const failedResults = results.filter((r) => !r.success);
    const responseTimes = successfulResults
      .map((r) => r.responseTime)
      .sort((a, b) => a - b);

    const totalRequests = results.length;
    const successfulRequests = successfulResults.length;
    const failedRequests = failedResults.length;
    const errorRate = totalRequests > 0 ? failedRequests / totalRequests : 0;

    // Calculate latency metrics
    const averageLatency =
      responseTimes.length > 0
        ? responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length
        : 0;
    const minLatency = responseTimes.length > 0 ? responseTimes[0] : 0;
    const maxLatency =
      responseTimes.length > 0 ? responseTimes[responseTimes.length - 1] : 0;
    const latencyP50 = calculatePercentile(responseTimes, 50);
    const latencyP95 = calculatePercentile(responseTimes, 95);
    const latencyP99 = calculatePercentile(responseTimes, 99);

    // Calculate throughput (requests per second)
    const throughput =
      testDuration > 0 ? (totalRequests / testDuration) * 1000 : 0;

    // Calculate baseline latency
    const baselineLatency = this.calculateBaselineLatency(results);

    // Create initial result
    const result: LoadTestResult = {
      throughput,
      latencyP50,
      latencyP95,
      latencyP99,
      errorRate,
      bottleneckEndpoints: [],
      stabilityIssues: [],
      totalRequests,
      successfulRequests,
      failedRequests,
      averageLatency,
      minLatency,
      maxLatency,
      testDuration,
      baselineLatency,
      requestResults: results,
    };

    // Identify bottlenecks and stability issues
    result.bottleneckEndpoints = this.identifyBottlenecks(result);
    result.stabilityIssues = this.detectStabilityIssues(result);

    return result;
  }

  /**
   * Create an empty result for when no requests were made
   */
  private createEmptyResult(
    testDuration: number,
    targetUrl: string
  ): LoadTestResult {
    return {
      throughput: 0,
      latencyP50: 0,
      latencyP95: 0,
      latencyP99: 0,
      errorRate: 0,
      bottleneckEndpoints: [],
      stabilityIssues: [],
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageLatency: 0,
      minLatency: 0,
      maxLatency: 0,
      testDuration,
      baselineLatency: 0,
      requestResults: [],
    };
  }

  /**
   * Identify bottleneck endpoints from load test results
   * Requirements: 5.2
   */
  identifyBottlenecks(results: LoadTestResult): string[] {
    const bottlenecks: string[] = [];

    if (results.baselineLatency === 0 || results.requestResults.length === 0) {
      return bottlenecks;
    }

    // Check if response time increased by more than threshold compared to baseline
    const responseTimeIncrease =
      (results.averageLatency - results.baselineLatency) /
      results.baselineLatency;

    if (responseTimeIncrease > this.thresholds.responseTimeIncreaseThreshold) {
      // Extract URL from request results
      const url = this.extractUrlFromResults(results);
      if (url) {
        bottlenecks.push(url);
      }
    }

    return bottlenecks;
  }

  /**
   * Extract URL from results (for single-endpoint tests)
   */
  private extractUrlFromResults(results: LoadTestResult): string | null {
    // In a single-endpoint test, we can infer the URL from the test context
    // For multi-endpoint tests, this would need to be enhanced
    if (results.totalRequests > 0) {
      return "target-endpoint";
    }
    return null;
  }

  /**
   * Detect stability issues from load test results
   * Requirements: 5.3
   */
  detectStabilityIssues(results: LoadTestResult): string[] {
    const issues: string[] = [];

    // Check error rate threshold
    if (results.errorRate > this.thresholds.errorRateThreshold) {
      issues.push(
        `High error rate: ${(results.errorRate * 100).toFixed(
          2
        )}% (threshold: ${this.thresholds.errorRateThreshold * 100}%)`
      );
    }

    // Check for timeout patterns
    const timeoutErrors = results.requestResults.filter(
      (r) => r.error === "Request timeout"
    );
    if (timeoutErrors.length > results.totalRequests * 0.05) {
      issues.push(
        `High timeout rate: ${timeoutErrors.length} timeouts out of ${results.totalRequests} requests`
      );
    }

    // Check for response time degradation over time
    if (results.requestResults.length >= 20) {
      const firstHalf = results.requestResults.slice(
        0,
        Math.floor(results.requestResults.length / 2)
      );
      const secondHalf = results.requestResults.slice(
        Math.floor(results.requestResults.length / 2)
      );

      const firstHalfAvg = this.calculateAverageResponseTime(firstHalf);
      const secondHalfAvg = this.calculateAverageResponseTime(secondHalf);

      if (firstHalfAvg > 0 && secondHalfAvg > firstHalfAvg * 1.5) {
        issues.push(
          `Response time degradation: ${firstHalfAvg.toFixed(
            2
          )}ms -> ${secondHalfAvg.toFixed(2)}ms`
        );
      }
    }

    return issues;
  }

  /**
   * Calculate average response time from results
   */
  private calculateAverageResponseTime(results: RequestResult[]): number {
    const successful = results.filter((r) => r.success);
    if (successful.length === 0) return 0;
    return (
      successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length
    );
  }

  /**
   * Generate a human-readable report from load test results
   * Requirements: 5.4
   */
  generateReport(results: LoadTestResult): string {
    const lines: string[] = [];

    lines.push("=".repeat(60));
    lines.push("LOAD TEST REPORT");
    lines.push("=".repeat(60));
    lines.push("");

    // Summary
    lines.push("SUMMARY");
    lines.push("-".repeat(40));
    lines.push(`Total Requests: ${results.totalRequests}`);
    lines.push(`Successful: ${results.successfulRequests}`);
    lines.push(`Failed: ${results.failedRequests}`);
    lines.push(`Error Rate: ${(results.errorRate * 100).toFixed(2)}%`);
    lines.push(`Test Duration: ${(results.testDuration / 1000).toFixed(2)}s`);
    lines.push(`Throughput: ${results.throughput.toFixed(2)} req/s`);
    lines.push("");

    // Latency Statistics
    lines.push("LATENCY STATISTICS");
    lines.push("-".repeat(40));
    lines.push(`Average: ${results.averageLatency.toFixed(2)}ms`);
    lines.push(`Min: ${results.minLatency.toFixed(2)}ms`);
    lines.push(`Max: ${results.maxLatency.toFixed(2)}ms`);
    lines.push(`P50: ${results.latencyP50.toFixed(2)}ms`);
    lines.push(`P95: ${results.latencyP95.toFixed(2)}ms`);
    lines.push(`P99: ${results.latencyP99.toFixed(2)}ms`);
    lines.push(`Baseline: ${results.baselineLatency.toFixed(2)}ms`);
    lines.push("");

    // Bottlenecks
    if (results.bottleneckEndpoints.length > 0) {
      lines.push("BOTTLENECK ENDPOINTS");
      lines.push("-".repeat(40));
      for (const endpoint of results.bottleneckEndpoints) {
        lines.push(`• ${endpoint}`);
      }
      lines.push("");
    }

    // Stability Issues
    if (results.stabilityIssues.length > 0) {
      lines.push("STABILITY ISSUES");
      lines.push("-".repeat(40));
      for (const issue of results.stabilityIssues) {
        lines.push(`⚠ ${issue}`);
      }
      lines.push("");
    }

    // Status
    lines.push("STATUS");
    lines.push("-".repeat(40));
    if (
      results.stabilityIssues.length === 0 &&
      results.bottleneckEndpoints.length === 0
    ) {
      lines.push("✓ All checks passed");
    } else {
      lines.push(
        `✗ ${results.bottleneckEndpoints.length} bottleneck(s), ${results.stabilityIssues.length} stability issue(s)`
      );
    }
    lines.push("");

    lines.push("=".repeat(60));

    return lines.join("\n");
  }
}

/**
 * Create a LoadTester instance with optional custom thresholds
 */
export function createLoadTester(
  thresholds?: Partial<LoadTestThresholds>
): LoadTester {
  return new LoadTester(thresholds);
}
