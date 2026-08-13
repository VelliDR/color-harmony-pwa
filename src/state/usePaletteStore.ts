// src/state/usePaletteStore.ts

import { create } from 'zustand';
import {
  ColorObject,
  HarmonyRule,
  BitDepth,
  ColorSpace,
  RadiusMode
} from '../core/math-engine/types';

interface PaletteState {
  colors: ColorObject[];
  rule: HarmonyRule;
  bitDepth: BitDepth;
  colorSpace: ColorSpace;
  isSegmented: boolean;
  radiusMode: RadiusMode;

  setRule: (rule: HarmonyRule) => void;
  setBitDepth: (bitDepth: BitDepth) => void;
  setColorSpace: (colorSpace: ColorSpace) => void;
  setIsSegmented: (isSegmented: boolean) => void;
  setRadiusMode: (mode: RadiusMode) => void;
  toggleLockColor: (id: string) => void;
  setColors: (colors: ColorObject[]) => void;
}

export const usePaletteStore = create<PaletteState>((set) => ({
  colors: [],
  rule: 'triadic',
  bitDepth: 8,
  colorSpace: 'sRGB',
  isSegmented: true,
  radiusMode: 'homogeneous', // Varsayılan olarak homojen geometri ile başlıyoruz

  setRule: (rule) => set({ rule }),
  setBitDepth: (bitDepth) => set({ bitDepth }),
  setColorSpace: (colorSpace) => set({ colorSpace }),
  setIsSegmented: (isSegmented) => set({ isSegmented }),
  setRadiusMode: (radiusMode) => set({ radiusMode }),
  toggleLockColor: (id) =>
    set((state) => ({
      colors: state.colors.map((c) =>
        c.id === id ? { ...c, isLocked: !c.isLocked } : c
      )
    })),
  setColors: (colors) => set({ colors })
}));