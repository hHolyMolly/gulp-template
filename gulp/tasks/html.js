import fileInclude from 'gulp-file-include';
import prettify from 'gulp-prettify';
import replace from 'gulp-replace';
import gulpIf from 'gulp-if';
import size from 'gulp-size';
import { config } from '../configs/config.js';

// Add loading="lazy" to images that don't have loading attribute
const addLazyLoading = () => {
  if (!config.html.lazyLoading.enabled) {
    return replace(/(?!x)x/, ''); // No-op replace
  }

  // Match img tags without loading attribute and add loading="lazy"
  return replace(/<img(?![^>]*loading=)([^>]*)(src=)/gi, '<img$1loading="lazy" $2');
};

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
    .pipe(addLazyLoading())
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
    .pipe(
      gulpIf(
        config.sizeReport.enabled,
        size({
          title: 'HTML',
          showFiles: config.sizeReport.showFiles,
          showTotal: config.sizeReport.showTotal,
          gzip: config.sizeReport.gzip,
        })
      )
    )
    .pipe(app.gulp.dest(app.paths.build))
    .pipe(app.plugins.browserSync.stream());
};
