/**
 * Project Configuration
 * Single source of truth for all paths and folder names
 */

// ─────────────────────────────────────────────────────────────
// Folder names (change here to rename folders across the project)
// ─────────────────────────────────────────────────────────────

export const folders = {
  // Build & Source
  build: 'dist',
  src: 'src',

  // Source folders
  styles: 'styles',
  scripts: 'scripts',
  html: 'html',
  assets: 'assets',
  images: 'img',
  icons: 'icons',

  // HTML subfolders
  layouts: 'layouts',
  components: 'components',
  ui: 'ui',

  // Gulp folders
  gulp: 'gulp',
  tasks: 'tasks',
  configs: 'configs',

  // Template folders
  template: '.template',
  setup: 'setup',
};

// ─────────────────────────────────────────────────────────────
// File extensions
// ─────────────────────────────────────────────────────────────

export const extensions = {
  styles: '{css,scss}',
  scripts: 'js',
  html: 'html',
  images: '{jpg,jpeg,png,svg,gif,ico,webp}',
  icons: 'svg',
};

// ─────────────────────────────────────────────────────────────
// File names
// ─────────────────────────────────────────────────────────────

export const files = {
  // Tailwind (used by setup script)
  tailwindConfig: 'tailwind.config.js',
  tailwindCSS: 'tailwind.css',
  tailwindDemo: 'tailwind.html',
  tailwindTask: 'tailwind.js',
  // HTML
  head: '_head.html',
  indexHTML: 'index.html',
};

// ─────────────────────────────────────────────────────────────
// Computed paths (auto-generated from folders)
// ─────────────────────────────────────────────────────────────

export const paths = {
  // Base
  build: folders.build,
  src: folders.src,

  // Source paths
  srcStyles: `${folders.src}/${folders.styles}`,
  srcScripts: `${folders.src}/${folders.scripts}`,
  srcHtml: `${folders.src}/${folders.html}`,
  srcAssets: `${folders.src}/${folders.assets}`,
  srcImages: `${folders.src}/${folders.assets}/${folders.images}`,
  srcIcons: `${folders.src}/${folders.assets}/${folders.icons}`,
  srcHtmlLayouts: `${folders.src}/${folders.html}/${folders.layouts}`,
  srcHtmlPages: `${folders.src}/${folders.html}/${folders.pages}`,
  srcHtmlComponents: `${folders.src}/${folders.html}/${folders.components}`,
  srcHtmlUI: `${folders.src}/${folders.html}/${folders.ui}`,

  // Build paths
  buildStyles: `${folders.build}/${folders.styles}`,
  buildScripts: `${folders.build}/${folders.scripts}`,
  buildAssets: `${folders.build}/${folders.assets}`,
  buildImages: `${folders.build}/${folders.assets}/${folders.images}`,

  // Gulp paths
  gulpDir: folders.gulp,
  gulpTasks: `${folders.gulp}/${folders.tasks}`,
  gulpConfigs: `${folders.gulp}/${folders.configs}`,

  // Template paths
  templateDir: folders.template,
  templateSetup: `${folders.template}/${folders.setup}`,
};

// ─────────────────────────────────────────────────────────────
// Glob patterns (ready-to-use patterns for watch & build)
// ─────────────────────────────────────────────────────────────

export const globs = {
  // HTML
  html: `${paths.srcHtml}/**/*.${extensions.html}`,
  htmlComponents: `${paths.srcHtml}/**/_*.${extensions.html}`,
  htmlUI: `${paths.srcHtmlUI}/**`,

  // Styles
  styles: `${paths.srcStyles}/**/*.${extensions.styles}`,

  // Scripts
  scripts: `${paths.srcScripts}/**/*.${extensions.scripts}`,

  // Images
  images: `${paths.srcImages}/**/*.${extensions.images}`,

  // Icons
  icons: `${paths.srcIcons}/**/*.${extensions.icons}`,

  // Assets (excluding images and icons)
  assets: [
    `${paths.srcAssets}/**/*`,
    `!${paths.srcImages}/**/*.${extensions.images}`,
    `!${paths.srcIcons}/**/*.${extensions.icons}`,
  ],
};

// ─────────────────────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────────────────────

/**
 * Get source path
 * @param {...string} parts - Path parts to join
 * @returns {string} Full source path
 * @example getSrc('styles', 'main.scss') → 'src/styles/main.scss'
 */
export const getSrc = (...parts) => [folders.src, ...parts].filter(Boolean).join('/');

/**
 * Get build path
 * @param {...string} parts - Path parts to join
 * @returns {string} Full build path
 * @example getBuild('styles', 'main.css') → 'dist/styles/main.css'
 */
export const getBuild = (...parts) => [folders.build, ...parts].filter(Boolean).join('/');

/**
 * Get glob pattern for file type
 * @param {string} type - Type: 'html', 'styles', 'scripts', 'images', 'icons', 'assets'
 * @returns {string|string[]} Glob pattern
 */
export const getGlob = (type) => globs[type] || `**/*.${type}`;

/**
 * Exclude pattern helper
 * @param {string} pattern - Pattern to exclude
 * @returns {string} Excluded pattern
 */
export const exclude = (pattern) => `!${pattern}`;
