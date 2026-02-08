/**
 * Gulpfile
 */

import gulp from 'gulp';

// Environment (must be first — loads .env before config evaluation)
import './gulp/configs/env.js';

// Configuration
import { paths } from './gulp/configs/paths.js';
import { plugins } from './gulp/configs/plugins.js';
import { config } from './gulp/configs/config.js';

// Global app object
globalThis.app = { gulp, paths, plugins, config };

// Tasks
import { clean, clearHtmlCache, clearStylesCache } from './gulp/tasks/clean.js';
import { html } from './gulp/tasks/html.js';
import { styles } from './gulp/tasks/styles.js';
import { scripts } from './gulp/tasks/scripts.js';
import { images, imagesWebp } from './gulp/tasks/images.js';
import { assets } from './gulp/tasks/assets.js';
import { server } from './gulp/tasks/server.js';
import { minifyHTML, minifyCSS, minifyJS, minifyImages } from './gulp/tasks/minify.js';
import { sprite } from './gulp/tasks/sprite.js';
import { sitemap, robots } from './gulp/tasks/optimize.js';
import { logBuildStart, logBuildEnd } from './gulp/utils/index.js';

// Watch

const { globs } = paths;

const watch = () => {
  gulp.watch(globs.html, html);
  gulp.watch(globs.htmlComponents, gulp.series(clearHtmlCache, html));
  gulp.watch(globs.stylesWatch, gulp.series(clearStylesCache, styles));
  gulp.watch(globs.scripts, scripts);
  gulp.watch(globs.images, images);
  gulp.watch(globs.sprites, sprite);
  gulp.watch(globs.assets, assets);
};

// ─────────────────────────────────────────────────────────────
// Task Groups
// ─────────────────────────────────────────────────────────────

const imagesTasks = gulp.series(images, imagesWebp);
const mainTasks = gulp.parallel(html, styles, scripts, imagesTasks, sprite, assets);
const minifyTasks = gulp.parallel(minifyHTML, minifyCSS, minifyJS, minifyImages);
const seoTasks = gulp.series(sitemap, robots);
const optimizeTasks = gulp.series(minifyTasks, seoTasks);

// ─────────────────────────────────────────────────────────────
// Commands
// ─────────────────────────────────────────────────────────────

gulp.task('start', gulp.series(logBuildStart, clean, mainTasks, gulp.parallel(watch, server)));
gulp.task('build:dev', gulp.series(logBuildStart, clean, mainTasks, logBuildEnd));
gulp.task('build:prod', gulp.series(logBuildStart, clean, mainTasks, optimizeTasks, logBuildEnd));
