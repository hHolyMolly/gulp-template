/**
 * Project Configuration
 */

const isDev = process.env.NODE_ENV !== 'production';
const isProd = process.env.NODE_ENV === 'production';

export const projectConfig = {
  // Folders
  folders: {
    build: 'dist',
    src: 'src',
    styles: 'styles',
    scripts: 'scripts',
    html: 'html',
    assets: 'assets',
    images: 'img',
    sprites: 'sprites',
    pages: 'pages',
    layouts: 'layouts',
    components: 'components',
  },

  // File extensions
  extensions: {
    styles: '{css,scss}',
    scripts: 'js',
    html: 'html',
    images: '{jpg,jpeg,png,gif,ico,webp,svg}',
    sprites: 'svg',
  },

  // Dev server
  server: {
    port: Number(process.env.PORT) || 3000,
    hostname: process.env.SITE_URL || 'http://localhost:3000',
    open: true,
  },

  // Environment
  env: {
    isDev,
    isProd,
  },

  // Source maps (dev only)
  sourceMaps: isDev,

  // Optimization (prod only)
  optimization: {
    minify: {
      html: isProd,
      css: isProd,
      js: isProd,
      images: isProd,
    },
    criticalCSS: false,
    sitemap: false,
    robots: false,
  },

  // Images
  images: {
    webp: {
      enabled: true,
      quality: 80,
    },
    jpeg: {
      quality: 80,
      progressive: true,
    },
    png: {
      compressionLevel: 9,
    },
  },

  // SVG Sprites
  sprites: {
    enabled: true,
    fileName: 'sprite.symbol.svg',
  },

  // Size report
  sizeReport: {
    enabled: true,
    gzip: true,
  },

  // PostCSS (additional plugins applied after autoprefixer)
  postcss: {
    plugins: [],
  },
};
