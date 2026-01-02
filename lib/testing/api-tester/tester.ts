/**
 * API Tester Implementation
 * Tests API endpoints for response time, status codes, and error handling
 * Requirements: 3.1, 3.2, 3.3
 */

import {
  APITestResult,
  APIError,
  APIErrorType,
  RequestOptions,
  EndpointConfig,
  BatchTestResult,
  APITestSummary,
  IAPITester,
  APITesterConfig,
  DEFAULT_API_TESTER_CONFIG,
  HTTPMethod,
} from "./types";

/**
 * Classify an error into an APIErrorType
 */
function classifyError(error: unknown, statusCode?: number): APIErrorType {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Check for timeout errors
    if (message.includes("timeout") || message.includes("aborted")) {
      return "timeout";
    }

    // Check for network errors
    if (
      message.includes("network") ||
      message.includes("econnrefused") ||
      message.includes("enotfound") ||
      message.includes("fetch failed") ||
      message.includes("connection")
    ) {
      return "network";
    }
  }

  // Classify by status code
  if (statusCode !== undefined) {
    if (statusCode >= 400 && statusCode < 500) {
      return "validation";
    }
    if (statusCode >= 500) {
      return "server";
    }
  }

  return "network";
}

/**
 * Create an APIError from an exception or status code
 */
function createAPIError(
  error: unknown,
  statusCode?: number,
  customMessage?: string
): APIError {
  const type = classifyError(error, statusCode);
  let message = customMessage || "Unknown error";

  if (error instanceof Error) {
    message = error.message;
  }

  return {
    type,
    message,
    statusCode,
  };
}

/**
 * Calculate payload size from response
 */
function calculatePayloadSize(body: string | null): number {
  if (!body) return 0;
  // Calculate byte length (UTF-8)
  return new TextEncoder().encode(body).length;
}

/**
 * Build full URL from base and endpoint
 */
function buildUrl(baseUrl: string, endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }

  if (!baseUrl) {
    return endpoint;
  }

  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

/**
 * APITester class implementation
 */
export class APITester implements IAPITester {
  private config: APITesterConfig;

  constructor(config: Partial<APITesterConfig> = {}) {
    this.config = { ...DEFAULT_API_TESTER_CONFIG, ...config };
  }

  /**
   * Test a single API endpoint
   * Requirements: 3.1, 3.2
   */
  async testEndpoint(
    url: string,
    options: RequestOptions = {}
  ): Promise<APITestResult> {
    const fullUrl = buildUrl(this.config.baseUrl, url);
    const method: HTTPMethod = options.method || "GET";
    const timeout = options.timeout || this.config.defaultTimeoutMs;
    const headers = {
      ...this.config.defaultHeaders,
      ...options.headers,
    };

    const errors: APIError[] = [];
    let statusCode = 0;
    let payloadSize = 0;
    let responseTime = 0;

    const startTime = performance.now();

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      // Add body for methods that support it
      if (options.body && ["POST", "PUT", "PATCH"].includes(method)) {
        fetchOptions.body =
          typeof options.body === "string"
            ? options.body
            : JSON.stringify(options.body);
      }

      const response = await fetch(fullUrl, fetchOptions);
      clearTimeout(timeoutId);

      responseTime = performance.now() - startTime;
      statusCode = response.status;

      // Read response body for payload size calculation
      const responseBody = await response.text();
      payloadSize = calculatePayloadSize(responseBody);

      // Check for error status codes
      if (!response.ok) {
        errors.push(
          createAPIError(
            new Error(`HTTP ${statusCode}: ${response.statusText}`),
            statusCode
          )
        );
      }
    } catch (error) {
      responseTime = performance.now() - startTime;

      // Handle abort/timeout
      if (error instanceof Error && error.name === "AbortError") {
        errors.push({
          type: "timeout",
          message: `Request timed out after ${timeout}ms`,
        });
        responseTime = timeout;
      } else {
        errors.push(createAPIError(error));
      }
    }

    const isSlowEndpoint = responseTime > this.config.responseTimeThresholdMs;

