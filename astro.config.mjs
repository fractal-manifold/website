import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://fractalmanifold.com',
  compressHTML: true,
  integrations: [
    sitemap(),
  ],
});
