/**
 * Bundle Analyzer Types
 * Defines interfaces for bundle analysis results, module information, and warnings
 * Requirements: 1.1
 */

/**
 * Information about a single module in the bundle
 */
export interface ModuleInfo {
  /** Module name (e.g., 'react', 'lodash', or local module path) */
  name: string;
  /** Raw size in bytes */
  size: number;
  /** Gzipped size in bytes */
  gzippedSize: number;
  /** Whether this is a third-party (node_modules) dependency */
  isThirdParty: boolean;
  /** File path relative to project root */
  path: string;
}

/**
 * Warning severity levels
 */
export type WarningSeverity = "low" | "medium" | "high";

/**
 * Types of bundle warnings
 */
export type WarningType = "size" | "third-party" | "unused";

/**
 * A warning generated during bundle analysis
 */
export interface BundleWarning {
  /** Type of warning */
  type: WarningType;
  /** Human-readable warning message */
  message: string;
  /** Module that triggered the warning */
  module: string;
  /** Severity level of the warning */
  severity: WarningSeverity;
}

/**
 * Complete result of a bundle analysis
 */
export interface BundleAnalysisResult {
  /** Total bundle size in bytes (uncompressed) */
  totalSize: number;
  /** Total gzipped size in bytes */
  gzippedSize: number;
  /** List of all modules in the bundle */
  modules: ModuleInfo[];
  /** Warnings generated during analysis */
  warnings: BundleWarning[];
  /** Optimization recommendations */
  recommendations: string[];
}

/**
 * Configuration options for bundle analysis
 */
export interface BundleAnalyzerConfig {
  /** Size threshold in KB for warning (default: 250KB gzipped) */
  sizeThresholdKB: number;
  /** Third-party percentage threshold for lazy loading recommendation (default: 50%) */
  thirdPartyThreshold: number;
  /** Path to webpack stats file or build directory */
  buildPath: string;
}

/**
 * Default configuration values
 */
export const DEFAULT_BUNDLE_ANALYZER_CONFIG: BundleAnalyzerConfig = {
  sizeThresholdKB: 250,
  thirdPartyThreshold: 0.5,
  buildPath: ".next",
};

/**
 * Webpack stats module structure (simplified)
 */
export interface WebpackStatsModule {
  name: string;
  size: number;
  id?: string | number;
  identifier?: string;
  chunks?: (string | number)[];
  issuerPath?: { name: string }[];
}

/**
 * Webpack stats chunk structure (simplified)
 */
export interface WebpackStatsChunk {
  id: string | number;
  names: string[];
  size: number;
  modules?: WebpackStatsModule[];
  files?: string[];
}

/**
 * Webpack stats structure (simplified for our needs)
 */
export interface WebpackStats {
  chunks?: WebpackStatsChunk[];
  modules?: WebpackStatsModule[];
  assets?: { name: string; size: number }[];
}

/**
 * Interface for the BundleAnalyzer
 */
export interface IBundleAnalyzer {
  /**
   * Analyze the bundle at the given build path
   * @param buildPath Path to the build directory or webpack stats file
   * @returns Analysis result with modules, warnings, and recommendations
   */
  analyze(buildPath: string): Promise<BundleAnalysisResult>;

  /**
   * Generate a human-readable report from analysis results
   * @param result The analysis result to format
   * @returns Formatted report string
   */
  generateReport(result: BundleAnalysisResult): string;

  /**
   * Check thresholds and generate warnings
   * @param result The analysis result to check
   * @returns Array of warnings for threshold violations
   */
  checkThresholds(result: BundleAnalysisResult): BundleWarning[];
}
