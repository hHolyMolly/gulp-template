import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'));

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

const c = colors;
const divider = `${c.dim}${'─'.repeat(47)}${c.reset}`;

/**
 * Log build start message
 */
export const logBuildStart = (done) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const mode = isDev ? 'development' : 'production';
  const modeColor = isDev ? c.yellow : c.green;

  console.log('');
  console.log(divider);
  console.log('');
  console.log(`  ${c.cyan}◆${c.reset} ${c.bright}${pkg.name}${c.reset} ${c.dim}v${pkg.version}${c.reset}`);
  console.log(`  ${c.dim}Mode:${c.reset} ${modeColor}${mode}${c.reset}`);
  console.log('');
  console.log(divider);
  console.log('');

  done();
};

/**
 * Log build end message
 */
export const logBuildEnd = (done) => {
  const outputDir = app.paths.build;

  console.log('');
  console.log(divider);
  console.log('');
  console.log(`  ${c.green}✓${c.reset} ${c.bright}Build completed successfully!${c.reset}`);
  console.log(`  ${c.dim}Output:${c.reset} ${c.cyan}./${outputDir}/${c.reset}`);
  console.log('');
  console.log(divider);
  console.log('');

  done();
};

/**
 * Log server start message
 */
export const logServerStart = (port) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const mode = isDev ? 'development' : 'production';
  const modeColor = isDev ? c.yellow : c.green;

  console.log('');
  console.log(divider);
  console.log('');
  console.log(`  ${c.green}✓${c.reset} ${c.bright}${pkg.name}${c.reset} ${c.dim}v${pkg.version}${c.reset}`);
  console.log('');
  console.log(`  ${c.cyan}▸${c.reset} Local:    ${c.bright}http://localhost:${port}${c.reset}`);
  console.log(`  ${c.cyan}▸${c.reset} Mode:     ${modeColor}${mode}${c.reset}`);
  console.log('');
  console.log(divider);
  console.log('');
};

export { colors, divider, pkg };
