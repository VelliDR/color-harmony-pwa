// src/state/usePaletteStore.ts

import { create } from 'zustand';
import { generateHarmonyPalette } from '../core/math-engine/color-math';
import {
  HarmonyRule,
  BitDepth,
  ColorSpace,
  RadiusMode,
  ColorObject
} from '../core/math-engine/types';

export type ColorEngine = 'hsl' | 'oklch';

interface PaletteState {
  colors: ColorObject[];
  rule: HarmonyRule;
  radiusMode: RadiusMode;
  isSegmented: boolean;
  bitDepth: BitDepth;
  colorSpace: ColorSpace;
  colorEngine: ColorEngine;

  setColors: (colors: ColorObject[]) => void;
  setRule: (rule: HarmonyRule) => void;
  setRadiusMode: (mode: RadiusMode) => void;
  setIsSegmented: (isSegmented: boolean) => void;
  setBitDepth: (bitDepth: BitDepth) => void;
  setColorSpace: (colorSpace: ColorSpace) => void;
  setColorEngine: (engine: ColorEngine) => void;
  toggleLock: (id: string) => void;
}

export const usePaletteStore = create<PaletteState>((set) => ({
  // İlk yüklemede boş kalmaması için varsayılan palet dolduruluyor
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
  colorEngine: 'hsl',

  setColors: (colors) => set({ colors }),
  setRule: (rule) => set({ rule }),
  setRadiusMode: (radiusMode) => set({ radiusMode }),
  setIsSegmented: (isSegmented) => set({ isSegmented }),
  setBitDepth: (bitDepth) => set({ bitDepth }),
  setColorSpace: (colorSpace) => set({ colorSpace }),
  setColorEngine: (colorEngine) => set({ colorEngine }),
  toggleLock: (id) =>
    set((state) => ({
      colors: state.colors.map((c) =>
        c.id === id ? { ...c, isLocked: !c.isLocked } : c
      )
    }))
}));