/**
 * Memory Profiler Types
 * Defines interfaces for memory tracking, leak detection, and profiling results
 * Requirements: 4.1
 */

/**
 * A snapshot of memory usage at a point in time
 */
export interface MemorySnapshot {
  /** Heap memory currently in use (bytes) */
  heapUsed: number;
  /** Total heap memory allocated (bytes) */
  heapTotal: number;
  /** Memory used by C++ objects bound to JavaScript (bytes) */
  external: number;
  /** Timestamp when the snapshot was taken */
  timestamp: number;
  /** Resident Set Size - total memory allocated for the process (bytes) */
  rss?: number;
  /** Memory used by ArrayBuffers and SharedArrayBuffers (bytes) */
  arrayBuffers?: number;
}

/**
 * Warning about potential memory leak
 */
export interface MemoryLeakWarning {
  /** Component or module associated with the leak (if identifiable) */
  component?: string;
  /** Rate of memory growth in bytes per second */
  growthRate: number;
  /** Duration over which the growth was observed (ms) */
  duration: number;
  /** Human-readable warning message */
  message: string;
  /** Severity level of the warning */
  severity: "low" | "medium" | "high";
  /** Starting heap usage when growth was detected */
  startHeapUsed: number;
  /** Ending heap usage when growth was detected */
  endHeapUsed: number;
}

/**
 * Result of a memory profiling session
 */
export interface MemoryProfileResult {
  /** All memory snapshots taken during profiling */
  snapshots: MemorySnapshot[];
  /** Peak memory usage observed (bytes) */
  peakUsage: number;
  /** Average memory usage across all snapshots (bytes) */
  averageUsage: number;
  /** Detected memory leak warnings */
  leakWarnings: MemoryLeakWarning[];
  /** Breakdown of memory allocation by category */
  allocationBreakdown: Record<string, number>;
  /** Minimum memory usage observed (bytes) */
  minUsage: number;
  /** Total profiling duration (ms) */
  profilingDuration: number;
  /** Memory growth rate (bytes per second) */
  growthRate: number;
  /** Whether memory threshold was exceeded */
  thresholdExceeded: boolean;
}

/**
 * Configuration options for memory profiling
 */
export interface MemoryProfilerConfig {
  /** Interval between memory snapshots in milliseconds (default: 1000ms) */
  trackingIntervalMs: number;
  /** Heap usage percentage threshold for warnings (default: 0.8 = 80%) */
  heapThresholdPercent: number;
  /** Number of consecutive increasing snapshots to consider a leak (default: 10) */
  leakDetectionThreshold: number;
  /** Minimum growth rate (bytes/sec) to consider as potential leak (default: 1024 = 1KB/s) */
  minLeakGrowthRate: number;
  /** Maximum number of snapshots to store (default: 1000) */
  maxSnapshots: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_MEMORY_PROFILER_CONFIG: MemoryProfilerConfig = {
  trackingIntervalMs: 1000,
  heapThresholdPercent: 0.8,
  leakDetectionThreshold: 10,
  minLeakGrowthRate: 1024,
  maxSnapshots: 1000,
};

/**
 * Threshold check result
 */
export interface ThresholdCheckResult {
  /** Whether the threshold was exceeded */
  exceeded: boolean;
  /** Current heap usage percentage (0-1) */
  currentPercent: number;
  /** Threshold percentage (0-1) */
  thresholdPercent: number;
  /** Current heap used in bytes */
  heapUsed: number;
  /** Total heap available in bytes */
  heapTotal: number;
  /** Allocation breakdown when threshold exceeded */
  allocationBreakdown?: Record<string, number>;
}

/**
 * Interface for the MemoryProfiler
 */
export interface IMemoryProfiler {
  /**
   * Start tracking memory usage at regular intervals
   * @param intervalMs Optional custom interval in milliseconds
   */
  startTracking(intervalMs?: number): void;

  /**
   * Stop tracking and return profiling results
   * @returns Memory profiling results
   */
  stopTracking(): MemoryProfileResult;

  /**
   * Take a single memory snapshot
   * @returns Current memory snapshot
   */
  takeSnapshot(): MemorySnapshot;

  /**
   * Detect potential memory leaks from snapshots
   * @param snapshots Array of memory snapshots to analyze
   * @returns Array of leak warnings
   */
  detectLeaks(snapshots: MemorySnapshot[]): MemoryLeakWarning[];

  /**
   * Check if memory usage exceeds threshold
   * @param percentage Threshold percentage (0-1, default from config)
   * @returns Threshold check result
   */
  checkThreshold(percentage?: number): ThresholdCheckResult;

  /**
   * Get allocation breakdown by category
   * @returns Record of category to bytes allocated
   */
  getAllocationBreakdown(): Record<string, number>;

  /**
   * Check if tracking is currently active
   * @returns True if tracking is in progress
   */
  isTracking(): boolean;

  /**
   * Clear all recorded snapshots
   */
  reset(): void;

  /**
   * Get all recorded snapshots
   * @returns Array of memory snapshots
   */
  getSnapshots(): MemorySnapshot[];
}
