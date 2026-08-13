// src/core/math-engine/types.ts

export type HarmonyRule =
  | 'triadic'
  | 'complementary'
  | 'analogous'
  | 'split-complementary'
  | 'tetradic'
  | 'monochromatic'
  | 'square'
  | 'achromatic';

export type BitDepth = 8 | 10 | 12 | 14 | 16 | 32;

export type ColorSpace = 'sRGB' | 'Display-P3' | 'Adobe-RGB' | 'Rec2020';

export type RadiusMode = 'homogeneous' | 'heterogeneous';

export type ColorRole = 'primary' | 'secondary' | 'accent' | 'neutral' | string;

export interface NormalizedRGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface QuantizedChannels {
  r: number;
  g: number;
  b: number;
  max: number;
  maxChannelValue?: number;
}

export interface FormattedColorStrings {
  hex: string;
  rgbString: string;
  hslString: string;
  rawFloatString?: string;
  cssColorL4?: string;
  oklchString?: string;
}

export interface HarmonyEngineParams {
  rule: HarmonyRule;
  baseHue: number;
  bitDepth?: BitDepth;
  colorSpace?: ColorSpace;
  baseColor?: any;
  snapAngleStep?: number;
}

export interface HSLColor {
  h: number; // 0 - 360
  s: number; // 0 - 1
  l: number; // 0 - 1
}

export interface ColorFormats {
  hex: string;
  rgbString: string;
  hslString: string;
  rawFloatString?: string;
  cssColorL4?: string;
  oklchString?: string;
}

export interface ColorObject {
  id: string;
  hsl: HSLColor;
  formats: ColorFormats;
  isLocked: boolean;
  role?: ColorRole;
  radius?: number;    // 0.0 (Tam Merkez/Beyaz) -> 0.5 (Saf Renk) -> 1.0 (Dış Kenar/Siyah)
  ringLevel?: number; // 1 (En İç Pastel) -> 3 (Saf Renk) -> 5 (En Dış Gölge)
  angleOffset?: number;
  bitDepth?: BitDepth;
  colorSpace?: ColorSpace;
}