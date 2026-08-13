// src/core/math-engine/polar.ts

export interface RingLevel {
  level: number;
  name: string;
  lightness: number; // 0.0 - 1.0
  innerR: number;    // Normalize Yarıçap (0.0 - 1.0)
  outerR: number;    // Normalize Yarıçap (0.0 - 1.0)
}

export const RING_LEVELS: RingLevel[] = [
  { level: 1, name: 'Very Light Tint', lightness: 0.82, innerR: 0.10, outerR: 0.26 },
  { level: 2, name: 'Light Tint',      lightness: 0.66, innerR: 0.26, outerR: 0.40 },
  { level: 3, name: 'Pure Hue',        lightness: 0.50, innerR: 0.40, outerR: 0.60 }, // Ortalaması tam 0.50 ($L=0.50$)
  { level: 4, name: 'Dark Shade',      lightness: 0.34, innerR: 0.60, outerR: 0.76 },
  { level: 5, name: 'Very Dark Shade', lightness: 0.18, innerR: 0.76, outerR: 0.92 }
];

export const polarToCartesian = (
  cx: number,
  cy: number,
  radiusPx: number,
  angleDeg: number
) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radiusPx * Math.cos(rad),
    y: cy + radiusPx * Math.sin(rad)
  };
};

export const cartesianToPolar = (
  x: number,
  y: number,
  cx: number,
  cy: number,
  maxRadiusPx: number
) => {
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  let angle = (Math.atan2(dy, dx) * (180 / Math.PI)) + 90;
  if (angle < 0) angle += 360;

  const normalizedRadius = Math.min(1.0, dist / maxRadiusPx);

  return {
    radius: normalizedRadius,
    angle: angle % 360
  };
};

export const getRingLevelFromRadius = (radius: number): number => {
  for (const ring of RING_LEVELS) {
    if (radius >= ring.innerR && radius <= ring.outerR) {
      return ring.level;
    }
  }
  return radius < RING_LEVELS[0].innerR ? 1 : 5;
};

export const polarToHSL = (radius: number, angleDeg: number) => {
  const hue = ((angleDeg % 360) + 360) % 360;

  if (radius < 0.10) {
    return { h: hue, s: 0, l: 1.0 };
  }

  const ringLevel = getRingLevelFromRadius(radius);
  const ring = RING_LEVELS[ringLevel - 1];

  let lightness = ring.lightness;
  let saturation = 1.0;

  if (ringLevel === 3) {
    lightness = 0.50;
    saturation = 1.0;
  }

  return {
    h: hue,
    s: Math.min(1.0, Math.max(0, saturation)),
    l: Math.min(1.0, Math.max(0, lightness))
  };
};