import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for PWA (Dedicated standalone app support)
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] New version detected, updating cache...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('[PWA] Service Worker ready for offline use.');
  },
  onRegistered(r) {
    console.log('[PWA] Service Worker registered with scope:', r?.scope);
  },
  onRegisterError(error) {
    console.error('[PWA] Service Worker registration failed:', error);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
