import { config } from '../configs/config.js';

// Get SVG sprite configuration based on mode
const getSpriteConfig = () => {
  const modes = {};

  if (config.sprite.mode === 'symbol' || config.sprite.mode === 'both') {
    modes.symbol = {
      sprite: '../icons/sprite.symbol.svg',
      example: config.sprite.example,
    };
  }

  if (config.sprite.mode === 'stack' || config.sprite.mode === 'both') {
    modes.stack = {
      sprite: '../icons/sprite.stack.svg',
      example: config.sprite.example,
    };
  }

  return {
    mode: modes,
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
};

export const sprite = () => {
  return app.gulp
    .src(app.paths.globs.icons)
    .pipe(app.plugins.errorHandler('Sprite'))
    .pipe(app.plugins.svgSprite(getSpriteConfig()))
    .pipe(app.gulp.dest(app.paths.buildAssets));
};
