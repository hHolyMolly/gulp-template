import { config } from '../configs/config.js';

export const server = () => {
  app.plugins.browserSync.init({
    server: {
      baseDir: app.paths.build,
    },
    notify: false,
    port: config.port,
    open: true,
    cors: true,
  });
};
