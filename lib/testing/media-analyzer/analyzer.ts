/**
 * Media Asset Analyzer Implementation
 * Analyzes media assets to identify optimization opportunities
 * Requirements: 6.1, 6.2, 6.3
 */

import * as fs from "fs";
import * as path from "path";
import {
  MediaAnalysisResult,
  MediaWarning,
  MediaAsset,
  MediaType,
  MediaWarningType,
  MediaWarningSeverity,
  IMediaAnalyzer,
  MediaAnalyzerConfig,
  DEFAULT_MEDIA_ANALYZER_CONFIG,
} from "./types";

/**
 * Image file extensions
 */
const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
  ".ico",
  ".bmp",
];

/**
 * Video file extensions
 */
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];

/**
 * Audio file extensions
 */
const AUDIO_EXTENSIONS = [".mp3", ".wav", ".ogg", ".aac", ".flac"];

/**
 * Modern image formats that are optimized
 */
const MODERN_IMAGE_FORMATS = ["webp", "avif"];

/**
 * Get media type from file extension
 */
function getMediaType(filePath: string): MediaType | null {
  const ext = path.extname(filePath).toLowerCase();
  if (IMAGE_EXTENSIONS.includes(ext)) return "image";
  if (VIDEO_EXTENSIONS.includes(ext)) return "video";
  if (AUDIO_EXTENSIONS.includes(ext)) return "audio";
  return null;
}

/**
 * Get image format from file path
 */
function getImageFormat(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase().replace(".", "");
  if (ext === "jpg") return "jpeg";
  return ext;
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
 * Parse HTML content to extract media elements
 */
function parseHtmlForMedia(html: string): Partial<MediaAsset>[] {
  const assets: Partial<MediaAsset>[] = [];

  // Parse img tags
  const imgRegex = /<img\s+([^>]*?)(?:\/>|>)/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const attrs = match[1];
    const src = extractAttribute(attrs, "src");
    if (src) {
      assets.push({
        src,
        type: "image",
        element: "img",
        hasWidth: hasAttribute(attrs, "width"),
        hasHeight: hasAttribute(attrs, "height"),
        hasLazyLoading: extractAttribute(attrs, "loading") === "lazy",
        alt: extractAttribute(attrs, "alt"),
        format: getImageFormat(src),
      });
    }
  }

  // Parse video tags
  const videoRegex = /<video\s+([^>]*?)(?:\/>|>)/gi;
  while ((match = videoRegex.exec(html)) !== null) {
    const attrs = match[1];
    const src = extractAttribute(attrs, "src");
    const poster = extractAttribute(attrs, "poster");
    assets.push({
      src: src || poster || "inline-video",
      type: "video",
      element: "video",
      hasWidth: hasAttribute(attrs, "width"),
      hasHeight: hasAttribute(attrs, "height"),
      hasLazyLoading:
        hasAttribute(attrs, "preload") &&
        extractAttribute(attrs, "preload") !== "auto",
    });
  }

  // Parse source tags within video/picture
  const sourceRegex = /<source\s+([^>]*?)(?:\/>|>)/gi;
  while ((match = sourceRegex.exec(html)) !== null) {
    const attrs = match[1];
    const src =
      extractAttribute(attrs, "src") || extractAttribute(attrs, "srcset");
    const type = extractAttribute(attrs, "type");
    if (src) {
      const mediaType = type?.startsWith("video/")
        ? "video"
        : type?.startsWith("audio/")
        ? "audio"
        : getMediaType(src);
      if (mediaType) {
        assets.push({
          src,
          type: mediaType,
          element: "source",
          hasWidth: false,
          hasHeight: false,
          hasLazyLoading: false,
          format: mediaType === "image" ? getImageFormat(src) : undefined,
        });
      }
    }
  }

  return assets;
}

/**
 * Extract attribute value from HTML attributes string
 */
function extractAttribute(attrs: string, name: string): string | undefined {
  const regex = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i");
  const match = attrs.match(regex);
  return match ? match[1] : undefined;
}

