/**
 * Bundle Analyzer Implementation
 * Analyzes webpack bundle stats to identify large modules and optimization opportunities
 * Requirements: 1.1, 1.3
 */

import * as fs from "fs";
import * as path from "path";
import { gzipSync } from "zlib";
import {
  BundleAnalysisResult,
  BundleWarning,
  ModuleInfo,
  IBundleAnalyzer,
  WebpackStats,
  WebpackStatsModule,
  DEFAULT_BUNDLE_ANALYZER_CONFIG,
  BundleAnalyzerConfig,
  WarningSeverity,
} from "./types";

/**
 * Calculate gzipped size of content
 */
function calculateGzippedSize(size: number): number {
  // Estimate gzipped size as ~30-40% of original for JS
  // This is an approximation when we don't have actual content
  return Math.floor(size * 0.35);
}

/**
 * Determine if a module is from node_modules (third-party)
 */
function isThirdPartyModule(modulePath: string): boolean {
  return (
    modulePath.includes("node_modules") ||
    modulePath.startsWith("(webpack)") ||
    modulePath.includes("/node_modules/")
  );
}

/**
 * Extract clean module name from path
 */
function extractModuleName(modulePath: string): string {
  // Handle node_modules packages
  const nodeModulesMatch = modulePath.match(
    /node_modules\/(@[^/]+\/[^/]+|[^/]+)/
  );
  if (nodeModulesMatch) {
    return nodeModulesMatch[1];
  }

  // Handle local modules - get the file name
  const parts = modulePath.split("/");
  const fileName = parts[parts.length - 1];
  return fileName || modulePath;
}

/**
 * Parse webpack stats from various formats
 */
