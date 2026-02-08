import * as dartSass from 'sass';
import gulpDartSass from 'gulp-dart-sass';
import sassGlob from 'gulp-sass-glob-use-forward';
import mergeMediaQueries from 'gulp-merge-media-queries';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import { sizeReporter, sourcemapsInit, sourcemapsWrite } from '../utils/index.js';

export const styles = () => {
  const { gulp, paths, plugins, config } = app;

  // Exclude critical.scss if disabled
  const src = config.optimization.criticalCSS
    ? paths.globs.styles
    : [...paths.globs.styles, `!${paths.srcStyles}/critical.scss`];

  return gulp
    .src(src)
    .pipe(plugins.errorHandler('Styles'))
    .pipe(plugins.cached('styles'))
    .pipe(sourcemapsInit())
    .pipe(sassGlob())
    .pipe(
      gulpDartSass({
        logger: dartSass.Logger.silent,
        loadPaths: [paths.src, 'node_modules'],
      }).on('error', gulpDartSass.logError)
    )
    .pipe(plugins.remember('styles'))
    .pipe(postcss([autoprefixer()]))
    .pipe(mergeMediaQueries())
    .pipe(sourcemapsWrite())
    .pipe(sizeReporter('CSS'))
    .pipe(gulp.dest(paths.buildStyles))
    .pipe(plugins.browserSync.stream());
};