/**
 * Check if attribute exists in HTML attributes string
 */
function hasAttribute(attrs: string, name: string): boolean {
  const regex = new RegExp(`\\b${name}\\b`, "i");
  return regex.test(attrs);
}

/**
 * MediaAnalyzer class implementation
 */
export class MediaAnalyzer implements IMediaAnalyzer {
  private config: MediaAnalyzerConfig;

  constructor(config: Partial<MediaAnalyzerConfig> = {}) {
    this.config = { ...DEFAULT_MEDIA_ANALYZER_CONFIG, ...config };
  }

  /**
   * Analyze media assets from HTML content or file paths
   * Requirements: 6.1, 6.2, 6.3
   */
  async analyze(source: string | string[]): Promise<MediaAnalysisResult> {
    let assets: MediaAsset[] = [];

    if (typeof source === "string") {
      // Check if it's HTML content or a file path
      if (source.includes("<") && source.includes(">")) {
        // HTML content
        const partialAssets = parseHtmlForMedia(source);
        assets = await this.enrichAssets(partialAssets);
      } else {
        // Single file or directory path
        assets = await this.analyzeFileSystem([source]);
      }
    } else {
      // Array of file paths
      assets = await this.analyzeFileSystem(source);
    }

    // Calculate totals and breakdown
    const breakdown = {
      images: { count: 0, size: 0 },
      videos: { count: 0, size: 0 },
      audio: { count: 0, size: 0 },
    };

    for (const asset of assets) {
      if (asset.type === "image") {
        breakdown.images.count++;
        breakdown.images.size += asset.size;
      } else if (asset.type === "video") {
        breakdown.videos.count++;
        breakdown.videos.size += asset.size;
      } else if (asset.type === "audio") {
        breakdown.audio.count++;
        breakdown.audio.size += asset.size;
      }
    }

    const totalSize = assets.reduce((sum, a) => sum + a.size, 0);

    // Analyze each asset for warnings
    const warnings: MediaWarning[] = [];
    for (const asset of assets) {
      warnings.push(...this.analyzeAsset(asset));
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(assets, warnings);

    return {
      totalAssets: assets.length,
      totalSize,
      assets,
      warnings,
      recommendations,
      breakdown,
    };
  }

  /**
   * Analyze file system for media assets
   */
  private async analyzeFileSystem(paths: string[]): Promise<MediaAsset[]> {
    const assets: MediaAsset[] = [];

    for (const p of paths) {
      const resolvedPath = path.resolve(p);

      if (!fs.existsSync(resolvedPath)) {
        continue;
      }

      const stat = fs.statSync(resolvedPath);

      if (stat.isDirectory()) {
        const files = this.findMediaFiles(resolvedPath);
        for (const file of files) {
          const asset = await this.createAssetFromFile(file);
          if (asset) {
            assets.push(asset);
          }
        }
      } else {
        const asset = await this.createAssetFromFile(resolvedPath);
        if (asset) {
          assets.push(asset);
        }
      }
    }

    return assets;
  }

  /**
   * Recursively find all media files in a directory
   */
  private findMediaFiles(dir: string): string[] {
    const files: string[] = [];
    const allExtensions = [
      ...IMAGE_EXTENSIONS,
      ...VIDEO_EXTENSIONS,
      ...AUDIO_EXTENSIONS,
    ];

    if (!fs.existsSync(dir)) {
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Skip node_modules and hidden directories
        if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
          files.push(...this.findMediaFiles(fullPath));
        }
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (allExtensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }

    return files;
  }

  /**
   * Create MediaAsset from file path
   */
  private async createAssetFromFile(
    filePath: string
  ): Promise<MediaAsset | null> {
    const mediaType = getMediaType(filePath);
    if (!mediaType) {
      return null;
    }

    const stat = fs.statSync(filePath);

    return {
      src: filePath,
      type: mediaType,
      size: stat.size,
      hasWidth: false, // File system analysis can't determine HTML attributes
      hasHeight: false,
      hasLazyLoading: false,
      format: mediaType === "image" ? getImageFormat(filePath) : undefined,
      element:
        mediaType === "image"
          ? "img"
          : mediaType === "video"
          ? "video"
          : "audio",
    };
  }

  /**
   * Enrich partial assets with file size information
   */
  private async enrichAssets(
    partialAssets: Partial<MediaAsset>[]
  ): Promise<MediaAsset[]> {
    const assets: MediaAsset[] = [];

    for (const partial of partialAssets) {
      if (!partial.src || !partial.type) {
        continue;
      }

      let size = 0;

      // Try to get file size if it's a local path
      if (!partial.src.startsWith("http") && !partial.src.startsWith("//")) {
        const resolvedPath = path.resolve(partial.src);
        if (fs.existsSync(resolvedPath)) {
          const stat = fs.statSync(resolvedPath);
          size = stat.size;
        }
      }

      assets.push({
        src: partial.src,
        type: partial.type,
        size,
        hasWidth: partial.hasWidth ?? false,
        hasHeight: partial.hasHeight ?? false,
        hasLazyLoading: partial.hasLazyLoading ?? false,
        alt: partial.alt,
        format: partial.format,
        naturalWidth: partial.naturalWidth,
        naturalHeight: partial.naturalHeight,
        element: partial.element ?? "unknown",
      });
    }

    return assets;
  }

  /**
   * Analyze a single media asset for issues
   */
  analyzeAsset(asset: MediaAsset): MediaWarning[] {
    const warnings: MediaWarning[] = [];

    // Check image size
    if (asset.type === "image") {
      const sizeWarning = this.checkImageSize(asset);
      if (sizeWarning) {
        warnings.push(sizeWarning);
      }

      // Check for modern formats
      if (this.config.checkModernFormats) {
        const formatWarning = this.checkImageFormat(asset);
        if (formatWarning) {
          warnings.push(formatWarning);
        }
      }

      // Check alt text
      if (this.config.checkAltText) {
        const altWarning = this.checkAltText(asset);
        if (altWarning) {
          warnings.push(altWarning);
        }
      }
    }

    // Check dimensions for CLS
    if (
      this.config.checkDimensions &&
      (asset.type === "image" || asset.type === "video")
    ) {
      const dimensionWarning = this.checkDimensions(asset);
      if (dimensionWarning) {
        warnings.push(dimensionWarning);
      }
    }

    // Check video lazy loading
    if (asset.type === "video" && this.config.checkLazyLoading) {
      const lazyWarning = this.checkVideoLazyLoading(asset);
      if (lazyWarning) {
        warnings.push(lazyWarning);
      }
    }

    return warnings;
  }

  /**
   * Check image size against threshold
   * Requirements: 6.1
   */
  checkImageSize(asset: MediaAsset): MediaWarning | null {
    if (asset.type !== "image") {
      return null;
    }

    const thresholdBytes = this.config.imageSizeThresholdKB * 1024;

    if (asset.size > thresholdBytes) {
      const severity = this.getSeverityForSize(asset.size, thresholdBytes);
      return {
        type: "oversized",
        message: `Image "${path.basename(asset.src)}" is ${formatBytes(
          asset.size
        )}, exceeds ${this.config.imageSizeThresholdKB}KB threshold`,
        asset: asset.src,
        severity,
        suggestion: `Optimize image using compression tools or convert to WebP/AVIF format`,
      };
    }

    return null;
  }

  /**
   * Check for missing dimension attributes (CLS prevention)
   * Requirements: 6.2
   */
  checkDimensions(asset: MediaAsset): MediaWarning | null {
    if (!this.config.checkDimensions) {
      return null;
    }

    // Only check img and video elements that come from HTML parsing
    if (asset.element !== "img" && asset.element !== "video") {
      return null;
    }

    if (!asset.hasWidth || !asset.hasHeight) {
      const missingAttrs = [];
      if (!asset.hasWidth) missingAttrs.push("width");
      if (!asset.hasHeight) missingAttrs.push("height");

      return {
        type: "missing-dimensions",
        message: `${asset.element} element "${path.basename(
          asset.src
        )}" is missing ${missingAttrs.join(" and ")} attribute(s)`,
        asset: asset.src,
        severity: "medium",
        suggestion: `Add explicit width and height attributes to prevent Cumulative Layout Shift (CLS)`,
      };
    }

    return null;
  }

  /**
   * Check video lazy loading implementation
   * Requirements: 6.3
   */
  checkVideoLazyLoading(asset: MediaAsset): MediaWarning | null {
    if (asset.type !== "video") {
      return null;
    }

    if (!asset.hasLazyLoading) {
      return {
        type: "missing-lazy-load",
        message: `Video "${path.basename(
          asset.src
        )}" does not have lazy loading enabled`,
        asset: asset.src,
        severity: "medium",
        suggestion: `Add preload="none" or preload="metadata" attribute to defer video loading`,
      };
    }

    return null;
  }

  /**
   * Check if image uses modern optimized format
   */
  private checkImageFormat(asset: MediaAsset): MediaWarning | null {
    if (asset.type !== "image" || !asset.format) {
      return null;
    }

    // Skip SVG as it's already optimized for its use case
    if (asset.format === "svg") {
      return null;
    }

    if (!MODERN_IMAGE_FORMATS.includes(asset.format)) {
      return {
        type: "unoptimized-format",
        message: `Image "${path.basename(
          asset.src
        )}" uses ${asset.format.toUpperCase()} format instead of modern formats`,
        asset: asset.src,
        severity: "low",
        suggestion: `Consider converting to WebP or AVIF format for better compression`,
      };
    }

    return null;
  }

  /**
   * Check for missing alt text
   */
  private checkAltText(asset: MediaAsset): MediaWarning | null {
    if (asset.type !== "image" || asset.element !== "img") {
      return null;
    }

    if (asset.alt === undefined || asset.alt === "") {
      return {
        type: "missing-alt",
        message: `Image "${path.basename(asset.src)}" is missing alt text`,
        asset: asset.src,
        severity: "medium",
        suggestion: `Add descriptive alt text for accessibility and SEO`,
      };
    }

    return null;
  }

  /**
   * Get severity level based on size relative to threshold
   */
  private getSeverityForSize(
    size: number,
    threshold: number
  ): MediaWarningSeverity {
    const ratio = size / threshold;
    if (ratio > 2) return "high";
    if (ratio > 1.5) return "medium";
    return "low";
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(
    assets: MediaAsset[],
    warnings: MediaWarning[]
  ): string[] {
    const recommendations: string[] = [];

    // Count warning types
    const warningCounts = new Map<MediaWarningType, number>();
    for (const warning of warnings) {
      warningCounts.set(
        warning.type,
        (warningCounts.get(warning.type) || 0) + 1
      );
    }

    // Oversized images recommendation
    const oversizedCount = warningCounts.get("oversized") || 0;
    if (oversizedCount > 0) {
      recommendations.push(
        `${oversizedCount} image(s) exceed the size threshold. Consider using image optimization tools like sharp, imagemin, or online services.`
      );
    }

    // CLS recommendation
    const dimensionCount = warningCounts.get("missing-dimensions") || 0;
    if (dimensionCount > 0) {
      recommendations.push(
        `${dimensionCount} media element(s) are missing dimension attributes. Add width and height to prevent layout shifts.`
      );
    }

    // Video lazy loading recommendation
    const lazyLoadCount = warningCounts.get("missing-lazy-load") || 0;
    if (lazyLoadCount > 0) {
      recommendations.push(
        `${lazyLoadCount} video(s) are not using lazy loading. Add preload="none" or preload="metadata" to improve initial page load.`
      );
    }

    // Modern format recommendation
    const formatCount = warningCounts.get("unoptimized-format") || 0;
    if (formatCount > 0) {
      recommendations.push(
        `${formatCount} image(s) could benefit from modern formats. Consider using WebP or AVIF for better compression.`
      );
    }

    // Alt text recommendation
    const altCount = warningCounts.get("missing-alt") || 0;
    if (altCount > 0) {
      recommendations.push(
        `${altCount} image(s) are missing alt text. Add descriptive alt attributes for accessibility.`
      );
    }

    // General recommendations based on total size
    const totalImageSize = assets
      .filter((a) => a.type === "image")
      .reduce((sum, a) => sum + a.size, 0);

    if (totalImageSize > 2 * 1024 * 1024) {
      // 2MB
      recommendations.push(
        `Total image payload is ${formatBytes(
          totalImageSize
        )}. Consider implementing lazy loading for below-the-fold images.`
      );
    }

    return recommendations;
  }

  /**
   * Generate a human-readable report from analysis results
   */
  generateReport(result: MediaAnalysisResult): string {
    const lines: string[] = [];

    lines.push("=".repeat(60));
    lines.push("MEDIA ASSET ANALYSIS REPORT");
    lines.push("=".repeat(60));
    lines.push("");

    // Summary
    lines.push("SUMMARY");
    lines.push("-".repeat(40));
    lines.push(`Total Assets: ${result.totalAssets}`);
    lines.push(`Total Size: ${formatBytes(result.totalSize)}`);
    lines.push(`Warnings: ${result.warnings.length}`);
    lines.push("");

    // Breakdown
    lines.push("BREAKDOWN BY TYPE");
    lines.push("-".repeat(40));
    lines.push(
      `Images: ${result.breakdown.images.count} (${formatBytes(
        result.breakdown.images.size
      )})`
    );
    lines.push(
      `Videos: ${result.breakdown.videos.count} (${formatBytes(
        result.breakdown.videos.size
      )})`
    );
    lines.push(
      `Audio: ${result.breakdown.audio.count} (${formatBytes(
        result.breakdown.audio.size
      )})`
    );
    lines.push("");

    // Largest assets
    if (result.assets.length > 0) {
      lines.push("TOP 10 LARGEST ASSETS");
      lines.push("-".repeat(40));
      const sorted = [...result.assets]
        .sort((a, b) => b.size - a.size)
        .slice(0, 10);
      for (const asset of sorted) {
        lines.push(
          `[${asset.type.toUpperCase()}] ${path.basename(
            asset.src
          )}: ${formatBytes(asset.size)}`
        );
      }
      lines.push("");
    }

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
        lines.push(`   Suggestion: ${warning.suggestion}`);
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
 * Create a MediaAnalyzer instance with default config
 */
export function createMediaAnalyzer(
  config?: Partial<MediaAnalyzerConfig>
): MediaAnalyzer {
  return new MediaAnalyzer(config);
}

/**
 * Analyze media assets directly (useful for testing)
 */
export function analyzeMediaAssets(
  assets: MediaAsset[],
  config?: Partial<MediaAnalyzerConfig>
): MediaAnalysisResult {
  const analyzer = new MediaAnalyzer(config);

  const breakdown = {
    images: { count: 0, size: 0 },
    videos: { count: 0, size: 0 },
    audio: { count: 0, size: 0 },
  };

  for (const asset of assets) {
    if (asset.type === "image") {
      breakdown.images.count++;
      breakdown.images.size += asset.size;
    } else if (asset.type === "video") {
      breakdown.videos.count++;
      breakdown.videos.size += asset.size;
    } else if (asset.type === "audio") {
      breakdown.audio.count++;
      breakdown.audio.size += asset.size;
    }
  }

  const totalSize = assets.reduce((sum, a) => sum + a.size, 0);
  const warnings: MediaWarning[] = [];

  for (const asset of assets) {
    warnings.push(...analyzer.analyzeAsset(asset));
  }

  return {
    totalAssets: assets.length,
    totalSize,
    assets,
    warnings,
    recommendations: [],
    breakdown,
  };
}