function parseWebpackStats(statsPath: string): WebpackStats | null {
  try {
    if (fs.existsSync(statsPath)) {
      const content = fs.readFileSync(statsPath, "utf-8");
      return JSON.parse(content) as WebpackStats;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Find webpack stats file in build directory
 */
function findStatsFile(buildPath: string): string | null {
  const possiblePaths = [
    path.join(buildPath, "webpack-stats.json"),
    path.join(buildPath, "stats.json"),
    path.join(buildPath, ".next", "webpack-stats.json"),
    path.join(buildPath, "build-manifest.json"),
    path.join(buildPath, ".next", "build-manifest.json"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

/**
 * Convert webpack stats modules to ModuleInfo array
 */
function convertModules(statsModules: WebpackStatsModule[]): ModuleInfo[] {
  const moduleMap = new Map<string, ModuleInfo>();

  for (const mod of statsModules) {
    const modulePath = mod.name || mod.identifier || "";
    const name = extractModuleName(modulePath);
    const size = mod.size || 0;
    const isThirdParty = isThirdPartyModule(modulePath);

    // Aggregate modules with same name
    const existing = moduleMap.get(name);
    if (existing) {
      existing.size += size;
      existing.gzippedSize = calculateGzippedSize(existing.size);
    } else {
      moduleMap.set(name, {
        name,
        size,
        gzippedSize: calculateGzippedSize(size),
        isThirdParty,
        path: modulePath,
      });
    }
  }

  return Array.from(moduleMap.values()).sort((a, b) => b.size - a.size);
}

/**
 * BundleAnalyzer class implementation
 */
export class BundleAnalyzer implements IBundleAnalyzer {
  private config: BundleAnalyzerConfig;

  constructor(config: Partial<BundleAnalyzerConfig> = {}) {
    this.config = { ...DEFAULT_BUNDLE_ANALYZER_CONFIG, ...config };
  }

  /**
   * Analyze the bundle at the given build path
   * Requirements: 1.1
   */
  async analyze(buildPath: string): Promise<BundleAnalysisResult> {
    const resolvedPath = path.resolve(buildPath);

    // Try to find and parse webpack stats
    let stats: WebpackStats | null = null;

    if (
      fs.existsSync(resolvedPath) &&
      fs.statSync(resolvedPath).isDirectory()
    ) {
      const statsFile = findStatsFile(resolvedPath);
      if (statsFile) {
        stats = parseWebpackStats(statsFile);
      }
    } else if (fs.existsSync(resolvedPath)) {
      stats = parseWebpackStats(resolvedPath);
    }

    // If no stats found, try to analyze .next directory structure
    if (!stats) {
      return this.analyzeNextBuild(resolvedPath);
    }

    // Convert stats to our format
    const modules = this.extractModulesFromStats(stats);
    const totalSize = modules.reduce((sum, m) => sum + m.size, 0);
    const gzippedSize = modules.reduce((sum, m) => sum + m.gzippedSize, 0);

    const result: BundleAnalysisResult = {
      totalSize,
      gzippedSize,
      modules,
      warnings: [],
      recommendations: [],
    };

    // Check thresholds and add warnings
    result.warnings = this.checkThresholds(result);

    // Generate recommendations
    result.recommendations = this.generateRecommendations(result);

    return result;
  }

  /**
   * Extract modules from webpack stats
   */
  private extractModulesFromStats(stats: WebpackStats): ModuleInfo[] {
    const allModules: WebpackStatsModule[] = [];

    // Get modules from chunks
    if (stats.chunks) {
      for (const chunk of stats.chunks) {
        if (chunk.modules) {
          allModules.push(...chunk.modules);
        }
      }
    }

    // Get top-level modules
    if (stats.modules) {
      allModules.push(...stats.modules);
    }

    return convertModules(allModules);
  }

  /**
   * Analyze Next.js build directory when no stats file is available
   */
  private async analyzeNextBuild(
    buildPath: string
  ): Promise<BundleAnalysisResult> {
    const modules: ModuleInfo[] = [];
    const nextPath = path.join(buildPath, ".next");
    const staticPath = path.join(nextPath, "static");

    // Analyze static chunks if they exist
    if (fs.existsSync(staticPath)) {
      const chunks = this.findJsFiles(staticPath);
      for (const chunk of chunks) {
        const stats = fs.statSync(chunk);
        const content = fs.readFileSync(chunk);
        const gzipped = gzipSync(content);

        modules.push({
          name: path.basename(chunk),
          size: stats.size,
          gzippedSize: gzipped.length,
          isThirdParty: chunk.includes("node_modules"),
          path: chunk,
        });
      }
    }

    const totalSize = modules.reduce((sum, m) => sum + m.size, 0);
    const gzippedSize = modules.reduce((sum, m) => sum + m.gzippedSize, 0);

    const result: BundleAnalysisResult = {
      totalSize,
      gzippedSize,
      modules: modules.sort((a, b) => b.size - a.size),
      warnings: [],
      recommendations: [],
    };

    result.warnings = this.checkThresholds(result);
    result.recommendations = this.generateRecommendations(result);

    return result;
  }

  /**
   * Recursively find all JS files in a directory
   */
  private findJsFiles(dir: string): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...this.findJsFiles(fullPath));
      } else if (entry.name.endsWith(".js")) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Check thresholds and generate warnings
   * Requirements: 1.2
   */
  checkThresholds(result: BundleAnalysisResult): BundleWarning[] {
    const warnings: BundleWarning[] = [];
    const thresholdBytes = this.config.sizeThresholdKB * 1024;

    // Check total gzipped size threshold (250KB)
    if (result.gzippedSize > thresholdBytes) {
      const largestModules = result.modules
        .slice(0, 5)
        .map((m) => `${m.name} (${formatBytes(m.gzippedSize)})`)
        .join(", ");

      warnings.push({
        type: "size",
        message: `Bundle gzipped size (${formatBytes(
          result.gzippedSize
        )}) exceeds ${
          this.config.sizeThresholdKB
        }KB threshold. Largest modules: ${largestModules}`,
        module: "bundle",
        severity: "high",
      });
    }

    // Check individual large modules
    for (const mod of result.modules) {
      if (mod.gzippedSize > thresholdBytes / 2) {
        warnings.push({
          type: "size",
          message: `Module "${mod.name}" is ${formatBytes(
            mod.gzippedSize
          )} gzipped`,
          module: mod.name,
          severity: this.getSeverityForSize(mod.gzippedSize, thresholdBytes),
        });
      }
    }

    // Check third-party dependency ratio
    const thirdPartySize = result.modules
      .filter((m) => m.isThirdParty)
      .reduce((sum, m) => sum + m.size, 0);

    const thirdPartyRatio =
      result.totalSize > 0 ? thirdPartySize / result.totalSize : 0;

    if (thirdPartyRatio > this.config.thirdPartyThreshold) {
      warnings.push({
        type: "third-party",
        message: `Third-party dependencies make up ${(
          thirdPartyRatio * 100
        ).toFixed(1)}% of the bundle (threshold: ${
          this.config.thirdPartyThreshold * 100
        }%)`,
        module: "third-party",
        severity: "medium",
      });
    }

    return warnings;
  }

  /**
   * Get severity level based on size relative to threshold
   */
  private getSeverityForSize(size: number, threshold: number): WarningSeverity {
    if (size > threshold) return "high";
    if (size > threshold * 0.75) return "medium";
    return "low";
  }

  /**
   * Generate optimization recommendations
   * Requirements: 1.4
   */
  generateRecommendations(result: BundleAnalysisResult): string[] {
    const recommendations: string[] = [];

    // Check third-party ratio for lazy loading recommendation
    const thirdPartySize = result.modules
      .filter((m) => m.isThirdParty)
      .reduce((sum, m) => sum + m.size, 0);

    const thirdPartyRatio =
      result.totalSize > 0 ? thirdPartySize / result.totalSize : 0;

    if (thirdPartyRatio > this.config.thirdPartyThreshold) {
      recommendations.push(
        "Consider lazy loading large third-party dependencies using dynamic imports"
      );

      // Identify specific large third-party modules
      const largeThirdParty = result.modules
        .filter((m) => m.isThirdParty && m.gzippedSize > 50 * 1024)
        .slice(0, 3);

      for (const mod of largeThirdParty) {
        recommendations.push(
          `Consider lazy loading "${mod.name}" (${formatBytes(
            mod.gzippedSize
          )} gzipped)`
        );
      }
    }

    // Check for commonly tree-shakeable libraries
    const treeShakeableLibs = ["lodash", "moment", "date-fns", "rxjs"];
    for (const mod of result.modules) {
      if (
        treeShakeableLibs.some(
          (lib) => mod.name === lib || mod.name.startsWith(lib + "/")
        )
      ) {
        if (mod.name === "lodash") {
          recommendations.push(
            'Consider using "lodash-es" or individual lodash imports for better tree-shaking'
          );
        } else if (mod.name === "moment") {
          recommendations.push(
            'Consider replacing "moment" with "date-fns" or "dayjs" for smaller bundle size'
          );
        }
      }
    }

    // Large bundle recommendation
    const thresholdBytes = this.config.sizeThresholdKB * 1024;
    if (result.gzippedSize > thresholdBytes) {
      recommendations.push(
        "Consider code splitting to reduce initial bundle size"
      );
      recommendations.push(
        "Review and remove unused dependencies from package.json"
      );
    }

    return recommendations;
  }

  /**
   * Generate a human-readable report from analysis results
   */
  generateReport(result: BundleAnalysisResult): string {
    const lines: string[] = [];

    lines.push("=".repeat(60));
    lines.push("BUNDLE ANALYSIS REPORT");
    lines.push("=".repeat(60));
    lines.push("");

    // Summary
    lines.push("SUMMARY");
    lines.push("-".repeat(40));
    lines.push(`Total Size: ${formatBytes(result.totalSize)}`);
    lines.push(`Gzipped Size: ${formatBytes(result.gzippedSize)}`);
    lines.push(`Total Modules: ${result.modules.length}`);
    lines.push("");

    // Third-party breakdown
    const thirdParty = result.modules.filter((m) => m.isThirdParty);
    const firstParty = result.modules.filter((m) => !m.isThirdParty);
    const thirdPartySize = thirdParty.reduce((sum, m) => sum + m.size, 0);
    const firstPartySize = firstParty.reduce((sum, m) => sum + m.size, 0);

    lines.push("BREAKDOWN");
    lines.push("-".repeat(40));
    lines.push(
      `Third-party: ${formatBytes(thirdPartySize)} (${(
        (thirdPartySize / result.totalSize) *
        100
      ).toFixed(1)}%)`
    );
    lines.push(
      `First-party: ${formatBytes(firstPartySize)} (${(
        (firstPartySize / result.totalSize) *
        100
      ).toFixed(1)}%)`
    );
    lines.push("");

    // Top modules
    lines.push("TOP 10 LARGEST MODULES");
    lines.push("-".repeat(40));
    for (const mod of result.modules.slice(0, 10)) {
      const type = mod.isThirdParty ? "[3rd]" : "[1st]";
      lines.push(
        `${type} ${mod.name}: ${formatBytes(mod.size)} (${formatBytes(
          mod.gzippedSize
        )} gzipped)`
      );
    }
    lines.push("");

    // Warnings
    if (result.warnings.length > 0) {
      lines.push("WARNINGS");
      lines.push("-".repeat(40));
      for (const warning of result.warnings) {
        const icon =
          warning.severity === "high"
            ? "🔴"
            : warning.severity === "medium"
            ? "🟡"
            : "🟢";
        lines.push(
          `${icon} [${warning.type.toUpperCase()}] ${warning.message}`
        );
      }
      lines.push("");
    }

    // Recommendations
    if (result.recommendations.length > 0) {
      lines.push("RECOMMENDATIONS");
      lines.push("-".repeat(40));
      for (const rec of result.recommendations) {
        lines.push(`• ${rec}`);
      }
      lines.push("");
    }

    lines.push("=".repeat(60));

    return lines.join("\n");
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Create a BundleAnalyzer instance with default config
 */
export function createBundleAnalyzer(
  config?: Partial<BundleAnalyzerConfig>
): BundleAnalyzer {
  return new BundleAnalyzer(config);
}

/**
 * Analyze bundle from modules data directly (useful for testing)
 */
export function analyzeModules(
  modules: ModuleInfo[],
  config?: Partial<BundleAnalyzerConfig>
): BundleAnalysisResult {
  const analyzer = new BundleAnalyzer(config);
  const totalSize = modules.reduce((sum, m) => sum + m.size, 0);
  const gzippedSize = modules.reduce((sum, m) => sum + m.gzippedSize, 0);

  const result: BundleAnalysisResult = {
    totalSize,
    gzippedSize,
    modules: [...modules].sort((a, b) => b.size - a.size),
    warnings: [],
    recommendations: [],
  };

  result.warnings = analyzer.checkThresholds(result);
  result.recommendations = analyzer.generateRecommendations(result);

  return result;
}
