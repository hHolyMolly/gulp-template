/**
 * Tailwind CSS v4 Setup Script (CLI)
 * Run: pnpm tailwind:setup
 *
 * Zero-patch installer: the gulp pipeline natively supports Tailwind and
 * activates itself when src/styles/tailwind.css exists (tailwind.enabled: 'auto'
 * in project.config.js). This script only installs packages and copies files.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import * as config from './config.js';
import { resolvePath } from '../../paths.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    rl.question(`  ${question} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

function copyTemplate(templateName, destRelative) {
  const src = path.join(templatesDir, templateName);
  const dest = resolvePath(destRelative);

  if (!fs.existsSync(src)) {
    log(`Template "${templateName}" not found.`, 'error');
    return;
  }

  if (fs.existsSync(dest)) {
    log(`${destRelative} already exists.`, 'skip');
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  log(`Created ${destRelative}.`, 'success');
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function setup() {
  console.log('\n  🎨 Tailwind CSS v4 Setup\n');

  if (fs.existsSync(resolvePath(config.files.entry))) {
    console.log('  ⚡ Tailwind CSS is already installed.\n');
    console.log(`  To reinstall, remove ${config.files.entry} and run this again.\n`);
    return;
  }

  console.log('  This will:');
  console.log(`    • Install ${config.packages.join(', ')} (dev deps)`);
  console.log(`    • Create ${config.files.entry} — v4 CSS-first config, activates the pipeline`);
  console.log(`    • Add a demo page at ${config.files.demo}\n`);

  const confirmed = await confirm('Do you want to continue?');

  if (!confirmed) {
    console.log('\n  ❌ Setup cancelled.\n');
    return;
  }

  console.log('\n  Installing...\n');

  try {
    log(`Installing ${config.packages.join(', ')}...`);
    execSync(`pnpm add -D ${config.packages.join(' ')}`, { stdio: 'pipe' });
    log('Packages installed.', 'success');
  } catch (error) {
    log(`Install failed: ${error.message}`, 'error');
    process.exitCode = 1;
    return;
  }

  copyTemplate('tailwind.css', config.files.entry);
  copyTemplate('tailwind.html', config.files.demo);

  console.log(`\n  ✅ Done! Restart the dev server: pnpm dev`);
  console.log(`  📖 Docs: ${config.urls.docs}\n`);
}

setup();
