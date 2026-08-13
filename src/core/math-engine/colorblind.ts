// LMS Matris Dönüşümleri ile Renk Körlüğü Simülasyonu
export type ColorBlindType = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

export const simulateColorBlindness = (r: number, g: number, b: number, type: ColorBlindType): [number, number, number] => {
  if (type === 'none') return [r, g, b];

  // Matris Katsayıları
  const matrices: Record<Exclude<ColorBlindType, 'none'>, number[][]> = {
    protanopia: [
      [0.56667, 0.43333, 0.0],
      [0.55833, 0.44167, 0.0],
      [0.0, 0.24167, 0.75833]
    ],
    deuteranopia: [
      [0.625, 0.375, 0.0],
      [0.7, 0.3, 0.0],
      [0.0, 0.3, 0.7]
    ],
    tritanopia: [
      [0.95, 0.05, 0.0],
      [0.0, 0.43333, 0.56667],
      [0.0, 0.475, 0.525]
    ]
  };

  const m = matrices[type];
  const sr = Math.round(r * m[0][0] + g * m[0][1] + b * m[0][2]);
  const sg = Math.round(r * m[1][0] + g * m[1][1] + b * m[1][2]);
  const sb = Math.round(r * m[2][0] + g * m[2][1] + b * m[2][2]);

  return [Math.min(255, sr), Math.min(255, sg), Math.min(255, sb)];
};
