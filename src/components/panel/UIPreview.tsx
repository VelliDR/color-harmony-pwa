// src/components/panel/UIPreview.tsx

import React, { useState } from 'react';
import { usePaletteStore } from '../../state/usePaletteStore';
import { ColorObject } from '../../core/math-engine/types';
import { m3Theme } from '../../theme';

// CSS Stili İçin Güvenli (6 Karakter) HEX Alma
const getCssHex = (color?: ColorObject, fallback: string = '#F59E0B'): string => {
  if (!color) return fallback;
  const rawHex = color.formats?.hex || fallback;
  const clean = rawHex.replace('#', '');
  
  if (clean.length === 12) {
    return `#${clean.substring(0, 2)}${clean.substring(4, 6)}${clean.substring(8, 10)}`.toUpperCase();
  }
  if (clean.length === 3) {
    return `#${clean.split('').map((c) => c + c).join('')}`.toUpperCase();
  }
  if (clean.length === 6) {
    return `#${clean}`.toUpperCase();
  }
  return fallback;
};

// Relative Luminance (WCAG 2.1)
const getLuminanceFromHex = (hex: string): number => {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  if (cleanHex.length > 6) {
    cleanHex = cleanHex.substring(0, 6);
  }
  const num = parseInt(cleanHex, 16);
  if (Number.isNaN(num)) return 0.5;

  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const [rL, gL, bL] = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );

  return rL * 0.2126 + gL * 0.7152 + bL * 0.0722;
};

const getContrastRatio = (hex1: string, hex2: string): number => {
  const l1 = getLuminanceFromHex(hex1);
  const l2 = getLuminanceFromHex(hex2);
  const bright = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (bright + 0.05) / (dark + 0.05);
};

type ViewMode = 'ui' | 'typography' | 'dataviz';
type VisionMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia';

