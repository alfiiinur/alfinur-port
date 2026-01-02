/**
 * Web Vitals Analyzer Unit Tests
 * Tests for Core Web Vitals measurement and analysis
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  WebVitalsAnalyzer,
  createWebVitalsAnalyzer,
  analyzeMetrics,
  WebVitalsMetrics,
  DEFAULT_WEB_VITALS_CONFIG,
} from "../../lib/testing/web-vitals";

describe("WebVitalsAnalyzer", () => {
  let analyzer: WebVitalsAnalyzer;

  beforeEach(() => {
    analyzer = createWebVitalsAnalyzer();
  });

  describe("checkThresholds", () => {
    it("should identify LCP issues when exceeding threshold", () => {
      const metrics: WebVitalsMetrics = {
        lcp: 3000, // Exceeds 2500ms threshold
        fid: 50,
        cls: 0.05,
        ttfb: 500,
        fcp: 1000,
      };

      const issues = analyzer.checkThresholds(metrics);

      expect(issues.length).toBe(1);
      expect(issues[0].metric).toBe("lcp");
      expect(issues[0].value).toBe(3000);
      expect(issues[0].threshold).toBe(
        DEFAULT_WEB_VITALS_CONFIG.lcpThresholdMs
      );
      expect(issues[0].suggestion).toBeDefined();
    });

    it("should identify FID issues when exceeding threshold", () => {
      const metrics: WebVitalsMetrics = {
        lcp: 2000,
        fid: 150, // Exceeds 100ms threshold
        cls: 0.05,
        ttfb: 500,
        fcp: 1000,
      };

      const issues = analyzer.checkThresholds(metrics);

      expect(issues.length).toBe(1);
      expect(issues[0].metric).toBe("fid");
      expect(issues[0].value).toBe(150);
      expect(issues[0].threshold).toBe(
        DEFAULT_WEB_VITALS_CONFIG.fidThresholdMs
      );
    });

    it("should identify CLS issues when exceeding threshold", () => {
      const metrics: WebVitalsMetrics = {
        lcp: 2000,
        fid: 50,
        cls: 0.15, // Exceeds 0.1 threshold
        ttfb: 500,
        fcp: 1000,
      };

      const issues = analyzer.checkThresholds(metrics);

      expect(issues.length).toBe(1);
      expect(issues[0].metric).toBe("cls");
      expect(issues[0].value).toBe(0.15);
      expect(issues[0].threshold).toBe(DEFAULT_WEB_VITALS_CONFIG.clsThreshold);
    });

    it("should identify multiple issues when multiple thresholds exceeded", () => {
      const metrics: WebVitalsMetrics = {
        lcp: 3000, // Exceeds threshold
        fid: 150, // Exceeds threshold
        cls: 0.2, // Exceeds threshold
        ttfb: 500,
        fcp: 1000,
      };

      const issues = analyzer.checkThresholds(metrics);

      expect(issues.length).toBe(3);
      expect(issues.map((i) => i.metric)).toContain("lcp");
      expect(issues.map((i) => i.metric)).toContain("fid");
      expect(issues.map((i) => i.metric)).toContain("cls");
    });

    it("should return no issues when all metrics are within thresholds", () => {
      const metrics: WebVitalsMetrics = {
        lcp: 2000,
        fid: 50,
        cls: 0.05,
        ttfb: 500,
        fcp: 1000,
      };

      const issues = analyzer.checkThresholds(metrics);

      expect(issues.length).toBe(0);
    });
  });

  describe("getMetricRating", () => {
    it("should rate LCP as good when within threshold", () => {
      expect(analyzer.getMetricRating("lcp", 2000)).toBe("good");
    });

    it("should rate LCP as needs-improvement when between thresholds", () => {
      expect(analyzer.getMetricRating("lcp", 3000)).toBe("needs-improvement");
    });

    it("should rate LCP as poor when exceeding poor threshold", () => {
      expect(analyzer.getMetricRating("lcp", 5000)).toBe("poor");
    });

    it("should rate FID correctly", () => {
      expect(analyzer.getMetricRating("fid", 50)).toBe("good");
      expect(analyzer.getMetricRating("fid", 150)).toBe("needs-improvement");
      expect(analyzer.getMetricRating("fid", 400)).toBe("poor");
    });

    it("should rate CLS correctly", () => {
      expect(analyzer.getMetricRating("cls", 0.05)).toBe("good");
      expect(analyzer.getMetricRating("cls", 0.15)).toBe("needs-improvement");
      expect(analyzer.getMetricRating("cls", 0.3)).toBe("poor");
    });
  });

  describe("measure", () => {
    it("should return metrics for a valid URL", async () => {
      const metrics = await analyzer.measure("https://example.com");

      expect(metrics.lcp).toBeGreaterThanOrEqual(0);
      expect(metrics.fid).toBeGreaterThanOrEqual(0);
      expect(metrics.cls).toBeGreaterThanOrEqual(0);
      expect(metrics.ttfb).toBeGreaterThanOrEqual(0);
      expect(metrics.fcp).toBeGreaterThanOrEqual(0);
    });

    it("should throw error for invalid URL", async () => {
      await expect(analyzer.measure("invalid-url")).rejects.toThrow();
    });

    it("should throw error for empty URL", async () => {
      await expect(analyzer.measure("")).rejects.toThrow();
    });
  });

  describe("analyze", () => {
    it("should return complete analysis result", async () => {
      const result = await analyzer.analyze("https://example.com");

      expect(result.url).toBe("https://example.com");
      expect(result.timestamp).toBeGreaterThan(0);
      expect(result.metrics).toBeDefined();
      expect(result.issues).toBeDefined();
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.recommendations).toBeDefined();
    });
  });

  describe("generateReport", () => {
    it("should generate a formatted report", async () => {
      const result = await analyzer.analyze("https://example.com");
      const report = analyzer.generateReport(result);

      expect(report).toContain("WEB VITALS ANALYSIS REPORT");
      expect(report).toContain("https://example.com");
      expect(report).toContain("LCP");
      expect(report).toContain("FID");
      expect(report).toContain("CLS");
    });
  });

  describe("identifyLCPElement", () => {
    it("should return an element selector", async () => {
      const element = await analyzer.identifyLCPElement("https://example.com");

      expect(typeof element).toBe("string");
      expect(element.length).toBeGreaterThan(0);
    });
  });

  describe("identifyCLSElements", () => {
    it("should return an array of element selectors", async () => {
      const elements = await analyzer.identifyCLSElements(
        "https://example.com"
      );

      expect(Array.isArray(elements)).toBe(true);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  describe("identifyBlockingJS", () => {
    it("should return an array of script URLs", async () => {
      const scripts = await analyzer.identifyBlockingJS("https://example.com");

      expect(Array.isArray(scripts)).toBe(true);
    });
  });
});

describe("analyzeMetrics helper", () => {
  it("should analyze metrics and return issues and score", () => {
    const metrics: WebVitalsMetrics = {
      lcp: 2000,
      fid: 50,
      cls: 0.05,
      ttfb: 500,
      fcp: 1000,
    };

    const result = analyzeMetrics(metrics);

    expect(result.issues).toBeDefined();
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("should return lower score for poor metrics", () => {
    const goodMetrics: WebVitalsMetrics = {
      lcp: 2000,
      fid: 50,
      cls: 0.05,
      ttfb: 500,
      fcp: 1000,
    };

    const poorMetrics: WebVitalsMetrics = {
      lcp: 5000,
      fid: 400,
      cls: 0.3,
      ttfb: 2000,
      fcp: 3000,
    };

    const goodResult = analyzeMetrics(goodMetrics);
    const poorResult = analyzeMetrics(poorMetrics);

    expect(goodResult.score).toBeGreaterThan(poorResult.score);
  });
});
