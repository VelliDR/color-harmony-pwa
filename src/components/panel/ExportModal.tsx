// src/components/panel/ExportModal.tsx

import React, { useState } from 'react';
import { usePaletteStore } from '../../state/usePaletteStore';
import { m3Theme } from '../../theme';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormatType = 'css' | 'tailwind' | 'json' | 'svg';

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { colors, rule } = usePaletteStore();
  const [activeTab, setActiveTab] = useState<FormatType>('css');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // 1. CSS VARIABLES DİZESİ
  const generateCSS = (): string => {
    let output = `:root {\n  /* Color Harmony M3 - ${rule.toUpperCase()} Palette */\n`;
    colors.forEach((c, idx) => {
      const name = idx === 0 ? 'primary' : `secondary-${idx}`;
      output += `  --color-${name}: ${c.formats.hex};\n`;
      output += `  --color-${name}-rgb: ${c.formats.rgbString};\n`;
    });
    output += `}`;
    return output;
  };

  // 2. TAILWIND CSS CONFIG
  const generateTailwind = (): string => {
    let output = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n`;
    colors.forEach((c, idx) => {
      const name = idx === 0 ? 'primary' : `secondary-${idx}`;
      output += `        '${name}': '${c.formats.hex}',\n`;
    });
    output += `      }\n    }\n  }\n}`;
    return output;
  };

  // 3. FIGMA DESIGN TOKENS (JSON)
  const generateJSON = (): string => {
    const tokens: Record<string, any> = {};
    colors.forEach((c, idx) => {
      const name = idx === 0 ? 'Primary' : `Secondary ${idx}`;
      tokens[name] = {
        $value: c.formats.hex,
        $type: 'color',
        $description: `HSL(${Math.round(c.hsl.h)}, ${Math.round(c.hsl.s * 100)}%, ${Math.round(c.hsl.l * 100)}%)`
      };
    });
    return JSON.stringify(tokens, null, 2);
  };

  // 4. SVG SWATCH İNDİRME SİHRİLİSİ
  const handleDownloadSVG = () => {
    const swatchWidth = 120;
    const swatchHeight = 160;
    const totalWidth = colors.length * swatchWidth;
    
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${swatchHeight}" viewBox="0 0 ${totalWidth} ${swatchHeight}">`;
    svgContent += `<rect width="100%" height="100%" fill="#140D13" />`;

    colors.forEach((c, idx) => {
      const x = idx * swatchWidth;
      svgContent += `
        <g transform="translate(${x}, 0)">
          <rect x="10" y="10" width="100" height="90" rx="8" fill="${c.formats.hex}" />
          <text x="60" y="122" fill="#FFFFFF" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">${c.formats.hex}</text>
          <text x="60" y="140" fill="#AC9AAA" font-family="sans-serif" font-size="10" text-anchor="middle">${c.role || `Color ${idx + 1}`}</text>
        </g>
      `;
    });

    svgContent += `</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `palette-${rule}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getCodeText = (): string => {
    switch (activeTab) {
      case 'css': return generateCSS();
      case 'tailwind': return generateTailwind();
      case 'json': return generateJSON();
      default: return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '520px',
          maxWidth: '100%',
          backgroundColor: m3Theme.surface,
          borderRadius: '20px',
          border: `1px solid ${m3Theme.border}`,
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          color: m3Theme.textPrimary
        }}
      >
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: m3Theme.primary, fontFamily: m3Theme.fontSans }}>
            Dışa Aktar & Design Tokens
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: m3Theme.textMuted,
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: m3Theme.surfaceHigh, padding: '4px', borderRadius: '10px' }}>
          {(['css', 'tailwind', 'json', 'svg'] as FormatType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === tab ? m3Theme.primary : 'transparent',
                color: activeTab === tab ? '#000' : m3Theme.textSecondary,
                fontWeight: 600,
                fontSize: '11.5px',
                fontFamily: m3Theme.fontSans,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* CONTENT BLOCK */}
        {activeTab === 'svg' ? (
          <div style={{ padding: '30px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', color: m3Theme.textSecondary }}>
              Paletinizi Vektörel SVG Swatch görseli olarak indirin ve tasarım araçlarınıza (Figma, Illustrator, Penpot) sürükleyin.
            </div>
            <button
              onClick={handleDownloadSVG}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: m3Theme.primary,
                color: '#000',
                fontWeight: 700,
                fontSize: '13px',
                fontFamily: m3Theme.fontSans,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
              }}
            >
              ⬇ SVG Swatches İndir
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <pre
              style={{
                margin: 0,
                padding: '14px',
                backgroundColor: '#120A11',
                borderRadius: '10px',
                border: `1px solid ${m3Theme.border}`,
                color: '#E879F9',
                fontFamily: m3Theme.fontMono,
                fontSize: '12px',
                maxHeight: '220px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap'
              }}
            >
              {getCodeText()}
            </pre>

            <button
              onClick={handleCopy}
              style={{
                alignSelf: 'flex-end',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: m3Theme.surfaceHighest,
                color: m3Theme.textPrimary,
                fontWeight: 600,
                fontSize: '12px',
                fontFamily: m3Theme.fontSans,
                cursor: 'pointer'
              }}
            >
              {copied ? '✓ Kopyalandı' : '📋 Kodu Kopyala'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};