import browserSync from 'browser-sync';
import newer from 'gulp-newer';
import svgSprite from 'gulp-svg-sprite';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import sourcemaps from 'gulp-sourcemaps';
import cached from 'gulp-cached';
import remember from 'gulp-remember';

// Error handler with notifications
const errorHandler = (title) => {
  return plumber({
    errorHandler: notify.onError({
      title: title || 'Gulp Error',
      message: 'Error: <%= error.message %>',
      sound: 'Beep',
    }),
  });
};

export const plugins = {
  browserSync,
  newer,
  svgSprite,
  plumber,
  notify,
  sourcemaps,
  cached,
  remember,
  errorHandler,
};
