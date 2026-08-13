// src/components/panel/ColorCardSlot.tsx

import React, { useState } from 'react';
import { ColorObject } from '../../core/math-engine/types';

interface ColorCardSlotProps {
  color: ColorObject;
  onToggleLock: (id: string) => void;
}

export const ColorCardSlot: React.FC<ColorCardSlotProps> = ({
  color,
  onToggleLock
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const roleLabels: Record<string, string> = {
    base: 'Ana Renk',
    primary: 'Ana Renk',
    secondary: 'Sekonder',
    accent: 'Vurgu',
    neutral: 'Nötr'
  };

  // Safe Extractors (Tip Hatalarını Önleyen Güvenlik Kalkanları)
  const roleKey = color.role ?? 'primary';
  const roleName = roleLabels[roleKey] || roleKey;
  const angleOffset = color.angleOffset ?? 0;
  const bitDepth = color.bitDepth ?? 8;
  const colorSpace = color.colorSpace ?? 'sRGB';
  const cssColorL4 = color.formats.cssColorL4 || color.formats.hex;
  const rawFloatString = color.formats.rawFloatString || '';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px',
        backgroundColor: '#1E1E1E',
        borderRadius: '8px',
        border: color.isLocked ? '2px solid #4CAF50' : '1px solid #333',
        color: '#FFF',
        marginBottom: '10px'
      }}
    >
      {/* 1. ÜST BAŞLIK */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#AAA' }}>
          {roleName} ({angleOffset >= 0 ? `+${angleOffset}°` : `${angleOffset}°`})
        </span>
        <button
          onClick={() => onToggleLock(color.id)}
          style={{
            background: color.isLocked ? '#4CAF50' : '#333',
            color: '#FFF',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            cursor: 'pointer'
          }}
        >
          {color.isLocked ? '🔒 Kilitli' : '🔓 Kilitle'}
        </button>
      </div>

      {/* 2. RENK ÖNİZLEME */}
      <div
        style={{
          height: '48px',
          borderRadius: '6px',
          backgroundColor: `hsl(${color.hsl.h}, ${color.hsl.s * 100}%, ${color.hsl.l * 100}%)`,
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
        }}
      />

      {/* 3. KOPYALANABİLİR SATIRLAR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
        <div
          onClick={() => handleCopy(color.formats.hex, 'hex')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '6px 8px',
            backgroundColor: '#2A2A2A',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <span style={{ color: '#888' }}>HEX ({bitDepth <= 8 ? '8-bit' : `${bitDepth}-bit`}):</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
            {copiedKey === 'hex' ? '✓ Kopyalandı' : color.formats.hex}
          </span>
        </div>

        <div
          onClick={() => handleCopy(color.formats.rgbString, 'rgb')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '6px 8px',
            backgroundColor: '#2A2A2A',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <span style={{ color: '#888' }}>RGB:</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
            {copiedKey === 'rgb' ? '✓ Kopyalandı' : color.formats.rgbString}
          </span>
        </div>

        <div
          onClick={() => handleCopy(cssColorL4, 'css')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '6px 8px',
            backgroundColor: '#2A2A2A',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <span style={{ color: '#888' }}>CSS ({colorSpace}):</span>
          <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>
            {copiedKey === 'css' ? '✓ Kopyalandı' : cssColorL4}
          </span>
        </div>

        {bitDepth >= 16 && rawFloatString && (
          <div
            onClick={() => handleCopy(rawFloatString, 'float')}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 8px',
              backgroundColor: '#2A2A2A',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <span style={{ color: '#888' }}>Float (0-1):</span>
            <span style={{ fontFamily: 'monospace', fontSize: '10px' }}>
              {copiedKey === 'float' ? '✓ Kopyalandı' : rawFloatString}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};