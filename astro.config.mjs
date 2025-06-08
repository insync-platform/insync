// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import netlify from '@astrojs/netlify';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  site: 'https://insync.insure',
  integrations: [sitemap()],
  adapter: netlify()
});