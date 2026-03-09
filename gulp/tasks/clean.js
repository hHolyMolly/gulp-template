import fs from 'fs/promises';
import { logWarning } from '../utils/index.js';

export const clean = async () => {
  try {
    await fs.rm(app.paths.build, { recursive: true, force: true });
  } catch (error) {
    if (error.code !== 'ENOENT') {
      logWarning(`Clean failed: ${error.message}`);
    }
  }
};

export const clearHtmlCache = (done) => {
  delete app.plugins.cached.caches['html'];
  done();
};
