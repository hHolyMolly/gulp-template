import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'));

export const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const c = colors;
const divider = (char = '─', length = 50) => `${c.dim}${char.repeat(length)}${c.reset}`;

const getEnvInfo = () => {
  const isDev = process.env.NODE_ENV !== 'production';
  return {
    mode: isDev ? 'development' : 'production',
    color: isDev ? c.yellow : c.green,
  };
};

export const logBuildStart = (done) => {
  const env = getEnvInfo();

  console.log('');
  console.log(divider());
  console.log('');
  console.log(`  ${c.cyan}◆${c.reset} ${c.bold}${pkg.name}${c.reset} ${c.dim}v${pkg.version}${c.reset}`);
  console.log(`  ${c.dim}Mode:${c.reset} ${env.color}${env.mode}${c.reset}`);
  console.log('');
  console.log(divider());
  console.log('');

  done();
};

export const logBuildEnd = (done) => {
  console.log('');
  console.log(divider());
  console.log('');
  console.log(`  ${c.green}✓${c.reset} ${c.bold}Build completed${c.reset}`);
  console.log(`  ${c.dim}Output:${c.reset} ${c.cyan}./${app.paths.build}/${c.reset}`);
  console.log('');
  console.log(divider());
  console.log('');

  done();
};

export const logServerStart = (port) => {
  const env = getEnvInfo();

  console.log('');
  console.log(divider());
  console.log('');
  console.log(`  ${c.green}✓${c.reset} ${c.bold}Server started${c.reset}`);
  console.log('');
  console.log(`  ${c.cyan}▸${c.reset} Local: ${c.bold}http://localhost:${port}${c.reset}`);
  console.log(`  ${c.cyan}▸${c.reset} Mode:  ${env.color}${env.mode}${c.reset}`);
  console.log('');
  console.log(divider());
  console.log('');
};

export const logSuccess = (message) => {
  console.log(`  ${c.green}✓${c.reset} ${message}`);
};

export const logWarning = (message) => {
  console.log(`  ${c.yellow}⚠${c.reset} ${message}`);
};

export const logError = (message) => {
  console.log(`  ${c.red}✗${c.reset} ${message}`);
};

export const logInfo = (message) => {
  console.log(`  ${c.cyan}ℹ${c.reset} ${message}`);
};

export { pkg, divider };
