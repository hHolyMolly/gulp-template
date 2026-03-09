/**
 * Tailwind CSS Setup Script (CLI)
 * Run: pnpm run tailwind:setup
 */

// Environment (must be first — loads .env before config evaluation)
import '../../setup-env.js';

import fs from 'fs';
import path from 'path';
import { exec, execSync } from 'child_process';
import http from 'http';
import readline from 'readline';
import * as config from './config.js';
import { resolvePath, srcPath } from '../../paths.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
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

function getSourcePath(...parts) {
  return srcPath(...parts);
}

function copyTemplate(templateName, destPath) {
  const src = path.join(templatesDir, templateName);

  if (!fs.existsSync(src)) {
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

  fs.copyFileSync(src, destPath);
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
  return new Promise((resolve) => {
    const url = `http://${config.server.host}:${config.server.port}/__browser_sync__?method=reload`;
    http
      .get(url, () => {
        log('Server reloaded.', 'success');
        resolve();
      })
      .on('error', () => {
        log('Could not reload server.', 'error');
        resolve();
      });
  });
}

// ─────────────────────────────────────────────────────────────
// Setup Tasks
// ─────────────────────────────────────────────────────────────

function installPackage() {
  log(`Installing ${config.packageName}@${config.version}...`, 'info');

  try {
    execSync(`pnpm add -D ${config.packageName}@${config.version}`, { stdio: 'pipe' });
    log(`Installed ${config.packageName}@${config.version}.`, 'success');
  } catch (err) {
    log(`Failed to install ${config.packageName}: ${err.message}`, 'error');
    throw err;
  }
}

function createConfig() {
  const destPath = resolvePath(config.paths.config.dest, config.paths.config.filename);
  copyTemplate('tailwind.config.js', destPath);
}

function createStyles() {
  if (!config.options.createStyles) return;

  const destPath = getSourcePath(config.folders.styles, config.files.tailwindCSS);
  copyTemplate(config.files.tailwindCSS, destPath);
}

function injectStylesheet() {
  if (!config.options.injectStylesheet) return;

  const headPath = resolvePath(config.paths.head);

  if (!fs.existsSync(headPath)) {
    log('_head.html not found.', 'error');
    return;
  }

  let content = fs.readFileSync(headPath, 'utf-8');

  if (content.includes('tailwind.css')) {
    log('Tailwind stylesheet already in _head.html.', 'skip');
    return;
  }

  const link = '<link rel="stylesheet" href="/styles/tailwind.css" />';

  // Insert before the first stylesheet so Tailwind resets load first
  if (content.includes('<link rel="stylesheet"')) {
    content = content.replace(/(<link rel="stylesheet")/, `${link}\n$1`);
  } else if (content.includes('</head>')) {
    content = content.replace('</head>', `${link}\n</head>`);
  } else {
    content += `\n${link}\n`;
  }

  fs.writeFileSync(headPath, content);
  log('Added Tailwind stylesheet to _head.html.', 'success');
}

function copyDemoPage() {
  if (!config.options.copyDemoPage) return;

  const destPath = getSourcePath(config.folders.html, config.paths.demo.filename);
  copyTemplate(config.files.tailwindDemo, destPath);
}

function createGulpTask() {
  const destPath = resolvePath(config.paths.gulpTask.dest, config.paths.gulpTask.filename);
  copyTemplate('tailwind.js', destPath);
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

  // Helper: replace with validation
  const safeReplace = (pattern, replacement, description) => {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content === before) {
      log(`Could not ${description} — gulpfile format may have changed.`, 'error');
      return false;
    }
    return true;
  };

  // Add import
  const importLine = "import { tailwind, tailwindReload } from './gulp/tasks/tailwind.js';";
  if (!safeReplace(/(import { sprite }.*?;)/, `$1\n${importLine}`, 'inject tailwind import')) return;

  // Add to watch
  if (
    !safeReplace(
      /(gulp\.watch\(globs\.assets.*?\).*?;)/,
      `$1\n  gulp.watch(['tailwind.config.js', \`\${paths.srcStyles}/tailwind.css\`], gulp.series(tailwind, tailwindReload));`,
      'add tailwind watcher'
    )
  )
    return;

  // Add to mainTasks
  if (
    !safeReplace(
      /const mainTasks = gulp\.parallel\(([^)]+)\);/,
      'const mainTasks = gulp.parallel($1, tailwind);',
      'add tailwind to mainTasks'
    )
  )
    return;

  fs.writeFileSync(gulpfilePath, content);
  log('Updated gulpfile.js.', 'success');
}

function isInstalled() {
  const configPath = resolvePath(config.paths.config.dest, config.paths.config.filename);
  const headPath = resolvePath(config.paths.head);

  // Check if config exists
  if (fs.existsSync(configPath)) return true;

  // Check if stylesheet is in _head.html
  if (fs.existsSync(headPath)) {
    const content = fs.readFileSync(headPath, 'utf-8');
    if (content.includes('tailwind.css')) return true;
  }

  return false;
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function setup() {
  console.log(`\n  🎨 Tailwind CSS v${config.version} Setup (CLI)\n`);

  if (isInstalled()) {
    console.log('  ⚡ Tailwind CSS is already installed.\n');
    console.log(`  To reinstall, remove ${config.paths.config.filename} and tailwind link from _head.html.\n`);
    return;
  }

  console.log('  This will:');
  console.log(`    • Install ${config.packageName} package`);
  console.log('    • Create tailwind.config.js');
  console.log('    • Create tailwind.css in styles folder');
  console.log('    • Add stylesheet link to _head.html');
  console.log('    • Create gulp task for Tailwind CLI');
  console.log('    • Copy demo page');
  console.log('    • Auto-generate rebuild kit in dist/\n');

  const confirmed = await confirm('Do you want to continue?');

  if (!confirmed) {
    console.log('\n  ❌ Setup cancelled.\n');
    return;
  }

  console.log('\n  Installing...\n');

  installPackage();
  createConfig();
  createStyles();
  createGulpTask();
  updateGulpfile();
  injectStylesheet();
  copyDemoPage();

  console.log(`\n  ✅ Done! Docs: ${config.urls.docs}\n`);

  if (config.options.openBrowser && config.options.copyDemoPage) {
    const serverRunning = await isServerRunning();

    if (serverRunning) {
      await reloadServer();
      console.log(`  🌐 Opening ${config.urls.demo}\n`);
      openBrowser(config.urls.demo);
    } else {
      console.log('  💡 Run "pnpm dev" to view the demo page.\n');
    }
  }
}

setup();
