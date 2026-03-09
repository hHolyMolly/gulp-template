export const assets = () => {
  const { gulp, paths, plugins } = app;

  return gulp
    .src(paths.globs.assets)
    .pipe(plugins.errorHandler('Assets'))
    .pipe(plugins.newer(paths.buildAssets))
    .pipe(gulp.dest(paths.buildAssets))
    .pipe(plugins.browserSync.stream());
};
