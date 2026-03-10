import notifier from 'node-notifier';
import pkg from '../../package.json' with { type: 'json' };

const colors = {
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

let buildStartTime = 0;

const getEnvInfo = () => {
  const isDev = process.env.NODE_ENV !== 'production';
  return {
    mode: isDev ? 'development' : 'production',
    color: isDev ? c.yellow : c.green,
  };
};

export const logBuildStart = (done) => {
  const env = getEnvInfo();
  buildStartTime = Date.now();

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
  const elapsed = Date.now() - buildStartTime;
  const seconds = (elapsed / 1000).toFixed(2);

  console.log('');
  console.log(divider());
  console.log('');
  console.log(`  ${c.green}✓${c.reset} ${c.bold}Build completed${c.reset} ${c.dim}in ${seconds}s${c.reset}`);
  console.log(`  ${c.dim}Output:${c.reset} ${c.cyan}./${app.paths.build}/${c.reset}`);
  console.log('');
  console.log(divider());
  console.log('');
  notifier.notify({
    title: pkg.name,
    message: `Build completed \u2014 ${app.config.env.isProd ? 'production' : 'development'}`,
    sound: true,
  });
  done();
};

export const logServerStart = (port, externalUrl) => {
  const env = getEnvInfo();

  console.log('');
  console.log(divider());
  console.log('');
  console.log(`  ${c.green}✓${c.reset} ${c.bold}Server started${c.reset}`);
  console.log('');
  console.log(`  ${c.cyan}▸${c.reset} Local:   ${c.bold}http://localhost:${port}${c.reset}`);
  if (externalUrl) {
    console.log(`  ${c.cyan}▸${c.reset} Network: ${c.bold}${externalUrl}${c.reset}`);
  }
  console.log(`  ${c.cyan}▸${c.reset} Mode:    ${env.color}${env.mode}${c.reset}`);
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
