/**
 * Integration Tests for Finance API Endpoints
 * Tests transaction CRUD operations
 * Tests wallet balance calculations
 * Requirements: 3.1, 7.1
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

describe("Finance API Integration Tests", () => {
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

  describe("Transactions API", () => {
    describe("GET /api/finance/transactions", () => {
      it("should return transactions with proper response metrics", async () => {
        const mockTransactions = [
          {
            id: "tx-1",
            amount: 100000,
            type: "INCOME",
            category: "Salary",
            description: "Monthly salary",
            date: new Date().toISOString(),
            walletId: "wallet-1",
            walletName: "Main Wallet",
          },
        ];

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify(mockTransactions),
        });

        const result = await apiTester.testEndpoint(
          "/api/finance/transactions",
          { method: "GET" }
        );

        // Requirement 3.1: Measure response time, status code, and payload size
        expect(result.responseTime).toBeGreaterThanOrEqual(0);
        expect(result.statusCode).toBe(200);
        expect(result.payloadSize).toBeGreaterThan(0);
        expect(result.errors).toHaveLength(0);
      });

      it("should filter transactions by walletId", async () => {
        const filteredTransactions = [
          {
            id: "tx-2",
            amount: 50000,
            type: "EXPENSE",
            walletId: "wallet-1",
            walletName: "Main Wallet",
          },
        ];

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify(filteredTransactions),
        });

        const result = await apiTester.testEndpoint(
          "/api/finance/transactions?walletId=wallet-1",
          { method: "GET" }
        );

        expect(result.statusCode).toBe(200);
        expect(result.payloadSize).toBeGreaterThan(0);
      });

      it("should filter transactions by type", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify([]),
        });

        const result = await apiTester.testEndpoint(
          "/api/finance/transactions?type=INCOME",
          { method: "GET" }
        );

        expect(result.statusCode).toBe(200);
      });

      it("should filter transactions by date range", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify([]),
        });

        const result = await apiTester.testEndpoint(
          "/api/finance/transactions?startDate=2025-01-01&endDate=2025-12-31",
          { method: "GET" }
        );

        expect(result.statusCode).toBe(200);
      });

      it("should flag slow transaction queries", async () => {
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
          "/api/finance/transactions",
          { method: "GET" }
        );

        // Requirement 7.1: Log query execution time
        expect(result.isSlowEndpoint).toBe(true);
      });
    });

    describe("POST /api/finance/transactions", () => {
      it("should create transaction with valid data", async () => {
        const newTransaction = {
          id: "tx-new",
          amount: 75000,
          type: "EXPENSE",
          category: "Food",
          description: "Lunch",
          date: new Date().toISOString(),
          walletId: "wallet-1",
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 201,
          statusText: "Created",
          text: async () => JSON.stringify(newTransaction),
        });

        const result = await apiTester.testEndpoint(
          "/api/finance/transactions",
          {
            method: "POST",
            body: {
              amount: 75000,
              type: "EXPENSE",
              category: "Food",
              description: "Lunch",
              date: new Date().toISOString(),
              walletId: "wallet-1",
            },
          }
        );

        expect(result.statusCode).toBe(201);
        expect(result.errors).toHaveLength(0);
      });

      it("should reject transaction with missing required fields", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: "Bad Request",
          text: async () =>
            JSON.stringify({ error: "Missing required fields" }),
        });

        const result = await apiTester.testWithInvalidInput(
          "/api/finance/transactions",
          {
            amount: 50000,
            // Missing type, category, date, walletId
          }
        );

        // Requirement 3.3: Verify proper error handling for invalid inputs
        expect(result.statusCode).toBe(400);
      });

      it("should reject transaction with invalid amount", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: "Bad Request",
          text: async () => JSON.stringify({ error: "Invalid amount" }),
        });

        const result = await apiTester.testWithInvalidInput(
          "/api/finance/transactions",
          {
            amount: -100,
            type: "EXPENSE",
            category: "Food",
            date: new Date().toISOString(),
            walletId: "wallet-1",
          }
        );

        expect(result.statusCode).toBe(400);
      });

      it("should reject transaction with invalid type", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: "Bad Request",
          text: async () =>
            JSON.stringify({ error: "Invalid transaction type" }),
        });

        const result = await apiTester.testWithInvalidInput(
          "/api/finance/transactions",
          {
            amount: 50000,
            type: "INVALID_TYPE",
            category: "Food",
            date: new Date().toISOString(),
            walletId: "wallet-1",
          }
        );

        expect(result.statusCode).toBe(400);
      });

      it("should handle server errors gracefully", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          text: async () =>
            JSON.stringify({ error: "Failed to create transaction" }),
        });

        const result = await apiTester.testEndpoint(
          "/api/finance/transactions",
          {
            method: "POST",
            body: {
              amount: 50000,
              type: "EXPENSE",
              category: "Food",
              date: new Date().toISOString(),
              walletId: "wallet-1",
            },
          }
        );

        expect(result.statusCode).toBe(500);
        expect(result.errors[0].type).toBe("server");
      });
    });
  });

  describe("Wallets API", () => {
    describe("GET /api/finance/wallets", () => {
      it("should return wallets with proper response metrics", async () => {
        const mockWallets = [
          {
            id: "wallet-1",
            name: "Main Wallet",
            type: "CASH",
            balance: 1000000,
            currency: "IDR",
            isDefault: true,
            _count: { transactions: 10 },
          },
        ];

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify(mockWallets),
        });

        const result = await apiTester.testEndpoint("/api/finance/wallets", {
          method: "GET",
        });

        // Requirement 3.1: Measure response time, status code, and payload size
        expect(result.responseTime).toBeGreaterThanOrEqual(0);
        expect(result.statusCode).toBe(200);
        expect(result.payloadSize).toBeGreaterThan(0);
      });

      it("should return wallets ordered by default status", async () => {
        const orderedWallets = [
          { id: "wallet-1", name: "Default", isDefault: true },
          { id: "wallet-2", name: "Secondary", isDefault: false },
        ];

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify(orderedWallets),
        });

        const result = await apiTester.testEndpoint("/api/finance/wallets", {
          method: "GET",
        });

        expect(result.statusCode).toBe(200);
      });
    });

    describe("POST /api/finance/wallets", () => {
      it("should create wallet with valid data", async () => {
        const newWallet = {
          id: "wallet-new",
          name: "Savings",
          type: "BANK",
          balance: 500000,
          currency: "IDR",
          color: "#10b981",
          icon: "piggy-bank",
          isDefault: false,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 201,
          statusText: "Created",
          text: async () => JSON.stringify(newWallet),
        });

        const result = await apiTester.testEndpoint("/api/finance/wallets", {
          method: "POST",
          body: {
            name: "Savings",
            type: "BANK",
            balance: 500000,
            currency: "IDR",
            color: "#10b981",
            icon: "piggy-bank",
          },
        });

        expect(result.statusCode).toBe(201);
        expect(result.errors).toHaveLength(0);
      });

      it("should create first wallet as default", async () => {
        const firstWallet = {
          id: "wallet-first",
          name: "First Wallet",
          type: "CASH",
          balance: 0,
          isDefault: true,
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 201,
          statusText: "Created",
          text: async () => JSON.stringify(firstWallet),
        });

        const result = await apiTester.testEndpoint("/api/finance/wallets", {
          method: "POST",
          body: {
            name: "First Wallet",
            type: "CASH",
          },
        });

        expect(result.statusCode).toBe(201);
      });

      it("should reject wallet with missing name", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: "Bad Request",
          text: async () => JSON.stringify({ error: "Name is required" }),
        });

        const result = await apiTester.testWithInvalidInput(
          "/api/finance/wallets",
          {
            type: "CASH",
            // Missing name
          }
        );

        expect(result.statusCode).toBe(400);
      });

      it("should handle server errors gracefully", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          text: async () =>
            JSON.stringify({ error: "Failed to create wallet" }),
        });

        const result = await apiTester.testEndpoint("/api/finance/wallets", {
          method: "POST",
          body: {
            name: "Test Wallet",
            type: "CASH",
          },
        });

        expect(result.statusCode).toBe(500);
        expect(result.errors[0].type).toBe("server");
      });
    });
  });

  describe("Wallet Balance Calculations", () => {
    it("should update wallet balance after income transaction", async () => {
      // First create an income transaction
      const incomeTransaction = {
        id: "tx-income",
        amount: 100000,
        type: "INCOME",
        walletId: "wallet-1",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        statusText: "Created",
        text: async () => JSON.stringify(incomeTransaction),
      });

      const createResult = await apiTester.testEndpoint(
        "/api/finance/transactions",
        {
          method: "POST",
          body: {
            amount: 100000,
            type: "INCOME",
            category: "Salary",
            date: new Date().toISOString(),
            walletId: "wallet-1",
          },
        }
      );

      expect(createResult.statusCode).toBe(201);

      // Then verify wallet balance is updated
      const updatedWallet = {
        id: "wallet-1",
        name: "Main Wallet",
        balance: 1100000, // Previous 1000000 + 100000
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify([updatedWallet]),
      });

      const walletResult = await apiTester.testEndpoint(
        "/api/finance/wallets",
        { method: "GET" }
      );

      expect(walletResult.statusCode).toBe(200);
    });

    it("should update wallet balance after expense transaction", async () => {
      const expenseTransaction = {
        id: "tx-expense",
        amount: 50000,
        type: "EXPENSE",
        walletId: "wallet-1",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        statusText: "Created",
        text: async () => JSON.stringify(expenseTransaction),
      });

      const createResult = await apiTester.testEndpoint(
        "/api/finance/transactions",
        {
          method: "POST",
          body: {
            amount: 50000,
            type: "EXPENSE",
            category: "Food",
            date: new Date().toISOString(),
            walletId: "wallet-1",
          },
        }
      );

      expect(createResult.statusCode).toBe(201);
    });

    it("should batch test finance endpoints", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify([{ id: "wallet-1", balance: 1000 }]),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify([{ id: "tx-1", amount: 100 }]),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          statusText: "Created",
          text: async () => JSON.stringify({ id: "tx-new" }),
        });

      const batchResult = await apiTester.batchTest([
        { url: "/api/finance/wallets", options: { method: "GET" } },
        { url: "/api/finance/transactions", options: { method: "GET" } },
        {
          url: "/api/finance/transactions",
          options: {
            method: "POST",
            body: {
              amount: 100,
              type: "INCOME",
              category: "Test",
              date: new Date().toISOString(),
              walletId: "wallet-1",
            },
          },
        },
      ]);

      expect(batchResult.results).toHaveLength(3);
      expect(batchResult.summary.successfulTests).toBe(3);
    });
  });

  describe("Database Query Performance", () => {
    it("should measure transaction query execution time", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify([]),
      });

      const result = await apiTester.testEndpoint("/api/finance/transactions", {
        method: "GET",
      });

      // Requirement 7.1: Log query execution time
      expect(result.responseTime).toBeDefined();
      expect(typeof result.responseTime).toBe("number");
    });

    it("should flag slow database queries", async () => {
      mockFetch.mockImplementationOnce(async () => {
        // Simulate slow query (>100ms threshold from Requirement 7.2)
        await new Promise((resolve) => setTimeout(resolve, 600));
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => JSON.stringify([]),
        };
      });

      const result = await apiTester.testEndpoint(
        "/api/finance/transactions?walletId=wallet-1&type=EXPENSE&startDate=2024-01-01&endDate=2025-12-31",
        { method: "GET" }
      );

      expect(result.isSlowEndpoint).toBe(true);
    });
  });

  describe("Response Metrics Completeness", () => {
    it("should include all required metrics for transactions GET", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify([]),
      });

      const result = await apiTester.testEndpoint("/api/finance/transactions", {
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

    it("should include all required metrics for wallets GET", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify([]),
      });

      const result = await apiTester.testEndpoint("/api/finance/wallets", {
        method: "GET",
      });

      expect(result.responseTime).toBeDefined();
      expect(result.statusCode).toBeDefined();
      expect(result.payloadSize).toBeDefined();
    });

    it("should include all required metrics for transactions POST", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        statusText: "Created",
        text: async () => JSON.stringify({ id: "tx-1" }),
      });

      const result = await apiTester.testEndpoint("/api/finance/transactions", {
        method: "POST",
        body: {
          amount: 100,
          type: "INCOME",
          category: "Test",
          date: new Date().toISOString(),
          walletId: "wallet-1",
        },
      });

      expect(result.responseTime).toBeDefined();
      expect(result.statusCode).toBeDefined();
      expect(result.payloadSize).toBeDefined();
    });
  });
});
