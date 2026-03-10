import fs from 'fs';
import path from 'path';

/**
 * Creates an unlink handler for gulp.watch that:
 * - Removes the corresponding build file + its .map sourcemap
 * - Clears gulp-remember cache entry (prevents ghost files)
 *
 * @param {string} srcBase - Source base directory
 * @param {string} buildBase - Build output directory
 * @param {Object} extMap - Extension mapping (e.g. { '.scss': '.css' })
 * @param {string|null} cacheId - gulp-cached/remember cache ID
 */
export const createUnlinkHandler = (srcBase, buildBase, extMap = {}, cacheId = null) => {
  return (filePath) => {
    try {
      let relativePath = path.relative(srcBase, filePath);
      const ext = path.extname(relativePath);

      if (extMap[ext]) {
        relativePath = relativePath.replace(ext, extMap[ext]);
      }

      const buildPath = path.join(buildBase, relativePath);

      try {
        fs.unlinkSync(buildPath);
      } catch {}
      try {
        fs.unlinkSync(`${buildPath}.map`);
      } catch {}

      if (cacheId) {
        try {
          app.plugins.remember.forget(cacheId, path.resolve(filePath));
        } catch {}
      }
    } catch {}
  };
};
