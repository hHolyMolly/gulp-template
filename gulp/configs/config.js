import { projectConfig } from '../../project.config.js';
import { logWarning } from '../utils/logger.js';

/**
 * Validate required config fields
 */
const validateConfig = (cfg) => {
  const validated = structuredClone(cfg);

  const criticalFolders = ['build', 'src'];
  const optionalFolders = ['styles', 'scripts', 'html', 'assets', 'images', 'sprites', 'pages', 'layouts', 'components'];
  const requiredExtensions = ['styles', 'scripts', 'html', 'images'];

  criticalFolders.forEach((key) => {
    if (!validated.folders?.[key]) {
      throw new Error(`Critical config missing: folders.${key} — build cannot proceed`);
    }
  });

  optionalFolders.forEach((key) => {
    if (!validated.folders?.[key]) {
      logWarning(`Missing config: folders.${key}`);
    }
  });

  requiredExtensions.forEach((key) => {
    if (!validated.extensions?.[key]) {
      logWarning(`Missing config: extensions.${key}`);
    }
  });

  if (!validated.server?.port) {
    logWarning('Missing config: server.port — defaulting to 3000');
    validated.server = { ...validated.server, port: 3000 };
  }

  if (!validated.server?.hostname) {
    logWarning('Missing config: server.hostname — defaulting to http://localhost:3000');
    validated.server = { ...validated.server, hostname: 'http://localhost:3000' };
  }

  return validated;
};

export const config = validateConfig(projectConfig);
