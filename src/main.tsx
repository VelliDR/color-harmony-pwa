// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service Worker Kaydı
// src/main.tsx (Alt Kısım)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then( // '/sw.js' yerine 'sw.js'
      (registration) => {
        console.log('ServiceWorker başarıyla kaydoldu:', registration.scope);
      },
      (err) => {
        console.log('ServiceWorker kaydı başarısız:', err);
      }
    );
  });
}