import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://fractalmanifold.com',
  compressHTML: true,
  // Legal pages moved to one-word URLs; keep the old ones resolving.
  redirects: {
    '/legal-notice': '/legal',
    '/privacy-policy': '/privacy',
    '/aviso-legal': '/aviso',
    '/politica-privacidad': '/privacidad',
  },
  integrations: [
    sitemap(),
  ],
});
