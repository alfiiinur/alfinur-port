/**
 * Animation Profiler Implementation
 * Measures frame rates, detects dropped frames, and profiles animation performance
 * Requirements: 9.1, 9.2, 9.4
 */

import {
  AnimationMetrics,
  AnimationProfileResult,
  IAnimationProfiler,
  AnimationProfilerConfig,
  DEFAULT_ANIMATION_PROFILER_CONFIG,
  FrameData,
  AnimationTrackingState,
} from "./types";

/**
 * AnimationProfiler class implementation
 */
export class AnimationProfiler implements IAnimationProfiler {
  private config: AnimationProfilerConfig;
  private animationStates: Map<string, AnimationTrackingState> = new Map();
  private completedAnimations: AnimationMetrics[] = [];
  private profilingActive: boolean = false;
  private profilingStartTime: number = 0;
  private profilingEndTime: number = 0;

  constructor(config: Partial<AnimationProfilerConfig> = {}) {
    this.config = { ...DEFAULT_ANIMATION_PROFILER_CONFIG, ...config };
  }

  /**
   * Start a profiling session
   * Requirements: 9.1
   */
  startProfiling(): void {
    this.animationStates.clear();
    this.completedAnimations = [];
    this.profilingActive = true;
    this.profilingStartTime = Date.now();
    this.profilingEndTime = 0;
  }

  /**
   * Stop the profiling session and return results
   * Requirements: 9.1, 9.2, 9.4
   */
  stopProfiling(): AnimationProfileResult {
    this.profilingActive = false;
    this.profilingEndTime = Date.now();

    // Finalize any active animations
    for (const [animationId] of this.animationStates) {
      this.finalizeAnimation(animationId);
    }

    const animations = [...this.completedAnimations];
    const criticalAnimations = this.getCriticalAnimations();
    const combinedCpuUsage = this.getCombinedCpuUsage();
    const recommendations = this.generateRecommendations(animations);
    const profilingDuration = this.profilingEndTime - this.profilingStartTime;

    // Calculate aggregate metrics
    const averageFrameRate = this.calculateAverageFrameRate(animations);
    const totalDroppedFrames = animations.reduce(
      (sum, a) => sum + a.droppedFrames,
      0
    );

    return {
      animations,
      criticalAnimations,
      combinedCpuUsage,
      recommendations,
      profilingDuration,
      averageFrameRate,
      totalDroppedFrames,
    };
  }

  /**
   * Start tracking a specific animation
   * Requirements: 9.1
   */
  startAnimation(animationId: string, triggersLayout: boolean = false): void {
    const state: AnimationTrackingState = {
      animationId,
      startTime: Date.now(),
      frames: [],
      triggersLayout,
      cpuSamples: [],
      isActive: true,
    };
    this.animationStates.set(animationId, state);
  }

  /**
   * Stop tracking a specific animation
   * Requirements: 9.1
   */
  stopAnimation(animationId: string): void {
    this.finalizeAnimation(animationId);
  }

  /**
   * Record a frame for an animation
   * Requirements: 9.1, 9.2
   */
  recordFrame(
    animationId: string,
    frameDuration: number,
    cpuUsage?: number
  ): void {
    const state = this.animationStates.get(animationId);
    if (!state || !state.isActive) {
      return;
    }

    // Calculate target frame duration (e.g., 16.67ms for 60fps)
    const targetFrameDuration = 1000 / this.config.targetFps;
    const wasDropped = frameDuration > targetFrameDuration;

    const frameData: FrameData = {
      animationId,
      timestamp: Date.now(),
      frameDuration: Math.max(0, frameDuration),
      wasDropped,
    };

    state.frames.push(frameData);

    if (cpuUsage !== undefined) {
      state.cpuSamples.push(Math.max(0, Math.min(100, cpuUsage)));
    }
  }

