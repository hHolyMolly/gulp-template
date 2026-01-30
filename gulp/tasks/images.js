import gulpIf from 'gulp-if';
import webp from 'gulp-webp';
import size from 'gulp-size';
import { config } from '../configs/config.js';

// Get source pattern excluding already converted formats
const getImageSrc = () => {
  return [`${app.paths.srcImages}/**/*.{jpg,jpeg,png}`, `!${app.paths.srcImages}/**/*.webp`];
};

// Copy original images
export const images = () => {
  return app.gulp
    .src(app.paths.globs.images)
    .pipe(app.plugins.errorHandler('Images'))
    .pipe(app.plugins.cached('images'))
    .pipe(app.plugins.remember('images'))
    .pipe(
      gulpIf(
        config.sizeReport.enabled,
        size({
          title: 'Images',
          showFiles: config.sizeReport.showFiles,
          showTotal: config.sizeReport.showTotal,
        })
      )
    )
    .pipe(app.gulp.dest(app.paths.buildImages))
    .pipe(app.plugins.browserSync.stream());
};

// Generate WebP images
export const imagesWebp = () => {
  if (!config.images.webp.enabled) {
    return Promise.resolve();
  }

  return app.gulp
    .src(getImageSrc())
    .pipe(app.plugins.errorHandler('WebP'))
    .pipe(app.plugins.newer({ dest: app.paths.buildImages, ext: '.webp' }))
    .pipe(webp({ quality: config.images.webp.quality }))
    .pipe(
      gulpIf(
        config.sizeReport.enabled,
        size({
          title: 'WebP',
          showFiles: false,
          showTotal: config.sizeReport.showTotal,
        })
      )
    )
    .pipe(app.gulp.dest(app.paths.buildImages));
};
