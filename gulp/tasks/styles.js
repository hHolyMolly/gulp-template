import * as dartSass from 'sass';
import gulpDartSass from 'gulp-dart-sass';
import sassGlob from 'gulp-sass-glob-use-forward';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sortMediaQueries from 'postcss-sort-media-queries';
import { sizeReporter } from '../utils/index.js';

export const styles = () => {
  const { gulp, paths, plugins, config } = app;

  // Exclude critical.scss if disabled
  const src = config.optimization.criticalCSS
    ? paths.globs.styles
    : [...paths.globs.styles, `!${paths.srcStyles}/critical.scss`];

  const postcssPlugins = [
    autoprefixer(),
    ...(config.env.isProd ? [sortMediaQueries()] : []),
    ...(config.postcss?.plugins || []),
  ];

  return gulp
    .src(src, { sourcemaps: config.sourceMaps })
    .pipe(plugins.errorHandler('Styles'))
    .pipe(sassGlob())
    .pipe(
      gulpDartSass({
        logger: dartSass.Logger.silent,
        loadPaths: [paths.src, 'node_modules'],
      })
    )
    .pipe(postcss(postcssPlugins))
    .pipe(sizeReporter('CSS'))
    .pipe(gulp.dest(paths.buildStyles, { sourcemaps: config.sourceMaps ? '.' : false }))
    .pipe(plugins.browserSync.stream());
};
