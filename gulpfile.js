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
import { clean } from './gulp/tasks/clean.js';
import { html, htmlAll } from './gulp/tasks/html.js';
import { styles } from './gulp/tasks/styles.js';
import { scripts } from './gulp/tasks/scripts.js';
import { images, imagesWebp, imagesAvif } from './gulp/tasks/images.js';
import { assets } from './gulp/tasks/assets.js';
import { vendors } from './gulp/tasks/vendors.js';
import { server } from './gulp/tasks/server.js';
import { sprite } from './gulp/tasks/sprite.js';
import { tailwind } from './gulp/tasks/tailwind.js';
import { tailwindKit } from './gulp/tasks/tailwindKit.js';
import { sitemap, robots } from './gulp/tasks/optimize.js';
import { logBuildStart, logBuildEnd } from './gulp/utils/index.js';
import { createUnlinkHandler } from './gulp/utils/watcher.js';

// ─────────────────────────────────────────────────────────────
// Watch
// ─────────────────────────────────────────────────────────────

const { globs } = paths;

const watch = () => {
  // When Tailwind is active, class changes in HTML/JS must retrigger the scan
  const withTailwind = (task) => (config.tailwind.active ? gulp.series(task, tailwind) : task);

  gulp.watch(globs.htmlPages, withTailwind(html)).on('unlink', createUnlinkHandler(paths.srcHtmlPages, paths.build));
  gulp.watch(globs.htmlComponents, withTailwind(htmlAll));
  gulp
    .watch(globs.stylesWatch, styles)
    .on('unlink', createUnlinkHandler(paths.srcStyles, paths.buildStyles, { '.scss': '.css' }));
  gulp
    .watch(globs.scripts, withTailwind(scripts))
    .on('unlink', createUnlinkHandler(paths.srcScripts, paths.buildScripts));
  gulp
    .watch(globs.images, gulp.series(images, imagesWebp, imagesAvif))
    .on('unlink', createUnlinkHandler(paths.srcImages, paths.buildImages, {}, ['.webp', '.avif']));
  gulp.watch(globs.sprites, sprite);
  gulp.watch(globs.assets, assets).on('unlink', createUnlinkHandler(paths.srcAssets, paths.buildAssets));

  if (config.tailwind.active) {
    gulp.watch(`${paths.srcStyles}/tailwind.css`, tailwind);
  }
};

// ─────────────────────────────────────────────────────────────
// Task Groups
// ─────────────────────────────────────────────────────────────

const imagesTasks = gulp.series(images, imagesWebp, imagesAvif);
const mainTasks = gulp.parallel(html, styles, tailwind, scripts, imagesTasks, sprite, assets, vendors);
const seoTasks = gulp.series(sitemap, robots);

// ─────────────────────────────────────────────────────────────
// Commands
// ─────────────────────────────────────────────────────────────

gulp.task('dev', gulp.series(logBuildStart, clean, mainTasks, gulp.parallel(watch, server)));
gulp.task('build:dev', gulp.series(logBuildStart, clean, mainTasks, logBuildEnd));
gulp.task(
  'build:prod',
  gulp.series(logBuildStart, clean, mainTasks, gulp.parallel(seoTasks, tailwindKit), logBuildEnd)
);
gulp.task('preview', server);

// Graceful shutdown — close BrowserSync and free port
['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    plugins.browserSync.exit();
    process.exit(0);
  });
});
