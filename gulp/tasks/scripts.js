import { sizeReporter } from '../utils/index.js';

export const scripts = () => {
  const { gulp, paths, plugins } = app;

  return gulp
    .src(paths.globs.scripts)
    .pipe(plugins.errorHandler('Scripts'))
    .pipe(plugins.newer(paths.buildScripts))
    .pipe(sizeReporter('JS'))
    .pipe(gulp.dest(paths.buildScripts))
    .pipe(plugins.browserSync.stream());
};