    return {
      endpoint: fullUrl,
      method,
      responseTime,
      statusCode,
      payloadSize,
      isSlowEndpoint,
      errors,
    };
  }

  /**
   * Test an endpoint with invalid input to verify error handling
   * Requirements: 3.3
   */
  async testWithInvalidInput(
    url: string,
    invalidData: unknown
  ): Promise<APITestResult> {
    const result = await this.testEndpoint(url, {
      method: "POST",
      body: invalidData,
    });

    // Classify the response based on status code and error handling
    this.classifyInvalidInputResponse(result, invalidData);

    return result;
  }

  /**
   * Classify the response from an invalid input test
   * Requirements: 3.3
   */
  private classifyInvalidInputResponse(
    result: APITestResult,
    invalidData: unknown
  ): void {
    const { statusCode } = result;

    // If we got a successful response with invalid data, that's a validation issue
    if (statusCode >= 200 && statusCode < 300) {
      const hasExistingValidationError = result.errors.some(
        (e) => e.type === "validation"
      );
      if (!hasExistingValidationError) {
        result.errors.push({
          type: "validation",
          message: `Endpoint accepted invalid input without error: ${this.describeInvalidData(
            invalidData
          )}`,
          statusCode,
        });
      }
      return;
    }

    // 400-level errors are expected for invalid input - this is correct behavior
    if (statusCode >= 400 && statusCode < 500) {
      // This is actually the expected behavior - endpoint correctly rejected invalid input
      // We don't add an error here, but we can add metadata about the rejection
      return;
    }

    // 500-level errors indicate the server didn't handle invalid input gracefully
    if (statusCode >= 500) {
      const hasServerError = result.errors.some((e) => e.type === "server");
      if (!hasServerError) {
        result.errors.push({
          type: "server",
          message: `Server error when handling invalid input: ${this.describeInvalidData(
            invalidData
          )}`,
          statusCode,
        });
      }
    }
  }

  /**
   * Generate a description of invalid data for error messages
   */
  private describeInvalidData(data: unknown): string {
    if (data === null) return "null";
    if (data === undefined) return "undefined";
    if (typeof data === "string") {
      if (data.length === 0) return "empty string";
      if (data.length > 50) return `string (${data.length} chars)`;
      return `"${data}"`;
    }
    if (typeof data === "number") {
      if (Number.isNaN(data)) return "NaN";
      if (!Number.isFinite(data)) return "Infinity";
      return String(data);
    }
    if (typeof data === "boolean") return String(data);
    if (Array.isArray(data)) return `array (${data.length} items)`;
    if (typeof data === "object") {
      const keys = Object.keys(data as object);
      return `object with keys: ${keys.slice(0, 5).join(", ")}${
        keys.length > 5 ? "..." : ""
      }`;
    }
    return typeof data;
  }

  /**
   * Test an endpoint with multiple types of invalid inputs
   * Requirements: 3.3
   */
  async testWithMultipleInvalidInputs(
    url: string,
    invalidInputs: unknown[]
  ): Promise<APITestResult[]> {
    const results: APITestResult[] = [];

    for (const invalidData of invalidInputs) {
      const result = await this.testWithInvalidInput(url, invalidData);
      results.push(result);
    }

    return results;
  }

  /**
   * Generate common invalid inputs for testing
   * Requirements: 3.3
   */
  static generateCommonInvalidInputs(): unknown[] {
    return [
      null,
      undefined,
      "",
      "   ",
      {},
      [],
      { invalid: true },
      "not-json",
      12345,
      true,
      { id: "not-a-number" },
      { email: "invalid-email" },
      { date: "not-a-date" },
      { nested: { deeply: { invalid: null } } },
      Array(1000).fill("spam"),
      "x".repeat(10000),
    ];
  }

  /**
   * Test multiple endpoints in batch
   * Requirements: 3.1
   */
  async batchTest(endpoints: EndpointConfig[]): Promise<BatchTestResult> {
    const startTime = Date.now();
    const results: APITestResult[] = [];

    for (const endpoint of endpoints) {
      const result = await this.testEndpoint(endpoint.url, endpoint.options);

      // Check expected status if provided
      if (
        endpoint.expectedStatus !== undefined &&
        result.statusCode !== endpoint.expectedStatus
      ) {
        result.errors.push({
          type: "validation",
          message: `Expected status ${endpoint.expectedStatus}, got ${result.statusCode}`,
          statusCode: result.statusCode,
        });
      }

      results.push(result);
    }

    const endTime = Date.now();
    const summary = this.calculateSummary(results);

    return {
      results,
      summary,
      startTime,
      endTime,
      duration: endTime - startTime,
    };
  }

  /**
   * Calculate summary statistics from test results
   */
  private calculateSummary(results: APITestResult[]): APITestSummary {
    if (results.length === 0) {
      return {
        totalEndpoints: 0,
        successfulTests: 0,
        failedTests: 0,
        slowEndpoints: 0,
        averageResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        totalErrors: 0,
      };
    }

    const responseTimes = results.map((r) => r.responseTime);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    const successfulTests = results.filter(
      (r) => r.errors.length === 0 && r.statusCode >= 200 && r.statusCode < 300
    ).length;
    const slowEndpoints = results.filter((r) => r.isSlowEndpoint).length;

    return {
      totalEndpoints: results.length,
      successfulTests,
      failedTests: results.length - successfulTests,
      slowEndpoints,
      averageResponseTime:
        responseTimes.reduce((sum, t) => sum + t, 0) / results.length,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      totalErrors,
    };
  }

  /**
   * Get slow endpoints from test results
   * Requirements: 3.2
   */
  getSlowEndpoints(results: APITestResult[], thresholdMs?: number): string[] {
    const threshold = thresholdMs ?? this.config.responseTimeThresholdMs;
    return results
      .filter((r) => r.responseTime > threshold)
      .map((r) => r.endpoint);
  }

  /**
   * Generate a human-readable report from test results
   */
  generateReport(batchResult: BatchTestResult): string {
    const lines: string[] = [];
    const { summary, results, duration } = batchResult;

    lines.push("=".repeat(60));
    lines.push("API TEST REPORT");
    lines.push("=".repeat(60));
    lines.push("");

    // Summary
    lines.push("SUMMARY");
    lines.push("-".repeat(40));
    lines.push(`Total Endpoints Tested: ${summary.totalEndpoints}`);
    lines.push(`Successful: ${summary.successfulTests}`);
    lines.push(`Failed: ${summary.failedTests}`);
    lines.push(`Slow Endpoints: ${summary.slowEndpoints}`);
    lines.push(`Total Errors: ${summary.totalErrors}`);
    lines.push(`Total Duration: ${duration}ms`);
    lines.push("");

    // Response Time Stats
    lines.push("RESPONSE TIME STATISTICS");
    lines.push("-".repeat(40));
    lines.push(`Average: ${summary.averageResponseTime.toFixed(2)}ms`);
    lines.push(`Min: ${summary.minResponseTime.toFixed(2)}ms`);
    lines.push(`Max: ${summary.maxResponseTime.toFixed(2)}ms`);
    lines.push("");

    // Individual Results
    lines.push("ENDPOINT RESULTS");
    lines.push("-".repeat(40));
    for (const result of results) {
      const status = result.errors.length === 0 ? "✓" : "✗";
      const slow = result.isSlowEndpoint ? " [SLOW]" : "";
      lines.push(`${status} ${result.method} ${result.endpoint}${slow}`);
      lines.push(
        `   Status: ${result.statusCode}, Time: ${result.responseTime.toFixed(
          2
        )}ms, Size: ${formatBytes(result.payloadSize)}`
      );

      if (result.errors.length > 0) {
        for (const error of result.errors) {
          lines.push(`   ⚠ [${error.type.toUpperCase()}] ${error.message}`);
        }
      }
    }
    lines.push("");

    // Slow Endpoints
    const slowEndpoints = results.filter((r) => r.isSlowEndpoint);
    if (slowEndpoints.length > 0) {
      lines.push("SLOW ENDPOINTS (>${this.config.responseTimeThresholdMs}ms)");
      lines.push("-".repeat(40));
      for (const result of slowEndpoints) {
        lines.push(
          `• ${result.method} ${result.endpoint}: ${result.responseTime.toFixed(
            2
          )}ms`
        );
      }
      lines.push("");
    }

    // Errors
    const errorResults = results.filter((r) => r.errors.length > 0);
    if (errorResults.length > 0) {
      lines.push("ERRORS");
      lines.push("-".repeat(40));
      for (const result of errorResults) {
        lines.push(`${result.method} ${result.endpoint}:`);
        for (const error of result.errors) {
          lines.push(`  • [${error.type}] ${error.message}`);
        }
      }
      lines.push("");
    }

    lines.push("=".repeat(60));

    return lines.join("\n");
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Create an APITester instance with default config
 */
export function createAPITester(config?: Partial<APITesterConfig>): APITester {
  return new APITester(config);
}
