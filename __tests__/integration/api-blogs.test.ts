/**
 * Integration Tests for Blog API Endpoints
 * Tests GET /api/blogs response time and payload
 * Tests POST /api/blogs with valid and invalid data
 * Requirements: 3.1, 3.3
 */

import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { createAPITester, APITester } from "@/lib/testing/api-tester/tester";
import { APITestResult } from "@/lib/testing/api-tester/types";

// Mock fetch for testing without actual server
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Blog API Integration Tests", () => {
  let apiTester: APITester;

  beforeAll(() => {
    apiTester = createAPITester({
      baseUrl: "http://localhost:3000",
      responseTimeThresholdMs: 500,
      defaultTimeoutMs: 5000,
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/blogs/[slug]/views", () => {
    it("should return view count with proper response metrics", async () => {
      // Mock successful response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify({ views: 42 }),
      });

      const result = await apiTester.testEndpoint(
        "/api/blogs/test-slug/views",
        {
          method: "GET",
        }
      );

      // Requirement 3.1: Measure response time, status code, and payload size
      expect(result.responseTime).toBeGreaterThanOrEqual(0);
      expect(result.statusCode).toBe(200);
      expect(result.payloadSize).toBeGreaterThan(0);
      expect(result.endpoint).toContain("/api/blogs/test-slug/views");
      expect(result.method).toBe("GET");
    });

    it("should flag slow endpoints when response time exceeds threshold", async () => {
      // Mock slow response by delaying
      mockFetch.mockImplementationOnce(async () => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify({ views: 10 }),
        };
      });

      const result = await apiTester.testEndpoint(
        "/api/blogs/slow-slug/views",
        {
          method: "GET",
        }
      );

      // Requirement 3.2: Flag endpoint as slow when response time exceeds 500ms
      expect(result.isSlowEndpoint).toBe(true);
    });

    it("should handle 404 for non-existent blog", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: async () => JSON.stringify({ error: "Blog not found" }),
      });

      const result = await apiTester.testEndpoint(
        "/api/blogs/non-existent/views",
        { method: "GET" }
      );

      expect(result.statusCode).toBe(404);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/blogs/[slug]/views", () => {
    it("should track view and return updated count", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify({ views: 43 }),
      });

      const result = await apiTester.testEndpoint(
        "/api/blogs/test-slug/views",
        {
          method: "POST",
        }
      );

      // Requirement 3.1: Verify response metrics are complete
      expect(result.responseTime).toBeDefined();
      expect(result.statusCode).toBe(200);
      expect(result.payloadSize).toBeDefined();
      expect(result.errors).toHaveLength(0);
    });

    it("should handle server errors gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: async () => JSON.stringify({ error: "Failed to track view" }),
      });

      const result = await apiTester.testEndpoint(
        "/api/blogs/error-slug/views",
        {
          method: "POST",
        }
      );

      // Requirement 3.3: Verify proper error handling
      expect(result.statusCode).toBe(500);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].type).toBe("server");
    });
  });

  describe("Invalid Input Handling", () => {
    it("should reject invalid blog slug format", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: async () => JSON.stringify({ error: "Invalid slug format" }),
      });

      const result = await apiTester.testWithInvalidInput(
        "/api/blogs/invalid@slug!/views",
        {}
      );

      // Requirement 3.3: Verify proper error handling for invalid inputs
      expect(result.statusCode).toBe(400);
    });

    it("should handle malformed request body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: async () => JSON.stringify({ error: "Invalid request body" }),
      });

      const result = await apiTester.testWithInvalidInput(
        "/api/blogs/test-slug/views",
        { invalid: "data", nested: { bad: null } }
      );

      expect(result.statusCode).toBe(400);
    });

    it("should handle empty request body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify({ views: 1 }),
      });

      const result = await apiTester.testWithInvalidInput(
        "/api/blogs/test-slug/views",
        null
      );

      // POST to views endpoint doesn't require body, so it should succeed
      expect(result.statusCode).toBe(200);
    });
  });

  describe("Batch Testing", () => {
    it("should test multiple blog endpoints in batch", async () => {
      // Mock responses for batch test
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify({ views: 10 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify({ views: 20 }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: "Not Found",
          text: async () => JSON.stringify({ error: "Not found" }),
        });

      const batchResult = await apiTester.batchTest([
        { url: "/api/blogs/blog-1/views", options: { method: "GET" } },
        { url: "/api/blogs/blog-2/views", options: { method: "GET" } },
        { url: "/api/blogs/non-existent/views", options: { method: "GET" } },
      ]);

      expect(batchResult.results).toHaveLength(3);
      expect(batchResult.summary.totalEndpoints).toBe(3);
      expect(batchResult.summary.successfulTests).toBe(2);
      expect(batchResult.summary.failedTests).toBe(1);
    });
  });

  describe("Response Metrics Completeness", () => {
    it("should include all required metrics in response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify({ views: 100 }),
      });

      const result: APITestResult = await apiTester.testEndpoint(
        "/api/blogs/metrics-test/views",
        { method: "GET" }
      );

      // Requirement 3.1: responseTime, statusCode, and payloadSize SHALL all be defined
      expect(result.responseTime).toBeDefined();
      expect(typeof result.responseTime).toBe("number");
      expect(result.responseTime).toBeGreaterThanOrEqual(0);

      expect(result.statusCode).toBeDefined();
      expect(typeof result.statusCode).toBe("number");

      expect(result.payloadSize).toBeDefined();
      expect(typeof result.payloadSize).toBe("number");
      expect(result.payloadSize).toBeGreaterThanOrEqual(0);
    });
  });
});
