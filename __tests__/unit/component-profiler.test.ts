/**
 * Unit tests for Component Profiler
 * Tests core functionality of render time recording and detection algorithms
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  ComponentProfiler,
  createComponentProfiler,
  DEFAULT_COMPONENT_PROFILER_CONFIG,
} from "../../lib/testing/component-profiler";

describe("ComponentProfiler", () => {
  let profiler: ComponentProfiler;

  beforeEach(() => {
    profiler = createComponentProfiler();
  });

  describe("startProfiling and stopProfiling", () => {
    it("should start and stop profiling correctly", () => {
      expect(profiler.isProfiling()).toBe(false);

      profiler.startProfiling();
      expect(profiler.isProfiling()).toBe(true);

      const result = profiler.stopProfiling();
      expect(profiler.isProfiling()).toBe(false);
      expect(result).toBeDefined();
      expect(result.metrics).toEqual([]);
    });
  });

  describe("recordRender", () => {
    it("should record render events", () => {
      profiler.startProfiling();
      profiler.recordRender("TestComponent", 10);
      profiler.recordRender("TestComponent", 15);
      profiler.recordRender("AnotherComponent", 5);

      const result = profiler.stopProfiling();

      expect(result.metrics).toHaveLength(2);
      expect(
        result.metrics.find((m) => m.componentName === "TestComponent")
          ?.renderCount
      ).toBe(2);
      expect(
        result.metrics.find((m) => m.componentName === "AnotherComponent")
          ?.renderCount
      ).toBe(1);
    });

    it("should ensure render time is non-negative", () => {
      profiler.startProfiling();
      profiler.recordRender("TestComponent", -5);

      const events = profiler.getRenderEvents();
      expect(events[0].duration).toBe(0);
    });
  });

  describe("getSlowComponents", () => {
    it("should identify components with render time exceeding threshold", () => {
      profiler.startProfiling();
      profiler.recordRender("SlowComponent", 20); // > 16ms
      profiler.recordRender("FastComponent", 10); // < 16ms
      profiler.recordRender("VerySlowComponent", 50); // > 16ms

      const slowComponents = profiler.getSlowComponents();

      expect(slowComponents).toContain("SlowComponent");
      expect(slowComponents).toContain("VerySlowComponent");
      expect(slowComponents).not.toContain("FastComponent");
    });

    it("should use custom threshold when provided", () => {
      profiler.startProfiling();
      profiler.recordRender("Component", 15);

      expect(profiler.getSlowComponents(10)).toContain("Component");
      expect(profiler.getSlowComponents(20)).not.toContain("Component");
    });
  });

  describe("getExcessiveRerenders", () => {
    it("should identify components with excessive re-renders", () => {
      profiler.startProfiling();

      const now = Date.now();
      // Simulate 6 renders within 1 second (exceeds threshold of 5)
      for (let i = 0; i < 6; i++) {
        profiler.recordRender("FrequentComponent", 5);
      }

      const excessive = profiler.getExcessiveRerenders();
      expect(excessive).toContain("FrequentComponent");
    });

    it("should not flag components with renders below threshold", () => {
      profiler.startProfiling();

      // Only 3 renders (below threshold of 5)
      for (let i = 0; i < 3; i++) {
        profiler.recordRender("NormalComponent", 5);
      }

      const excessive = profiler.getExcessiveRerenders();
      expect(excessive).not.toContain("NormalComponent");
    });
  });

  describe("rankedByRenderTime", () => {
    it("should rank components by total render time in descending order", () => {
      profiler.startProfiling();
      profiler.recordRender("ComponentA", 10);
      profiler.recordRender("ComponentA", 10); // Total: 20
      profiler.recordRender("ComponentB", 50); // Total: 50
      profiler.recordRender("ComponentC", 5); // Total: 5

      const result = profiler.stopProfiling();

      expect(result.rankedByRenderTime[0].componentName).toBe("ComponentB");
      expect(result.rankedByRenderTime[1].componentName).toBe("ComponentA");
      expect(result.rankedByRenderTime[2].componentName).toBe("ComponentC");
    });

    it("should be sorted in descending order", () => {
      profiler.startProfiling();
      profiler.recordRender("A", 100);
      profiler.recordRender("B", 50);
      profiler.recordRender("C", 75);

      const result = profiler.stopProfiling();

      for (let i = 1; i < result.rankedByRenderTime.length; i++) {
        expect(result.rankedByRenderTime[i].renderTime).toBeLessThanOrEqual(
          result.rankedByRenderTime[i - 1].renderTime
        );
      }
    });
  });

  describe("reset", () => {
    it("should clear all recorded metrics", () => {
      profiler.startProfiling();
      profiler.recordRender("TestComponent", 10);
      profiler.reset();

      expect(profiler.isProfiling()).toBe(false);
      expect(profiler.getRenderEvents()).toEqual([]);
    });
  });

  describe("getAggregatedMetrics", () => {
    it("should calculate aggregated metrics correctly", () => {
      profiler.startProfiling();
      profiler.recordRender("TestComponent", 10);
      profiler.recordRender("TestComponent", 20);
      profiler.recordRender("TestComponent", 30);

      const aggregated = profiler.getAggregatedMetrics();
      const testMetrics = aggregated.find(
        (m) => m.componentName === "TestComponent"
      );

      expect(testMetrics).toBeDefined();
      expect(testMetrics?.totalRenderTime).toBe(60);
      expect(testMetrics?.averageRenderTime).toBe(20);
      expect(testMetrics?.maxRenderTime).toBe(30);
      expect(testMetrics?.minRenderTime).toBe(10);
      expect(testMetrics?.renderCount).toBe(3);
    });
  });
});
