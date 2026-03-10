import { projectConfig } from '../../project.config.js';
import { logWarning } from '../utils/logger.js';

/**
 * Validate required config fields
 */
const validateConfig = (cfg) => {
  const validated = structuredClone(cfg);

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
