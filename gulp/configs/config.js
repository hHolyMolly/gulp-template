const isDev = process.env.NODE_ENV !== 'production';
const isProd = process.env.NODE_ENV === 'production';

export const config = {
  port: parseInt(process.env.PORT) || 5555,
  isDev,
  isProd,

  // Source maps only in development
  sourceMaps: isDev,

  minify: {
    html: isProd,
    css: isProd,
    js: isProd,
    images: isProd,
  },
};
