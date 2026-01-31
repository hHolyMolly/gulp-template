import htmlmin from 'gulp-htmlmin';
import csso from 'gulp-csso';
import terser from 'gulp-terser';
import gulpIf from 'gulp-if';
import through2 from 'through2';
import sharp from 'sharp';
import path from 'path';
import { sizeReporter } from '../utils/index.js';

const sharpOptimize = () => {
  return through2.obj(async function (file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    const ext = path.extname(file.path).toLowerCase();

    try {
      let optimized;

      switch (ext) {
        case '.jpg':
        case '.jpeg':
          optimized = await sharp(file.contents).jpeg({ quality: 80, progressive: true }).toBuffer();
          break;
        case '.png':
          optimized = await sharp(file.contents).png({ compressionLevel: 9, palette: true }).toBuffer();
          break;
        case '.webp':
          optimized = await sharp(file.contents).webp({ quality: 80 }).toBuffer();
          break;
        default:
          optimized = file.contents;
      }

      file.contents = optimized;
      callback(null, file);
    } catch {
      callback(null, file);
    }
  });
};

export const minifyHTML = () => {
  const { gulp, paths, config } = app;

  return gulp
    .src(`${paths.build}/**/*.html`)
    .pipe(
      gulpIf(
        config.optimization.minify.html,
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
    .pipe(sizeReporter('HTML (min)', { showFiles: false }))
    .pipe(gulp.dest(paths.build));
};

export const minifyCSS = () => {
  const { gulp, paths, config } = app;

  return gulp
    .src(`${paths.buildStyles}/**/*.css`)
    .pipe(gulpIf(config.optimization.minify.css, csso()))
    .pipe(sizeReporter('CSS (min)', { showFiles: false }))
    .pipe(gulp.dest(paths.buildStyles));
};

export const minifyJS = () => {
  const { gulp, paths, config } = app;

  return gulp
    .src(`${paths.buildScripts}/**/*.js`)
    .pipe(
      gulpIf(
        config.optimization.minify.js,
        terser({
          format: { comments: false },
          compress: {
            drop_console: config.env.isProd,
            drop_debugger: config.env.isProd,
          },
        })
      )
    )
    .pipe(sizeReporter('JS (min)', { showFiles: false }))
    .pipe(gulp.dest(paths.buildScripts));
};

export const minifyImages = () => {
  const { gulp, paths, config } = app;

  return gulp
    .src([`${paths.buildImages}/**/*.{jpg,jpeg,png,webp}`, `!${paths.buildImages}/**/*.svg`])
    .pipe(gulpIf(config.optimization.minify.images, sharpOptimize()))
    .pipe(sizeReporter('Images (opt)', { showFiles: false }))
    .pipe(gulp.dest(paths.buildImages));
};
