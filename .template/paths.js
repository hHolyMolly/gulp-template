/**
 * Template Paths
 * Shared helper for setup scripts in .template/setup/
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../');

/** Path relative to the project root */
export const resolvePath = (...parts) => path.join(rootDir, ...parts);
