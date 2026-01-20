import gulp from 'gulp';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

dotenv.config({ path: envFile });

import { paths } from './gulp/configs/paths.js';
import { plugins } from './gulp/configs/plugins.js';
import { config } from './gulp/configs/config.js';

global.app = { paths, plugins, gulp, config };

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

const watchTask = () => {
  gulp.watch(`${paths.src}/html/**/*.html`, html);
  gulp.watch(`${paths.src}/styles/**/*.{css,scss}`, styles);
  gulp.watch(`${paths.src}/scripts/**/*.js`, scripts);
  gulp.watch(`${paths.src}/assets/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`, images);
  gulp.watch(`${paths.src}/assets/icons/**/*.svg`, sprite);
  gulp.watch([`${app.paths.src}/assets/**/*`, `!${app.paths.src}/assets/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`, `!${app.paths.src}/assets/icons/**/*.svg`], assets);
  gulp.watch([`${paths.root}/tailwind.config.js`, `${paths.src}/styles/tailwind.css`], gulp.series(tailwind, tailwindReload));
};

const mainTasks = gulp.parallel(html, styles, scripts, images, sprite, assets, tailwind);

const gulp_start = gulp.series(clean, mainTasks, gulp.parallel(watchTask, server));
gulp.task('start', gulp_start);

const gulp_build_dev = gulp.series(clean, mainTasks);
gulp.task('build:dev', gulp_build_dev);

const gulp_build_prod = gulp.series(clean, mainTasks, gulp.parallel(minifyHTML, minifyCSS, minifyJS, minifyImages));
gulp.task('build:prod', gulp_build_prod);
