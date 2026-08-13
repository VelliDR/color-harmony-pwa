// src/components/wheel/InteractiveDial.tsx

import React, { useRef, useState } from 'react';
import { usePaletteStore } from '../../state/usePaletteStore';
import { m3Theme } from '../../theme';

export const InteractiveDial: React.FC = () => {
  const { baseHue, rotatePalette } = usePaletteStore();
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number>(0);
  const accumulatedDeltaRef = useRef<number>(0);

  // Sürükleme Başlangıcı
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    accumulatedDeltaRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Dokunsal Sürükleme (Hassas Derece Hesabı)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    startXRef.current = e.clientX;

    // Her 3px yatay sürükleme = 1° hassas açıcıl kayma
    accumulatedDeltaRef.current += deltaX;
    const degreeShift = Math.trunc(accumulatedDeltaRef.current / 3);

    if (degreeShift !== 0) {
      rotatePalette(degreeShift);
      accumulatedDeltaRef.current -= degreeShift * 3;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore release error
    }
  };

  // Mouse Tekerleği İle Döndürme
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    rotatePalette(delta);
  };

  // Silindir Kadran Üzerindeki Çizgiler
  const ticks = Array.from({ length: 31 }, (_, i) => i - 15);

  return (
    <div
      onWheel={handleWheel}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        width: '100%',
        marginTop: '10px',
        padding: '10px 12px',
        backgroundColor: m3Theme.surfaceHigh,
        borderRadius: '16px',
        border: `1px solid ${m3Theme.border}`,
        boxSizing: 'border-box',
        userSelect: 'none'
      }}
    >
      {/* Üst Bilgi ve Anlık Açı */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: m3Theme.textMuted, fontFamily: m3Theme.fontSans }}>
          HASSAS AÇI KADRANI
        </span>
        <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: m3Theme.fontMono, color: m3Theme.primary }}>
          {Math.round((baseHue + 360) % 360)}°
        </span>
      </div>

      {/* Dokunsal / Sürüklenebilir Silindir Kadran */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: 'relative',
          width: '100%',
          height: '36px',
          backgroundColor: m3Theme.surfaceHighest,
          borderRadius: '10px',
          border: `1px solid ${isDragging ? m3Theme.borderFocus : m3Theme.border}`,
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none'
        }}
      >
        {/* Merkez Nişangah İbresi */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '2px',
            backgroundColor: m3Theme.primary,
            zIndex: 3,
            boxShadow: '0 0 8px rgba(245, 158, 11, 0.8)'
          }}
        />

        {/* Canlı Kayan Çizgiler */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transform: `translateX(${-(baseHue % 5) * 4}px)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease'
          }}
        >
          {ticks.map((t) => {
            const angle = Math.round(baseHue + t + 360) % 360;
            const isMajor = angle % 5 === 0;
            const opacity = Math.max(0.1, 1 - Math.abs(t) / 14);

            return (
              <div
                key={t}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '2px',
                  flexShrink: 0,
                  opacity
                }}
              >
                <div
                  style={{
                    width: isMajor ? '2px' : '1px',
                    height: isMajor ? '18px' : '10px',
                    backgroundColor: isMajor ? m3Theme.textPrimary : m3Theme.textMuted
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <span style={{ fontSize: '9.5px', color: m3Theme.textMuted, fontFamily: m3Theme.fontSans }}>
        Yatay sürükleyin veya mouse tekerleği ile **1°** kaydırın
      </span>
    </div>
  );
};