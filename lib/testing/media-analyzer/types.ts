/**
 * Media Asset Analyzer Types
 * Defines interfaces for media analysis results, asset information, and warnings
 * Requirements: 6.1, 6.2, 6.3
 */

/**
 * Types of media assets
 */
export type MediaType = "image" | "video" | "audio";

/**
 * Warning severity levels
 */
export type MediaWarningSeverity = "low" | "medium" | "high";

/**
 * Types of media warnings
 */
export type MediaWarningType =
  | "oversized" // Image larger than threshold
  | "missing-dimensions" // Missing width/height attributes (CLS)
  | "missing-lazy-load" // Video without lazy loading
  | "unoptimized-format" // Not using modern formats (webp, avif)
  | "missing-alt"; // Missing alt text for accessibility

/**
 * Information about a single media asset
 */
export interface MediaAsset {
  /** File path or URL of the asset */
  src: string;
  /** Type of media (image, video, audio) */
  type: MediaType;
  /** File size in bytes */
  size: number;
  /** Whether the asset has width attribute */
  hasWidth: boolean;
  /** Whether the asset has height attribute */
  hasHeight: boolean;
  /** Whether lazy loading is enabled */
  hasLazyLoading: boolean;
  /** Alt text for images (undefined if not applicable or missing) */
  alt?: string;
  /** Image format (jpg, png, webp, avif, etc.) */
  format?: string;
  /** Natural width of the image (if available) */
  naturalWidth?: number;
  /** Natural height of the image (if available) */
  naturalHeight?: number;
  /** Element tag name (img, video, picture, etc.) */
  element: string;
}

/**
 * A warning generated during media analysis
 */
export interface MediaWarning {
  /** Type of warning */
  type: MediaWarningType;
  /** Human-readable warning message */
  message: string;
  /** Asset that triggered the warning */
  asset: string;
  /** Severity level of the warning */
  severity: MediaWarningSeverity;
  /** Suggested fix for the issue */
  suggestion: string;
}

/**
 * Complete result of a media analysis
 */
export interface MediaAnalysisResult {
  /** Total number of media assets analyzed */
  totalAssets: number;
  /** Total size of all media assets in bytes */
  totalSize: number;
  /** List of all media assets found */
  assets: MediaAsset[];
  /** Warnings generated during analysis */
  warnings: MediaWarning[];
  /** Optimization recommendations */
  recommendations: string[];
  /** Breakdown by media type */
  breakdown: {
    images: { count: number; size: number };
    videos: { count: number; size: number };
    audio: { count: number; size: number };
  };
}

/**
 * Configuration options for media analysis
 */
export interface MediaAnalyzerConfig {
  /** Size threshold in KB for image warning (default: 500KB) */
  imageSizeThresholdKB: number;
  /** Size threshold in KB for video warning (default: 5000KB / 5MB) */
  videoSizeThresholdKB: number;
  /** Whether to check for missing dimensions (CLS) */
  checkDimensions: boolean;
  /** Whether to check for lazy loading on videos */
  checkLazyLoading: boolean;
  /** Whether to check for modern image formats */
  checkModernFormats: boolean;
  /** Whether to check for alt text */
  checkAltText: boolean;
}

/**
 * Default configuration values
 */
export const DEFAULT_MEDIA_ANALYZER_CONFIG: MediaAnalyzerConfig = {
  imageSizeThresholdKB: 500,
  videoSizeThresholdKB: 5000,
  checkDimensions: true,
  checkLazyLoading: true,
  checkModernFormats: true,
  checkAltText: true,
};

/**
 * Interface for the MediaAnalyzer
 */
export interface IMediaAnalyzer {
  /**
   * Analyze media assets from HTML content or file paths
   * @param source HTML content string or array of file paths
   * @returns Analysis result with assets, warnings, and recommendations
   */
  analyze(source: string | string[]): Promise<MediaAnalysisResult>;

  /**
   * Analyze a single media asset
   * @param asset The media asset to analyze
   * @returns Array of warnings for this asset
   */
  analyzeAsset(asset: MediaAsset): MediaWarning[];

  /**
   * Check image size against threshold
   * @param asset The image asset to check
   * @returns Warning if oversized, null otherwise
   */
  checkImageSize(asset: MediaAsset): MediaWarning | null;

  /**
   * Check for missing dimension attributes (CLS prevention)
   * @param asset The media asset to check
   * @returns Warning if dimensions missing, null otherwise
   */
  checkDimensions(asset: MediaAsset): MediaWarning | null;

  /**
   * Check video lazy loading implementation
   * @param asset The video asset to check
   * @returns Warning if lazy loading missing, null otherwise
   */
  checkVideoLazyLoading(asset: MediaAsset): MediaWarning | null;

  /**
   * Generate a human-readable report from analysis results
   * @param result The analysis result to format
   * @returns Formatted report string
   */
  generateReport(result: MediaAnalysisResult): string;
}
