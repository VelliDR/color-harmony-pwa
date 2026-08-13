// src/App.tsx

import React from 'react';
import { ColorWheel } from './components/wheel/ColorWheel';
import { GeometryOverlay } from './components/wheel/GeometryOverlay';
import { PaletteInspector } from './components/panel/PaletteInspector';
import { usePaletteStore } from './state/usePaletteStore';

export const App: React.FC = () => {
  const { baseHue, isSegmented, setBaseHue, colors } = usePaletteStore();

  return (
    // src/App.tsx (Düzeltilmiş Kısım)
// src/App.tsx
<div
  style={{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '24px',
    padding: '20px 12px',
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#121212',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }}
>
      {/* SOL ALAN: RENK ÇEMBERİ VE VEKTÖREL GEOMETRİ KATMANI */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <h2 style={{ color: '#FFF', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
          Renk Çemberi
        </h2>

        {/* Çember ve üstüne binen SVG katmanının konumu */}
        <div
          style={{
            position: 'relative',
            width: '320px',
            height: '320px'
          }}
        >
          <ColorWheel
            currentHue={baseHue}
            isSegmented={isSegmented}
            size={320}
            onHueChange={setBaseHue}
          />
          <GeometryOverlay colors={colors} size={320} />
        </div>

        <span style={{ color: '#888', fontSize: '13px' }}>
          Çember üzerinde tıklayarak veya sürükleyerek rengi değiştirebilirsiniz.
        </span>
      </div>

      {/* SAĞ ALAN: CANLI ARAYÜZ VE DİNAMİK RENK KARTLARI PANELİ */}
      <PaletteInspector />
    </div>
  );
};

export default App;