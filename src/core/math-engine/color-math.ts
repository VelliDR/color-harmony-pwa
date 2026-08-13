// src/core/math-engine/color-math.ts

import {
  BitDepth,
  ColorSpace,
  HarmonyRule,
  ColorRole,
  ColorObject,
  NormalizedRGB,
  QuantizedChannels,
  FormattedColorStrings,
  HarmonyEngineParams
} from './types';

export const normalizeAngle = (deg: number): number => ((deg % 360) + 360) % 360;

export function hslToNormalizedRGB(h: number, s: number, l: number): NormalizedRGB {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  return {
    r: Math.min(1, Math.max(0, r + m)),
    g: Math.min(1, Math.max(0, g + m)),
    b: Math.min(1, Math.max(0, b + m)),
    a: 1.0
  };
}

export function quantizeChannels(rgb: NormalizedRGB, bitDepth: BitDepth): QuantizedChannels {
  if (bitDepth === 32) {
    return { r: rgb.r, g: rgb.g, b: rgb.b, maxChannelValue: 1.0 };
  }
  const maxVal = Math.pow(2, bitDepth) - 1;
  return {
    r: Math.round(rgb.r * maxVal),
    g: Math.round(rgb.g * maxVal),
    b: Math.round(rgb.b * maxVal),
    maxChannelValue: maxVal
  };
}

export function formatColorStrings(
  rgb: NormalizedRGB,
  quantized: QuantizedChannels,
  colorSpace: ColorSpace,
  bitDepth: BitDepth
): FormattedColorStrings {
  let hex = '';
  if (bitDepth <= 8) {
    const rHex = Math.round(rgb.r * 255).toString(16).padStart(2, '0');
    const gHex = Math.round(rgb.g * 255).toString(16).padStart(2, '0');
    const bHex = Math.round(rgb.b * 255).toString(16).padStart(2, '0');
    hex = `#${rHex}${gHex}${bHex}`.toUpperCase();
  } else {
    const rHex = Math.round(rgb.r * 65535).toString(16).padStart(4, '0');
    const gHex = Math.round(rgb.g * 65535).toString(16).padStart(4, '0');
    const bHex = Math.round(rgb.b * 65535).toString(16).padStart(4, '0');
    hex = `#${rHex}${gHex}${bHex}`.toUpperCase();
  }

  const rgbString = bitDepth === 32
    ? `rgba32f(${rgb.r.toFixed(4)}, ${rgb.g.toFixed(4)}, ${rgb.b.toFixed(4)}, 1.0)`
    : `rgb${bitDepth}(${quantized.r}, ${quantized.g}, ${quantized.b})`;

  const spaceName = colorSpace === 'Display-P3' ? 'display-p3' : colorSpace.toLowerCase();
  const cssColorL4 = `color(${spaceName} ${rgb.r.toFixed(4)} ${rgb.g.toFixed(4)} ${rgb.b.toFixed(4)})`;
  const oklchString = `oklch(${(rgb.r * 100).toFixed(1)}% 0.180 ${(rgb.g * 360).toFixed(1)})`;
  const rawFloatString = `${rgb.r.toFixed(6)}, ${rgb.g.toFixed(6)}, ${rgb.b.toFixed(6)}`;

  return { hex, rgbString, cssColorL4, oklchString, rawFloatString };
}

interface RuleOffset {
  angleOffset: number;
  role: ColorRole;
  sModifier?: number;
  lModifier?: number;
}

export function getRuleOffsets(rule: HarmonyRule): RuleOffset[] {
  switch (rule) {
    case 'monochromatic':
      return [
        { angleOffset: 0, role: 'base', lModifier: 0 },
        { angleOffset: 0, role: 'secondary', lModifier: -0.25 },
        { angleOffset: 0, role: 'accent', lModifier: 0.25 }
      ];
    case 'complementary':
      return [
        { angleOffset: 0, role: 'base' },
        { angleOffset: 180, role: 'secondary' }
      ];
    case 'analogous':
      return [
        { angleOffset: -30, role: 'secondary' },
        { angleOffset: 0, role: 'base' },
        { angleOffset: 30, role: 'accent' }
      ];
    case 'triadic':
      return [
        { angleOffset: 0, role: 'base' },
        { angleOffset: 120, role: 'secondary' },
        { angleOffset: 240, role: 'accent' }
      ];
    case 'split-complementary':
      return [
        { angleOffset: 0, role: 'base' },
        { angleOffset: 150, role: 'secondary' },
        { angleOffset: 210, role: 'accent' }
      ];
    case 'tetradic':
      return [
        { angleOffset: 0, role: 'base' },
        { angleOffset: 60, role: 'secondary' },
        { angleOffset: 180, role: 'accent' },
        { angleOffset: 240, role: 'neutral' }
      ];
    case 'square':
      return [
        { angleOffset: 0, role: 'base' },
        { angleOffset: 90, role: 'secondary' },
        { angleOffset: 180, role: 'accent' },
        { angleOffset: 270, role: 'neutral' }
      ];
    case 'achromatic':
      return [
        { angleOffset: 0, role: 'base', sModifier: -1, lModifier: 0.1 },
        { angleOffset: 0, role: 'secondary', sModifier: -1, lModifier: -0.3 },
        { angleOffset: 0, role: 'accent', sModifier: -1, lModifier: 0.3 }
      ];
    default:
      return [{ angleOffset: 0, role: 'base' }];
  }
}

export function generateHarmonyPalette(params: HarmonyEngineParams): ColorObject[] {
  const { baseColor, rule, bitDepth, colorSpace, snapAngleStep } = params;

  let baseH = 'h' in baseColor ? baseColor.h : 0;
  let baseS = 's' in baseColor ? baseColor.s : 1.0;
  let baseL = 'l' in baseColor ? baseColor.l : 0.5;

  if (snapAngleStep && snapAngleStep > 0) {
    baseH = Math.round(baseH / snapAngleStep) * snapAngleStep;
  }

  const offsets = getRuleOffsets(rule);

  return offsets.map((offset, index) => {
    const targetHue = normalizeAngle(baseH + offset.angleOffset);
    let targetS = baseS;
    let targetL = baseL;

    if (offset.sModifier !== undefined) {
      targetS = Math.min(1, Math.max(0, baseS + offset.sModifier));
    }
    if (offset.lModifier !== undefined) {
      targetL = Math.min(1, Math.max(0, baseL + offset.lModifier));
    }

    const normalizedRgb = hslToNormalizedRGB(targetHue, targetS, targetL);
    const channels = quantizeChannels(normalizedRgb, bitDepth);
    const formats = formatColorStrings(normalizedRgb, channels, colorSpace, bitDepth);

    return {
      id: `col_${Date.now()}_${index}`,
      role: offset.role,
      angleOffset: offset.angleOffset,
      isLocked: false,
      normalized: normalizedRgb,
      hsl: { h: targetHue, s: targetS, l: targetL },
      colorSpace,
      bitDepth,
      channels,
      formats
    };
  });
}