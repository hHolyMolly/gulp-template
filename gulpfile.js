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

// Watch

const { globs } = paths;

/**
 * Remove corresponding file from dist when source is deleted
 * Also clears gulp-remember cache to prevent ghost files
 */
const handleUnlink = (srcBase, buildBase, extMap = {}, cacheId = null) => {
  return (filePath) => {
    try {
      let relativePath = path.relative(srcBase, filePath);
      const ext = path.extname(relativePath);

      if (extMap[ext]) {
        relativePath = relativePath.replace(ext, extMap[ext]);
      }

      const buildPath = path.join(buildBase, relativePath);

      // Remove build file and sourcemap (try-catch for TOCTOU race)
      try {
        fs.unlinkSync(buildPath);
      } catch {
        // File may already be removed
      }
      try {
        fs.unlinkSync(`${buildPath}.map`);
      } catch {
        // Sourcemap may not exist
      }

      // Clear gulp-remember cache
      if (cacheId) {
        try {
          app.plugins.remember.forget(cacheId, path.resolve(filePath));
        } catch {
          // Cache key may not exist
        }
      }
    } catch {
      // Ignore unlink errors (file may already be removed)
    }
  };
};

const watch = () => {
  gulp.watch(globs.htmlPages, html).on('unlink', handleUnlink(paths.srcHtmlPages, paths.build, {}, 'html'));
  gulp.watch(globs.htmlComponents, gulp.series(clearHtmlCache, html));
  gulp
    .watch(globs.stylesWatch, styles)
    .on('unlink', handleUnlink(paths.srcStyles, paths.buildStyles, { '.scss': '.css' }));
  gulp.watch(globs.scripts, scripts).on('unlink', handleUnlink(paths.srcScripts, paths.buildScripts));
  gulp.watch(globs.images, gulp.series(images, imagesWebp)).on('unlink', (filePath) => {
    // Remove the image itself
    handleUnlink(paths.srcImages, paths.buildImages)(filePath);

    // Remove orphan .webp copy
    const relativePath = path.relative(paths.srcImages, filePath);
    const ext = path.extname(relativePath);
    if (['.jpg', '.jpeg', '.png'].includes(ext.toLowerCase())) {
      const webpPath = path.join(paths.buildImages, relativePath.replace(ext, '.webp'));
      if (fs.existsSync(webpPath)) {
        fs.unlinkSync(webpPath);
      }
    }
  });
  gulp.watch(globs.sprites, sprite);
  gulp.watch(globs.assets, assets).on('unlink', handleUnlink(paths.srcAssets, paths.buildAssets));
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
