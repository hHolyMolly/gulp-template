/**
 * Tailwind Setup Configuration
 */

import 'dotenv/config';
import { projectConfig } from '../../paths.js';

const { folders } = projectConfig;

// ─────────────────────────────────────────────────────────────
// Export folders
// ─────────────────────────────────────────────────────────────

export { folders };

// ─────────────────────────────────────────────────────────────
// Version
// ─────────────────────────────────────────────────────────────

export const version = '3.4.17';

// ─────────────────────────────────────────────────────────────
// Server
// ─────────────────────────────────────────────────────────────

export const server = {
  port: process.env.PORT || 5555,
  host: process.env.HOST || 'localhost',
};

// ─────────────────────────────────────────────────────────────
// Files
// ─────────────────────────────────────────────────────────────

export const files = {
  tailwindConfig: 'tailwind.config.js',
  tailwindCSS: 'tailwind.css',
  tailwindDemo: 'tailwind-demo.html',
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

  // HTML file to inject CDN script
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
  injectCDN: true,
};

// ─────────────────────────────────────────────────────────────
// CDN
// ─────────────────────────────────────────────────────────────

export const cdn = {
  url: `https://cdn.tailwindcss.com/${version}`,
  attributes: '',
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
