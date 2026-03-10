/**
 * Tailwind Setup Configuration
 *
 * Note: dotenv is loaded via setup-env.js (imported first in setup.js).
 * Do NOT import dotenv here — ESM static imports evaluate before side effects.
 */

// Directory names (mirrors gulp/configs/paths.js)
const folders = {
  src: 'src',
  styles: 'styles',
  scripts: 'scripts',
  html: 'html',
  layouts: 'layouts',
};

export { folders };

// ─────────────────────────────────────────────────────────────
// Package
// ─────────────────────────────────────────────────────────────

export const packageName = 'tailwindcss';
export const version = '3.4.17';

// ─────────────────────────────────────────────────────────────
// Server
// ─────────────────────────────────────────────────────────────

export const server = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
};

// ─────────────────────────────────────────────────────────────
// Files
// ─────────────────────────────────────────────────────────────

export const files = {
  tailwindConfig: 'tailwind.config.js',
  tailwindCSS: 'tailwind.css',
  tailwindDemo: 'tailwind.html',
  head: '_head.html',
};

// ─────────────────────────────────────────────────────────────
// Paths
// ─────────────────────────────────────────────────────────────

export const paths = {
  // Where to create tailwind config
  config: {
    dest: './',
    filename: files.tailwindConfig,
  },

  // Where to create tailwind styles
  styles: {
    dest: `${folders.src}/${folders.styles}/`,
    filename: files.tailwindCSS,
  },

  // Gulp task file
  gulpTask: {
    dest: 'gulp/tasks/',
    filename: 'tailwind.js',
  },

  // HTML file to inject stylesheet link
  head: `${folders.src}/${folders.html}/${folders.layouts}/${files.head}`,

  // Demo page
  demo: {
    dest: `${folders.src}/${folders.html}/`,
    filename: files.tailwindDemo,
  },
};

// ─────────────────────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────────────────────

export const options = {
  openBrowser: true,
  copyDemoPage: true,
  createStyles: true,
  injectStylesheet: true,
};

// ─────────────────────────────────────────────────────────────
// URLs
// ─────────────────────────────────────────────────────────────

export const urls = {
  get demo() {
    return `http://${server.host}:${server.port}/${paths.demo.filename}`;
  },
  docs: 'https://v3.tailwindcss.com',
};
