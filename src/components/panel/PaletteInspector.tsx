// src/components/panel/PaletteInspector.tsx

import React from 'react';
import { usePaletteStore } from '../../state/usePaletteStore';
import { ColorCardSlot } from './ColorCardSlot';
import { HarmonyRule, BitDepth, ColorSpace } from '../../core/math-engine/types';
import { ExportModal } from './ExportModal';

export const PaletteInspector: React.FC = () => {
  const {
    colors,
    rule,
    bitDepth,
    colorSpace,
    isSegmented,
    setRule,
    setBitDepth,
    setColorSpace,
    setIsSegmented,
    toggleLockColor
  } = usePaletteStore();

  const rules: { key: HarmonyRule; label: string }[] = [
    { key: 'triadic', label: 'Üçlü (Triadic)' },
    { key: 'complementary', label: 'Tamamlayıcı (2 Renk)' },
    { key: 'analogous', label: 'Ardışık (Analogous)' },
    { key: 'split-complementary', label: 'Çapraz Tamamlayıcı' },
    { key: 'tetradic', label: 'Dörtlü (Tetradic)' },
    { key: 'square', label: 'Kare (Square)' },
    { key: 'monochromatic', label: 'Monokromatik' },
    { key: 'achromatic', label: 'Akromatik' }
  ];

  const bitDepths: BitDepth[] = [8, 10, 12, 14, 16, 32];
  const colorSpaces: ColorSpace[] = ['sRGB', 'Display-P3', 'Adobe-RGB', 'Rec2020'];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px',
        backgroundColor: '#141414',
        borderRadius: '12px',
        color: '#FFF',
        width: '320px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
    >
      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Canlı Palet ve Ayarlar</h3>

      {/* 1. ÇEMBER MODU SEÇİMİ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '12px', color: '#AAA' }}>ÇEMBER MODU</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsSegmented(true)}
            style={{
              flex: 1,
              padding: '6px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: isSegmented ? '#007ACC' : '#2A2A2A',
              color: '#FFF',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            48 Renk (Temel)
          </button>
          <button
            onClick={() => setIsSegmented(false)}
            style={{
              flex: 1,
              padding: '6px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: !isSegmented ? '#007ACC' : '#2A2A2A',
              color: '#FFF',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Sürekli Tayf
          </button>
        </div>
      </div>

      {/* 2. BIT DERİNLİĞİ SEÇİMİ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '12px', color: '#AAA' }}>BIT DERİNLİĞİ</label>
        <select
          value={bitDepth}
          onChange={(e) => setBitDepth(Number(e.target.value) as BitDepth)}
          style={{
            padding: '8px',
            borderRadius: '6px',
            backgroundColor: '#2A2A2A',
            color: '#FFF',
            border: '1px solid #333',
            fontSize: '13px'
          }}
        >
          {bitDepths.map((b) => (
            <option key={b} value={b}>
              {b}-bit {b === 8 ? '(Standart Web)' : b === 32 ? '(Float / HDR)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* 3. RENK UZAYI SEÇİMİ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '12px', color: '#AAA' }}>RENK UZAYI (COLOR SPACE)</label>
        <select
          value={colorSpace}
          onChange={(e) => setColorSpace(e.target.value as ColorSpace)}
          style={{
            padding: '8px',
            borderRadius: '6px',
            backgroundColor: '#2A2A2A',
            color: '#FFF',
            border: '1px solid #333',
            fontSize: '13px'
          }}
        >
          {colorSpaces.map((cs) => (
            <option key={cs} value={cs}>
              {cs}
            </option>
          ))}
        </select>
      </div>

      {/* 4. RENK UYUM KURALI SEÇİMİ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '12px', color: '#AAA' }}>RENK UYUM KURALI</label>
        <select
          value={rule}
          onChange={(e) => setRule(e.target.value as HarmonyRule)}
          style={{
            padding: '8px',
            borderRadius: '6px',
            backgroundColor: '#2A2A2A',
            color: '#FFF',
            border: '1px solid #333',
            fontSize: '13px'
          }}
        >
          {rules.map((r) => (
            <option key={r.key} value={r.key}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <hr style={{ borderColor: '#2A2A2A', margin: '4px 0' }} />

     {/* 5. DİNAMİK RENK KARTLARI LİSTESİ */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {colors.map((color) => (
          <ColorCardSlot
            key={color.id}
            color={color}
            onToggleLock={toggleLockColor}
          />
        ))}
      </div>

      {/* 6. DIŞA AKTARMA BUTONLARI */}
      <ExportModal />
    </div>
  );
};