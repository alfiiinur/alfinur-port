/**
 * Component Profiler Types
 * Defines interfaces for component render profiling, metrics, and results
 * Requirements: 2.1
 */

/**
 * Metrics for a single component render event
 */
export interface RenderMetrics {
  /** Name of the React component */
  componentName: string;
  /** Render duration in milliseconds */
  renderTime: number;
  /** Number of times the component has rendered */
  renderCount: number;
  /** Timestamp when the render was recorded */
  timestamp: number;
}

/**
 * Result of a component profiling session
 */
export interface ComponentProfileResult {
  /** All recorded render metrics */
  metrics: RenderMetrics[];
  /** Components that re-render excessively (>5 times per second) */
  excessiveRerenders: string[];
  /** Components with render time exceeding 16ms (60fps threshold) */
  slowComponents: string[];
  /** Components ranked by total render time (descending) */
  rankedByRenderTime: RenderMetrics[];
}

/**
 * Configuration options for component profiling
 */
export interface ComponentProfilerConfig {
  /** Render time threshold in ms for marking as slow (default: 16ms for 60fps) */
  renderTimeThresholdMs: number;
  /** Re-render threshold per second for marking as excessive (default: 5) */
  rerenderThreshold: number;
  /** Time window in ms for calculating re-render rate (default: 1000ms) */
  rerenderWindowMs: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_COMPONENT_PROFILER_CONFIG: ComponentProfilerConfig = {
  renderTimeThresholdMs: 16,
  rerenderThreshold: 5,
  rerenderWindowMs: 1000,
};

/**
 * Internal tracking for render events within a time window
 */
export interface RenderEvent {
  /** Component name */
  componentName: string;
  /** Render duration in milliseconds */
  duration: number;
  /** Timestamp of the render event */
  timestamp: number;
}

/**
 * Aggregated metrics for a component
 */
export interface AggregatedComponentMetrics {
  /** Component name */
  componentName: string;
  /** Total render time across all renders */
  totalRenderTime: number;
  /** Average render time */
  averageRenderTime: number;
  /** Maximum render time */
  maxRenderTime: number;
  /** Minimum render time */
  minRenderTime: number;
  /** Total number of renders */
  renderCount: number;
  /** Renders per second (calculated over profiling duration) */
  rendersPerSecond: number;
}

/**
 * Interface for the ComponentProfiler
 */
export interface IComponentProfiler {
  /**
   * Start a profiling session
   */
  startProfiling(): void;

  /**
   * Stop the profiling session and return results
   * @returns Profiling results with metrics, warnings, and rankings
   */
  stopProfiling(): ComponentProfileResult;

  /**
   * Record a component render event
   * @param componentName Name of the component that rendered
   * @param duration Render duration in milliseconds
   */
  recordRender(componentName: string, duration: number): void;

  /**
   * Get components that re-render excessively
   * @param threshold Number of renders per second to consider excessive
   * @returns Array of component names with excessive re-renders
   */
  getExcessiveRerenders(threshold?: number): string[];

  /**
   * Get components with slow render times
   * @param thresholdMs Render time threshold in milliseconds
   * @returns Array of component names with slow renders
   */
  getSlowComponents(thresholdMs?: number): string[];

  /**
   * Get aggregated metrics for all profiled components
   * @returns Array of aggregated metrics per component
   */
  getAggregatedMetrics(): AggregatedComponentMetrics[];

  /**
   * Check if profiling is currently active
   * @returns True if profiling is in progress
   */
  isProfiling(): boolean;

  /**
   * Clear all recorded metrics
   */
  reset(): void;
}
