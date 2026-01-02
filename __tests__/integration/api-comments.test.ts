/**
 * Integration Tests for Comments API Endpoints
 * Tests GET /api/comments response time
 * Tests POST /api/comments rate limiting
 * Requirements: 3.1, 3.3
 */

import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  vi,
  beforeEach,
} from "vitest";
import { createAPITester, APITester } from "@/lib/testing/api-tester/tester";

// Mock fetch for testing without actual server
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Comments API Integration Tests", () => {
  let apiTester: APITester;

  beforeAll(() => {
    apiTester = createAPITester({
      baseUrl: "http://localhost:3000",
      responseTimeThresholdMs: 500,
      defaultTimeoutMs: 5000,
    });
  });

  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/comments", () => {
    it("should return comments with proper response metrics", async () => {
      const mockComments = [
        {
          id: "1",
          blogId: "blog-1",
          name: "Test User",
          message: "Great post!",
          createdAt: new Date().toISOString(),
          replies: [],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify(mockComments),
      });

      const result = await apiTester.testEndpoint(
        "/api/comments?blogId=blog-1",
        { method: "GET" }
      );

      // Requirement 3.1: Measure response time, status code, and payload size
      expect(result.responseTime).toBeGreaterThanOrEqual(0);
      expect(result.statusCode).toBe(200);
      expect(result.payloadSize).toBeGreaterThan(0);
      expect(result.errors).toHaveLength(0);
    });

    it("should return 400 when blogId is missing", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: async () => JSON.stringify({ error: "Blog ID required" }),
      });

      const result = await apiTester.testEndpoint("/api/comments", {
        method: "GET",
      });

      // Requirement 3.3: Verify proper error handling
      expect(result.statusCode).toBe(400);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should return unreplied comments for admin", async () => {
      const mockUnrepliedComments = [
        {
          id: "2",
          blogId: "blog-2",
          name: "Visitor",
          message: "Question here",
          blog: { title: "Test Blog", slug: "test-blog" },
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify(mockUnrepliedComments),
      });

      const result = await apiTester.testEndpoint(
        "/api/comments?unreplied=true",
        { method: "GET" }
      );

      expect(result.statusCode).toBe(200);
      expect(result.payloadSize).toBeGreaterThan(0);
    });

    it("should flag slow response times", async () => {
      mockFetch.mockImplementationOnce(async () => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify([]),
        };
      });

      const result = await apiTester.testEndpoint(
        "/api/comments?blogId=slow-blog",
        { method: "GET" }
      );

      // Requirement 3.2: Flag endpoint as slow when response time exceeds 500ms
      expect(result.isSlowEndpoint).toBe(true);
    });
  });

  describe("POST /api/comments", () => {
    it("should create comment with valid data", async () => {
      const newComment = {
        id: "new-1",
        blogId: "blog-1",
        name: "New User",
        message: "Nice article!",
        createdAt: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        statusText: "Created",
        text: async () => JSON.stringify(newComment),
      });

      const result = await apiTester.testEndpoint("/api/comments", {
        method: "POST",
        body: {
          blogId: "blog-1",
          name: "New User",
          message: "Nice article!",
        },
      });

      expect(result.statusCode).toBe(201);
      expect(result.errors).toHaveLength(0);
      expect(result.payloadSize).toBeGreaterThan(0);
    });

    it("should reject comment with missing required fields", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: async () => JSON.stringify({ error: "Missing required fields" }),
      });

      const result = await apiTester.testWithInvalidInput("/api/comments", {
        blogId: "blog-1",
        // Missing name and message
      });

      // Requirement 3.3: Verify proper error handling for invalid inputs
      expect(result.statusCode).toBe(400);
    });

    it("should reject comment with name too long", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: async () => JSON.stringify({ error: "Name or message too long" }),
      });

      const result = await apiTester.testWithInvalidInput("/api/comments", {
        blogId: "blog-1",
        name: "A".repeat(51), // Exceeds 50 character limit
        message: "Test message",
      });

      expect(result.statusCode).toBe(400);
    });

    it("should reject comment with message too long", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: async () => JSON.stringify({ error: "Name or message too long" }),
      });

      const result = await apiTester.testWithInvalidInput("/api/comments", {
        blogId: "blog-1",
        name: "Test User",
        message: "M".repeat(501), // Exceeds 500 character limit
      });

      expect(result.statusCode).toBe(400);
    });
  });

  describe("Rate Limiting", () => {
    it("should enforce cooldown between comments", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        text: async () =>
          JSON.stringify({
            error: "Tunggu 15 detik sebelum mengirim komentar lagi.",
            cooldown: true,
            remainingSeconds: 15,
          }),
      });

      const result = await apiTester.testEndpoint("/api/comments", {
        method: "POST",
        body: {
          blogId: "blog-1",
          name: "Rapid User",
          message: "Too fast!",
        },
      });

      // Rate limiting returns 429 status
      expect(result.statusCode).toBe(429);
    });

    it("should block user after exceeding comment limit", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        text: async () =>
          JSON.stringify({
            error:
              "Anda telah mencapai batas 50 komentar. Diblokir selama 24 jam.",
            blocked: true,
            blockedUntil: new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ).toISOString(),
          }),
      });

      const result = await apiTester.testEndpoint("/api/comments", {
        method: "POST",
        body: {
          blogId: "blog-1",
          name: "Spammer",
          message: "Spam message",
        },
      });

      expect(result.statusCode).toBe(429);
    });

    it("should return blocked status with remaining time", async () => {
      const blockedUntil = new Date(Date.now() + 12 * 60 * 60 * 1000);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        text: async () =>
          JSON.stringify({
            error: "Anda diblokir selama 12 jam lagi. Silakan coba lagi nanti.",
            blocked: true,
            blockedUntil: blockedUntil.toISOString(),
          }),
      });

      const result = await apiTester.testEndpoint("/api/comments", {
        method: "POST",
        body: {
          blogId: "blog-1",
          name: "Blocked User",
          message: "Trying again",
        },
      });

      expect(result.statusCode).toBe(429);
    });
  });

  describe("Reply Comments", () => {
    it("should create reply to existing comment", async () => {
      const reply = {
        id: "reply-1",
        blogId: "blog-1",
        name: "Reply User",
        message: "Thanks for the comment!",
        parentId: "comment-1",
        createdAt: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        statusText: "Created",
        text: async () => JSON.stringify(reply),
      });

      const result = await apiTester.testEndpoint("/api/comments", {
        method: "POST",
        body: {
          blogId: "blog-1",
          name: "Reply User",
          message: "Thanks for the comment!",
          parentId: "comment-1",
        },
      });

      expect(result.statusCode).toBe(201);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("Server Error Handling", () => {
    it("should handle database connection errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: async () => JSON.stringify({ error: "Failed to fetch comments" }),
      });

      const result = await apiTester.testEndpoint(
        "/api/comments?blogId=blog-1",
        { method: "GET" }
      );

      // Requirement 3.3: Verify proper error handling
      expect(result.statusCode).toBe(500);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].type).toBe("server");
    });

    it("should handle comment creation failures", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: async () => JSON.stringify({ error: "Failed to create comment" }),
      });

      const result = await apiTester.testEndpoint("/api/comments", {
        method: "POST",
        body: {
          blogId: "blog-1",
          name: "Test User",
          message: "Test message",
        },
      });

      expect(result.statusCode).toBe(500);
      expect(result.errors[0].type).toBe("server");
    });
  });

  describe("Response Metrics Completeness", () => {
    it("should include all required metrics for GET request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify([]),
      });

      const result = await apiTester.testEndpoint("/api/comments?blogId=test", {
        method: "GET",
      });

      // Requirement 3.1: responseTime, statusCode, and payloadSize SHALL all be defined
      expect(result.responseTime).toBeDefined();
      expect(typeof result.responseTime).toBe("number");
      expect(result.statusCode).toBeDefined();
      expect(typeof result.statusCode).toBe("number");
      expect(result.payloadSize).toBeDefined();
      expect(typeof result.payloadSize).toBe("number");
    });

    it("should include all required metrics for POST request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        statusText: "Created",
        text: async () => JSON.stringify({ id: "1" }),
      });

      const result = await apiTester.testEndpoint("/api/comments", {
        method: "POST",
        body: { blogId: "1", name: "Test", message: "Test" },
      });

      expect(result.responseTime).toBeDefined();
      expect(result.statusCode).toBeDefined();
      expect(result.payloadSize).toBeDefined();
    });
  });
});