export const UIPreview: React.FC = () => {
  const { colors } = usePaletteStore();
  const [viewMode, setViewMode] = useState<ViewMode>('ui');
  const [visionMode, setVisionMode] = useState<VisionMode>('normal');

  // CSS İçin Güvenli Stil Renkleri (Tarayıcı için 6 haneli)
  const cssPrimaryHex = getCssHex(colors[0], '#F59E0B');
  const cssSecondary1Hex = getCssHex(colors[1], cssPrimaryHex);
  const cssSecondary2Hex = getCssHex(colors[2], cssSecondary1Hex);

  // Ekranda Basılacak Ham Değerler (Bit Derinliğine Göre 6/12 Haneli Metin)
  const rawPrimaryHex = colors[0]?.formats?.hex || cssPrimaryHex;

  const textOnPrimary =
    getContrastRatio(cssPrimaryHex, '#FFFFFF') >= getContrastRatio(cssPrimaryHex, '#000000')
      ? '#FFFFFF'
      : '#000000';

  const getFilterStyle = (): React.CSSProperties => {
    if (visionMode === 'normal') return {};
    return { filter: `url(#${visionMode}-filter)` };
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '12px',
        backgroundColor: m3Theme.surfaceHigh,
        borderRadius: '16px',
        border: `1px solid ${m3Theme.border}`
      }}
    >
      {/* 1. SEÇENEK SEKMELERİ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '4px', backgroundColor: m3Theme.surfaceHighest, padding: '3px', borderRadius: '8px' }}>
          {(['ui', 'typography', 'dataviz'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                flex: 1,
                padding: '6px 4px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === mode ? m3Theme.primary : 'transparent',
                color: viewMode === mode ? '#000' : m3Theme.textSecondary,
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: m3Theme.fontSans
              }}
            >
              {mode === 'ui' ? '📱 Arayüz' : mode === 'typography' ? '✍ Tipografi' : '📊 Grafik'}
            </button>
          ))}
        </div>

        <div>
          <label style={{ fontSize: '10px', color: m3Theme.textMuted, fontFamily: m3Theme.fontSans, fontWeight: 700 }}>
            RENK KÖRLÜĞÜ SİMÜLATÖRÜ
          </label>
          <select
            value={visionMode}
            onChange={(e) => setVisionMode(e.target.value as VisionMode)}
            style={{
              width: '100%',
              padding: '6px',
              marginTop: '3px',
              backgroundColor: m3Theme.surfaceHighest,
              border: `1px solid ${m3Theme.border}`,
              borderRadius: '6px',
              color: m3Theme.textPrimary,
              fontSize: '11px',
              fontFamily: m3Theme.fontSans,
              outline: 'none'
            }}
          >
            <option value="normal">Normal Görüş (%100)</option>
            <option value="protanopia">Protanopia (Kırmızı Körü)</option>
            <option value="deuteranopia">Deuteranopia (Yeşil Körü)</option>
            <option value="tritanopia">Tritanopia (Mavi Körü)</option>
          </select>
        </div>
      </div>

      {/* 2. CANLI ÖNİZLEME ALANI */}
      <div style={{ ...getFilterStyle(), transition: 'filter 0.2s ease' }}>
        {viewMode === 'ui' && (
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: cssPrimaryHex,
              color: textOnPrimary,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              transition: 'background-color 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: textOnPrimary === '#FFFFFF' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.4)',
                  color: textOnPrimary
                }}
              >
                M3 CARD
              </span>
              {/* SEÇİLEN BİT DERİNLİĞİNE GÖRE HAM KOD BURADA GÖSTERİLİYOR */}
              <span style={{ fontSize: '10px', fontFamily: m3Theme.fontMono, fontWeight: 600 }}>
                {rawPrimaryHex}
              </span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>Material 3 Dynamic Surface</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: textOnPrimary,
                  color: cssPrimaryHex,
                  fontWeight: 700,
                  fontSize: '11px'
                }}
              >
                Primary
              </button>
              <button
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${textOnPrimary}`,
                  backgroundColor: 'transparent',
                  color: textOnPrimary,
                  fontWeight: 600,
                  fontSize: '11px'
                }}
              >
                Secondary
              </button>
            </div>
          </div>
        )}

        {viewMode === 'typography' && (
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: m3Theme.surfaceHighest, border: `1px solid ${m3Theme.border}`, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: cssPrimaryHex, fontFamily: m3Theme.fontSans }}>
              Başlık Metni (Display)
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: cssSecondary1Hex, fontFamily: m3Theme.fontSans }}>
              Alt Başlık & Vurgu Metni
            </div>
            <div style={{ fontSize: '11px', color: m3Theme.textPrimary, lineHeight: '1.4', fontFamily: m3Theme.fontSans }}>
              Seçilen renklerin tipografi hiyerarşisi üzerindeki okunabilirlik ve uyum performansı.
            </div>
          </div>
        )}

        {viewMode === 'dataviz' && (
          <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: m3Theme.surfaceHighest, border: `1px solid ${m3Theme.border}`, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: m3Theme.textMuted }}>VERİ GÖRSELLEŞTİRME & GRAFİK TAYFI</span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px', padding: '4px' }}>
              {colors.map((c, idx) => (
                <div
                  key={c.id || idx}
                  style={{
                    flex: 1,
                    height: `${35 + ((idx + 1) % 4) * 20}%`,
                    backgroundColor: getCssHex(c, '#999'),
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.15s ease'
                  }}
                  title={`${c.role}: ${c.formats?.hex || getCssHex(c)}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. PALET İÇİ KONTRAST MATRİSİ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: m3Theme.textMuted, fontFamily: m3Theme.fontSans }}>
          PALET RENKLERİ KONTRAST MATRİSİ
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {colors.map((c1, i) =>
            colors.map((c2, j) => {
              if (i >= j) return null;
              const hex1 = getCssHex(c1, '#000000');
              const hex2 = getCssHex(c2, '#FFFFFF');
              const ratio = getContrastRatio(hex1, hex2);
              const passes = ratio >= 4.5;

              return (
                <div
                  key={`matrix-${i}-${j}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 8px',
                    backgroundColor: m3Theme.surfaceHighest,
                    borderRadius: '6px',
                    border: `1px solid ${m3Theme.border}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: hex1 }} />
                    <span style={{ fontSize: '10px', color: m3Theme.textMuted }}>vs</span>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: hex2 }} />
                    <span style={{ fontSize: '10.5px', color: m3Theme.textPrimary, fontWeight: 500 }}>
                      {c1.role || `R${i + 1}`} / {c2.role || `R${j + 1}`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: m3Theme.fontMono, color: m3Theme.primary }}>
                      {ratio.toFixed(2)}:1
                    </span>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '1px 4px',
                        borderRadius: '3px',
                        backgroundColor: passes ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: passes ? '#4ADE80' : '#FCA5A5'
                      }}
                    >
                      {passes ? 'AA ✓' : 'Zayıf ✕'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};