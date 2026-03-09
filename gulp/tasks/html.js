import nunjucksRender from 'gulp-nunjucks-render';
import prettier from 'gulp-prettier';
import gulpIf from 'gulp-if';
import { sizeReporter } from '../utils/index.js';

export const html = () => {
  const { gulp, paths, plugins, config } = app;
  const src = paths.globs.htmlPages;

  // Format HTML if not minifying (dev mode or prod without minification)
  const shouldFormat = !config.optimization.minify.html;

  return gulp
    .src(src)
    .pipe(plugins.errorHandler('HTML'))
    .pipe(plugins.cached('html'))
    .pipe(
      nunjucksRender({
        path: [paths.srcHtml],
        envOptions: { autoescape: false },
      })
    )
    .pipe(
      gulpIf(
        shouldFormat,
        prettier({
          parser: 'html', // Override jinja-template parser — compiled output is plain HTML
          htmlWhitespaceSensitivity: 'ignore',
        })
      )
    )
    .pipe(plugins.remember('html'))
    .pipe(sizeReporter('HTML'))
    .pipe(gulp.dest(paths.build))
    .pipe(plugins.browserSync.stream());
};
