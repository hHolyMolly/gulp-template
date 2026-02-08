/**
 * Environment Setup
 * Must be imported BEFORE any config modules
 * (ESM evaluates imports in order — this ensures .env is loaded first)
 */

import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });
