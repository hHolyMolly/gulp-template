import fs from 'node:fs/promises';
import path from 'node:path';
import { logSuccess, logWarning } from '../utils/index.js';

const KIT_README = `# Tailwind CSS — rebuild kit

Compiled styles: \`styles/tailwind.css\`. After changing utility classes in
\`.html\`/\`.php\`/\`.js\`, rebuild:

\`\`\`bash
npm install
npm run css
\`\`\`

Tailwind v4 auto-detects content in this folder (\`node_modules\` ignored).
Theme tokens live in \`tailwind.css\` (\`@theme\`).

## Dev mode (no rebuild needed)

On \`localhost\` / \`127.0.0.1\` / \`*.local\` / \`*.test\` pages auto-load the
Tailwind browser build — new classes work instantly. Other hosts load nothing.
Force on/off before \`</head>\`:

\`\`\`html
<script>window.TW_CDN = true; // or false</script>
\`\`\`

Dev only — always \`npm run css\` before going live.
`;

/**
 * WordPress handoff kit: makes dist/ self-sufficient for style rebuilds.
 * Emitted only for production builds with Tailwind active.
 */
export const tailwindKit = async () => {
  const { paths, config } = app;

  if (!config.tailwind.active || !config.env.isProd) return;

  let source;
  try {
    source = await fs.readFile(`${paths.srcStyles}/tailwind.css`, 'utf-8');
  } catch (error) {
    logWarning(`Tailwind kit skipped: ${error.message}`);
    return;
  }

  // Strip @source directives — inside dist/ Tailwind v4 auto-detects
  // content (.html/.php/.js) relative to this file
  const kitCss = source
    .split('\n')
    .filter((line) => !/^\s*@source\s/.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  const kitPackage = {
    name: 'tailwind-rebuild-kit',
    private: true,
    scripts: {
      css: 'tailwindcss -i ./tailwind.css -o ./styles/tailwind.css --minify',
    },
    devDependencies: {
      '@tailwindcss/cli': '^4',
      tailwindcss: '^4',
    },
  };

  await fs.writeFile(path.join(paths.build, 'tailwind.css'), kitCss);
  await fs.writeFile(path.join(paths.build, 'package.json'), `${JSON.stringify(kitPackage, null, 2)}\n`);
  await fs.writeFile(path.join(paths.build, 'TAILWIND.md'), KIT_README);

  logSuccess('Tailwind rebuild kit → dist/ (package.json, tailwind.css, TAILWIND.md)');
};
