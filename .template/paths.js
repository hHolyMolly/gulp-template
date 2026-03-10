/**
 * Template Paths
 * Utilities for setup scripts in .template/setup/
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../');

// Directory names (mirrors gulp/configs/paths.js)
const folders = {
  src: 'src',
  styles: 'styles',
  scripts: 'scripts',
  html: 'html',
  layouts: 'layouts',
  pages: 'pages',
  components: 'components',
};

// ─────────────────────────────────────────────────────────────
// Path Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Path relative to project root
 */
export const resolvePath = (...parts) => path.join(rootDir, ...parts);

/**
 * Path to source files
 */
export const srcPath = (...parts) => resolvePath(folders.src, ...parts);

/**
 * Path to gulp tasks
 */
export const gulpPath = (...parts) => resolvePath('gulp', ...parts);

// ─────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────

export const templatePaths = {
  root: rootDir,
  template: __dirname,

  // Computed paths
  src: srcPath(),
  srcStyles: srcPath(folders.styles),
  srcScripts: srcPath(folders.scripts),
  srcHtml: srcPath(folders.html),
  srcHtmlLayouts: srcPath(folders.html, folders.layouts),
  srcHtmlPages: srcPath(folders.html, folders.pages),
  srcHtmlComponents: srcPath(folders.html, folders.components),

  // Gulp
  gulpTasks: gulpPath('tasks'),
  gulpConfigs: gulpPath('configs'),
  gulpUtils: gulpPath('utils'),

  // Helpers
  resolvePath,
  srcPath,
  gulpPath,
};
