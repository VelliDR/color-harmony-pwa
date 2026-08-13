// src/components/wheel/TonalLadderView.tsx

import React, { useState } from 'react';
import { usePaletteStore } from '../../state/usePaletteStore';
import { BitDepth } from '../../core/math-engine/types';
import { m3Theme } from '../../theme';

type CopyFormat = 'hex' | 'rgb' | 'hsl';

// Bit Derinliğine Duyarlı Format Dönüştürücü
const hslToShadeFormats = (
  h: number,
  sPerc: number,
  lPerc: number,
  bitDepth: BitDepth
) => {
  const s = sPerc / 100;
  const l = lPerc / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };

  const rNorm = Math.max(0, Math.min(1, f(0)));
  const gNorm = Math.max(0, Math.min(1, f(8)));
  const bNorm = Math.max(0, Math.min(1, f(4)));

  let hex = '';
  let rgb = '';

  if (bitDepth === 8) {
    const r = Math.round(rNorm * 255);
    const g = Math.round(gNorm * 255);
    const b = Math.round(bNorm * 255);
    hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    rgb = `rgb(${r}, ${g}, ${b})`;
  } else {
    // High Bit Depth (10-bit, 12-bit, 16-bit, 32-Float): 12 Haneli HEX (#RRRRGGGGBBBB)
    const max16 = 65535;
    const r16 = Math.round(rNorm * max16);
    const g16 = Math.round(gNorm * max16);
    const b16 = Math.round(bNorm * max16);

    const rHex = r16.toString(16).padStart(4, '0').toUpperCase();
    const gHex = g16.toString(16).padStart(4, '0').toUpperCase();
    const bHex = b16.toString(16).padStart(4, '0').toUpperCase();

    hex = `#${rHex}${gHex}${bHex}`;

    if (bitDepth === 32) {
      rgb = `rgb(${rNorm.toFixed(3)}, ${gNorm.toFixed(3)}, ${bNorm.toFixed(3)})`;
    } else {
      const maxChannel = (1 << bitDepth) - 1;
      const rD = Math.round(rNorm * maxChannel);
      const gD = Math.round(gNorm * maxChannel);
      const bD = Math.round(bNorm * maxChannel);
      rgb = `rgb${bitDepth}(${rD}, ${gD}, ${bD})`;
    }
  }

  const hsl = `hsl(${Math.round(h)}, ${Math.round(sPerc)}%, ${Math.round(lPerc)}%)`;

  return { hex, rgb, hsl };
};

export const TonalLadderView: React.FC = () => {
  const { colors, bitDepth } = usePaletteStore();
  const [copyFormat, setCopyFormat] = useState<CopyFormat>('hex');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const handleCopy = (colorFormats: { hex: string; rgb: string; hsl: string }) => {
    const textToCopy = colorFormats[copyFormat];
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(textToCopy);
    setTimeout(() => setCopiedText(null), 1400);
  };

  // Material 3 Standart Tonal Basamakları
  const steps = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 99];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '14px 16px',
        backgroundColor: m3Theme.surface,
        borderRadius: '20px',
        border: `1px solid ${m3Theme.border}`,
        width: '100%',
        maxWidth: '420px',
        boxSizing: 'border-box'
      }}
    >
      {/* ÜST BİLGİ VE FORMAT SEÇİCİ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: m3Theme.textSecondary, fontFamily: m3Theme.fontSans }}>
          M3 TONAL MERDİVENLERİ
        </span>

        {/* Hızlı Format Seçici */}
        <div style={{ display: 'flex', gap: '3px', backgroundColor: m3Theme.surfaceHigh, padding: '2px', borderRadius: '6px' }}>
          {(['hex', 'rgb', 'hsl'] as CopyFormat[]).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setCopyFormat(fmt)}
              style={{
                padding: '2px 6px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: copyFormat === fmt ? m3Theme.primary : 'transparent',
                color: copyFormat === fmt ? '#000' : m3Theme.textMuted,
                fontSize: '9.5px',
                fontWeight: 700,
                fontFamily: m3Theme.fontMono,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* BİLDİRİM */}
      <div style={{ height: '14px', fontSize: '10px', color: m3Theme.primary, fontFamily: m3Theme.fontMono, textAlign: 'right' }}>
        {copiedText ? `✓ Kopyalandı: ${copiedText}` : `Tıklayınca [${copyFormat.toUpperCase()}] kopyalar`}
      </div>

      {/* MERDİVEN ŞERİTLERİ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {colors.map((color, idx) => {
          const roleName = color.role || `Renk ${idx + 1}`;
          const displayHex = color.formats.hex;

          return (
            <div key={color.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* Renk Rolü ve Ham Değer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: m3Theme.textMuted, fontFamily: m3Theme.fontMono }}>
                <span>{roleName}</span>
                <span style={{ fontSize: displayHex.length > 9 ? '9px' : '10px' }}>{displayHex}</span>
              </div>

              {/* 12 Basamaklı İnteraktif Şerit */}
              <div
                style={{
                  display: 'flex',
                  height: '26px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  padding: '2px',
                  boxSizing: 'border-box'
                }}
              >
                {steps.map((step) => {
                  const itemKey = `${color.id}-${step}`;
                  const formats = hslToShadeFormats(color.hsl.h, color.hsl.s * 100, step, bitDepth);
                  const isHovered = hoveredKey === itemKey;
                  const cssBgColor = `hsl(${color.hsl.h}, ${color.hsl.s * 100}%, ${step}%)`;

                  return (
                    <div
                      key={step}
                      onClick={() => handleCopy(formats)}
                      onMouseEnter={() => setHoveredKey(itemKey)}
                      onMouseLeave={() => setHoveredKey(null)}
                      title={`${roleName} - Tone ${step}\nHEX: ${formats.hex}\nRGB: ${formats.rgb}\nHSL: ${formats.hsl}`}
                      style={{
                        flex: 1,
                        backgroundColor: cssBgColor,
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: isHovered ? 10 : 1,
                        borderRadius: isHovered ? '6px' : '2px',
                        transform: isHovered ? 'scale(1.22)' : 'scale(1)',
                        boxShadow: isHovered ? '0 6px 16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.3)' : 'none',
                        transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease, border-radius 0.15s ease'
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};