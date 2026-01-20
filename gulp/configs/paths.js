import path from 'path';
import { fileURLToPath } from 'url';
import {
  folders,
  files,
  extensions,
  paths as projectPaths,
  globs,
  getSrc,
  getBuild,
  getGlob,
  exclude,
} from '../../project.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

// Export unified paths with root directory
export const paths = {
  // Base paths
  root: rootDir,

  // Import all paths from project config
  ...projectPaths,

  // Folder names
  folders,

  // File names
  files,

  // Extensions
  extensions,

  // Glob patterns
  globs,

  // Helper functions
  getSrc,
  getBuild,
  getGlob,
  exclude,
};
