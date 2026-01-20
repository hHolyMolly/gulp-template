import gulp from 'gulp';
import fs from 'fs';
import browserSync from 'browser-sync';

const { src, dest } = gulp;

export const tailwind = () => {
  const { paths } = global.app;
  const configPath = `${paths.root}/tailwind.config.js`;
  const stylesPath = `${paths.src}/styles/tailwind.css`;

  // Check if tailwind is installed
  if (!fs.existsSync(configPath)) {
    return Promise.resolve();
  }

  const tasks = [];

  // Copy tailwind.config.js to dist root
  if (fs.existsSync(configPath)) {
    tasks.push(src(configPath).pipe(dest(paths.build)));
  }

  // Copy tailwind.css to dist/styles
  if (fs.existsSync(stylesPath)) {
    tasks.push(src(stylesPath).pipe(dest(`${paths.build}/styles`)));
  }

  if (tasks.length === 0) {
    return Promise.resolve();
  }

  return Promise.all(tasks);
};

export const tailwindReload = (done) => {
  browserSync.reload();
  done();
};
