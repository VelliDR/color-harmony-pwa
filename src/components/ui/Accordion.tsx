// src/components/panel/PaletteInspector.tsx içindeki Akordiyon 1 bölümü:

const {
  colors,
  rule,
  radiusMode,
  isSegmented,
  bitDepth,
  colorSpace,
  colorEngine,     // <-- YENİ
  setColorEngine,  // <-- YENİ
  setRule,
  // ...
} = usePaletteStore();

// ...

{/* AKORDİYON 1: ÇEMBER VE UYUM AYARLARI */}
<AccordionItem
  title="Çember ve Uyum Ayarları"
  isOpen={openSection === 'wheel'}
  onToggle={() => toggleSection('wheel')}
>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    
    {/* YENİ: RENK MOTORU (ALGISAL OKLCH VS KLASİK HSL) */}
    <div>
      <label style={labelStyle}>RENK MOTORU (ALGISAL PARLAKLIK)</label>
      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
        <button
          onClick={() => setColorEngine('hsl')}
          style={buttonToggleStyle(colorEngine === 'hsl')}
        >
          Klasik (HSL)
        </button>
        <button
          onClick={() => setColorEngine('oklch')}
          style={buttonToggleStyle(colorEngine === 'oklch')}
        >
          Algısal (OKLCH)
        </button>
      </div>
    </div>

    {/* Çember Modu (48 Renk / Sürekli Tayf) */}
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

    {/* Yarıçap & Uyum Kuralı devamı... */}
  </div>
</AccordionItem>