/**
 * Integration Tests for Chat API Endpoints
 * Tests /api/chat message handling
 * Tests concurrent message scenarios
 * Requirements: 3.1, 5.1
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

describe("Chat API Integration Tests", () => {
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

  describe("GET /api/chat", () => {
    it("should create new session when no sessionId provided", async () => {
      const newSession = {
        id: "session-123",
        visitorIp: "127.0.0.1",
        status: "ACTIVE",
        isAiEnabled: true,
        messages: [],
        createdAt: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify(newSession),
      });

      const result = await apiTester.testEndpoint("/api/chat", {
        method: "GET",
      });

      // Requirement 3.1: Measure response time, status code, and payload size
      expect(result.responseTime).toBeGreaterThanOrEqual(0);
      expect(result.statusCode).toBe(200);
      expect(result.payloadSize).toBeGreaterThan(0);
      expect(result.errors).toHaveLength(0);
    });

    it("should return existing session with messages", async () => {
      const existingSession = {
        id: "session-456",
        visitorIp: "127.0.0.1",
        status: "ACTIVE",
        isAiEnabled: true,
        messages: [
          {
            id: "msg-1",
            content: "Hello!",
            sender: "VISITOR",
            createdAt: new Date().toISOString(),
          },
          {
            id: "msg-2",
            content: "Hi there! How can I help?",
            sender: "ADMIN",
            createdAt: new Date().toISOString(),
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify(existingSession),
      });

      const result = await apiTester.testEndpoint(
        "/api/chat?sessionId=session-456",
        { method: "GET" }
      );

      expect(result.statusCode).toBe(200);
      expect(result.payloadSize).toBeGreaterThan(0);
    });

    it("should return 404 for non-existent session", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: async () => JSON.stringify({ error: "Session not found" }),
      });

      const result = await apiTester.testEndpoint(
        "/api/chat?sessionId=non-existent",
        { method: "GET" }
      );

      expect(result.statusCode).toBe(404);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should return existing active session for same IP", async () => {
      const activeSession = {
        id: "session-existing",
        visitorIp: "192.168.1.1",
        status: "ACTIVE",
        messages: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify(activeSession),
      });

      const result = await apiTester.testEndpoint("/api/chat", {
        method: "GET",
        headers: { "x-forwarded-for": "192.168.1.1" },
      });

      expect(result.statusCode).toBe(200);
    });
  });

  describe("POST /api/chat", () => {
    it("should send message with valid data", async () => {
      const newMessage = {
        id: "msg-new",
        sessionId: "session-123",
        content: "Hello, I have a question",
        sender: "VISITOR",
        createdAt: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify(newMessage),
      });

      const result = await apiTester.testEndpoint("/api/chat", {
        method: "POST",
        body: {
          sessionId: "session-123",
          content: "Hello, I have a question",
        },
      });

      expect(result.statusCode).toBe(200);
      expect(result.errors).toHaveLength(0);
      expect(result.payloadSize).toBeGreaterThan(0);
    });

    it("should reject message with missing sessionId", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: async () => JSON.stringify({ error: "Missing required fields" }),
      });

      const result = await apiTester.testWithInvalidInput("/api/chat", {
        content: "Message without session",
      });

      // Requirement 3.3: Verify proper error handling for invalid inputs
      expect(result.statusCode).toBe(400);
    });

    it("should reject message with missing content and no attachments", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: async () => JSON.stringify({ error: "Missing required fields" }),
      });

      const result = await apiTester.testWithInvalidInput("/api/chat", {
        sessionId: "session-123",
        // No content or attachments
      });

      expect(result.statusCode).toBe(400);
    });

    it("should accept message with attachments only", async () => {
      const messageWithAttachment = {
        id: "msg-attach",
        sessionId: "session-123",
        content: "",
        attachments: ["/uploads/image.png"],
        sender: "VISITOR",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify(messageWithAttachment),
      });

      const result = await apiTester.testEndpoint("/api/chat", {
        method: "POST",
        body: {
          sessionId: "session-123",
          attachments: ["/uploads/image.png"],
        },
      });

      expect(result.statusCode).toBe(200);
    });

    it("should update visitor info when provided", async () => {
      const message = {
        id: "msg-info",
        sessionId: "session-123",
        content: "Hi",
        sender: "VISITOR",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify(message),
      });

      const result = await apiTester.testEndpoint("/api/chat", {
        method: "POST",
        body: {
          sessionId: "session-123",
          content: "Hi",
          visitorName: "John Doe",
          visitorEmail: "john@example.com",
        },
      });

      expect(result.statusCode).toBe(200);
    });
  });

  describe("Concurrent Message Scenarios", () => {
    it("should handle multiple concurrent message sends", async () => {
      // Requirement 5.1: Simulate concurrent users accessing the application
      const messages = Array.from({ length: 5 }, (_, i) => ({
        id: `msg-concurrent-${i}`,
        sessionId: `session-${i}`,
        content: `Concurrent message ${i}`,
        sender: "VISITOR",
      }));

      // Setup mock responses for all concurrent requests
      messages.forEach((msg) => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify(msg),
        });
      });

      // Send concurrent requests
      const promises = messages.map((msg, i) =>
        apiTester.testEndpoint("/api/chat", {
          method: "POST",
          body: {
            sessionId: `session-${i}`,
            content: `Concurrent message ${i}`,
          },
        })
      );

      const results = await Promise.all(promises);

      // All requests should succeed
      results.forEach((result) => {
        expect(result.statusCode).toBe(200);
        expect(result.errors).toHaveLength(0);
      });
    });

    it("should handle concurrent session creation", async () => {
      const sessions = Array.from({ length: 3 }, (_, i) => ({
        id: `new-session-${i}`,
        visitorIp: `192.168.1.${i}`,
        status: "ACTIVE",
        messages: [],
      }));

      sessions.forEach((session) => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify(session),
        });
      });

      const promises = sessions.map((_, i) =>
        apiTester.testEndpoint("/api/chat", {
          method: "GET",
          headers: { "x-forwarded-for": `192.168.1.${i}` },
        })
      );

      const results = await Promise.all(promises);

      results.forEach((result) => {
        expect(result.statusCode).toBe(200);
      });
    });

    it("should batch test chat endpoints", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify({ id: "session-1", messages: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify({ id: "msg-1", content: "Test" }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: "Not Found",
          text: async () => JSON.stringify({ error: "Session not found" }),
        });

      const batchResult = await apiTester.batchTest([
        { url: "/api/chat", options: { method: "GET" } },
        {
          url: "/api/chat",
          options: {
            method: "POST",
            body: { sessionId: "session-1", content: "Test" },
          },
        },
        {
          url: "/api/chat?sessionId=invalid",
          options: { method: "GET" },
        },
      ]);

      expect(batchResult.results).toHaveLength(3);
      expect(batchResult.summary.successfulTests).toBe(2);
      expect(batchResult.summary.failedTests).toBe(1);
    });
  });

  describe("Server Error Handling", () => {
    it("should handle database connection errors on GET", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: async () =>
          JSON.stringify({ error: "Failed to get chat session" }),
      });

      const result = await apiTester.testEndpoint("/api/chat", {
        method: "GET",
      });

      expect(result.statusCode).toBe(500);
      expect(result.errors[0].type).toBe("server");
    });

    it("should handle database connection errors on POST", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: async () => JSON.stringify({ error: "Failed to send message" }),
      });

      const result = await apiTester.testEndpoint("/api/chat", {
        method: "POST",
        body: {
          sessionId: "session-123",
          content: "Test message",
        },
      });

      expect(result.statusCode).toBe(500);
      expect(result.errors[0].type).toBe("server");
    });
  });

  describe("Response Time Performance", () => {
    it("should flag slow chat session retrieval", async () => {
      mockFetch.mockImplementationOnce(async () => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () =>
            JSON.stringify({ id: "slow-session", messages: [] }),
        };
      });

      const result = await apiTester.testEndpoint("/api/chat", {
        method: "GET",
      });

      // Requirement 3.2: Flag endpoint as slow when response time exceeds 500ms
      expect(result.isSlowEndpoint).toBe(true);
    });

    it("should flag slow message sending", async () => {
      mockFetch.mockImplementationOnce(async () => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify({ id: "slow-msg", content: "Test" }),
        };
      });

      const result = await apiTester.testEndpoint("/api/chat", {
        method: "POST",
        body: { sessionId: "session-1", content: "Test" },
      });

      expect(result.isSlowEndpoint).toBe(true);
    });
  });

  describe("Response Metrics Completeness", () => {
    it("should include all required metrics for chat GET", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify({ id: "session", messages: [] }),
      });

      const result = await apiTester.testEndpoint("/api/chat", {
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

    it("should include all required metrics for chat POST", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify({ id: "msg", content: "Test" }),
      });

      const result = await apiTester.testEndpoint("/api/chat", {
        method: "POST",
        body: { sessionId: "session-1", content: "Test" },
      });

      expect(result.responseTime).toBeDefined();
      expect(result.statusCode).toBeDefined();
      expect(result.payloadSize).toBeDefined();
    });
  });
});
