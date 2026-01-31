export const sprite = () => {
  const { gulp, paths, plugins, config } = app;

  if (!config.sprites.enabled) {
    return Promise.resolve();
  }

  const spriteConfig = {
    mode: {
      symbol: {
        sprite: `../${config.folders.sprites}/${config.sprites.fileName}`,
      },
    },
    shape: {
      transform: [
        {
          svgo: {
            plugins: [
              { name: 'removeViewBox', active: false },
              { name: 'removeXMLNS', active: true },
              { name: 'cleanupIDs', active: true },
            ],
          },
        },
      ],
    },
  };

  return gulp
    .src(paths.globs.sprites)
    .pipe(plugins.errorHandler('Sprite'))
    .pipe(plugins.svgSprite(spriteConfig))
    .pipe(gulp.dest(paths.buildAssets));
};
