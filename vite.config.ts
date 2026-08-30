import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import fs from 'fs';

// Cross-device network sync plugin for DevCraft
function devcraftMessageSyncPlugin(): Plugin {
  const sharedFilePath = path.resolve(__dirname, '.shared_messages.json');

  const getSharedMessages = (): any[] => {
    try {
      if (fs.existsSync(sharedFilePath)) {
        const raw = fs.readFileSync(sharedFilePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error reading shared messages file:', e);
    }
    return [];
  };

  const saveSharedMessages = (msgs: any[]) => {
    try {
      fs.writeFileSync(sharedFilePath, JSON.stringify(msgs, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Error writing shared messages file:', e);
    }
  };

  return {
    name: 'devcraft-message-sync-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/api/messages')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
          }

          if (req.method === 'GET') {
            const msgs = getSharedMessages();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(msgs));
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const newMsg = JSON.parse(body);
                const current = getSharedMessages();
                const exists = current.some(
                  (m: any) =>
                    m.id === newMsg.id ||
                    (m.raw_text === newMsg.raw_text &&
                      m.sender_id === newMsg.sender_id &&
                      Math.abs(new Date(m.created_at || 0).getTime() - new Date(newMsg.created_at || 0).getTime()) < 5000)
                );

                let updated = current;
                if (!exists) {
                  updated = [...current, newMsg];
                } else {
                  updated = current.map((m: any) =>
                    m.id === newMsg.id || (m.raw_text === newMsg.raw_text && m.sender_id === newMsg.sender_id) ? newMsg : m
                  );
                }

                saveSharedMessages(updated);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, message: newMsg, total: updated.length }));
              } catch (err: any) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    devcraftMessageSyncPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: false,
      },
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'icons/*.png',
        'manifest.webmanifest'
      ],
      manifest: {
        id: '/',
        name: 'via-P.A.A.R.',
        short_name: 'via-P.A.A.R.',
        description: 'Fin AI Order Management Engine — Offline-First WhatsApp Order Parser & Multi-Device Sync',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
        background_color: '#f5f1ec',
        theme_color: '#f5f1ec',
        orientation: 'portrait',
        prefer_related_applications: false,
        categories: ['business', 'productivity', 'utilities'],
        icons: [
          {
            src: '/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Intake Order',
            short_name: 'Intake',
            description: 'Parse WhatsApp and Voice Orders',
            url: '/',
            icons: [
              {
                src: '/icons/pwa-192x192.png',
                sizes: '192x192'
              }
            ]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
