import htmlmin from 'gulp-htmlmin';
import csso from 'gulp-csso';
import terser from 'gulp-terser';
import imagemin from 'gulp-imagemin';
import gulpIf from 'gulp-if';
import size from 'gulp-size';
import { config } from '../configs/config.js';

export const minifyHTML = () => {
  return app.gulp
    .src(`${app.paths.build}/**/*.html`)
    .pipe(
      gulpIf(
        config.minify.html,
        htmlmin({
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true,
        })
      )
    )
    .pipe(
      gulpIf(
        config.sizeReport.enabled,
        size({
          title: 'HTML (minified)',
          showFiles: false,
          showTotal: config.sizeReport.showTotal,
          gzip: config.sizeReport.gzip,
        })
      )
    )
    .pipe(app.gulp.dest(`${app.paths.build}`));
};

export const minifyCSS = () => {
  return app.gulp
    .src(`${app.paths.buildStyles}/**/*.css`)
    .pipe(gulpIf(config.minify.css, csso()))
    .pipe(
      gulpIf(
        config.sizeReport.enabled,
        size({
          title: 'CSS (minified)',
          showFiles: false,
          showTotal: config.sizeReport.showTotal,
          gzip: config.sizeReport.gzip,
        })
      )
    )
    .pipe(app.gulp.dest(app.paths.buildStyles));
};

export const minifyJS = () => {
  return app.gulp
    .src(`${app.paths.buildScripts}/**/*.js`)
    .pipe(
      gulpIf(
        config.minify.js,
        terser({
          format: {
            comments: false,
          },
          compress: {
            drop_console: config.isProd,
            drop_debugger: config.isProd,
          },
        })
      )
    )
    .pipe(
      gulpIf(
        config.sizeReport.enabled,
        size({
          title: 'JS (minified)',
          showFiles: false,
          showTotal: config.sizeReport.showTotal,
          gzip: config.sizeReport.gzip,
        })
      )
    )
    .pipe(app.gulp.dest(app.paths.buildScripts));
};

export const minifyImages = () => {
  return app.gulp
    .src(`${app.paths.buildImages}/**/*.${app.paths.extensions.images}`)
    .pipe(
      gulpIf(
        config.minify.images,
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 80, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: false }],
          }),
        ])
      )
    )
    .pipe(
      gulpIf(
        config.sizeReport.enabled,
        size({
          title: 'Images (optimized)',
          showFiles: false,
          showTotal: config.sizeReport.showTotal,
        })
      )
    )
    .pipe(app.gulp.dest(app.paths.buildImages));
};
