// src/App.tsx

import React from 'react';
import { ColorWheel } from './components/wheel/ColorWheel';
import { TonalLadderView } from './components/wheel/TonalLadderView';
import { PaletteInspector } from './components/panel/PaletteInspector';
import { m3Theme } from './theme';

export const App: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: m3Theme.bg,
        color: m3Theme.textPrimary,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: '24px',
        padding: '16px',
        boxSizing: 'border-box',
        fontFamily: m3Theme.fontSans
      }}
    >
      {/* GLOBAL SVG FİLTRELER */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
          </filter>
        </defs>
      </svg>

      {/* SOL KOLON: ÇEMBER + ALTINDA TONAL MERDİVENLER */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          flexShrink: 0
        }}
      >
        {/* Çember Kutusu */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            backgroundColor: m3Theme.surface,
            borderRadius: '24px',
            border: `1px solid ${m3Theme.border}`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <ColorWheel />
        </div>

        {/* Çemberin Altındaki Tonal Merdiven */}
        <TonalLadderView />
      </div>

      {/* SAĞ KOLON: PANEL & SİMÜLASYONLAR */}
      <PaletteInspector />
    </div>
  );
};

export default App;