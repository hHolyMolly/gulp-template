/**
 * Project Configuration
 *
 * This file contains user-facing settings only.
 * Directory structure and internal paths are managed by gulp/configs/paths.js
 */

const isDev = process.env.NODE_ENV !== 'production';
const isProd = process.env.NODE_ENV === 'production';

export const projectConfig = {
  // ─────────────────────────────────────────────────────────
  // Environment
  // ─────────────────────────────────────────────────────────

  env: { isDev, isProd },

  // ─────────────────────────────────────────────────────────
  // Dev Server (BrowserSync)
  // ─────────────────────────────────────────────────────────

  server: {
    port: Number(process.env.PORT) || 3000,
    hostname: process.env.SITE_URL || 'http://localhost:3000',
    open: true, // open browser on `pnpm dev`
  },

  // ─────────────────────────────────────────────────────────
  // Build Optimization
  // ─────────────────────────────────────────────────────────

  sourceMaps: isDev,

  optimization: {
    minify: {
      html: isProd,
      css: isProd,
      js: isProd,
      images: isProd,
    },
    criticalCSS: false, // include critical.scss in build
    sitemap: false, // generate sitemap.xml
    robots: false, // generate robots.txt
  },

  // ─────────────────────────────────────────────────────────
  // Images
  // ─────────────────────────────────────────────────────────

  images: {
    webp: {
      enabled: true,
      quality: 80,
    },
    jpeg: {
      quality: 80,
      progressive: true,
    },
    png: {
      compressionLevel: 9,
    },
  },

  // ─────────────────────────────────────────────────────────
  // SVG Sprites
  // ─────────────────────────────────────────────────────────

  sprites: {
    enabled: true,
    fileName: 'sprite.symbol.svg',
  },

  // ─────────────────────────────────────────────────────────
  // Build Report
  // ─────────────────────────────────────────────────────────

  sizeReport: {
    enabled: true,
    gzip: true,
  },

  // ─────────────────────────────────────────────────────────
  // PostCSS — additional plugins (applied after Autoprefixer)
  // Example: [require('postcss-custom-media')]
  // ─────────────────────────────────────────────────────────

  postcss: {
    plugins: [],
  },
};
