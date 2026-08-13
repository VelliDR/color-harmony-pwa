// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service Worker SADECE Canlıya Alındığında (Production) Çalışsın!
if (import.meta.env.VITE_MODE === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/color-harmony-pwa/sw.js')
      .then((reg) => console.log('SW Başarıyla Kaydoldu:', reg.scope))
      .catch((err) => console.error('SW Kayıt Hatası:', err));
  });
}