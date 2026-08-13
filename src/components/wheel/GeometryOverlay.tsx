// src/components/wheel/GeometryOverlay.tsx

import React from 'react';
import { ColorObject } from '../../core/math-engine/types';

interface GeometryOverlayProps {
  colors: ColorObject[]; // Math Engine tarafından üretilen uyumlu renk kartları
  size?: number;          // Tuval boyutu (ColorWheel ile aynı olmalı, Varsayılan: 320px)
}

export const GeometryOverlay: React.FC<GeometryOverlayProps> = ({
  colors,
  size = 320
}) => {
  const center = size / 2;
  const handleRadius = center - 35; // Çember üzerindeki renk yolunun yarıçapı

  // Her rengin çember üzerindeki (X, Y) koordinatlarını hesaplama
  const points = colors.map((color) => {
    const angleRad = ((color.hsl.h - 90) * Math.PI) / 180;
    return {
      x: center + handleRadius * Math.cos(angleRad),
      y: center + handleRadius * Math.sin(angleRad),
      role: color.role,
      hue: color.hsl.h,
      id: color.id
    };
  });

  // Poligon (Çizgi/Üçgen/Kare) için SVG nokta dizesi oluşturma
  const polygonPointsD = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg
      width={size}
      height={size}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none', // Tıklamaların alttaki Canvas'a geçmesini sağlar
        zIndex: 10
      }}
    >
      {/* 1. GEOMETRİK BAĞLANTI ÇİZGİLERİ (POLİGON) */}
      {points.length > 1 && (
        <polygon
          points={polygonPointsD}
          fill="rgba(255, 255, 255, 0.05)"
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="2"
          strokeDasharray="4 4" // Kesikli çizgi efekti
        />
      )}

      {/* 2. MERKEZE UZANAN REHBER ÇİZGİLER */}
      {points.map((point) => (
        <line
          key={`line_${point.id}`}
          x1={center}
          y1={center}
          x2={point.x}
          y2={point.y}
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1"
        />
      ))}

      {/* 3. MERKEZ NOKTASI */}
      <circle
        cx={center}
        cy={center}
        r={4}
        fill="#FFFFFF"
        opacity={0.8}
      />

      {/* 4. YARDIMCI RENK TUTAMAÇLARI (SECONDARY / ACCENT NODES) */}
      {points.map((point) => {
        // Ana renk tutamacı Canvas'ta çizildiği için burada sadece yardımcı renkleri belirginleştiriyoruz
        if (point.role === 'base') return null;

        return (
          <g key={`node_${point.id}`}>
            {/* Dış Beyaz Halka */}
            <circle
              cx={point.x}
              cy={point.y}
              r={9}
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="2"
            />
            {/* İç Renkli Daire */}
            <circle
              cx={point.x}
              cy={point.y}
              r={5}
              fill={`hsl(${point.hue}, 100%, 50%)`}
            />
          </g>
        );
      })}
    </svg>
  );
};