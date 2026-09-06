/**
 * Project Configuration
 *
 * This file contains user-facing settings only.
 * Directory structure and internal paths are managed by gulp/configs/paths.js
 * PORT / SITE_URL come from .env files (see gulp/configs/env.js)
 */

import { env } from './gulp/configs/env.js';

const { isDev, isProd } = env;

export const projectConfig = {
  // ─────────────────────────────────────────────────────────
  // Environment
  // ─────────────────────────────────────────────────────────

  env: { isDev, isProd },

  // ─────────────────────────────────────────────────────────
  // Dev Server (BrowserSync)
  // ─────────────────────────────────────────────────────────

  server: {
    port: env.port, // PORT from .env
    hostname: env.siteUrl, // SITE_URL from .env, falls back to http://localhost:<port>
    open: true, // open browser on `pnpm dev`
  },

  // ─────────────────────────────────────────────────────────
  // Build Optimization
  // ─────────────────────────────────────────────────────────

  sourceMaps: isDev,

  optimization: {
    minify: {
      // Tip: hand-editable dist (e.g. WordPress handoff) → set these to false
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
  // Tailwind CSS (optional — install with `pnpm tailwind:setup`)
  // 'auto' = active when src/styles/tailwind.css exists
  // true / false = force on / off
  // ─────────────────────────────────────────────────────────

  tailwind: {
    enabled: 'auto',
  },

  // ─────────────────────────────────────────────────────────
  // Vendor Libraries
  // Prebuilt files copied from node_modules into dist —
  // .css → dist/styles/vendor/, everything else → dist/scripts/vendor/
  // Install the package first, then list the file. Restart dev after edits.
  // ─────────────────────────────────────────────────────────

  vendors: [
    // 'swiper/swiper-bundle.min.js',
    // { from: 'swiper/swiper-bundle.min.css', to: 'swiper.min.css' },
  ],

  // ─────────────────────────────────────────────────────────
  // Images
  // ─────────────────────────────────────────────────────────

  images: {
    webp: {
      enabled: true,
      quality: 80,
    },
    avif: {
      enabled: false, // opt-in: smaller than webp, slower to encode
      quality: 60,
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
