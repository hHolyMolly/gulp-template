/**
 * Handoff Archive Script
 * Run: pnpm zip (builds prod first)
 *
 * Archives dist/ into <project-name>-<YYYY-MM-DD>.zip at the project root.
 * No dependencies: system `zip` on macOS/Linux, Compress-Archive on Windows.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, rmSync, statSync, readFileSync } from 'node:fs';
import { resolvePath } from '../paths.js';

const dist = resolvePath('dist');

if (!existsSync(dist)) {
  console.error('\n  ✗ dist/ not found — run pnpm build:prod first\n');
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(resolvePath('package.json'), 'utf8'));
const date = new Date().toISOString().slice(0, 10);
const archiveName = `${pkg.name}-${date}.zip`;
const archivePath = resolvePath(archiveName);

rmSync(archivePath, { force: true });

try {
  if (process.platform === 'win32') {
    execFileSync(
      'powershell',
      ['-NoProfile', '-Command', `Compress-Archive -Path dist\\* -DestinationPath '${archivePath}' -Force`],
      { stdio: 'inherit' }
    );
  } else {
    // cwd: dist — archive contents land at the zip root (no dist/ prefix)
    execFileSync('zip', ['-r', '-q', archivePath, '.'], { cwd: dist, stdio: 'inherit' });
  }
} catch (error) {
  console.error(`\n  ✗ Archiving failed: ${error.message}\n`);
  process.exit(1);
}

const sizeKb = Math.round(statSync(archivePath).size / 1024);
console.log(`\n  ✓ ${archiveName} (${sizeKb} KB)\n`);
