import fileInclude from 'gulp-file-include';
import htmlBeautify from 'gulp-html-beautify';
import gulpIf from 'gulp-if';
import { sizeReporter } from '../utils/index.js';

export const html = async () => {
  const { gulp, paths, plugins, config } = app;
  const src = [paths.globs.htmlPages, `!${paths.srcHtmlLayouts}/**/*`, `!${paths.srcHtmlComponents}/**/*`];

  // Format HTML if not minifying (dev mode or prod without minification)
  const shouldFormat = !config.optimization.minify.html;

  return gulp
    .src(src)
    .pipe(plugins.errorHandler('HTML'))
    .pipe(plugins.cached('html'))
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: paths.srcHtml,
      })
    )
    .pipe(
      gulpIf(
        shouldFormat,
        htmlBeautify({
          indent_size: 2,
          indent_char: ' ',
          max_preserve_newlines: 1,
          preserve_newlines: true,
          end_with_newline: true,
        })
      )
    )
    .pipe(plugins.remember('html'))
    .pipe(sizeReporter('HTML'))
    .pipe(gulp.dest(paths.build))
    .pipe(plugins.browserSync.stream());
};