  /**
   * Measure frame rate for a specific animation
   * Requirements: 9.1
   */
  measureFrameRate(animationId: string): number {
    const state = this.animationStates.get(animationId);
    if (!state || state.frames.length === 0) {
      return 0;
    }

    return this.calculateFrameRate(state.frames);
  }

  /**
   * Detect if an animation triggers layout recalculation
   * Requirements: 9.3
   */
  detectLayoutTriggers(animationId: string): boolean {
    const state = this.animationStates.get(animationId);
    if (!state) {
      // Check completed animations
      const completed = this.completedAnimations.find(
        (a) => a.name === animationId
      );
      return completed?.triggersLayout ?? false;
    }
    return state.triggersLayout;
  }

  /**
   * Get animations with frame rate below threshold
   * Requirements: 9.2
   */
  getCriticalAnimations(fpsThreshold?: number): string[] {
    const threshold = fpsThreshold ?? this.config.criticalFpsThreshold;
    const criticalAnimations: string[] = [];

    // Check active animations
    for (const [animationId, state] of this.animationStates) {
      if (state.frames.length > 0) {
        const frameRate = this.calculateFrameRate(state.frames);
        if (frameRate < threshold && frameRate > 0) {
          criticalAnimations.push(animationId);
        }
      }
    }

    // Check completed animations
    for (const animation of this.completedAnimations) {
      if (
        animation.frameRate < threshold &&
        animation.frameRate > 0 &&
        !criticalAnimations.includes(animation.name)
      ) {
        criticalAnimations.push(animation.name);
      }
    }

    return criticalAnimations;
  }

  /**
   * Get combined CPU usage of all animations
   * Requirements: 9.4
   */
  getCombinedCpuUsage(): number {
    let totalCpuUsage = 0;
    let sampleCount = 0;

    // Sum CPU usage from active animations
    for (const state of this.animationStates.values()) {
      if (state.cpuSamples.length > 0) {
        const avgCpu =
          state.cpuSamples.reduce((sum, cpu) => sum + cpu, 0) /
          state.cpuSamples.length;
        totalCpuUsage += avgCpu;
        sampleCount++;
      }
    }

    // Sum CPU usage from completed animations
    for (const animation of this.completedAnimations) {
      if (animation.cpuUsage > 0) {
        totalCpuUsage += animation.cpuUsage;
        sampleCount++;
      }
    }

    // Return combined CPU usage (can exceed 100% with multiple animations)
    return sampleCount > 0 ? totalCpuUsage : 0;
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
    this.animationStates.clear();
    this.completedAnimations = [];
    this.profilingActive = false;
    this.profilingStartTime = 0;
    this.profilingEndTime = 0;
  }

  /**
   * Get metrics for a specific animation
   */
  getAnimationMetrics(animationId: string): AnimationMetrics | undefined {
    // Check completed animations first
    const completed = this.completedAnimations.find(
      (a) => a.name === animationId
    );
    if (completed) {
      return completed;
    }

    // Check active animations
    const state = this.animationStates.get(animationId);
    if (state) {
      return this.buildMetricsFromState(state);
    }

    return undefined;
  }

  /**
   * Get all tracked animations
   */
  getTrackedAnimations(): string[] {
    const tracked = new Set<string>();

    for (const animationId of this.animationStates.keys()) {
      tracked.add(animationId);
    }

    for (const animation of this.completedAnimations) {
      tracked.add(animation.name);
    }

    return Array.from(tracked);
  }

  /**
   * Finalize an animation and move it to completed
   */
  private finalizeAnimation(animationId: string): void {
    const state = this.animationStates.get(animationId);
    if (!state) {
      return;
    }

    state.isActive = false;
    const metrics = this.buildMetricsFromState(state);
    this.completedAnimations.push(metrics);
    this.animationStates.delete(animationId);
  }

