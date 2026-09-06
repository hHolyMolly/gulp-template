export const assets = () => {
  const { gulp, paths, plugins } = app;

  // encoding: false — fonts, favicon and video are binary
  return gulp
    .src(paths.globs.assets, { encoding: false, since: gulp.lastRun(assets) })
    .pipe(gulp.dest(paths.buildAssets))
    .pipe(plugins.browserSync.stream());
};
