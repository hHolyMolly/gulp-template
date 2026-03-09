import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const run = promisify(exec);

export const tailwind = async () => {
  const { paths, config } = globalThis.app;
  const configPath = path.join(paths.root, 'tailwind.config.js');
  const inputPath = path.join(paths.srcStyles, 'tailwind.css');

  // Skip if tailwind is not set up
  if (!fs.existsSync(configPath) || !fs.existsSync(inputPath)) return;

  // Ensure output directory exists
  fs.mkdirSync(paths.buildStyles, { recursive: true });

  const outputPath = path.join(paths.buildStyles, 'tailwind.css');
  const minify = config.env.isProd ? '--minify' : '';

  // Compile Tailwind CSS via CLI
  await run(`npx tailwindcss -i "${inputPath}" -o "${outputPath}" --config "${configPath}" ${minify}`.trim());

  // Generate rebuild kit in dist/
  generateRebuildKit(paths.build, configPath, inputPath);
};

function getInstalledVersion() {
  try {
    const pkgPath = path.resolve('node_modules/tailwindcss/package.json');
    return JSON.parse(fs.readFileSync(pkgPath, 'utf-8')).version;
  } catch {
    return '3.4.17';
  }
}

/**
 * Generate self-contained rebuild kit in dist/
 * Allows rebuilding Tailwind CSS without the full gulp-template setup
 */
function generateRebuildKit(distRoot, configPath, inputPath) {
  // 1. Minimal package.json with tailwindcss dep and build script
  const pkg = JSON.stringify(
    {
      private: true,
      description: 'Tailwind CSS rebuild kit — run "npm install && npm run build:css"',
      scripts: {
        'build:css': 'npx tailwindcss -i tailwind.input.css -o styles/tailwind.css --minify',
      },
      devDependencies: {
        tailwindcss: getInstalledVersion(),
      },
    },
    null,
    2,
  );
  fs.writeFileSync(path.join(distRoot, 'package.json'), pkg + '\n');

  // 2. Tailwind config with dist-specific content paths
  let configContent = fs.readFileSync(configPath, 'utf-8');
  configContent = configContent.replace(
    /content:\s*\[.*?\]/s,
    "content: ['./**/*.{html,php,js}', '!./node_modules/**']",
  );
  fs.writeFileSync(path.join(distRoot, 'tailwind.config.js'), configContent);

  // 3. Input CSS (Tailwind directives)
  fs.copyFileSync(inputPath, path.join(distRoot, 'tailwind.input.css'));

  // 4. Rebuild instructions
  const readme = [
    '# Tailwind CSS — Rebuild Instructions',
    '',
    'This folder contains a pre-compiled `styles/tailwind.css`.',
    'If you modify HTML/PHP files and need to update Tailwind CSS:',
    '',
    '## Quick Start',
    '',
    '```bash',
    'npm install',
    'npm run build:css',
    '```',
    '',
    '## What This Does',
    '',
    '- Scans all `.html`, `.php`, `.js` files for Tailwind utility classes',
    '- Generates an optimized `styles/tailwind.css` with only the classes you use',
    '',
    '## Files',
    '',
    '| File | Purpose |',
    '| --- | --- |',
    '| `package.json` | Dependencies and build script |',
    '| `tailwind.config.js` | Tailwind configuration (theme, plugins) |',
    '| `tailwind.input.css` | Source CSS with Tailwind directives |',
    '| `styles/tailwind.css` | Compiled output (auto-generated) |',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(distRoot, 'TAILWIND.md'), readme);
}

export const tailwindReload = (done) => {
  globalThis.app.plugins.browserSync.reload();
  done();
};
