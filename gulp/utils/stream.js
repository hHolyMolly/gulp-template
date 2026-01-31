import gulpIf from 'gulp-if';
import size from 'gulp-size';

export const sizeReporter = (title, options = {}) => {
  const { config } = app;

  return gulpIf(
    config.sizeReport.enabled,
    size({
      title,
      showFiles: options.showFiles ?? true,
      showTotal: options.showTotal ?? true,
      gzip: options.gzip ?? config.sizeReport.gzip,
    })
  );
};

export const sourcemapsInit = () => {
  return gulpIf(app.config.sourceMaps, app.plugins.sourcemaps.init());
};

export const sourcemapsWrite = (dest = '.') => {
  return gulpIf(app.config.sourceMaps, app.plugins.sourcemaps.write(dest));
};

export const noop = () => gulpIf(false, size());
