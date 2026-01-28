import fileInclude from 'gulp-file-include';
import prettify from 'gulp-prettify';
import gulpIf from 'gulp-if';
import { config } from '../configs/config.js';

export const html = async () => {
  return app.gulp
    .src([
      app.paths.globs.html,
      app.paths.exclude(app.paths.globs.htmlComponents),
      app.paths.exclude(app.paths.globs.htmlUI),
    ])
    .pipe(app.plugins.errorHandler('HTML'))
    .pipe(app.plugins.cached('html'))
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(app.plugins.remember('html'))
    .pipe(
      gulpIf(
        config.isDev,
        prettify({
          indent_size: 2,
          indent_char: ' ',
          max_preserve_newlines: 1,
          preserve_newlines: true,
          unformatted: ['pre', 'code'],
        })
      )
    )
    .pipe(app.gulp.dest(app.paths.build))
    .pipe(app.plugins.browserSync.stream());
};
