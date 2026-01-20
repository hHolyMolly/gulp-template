export const scripts = () => {
  return app.gulp
    .src(app.paths.globs.scripts)
    .pipe(app.gulp.dest(app.paths.buildScripts))
    .pipe(app.plugins.browserSync.stream());
};
