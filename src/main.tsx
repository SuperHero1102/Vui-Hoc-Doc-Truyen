import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Network-First Offline Service Worker for 100% Offline capability + automatic updates when online
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw-offline.js', { scope: '/' })
      .then((registration) => {
        window.addEventListener('online', () => {
          registration.update().catch(() => {});
        });
      })
      .catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(<App />);
