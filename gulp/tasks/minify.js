import htmlmin from 'gulp-htmlmin';
import csso from 'gulp-csso';
import terser from 'gulp-terser';
import imagemin from 'gulp-imagemin';
import gulpIf from 'gulp-if';
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
        })
      )
    )
    .pipe(app.gulp.dest(`${app.paths.build}`));
};

export const minifyCSS = () => {
  return app.gulp
    .src(`${app.paths.build}/styles/**/*.css`)
    .pipe(gulpIf(config.minify.css, csso()))
    .pipe(app.gulp.dest(`${app.paths.build}/styles`));
};

export const minifyJS = () => {
  return app.gulp
    .src(`${app.paths.build}/scripts/**/*.js`)
    .pipe(gulpIf(config.minify.js, terser()))
    .pipe(app.gulp.dest(`${app.paths.build}/scripts`));
};

export const minifyImages = () => {
  return app.gulp
    .src(`${app.paths.build}/assets/img/**/*.{jpg,jpeg,png,gif,svg}`)
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
    .pipe(app.gulp.dest(`${app.paths.build}/assets/img`));
};
