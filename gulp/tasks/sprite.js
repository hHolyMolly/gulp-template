import svgSprite from 'gulp-svg-sprite';

export const sprite = () => {
  return app.gulp
    .src(`${app.paths.src}/assets/icons/**/*.svg`)
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
            example: false,
          },
        },
      })
    )
    .pipe(app.gulp.dest(`${app.paths.build}/assets`));
};
