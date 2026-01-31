/**
 * Template Paths
 * Утилиты для скриптов установки в .template/setup/
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { projectConfig } from '../project.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../');

const { folders } = projectConfig;

// ─────────────────────────────────────────────────────────────
// Path Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Путь относительно корня проекта
 */
export const resolvePath = (...parts) => path.join(rootDir, ...parts);

/**
 * Путь к исходникам
 */
export const srcPath = (...parts) => resolvePath(folders.src, ...parts);

/**
 * Путь к gulp задачам
 */
export const gulpPath = (...parts) => resolvePath('gulp', ...parts);

// ─────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────

export const templatePaths = {
  root: rootDir,
  template: __dirname,

  // Вычисляемые пути
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

export { projectConfig };
