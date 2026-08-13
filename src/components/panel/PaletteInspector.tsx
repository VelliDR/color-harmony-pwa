// src/components/panel/PaletteInspector.tsx

import React, { useState } from 'react';
import { usePaletteStore } from '../../state/usePaletteStore';
import { ColorCardSlot } from './ColorCardSlot';
import { UIPreview } from './UIPreview';
import { ExportModal } from './ExportModal';
import { m3Theme } from '../../theme';
import { HarmonyRule, BitDepth, ColorSpace, RadiusMode } from '../../core/math-engine/types';

export const PaletteInspector: React.FC = () => {
  const {
    colors,
    rule,
    radiusMode,
    isSegmented,
    bitDepth,
    colorSpace,
    setRule,
    setRadiusMode,
    setIsSegmented,
    setBitDepth,
    setColorSpace
  } = usePaletteStore();

  const [openSection, setOpenSection] = useState<string | null>('wheel');
  const [isExportOpen, setIsExportOpen] = useState(false);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '16px',
        backgroundColor: m3Theme.surface,
        borderRadius: '20px',
        border: `1px solid ${m3Theme.border}`,
        color: m3Theme.textPrimary,
        width: '360px',
        maxWidth: '100%',
        boxSizing: 'border-box',
        flexShrink: 0
      }}
    >
      <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: m3Theme.primary, fontFamily: m3Theme.fontSans }}>
        Color Harmony M3
      </h3>

      {/* AKORDİYON 1: ÇEMBER VE UYUM AYARLARI */}
      <AccordionItem
        title="Çember ve Uyum Ayarları"
        isOpen={openSection === 'wheel'}
        onToggle={() => toggleSection('wheel')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Çember Modu */}
          <div>
            <label style={labelStyle}>ÇEMBER MODU</label>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <button
                onClick={() => setIsSegmented(true)}
                style={buttonToggleStyle(isSegmented)}
              >
                48 Renk (5 Halka)
              </button>
              <button
                onClick={() => setIsSegmented(false)}
                style={buttonToggleStyle(!isSegmented)}
              >
                Sürekli Tayf
              </button>
            </div>
          </div>

          {/* Yarıçap Davranışı */}
          <div>
            <label style={labelStyle}>YARIÇAP & PARLAKLIK DAVRANIŞI</label>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <button
                onClick={() => setRadiusMode('homogeneous')}
                style={buttonToggleStyle(radiusMode === 'homogeneous')}
              >
                Homojen
              </button>
              <button
                onClick={() => setRadiusMode('heterogeneous')}
                style={buttonToggleStyle(radiusMode === 'heterogeneous')}
              >
                Serbest
              </button>
            </div>
          </div>

          {/* Uyum Kuralı */}
          <div>
            <label style={labelStyle}>RENK UYUM KURALI</label>
            <select
              value={rule}
              onChange={(e) => setRule(e.target.value as HarmonyRule)}
              style={selectStyle}
            >
              <option value="triadic">Üçlü (Triadic)</option>
              <option value="complementary">Tamamlayıcı (Complementary)</option>
              <option value="analogous">Benzer (Analogous)</option>
              <option value="split-complementary">Bölünmüş Tamamlayıcı</option>
              <option value="tetradic">Dörtlü (Tetradic)</option>
              <option value="square">Kare (Square)</option>
              <option value="monochromatic">Tek Renk (Monochromatic)</option>
              <option value="achromatic">Aromatik (Achromatic)</option>
            </select>
          </div>
        </div>
      </AccordionItem>

      {/* AKORDİYON 2: BİT DERİNLİĞİ & RENK UZAYI */}
      <AccordionItem
        title="Bit Derinliği & Renk Uzayı"
        isOpen={openSection === 'bitdepth'}
        onToggle={() => toggleSection('bitdepth')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={labelStyle}>BİT DERİNLİĞİ</label>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
              {[8, 10, 12, 16, 32].map((depth) => (
                <button
                  key={depth}
                  onClick={() => setBitDepth(depth as BitDepth)}
                  style={pillStyle(bitDepth === depth)}
                >
                  {depth === 32 ? '32-Float' : `${depth}-bit`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>RENK UZAYI (GAMUT)</label>
            <select
              value={colorSpace}
              onChange={(e) => setColorSpace(e.target.value as ColorSpace)}
              style={selectStyle}
            >
              <option value="sRGB">sRGB (Standart Web)</option>
              <option value="Display-P3">Display-P3 (Geniş Gamut Apple/OLED)</option>
              <option value="Adobe-RGB">Adobe-RGB (Baskı & Fotoğraf)</option>
              <option value="Rec2020">Rec.2020 (HDR Video)</option>
            </select>
          </div>
        </div>
      </AccordionItem>

      {/* AKORDİYON 3: PALET RENKLERİ */}
      <AccordionItem
        title={`Palet Renkleri (${colors.length})`}
        isOpen={openSection === 'colors'}
        onToggle={() => toggleSection('colors')}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {colors.map((color) => (
            <ColorCardSlot
              key={color.id}
              color={color}
              onToggleLock={() => {}}
            />
          ))}
        </div>
      </AccordionItem>

      {/* AKORDİYON 4: CANLI UI ÖNİZLEME */}
      <AccordionItem
        title="Canlı UI Önizleme"
        isOpen={openSection === 'preview'}
        onToggle={() => toggleSection('preview')}
      >
        <UIPreview />
      </AccordionItem>

      {/* DIŞA AKTAR BUTONU */}
      <button
        onClick={() => setIsExportOpen(true)}
        style={{
          marginTop: '6px',
          padding: '12px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: m3Theme.primary,
          color: '#000',
          fontWeight: 700,
          fontSize: '13px',
          fontFamily: m3Theme.fontSans,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(245, 158, 11, 0.25)',
          transition: 'transform 0.1s ease'
        }}
      >
        🚀 Paleti Dışa Aktar (Design Tokens / SVG)
      </button>

      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};

// YARDIMCI AKORDİYON BİLEŞENİ
const AccordionItem: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => (
  <div style={{ backgroundColor: m3Theme.surfaceHigh, borderRadius: '12px', overflow: 'hidden' }}>
    <button
      onClick={onToggle}
      style={{
        width: '100%',
        padding: '12px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
        border: 'none',
        color: m3Theme.textPrimary,
        fontWeight: 600,
        fontSize: '13px',
        fontFamily: m3Theme.fontSans,
        cursor: 'pointer'
      }}
    >
      <span>{title}</span>
      <span style={{ fontSize: '10px', color: m3Theme.textMuted }}>{isOpen ? '▲' : '▼'}</span>
    </button>
    {isOpen && <div style={{ padding: '0 14px 14px 14px' }}>{children}</div>}
  </div>
);

// ORTAK STİLLER
const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  color: m3Theme.textMuted,
  fontFamily: m3Theme.fontSans
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  marginTop: '4px',
  backgroundColor: m3Theme.surfaceHighest,
  border: `1px solid ${m3Theme.border}`,
  borderRadius: '8px',
  color: m3Theme.textPrimary,
  fontSize: '12px',
  fontFamily: m3Theme.fontSans,
  outline: 'none'
};

const buttonToggleStyle = (isActive: boolean): React.CSSProperties => ({
  flex: 1,
  padding: '8px 10px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: isActive ? m3Theme.primary : m3Theme.surfaceHighest,
  color: isActive ? '#000' : m3Theme.textSecondary,
  fontWeight: 600,
  fontSize: '11.5px',
  fontFamily: m3Theme.fontSans,
  cursor: 'pointer',
  transition: 'all 0.15s ease'
});

const pillStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '5px 10px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: isActive ? m3Theme.primary : m3Theme.surfaceHighest,
  color: isActive ? '#000' : m3Theme.textSecondary,
  fontWeight: 600,
  fontSize: '11px',
  fontFamily: m3Theme.fontMono,
  cursor: 'pointer',
  transition: 'all 0.15s ease'
});