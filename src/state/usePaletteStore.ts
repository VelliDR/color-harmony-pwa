// src/state/usePaletteStore.ts

import { create } from 'zustand';
import {
  BitDepth,
  ColorSpace,
  HarmonyRule,
  ColorObject
} from '../core/math-engine/types';
import { generateHarmonyPalette } from '../core/math-engine/color-math';

interface PaletteState {
  // Mevcut Ayarlar
  baseHue: number;
  rule: HarmonyRule;
  bitDepth: BitDepth;
  colorSpace: ColorSpace;
  isSegmented: boolean; // true: 48-Renk Temel Mod, false: Sürekli Tayf
  colors: ColorObject[];

  // Eylemler (Actions)
  setBaseHue: (hue: number) => void;
  setRule: (rule: HarmonyRule) => void;
  setBitDepth: (bitDepth: BitDepth) => void;
  setColorSpace: (colorSpace: ColorSpace) => void;
  setIsSegmented: (isSegmented: boolean) => void;
  toggleLockColor: (id: string) => void;
}

export const usePaletteStore = create<PaletteState>((set, get) => ({
  baseHue: 0,
  rule: 'triadic',
  bitDepth: 8,
  colorSpace: 'sRGB',
  isSegmented: false,
  colors: generateHarmonyPalette({
    baseColor: { h: 0, s: 1.0, l: 0.5 },
    rule: 'triadic',
    bitDepth: 8,
    colorSpace: 'sRGB'
  }),

  setBaseHue: (hue: number) => {
    const { rule, bitDepth, colorSpace, isSegmented } = get();
    set({
      baseHue: hue,
      colors: generateHarmonyPalette({
        baseColor: { h: hue, s: 1.0, l: 0.5 },
        rule,
        bitDepth,
        colorSpace,
        snapAngleStep: isSegmented ? 7.5 : undefined
      })
    });
  },

  setRule: (rule: HarmonyRule) => {
    const { baseHue, bitDepth, colorSpace, isSegmented } = get();
    set({
      rule,
      colors: generateHarmonyPalette({
        baseColor: { h: baseHue, s: 1.0, l: 0.5 },
        rule,
        bitDepth,
        colorSpace,
        snapAngleStep: isSegmented ? 7.5 : undefined
      })
    });
  },

  setBitDepth: (bitDepth: BitDepth) => {
    const { baseHue, rule, colorSpace, isSegmented } = get();
    set({
      bitDepth,
      colors: generateHarmonyPalette({
        baseColor: { h: baseHue, s: 1.0, l: 0.5 },
        rule,
        bitDepth,
        colorSpace,
        snapAngleStep: isSegmented ? 7.5 : undefined
      })
    });
  },

  setColorSpace: (colorSpace: ColorSpace) => {
    const { baseHue, rule, bitDepth, isSegmented } = get();
    set({
      colorSpace,
      colors: generateHarmonyPalette({
        baseColor: { h: baseHue, s: 1.0, l: 0.5 },
        rule,
        bitDepth,
        colorSpace,
        snapAngleStep: isSegmented ? 7.5 : undefined
      })
    });
  },

  setIsSegmented: (isSegmented: boolean) => {
    const { baseHue, rule, bitDepth, colorSpace } = get();
    set({
      isSegmented,
      colors: generateHarmonyPalette({
        baseColor: { h: baseHue, s: 1.0, l: 0.5 },
        rule,
        bitDepth,
        colorSpace,
        snapAngleStep: isSegmented ? 7.5 : undefined
      })
    });
  },

  toggleLockColor: (id: string) => {
    set((state) => ({
      colors: state.colors.map((c) =>
        c.id === id ? { ...c, isLocked: !c.isLocked } : c
      )
    }));
  }
}));