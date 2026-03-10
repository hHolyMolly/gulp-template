import { existsSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Only runs for degit-cloned projects (no .git directory).
// Cleans up template-specific files and initializes a fresh project.
if (!existsSync('.git')) {
  const projectName = basename(resolve('.'));

  // Remove CI workflows (only needed for the template repo)
  if (existsSync('.github/workflows')) {
    rmSync('.github/workflows', { recursive: true });
  }

  // Reset package.json to a clean project state
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  pkg.name = projectName;
  pkg.version = '1.0.0';
  pkg.description = '';
  pkg.author = '';
  delete pkg.license;
  delete pkg.scripts.prepare;
  writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

  // Self-delete — this script is no longer needed
  try {
    rmSync(fileURLToPath(import.meta.url), { force: true });
  } catch {}

  console.log(`\n✅ Project "${projectName}" initialized. Run: pnpm dev\n`);
}
