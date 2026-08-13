// src/App.tsx

import React from 'react';
import { ColorWheel } from './components/wheel/ColorWheel';
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
        boxSizing: 'border-box'
      }}
    >
      {/* SOL / ÜST: RENK ÇEMBERİ KARTI */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: m3Theme.surface,
          borderRadius: '24px',
          border: `1px solid ${m3Theme.border}`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          flexShrink: 0
        }}
      >
        <ColorWheel />
      </div>

      {/* SAĞ / ALT: PANEL */}
      <PaletteInspector />
    </div>
  );
};

export default App;