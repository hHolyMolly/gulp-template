import { existsSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Only runs for degit-cloned projects (no .git directory)
if (!existsSync('.git')) {
  // 1. Remove CI workflows (template-repo only)
  if (existsSync('.github/workflows')) {
    rmSync('.github/workflows', { recursive: true });
  }

  // 2. Ask for project name (interactive) or use directory name (CI/non-TTY)
  const dirName = basename(resolve('.'));
  let projectName = dirName;

  if (process.stdin.isTTY) {
    try {
      const { createInterface } = await import('node:readline/promises');
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      const answer = await rl.question(`\n📦 Project name (${dirName}): `);
      if (answer.trim()) projectName = answer.trim();
      rl.close();
    } catch {
      // Non-interactive fallback — use directory name
    }
  }

  // 3. Update package.json for the new project
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  pkg.name = projectName;
  pkg.version = '1.0.0';
  pkg.description = '';
  pkg.author = '';
  delete pkg.license;
  delete pkg.scripts.prepare;
  writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

  // 4. Self-cleanup
  try {
    rmSync(fileURLToPath(import.meta.url), { force: true });
  } catch {}

  console.log(`\n✅ Project "${projectName}" is ready! Run: pnpm dev\n`);
}
