import * as dartSass from 'sass';
import gulpDartSass from 'gulp-dart-sass';
import mergeMediaQueries from 'gulp-merge-media-queries';
import cleanCSS from 'gulp-clean-css';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import gulpIf from 'gulp-if';
import size from 'gulp-size';
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
    .pipe(postcss([autoprefixer()]))
    .pipe(mergeMediaQueries())
    .pipe(
      cleanCSS({
        format: config.isDev ? 'beautify' : false,
      })
    )
    .pipe(gulpIf(config.sourceMaps, app.plugins.sourcemaps.write('.')))
    .pipe(
      gulpIf(
        config.sizeReport.enabled,
        size({
          title: 'CSS',
          showFiles: config.sizeReport.showFiles,
          showTotal: config.sizeReport.showTotal,
          gzip: config.sizeReport.gzip,
        })
      )
    )
    .pipe(app.gulp.dest(app.paths.buildStyles))
    .pipe(app.plugins.browserSync.stream());
};
