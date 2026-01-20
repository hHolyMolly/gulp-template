import fileInclude from 'gulp-file-include';
import prettify from 'gulp-prettify';

export const html = async () => {
  return app.gulp
    .src([`${app.paths.src}/html/**/*.html`, `!${app.paths.src}/html/**/_*.html`, `!${app.paths.src}/html/ui/**`])
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(
      prettify({
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 1,
        preserve_newlines: true,
        unformatted: ['pre', 'code'],
      })
    )
    .pipe(app.gulp.dest(app.paths.build))
    .pipe(app.plugins.browserSync.stream());
};
