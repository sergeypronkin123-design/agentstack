// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://agentstack.dev', // ← поменяйте на свой домен после регистрации
  integrations: [tailwind({ applyBaseStyles: false }), sitemap(), mdx()],
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  vite: { build: { cssMinify: 'lightningcss' } },
});
