/**
 * API Tester Types
 * Defines interfaces for API testing results, errors, and configuration
 * Requirements: 3.1
 */

/**
 * Types of API errors that can occur during testing
 */
export type APIErrorType = "timeout" | "validation" | "server" | "network";

/**
 * HTTP methods supported for API testing
 */
export type HTTPMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

/**
 * An error that occurred during API testing
 */
export interface APIError {
  /** Type of error */
  type: APIErrorType;
  /** Human-readable error message */
  message: string;
  /** HTTP status code if applicable */
  statusCode?: number;
}

/**
 * Result of testing a single API endpoint
 */
export interface APITestResult {
  /** The endpoint URL that was tested */
  endpoint: string;
  /** HTTP method used */
  method: HTTPMethod;
  /** Response time in milliseconds */
  responseTime: number;
  /** HTTP status code returned */
  statusCode: number;
  /** Response payload size in bytes */
  payloadSize: number;
  /** Whether this endpoint is considered slow (>500ms) */
  isSlowEndpoint: boolean;
  /** Any errors that occurred during testing */
  errors: APIError[];
}

/**
 * Options for making an API request
 */
export interface RequestOptions {
  /** HTTP method (default: GET) */
  method?: HTTPMethod;
  /** Request headers */
  headers?: Record<string, string>;
  /** Request body (for POST, PUT, PATCH) */
  body?: unknown;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Configuration for an endpoint to test
 */
export interface EndpointConfig {
  /** Endpoint URL */
  url: string;
  /** Request options */
  options?: RequestOptions;
  /** Expected status code (for validation) */
  expectedStatus?: number;
  /** Description of the endpoint */
  description?: string;
}

/**
 * Configuration options for the API tester
 */
export interface APITesterConfig {
  /** Base URL for relative endpoints */
  baseUrl: string;
  /** Response time threshold in ms for marking as slow (default: 500ms) */
  responseTimeThresholdMs: number;
  /** Default request timeout in ms (default: 30000ms) */
  defaultTimeoutMs: number;
  /** Default headers to include in all requests */
  defaultHeaders: Record<string, string>;
}

/**
 * Default configuration values
 */
export const DEFAULT_API_TESTER_CONFIG: APITesterConfig = {
  baseUrl: "",
  responseTimeThresholdMs: 500,
  defaultTimeoutMs: 30000,
  defaultHeaders: {
    "Content-Type": "application/json",
  },
};

/**
 * Summary of batch API test results
 */
export interface APITestSummary {
  /** Total number of endpoints tested */
  totalEndpoints: number;
  /** Number of successful tests */
  successfulTests: number;
  /** Number of failed tests */
  failedTests: number;
  /** Number of slow endpoints */
  slowEndpoints: number;
  /** Average response time in ms */
  averageResponseTime: number;
  /** Fastest response time in ms */
  minResponseTime: number;
  /** Slowest response time in ms */
  maxResponseTime: number;
  /** Total errors encountered */
  totalErrors: number;
}

/**
 * Result of batch testing multiple endpoints
 */
export interface BatchTestResult {
  /** Individual test results */
  results: APITestResult[];
  /** Summary statistics */
  summary: APITestSummary;
  /** Timestamp when testing started */
  startTime: number;
  /** Timestamp when testing completed */
  endTime: number;
  /** Total duration in milliseconds */
  duration: number;
}

/**
 * Interface for the APITester
 */
export interface IAPITester {
  /**
   * Test a single API endpoint
   * @param url The endpoint URL to test
   * @param options Request options
   * @returns Test result with timing, status, and errors
   */
  testEndpoint(url: string, options?: RequestOptions): Promise<APITestResult>;

  /**
   * Test an endpoint with invalid input to verify error handling
   * @param url The endpoint URL to test
   * @param invalidData Invalid data to send
   * @returns Test result with error information
   */
  testWithInvalidInput(
    url: string,
    invalidData: unknown
  ): Promise<APITestResult>;

  /**
   * Test multiple endpoints in batch
   * @param endpoints Array of endpoint configurations
   * @returns Batch test results with summary
   */
  batchTest(endpoints: EndpointConfig[]): Promise<BatchTestResult>;

  /**
   * Get slow endpoints from test results
   * @param results Array of test results
   * @param thresholdMs Optional custom threshold
   * @returns Array of slow endpoint URLs
   */
  getSlowEndpoints(results: APITestResult[], thresholdMs?: number): string[];

  /**
   * Generate a human-readable report from test results
   * @param batchResult Batch test results
   * @returns Formatted report string
   */
  generateReport(batchResult: BatchTestResult): string;
}
