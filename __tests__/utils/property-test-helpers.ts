/**
 * Helper utilities for property-based testing
 */
import * as fc from "fast-check";
import { describe, it, expect } from "vitest";

/**
 * Default number of iterations for property tests
 * Minimum 100 as per design requirements
 */
export const DEFAULT_NUM_RUNS = 100;

/**
 * Configuration for property tests
 */
export interface PropertyTestConfig {
  numRuns?: number;
  seed?: number;
  verbose?: boolean;
}

/**
 * Create a property test with standard configuration
 * @param name - Test name
 * @param arbitrary - The arbitrary to generate test data
 * @param predicate - The property to test
 * @param config - Optional configuration
 */
export function propertyTest<T>(
  name: string,
  arbitrary: fc.Arbitrary<T>,
  predicate: (value: T) => boolean | void,
  config: PropertyTestConfig = {}
): void {
  const { numRuns = DEFAULT_NUM_RUNS, seed, verbose } = config;

  it(name, () => {
    fc.assert(fc.property(arbitrary, predicate), {
      numRuns,
      seed,
      verbose,
    });
  });
}

/**
 * Create an async property test with standard configuration
 * @param name - Test name
 * @param arbitrary - The arbitrary to generate test data
 * @param predicate - The async property to test
 * @param config - Optional configuration
 */
export function asyncPropertyTest<T>(
  name: string,
  arbitrary: fc.Arbitrary<T>,
  predicate: (value: T) => Promise<boolean | void>,
  config: PropertyTestConfig = {}
): void {
  const { numRuns = DEFAULT_NUM_RUNS, seed, verbose } = config;

  it(name, async () => {
    await fc.assert(fc.asyncProperty(arbitrary, predicate), {
      numRuns,
      seed,
      verbose,
    });
  });
}

/**
 * Helper to create a property test suite for a feature
 * @param featureName - Name of the feature being tested
 * @param tests - Array of property tests to run
 */
export function propertyTestSuite(
  featureName: string,
  tests: Array<{
    propertyNumber: number;
    propertyName: string;
    validates: string;
    arbitrary: fc.Arbitrary<unknown>;
    predicate: (value: unknown) => boolean | void;
    config?: PropertyTestConfig;
  }>
): void {
  describe(`Property Tests: ${featureName}`, () => {
    tests.forEach(
      ({
        propertyNumber,
        propertyName,
        validates,
        arbitrary,
        predicate,
        config,
      }) => {
        const testName = `Property ${propertyNumber}: ${propertyName} - ${validates}`;
        propertyTest(
          testName,
          arbitrary,
          predicate as (value: unknown) => boolean | void,
          config
        );
      }
    );
  });
}

/**
 * Assertion helpers for common property patterns
 */
export const assertions = {
  /**
   * Assert that a value is non-negative
   */
  isNonNegative: (value: number): boolean => value >= 0,

  /**
   * Assert that a value is positive
   */
  isPositive: (value: number): boolean => value > 0,

  /**
   * Assert that a value is within a range
   */
  isInRange: (value: number, min: number, max: number): boolean =>
    value >= min && value <= max,

  /**
   * Assert that an array is sorted in descending order
   */
  isSortedDescending: <T>(arr: T[], key: (item: T) => number): boolean => {
    for (let i = 1; i < arr.length; i++) {
      if (key(arr[i]) > key(arr[i - 1])) {
        return false;
      }
    }
    return true;
  },

  /**
   * Assert that an array is sorted in ascending order
   */
  isSortedAscending: <T>(arr: T[], key: (item: T) => number): boolean => {
    for (let i = 1; i < arr.length; i++) {
      if (key(arr[i]) < key(arr[i - 1])) {
        return false;
      }
    }
    return true;
  },

  /**
   * Assert that all items in an array satisfy a predicate
   */
  allSatisfy: <T>(arr: T[], predicate: (item: T) => boolean): boolean =>
    arr.every(predicate),

  /**
   * Assert that at least one item in an array satisfies a predicate
   */
  someSatisfy: <T>(arr: T[], predicate: (item: T) => boolean): boolean =>
    arr.some(predicate),

  /**
   * Assert that an array is non-empty
   */
  isNonEmpty: <T>(arr: T[]): boolean => arr.length > 0,

  /**
   * Assert that a value is defined (not null or undefined)
   */
  isDefined: <T>(value: T | null | undefined): value is T =>
    value !== null && value !== undefined,

  /**
   * Assert that a string is non-empty
   */
  isNonEmptyString: (value: string): boolean => value.length > 0,
};

/**
 * Common property patterns
 */
export const patterns = {
  /**
   * Round-trip property: encode then decode should equal original
   */
  roundTrip:
    <T>(
      encode: (value: T) => unknown,
      decode: (encoded: unknown) => T,
      equals: (a: T, b: T) => boolean = (a, b) =>
        JSON.stringify(a) === JSON.stringify(b)
    ) =>
    (value: T): boolean => {
      const encoded = encode(value);
      const decoded = decode(encoded);
      return equals(value, decoded);
    },

  /**
   * Idempotence property: applying operation twice equals applying once
   */
  idempotent:
    <T>(
      operation: (value: T) => T,
      equals: (a: T, b: T) => boolean = (a, b) =>
        JSON.stringify(a) === JSON.stringify(b)
    ) =>
    (value: T): boolean => {
      const once = operation(value);
      const twice = operation(once);
      return equals(once, twice);
    },

  /**
   * Invariant property: some property holds before and after operation
   */
  invariant:
    <T>(operation: (value: T) => T, invariantCheck: (value: T) => boolean) =>
    (value: T): boolean => {
      if (!invariantCheck(value)) return true; // Skip if invariant doesn't hold initially
      const result = operation(value);
      return invariantCheck(result);
    },

  /**
   * Monotonic property: operation preserves or increases a metric
   */
  monotonic:
    <T>(
      operation: (value: T) => T,
      metric: (value: T) => number,
      direction:
        | "increasing"
        | "decreasing"
        | "non-decreasing"
        | "non-increasing" = "non-decreasing"
    ) =>
    (value: T): boolean => {
      const before = metric(value);
      const after = metric(operation(value));
      switch (direction) {
        case "increasing":
          return after > before;
        case "decreasing":
          return after < before;
        case "non-decreasing":
          return after >= before;
        case "non-increasing":
          return after <= before;
      }
    },
};
