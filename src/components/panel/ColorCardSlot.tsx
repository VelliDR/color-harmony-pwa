// src/components/panel/ColorCardSlot.tsx

import React, { useState } from 'react';
import { ColorObject } from '../../core/math-engine/types';
import { m3Theme } from '../../theme';

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
    primary: 'Primary',
    secondary: 'Secondary',
    accent: 'Accent',
    neutral: 'Neutral'
  };

  const roleKey = color.role ?? 'primary';
  const roleName = roleLabels[roleKey] || roleKey;
  const angleOffset = color.angleOffset ?? 0;
  const bitDepth = color.bitDepth ?? 8;
  const colorSpace = color.colorSpace ?? 'sRGB';
  const cssColorL4 = color.formats.cssColorL4 || color.formats.hex;
  const rawFloatString = color.formats.rawFloatString || '';
  const oklchString = color.formats.oklchString || '';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '12px',
        backgroundColor: m3Theme.surfaceHigh,
        borderRadius: '12px',
        border: color.isLocked ? `1px solid ${m3Theme.primary}` : `1px solid ${m3Theme.border}`,
        transition: 'all 0.2s ease',
        marginBottom: '8px'
      }}
    >
      {/* 1. ROL & AÇI PILL ROZETLERİ + KİLİT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: roleKey === 'primary' ? m3Theme.primaryMuted : 'rgba(255,255,255,0.08)',
              color: roleKey === 'primary' ? m3Theme.primary : m3Theme.textSecondary,
              fontFamily: m3Theme.fontSans
            }}
          >
            {roleName}
          </span>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: '12px',
              fontSize: '10px',
              fontFamily: m3Theme.fontMono,
              fontVariantNumeric: 'tabular-nums',
              backgroundColor: 'rgba(255,255,255,0.04)',
              color: m3Theme.textMuted
            }}
          >
            {angleOffset >= 0 ? `+${angleOffset}°` : `${angleOffset}°`}
          </span>
        </div>

        <button
          onClick={() => onToggleLock(color.id)}
          style={{
            background: color.isLocked ? m3Theme.primaryMuted : 'transparent',
            color: color.isLocked ? m3Theme.primary : m3Theme.textMuted,
            border: color.isLocked ? `1px solid ${m3Theme.primary}` : `1px solid ${m3Theme.border}`,
            borderRadius: '8px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {color.isLocked ? '🔒 Kilitli' : '🔓 Kilitle'}
        </button>
      </div>

      {/* 2. CANLI RENK PREVIEW */}
      <div
        style={{
          height: '42px',
          borderRadius: '8px',
          backgroundColor: `hsl(${color.hsl.h}, ${color.hsl.s * 100}%, ${color.hsl.l * 100}%)`,
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12), 0 2px 8px rgba(0,0,0,0.2)'
        }}
      />

      {/* 3. ZIPLAMA YAPAN TABULAR-NUMS KOD SATIRLARI */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* HEX */}
        <div
          onClick={() => handleCopy(color.formats.hex, 'hex')}
          style={rowStyle}
        >
          <span style={labelStyle}>HEX ({bitDepth <= 8 ? '8-bit' : `${bitDepth}-bit`}):</span>
          <span style={valueStyle}>
            {copiedKey === 'hex' ? '✓ Kopyalandı' : color.formats.hex}
          </span>
        </div>

        {/* RGB */}
        <div
          onClick={() => handleCopy(color.formats.rgbString, 'rgb')}
          style={rowStyle}
        >
          <span style={labelStyle}>RGB:</span>
          <span style={valueStyle}>
            {copiedKey === 'rgb' ? '✓ Kopyalandı' : color.formats.rgbString}
          </span>
        </div>

        {/* CSS Color L4 */}
        <div
          onClick={() => handleCopy(cssColorL4, 'css')}
          style={rowStyle}
        >
          <span style={labelStyle}>CSS ({colorSpace}):</span>
          <span style={{ ...valueStyle, fontSize: '10.5px' }}>
            {copiedKey === 'css' ? '✓ Kopyalandı' : cssColorL4}
          </span>
        </div>

        {/* OKLCH */}
        {oklchString && (
          <div
            onClick={() => handleCopy(oklchString, 'oklch')}
            style={rowStyle}
          >
            <span style={labelStyle}>OKLCH:</span>
            <span style={{ ...valueStyle, fontSize: '10.5px' }}>
              {copiedKey === 'oklch' ? '✓ Kopyalandı' : oklchString}
            </span>
          </div>
        )}

        {/* Float (32-bit veya 16-bit) */}
        {bitDepth >= 16 && rawFloatString && (
          <div
            onClick={() => handleCopy(rawFloatString, 'float')}
            style={rowStyle}
          >
            <span style={labelStyle}>Float (0-1):</span>
            <span style={{ ...valueStyle, fontSize: '10px' }}>
              {copiedKey === 'float' ? '✓ Kopyalandı' : rawFloatString}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// YARDIMCI SATIR STİLLERİ
const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '5px 8px',
  backgroundColor: m3Theme.surfaceHighest,
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease'
};

const labelStyle: React.CSSProperties = {
  color: m3Theme.textMuted,
  fontSize: '11px',
  fontFamily: m3Theme.fontSans
};

const valueStyle: React.CSSProperties = {
  color: m3Theme.textPrimary,
  fontFamily: m3Theme.fontMono,
  fontSize: '11.5px',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums'
};