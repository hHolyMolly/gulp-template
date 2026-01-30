import gulpIf from 'gulp-if';
import gulpEsbuild from 'gulp-esbuild';
import size from 'gulp-size';
import { config } from '../configs/config.js';

// Get file extensions based on TypeScript config
const getScriptGlob = () => {
  if (config.typescript.enabled) {
    return [
      `${app.paths.srcScripts}/**/*.js`,
      `${app.paths.srcScripts}/**/*.ts`,
      `!${app.paths.srcScripts}/**/*.d.ts`,
    ];
  }
  return app.paths.globs.scripts;
};

export const scripts = () => {
  return app.gulp
    .src(getScriptGlob())
    .pipe(app.plugins.errorHandler('Scripts'))
    .pipe(app.plugins.cached('scripts'))
    .pipe(gulpIf(config.sourceMaps, app.plugins.sourcemaps.init()))
    .pipe(
      gulpEsbuild({
        target: config.typescript.enabled ? config.typescript.target : config.scripts.target,
        loader: config.typescript.enabled ? { '.ts': 'ts', '.js': 'js' } : { '.js': 'js' },
        format: 'esm',
        sourcemap: config.sourceMaps ? 'inline' : false,
        minify: false, // Minification is done in minify.js for production
        keepNames: true,
      })
    )
    .pipe(app.plugins.remember('scripts'))
    .pipe(gulpIf(config.sourceMaps, app.plugins.sourcemaps.write('.')))
    .pipe(
      gulpIf(
        config.sizeReport.enabled,
        size({
          title: 'JS',
          showFiles: config.sizeReport.showFiles,
          showTotal: config.sizeReport.showTotal,
          gzip: config.sizeReport.gzip,
        })
      )
    )
    .pipe(app.gulp.dest(app.paths.buildScripts))
    .pipe(app.plugins.browserSync.stream());
};
