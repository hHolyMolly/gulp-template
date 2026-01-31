import fileInclude from 'gulp-file-include';
import { sizeReporter } from '../utils/index.js';

export const html = async () => {
  const { gulp, paths, plugins } = app;
  const src = [paths.globs.htmlPages, `!${paths.srcHtmlLayouts}/**/*`, `!${paths.srcHtmlComponents}/**/*`];

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
    .pipe(plugins.remember('html'))
    .pipe(sizeReporter('HTML'))
    .pipe(gulp.dest(paths.build))
    .pipe(plugins.browserSync.stream());
};
