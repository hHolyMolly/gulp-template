/**
 * Tailwind CSS Setup Script
 * Run: pnpm run tailwind:setup
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import http from 'http';
import readline from 'readline';
import * as config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');
const templatesDir = path.join(__dirname, 'templates');

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function log(message, type = 'info') {
  const icons = { info: '◦', success: '✓', error: '✗', skip: '−' };
  console.log(`    ${icons[type]} ${message}`);
}

function confirm(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`  ${question} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

function resolvePath(...parts) {
  return path.join(rootDir, ...parts);
}

// Helper to get folder-aware paths
function getSourcePath(...parts) {
  return resolvePath(config.folders.src, ...parts);
}

function getGulpPath(...parts) {
  return resolvePath(config.folders.gulp, ...parts);
}

function copyTemplate(templateName, destPath) {
  const srcPath = path.join(templatesDir, templateName);

  if (!fs.existsSync(srcPath)) {
    log(`Template "${templateName}" not found.`, 'error');
    return false;
  }

  if (fs.existsSync(destPath)) {
    log(`${path.basename(destPath)} already exists.`, 'skip');
    return false;
  }

  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.copyFileSync(srcPath, destPath);
  log(`Created ${path.basename(destPath)}.`, 'success');
  return true;
}

function openBrowser(url) {
  const cmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  exec(`${cmd} ${url}`);
}

function isServerRunning() {
  return new Promise((resolve) => {
    const req = http.get(`http://${config.server.host}:${config.server.port}`, () => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function reloadServer() {
  // Touch a file to trigger BrowserSync reload
  const indexPath = getSourcePath(config.folders.html, config.files.indexHTML);
  if (fs.existsSync(indexPath)) {
    const now = new Date();
    fs.utimesSync(indexPath, now, now);
    log('Server reloaded.', 'success');
  }
}

// ─────────────────────────────────────────────────────────────
// Setup Tasks
// ─────────────────────────────────────────────────────────────

function createConfig() {
  const destPath = resolvePath(config.paths.config.dest, config.paths.config.filename);
  copyTemplate('tailwind.config.js', destPath);
}

function createStyles() {
  if (!config.options.createStyles) return;

  const destPath = getSourcePath(config.folders.styles, config.files.tailwindCSS);
  copyTemplate(config.files.tailwindCSS, destPath);
}

function injectCDN() {
  if (!config.options.injectCDN) return;

  const headPath = resolvePath(config.paths.head);

  if (!fs.existsSync(headPath)) {
    log('_head.html not found.', 'error');
    return;
  }

  let content = fs.readFileSync(headPath, 'utf-8');

  if (content.includes('cdn.tailwindcss.com')) {
    log('Tailwind CDN already in _head.html.', 'skip');
    return;
  }

  const attrs = config.cdn.attributes ? ` ${config.cdn.attributes}` : '';
  const cdnScript = `<script src="${config.cdn.url}"${attrs}></script>
<script>
  const script = document.createElement('script');
  script.type = 'module';
  script.textContent = \`import config from './tailwind.config.js'; if(window.tailwind) tailwind.config = config;\`;
  document.head.appendChild(script);
</script>
<link rel="stylesheet" href="./styles/tailwind.css" />`;

  if (content.includes('<link rel="stylesheet"')) {
    content = content.replace(/(<link rel="stylesheet")/, `${cdnScript}\n$1`);
  } else if (content.includes('</head>')) {
    content = content.replace('</head>', `${cdnScript}\n</head>`);
  } else {
    content += `\n${cdnScript}\n`;
  }

  fs.writeFileSync(headPath, content);
  log('Added Tailwind CDN to _head.html.', 'success');
}

function copyDemoPage() {
  if (!config.options.copyDemoPage) return;

  const destPath = getSourcePath(config.folders.html, config.files.tailwindDemo);
  copyTemplate(config.files.tailwindDemo, destPath);
}

function createGulpTask() {
  const destPath = getGulpPath(config.folders.tasks, config.files.tailwindTask);
  copyTemplate(config.files.tailwindTask, destPath);
}

function updateGulpfile() {
  const gulpfilePath = resolvePath('gulpfile.js');

  if (!fs.existsSync(gulpfilePath)) {
    log('gulpfile.js not found.', 'error');
    return;
  }

  let content = fs.readFileSync(gulpfilePath, 'utf-8');

  // Check if already added
  if (content.includes("from './gulp/tasks/tailwind.js'")) {
    log('Tailwind already in gulpfile.js.', 'skip');
    return;
  }

  // Add import
  const importLine = "import { tailwind, tailwindReload } from './gulp/tasks/tailwind.js';";
  content = content.replace(/(import { sprite }.*?;)/, `$1\n${importLine}`);

  // Add to watch
  content = content.replace(
    /(gulp\.watch\(\[`\$\{app\.paths\.src\}\/assets\/\*\*\/\*`.*?\], assets\);)/,
    `$1\n  gulp.watch([\`\${paths.root}/tailwind.config.js\`, \`\${paths.src}/styles/tailwind.css\`], gulp.series(tailwind, tailwindReload));`
  );

  // Add to mainTasks
  content = content.replace(
    /const mainTasks = gulp\.parallel\(([^)]+)\);/,
    'const mainTasks = gulp.parallel($1, tailwind);'
  );

  fs.writeFileSync(gulpfilePath, content);
  log('Updated gulpfile.js.', 'success');
}

function isInstalled() {
  const configPath = resolvePath(config.paths.config.dest, config.paths.config.filename);
  const headPath = resolvePath(config.paths.head);

  // Check if config exists
  if (fs.existsSync(configPath)) return true;

  // Check if CDN is in _head.html
  if (fs.existsSync(headPath)) {
    const content = fs.readFileSync(headPath, 'utf-8');
    if (content.includes('cdn.tailwindcss.com')) return true;
  }

  return false;
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function setup() {
  console.log(`\n  🎨 Tailwind CSS v${config.version} Setup.\n`);

  if (isInstalled()) {
    console.log(`  ⚡ Tailwind CSS is already installed.\n`);
    console.log(`  To reinstall, remove ${config.paths.config.filename} and CDN from _head.html.\n`);
    return;
  }

  console.log('  This will:');
  console.log('    • Create tailwind.config.js');
  console.log('    • Create tailwind.css in styles folder');
  console.log('    • Add Tailwind CDN to _head.html');
  console.log('    • Create gulp task for Tailwind');
  console.log('    • Copy demo page\n');

  const confirmed = await confirm('Do you want to continue?');

  if (!confirmed) {
    console.log('\n  ❌ Setup cancelled.\n');
    return;
  }

  console.log('\n  Installing...\n');

  createConfig();
  createStyles();
  createGulpTask();
  updateGulpfile();
  injectCDN();
  copyDemoPage();

  console.log(`\n  ✅ Done! Docs: ${config.urls.docs}\n`);

  if (config.options.openBrowser && config.options.copyDemoPage) {
    const serverRunning = await isServerRunning();

    if (serverRunning) {
      reloadServer();
      // Wait for reload to complete
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`  🌐 Opening ${config.urls.demo}\n`);
      openBrowser(config.urls.demo);
    } else {
      console.log(`  💡 Run "pnpm start" to view the demo page.\n`);
    }
  }
}

setup();
