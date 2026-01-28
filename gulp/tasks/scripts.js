import gulpIf from 'gulp-if';
import { config } from '../configs/config.js';

export const scripts = () => {
  return app.gulp
    .src(app.paths.globs.scripts)
    .pipe(app.plugins.errorHandler('Scripts'))
    .pipe(app.plugins.cached('scripts'))
    .pipe(gulpIf(config.sourceMaps, app.plugins.sourcemaps.init()))
    .pipe(app.plugins.remember('scripts'))
    .pipe(gulpIf(config.sourceMaps, app.plugins.sourcemaps.write('.')))
    .pipe(app.gulp.dest(app.paths.buildScripts))
    .pipe(app.plugins.browserSync.stream());
};
