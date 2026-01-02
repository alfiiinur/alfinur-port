/**
 * Database Profiler Implementation
 * Logs and analyzes Prisma database queries to identify performance issues
 * Requirements: 7.1, 7.2, 7.3, 3.4
 */

import {
  QueryMetrics,
  N1QueryPattern,
  DatabaseProfileResult,
  IDatabaseProfiler,
  DatabaseProfilerConfig,
  DEFAULT_DATABASE_PROFILER_CONFIG,
  PrismaMiddlewareParams,
} from "./types";

/**
 * DatabaseProfiler class implementation
 */
export class DatabaseProfiler implements IDatabaseProfiler {
  private config: DatabaseProfilerConfig;
  private queries: QueryMetrics[] = [];
  private loggingActive: boolean = false;
  private loggingStartTime: number = 0;
  private loggingEndTime: number = 0;

  constructor(config: Partial<DatabaseProfilerConfig> = {}) {
    this.config = { ...DEFAULT_DATABASE_PROFILER_CONFIG, ...config };
  }

  /**
   * Start logging database queries
   * Requirements: 7.1
   */
  startLogging(): void {
    this.queries = [];
    this.loggingActive = true;
    this.loggingStartTime = Date.now();
    this.loggingEndTime = 0;
  }

  /**
   * Stop logging and return profiling results
   * Requirements: 7.1, 7.2, 7.3
   */
  stopLogging(): DatabaseProfileResult {
    this.loggingActive = false;
    this.loggingEndTime = Date.now();

    const slowQueries = this.getSlowQueries();
    const n1Patterns = this.detectN1Patterns(this.queries);
    const recommendations = this.generateRecommendations(
      slowQueries,
      n1Patterns
    );

    const totalExecutionTime = this.queries.reduce(
      (sum, q) => sum + q.executionTime,
      0
    );

    return {
      queries: [...this.queries],
      slowQueries,
      n1Patterns,
      recommendations,
      totalQueries: this.queries.length,
      totalExecutionTime,
      averageExecutionTime:
        this.queries.length > 0 ? totalExecutionTime / this.queries.length : 0,
    };
  }

  /**
   * Log a single query execution
   * Requirements: 7.1
   * @param query The SQL query string
   * @param duration Execution time in milliseconds
   * @param rows Number of rows affected
   * @param model Optional model name
   * @param operation Optional operation type
   */
  logQuery(
    query: string,
    duration: number,
    rows: number,
    model?: string,
    operation?: string
  ): void {
    // Ensure duration is non-negative
    const safeDuration = Math.max(0, duration);
    // Ensure rows is non-negative
    const safeRows = Math.max(0, rows);

    const metrics: QueryMetrics = {
      query,
      executionTime: safeDuration,
      rowsAffected: safeRows,
      timestamp: Date.now(),
      model,
      operation,
    };

    // Respect max queries limit
    if (this.queries.length < this.config.maxQueries) {
      this.queries.push(metrics);
    }
  }

  /**
   * Get queries that exceed the slow query threshold
   * Requirements: 7.2
   * @param thresholdMs Optional custom threshold in milliseconds
   * @returns Array of slow queries
   */
  getSlowQueries(thresholdMs?: number): QueryMetrics[] {
    const threshold = thresholdMs ?? this.config.slowQueryThresholdMs;
    return this.queries.filter((q) => q.executionTime > threshold);
  }

