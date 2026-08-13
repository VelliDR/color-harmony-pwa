// src/components/wheel/GeometryOverlay.tsx

import React, { useCallback, useRef, useEffect } from 'react';
import { usePaletteStore } from '../../state/usePaletteStore';
import {
  cartesianToPolar,
  polarToCartesian,
  polarToHSL,
  getRingLevelFromRadius,
  RING_LEVELS
} from '../../core/math-engine/polar';
import { ColorObject, HarmonyRule } from '../../core/math-engine/types';
import { m3Theme } from '../../theme';

interface GeometryOverlayProps {
  center?: number;
  maxRadius?: number;
}

const RULE_OFFSETS: Record<HarmonyRule, number[]> = {
  triadic: [0, 120, 240],
  complementary: [0, 180],
  analogous: [0, 30, 60],
  'split-complementary': [0, 150, 210],
  tetradic: [0, 90, 180, 270],
  monochromatic: [0, 0, 0]
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h <= 360) { r = c; g = 0; b = x; }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
};

export const GeometryOverlay: React.FC<GeometryOverlayProps> = ({
  center = 190,
  maxRadius = 180
}) => {
  const {
    colors,
    rule,
    radiusMode,
    isSegmented,
    setColors
  } = usePaletteStore();

  const activeHandleIndex = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const safeCenter = typeof center === 'number' && !Number.isNaN(center) ? center : 190;
  const safeMaxRadius = typeof maxRadius === 'number' && !Number.isNaN(maxRadius) ? maxRadius : 180;

  const updatePaletteFromHandle = useCallback(
    (targetIndex: number, newRadius: number, newAngle: number) => {
      const currentRule = usePaletteStore.getState().rule;
      const currentRadiusMode = usePaletteStore.getState().radiusMode;
      const currentIsSegmented = usePaletteStore.getState().isSegmented;
      const currentColors = usePaletteStore.getState().colors;

      const offsets = RULE_OFFSETS[currentRule] || [0];
      const primaryOffset = offsets[targetIndex] || 0;

      let baseAngle = (newAngle - primaryOffset + 360) % 360;
      if (Number.isNaN(baseAngle)) baseAngle = 0;

      if (currentIsSegmented) {
        const step = 360 / 48;
        baseAngle = Math.round(baseAngle / step) * step;
      }

      const updatedColors: ColorObject[] = offsets.map((offset, idx) => {
        const nodeAngle = (baseAngle + offset) % 360;
        let nodeRadius = Number.isNaN(newRadius) ? 0.5 : newRadius;

        if (currentIsSegmented) {
          const ringLevel = getRingLevelFromRadius(nodeRadius);
          if (ringLevel > 0) {
            const ring = RING_LEVELS[ringLevel - 1];
            nodeRadius = (ring.innerR + ring.outerR) / 2;
          }
        }

        if (currentRadiusMode === 'heterogeneous' && currentColors[idx]) {
          if (idx !== targetIndex && typeof currentColors[idx].radius === 'number' && !Number.isNaN(currentColors[idx].radius)) {
            nodeRadius = currentColors[idx].radius!;
          }
        }

        const hsl = polarToHSL(nodeRadius, nodeAngle);
        const [rInt, gInt, bInt] = hslToRgb(hsl.h, hsl.s, hsl.l);
        const hex = `#${((1 << 24) + (rInt << 16) + (gInt << 8) + bInt).toString(16).slice(1).toUpperCase()}`;

        return {
          id: `color-node-${idx}`,
          hsl,
          radius: nodeRadius,
          ringLevel: getRingLevelFromRadius(nodeRadius),
          isLocked: currentColors[idx]?.isLocked || false,
          role: idx === 0 ? 'Primary' : `Secondary ${idx}`,
          formats: {
            hex,
            rgbString: `rgb(${rInt}, ${gInt}, ${bInt})`,
            hslString: `hsl(${hsl.h}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`
          }
        };
      });

      setColors(updatedColors);
    },
    [setColors]
  );

  // Kural veya Mod Değiştiğinde Paleti Anında Yeniden Hesapla (Tıklamaya Gerek Kalmadan)
  useEffect(() => {
    const currentColors = usePaletteStore.getState().colors;
    const primaryColor = currentColors && currentColors[0];
    const radius = primaryColor && typeof primaryColor.radius === 'number' && !Number.isNaN(primaryColor.radius)
      ? primaryColor.radius
      : 0.5;
    const angle = primaryColor && primaryColor.hsl && typeof primaryColor.hsl.h === 'number' && !Number.isNaN(primaryColor.hsl.h)
      ? primaryColor.hsl.h
      : 0;

    updatePaletteFromHandle(0, radius, angle);
  }, [rule, radiusMode, isSegmented, updatePaletteFromHandle]);

  const handlePointerDown = (index: number) => (e: React.PointerEvent) => {
    e.stopPropagation();
    activeHandleIndex.current = index;
    if (e.target && 'setPointerCapture' in (e.target as HTMLElement)) {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handleSvgPointerDown = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    const touchY = e.clientY - rect.top;

    const { radius, angle } = cartesianToPolar(touchX, touchY, safeCenter, safeCenter, safeMaxRadius);
    activeHandleIndex.current = 0;
    updatePaletteFromHandle(0, radius, angle);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activeHandleIndex.current === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    const touchY = e.clientY - rect.top;

    const { radius, angle } = cartesianToPolar(touchX, touchY, safeCenter, safeCenter, safeMaxRadius);
    updatePaletteFromHandle(activeHandleIndex.current, radius, angle);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeHandleIndex.current !== null) {
      activeHandleIndex.current = null;
      try {
        if (e.target && 'releasePointerCapture' in (e.target as HTMLElement)) {
          (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }
      } catch {
        // Güvenlik
      }
    }
  };

  const nodeCoords = (colors || []).map((c) => {
    if (!c || !c.hsl) {
      return { x: safeCenter, y: safeCenter };
    }
    const hue = typeof c.hsl.h === 'number' && !Number.isNaN(c.hsl.h) ? c.hsl.h : 0;
    const rad = typeof c.radius === 'number' && !Number.isNaN(c.radius) ? c.radius : 0.5;
    const rPx = rad * safeMaxRadius;
    const pt = polarToCartesian(safeCenter, safeCenter, rPx, hue);

    const x = pt && typeof pt.x === 'number' && !Number.isNaN(pt.x) ? pt.x : safeCenter;
    const y = pt && typeof pt.y === 'number' && !Number.isNaN(pt.y) ? pt.y : safeCenter;

    return { x, y };
  });

  const validCoords = nodeCoords.filter(
    (pt) => typeof pt.x === 'number' && typeof pt.y === 'number' && !Number.isNaN(pt.x) && !Number.isNaN(pt.y)
  );

  const polygonPoints = validCoords.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'auto', touchAction: 'none' }}
      onPointerDown={handleSvgPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* A) UYUM POLİGONU */}
      {validCoords.length > 1 && polygonPoints.trim().length > 0 && (
        <polygon
          points={polygonPoints}
          fill="rgba(245, 158, 11, 0.12)"
          stroke={m3Theme.primary}
          strokeWidth="2"
          strokeDasharray={rule === 'monochromatic' ? '4 4' : 'none'}
        />
      )}

      {/* B) KILAVUZ KOLLARI */}
      {validCoords.map((pt, idx) => (
        <line
          key={`spoke-${idx}`}
          x1={safeCenter}
          y1={safeCenter}
          x2={pt.x}
          y2={pt.y}
          stroke={idx === 0 ? m3Theme.primary : m3Theme.secondary}
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.7"
        />
      ))}

      {/* C) ETKİLEŞİMLİ TUTAMAÇLAR */}
      {validCoords.map((pt, idx) => {
        const isPrimary = idx === 0;
        return (
          <g key={`handle-${idx}`} style={{ cursor: 'grab' }}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={isPrimary ? 14 : 11}
              fill={isPrimary ? m3Theme.primary : m3Theme.secondary}
              fillOpacity="0.3"
            />
            <circle
              cx={pt.x}
              cy={pt.y}
              r={isPrimary ? 8 : 6}
              fill={isPrimary ? m3Theme.primary : m3Theme.secondary}
              stroke="#FFFFFF"
              strokeWidth="2"
              onPointerDown={handlePointerDown(idx)}
            />
          </g>
        );
      })}
    </svg>
  );
};