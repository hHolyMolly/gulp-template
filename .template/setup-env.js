/**
 * Environment Setup for Template Scripts
 * Must be imported FIRST in any setup script (before config modules).
 */

import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });
