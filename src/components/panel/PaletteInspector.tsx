// src/components/panel/PaletteInspector.tsx

import React, { useState, useMemo } from 'react';
import { usePaletteStore } from '../../state/usePaletteStore';
import { ColorCardSlot } from './ColorCardSlot';
import { ExportModal } from './ExportModal';
import { Accordion } from '../ui/Accordion';
import { m3Theme } from '../../theme';
import { ColorBlindType, simulateColorBlindness } from '../../core/math-engine/colorblind';
import { getContrastRatio } from '../../core/math-engine/wcag';
import { HarmonyRule, BitDepth, ColorSpace, ColorObject, RadiusMode } from '../../core/math-engine/types';

// HSL -> RGB Dönüştürücü
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

// RGB -> HSL Dönüştürücü (Simülasyon Önizlemesi İçin)
const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s, l };
};

export const PaletteInspector: React.FC = () => {
  const {
    colors,
    rule,
    bitDepth,
    colorSpace,
    isSegmented,
    radiusMode,
    setRule,
    setBitDepth,
    setColorSpace,
    setIsSegmented,
    setRadiusMode,
    toggleLockColor
  } = usePaletteStore();

  const [simType, setSimType] = useState<ColorBlindType>('none');

  // Ana renk metin kontrast oranları hesaplaması
  const contrastData = useMemo(() => {
    if (colors.length === 0) return null;
    const bgRgb = hslToRgb(colors[0].hsl.h, colors[0].hsl.s, colors[0].hsl.l);
    return {
      white: getContrastRatio(bgRgb, [255, 255, 255]),
      black: getContrastRatio(bgRgb, [0, 0, 0])
    };
  }, [colors]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        backgroundColor: m3Theme.bg,
        borderRadius: '16px',
        color: m3Theme.textPrimary,
        width: '340px',
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}
    >
      <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold', color: m3Theme.primary, flexShrink: 0 }}>
        Color Harmony M3
      </h3>

      {/* 1. AKORDİYON: ÇEMBER VE UYUM AYARLARI */}
      <Accordion title="Çember ve Uyum Ayarları" defaultOpen={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* ÇEMBER MODU */}
          <div>
            <label style={{ fontSize: '11px', color: m3Theme.textSecondary }}>ÇEMBER MODU</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                onClick={() => setIsSegmented(true)}
                style={{
                  flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                  backgroundColor: isSegmented ? m3Theme.primary : m3Theme.surfaceVariant,
                  color: isSegmented ? m3Theme.onPrimary : m3Theme.textPrimary, cursor: 'pointer', fontSize: '11px'
                }}
              >
                48 Renk (5 Halka)
              </button>
              <button
                onClick={() => setIsSegmented(false)}
                style={{
                  flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                  backgroundColor: !isSegmented ? m3Theme.primary : m3Theme.surfaceVariant,
                  color: !isSegmented ? m3Theme.onPrimary : m3Theme.textPrimary, cursor: 'pointer', fontSize: '11px'
                }}
              >
                Sürekli Tayf
              </button>
            </div>
          </div>

          {/* YARIÇAP GEOMETRİ MODU (HOMOJEN / HETEROJEN) */}
          <div>
            <label style={{ fontSize: '11px', color: m3Theme.textSecondary }}>YARIÇAP & PARLAKLIK DAVRANIŞI</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                onClick={() => setRadiusMode('homogeneous')}
                style={{
                  flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                  backgroundColor: radiusMode === 'homogeneous' ? m3Theme.primary : m3Theme.surfaceVariant,
                  color: radiusMode === 'homogeneous' ? m3Theme.onPrimary : m3Theme.textPrimary, cursor: 'pointer', fontSize: '11px'
                }}
              >
                Homojen
              </button>
              <button
                onClick={() => setRadiusMode('heterogeneous')}
                style={{
                  flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                  backgroundColor: radiusMode === 'heterogeneous' ? m3Theme.primary : m3Theme.surfaceVariant,
                  color: radiusMode === 'heterogeneous' ? m3Theme.onPrimary : m3Theme.textPrimary, cursor: 'pointer', fontSize: '11px'
                }}
              >
                Serbest
              </button>
            </div>
          </div>

          {/* RENK UYUM KURALI */}
          <div>
            <label style={{ fontSize: '11px', color: m3Theme.textSecondary }}>RENK UYUM KURALI</label>
            <select
              value={rule}
              onChange={(e) => setRule(e.target.value as HarmonyRule)}
              style={{
                width: '100%', padding: '8px', borderRadius: '8px', marginTop: '4px',
                backgroundColor: m3Theme.surfaceVariant, color: m3Theme.textPrimary, border: `1px solid ${m3Theme.border}`
              }}
            >
              <option value="triadic">Üçlü (Triadic)</option>
              <option value="complementary">Tamamlayıcı</option>
              <option value="analogous">Ardışık (Analogous)</option>
              <option value="split-complementary">Çapraz Tamamlayıcı</option>
              <option value="tetradic">Dörtlü (Tetradic)</option>
              <option value="monochromatic">Monokromatik</option>
            </select>
          </div>

        </div>
      </Accordion>

      {/* 2. AKORDİYON: HASSASİYET VE RENK UZAYI */}
      <Accordion title="Bit Derinliği & Renk Uzayı">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: m3Theme.textSecondary }}>BIT DERİNLİĞİ</label>
            <select
              value={bitDepth}
              onChange={(e) => setBitDepth(Number(e.target.value) as BitDepth)}
              style={{
                width: '100%', padding: '8px', borderRadius: '8px', marginTop: '4px',
                backgroundColor: m3Theme.surfaceVariant, color: m3Theme.textPrimary, border: `1px solid ${m3Theme.border}`
              }}
            >
              {([8, 10, 12, 14, 16, 32] as BitDepth[]).map((b) => (
                <option key={b} value={b}>{b}-bit {b === 32 ? '(HDR Float)' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: m3Theme.textSecondary }}>RENK UZAYI</label>
            <select
              value={colorSpace}
              onChange={(e) => setColorSpace(e.target.value as ColorSpace)}
              style={{
                width: '100%', padding: '8px', borderRadius: '8px', marginTop: '4px',
                backgroundColor: m3Theme.surfaceVariant, color: m3Theme.textPrimary, border: `1px solid ${m3Theme.border}`
              }}
            >
              {(['sRGB', 'Display-P3', 'Adobe-RGB', 'Rec2020'] as ColorSpace[]).map((cs) => (
                <option key={cs} value={cs}>{cs}</option>
              ))}
            </select>
          </div>
        </div>
      </Accordion>

      {/* 3. AKORDİYON: RENK KÖRLEŞTİRME & WCAG ANALİZİ */}
      <Accordion title="Erişilebilirlik & Simülasyon" badge="WCAG">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: m3Theme.textSecondary }}>RENK KÖRLÜĞÜ SİMÜLASYONU</label>
            <select
              value={simType}
              onChange={(e) => setSimType(e.target.value as ColorBlindType)}
              style={{
                width: '100%', padding: '8px', borderRadius: '8px', marginTop: '4px',
                backgroundColor: m3Theme.surfaceVariant, color: m3Theme.textPrimary, border: `1px solid ${m3Theme.border}`
              }}
            >
              <option value="none">Normal Görme</option>
              <option value="protanopia">Protanopia (Kırmızı Yoksunluğu)</option>
              <option value="deuteranopia">Deuteranopia (Yeşil Yoksunluğu)</option>
              <option value="tritanopia">Tritanopia (Mavi Yoksunluğu)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: m3Theme.textSecondary }}>ANA RENK / METİN KONTRASTI</label>
            {contrastData && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '11px' }}>
                <div style={{ flex: 1, padding: '6px', backgroundColor: '#FFF', color: '#000', borderRadius: '6px', textAlign: 'center' }}>
                  Beyaz: <strong>{contrastData.white.toFixed(1)}:1</strong> {contrastData.white >= 4.5 ? '✓ AA' : '✕'}
                </div>
                <div style={{ flex: 1, padding: '6px', backgroundColor: '#000', color: '#FFF', borderRadius: '6px', textAlign: 'center' }}>
                  Siyah: <strong>{contrastData.black.toFixed(1)}:1</strong> {contrastData.black >= 4.5 ? '✓ AA' : '✕'}
                </div>
              </div>
            )}
          </div>
        </div>
      </Accordion>

      {/* 4. AKORDİYON: CANLI PALET KARTLARI */}
      <Accordion title="Canlı Palet Kartları" badge={`${colors.length}`} defaultOpen={true}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {colors.map((color) => {
            let displayColor: ColorObject = color;

            if (simType !== 'none') {
              const [r, g, b] = hslToRgb(color.hsl.h, color.hsl.s, color.hsl.l);
              const [sr, sg, sb] = simulateColorBlindness(r, g, b, simType);
              const simHsl = rgbToHsl(sr, sg, sb);

              displayColor = {
                ...color,
                hsl: simHsl,
                formats: {
                  ...color.formats,
                  hex: `#${((1 << 24) + (sr << 16) + (sg << 8) + sb).toString(16).slice(1).toUpperCase()}`,
                  rgbString: `rgb(${sr}, ${sg}, ${sb})`
                }
              };
            }

            return (
              <ColorCardSlot
                key={color.id}
                color={displayColor}
                onToggleLock={toggleLockColor}
              />
            );
          })}
        </div>
      </Accordion>

      {/* 5. AKORDİYON: DIŞA AKTAR / EXPORT */}
      <Accordion title="Dışa Aktar (CSS, JSON, Swatch)">
        <ExportModal />
      </Accordion>
    </div>
  );
};