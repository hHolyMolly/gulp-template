import gulp from 'gulp';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

import { paths } from './gulp/configs/paths.js';
import { plugins } from './gulp/configs/plugins.js';
import { config } from './gulp/configs/config.js';

globalThis.app = { paths, plugins, gulp, config };

import { clean } from './gulp/tasks/clean.js';
import { html } from './gulp/tasks/html.js';
import { styles } from './gulp/tasks/styles.js';
import { scripts } from './gulp/tasks/scripts.js';
import { images } from './gulp/tasks/images.js';
import { assets } from './gulp/tasks/assets.js';
import { server } from './gulp/tasks/server.js';
import { minifyHTML, minifyCSS, minifyJS, minifyImages } from './gulp/tasks/minify.js';
import { sprite } from './gulp/tasks/sprite.js';
import { tailwind, tailwindReload } from './gulp/tasks/tailwind.js';
import { logBuildStart, logBuildEnd } from './gulp/utils/logger.js';

// ─────────────────────────────────────────────────────────────
// Tasks
// ─────────────────────────────────────────────────────────────

const { globs: g } = paths;

// Clear cache when layout/component files change
const clearHtmlCache = (done) => {
  delete plugins.cached.caches['html'];
  done();
};

const watchTask = () => {
  gulp.watch(g.html, html);
  gulp.watch([g.htmlComponents, g.htmlUI], gulp.series(clearHtmlCache, html));
  gulp.watch(g.styles, styles);
  gulp.watch(g.scripts, scripts);
  gulp.watch(g.images, images);
  gulp.watch(g.icons, sprite);
  gulp.watch(g.assets, assets);
  gulp.watch(g.tailwind, gulp.series(tailwind, tailwindReload));
};

const mainTasks = gulp.parallel(html, styles, scripts, images, sprite, assets, tailwind);
const minifyTasks = gulp.parallel(minifyHTML, minifyCSS, minifyJS, minifyImages);

// ─────────────────────────────────────────────────────────────
// Gulp Commands
// ─────────────────────────────────────────────────────────────

gulp.task('start', gulp.series(logBuildStart, clean, mainTasks, gulp.parallel(watchTask, server)));
gulp.task('build:dev', gulp.series(logBuildStart, clean, mainTasks, logBuildEnd));
gulp.task('build:prod', gulp.series(logBuildStart, clean, mainTasks, minifyTasks, logBuildEnd));
