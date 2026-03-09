import { minify as htmlMinify } from 'html-minifier-terser';
import csso from 'gulp-csso';
import terser from 'gulp-terser';
import gulpIf from 'gulp-if';
import { Transform } from 'stream';
import sharp from 'sharp';
import { optimize as svgoOptimize } from 'svgo';
import path from 'path';
import fs from 'fs/promises';
import { sizeReporter, logWarning } from '../utils/index.js';

const sharpOptimize = () => {
  return new Transform({
    objectMode: true,
    async transform(file, enc, callback) {
      if (file.isNull()) {
        return callback(null, file);
      }

      const ext = path.extname(file.path).toLowerCase();
      const originalSize = file.contents.length;
      const { config } = app;

      try {
        let optimized;

        switch (ext) {
          case '.jpg':
          case '.jpeg':
            optimized = await sharp(file.contents)
              .jpeg({
                quality: config.images.jpeg?.quality ?? 80,
                progressive: config.images.jpeg?.progressive ?? true,
              })
              .toBuffer();
            break;
          case '.png':
            optimized = await sharp(file.contents)
              .png({
                compressionLevel: config.images.png?.compressionLevel ?? 9,
              })
              .toBuffer();
            break;
          case '.webp':
            optimized = await sharp(file.contents)
              .webp({ quality: config.images.webp?.quality ?? 80 })
              .toBuffer();
            break;
          case '.gif':
            optimized = await sharp(file.contents, { animated: true }).gif({ effort: 7 }).toBuffer();
            break;
          default:
            optimized = file.contents;
        }

        // Only replace if optimization actually reduced size (prevents double-compression degradation)
        if (optimized.length < originalSize) {
          file.contents = optimized;
        }

        callback(null, file);
      } catch (error) {
        logWarning(`Image optimization failed for ${path.basename(file.path)}: ${error.message}`);
        callback(null, file);
      }
    },
  });
};

export const minifyHTML = () => {
  const { gulp, paths, plugins, config } = app;

  const htmlMinifier = () => {
    return new Transform({
      objectMode: true,
      async transform(file, enc, callback) {
        if (file.isNull()) return callback(null, file);

        try {
          const html = file.contents.toString();
          const minified = await htmlMinify(html, {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
            minifyCSS: true,
            minifyJS: true,
            sortAttributes: true,
            sortClassName: false,
          });
          file.contents = Buffer.from(minified);
          callback(null, file);
        } catch (error) {
          logWarning(`HTML minification failed for ${path.basename(file.path)}: ${error.message}`);
          callback(null, file);
        }
      },
    });
  };

  return gulp
    .src(`${paths.build}/**/*.html`)
    .pipe(plugins.errorHandler('Minify HTML'))
    .pipe(gulpIf(config.optimization.minify.html, htmlMinifier()))
    .pipe(sizeReporter('HTML (min)', { showFiles: false }))
    .pipe(gulp.dest(paths.build));
};

export const minifyCSS = () => {
  const { gulp, paths, plugins, config } = app;

  return gulp
    .src(`${paths.buildStyles}/**/*.css`)
    .pipe(plugins.errorHandler('Minify CSS'))
    .pipe(gulpIf(config.optimization.minify.css, csso()))
    .pipe(sizeReporter('CSS (min)', { showFiles: false }))
    .pipe(gulp.dest(paths.buildStyles));
};

export const minifyJS = () => {
  const { gulp, paths, plugins, config } = app;

  return gulp
    .src(`${paths.buildScripts}/**/*.js`)
    .pipe(plugins.errorHandler('Minify JS'))
    .pipe(
      gulpIf(
        config.optimization.minify.js,
        terser({
          module: true,
          format: { comments: false },
          compress: {
            drop_debugger: config.env.isProd,
            pure_funcs: config.env.isProd ? ['console.log', 'console.info', 'console.warn', 'console.debug'] : [],
          },
        })
      )
    )
    .pipe(sizeReporter('JS (min)', { showFiles: false }))
    .pipe(gulp.dest(paths.buildScripts));
};

export const minifyImages = () => {
  const { gulp, paths, plugins, config } = app;

  return gulp
    .src([`${paths.buildImages}/**/*.{jpg,jpeg,png,webp,gif}`, `!${paths.buildImages}/**/*.svg`])
    .pipe(plugins.errorHandler('Minify Images'))
    .pipe(gulpIf(config.optimization.minify.images, sharpOptimize()))
    .pipe(sizeReporter('Images (opt)', { showFiles: false }))
    .pipe(gulp.dest(paths.buildImages));
};

export const cleanSourcemaps = async () => {
  const { paths } = app;
  const buildDir = paths.build;

  const allFiles = await fs.readdir(buildDir, { recursive: true });
  const mapFiles = allFiles.filter((f) => f.endsWith('.map'));

  await Promise.all(mapFiles.map((f) => fs.unlink(path.join(buildDir, f)).catch(() => {})));
};

const svgOptimizeTransform = () => {
  return new Transform({
    objectMode: true,
    transform(file, enc, callback) {
      if (file.isNull() || file.isStream()) return callback(null, file);

      try {
        const result = svgoOptimize(file.contents.toString(), {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              params: { overrides: { removeViewBox: false } },
            },
          ],
        });

        file.contents = Buffer.from(result.data);
        callback(null, file);
      } catch (error) {
        logWarning(`SVG optimization failed for ${path.basename(file.path)}: ${error.message}`);
        callback(null, file);
      }
    },
  });
};

export const minifySVG = () => {
  const { gulp, paths, plugins, config } = app;

  return gulp
    .src(`${paths.buildImages}/**/*.svg`)
    .pipe(plugins.errorHandler('Minify SVG'))
    .pipe(gulpIf(config.optimization.minify.images, svgOptimizeTransform()))
    .pipe(sizeReporter('SVG (opt)', { showFiles: false }))
    .pipe(gulp.dest(paths.buildImages));
};
