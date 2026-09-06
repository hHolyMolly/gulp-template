/**
 * Content Transforms
 * Small object-mode Transform streams replacing single-purpose gulp plugins
 * (gulp-prettier, gulp-terser, gulp-csso, gulp-webp).
 * All of them catch their own errors so `gulp watch` survives.
 */

import { Transform } from 'node:stream';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';
import { minify as htmlMinifyRaw } from 'html-minifier-terser';
import { minify as terserMinify } from 'terser';
import { transform as lightningcss } from 'lightningcss';
import { optimize as svgoOptimizeRaw } from 'svgo';
import sharp from 'sharp';
import { logWarning } from './logger.js';

const contentTransform = (name, handler) =>
  new Transform({
    objectMode: true,
    async transform(file, enc, callback) {
      if (file.isNull()) return callback(null, file);

      try {
        await handler(file);
        callback(null, file);
      } catch (error) {
        logWarning(`${name} failed for ${path.basename(file.path)}: ${error.message}`);
        callback(null, file);
      }
    },
  });

// ─────────────────────────────────────────────────────────────
// HTML
// ─────────────────────────────────────────────────────────────

let prettierOptions;

export const htmlPrettify = () =>
  contentTransform('HTML formatting', async (file) => {
    prettierOptions ??= (await resolveConfig(file.path)) || {};
    const formatted = await format(file.contents.toString(), {
      ...prettierOptions,
      parser: 'html',
      htmlWhitespaceSensitivity: 'ignore',
    });
    file.contents = Buffer.from(formatted);
  });

export const htmlMinify = () =>
  contentTransform('HTML minification', async (file) => {
    const minified = await htmlMinifyRaw(file.contents.toString(), {
      collapseWhitespace: true,
      conservativeCollapse: true,
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
  });

/**
 * Replace every occurrence of `search` (plain string, no regex) in file contents.
 */
export const replaceContents = (search, replacement) =>
  contentTransform('Content replace', (file) => {
    file.contents = Buffer.from(file.contents.toString().split(search).join(replacement));
  });

// ─────────────────────────────────────────────────────────────
// JS / CSS
// ─────────────────────────────────────────────────────────────

export const jsMinify = () =>
  contentTransform('JS minification', async (file) => {
    const result = await terserMinify(
      { [file.relative]: file.contents.toString() },
      {
        module: true,
        format: { comments: false },
        compress: {
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        ...(file.sourceMap ? { sourceMap: { content: file.sourceMap, filename: file.relative } } : {}),
      }
    );
    file.contents = Buffer.from(result.code);
    if (result.map) file.sourceMap = JSON.parse(result.map);
  });

export const cssMinify = () =>
  contentTransform('CSS minification', (file) => {
    const result = lightningcss({
      filename: file.relative,
      code: file.contents,
      minify: true,
    });
    file.contents = Buffer.from(result.code);
  });

// ─────────────────────────────────────────────────────────────
// Images (sharp / svgo)
// ─────────────────────────────────────────────────────────────

const RASTER_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export const sharpOptimize = () =>
  contentTransform('Image optimization', async (file) => {
    const ext = path.extname(file.path).toLowerCase();
    if (!RASTER_EXTENSIONS.includes(ext)) return;

    const { config } = app;
    const originalSize = file.contents.length;
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
          .png({ compressionLevel: config.images.png?.compressionLevel ?? 9 })
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
    }

    // Only replace if optimization actually reduced size (prevents double-compression degradation)
    if (optimized && optimized.length < originalSize) {
      file.contents = optimized;
    }
  });

export const svgoOptimize = () =>
  contentTransform('SVG optimization', (file) => {
    if (path.extname(file.path).toLowerCase() !== '.svg') return;

    const result = svgoOptimizeRaw(file.contents.toString(), {
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: { overrides: { removeViewBox: false } },
        },
      ],
    });
    file.contents = Buffer.from(result.data);
  });

/**
 * Convert raster images to another format (webp/avif) via sharp,
 * renaming the file extension. Files that fail to convert are dropped
 * so a broken image never ships under a wrong extension.
 */
export const imageToFormat = (imageFormat, options = {}) =>
  new Transform({
    objectMode: true,
    async transform(file, enc, callback) {
      if (file.isNull()) return callback(null, file);

      try {
        file.contents = await sharp(file.contents)[imageFormat](options).toBuffer();
        file.extname = `.${imageFormat}`;
        callback(null, file);
      } catch (error) {
        logWarning(`${imageFormat} conversion failed for ${path.basename(file.path)}: ${error.message}`);
        callback();
      }
    },
  });
