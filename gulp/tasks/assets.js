export const assets = () => {
  return app.gulp
    .src(app.paths.globs.assets)
    .pipe(app.gulp.dest(app.paths.buildAssets))
    .pipe(app.plugins.browserSync.stream());
};
