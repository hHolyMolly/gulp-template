import * as dartSass from 'sass';
import gulpDartSass from 'gulp-dart-sass';
import mergeMediaQueries from 'gulp-merge-media-queries';
import cleanCSS from 'gulp-clean-css';
import gulpIf from 'gulp-if';
import { config } from '../configs/config.js';

export const styles = () => {
  return app.gulp
    .src([app.paths.globs.styles, app.paths.exclude(`${app.paths.srcStyles}/${app.paths.files.tailwindCSS}`)])
    .pipe(app.plugins.errorHandler('Styles'))
    .pipe(app.plugins.cached('styles'))
    .pipe(gulpIf(config.sourceMaps, app.plugins.sourcemaps.init()))
    .pipe(
      gulpDartSass({
        logger: dartSass.Logger.silent,
        loadPaths: [app.paths.src, 'node_modules'],
      }).on('error', gulpDartSass.logError)
    )
    .pipe(app.plugins.remember('styles'))
    .pipe(mergeMediaQueries())
    .pipe(
      cleanCSS({
        format: config.isDev ? 'beautify' : false,
      })
    )
    .pipe(gulpIf(config.sourceMaps, app.plugins.sourcemaps.write('.')))
    .pipe(app.gulp.dest(app.paths.buildStyles))
    .pipe(app.plugins.browserSync.stream());
};
