/**
 * Common generators for property-based testing with fast-check
 * These generators are used across the performance testing modules
 */
import * as fc from "fast-check";

// ============================================
// Bundle Analyzer Generators
// ============================================

/**
 * Generate a valid module name (npm package style)
 */
export const moduleNameArb = fc.stringMatching(/^[a-z][a-z0-9-]*$/);

/**
 * Generate a valid file path
 */
export const filePathArb = fc
  .array(fc.stringMatching(/^[a-z][a-z0-9-]*$/), { minLength: 1, maxLength: 5 })
  .map((parts) => parts.join("/") + ".js");

/**
 * Generate a module size in bytes (realistic range)
 */
export const moduleSizeArb = fc.integer({ min: 100, max: 5_000_000 });

/**
 * Generate a gzipped size (always smaller than original)
 */
export const gzippedSizeArb = (originalSize: number) =>
  fc.integer({
    min: Math.floor(originalSize * 0.1),
    max: Math.floor(originalSize * 0.7),
  });

/**
 * Generate a ModuleInfo object
 */
export const moduleInfoArb = fc
  .record({
    name: moduleNameArb,
    size: moduleSizeArb,
    isThirdParty: fc.boolean(),
    path: filePathArb,
  })
  .chain(({ name, size, isThirdParty, path }) =>
    gzippedSizeArb(size).map((gzippedSize) => ({
      name,
      size,
      gzippedSize,
      isThirdParty,
      path,
    }))
  );

// ============================================
// Component Profiler Generators
// ============================================

/**
 * Generate a valid React component name (PascalCase)
 */
export const componentNameArb = fc.stringMatching(/^[A-Z][a-zA-Z0-9]*$/);

/**
 * Generate render time in milliseconds
 */
export const renderTimeArb = fc.float({ min: 0, max: 1000, noNaN: true });

/**
 * Generate render count
 */
export const renderCountArb = fc.integer({ min: 1, max: 100 });

/**
 * Generate a timestamp
 */
export const timestampArb = fc.integer({ min: 0, max: Date.now() + 1000000 });

/**
 * Generate RenderMetrics object
 */
export const renderMetricsArb = fc.record({
  componentName: componentNameArb,
  renderTime: renderTimeArb,
  renderCount: renderCountArb,
  timestamp: timestampArb,
});

// ============================================
// API Tester Generators
// ============================================

/**
 * Generate HTTP status codes
 */
export const statusCodeArb = fc.oneof(
  fc.constant(200),
  fc.constant(201),
  fc.constant(400),
  fc.constant(401),
  fc.constant(403),
  fc.constant(404),
  fc.constant(500),
  fc.constant(502),
  fc.constant(503)
);

/**
 * Generate response time in milliseconds
 */
export const responseTimeArb = fc.float({ min: 1, max: 10000, noNaN: true });

/**
 * Generate payload size in bytes
 */
export const payloadSizeArb = fc.integer({ min: 0, max: 10_000_000 });

/**
 * Generate API endpoint path
 */
export const endpointPathArb = fc
  .array(fc.stringMatching(/^[a-z][a-z0-9-]*$/), { minLength: 1, maxLength: 4 })
  .map((parts) => "/api/" + parts.join("/"));

/**
 * Generate HTTP method
 */
export const httpMethodArb = fc.constantFrom(
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH"
);

// ============================================
// Database Profiler Generators
// ============================================

/**
 * Generate SQL-like query string
 */
export const queryStringArb = fc.oneof(
  fc.constant("SELECT * FROM users WHERE id = $1"),
  fc.constant("INSERT INTO posts (title, content) VALUES ($1, $2)"),
  fc.constant("UPDATE comments SET text = $1 WHERE id = $2"),
  fc.constant("DELETE FROM sessions WHERE expires_at < $1"),
  fc.stringMatching(/^SELECT \* FROM [a-z_]+ WHERE [a-z_]+ = \$1$/)
);

/**
 * Generate query execution time in milliseconds
 */
export const queryExecutionTimeArb = fc.float({
  min: 0.1,
  max: 5000,
  noNaN: true,
});

/**
 * Generate rows affected count
 */
export const rowsAffectedArb = fc.integer({ min: 0, max: 10000 });

/**
 * Generate QueryMetrics object
 */
export const queryMetricsArb = fc.record({
  query: queryStringArb,
  executionTime: queryExecutionTimeArb,
  rowsAffected: rowsAffectedArb,
  timestamp: timestampArb,
});

// ============================================
// Memory Profiler Generators
// ============================================

