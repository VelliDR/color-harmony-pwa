// src/core/math-engine/types.ts

export type HarmonyRule =
  | 'triadic'
  | 'complementary'
  | 'analogous'
  | 'split-complementary'
  | 'tetradic'
  | 'monochromatic';

export type BitDepth = 8 | 10 | 12 | 14 | 16 | 32;

export type ColorSpace = 'sRGB' | 'Display-P3' | 'Adobe-RGB' | 'Rec2020';

// Homojen (tüm düğümler aynı halkanın üstünde) veya Heterojen (bağımsız yarıçaplar)
export type RadiusMode = 'homogeneous' | 'heterogeneous';

export interface HSLColor {
  h: number; // 0 - 360
  s: number; // 0 - 1
  l: number; // 0 - 1
}

export interface ColorFormats {
  hex: string;
  rgbString: string;
  hslString: string;
  cssColorL4?: string;
}

export interface ColorObject {
  id: string;
  hsl: HSLColor;
  formats: ColorFormats;
  isLocked: boolean;
  role?: string;
  radius?: number;    // 0.0 (Tam Merkez/Beyaz) -> 0.5 (Saf Renk) -> 1.0 (Dış Kenar/Siyah)
  ringLevel?: number; // 1 (En İç Pastel) -> 3 (Saf Renk) -> 5 (En Dış Gölge)
}