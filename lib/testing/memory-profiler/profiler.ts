/**
 * Memory Profiler Implementation
 * Tracks memory usage, detects leaks, and monitors heap thresholds
 * Requirements: 4.1, 4.2, 4.4
 */

import {
  MemorySnapshot,
  MemoryLeakWarning,
  MemoryProfileResult,
  IMemoryProfiler,
  MemoryProfilerConfig,
  DEFAULT_MEMORY_PROFILER_CONFIG,
  ThresholdCheckResult,
} from "./types";

/**
 * MemoryProfiler class implementation
 */
export class MemoryProfiler implements IMemoryProfiler {
  private config: MemoryProfilerConfig;
  private snapshots: MemorySnapshot[] = [];
  private trackingActive: boolean = false;
  private trackingStartTime: number = 0;
  private trackingEndTime: number = 0;
  private trackingInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config: Partial<MemoryProfilerConfig> = {}) {
    this.config = { ...DEFAULT_MEMORY_PROFILER_CONFIG, ...config };
  }

  /**
   * Start tracking memory usage at regular intervals
   * Requirements: 4.1
   * @param intervalMs Optional custom interval in milliseconds
   */
  startTracking(intervalMs?: number): void {
    if (this.trackingActive) {
      return; // Already tracking
    }

    this.snapshots = [];
    this.trackingActive = true;
    this.trackingStartTime = Date.now();
    this.trackingEndTime = 0;

    const interval = intervalMs ?? this.config.trackingIntervalMs;

    // Take initial snapshot
    this.snapshots.push(this.takeSnapshot());

    // Set up interval for periodic snapshots
    this.trackingInterval = setInterval(() => {
      if (this.snapshots.length < this.config.maxSnapshots) {
        this.snapshots.push(this.takeSnapshot());
      }
    }, interval);
  }

  /**
   * Stop tracking and return profiling results
   * Requirements: 4.1, 4.2, 4.4
   * @returns Memory profiling results
   */
  stopTracking(): MemoryProfileResult {
    this.trackingActive = false;
    this.trackingEndTime = Date.now();

    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }

    // Take final snapshot
    if (
      this.snapshots.length === 0 ||
      this.snapshots[this.snapshots.length - 1].timestamp <
        this.trackingEndTime - 100
    ) {
      this.snapshots.push(this.takeSnapshot());
    }

    const leakWarnings = this.detectLeaks(this.snapshots);
    const allocationBreakdown = this.getAllocationBreakdown();
    const thresholdCheck = this.checkThreshold();

    // Calculate statistics
    const heapUsages = this.snapshots.map((s) => s.heapUsed);
    const peakUsage = heapUsages.length > 0 ? Math.max(...heapUsages) : 0;
    const minUsage = heapUsages.length > 0 ? Math.min(...heapUsages) : 0;
    const averageUsage =
      heapUsages.length > 0
        ? heapUsages.reduce((sum, h) => sum + h, 0) / heapUsages.length
        : 0;

    const profilingDuration = this.trackingEndTime - this.trackingStartTime;
    const growthRate = this.calculateGrowthRate(this.snapshots);

    return {
      snapshots: [...this.snapshots],
      peakUsage,
      averageUsage,
      leakWarnings,
      allocationBreakdown,
      minUsage,
      profilingDuration,
      growthRate,
      thresholdExceeded: thresholdCheck.exceeded,
    };
  }

  /**
   * Take a single memory snapshot
   * Requirements: 4.1
   * @returns Current memory snapshot
   */
  takeSnapshot(): MemorySnapshot {
    const memUsage = process.memoryUsage();

    return {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      timestamp: Date.now(),
      rss: memUsage.rss,
      arrayBuffers: memUsage.arrayBuffers,
    };
  }

  /**
   * Detect potential memory leaks from snapshots
   * Requirements: 4.2
   * @param snapshots Array of memory snapshots to analyze
   * @returns Array of leak warnings
   */
  detectLeaks(snapshots: MemorySnapshot[]): MemoryLeakWarning[] {
    const warnings: MemoryLeakWarning[] = [];

    if (snapshots.length < this.config.leakDetectionThreshold) {
      return warnings;
    }

    // Sort snapshots by timestamp
    const sortedSnapshots = [...snapshots].sort(
      (a, b) => a.timestamp - b.timestamp
    );

    // Look for monotonically increasing heap usage
    let consecutiveIncreases = 0;
    let streakStartIndex = 0;

    for (let i = 1; i < sortedSnapshots.length; i++) {
      const current = sortedSnapshots[i];
      const previous = sortedSnapshots[i - 1];

      if (current.heapUsed > previous.heapUsed) {
        if (consecutiveIncreases === 0) {
          streakStartIndex = i - 1;
        }
        consecutiveIncreases++;

        // Check if we've hit the threshold for leak detection
        if (consecutiveIncreases >= this.config.leakDetectionThreshold) {
          const startSnapshot = sortedSnapshots[streakStartIndex];
          const endSnapshot = current;
          const duration = endSnapshot.timestamp - startSnapshot.timestamp;
          const memoryGrowth = endSnapshot.heapUsed - startSnapshot.heapUsed;
          const growthRate =
            duration > 0 ? (memoryGrowth / duration) * 1000 : 0;

          // Only report if growth rate exceeds minimum threshold
          if (growthRate >= this.config.minLeakGrowthRate) {
            const severity = this.calculateLeakSeverity(growthRate);

            warnings.push({
              growthRate,
              duration,
              message: `Potential memory leak detected: heap grew by ${this.formatBytes(
                memoryGrowth
              )} over ${this.formatDuration(duration)} (${this.formatBytes(
                growthRate
              )}/s)`,
              severity,
              startHeapUsed: startSnapshot.heapUsed,
              endHeapUsed: endSnapshot.heapUsed,
            });

            // Reset to look for additional leak patterns
            consecutiveIncreases = 0;
          }
        }
      } else {
        // Reset streak on decrease or stable memory
        consecutiveIncreases = 0;
      }
    }

    return warnings;
  }

  /**
   * Calculate severity based on growth rate
   */
  private calculateLeakSeverity(growthRate: number): "low" | "medium" | "high" {
    // Growth rate thresholds (bytes per second)
    const HIGH_THRESHOLD = 1024 * 1024; // 1MB/s
    const MEDIUM_THRESHOLD = 100 * 1024; // 100KB/s

    if (growthRate >= HIGH_THRESHOLD) {
      return "high";
    } else if (growthRate >= MEDIUM_THRESHOLD) {
      return "medium";
    }
    return "low";
  }

  /**
   * Check if memory usage exceeds threshold
   * Requirements: 4.4
   * @param percentage Threshold percentage (0-1, default from config)
   * @returns Threshold check result
   */
  checkThreshold(percentage?: number): ThresholdCheckResult {
    const threshold = percentage ?? this.config.heapThresholdPercent;
    const snapshot = this.takeSnapshot();
    const currentPercent =
      snapshot.heapTotal > 0 ? snapshot.heapUsed / snapshot.heapTotal : 0;
    const exceeded = currentPercent > threshold;

    const result: ThresholdCheckResult = {
      exceeded,
      currentPercent,
      thresholdPercent: threshold,
      heapUsed: snapshot.heapUsed,
      heapTotal: snapshot.heapTotal,
    };

    // Include allocation breakdown when threshold is exceeded
    if (exceeded) {
      result.allocationBreakdown = this.getAllocationBreakdown();
    }

    return result;
  }

  /**
   * Get allocation breakdown by category
   * Requirements: 4.4
   * @returns Record of category to bytes allocated
   */
  getAllocationBreakdown(): Record<string, number> {
    const memUsage = process.memoryUsage();

    return {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
      arrayBuffers: memUsage.arrayBuffers,
    };
  }

  /**
   * Calculate overall memory growth rate
   */
  private calculateGrowthRate(snapshots: MemorySnapshot[]): number {
    if (snapshots.length < 2) {
      return 0;
    }

    const sorted = [...snapshots].sort((a, b) => a.timestamp - b.timestamp);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const duration = last.timestamp - first.timestamp;

    if (duration <= 0) {
      return 0;
    }

    const memoryChange = last.heapUsed - first.heapUsed;
    return (memoryChange / duration) * 1000; // bytes per second
  }

  /**
   * Format bytes to human-readable string
   */
  private formatBytes(bytes: number): string {
    const absBytes = Math.abs(bytes);
    const sign = bytes < 0 ? "-" : "";

    if (absBytes >= 1024 * 1024 * 1024) {
      return `${sign}${(absBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    } else if (absBytes >= 1024 * 1024) {
      return `${sign}${(absBytes / (1024 * 1024)).toFixed(2)} MB`;
    } else if (absBytes >= 1024) {
      return `${sign}${(absBytes / 1024).toFixed(2)} KB`;
    }
    return `${sign}${absBytes} bytes`;
  }

  /**
   * Format duration to human-readable string
   */
  private formatDuration(ms: number): string {
    if (ms >= 60000) {
      return `${(ms / 60000).toFixed(1)} minutes`;
    } else if (ms >= 1000) {
      return `${(ms / 1000).toFixed(1)} seconds`;
    }
    return `${ms} ms`;
  }

  /**
   * Check if tracking is currently active
   */
  isTracking(): boolean {
    return this.trackingActive;
  }

  /**
   * Clear all recorded snapshots
   */
  reset(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
    this.snapshots = [];
    this.trackingActive = false;
    this.trackingStartTime = 0;
    this.trackingEndTime = 0;
  }

  /**
   * Get all recorded snapshots
   * @returns Array of memory snapshots
   */
  getSnapshots(): MemorySnapshot[] {
    return [...this.snapshots];
  }

  /**
   * Add a snapshot manually (useful for testing)
   * @param snapshot Memory snapshot to add
   */
  addSnapshot(snapshot: MemorySnapshot): void {
    if (this.snapshots.length < this.config.maxSnapshots) {
      this.snapshots.push(snapshot);
    }
  }
}

/**
 * Create a MemoryProfiler instance with default config
 */
export function createMemoryProfiler(
  config?: Partial<MemoryProfilerConfig>
): MemoryProfiler {
  return new MemoryProfiler(config);
}
