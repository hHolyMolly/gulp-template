import { logServerStart } from '../utils/index.js';

export const server = () => {
  const { plugins, paths, config } = app;

  plugins.browserSync.init(
    {
      server: {
        baseDir: paths.build,
      },
      port: config.server.port,
      notify: false,
      open: true,
      cors: true,
      logLevel: 'silent',
    },
    () => {
      logServerStart(config.server.port);
    }
  );
};
