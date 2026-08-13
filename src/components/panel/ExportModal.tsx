// src/components/panel/ExportModal.tsx

import React, { useState } from 'react';
import { usePaletteStore } from '../../state/usePaletteStore';

export const ExportModal: React.FC = () => {
  const { colors, rule, bitDepth, colorSpace } = usePaletteStore();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // CSS Metni Oluşturma (:root değişkenleri)
  const generateCSS = () => {
    let css = `/* Color Harmony Palette - ${rule.toUpperCase()} */\n:root {\n`;
    colors.forEach((c, index) => {
      css += `  --color-${index + 1}: ${c.formats.hex};\n`;
    });
    css += `}\n`;
    return css;
  };

  // JSON Metni Oluşturma
  const generateJSON = () => {
    const data = {
      rule,
      bitDepth,
      colorSpace,
      colors: colors.map((c) => ({
        role: c.role,
        angleOffset: c.angleOffset,
        hex: c.formats.hex,
        rgb: c.formats.rgbString,
        cssColorL4: c.formats.cssColorL4
      }))
    };
    return JSON.stringify(data, null, 2);
  };

  // Dosya İndirme Fonksiyonu
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Panoya Kopyalama Fonksiyonu
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
      <label style={{ fontSize: '12px', color: '#AAA' }}>DIŞA AKTAR (EXPORT)</label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => downloadFile(generateCSS(), 'palette.css', 'text/css')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#2A2A2A',
            color: '#FFF',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          CSS İndir
        </button>
        <button
          onClick={() => downloadFile(generateJSON(), 'palette.json', 'application/json')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#2A2A2A',
            color: '#FFF',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          JSON İndir
        </button>
      </div>
      <button
        onClick={() => handleCopy(generateCSS(), 'css')}
        style={{
          padding: '8px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: '#007ACC',
          color: '#FFF',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        {copiedType === 'css' ? '✓ CSS Kopyalandı' : 'Tüm CSS Değişkenlerini Kopyala'}
      </button>
    </div>
  );
};