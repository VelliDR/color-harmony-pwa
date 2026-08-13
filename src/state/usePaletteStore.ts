// src/state/usePaletteStore.ts

import { create } from 'zustand';
import { generateHarmonyPalette } from '../core/math-engine/color-math';
import { HarmonyRule, BitDepth, ColorSpace, RadiusMode, ColorObject } from '../core/math-engine/types';

interface PaletteState {
  colors: ColorObject[];
  rule: HarmonyRule;
  radiusMode: RadiusMode;
  isSegmented: boolean;
  bitDepth: BitDepth;
  colorSpace: ColorSpace;
  setColors: (colors: ColorObject[]) => void;
  setRule: (rule: HarmonyRule) => void;
  setRadiusMode: (mode: RadiusMode) => void;
  setIsSegmented: (isSegmented: boolean) => void;
  setBitDepth: (bitDepth: BitDepth) => void;
  setColorSpace: (colorSpace: ColorSpace) => void;
  toggleLock: (id: string) => void;
}

export const usePaletteStore = create<PaletteState>((set) => ({
  // İLK YÜKLEMEDE BOŞ KALMAMASI İÇİN VARSAYILAN PALET DOLDURULUYOR
  colors: generateHarmonyPalette({
    rule: 'triadic',
    baseHue: 0,
    bitDepth: 8,
    colorSpace: 'sRGB'
  }),
  rule: 'triadic',
  radiusMode: 'homogeneous',
  isSegmented: true,
  bitDepth: 8,
  colorSpace: 'sRGB',

  setColors: (colors) => set({ colors }),
  setRule: (rule) => set({ rule }),
  setRadiusMode: (radiusMode) => set({ radiusMode }),
  setIsSegmented: (isSegmented) => set({ isSegmented }),
  setBitDepth: (bitDepth) => set({ bitDepth }),
  setColorSpace: (colorSpace) => set({ colorSpace }),
  toggleLock: (id) =>
    set((state) => ({
      colors: state.colors.map((c) =>
        c.id === id ? { ...c, isLocked: !c.isLocked } : c
      )
    }))
}));