  /**
   * Build AnimationMetrics from tracking state
   */
  private buildMetricsFromState(
    state: AnimationTrackingState
  ): AnimationMetrics {
    const frameRate = this.calculateFrameRate(state.frames);
    const droppedFrames = state.frames.filter((f) => f.wasDropped).length;
    const cpuUsage = this.calculateAverageCpu(state.cpuSamples);
    const duration =
      state.frames.length > 0
        ? state.frames[state.frames.length - 1].timestamp - state.startTime
        : 0;

    return {
      name: state.animationId,
      frameRate,
      droppedFrames,
      cpuUsage,
      triggersLayout: state.triggersLayout,
      totalFrames: state.frames.length,
      duration,
      timestamp: state.startTime,
    };
  }

  /**
   * Calculate frame rate from frame data
   * Requirements: 9.1
   */
  private calculateFrameRate(frames: FrameData[]): number {
    if (frames.length < 2) {
      return frames.length === 1 ? this.config.targetFps : 0;
    }

    // Calculate average frame duration
    const totalDuration = frames.reduce((sum, f) => sum + f.frameDuration, 0);
    const avgFrameDuration = totalDuration / frames.length;

    // Convert to FPS (1000ms / avgFrameDuration)
    if (avgFrameDuration <= 0) {
      return this.config.targetFps;
    }

    return Math.min(1000 / avgFrameDuration, this.config.targetFps);
  }

  /**
   * Calculate average CPU usage from samples
   */
  private calculateAverageCpu(samples: number[]): number {
    if (samples.length === 0) {
      return 0;
    }
    return samples.reduce((sum, cpu) => sum + cpu, 0) / samples.length;
  }

  /**
   * Calculate average frame rate across all animations
   */
  private calculateAverageFrameRate(animations: AnimationMetrics[]): number {
    if (animations.length === 0) {
      return 0;
    }

    const totalFrameRate = animations.reduce((sum, a) => sum + a.frameRate, 0);
    return totalFrameRate / animations.length;
  }

  /**
   * Generate recommendations based on profiling results
   */
  private generateRecommendations(animations: AnimationMetrics[]): string[] {
    const recommendations: string[] = [];

    for (const animation of animations) {
      // Check for critical frame rate
      if (
        animation.frameRate > 0 &&
        animation.frameRate < this.config.criticalFpsThreshold
      ) {
        recommendations.push(
          `Animation "${
            animation.name
          }" has low frame rate (${animation.frameRate.toFixed(
            1
          )} fps). Consider simplifying the animation or using CSS transforms.`
        );
      }

      // Check for high dropped frames
      if (animation.totalFrames > 0) {
        const dropRate = animation.droppedFrames / animation.totalFrames;
        if (dropRate > 0.1) {
          recommendations.push(
            `Animation "${animation.name}" is dropping ${(
              dropRate * 100
            ).toFixed(1)}% of frames. Consider reducing animation complexity.`
          );
        }
      }

      // Check for layout triggers
      if (animation.triggersLayout) {
        recommendations.push(
          `Animation "${animation.name}" triggers layout recalculation. Use transform and opacity properties instead.`
        );
      }

      // Check for high CPU usage
      if (animation.cpuUsage > this.config.cpuWarningThreshold) {
        recommendations.push(
          `Animation "${
            animation.name
          }" has high CPU usage (${animation.cpuUsage.toFixed(
            1
          )}%). Consider using hardware acceleration.`
        );
      }
    }

    // Check combined CPU usage
    const combinedCpu = this.getCombinedCpuUsage();
    if (combinedCpu > 80) {
      recommendations.push(
        `Combined animation CPU usage is ${combinedCpu.toFixed(
          1
        )}%. Consider reducing the number of concurrent animations.`
      );
    }

    return recommendations;
  }
}

/**
 * Create an AnimationProfiler instance with default config
 */
export function createAnimationProfiler(
  config?: Partial<AnimationProfilerConfig>
): AnimationProfiler {
  return new AnimationProfiler(config);
}
