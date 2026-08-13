// src/core/math-engine/types.ts

export type BitDepth = 8 | 10 | 12 | 14 | 16 | 32;
export type ColorSpace = 'sRGB' | 'Display-P3' | 'Adobe-RGB' | 'Rec2020';
export type HarmonyRule =
  | 'monochromatic'
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'square'
  | 'achromatic';

export type ColorRole = 'base' | 'secondary' | 'accent' | 'neutral';

export interface NormalizedRGB {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface HSLState {
  h: number;
  s: number;
  l: number;
}

export interface QuantizedChannels {
  r: number;
  g: number;
  b: number;
  maxChannelValue: number;
}

export interface FormattedColorStrings {
  hex: string;
  rgbString: string;
  cssColorL4: string;
  oklchString: string;
  rawFloatString: string;
}

export interface ColorObject {
  id: string;
  role: ColorRole;
  angleOffset: number;
  isLocked: boolean;
  normalized: NormalizedRGB;
  hsl: HSLState;
  colorSpace: ColorSpace;
  bitDepth: BitDepth;
  channels: QuantizedChannels;
  formats: FormattedColorStrings;
}

export interface HarmonyEngineParams {
  baseColor: NormalizedRGB | HSLState;
  rule: HarmonyRule;
  bitDepth: BitDepth;
  colorSpace: ColorSpace;
  snapAngleStep?: number;
}