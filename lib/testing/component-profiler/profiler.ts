/**
 * Component Profiler Implementation
 * Measures and records React component render times to identify performance issues
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */

import {
  RenderMetrics,
  ComponentProfileResult,
  IComponentProfiler,
  ComponentProfilerConfig,
  DEFAULT_COMPONENT_PROFILER_CONFIG,
  RenderEvent,
  AggregatedComponentMetrics,
} from "./types";

/**
 * ComponentProfiler class implementation
 */
export class ComponentProfiler implements IComponentProfiler {
  private config: ComponentProfilerConfig;
  private renderEvents: RenderEvent[] = [];
  private profilingActive: boolean = false;
  private profilingStartTime: number = 0;
  private profilingEndTime: number = 0;

  constructor(config: Partial<ComponentProfilerConfig> = {}) {
    this.config = { ...DEFAULT_COMPONENT_PROFILER_CONFIG, ...config };
  }

  /**
   * Start a profiling session
   * Requirements: 2.1
   */
  startProfiling(): void {
    this.renderEvents = [];
    this.profilingActive = true;
    this.profilingStartTime = Date.now();
    this.profilingEndTime = 0;
  }

  /**
   * Stop the profiling session and return results
   * Requirements: 2.1, 2.2, 2.3, 2.4
   */
  stopProfiling(): ComponentProfileResult {
    this.profilingActive = false;
    this.profilingEndTime = Date.now();

    const metrics = this.buildMetrics();
    const excessiveRerenders = this.getExcessiveRerenders();
    const slowComponents = this.getSlowComponents();
    const rankedByRenderTime = this.getRankedByRenderTime();

    return {
      metrics,
      excessiveRerenders,
      slowComponents,
      rankedByRenderTime,
    };
  }

  /**
   * Record a component render event
   * Requirements: 2.1
   * @param componentName Name of the component that rendered
   * @param duration Render duration in milliseconds (must be non-negative)
   */
  recordRender(componentName: string, duration: number): void {
    // Ensure duration is non-negative as per Property 3
    const safeDuration = Math.max(0, duration);

    const event: RenderEvent = {
      componentName,
      duration: safeDuration,
      timestamp: Date.now(),
    };

    this.renderEvents.push(event);
  }

  /**
   * Get components that re-render excessively
   * Requirements: 2.2
   * @param threshold Number of renders per second to consider excessive (default from config)
   * @returns Array of component names with excessive re-renders
   */
  getExcessiveRerenders(threshold?: number): string[] {
    const rerenderThreshold = threshold ?? this.config.rerenderThreshold;
    const windowMs = this.config.rerenderWindowMs;
    const excessiveComponents = new Set<string>();

    // Group events by component
    const componentEvents = this.groupEventsByComponent();

    for (const [componentName, events] of componentEvents.entries()) {
      // Check for excessive re-renders within any 1-second window
      if (
        this.hasExcessiveRendersInWindow(events, rerenderThreshold, windowMs)
      ) {
        excessiveComponents.add(componentName);
      }
    }

    return Array.from(excessiveComponents);
  }

  /**
   * Check if events have excessive renders within any time window
   */
  private hasExcessiveRendersInWindow(
    events: RenderEvent[],
    threshold: number,
    windowMs: number
  ): boolean {
    if (events.length <= threshold) {
      return false;
    }

    // Sort events by timestamp
    const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);

