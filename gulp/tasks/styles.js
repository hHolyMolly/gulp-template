import * as dartSass from 'sass';
import gulpDartSass from 'gulp-dart-sass';
import mergeMediaQueries from 'gulp-merge-media-queries';
import cleanCSS from 'gulp-clean-css';

export const styles = () => {
  return app.gulp
    .src([app.paths.globs.styles, app.paths.exclude(`${app.paths.srcStyles}/${app.paths.files.tailwindCSS}`)])
    .pipe(
      gulpDartSass({
        logger: dartSass.Logger.silent,
        loadPaths: [app.paths.src, 'node_modules'],
      }).on('error', gulpDartSass.logError)
    )
    .pipe(mergeMediaQueries())
    .pipe(
      cleanCSS({
        format: 'beautify',
      })
    )
    .pipe(app.gulp.dest(app.paths.buildStyles))
    .pipe(app.plugins.browserSync.stream());
};
