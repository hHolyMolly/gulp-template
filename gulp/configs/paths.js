import path from 'path';
import { fileURLToPath } from 'url';
import { projectConfig } from '../../project.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

const { folders, extensions } = projectConfig;

const computedPaths = {
  srcStyles: `${folders.src}/${folders.styles}`,
  srcScripts: `${folders.src}/${folders.scripts}`,
  srcHtml: `${folders.src}/${folders.html}`,
  srcAssets: `${folders.src}/${folders.assets}`,
  srcImages: `${folders.src}/${folders.assets}/${folders.images}`,
  srcSprites: `${folders.src}/${folders.assets}/${folders.sprites}`,
  srcHtmlLayouts: `${folders.src}/${folders.html}/${folders.layouts}`,
  srcHtmlPages: `${folders.src}/${folders.html}/${folders.pages}`,
  srcHtmlComponents: `${folders.src}/${folders.html}/${folders.components}`,
  buildStyles: `${folders.build}/${folders.styles}`,
  buildScripts: `${folders.build}/${folders.scripts}`,
  buildAssets: `${folders.build}/${folders.assets}`,
  buildImages: `${folders.build}/${folders.assets}/${folders.images}`,
};

const globs = {
  html: `${computedPaths.srcHtml}/**/*.${extensions.html}`,
  htmlPages: `${computedPaths.srcHtmlPages}/*.${extensions.html}`,
  htmlComponents: [
    `${computedPaths.srcHtmlLayouts}/**/*.${extensions.html}`,
    `${computedPaths.srcHtmlComponents}/**/*.${extensions.html}`,
  ],
  styles: [`${computedPaths.srcStyles}/*.${extensions.styles}`, `!${computedPaths.srcStyles}/_*.${extensions.styles}`],
  stylesWatch: `${computedPaths.srcStyles}/**/*.${extensions.styles}`,
  scripts: `${computedPaths.srcScripts}/**/*.${extensions.scripts}`,
  images: `${computedPaths.srcImages}/**/*.${extensions.images}`,
  sprites: `${computedPaths.srcSprites}/**/*.${extensions.sprites}`,
  assets: [
    `${computedPaths.srcAssets}/**/*`,
    `!${computedPaths.srcImages}/**/*.${extensions.images}`,
    `!${computedPaths.srcSprites}/**/*.${extensions.sprites}`,
  ],
};

const exclude = (pattern) => `!${pattern}`;
const getSrc = (...parts) => [folders.src, ...parts].filter(Boolean).join('/');
const getBuild = (...parts) => [folders.build, ...parts].filter(Boolean).join('/');

export const paths = {
  root: rootDir,
  build: folders.build,
  src: folders.src,
  ...computedPaths,
  folders,
  extensions,
  globs,
  exclude,
  getSrc,
  getBuild,
};