/**
 * Generate heap memory values (heapUsed <= heapTotal)
 */
export const memoryValuesArb = fc
  .integer({ min: 1_000_000, max: 2_000_000_000 })
  .chain((heapTotal) =>
    fc.integer({ min: 0, max: heapTotal }).map((heapUsed) => ({
      heapUsed,
      heapTotal,
    }))
  );

/**
 * Generate external memory value
 */
export const externalMemoryArb = fc.integer({ min: 0, max: 500_000_000 });

/**
 * Generate MemorySnapshot object
 */
export const memorySnapshotArb = memoryValuesArb.chain(
  ({ heapUsed, heapTotal }) =>
    fc.record({
      heapUsed: fc.constant(heapUsed),
      heapTotal: fc.constant(heapTotal),
      external: externalMemoryArb,
      timestamp: timestampArb,
    })
);

// ============================================
// Load Tester Generators
// ============================================

/**
 * Generate concurrent users count
 */
export const concurrentUsersArb = fc.integer({ min: 1, max: 1000 });

/**
 * Generate test duration in seconds
 */
export const testDurationArb = fc.integer({ min: 1, max: 3600 });

/**
 * Generate throughput (requests per second)
 */
export const throughputArb = fc.float({ min: 0.1, max: 10000, noNaN: true });

/**
 * Generate latency percentile value
 */
export const latencyPercentileArb = fc.float({
  min: 1,
  max: 30000,
  noNaN: true,
});

/**
 * Generate error rate (0 to 1)
 */
export const errorRateArb = fc.float({ min: 0, max: 1, noNaN: true });

// ============================================
// Web Vitals Generators
// ============================================

/**
 * Generate LCP value in milliseconds
 */
export const lcpArb = fc.float({ min: 100, max: 10000, noNaN: true });

/**
 * Generate FID value in milliseconds
 */
export const fidArb = fc.float({ min: 1, max: 1000, noNaN: true });

/**
 * Generate CLS value (0 to 1)
 */
export const clsArb = fc.float({ min: 0, max: 1, noNaN: true });

/**
 * Generate TTFB value in milliseconds
 */
export const ttfbArb = fc.float({ min: 10, max: 5000, noNaN: true });

/**
 * Generate FCP value in milliseconds
 */
export const fcpArb = fc.float({ min: 100, max: 5000, noNaN: true });

/**
 * Generate WebVitalsMetrics object
 */
export const webVitalsMetricsArb = fc.record({
  lcp: lcpArb,
  fid: fidArb,
  cls: clsArb,
  ttfb: ttfbArb,
  fcp: fcpArb,
});

// ============================================
// Animation Profiler Generators
// ============================================

/**
 * Generate frame rate (fps)
 */
export const frameRateArb = fc.float({ min: 0, max: 120, noNaN: true });

/**
 * Generate dropped frames count
 */
export const droppedFramesArb = fc.integer({ min: 0, max: 1000 });

/**
 * Generate CPU usage percentage
 */
export const cpuUsageArb = fc.float({ min: 0, max: 100, noNaN: true });

/**
 * Generate AnimationMetrics object
 */
export const animationMetricsArb = fc.record({
  name: fc.stringMatching(/^[a-z][a-zA-Z0-9-]*$/),
  frameRate: frameRateArb,
  droppedFrames: droppedFramesArb,
  cpuUsage: cpuUsageArb,
  triggersLayout: fc.boolean(),
});

// ============================================
// Test Coverage Generators
// ============================================

/**
 * Generate line counts for coverage calculation
 */
export const lineCoverageArb = fc
  .integer({ min: 1, max: 10000 })
  .chain((totalLines) =>
    fc.integer({ min: 0, max: totalLines }).map((testedLines) => ({
      testedLines,
      totalLines,
    }))
  );

/**
 * Generate coverage percentage (0 to 100)
 */
export const coveragePercentageArb = fc.float({
  min: 0,
  max: 100,
  noNaN: true,
});

// ============================================
// Media Asset Generators
// ============================================

/**
 * Generate image file size in bytes
 */
export const imageSizeArb = fc.integer({ min: 1000, max: 10_000_000 });

/**
 * Generate image dimensions
 */
export const imageDimensionsArb = fc.record({
  width: fc.integer({ min: 1, max: 4096 }),
  height: fc.integer({ min: 1, max: 4096 }),
});

/**
 * Generate image file path
 */
export const imagePathArb = fc.stringMatching(
  /^[a-z0-9-]+\.(jpg|png|webp|gif)$/
);