  /**
   * Detect N+1 query patterns from logged queries
   * Requirements: 3.4, 7.3
   * @param queries Array of query metrics to analyze
   * @returns Array of detected N+1 patterns
   */
  detectN1Patterns(queries: QueryMetrics[]): N1QueryPattern[] {
    if (queries.length < 2) {
      return [];
    }

    const patterns: N1QueryPattern[] = [];
    const processedIndices = new Set<number>();

    // Sort queries by timestamp to analyze in order
    const sortedQueries = [...queries].sort(
      (a, b) => a.timestamp - b.timestamp
    );

    for (let i = 0; i < sortedQueries.length; i++) {
      if (processedIndices.has(i)) {
        continue;
      }

      const parentQuery = sortedQueries[i];
      const normalizedParent = this.normalizeQuery(parentQuery.query);

      // Look for similar queries following this one
      const childQueries: QueryMetrics[] = [];
      const childIndices: number[] = [];

      for (let j = i + 1; j < sortedQueries.length; j++) {
        if (processedIndices.has(j)) {
          continue;
        }

        const childQuery = sortedQueries[j];
        const normalizedChild = this.normalizeQuery(childQuery.query);

        // Check if queries are similar (same pattern, different parameters)
        if (this.areQueriesSimilar(normalizedParent, normalizedChild)) {
          childQueries.push(childQuery);
          childIndices.push(j);
        }
      }

      // If we found enough similar queries, it's an N+1 pattern
      if (childQueries.length >= this.config.n1PatternThreshold) {
        // Mark all child indices as processed
        childIndices.forEach((idx) => processedIndices.add(idx));
        processedIndices.add(i);

        const estimatedTimeWasted = childQueries.reduce(
          (sum, q) => sum + q.executionTime,
          0
        );

        patterns.push({
          parentQuery: parentQuery.query,
          childQueries: childQueries.map((q) => q.query),
          suggestedFix: this.generateN1Fix(parentQuery),
          childCount: childQueries.length,
          estimatedTimeWasted,
        });
      }
    }

    return patterns;
  }

  /**
   * Normalize a query by removing specific parameter values
   * This helps identify similar queries with different parameters
   */
  private normalizeQuery(query: string): string {
    // Remove string literals
    let normalized = query.replace(/'[^']*'/g, "'?'");
    // Remove numeric literals
    normalized = normalized.replace(/\b\d+\b/g, "?");
    // Remove UUIDs
    normalized = normalized.replace(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      "?"
    );
    // Normalize whitespace
    normalized = normalized.replace(/\s+/g, " ").trim();
    return normalized;
  }

  /**
   * Check if two normalized queries are similar enough to be N+1 candidates
   */
  private areQueriesSimilar(query1: string, query2: string): boolean {
    // Exact match after normalization
    if (query1 === query2) {
      return true;
    }

    // Check if they have the same structure (same SELECT/FROM/WHERE pattern)
    const pattern1 = this.extractQueryPattern(query1);
    const pattern2 = this.extractQueryPattern(query2);

    return pattern1 === pattern2;
  }

