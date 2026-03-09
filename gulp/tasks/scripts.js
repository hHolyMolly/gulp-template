import { sizeReporter } from '../utils/index.js';

export const scripts = () => {
  const { gulp, paths, plugins, config } = app;

  return gulp
    .src(paths.globs.scripts, { sourcemaps: config.sourceMaps })
    .pipe(plugins.errorHandler('Scripts'))
    .pipe(plugins.newer(paths.buildScripts))
    .pipe(sizeReporter('JS'))
    .pipe(gulp.dest(paths.buildScripts, { sourcemaps: config.sourceMaps ? '.' : false }))
    .pipe(plugins.browserSync.stream());
};
