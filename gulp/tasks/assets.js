export const assets = () => {
  const { gulp, paths, plugins } = app;

  return gulp.src(paths.globs.assets).pipe(gulp.dest(paths.buildAssets)).pipe(plugins.browserSync.stream());
};
