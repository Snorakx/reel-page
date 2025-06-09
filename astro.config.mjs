// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://coderno.pl', // Ustaw rzeczywisty URL strony
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react()],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});