import fs from 'node:fs';
import path from 'node:path';
import { logWarning } from './logger.js';

/**
 * Creates an unlink handler for gulp.watch that removes the corresponding
 * build file, its .map sourcemap and optional derived siblings (.webp/.avif).
 *
 * @param {string} srcBase - Source base directory
 * @param {string} buildBase - Build output directory
 * @param {Object} extMap - Extension mapping (e.g. { '.scss': '.css' })
 * @param {string[]} siblingExts - Derived sibling extensions to remove (e.g. ['.webp', '.avif'])
 */
export const createUnlinkHandler = (srcBase, buildBase, extMap = {}, siblingExts = []) => {
  return (filePath) => {
    try {
      let relativePath = path.relative(srcBase, filePath);
      const ext = path.extname(relativePath);

      if (extMap[ext]) {
        relativePath = relativePath.replace(ext, extMap[ext]);
      }

      const buildPath = path.join(buildBase, relativePath);
      const targets = [buildPath, `${buildPath}.map`];

      for (const siblingExt of siblingExts) {
        targets.push(buildPath.replace(path.extname(buildPath), siblingExt));
      }

      for (const target of targets) {
        fs.rmSync(target, { force: true });
      }
    } catch (error) {
      logWarning(`Unlink handler failed for ${filePath}: ${error.message}`);
    }
  };
};