    // Sliding window approach
    for (let i = 0; i < sortedEvents.length; i++) {
      const windowStart = sortedEvents[i].timestamp;
      const windowEnd = windowStart + windowMs;

      // Count events within this window
      let count = 0;
      for (
        let j = i;
        j < sortedEvents.length && sortedEvents[j].timestamp <= windowEnd;
        j++
      ) {
        count++;
      }

      if (count > threshold) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get components with slow render times
   * Requirements: 2.3
   * @param thresholdMs Render time threshold in milliseconds (default from config)
   * @returns Array of component names with slow renders
   */
  getSlowComponents(thresholdMs?: number): string[] {
    const threshold = thresholdMs ?? this.config.renderTimeThresholdMs;
    const slowComponents = new Set<string>();

    for (const event of this.renderEvents) {
      if (event.duration > threshold) {
        slowComponents.add(event.componentName);
      }
    }

    return Array.from(slowComponents);
  }

  /**
   * Get components ranked by total render time (descending)
   * Requirements: 2.4
   */
  private getRankedByRenderTime(): RenderMetrics[] {
    const componentMetrics = new Map<
      string,
      { totalTime: number; count: number; lastTimestamp: number }
    >();

    // Aggregate metrics per component
    for (const event of this.renderEvents) {
      const existing = componentMetrics.get(event.componentName);
      if (existing) {
        existing.totalTime += event.duration;
        existing.count += 1;
        existing.lastTimestamp = Math.max(
          existing.lastTimestamp,
          event.timestamp
        );
      } else {
        componentMetrics.set(event.componentName, {
          totalTime: event.duration,
          count: 1,
          lastTimestamp: event.timestamp,
        });
      }
    }

    // Convert to RenderMetrics and sort by total render time (descending)
    const ranked: RenderMetrics[] = Array.from(componentMetrics.entries())
      .map(([componentName, data]) => ({
        componentName,
        renderTime: data.totalTime,
        renderCount: data.count,
        timestamp: data.lastTimestamp,
      }))
      .sort((a, b) => b.renderTime - a.renderTime);

    return ranked;
  }

  /**
   * Build metrics array from render events
   */
  private buildMetrics(): RenderMetrics[] {
    const componentMetrics = new Map<string, RenderMetrics>();

    for (const event of this.renderEvents) {
      const existing = componentMetrics.get(event.componentName);
      if (existing) {
        existing.renderTime += event.duration;
        existing.renderCount += 1;
        existing.timestamp = Math.max(existing.timestamp, event.timestamp);
      } else {
        componentMetrics.set(event.componentName, {
          componentName: event.componentName,
          renderTime: event.duration,
          renderCount: 1,
          timestamp: event.timestamp,
        });
      }
    }

    return Array.from(componentMetrics.values());
  }

  /**
   * Group render events by component name
   */
  private groupEventsByComponent(): Map<string, RenderEvent[]> {
    const grouped = new Map<string, RenderEvent[]>();

    for (const event of this.renderEvents) {
      const events = grouped.get(event.componentName) || [];
      events.push(event);
      grouped.set(event.componentName, events);
    }

    return grouped;
  }

  /**
   * Get aggregated metrics for all profiled components
   */
  getAggregatedMetrics(): AggregatedComponentMetrics[] {
    const componentEvents = this.groupEventsByComponent();
    const profilingDuration = this.getProfilingDurationSeconds();
    const aggregated: AggregatedComponentMetrics[] = [];

    for (const [componentName, events] of componentEvents.entries()) {
      const durations = events.map((e) => e.duration);
      const totalRenderTime = durations.reduce((sum, d) => sum + d, 0);
      const renderCount = events.length;

      aggregated.push({
        componentName,
        totalRenderTime,
        averageRenderTime: totalRenderTime / renderCount,
        maxRenderTime: Math.max(...durations),
        minRenderTime: Math.min(...durations),
        renderCount,
        rendersPerSecond:
          profilingDuration > 0 ? renderCount / profilingDuration : 0,
      });
    }

    return aggregated.sort((a, b) => b.totalRenderTime - a.totalRenderTime);
  }

  /**
   * Get profiling duration in seconds
   */
  private getProfilingDurationSeconds(): number {
    const endTime = this.profilingEndTime || Date.now();
    return (endTime - this.profilingStartTime) / 1000;
  }

  /**
   * Check if profiling is currently active
   */
  isProfiling(): boolean {
    return this.profilingActive;
  }

  /**
   * Clear all recorded metrics
   */
  reset(): void {
    this.renderEvents = [];
    this.profilingActive = false;
    this.profilingStartTime = 0;
    this.profilingEndTime = 0;
  }

  /**
   * Get the current render events (for testing purposes)
   */
  getRenderEvents(): RenderEvent[] {
    return [...this.renderEvents];
  }
}

/**
 * Create a ComponentProfiler instance with default config
 */
export function createComponentProfiler(
  config?: Partial<ComponentProfilerConfig>
): ComponentProfiler {
  return new ComponentProfiler(config);
}
