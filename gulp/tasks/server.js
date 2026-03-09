import fs from 'fs';
import path from 'path';
import { logServerStart, logWarning } from '../utils/index.js';

export const server = () => {
  const { plugins, paths, config } = app;

  plugins.browserSync.init(
    {
      server: {
        baseDir: paths.build,
      },
      port: config.server.port,
      notify: false,
      open: config.server.open ?? true,
      cors: true,
      logLevel: 'silent',
      middleware: [
        // Serve 404.html for unmatched routes (dev only)
        (req, res, next) => {
          const url = req.url.split('?')[0];

          // Let BrowserSync handle static assets and existing files
          if (path.extname(url)) return next();

          const resolved = path.join(paths.build, url);
          if (fs.existsSync(resolved) || fs.existsSync(`${resolved}.html`)) return next();

          const page404 = path.join(paths.build, '404.html');
          if (fs.existsSync(page404)) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end(fs.readFileSync(page404, 'utf-8'));
          }

          next();
        },
      ],
    },
    (err, bs) => {
      if (err) {
        logWarning(`Server failed to start: ${err.message}`);
        return;
      }

      const urls = bs.options.get('urls');
      logServerStart(config.server.port, urls?.get('external'));
    }
  );
};
