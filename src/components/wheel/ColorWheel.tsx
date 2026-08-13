// src/components/wheel/ColorWheel.tsx

import React, { useRef, useEffect } from 'react';
import { usePaletteStore } from '../../state/usePaletteStore';
import {
  polarToHSL,
  RING_LEVELS,
  polarToCartesian
} from '../../core/math-engine/polar';
import { GeometryOverlay } from './GeometryOverlay';

// Düzgün SVG Halka Dilimi (Arc Path) Oluşturan Düzeltilmiş Fonksiyon
const createArcPath = (
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
): string => {
  const pOuterStart = polarToCartesian(cx, cy, outerR, startAngle);
  const pOuterEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const pInnerEnd = polarToCartesian(cx, cy, innerR, endAngle);
  const pInnerStart = polarToCartesian(cx, cy, innerR, startAngle);

  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${pOuterStart.x.toFixed(1)} ${pOuterStart.y.toFixed(1)}`,
    `A ${outerR.toFixed(1)} ${outerR.toFixed(1)} 0 ${largeArc} 1 ${pOuterEnd.x.toFixed(1)} ${pOuterEnd.y.toFixed(1)}`,
    `L ${pInnerEnd.x.toFixed(1)} ${pInnerEnd.y.toFixed(1)}`,
    `A ${innerR.toFixed(1)} ${innerR.toFixed(1)} 0 ${largeArc} 0 ${pInnerStart.x.toFixed(1)} ${pInnerStart.y.toFixed(1)}`,
    'Z'
  ].join(' ');
};

export const ColorWheel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isSegmented } = usePaletteStore();

  const SIZE = 380;
  const CENTER = SIZE / 2;
  const MAX_RADIUS = 180;

  // Sürekli Tayf Modu İçin Canvas Çizimi
  useEffect(() => {
    if (isSegmented || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.createImageData(SIZE, SIZE);
    const data = imgData.data;

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const dx = x - CENTER;
        const dy = y - CENTER;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = dist / MAX_RADIUS;

        if (radius > 1.0) continue;

        let angle = (Math.atan2(dy, dx) * (180 / Math.PI)) + 90;
        if (angle < 0) angle += 360;

        const hsl = polarToHSL(radius, angle);

        const c = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
        const xVal = c * (1 - Math.abs(((hsl.h / 60) % 2) - 1));
        const m = hsl.l - c / 2;
        let r = 0, g = 0, b = 0;

        if (0 <= hsl.h && hsl.h < 60) { r = c; g = xVal; b = 0; }
        else if (60 <= hsl.h && hsl.h < 120) { r = xVal; g = c; b = 0; }
        else if (120 <= hsl.h && hsl.h < 180) { r = 0; g = c; b = xVal; }
        else if (180 <= hsl.h && hsl.h < 240) { r = 0; g = xVal; b = c; }
        else if (240 <= hsl.h && hsl.h < 300) { r = xVal; g = 0; b = c; }
        else if (300 <= hsl.h && hsl.h <= 360) { r = c; g = 0; b = xVal; }

        const idx = (y * SIZE + x) * 4;
        data[idx] = Math.round((r + m) * 255);
        data[idx + 1] = Math.round((g + m) * 255);
        data[idx + 2] = Math.round((b + m) * 255);
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, [isSegmented, SIZE, CENTER, MAX_RADIUS]);

  const HUE_STEPS = 48;
  const ANGLE_STEP = 360 / HUE_STEPS;
  const WHITE_CORE_R = RING_LEVELS[0].innerR * MAX_RADIUS;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: `${SIZE}px`,
        height: `${SIZE}px`,
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      {/* SÜREKLİ TAYF KATMANI */}
      {!isSegmented && (
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          style={{ borderRadius: '50%', position: 'absolute', top: 0, left: 0 }}
        />
      )}

      {/* 5 HALKALI SEGMENTLİ KATMAN */}
      {isSegmented && (
        <svg width={SIZE} height={SIZE} style={{ position: 'absolute', top: 0, left: 0 }}>
          {RING_LEVELS.map((ring) => {
            const innerR = ring.innerR * MAX_RADIUS;
            const outerR = ring.outerR * MAX_RADIUS;

            return Array.from({ length: HUE_STEPS }).map((_, i) => {
              const startAngle = i * ANGLE_STEP;
              const endAngle = (i + 1) * ANGLE_STEP;
              const midAngle = startAngle + ANGLE_STEP / 2;

              const path = createArcPath(CENTER, CENTER, innerR, outerR, startAngle, endAngle);
              const fillColor = `hsl(${midAngle}, 100%, ${ring.lightness * 100}%)`;

              return (
                <path
                  key={`ring-${ring.level}-slice-${i}`}
                  d={path}
                  fill={fillColor}
                  stroke="#140D13"
                  strokeWidth="0.5"
                />
              );
            });
          })}

          {/* MERKEZ BEYAZ ÇEKİRDEK */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={WHITE_CORE_R}
            fill="#FFFFFF"
            stroke="#140D13"
            strokeWidth="1"
          />
        </svg>
      )}

      {/* GEOMETRİ VE DÜĞÜM KATMANI */}
      <GeometryOverlay center={CENTER} maxRadius={MAX_RADIUS} />
    </div>
  );
};