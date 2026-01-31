import webp from 'gulp-webp';
import { sizeReporter } from '../utils/index.js';

export const images = () => {
  const { gulp, paths, plugins } = app;

  return gulp
    .src(paths.globs.images)
    .pipe(plugins.errorHandler('Images'))
    .pipe(plugins.cached('images'))
    .pipe(plugins.remember('images'))
    .pipe(sizeReporter('Images', { showFiles: true }))
    .pipe(gulp.dest(paths.buildImages))
    .pipe(plugins.browserSync.stream());
};

export const imagesWebp = () => {
  const { gulp, paths, plugins, config } = app;

  if (!config.images.webp.enabled) {
    return Promise.resolve();
  }

  // Только jpg/jpeg/png, исключаем уже webp
  const src = [`${paths.srcImages}/**/*.{jpg,jpeg,png}`, `!${paths.srcImages}/**/*.webp`];

  return gulp
    .src(src)
    .pipe(plugins.errorHandler('WebP'))
    .pipe(plugins.newer({ dest: paths.buildImages, ext: '.webp' }))
    .pipe(webp({ quality: config.images.webp.quality }))
    .pipe(sizeReporter('WebP', { showFiles: false }))
    .pipe(gulp.dest(paths.buildImages));
};
