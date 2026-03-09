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
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
              { name: 'removeXMLNS' },
              {
                name: 'cleanupIDs',
                params: {
                  remove: false,
                  minify: true,
                },
              },
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
    .pipe(gulp.dest(paths.buildAssets))
    .pipe(plugins.browserSync.stream());
};
