export const images = () => {
  return app.gulp
    .src(app.paths.globs.images)
    .pipe(app.gulp.dest(app.paths.buildImages))
    .pipe(app.plugins.browserSync.stream());
};
