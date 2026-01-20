/**
 * Tailwind Setup Configuration
 */

import 'dotenv/config';
import { folders, files, paths as projectPaths } from '../../../project.config.js';

// Re-export for convenience
export { folders, files };

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
    filename: files.tailwindConfig,
  },

  // Where to create tailwind styles
  styles: {
    dest: `${projectPaths.srcStyles}/`,
    filename: files.tailwindCSS,
  },

  // Gulp task file
  gulpTask: {
    dest: `${projectPaths.gulpTasks}/`,
    filename: files.tailwindTask,
  },

  // HTML file to inject CDN script
  head: `${projectPaths.srcHtmlLayouts}/${files.head}`,

  // Demo page
  demo: {
    dest: `${projectPaths.srcHtml}/`,
    filename: files.tailwindDemo,
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
