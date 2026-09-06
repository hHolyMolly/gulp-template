import fileInclude from 'gulp-file-include';
import { sizeReporter, handleError, htmlPrettify, htmlMinify, replaceContents } from '../utils/index.js';
import { getTailwindTheme } from './tailwind.js';

// Placeholder inside layouts/_tailwind-cdn.html, replaced with the @theme block
// from src/styles/tailwind.css so design tokens reach the CDN dev mode.
const TW_THEME_PLACEHOLDER = '/* __TW_THEME__ */';

const htmlStream = ({ all = false } = {}) => {
  const { gulp, paths, plugins, config } = app;

  const tailwindActive = config.tailwind.active;
  // The CDN dev-mode snippet is only for handoff builds (WordPress etc.) —
  // local `pnpm dev` already rebuilds tailwind.css on the fly.
  const tailwindCdn = tailwindActive && config.env.isProd;

  let stream = gulp.src(paths.globs.htmlPages, { since: all ? undefined : gulp.lastRun(html) }).pipe(
    fileInclude({
      prefix: '@@',
      basepath: paths.srcHtml,
      context: {
        tailwind: tailwindActive,
        tailwindCdn,
      },
    }).on('error', handleError('HTML'))
  );

  if (tailwindCdn) {
    stream = stream.pipe(replaceContents(TW_THEME_PLACEHOLDER, getTailwindTheme()));
  }

  // Minified for production, prettified (readable, hand-editable) otherwise
  stream = stream.pipe(config.optimization.minify.html ? htmlMinify() : htmlPrettify());

  return stream.pipe(sizeReporter('HTML')).pipe(gulp.dest(paths.build)).pipe(plugins.browserSync.stream());
};

// Incremental: only pages changed since the last run
export const html = () => htmlStream();

// Full rebuild: used when layouts/components change (they affect every page)
export const htmlAll = () => htmlStream({ all: true });
