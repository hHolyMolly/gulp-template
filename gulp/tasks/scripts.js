import { sizeReporter, jsMinify } from '../utils/index.js';

export const scripts = () => {
  const { gulp, paths, plugins, config } = app;

  let stream = gulp.src(paths.globs.scripts, {
    sourcemaps: config.sourceMaps,
    since: gulp.lastRun(scripts),
  });

  if (config.optimization.minify.js) {
    stream = stream.pipe(jsMinify());
  }

  return stream
    .pipe(sizeReporter('JS'))
    .pipe(gulp.dest(paths.buildScripts, { sourcemaps: config.sourceMaps ? '.' : false }))
    .pipe(plugins.browserSync.stream());
};
