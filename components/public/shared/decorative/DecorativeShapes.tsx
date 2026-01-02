"use client";

import React from "react";

export interface ShapeConfig {
  type:
    | "flower"
    | "diamond"
    | "blob"
    | "circle"
    | "dot"
    | "ring"
    | "star"
    | "wave";
  x: number;
  y: number;
  size: number;
  colors: [string, string];
  rotate?: number;
  id: string;
}

interface ShapeProps {
  shape: ShapeConfig;
}

// Flower shape (4 overlapping circles)
export function FlowerShape({ shape }: ShapeProps) {
  return (
    <svg width={shape.size} height={shape.size} viewBox="0 0 100 100">
      <defs>
        <linearGradient
          id={`grad-${shape.id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={shape.colors[0]} />
          <stop offset="100%" stopColor={shape.colors[1]} />
        </linearGradient>
      </defs>
      <circle cx="35" cy="35" r="30" fill={`url(#grad-${shape.id})`} />
      <circle cx="65" cy="35" r="30" fill={`url(#grad-${shape.id})`} />
      <circle cx="35" cy="65" r="30" fill={`url(#grad-${shape.id})`} />
      <circle cx="65" cy="65" r="30" fill={`url(#grad-${shape.id})`} />
    </svg>
  );
}

// Diamond shape (rounded square)
export function DiamondShape({ shape }: ShapeProps) {
  return (
    <svg
      width={shape.size}
      height={shape.size}
      viewBox="0 0 100 100"
      style={{ transform: `rotate(${shape.rotate || 0}deg)` }}
    >
      <defs>
        <linearGradient
          id={`grad-${shape.id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={shape.colors[0]} />
          <stop offset="100%" stopColor={shape.colors[1]} />
        </linearGradient>
      </defs>
      <rect
        x="15"
        y="15"
        width="70"
        height="70"
        rx="12"
        fill={`url(#grad-${shape.id})`}
      />
    </svg>
  );
}

// Blob shape (ellipse)
export function BlobShape({ shape }: ShapeProps) {
  return (
    <svg width={shape.size} height={shape.size * 0.6} viewBox="0 0 200 120">
      <defs>
        <linearGradient
          id={`grad-${shape.id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={shape.colors[0]} />
          <stop offset="100%" stopColor={shape.colors[1]} />
        </linearGradient>
      </defs>
      <ellipse
        cx="100"
        cy="80"
        rx="95"
        ry="60"
        fill={`url(#grad-${shape.id})`}
      />
    </svg>
  );
}

// Circle shape
export function CircleShape({ shape }: ShapeProps) {
  return (
    <svg width={shape.size} height={shape.size} viewBox="0 0 100 100">
      <defs>
        <linearGradient
          id={`grad-${shape.id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={shape.colors[0]} />
          <stop offset="100%" stopColor={shape.colors[1]} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill={`url(#grad-${shape.id})`} />
    </svg>
  );
}

// Dot shape (small filled circle)
export function DotShape({ shape }: ShapeProps) {
  return (
    <svg width={shape.size} height={shape.size} viewBox="0 0 100 100">
      <defs>
        <linearGradient
          id={`grad-${shape.id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={shape.colors[0]} />
          <stop offset="100%" stopColor={shape.colors[1]} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill={`url(#grad-${shape.id})`} />
    </svg>
  );
}

// Ring shape (circle outline)
export function RingShape({ shape }: ShapeProps) {
  return (
    <svg width={shape.size} height={shape.size} viewBox="0 0 100 100">
      <defs>
        <linearGradient
          id={`grad-${shape.id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={shape.colors[0]} />
          <stop offset="100%" stopColor={shape.colors[1]} />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke={`url(#grad-${shape.id})`}
        strokeWidth="6"
      />
    </svg>
  );
}

// Star shape (6-pointed)
export function StarShape({ shape }: ShapeProps) {
  return (
    <svg
      width={shape.size}
      height={shape.size}
      viewBox="0 0 100 100"
      style={{ transform: `rotate(${shape.rotate || 0}deg)` }}
    >
      <defs>
        <linearGradient
          id={`grad-${shape.id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={shape.colors[0]} />
          <stop offset="100%" stopColor={shape.colors[1]} />
        </linearGradient>
      </defs>
      <polygon
        points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
        fill={`url(#grad-${shape.id})`}
      />
    </svg>
  );
}

// Wave shape
export function WaveShape({ shape }: ShapeProps) {
  return (
    <svg width={shape.size} height={shape.size * 0.4} viewBox="0 0 200 80">
      <defs>
        <linearGradient
          id={`grad-${shape.id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor={shape.colors[0]} />
          <stop offset="100%" stopColor={shape.colors[1]} />
        </linearGradient>
      </defs>
      <path
        d="M0 40 Q25 10, 50 40 T100 40 T150 40 T200 40"
        fill="none"
        stroke={`url(#grad-${shape.id})`}
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Render shape based on type
export function renderShape(shape: ShapeConfig) {
  switch (shape.type) {
    case "flower":
      return <FlowerShape shape={shape} />;
    case "diamond":
      return <DiamondShape shape={shape} />;
    case "blob":
      return <BlobShape shape={shape} />;
    case "circle":
      return <CircleShape shape={shape} />;
    case "dot":
      return <DotShape shape={shape} />;
    case "ring":
      return <RingShape shape={shape} />;
    case "star":
      return <StarShape shape={shape} />;
    case "wave":
      return <WaveShape shape={shape} />;
    default:
      return null;
  }
}

// Decorative shapes container component
interface DecorativeShapesProps {
  shapes: ShapeConfig[];
  className?: string;
}

export function DecorativeShapes({
  shapes,
  className = "",
}: DecorativeShapesProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none z-0 overflow-visible ${className}`}
    >
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="deco-shape absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            opacity: 0.85,
          }}
        >
          {renderShape(shape)}
        </div>
      ))}
    </div>
  );
}

export default DecorativeShapes;
