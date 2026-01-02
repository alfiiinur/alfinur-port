/**
 * Animation Profiler Types
 * Defines interfaces for animation profiling, frame rate measurement, and results
 * Requirements: 9.1
 */

/**
 * Metrics for a single animation
 */
export interface AnimationMetrics {
  /** Unique identifier or name of the animation */
  name: string;
  /** Average frame rate in frames per second */
  frameRate: number;
  /** Number of frames that were dropped */
  droppedFrames: number;
  /** CPU usage percentage (0-100) */
  cpuUsage: number;
  /** Whether the animation triggers layout recalculation */
  triggersLayout: boolean;
  /** Total frames recorded */
  totalFrames: number;
  /** Duration of the animation measurement in milliseconds */
  duration: number;
  /** Timestamp when measurement started */
  timestamp: number;
}

/**
 * Result of an animation profiling session
 */
export interface AnimationProfileResult {
  /** All recorded animation metrics */
  animations: AnimationMetrics[];
  /** Animations with frame rate below threshold (default: 30fps) */
  criticalAnimations: string[];
  /** Combined CPU usage of all animations (percentage) */
  combinedCpuUsage: number;
  /** Recommendations for improving animation performance */
  recommendations: string[];
  /** Total profiling duration in milliseconds */
  profilingDuration: number;
  /** Average frame rate across all animations */
  averageFrameRate: number;
  /** Total dropped frames across all animations */
  totalDroppedFrames: number;
}

/**
 * Configuration options for animation profiling
 */
export interface AnimationProfilerConfig {
  /** Frame rate threshold for marking animation as critical (default: 30fps) */
  criticalFpsThreshold: number;
  /** Target frame rate for calculating dropped frames (default: 60fps) */
  targetFps: number;
  /** Interval for sampling frame rate in milliseconds (default: 16.67ms for 60fps) */
  sampleIntervalMs: number;
  /** CPU usage threshold for warnings (default: 50%) */
  cpuWarningThreshold: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_ANIMATION_PROFILER_CONFIG: AnimationProfilerConfig = {
  criticalFpsThreshold: 30,
  targetFps: 60,
  sampleIntervalMs: 16.67,
  cpuWarningThreshold: 50,
};

/**
 * Frame timing data for a single frame
 */
export interface FrameData {
  /** Animation identifier */
  animationId: string;
  /** Timestamp of the frame */
  timestamp: number;
  /** Duration of the frame in milliseconds */
  frameDuration: number;
  /** Whether this frame was dropped (duration > target) */
  wasDropped: boolean;
}

/**
 * Animation tracking state
 */
export interface AnimationTrackingState {
  /** Animation identifier */
  animationId: string;
  /** Start timestamp */
  startTime: number;
  /** All frame data for this animation */
  frames: FrameData[];
  /** Whether the animation triggers layout */
  triggersLayout: boolean;
  /** CPU samples for this animation */
  cpuSamples: number[];
  /** Whether tracking is active */
  isActive: boolean;
}

/**
 * Interface for the AnimationProfiler
 */
export interface IAnimationProfiler {
  /**
   * Start a profiling session
   */
  startProfiling(): void;

  /**
   * Stop the profiling session and return results
   * @returns Animation profiling results
   */
  stopProfiling(): AnimationProfileResult;

  /**
   * Start tracking a specific animation
   * @param animationId Unique identifier for the animation
   * @param triggersLayout Whether the animation triggers layout recalculation
   */
  startAnimation(animationId: string, triggersLayout?: boolean): void;

  /**
   * Stop tracking a specific animation
   * @param animationId Unique identifier for the animation
   */
  stopAnimation(animationId: string): void;

  /**
   * Record a frame for an animation
   * @param animationId Animation identifier
   * @param frameDuration Duration of the frame in milliseconds
   * @param cpuUsage Optional CPU usage for this frame
   */
  recordFrame(
    animationId: string,
    frameDuration: number,
    cpuUsage?: number
  ): void;

  /**
   * Measure frame rate for a specific animation
   * @param animationId Animation identifier
   * @returns Current frame rate in fps
   */
  measureFrameRate(animationId: string): number;

  /**
   * Detect if an animation triggers layout recalculation
   * @param animationId Animation identifier
   * @returns True if animation triggers layout
   */
  detectLayoutTriggers(animationId: string): boolean;

  /**
   * Get animations with frame rate below threshold
   * @param fpsThreshold Frame rate threshold (default from config)
   * @returns Array of animation names that are critical
   */
  getCriticalAnimations(fpsThreshold?: number): string[];

  /**
   * Get combined CPU usage of all active animations
   * @returns Combined CPU usage percentage
   */
  getCombinedCpuUsage(): number;

  /**
   * Check if profiling is currently active
   * @returns True if profiling is in progress
   */
  isProfiling(): boolean;

  /**
   * Clear all recorded metrics
   */
  reset(): void;

  /**
   * Get metrics for a specific animation
   * @param animationId Animation identifier
   * @returns Animation metrics or undefined if not found
   */
  getAnimationMetrics(animationId: string): AnimationMetrics | undefined;

  /**
   * Get all tracked animations
   * @returns Array of animation identifiers
   */
  getTrackedAnimations(): string[];
}
