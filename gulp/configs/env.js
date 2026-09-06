/**
 * Environment — the single source of truth for env-derived values.
 * Must be imported BEFORE any config modules
 * (ESM evaluates imports in order — this ensures .env is loaded first).
 *
 * Load order (first wins): .env.local (gitignored) → .env.{development|production}
 */

import dotenv from 'dotenv';

const isProd = process.env.NODE_ENV === 'production';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: isProd ? '.env.production' : '.env.development' });

const port = Number(process.env.PORT) || 3000;

export const env = {
  isDev: !isProd,
  isProd,
  port,
  siteUrl: process.env.SITE_URL || `http://localhost:${port}`,
};
