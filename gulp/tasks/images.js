export const images = () => {
  return app.gulp
    .src(app.paths.globs.images)
    .pipe(app.plugins.errorHandler('Images'))
    .pipe(app.plugins.cached('images'))
    .pipe(app.plugins.remember('images'))
    .pipe(app.gulp.dest(app.paths.buildImages))
    .pipe(app.plugins.browserSync.stream());
};
