/**
 * Tailwind Setup Configuration
 */

import 'dotenv/config';

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
// Paths (relative to project root)
// ─────────────────────────────────────────────────────────────

export const paths = {
  // Where to create tailwind config
  config: {
    dest: './',
    filename: 'tailwind.config.js', // or .ts, .mjs, .cjs
  },

  // Where to create tailwind styles
  styles: {
    dest: 'src/styles/',
    filename: 'tailwind.css',
  },

  // Gulp task file
  gulpTask: {
    dest: 'gulp/tasks/',
    filename: 'tailwind.js',
  },

  // HTML file to inject CDN script
  head: 'src/html/components/_head.html',

  // Demo page
  demo: {
    dest: 'src/html/',
    filename: 'tailwind.html',
  },
};

// ─────────────────────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────────────────────

export const options = {
  // Open demo page in browser after setup
  openBrowser: true,

  // Copy demo page to project
  copyDemoPage: true,

  // Create tailwind.css in styles folder
  createStyles: true,

  // Inject CDN script into _head.html
  injectCDN: true,
};

// ─────────────────────────────────────────────────────────────
// CDN
// ─────────────────────────────────────────────────────────────

export const cdn = {
  // Use specific version or 'latest'
  url: `https://cdn.tailwindcss.com/${version}`,

  // Script attributes
  attributes: '',
  // Example: 'defer' or 'data-turbo-track="reload"'
};

// ─────────────────────────────────────────────────────────────
// Computed URLs
// ─────────────────────────────────────────────────────────────

export const urls = {
  get demo() {
    return `http://${server.host}:${server.port}/${paths.demo.filename}`;
  },
  docs: 'https://v3.tailwindcss.com',
};
