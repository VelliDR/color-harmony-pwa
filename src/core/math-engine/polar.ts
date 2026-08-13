// src/core/math-engine/polar.ts

import { HSLColor } from './types';

export interface PolarCoords {
  radius: number; // 0.0 (Tam Merkez) -> 1.0 (Dış Kenar)
  angle: number;  // 0 - 360 Derece
}

export interface CartesianCoords {
  x: number;
  y: number;
}

// 1. Dikatezyen (x, y) -> Kutupsal (r, theta) Dönüştürücü
export const cartesianToPolar = (
  x: number,
  y: number,
  cx: number,
  cy: number,
  maxRadius: number
): PolarCoords => {
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const normRadius = Math.min(1.0, dist / maxRadius);

  // 0 dereceyi üst tepeye (Açısal Kuzey) hizalama
  let angle = (Math.atan2(dy, dx) * (180 / Math.PI)) + 90;
  if (angle < 0) angle += 360;

  return {
    radius: normRadius,
    angle: Math.round(angle)
  };
};

// 2. Kutupsal (r, theta) -> Dikatezyen (x, y) Dönüştürücü
export const polarToCartesian = (
  cx: number,
  cy: number,
  radiusPx: number,
  angleInDegrees: number
): CartesianCoords => {
  const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
  return {
    x: cx + radiusPx * Math.cos(angleInRadians),
    y: cy + radiusPx * Math.sin(angleInRadians)
  };
};

// 3. Yarıçap (r) ve Açıdan (theta) Pürüzsüz HSL Renk Hesaplayıcı (Sürekli Tayf Modu)
export const polarToHSL = (radius: number, angle: number): HSLColor => {
  const h = (angle + 360) % 360;
  let s = 1.0;
  let l = 0.5;

  // A) Merkez Saf Beyaz Çekirdek (%0 - %10 Yarıçap)
  if (radius <= 0.1) {
    s = radius / 0.1; // Merkeze yaklaştıkça doygunluk sıfırlanır
    l = 1.0;          // Tam beyaz
  }
  // B) İç Bölge / Tints (%10 - %50 Yarıçap): Açık Pastel Tonlar
  else if (radius <= 0.5) {
    const t = (radius - 0.1) / 0.4; // 0.0 -> 1.0
    l = 1.0 - t * 0.5;              // %100 Parlaklıktan %50'ye düşer
    s = 1.0;
  }
  // C) Dış Bölge / Shades (%50 - %100 Yarıçap): Koyu Gölgeler
  else {
    const t = (radius - 0.5) / 0.5; // 0.0 -> 1.0
    l = 0.5 - t * 0.5;              // %50 Parlaklıktan %0'a (Siyah) düşer
    s = 1.0;
  }

  return {
    h: Math.round(h),
    s: Number(s.toFixed(2)),
    l: Number(l.toFixed(2))
  };
};

// 4. Segmentli Mod (48 Renk) İçin 5 Sabit Halka Seviyesi Matrisi
export const RING_LEVELS = [
  { level: 1, name: 'Very Light Tint', lightness: 0.82, innerR: 0.12, outerR: 0.28 },
  { level: 2, name: 'Light Tint',      lightness: 0.66, innerR: 0.28, outerR: 0.44 },
  { level: 3, name: 'Pure Hue',        lightness: 0.50, innerR: 0.44, outerR: 0.60 }, // Saf Renk Halka
  { level: 4, name: 'Dark Shade',      lightness: 0.34, innerR: 0.60, outerR: 0.76 },
  { level: 5, name: 'Very Dark Shade', lightness: 0.18, innerR: 0.76, outerR: 0.92 }
];

export const getRingLevelFromRadius = (radius: number): number => {
  if (radius <= 0.12) return 0; // Beyaz çekirdek
  for (const ring of RING_LEVELS) {
    if (radius >= ring.innerR && radius <= ring.outerR) {
      return ring.level;
    }
  }
  return 5;
};