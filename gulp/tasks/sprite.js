export const sprite = () => {
  return app.gulp
    .src(app.paths.globs.icons)
    .pipe(
      app.plugins.svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
            example: true,
          },
        },
      })
    )
    .pipe(app.gulp.dest(app.paths.buildAssets));
};
