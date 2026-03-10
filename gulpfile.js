/**
 * Gulpfile
 */

import gulp from 'gulp';
import fs from 'fs';
import path from 'path';

// Environment (must be first — loads .env before config evaluation)
import './gulp/configs/env.js';

// Configuration
import { paths } from './gulp/configs/paths.js';
import { plugins } from './gulp/configs/plugins.js';
import { config } from './gulp/configs/config.js';

// Global app object
globalThis.app = { gulp, paths, plugins, config };

// Tasks
import { clean, clearHtmlCache } from './gulp/tasks/clean.js';
import { html } from './gulp/tasks/html.js';
import { styles } from './gulp/tasks/styles.js';
import { scripts } from './gulp/tasks/scripts.js';
import { images, imagesWebp } from './gulp/tasks/images.js';
import { assets } from './gulp/tasks/assets.js';
import { server } from './gulp/tasks/server.js';
import { minifyHTML, minifyCSS, minifyJS, minifyImages, minifySVG, cleanSourcemaps } from './gulp/tasks/minify.js';
import { sprite } from './gulp/tasks/sprite.js';
import { sitemap, robots } from './gulp/tasks/optimize.js';
import { logBuildStart, logBuildEnd } from './gulp/utils/index.js';
import { createUnlinkHandler } from './gulp/utils/watcher.js';

// ─────────────────────────────────────────────────────────────
// Watch
// ─────────────────────────────────────────────────────────────

const { globs } = paths;

const watch = () => {
  gulp.watch(globs.htmlPages, html).on('unlink', createUnlinkHandler(paths.srcHtmlPages, paths.build, {}, 'html'));
  gulp.watch(globs.htmlComponents, gulp.series(clearHtmlCache, html));
  gulp
    .watch(globs.stylesWatch, styles)
    .on('unlink', createUnlinkHandler(paths.srcStyles, paths.buildStyles, { '.scss': '.css' }));
  gulp.watch(globs.scripts, scripts).on('unlink', createUnlinkHandler(paths.srcScripts, paths.buildScripts));
  gulp.watch(globs.images, gulp.series(images, imagesWebp)).on('unlink', (filePath) => {
    createUnlinkHandler(paths.srcImages, paths.buildImages)(filePath);

    // Remove orphan .webp copy
    const relativePath = path.relative(paths.srcImages, filePath);
    const ext = path.extname(relativePath);
    if (['.jpg', '.jpeg', '.png'].includes(ext.toLowerCase())) {
      const webpPath = path.join(paths.buildImages, relativePath.replace(ext, '.webp'));
      try {
        fs.unlinkSync(webpPath);
      } catch {
        // ignore
      }
    }
  });
  gulp.watch(globs.sprites, sprite);
  gulp.watch(globs.assets, assets).on('unlink', createUnlinkHandler(paths.srcAssets, paths.buildAssets));
};

// ─────────────────────────────────────────────────────────────
// Task Groups
// ─────────────────────────────────────────────────────────────

const imagesTasks = gulp.series(images, imagesWebp);
const mainTasks = gulp.parallel(html, styles, scripts, imagesTasks, sprite, assets);
const minifyTasks = gulp.parallel(minifyHTML, minifyCSS, minifyJS, minifyImages, minifySVG);
const seoTasks = gulp.series(sitemap, robots);
const optimizeTasks = gulp.series(cleanSourcemaps, minifyTasks, seoTasks);

// ─────────────────────────────────────────────────────────────
// Commands
// ─────────────────────────────────────────────────────────────

gulp.task('dev', gulp.series(logBuildStart, clean, mainTasks, gulp.parallel(watch, server)));
gulp.task('build:dev', gulp.series(logBuildStart, clean, mainTasks, logBuildEnd));
gulp.task('build:prod', gulp.series(logBuildStart, clean, mainTasks, optimizeTasks, logBuildEnd));

// Graceful shutdown — close BrowserSync and free port
['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    plugins.browserSync.exit();
    process.exit(0);
  });
});
