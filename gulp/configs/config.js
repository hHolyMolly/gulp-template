import { existsSync } from 'node:fs';
import { projectConfig } from '../../project.config.js';
import { env } from './env.js';
import { paths } from './paths.js';
import { logWarning } from '../utils/logger.js';

/**
 * Validate required config fields and resolve derived flags.
 * Fallbacks come from the resolved env (gulp/configs/env.js) — never hardcoded here.
 * Note: only shallow copies — the config may hold functions (e.g. postcss plugins).
 */
const validateConfig = (cfg) => {
  const validated = { ...cfg, server: { ...cfg.server } };

  if (!validated.server.port) {
    logWarning(`Missing config: server.port — defaulting to ${env.port}`);
    validated.server.port = env.port;
  }

  if (!validated.server.hostname) {
    logWarning(`Missing config: server.hostname — defaulting to ${env.siteUrl}`);
    validated.server.hostname = env.siteUrl;
  }

  // tailwind.enabled: 'auto' → active when the entry file exists (created by `pnpm tailwind:setup`)
  const tailwindEnabled = cfg.tailwind?.enabled ?? 'auto';
  validated.tailwind = {
    ...cfg.tailwind,
    active: tailwindEnabled === 'auto' ? existsSync(`${paths.srcStyles}/tailwind.css`) : Boolean(tailwindEnabled),
  };

  return validated;
};

export const config = validateConfig(projectConfig);
