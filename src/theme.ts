// src/theme.ts

export const m3Theme = {
  // M3 Tonal Surface Katmanları
  bg: '#140D13',             // Ana arka plan
  surface: '#1E141C',        // Çember & Panel kart yüzeyi
  surfaceHigh: '#291B27',    // Renk kartı slotları
  surfaceHighest: '#352332', // Kontrol elemanları, butonlar, inputlar
  surfaceVariant: '#271A25', // Alternatif yüzey tonu
  
  // Sınır Çizgileri & Vurgular
  border: 'rgba(255, 255, 255, 0.07)',
  borderFocus: 'rgba(245, 158, 11, 0.4)',
  
  // Tipografi Renkleri
  textPrimary: '#F3EBF1',
  textSecondary: '#AC9AAA',
  textMuted: '#7A6777',
  
  // Ana Renk Vurguları
  primary: '#F59E0B',     // Amber
  onPrimary: '#000000',   // Primary üzerindeki metin rengi
  primaryMuted: 'rgba(245, 158, 11, 0.15)',
  secondary: '#E879F9',   // Mürdüm Pembe Vurgu
  secondaryMuted: 'rgba(232, 121, 249, 0.15)',
  
  // Yuvarlatma Değerleri (Radius)
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px'
  },

  // Tipografi Aileleri
  fontSans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontMono: '"JetBrains Mono", "Fira Code", monospace',
};