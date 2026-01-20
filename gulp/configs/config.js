export const config = {
  port: parseInt(process.env.PORT) || 5555,

  minify: {
    html: true,
    css: true,
    js: true,
    images: true,
  },
};