  /**
   * Extract the structural pattern of a query
   */
  private extractQueryPattern(query: string): string {
    // Extract table name and operation type
    const selectMatch = query.match(/SELECT\s+.*?\s+FROM\s+["']?(\w+)["']?/i);
    const whereMatch = query.match(/WHERE\s+["']?(\w+)["']?\s*=/i);

    if (selectMatch) {
      const table = selectMatch[1];
      const whereColumn = whereMatch ? whereMatch[1] : "";
      return `SELECT:${table}:${whereColumn}`;
    }

    return query.substring(0, 50);
  }

  /**
   * Generate a suggested fix for an N+1 pattern
   * Requirements: 7.3
   */
  private generateN1Fix(parentQuery: QueryMetrics): string {
    const model =
      parentQuery.model || this.extractModelFromQuery(parentQuery.query);
    const operation = parentQuery.operation || "findMany";

    if (!model) {
      return "Consider using Prisma includes to fetch related data in a single query";
    }

    // Generate a suggested Prisma query with includes
    return `Use Prisma includes to batch the queries:
prisma.${model.toLowerCase()}.${operation}({
  include: {
    // Add related models here
    // relatedModel: true,
  }
})`;
  }

  /**
   * Extract model name from a SQL query
   */
  private extractModelFromQuery(query: string): string | undefined {
    // Try to extract table name from SELECT ... FROM table
    const fromMatch = query.match(/FROM\s+["']?(\w+)["']?/i);
    if (fromMatch) {
      return fromMatch[1];
    }

    // Try to extract from INSERT INTO table
    const insertMatch = query.match(/INSERT\s+INTO\s+["']?(\w+)["']?/i);
    if (insertMatch) {
      return insertMatch[1];
    }

    // Try to extract from UPDATE table
    const updateMatch = query.match(/UPDATE\s+["']?(\w+)["']?/i);
    if (updateMatch) {
      return updateMatch[1];
    }

    return undefined;
  }

  /**
   * Generate optimization recommendations based on profiling results
   */
  private generateRecommendations(
    slowQueries: QueryMetrics[],
    n1Patterns: N1QueryPattern[]
  ): string[] {
    const recommendations: string[] = [];

    // Recommendations for slow queries
    if (slowQueries.length > 0) {
      recommendations.push(
        `Found ${slowQueries.length} slow queries exceeding ${this.config.slowQueryThresholdMs}ms threshold`
      );

      // Group slow queries by model
      const slowByModel = new Map<string, number>();
      for (const query of slowQueries) {
        const model =
          query.model || this.extractModelFromQuery(query.query) || "unknown";
        slowByModel.set(model, (slowByModel.get(model) || 0) + 1);
      }

      slowByModel.forEach((count, model) => {
        if (count > 1) {
          recommendations.push(
            `Consider adding indexes for ${model} table - ${count} slow queries detected`
          );
        }
      });
    }

    // Recommendations for N+1 patterns
    if (n1Patterns.length > 0) {
      recommendations.push(
        `Found ${n1Patterns.length} N+1 query patterns - use Prisma includes to optimize`
      );

      const totalWastedTime = n1Patterns.reduce(
        (sum, p) => sum + p.estimatedTimeWasted,
        0
      );
      if (totalWastedTime > 100) {
        recommendations.push(
          `Estimated ${totalWastedTime.toFixed(0)}ms wasted due to N+1 patterns`
        );
      }
    }

    // General recommendations based on query count
    if (this.queries.length > 50) {
      recommendations.push(
        `High query count (${this.queries.length}) - consider batching or caching`
      );
    }

    return recommendations;
  }

  /**
   * Check if logging is currently active
   */
  isLogging(): boolean {
    return this.loggingActive;
  }

  /**
   * Clear all logged queries
   */
  reset(): void {
    this.queries = [];
    this.loggingActive = false;
    this.loggingStartTime = 0;
    this.loggingEndTime = 0;
  }

  /**
   * Get the current queries (for testing purposes)
   */
  getQueries(): QueryMetrics[] {
    return [...this.queries];
  }

  /**
   * Get Prisma middleware function for automatic query logging
   * Requirements: 7.1
   * @returns Middleware function compatible with Prisma
   */
  getPrismaMiddleware(): (
    params: PrismaMiddlewareParams,
    next: (params: PrismaMiddlewareParams) => Promise<unknown>
  ) => Promise<unknown> {
    return async (params, next) => {
      const startTime = Date.now();
      const result = await next(params);
      const duration = Date.now() - startTime;

      // Estimate rows affected based on result
      let rowsAffected = 0;
      if (Array.isArray(result)) {
        rowsAffected = result.length;
      } else if (result && typeof result === "object") {
        rowsAffected = 1;
      }

      // Generate a pseudo-query string from the action
      const query = `${params.action} on ${params.model || "unknown"}`;

      if (this.loggingActive) {
        this.logQuery(
          query,
          duration,
          rowsAffected,
          params.model,
          params.action
        );
      }

      return result;
    };
  }
}

/**
 * Create a DatabaseProfiler instance with default config
 */
export function createDatabaseProfiler(
  config?: Partial<DatabaseProfilerConfig>
): DatabaseProfiler {
  return new DatabaseProfiler(config);
}
