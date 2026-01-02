/**
 * Database Profiler Types
 * Defines interfaces for database query profiling, N+1 detection, and results
 * Requirements: 7.1
 */

/**
 * Metrics for a single database query
 */
export interface QueryMetrics {
  /** The SQL query string */
  query: string;
  /** Query execution time in milliseconds */
  executionTime: number;
  /** Number of rows affected or returned */
  rowsAffected: number;
  /** Timestamp when the query was executed */
  timestamp: number;
  /** Optional model/table name associated with the query */
  model?: string;
  /** Optional operation type (findMany, create, update, delete, etc.) */
  operation?: string;
}

/**
 * Detected N+1 query pattern
 */
export interface N1QueryPattern {
  /** The parent query that triggered the N+1 pattern */
  parentQuery: string;
  /** Array of similar child queries executed after the parent */
  childQueries: string[];
  /** Suggested fix using Prisma includes */
  suggestedFix: string;
  /** Number of child queries detected */
  childCount: number;
  /** Estimated time wasted due to N+1 pattern */
  estimatedTimeWasted: number;
}

/**
 * Result of a database profiling session
 */
export interface DatabaseProfileResult {
  /** All logged queries during the profiling session */
  queries: QueryMetrics[];
  /** Queries that exceeded the slow query threshold */
  slowQueries: QueryMetrics[];
  /** Detected N+1 query patterns */
  n1Patterns: N1QueryPattern[];
  /** Optimization recommendations */
  recommendations: string[];
  /** Total number of queries executed */
  totalQueries: number;
  /** Total execution time across all queries */
  totalExecutionTime: number;
  /** Average query execution time */
  averageExecutionTime: number;
}

/**
 * Configuration options for database profiling
 */
export interface DatabaseProfilerConfig {
  /** Query execution time threshold in ms for marking as slow (default: 100ms) */
  slowQueryThresholdMs: number;
  /** Minimum number of similar queries to consider as N+1 pattern (default: 2) */
  n1PatternThreshold: number;
  /** Whether to log query parameters (default: false for security) */
  logParameters: boolean;
  /** Maximum number of queries to store (default: 1000) */
  maxQueries: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_DATABASE_PROFILER_CONFIG: DatabaseProfilerConfig = {
  slowQueryThresholdMs: 100,
  n1PatternThreshold: 2,
  logParameters: false,
  maxQueries: 1000,
};

/**
 * Prisma query event structure (from Prisma middleware)
 */
export interface PrismaQueryEvent {
  /** The query string */
  query: string;
  /** Query parameters */
  params: string;
  /** Query duration in milliseconds */
  duration: number;
  /** Target database */
  target: string;
  /** Timestamp of the query */
  timestamp: Date;
}

/**
 * Query similarity result for N+1 detection
 */
export interface QuerySimilarity {
  /** The normalized query pattern */
  pattern: string;
  /** Queries matching this pattern */
  queries: QueryMetrics[];
  /** Count of matching queries */
  count: number;
}

/**
 * Interface for the DatabaseProfiler
 */
export interface IDatabaseProfiler {
  /**
   * Start logging database queries
   */
  startLogging(): void;

  /**
   * Stop logging and return profiling results
   * @returns Profiling results with queries, slow queries, and N+1 patterns
   */
  stopLogging(): DatabaseProfileResult;

  /**
   * Log a single query execution
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
  ): void;

  /**
   * Detect N+1 query patterns from logged queries
   * @param queries Array of query metrics to analyze
   * @returns Array of detected N+1 patterns
   */
  detectN1Patterns(queries: QueryMetrics[]): N1QueryPattern[];

  /**
   * Get queries that exceed the slow query threshold
   * @param thresholdMs Optional custom threshold in milliseconds
   * @returns Array of slow queries
   */
  getSlowQueries(thresholdMs?: number): QueryMetrics[];

  /**
   * Check if logging is currently active
   * @returns True if logging is in progress
   */
  isLogging(): boolean;

  /**
   * Clear all logged queries
   */
  reset(): void;

  /**
   * Get Prisma middleware function for automatic query logging
   * @returns Middleware function compatible with Prisma
   */
  getPrismaMiddleware(): (
    params: PrismaMiddlewareParams,
    next: (params: PrismaMiddlewareParams) => Promise<unknown>
  ) => Promise<unknown>;
}

/**
 * Prisma middleware params structure
 */
export interface PrismaMiddlewareParams {
  model?: string;
  action: string;
  args: unknown;
  dataPath: string[];
  runInTransaction: boolean;
}
