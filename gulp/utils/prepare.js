import { existsSync, rmSync } from 'node:fs';

// When installed via degit (no .git directory), remove CI-specific files
// that are only needed for the template repository itself
if (!existsSync('.git') && existsSync('.github/workflows')) {
  rmSync('.github/workflows', { recursive: true });
}
