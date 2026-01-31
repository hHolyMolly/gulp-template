import fs from 'fs/promises';

export const clean = async () => {
  try {
    await fs.rm(app.paths.build, { recursive: true, force: true });
  } catch {
    // Directory doesn't exist
  }
};

export const clearHtmlCache = (done) => {
  delete app.plugins.cached.caches['html'];
  done();
};

export const clearStylesCache = (done) => {
  delete app.plugins.cached.caches['styles'];
  done();
};
