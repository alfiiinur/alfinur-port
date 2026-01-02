"use client";

import React, { forwardRef } from "react";

export interface PathConfig {
  d: string;
  gradientColors?: string[];
  strokeWidth?: number;
  showGlow?: boolean;
  showDots?: boolean;
  dotPositions?: number[];
}

// Preset path generators
export const pathPresets = {
  // Long horizontal wave path
  horizontalWave: () => `
    M -300 400
    C 200 150, 500 550, 900 350
    S 1300 100, 1700 450
    C 2100 650, 2500 200, 2900 400
    S 3400 600, 3900 300
    C 4300 100, 4700 500, 5100 350
    S 5600 150, 6100 450
    C 6500 600, 6900 250, 7300 400
    S 7800 550, 8300 300
    C 8700 150, 9100 500, 9500 350
    L 10000 400
  `,

  // Shorter wave for smaller sections
  shortWave: () => `
    M -100 200
    C 100 100, 300 300, 500 200
    S 700 100, 900 200
    C 1100 300, 1300 100, 1500 200
    S 1700 300, 1900 200
    L 2000 200
  `,

  // Zigzag path
  zigzag: () => `
    M 0 300
    L 200 100 L 400 300 L 600 100 L 800 300
    L 1000 100 L 1200 300 L 1400 100 L 1600 300
    L 1800 100 L 2000 300
  `,

  // Smooth sine wave
  sineWave: () => {
    let path = "M 0 400";
    for (let i = 0; i <= 100; i++) {
      const x = i * 100;
      const y = 400 + Math.sin(i * 0.3) * 150;
      path += ` L ${x} ${y}`;
    }
    return path;
  },

  // Spiral-like path
  spiral: () => `
    M 0 400
    Q 500 100, 1000 400
    Q 1500 700, 2000 400
    Q 2500 100, 3000 400
    Q 3500 700, 4000 400
    Q 4500 100, 5000 400
  `,
};

// Default gradient colors
const defaultGradientColors = [
  "#22c55e", // green-500
  "#4ade80", // green-400
  "#d4f542", // lime
  "#4ade80", // green-400
  "#22c55e", // green-500
  "#4ade80", // green-400
];

// Default dot positions
const defaultDotPositions = [
  500, 1200, 1900, 2600, 3300, 4000, 4700, 5400, 6100, 6800, 7500, 8200, 8900,
];

interface AnimatedPathProps {
  pathRef?: React.RefObject<SVGPathElement | null>;
  config?: PathConfig;
  className?: string;
  viewBox?: string;
  width?: string;
}

export const AnimatedPath = forwardRef<SVGSVGElement, AnimatedPathProps>(
  (
    {
      pathRef,
      config = {
        d: pathPresets.horizontalWave(),
        gradientColors: defaultGradientColors,
        strokeWidth: 6,
        showGlow: true,
        showDots: true,
        dotPositions: defaultDotPositions,
      },
      className = "",
      viewBox = "0 0 10000 800",
      width = "w-[1000vw]",
    },
    ref
  ) => {
    const {
      d,
      gradientColors = defaultGradientColors,
      strokeWidth = 6,
      showGlow = true,
      showDots = true,
      dotPositions = defaultDotPositions,
    } = config;

    return (
      <svg
        ref={ref}
        className={`absolute inset-0 ${width} h-full pointer-events-none z-1 ${className}`}
        viewBox={viewBox}
        preserveAspectRatio="xMinYMid slice"
      >
        <defs>
          {showGlow && (
            <filter id="path-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
          <linearGradient
            id="animatedPathGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            {gradientColors.map((color, index) => (
              <stop
                key={index}
                offset={`${(index / (gradientColors.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </linearGradient>
        </defs>

        {/* Background path */}
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth - 2}
          className="text-gray-200 dark:text-gray-800"
          strokeLinecap="round"
        />

        {/* Animated path */}
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="url(#animatedPathGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={showGlow ? "url(#path-glow)" : undefined}
        />

        {/* Decorative dots along path */}
        {showDots &&
          dotPositions.map((cx, i) => (
            <g key={i}>
              <circle
                cx={cx}
                cy={350 + Math.sin(i * 0.8) * 80}
                r={6 + (i % 3) * 2}
                className="fill-green-500"
                opacity={0.5 + (i % 3) * 0.15}
              />
            </g>
          ))}
      </svg>
    );
  }
);

AnimatedPath.displayName = "AnimatedPath";

export default AnimatedPath;
