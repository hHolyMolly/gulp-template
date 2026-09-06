/**
 * Demo Cleanup Script
 * Run: pnpm clean:demo
 *
 * Removes the demo section and resets index.html to a clean skeleton.
 */

import fs from 'node:fs';
import { resolvePath } from '../paths.js';

const DEMO_COMPONENT = 'src/html/components/demo.html';
const INDEX_PAGE = 'src/html/pages/index.html';

const INDEX_SKELETON = `<!doctype html>
<html lang="en">
  <head>
    <!-- prettier-ignore -->
    @@include('layouts/_head.html', {
      "title": "Home",
      "description": "",
      "image": ""
    })
  </head>

  <body>
    <div class="wrapper">
      @@include('layouts/_header.html')

      <main class="page">
        <section class="hero">
          <div class="container">
            <h1>Home</h1>
          </div>
        </section>
      </main>

      @@include('layouts/_footer.html')
    </div>

    @@include('layouts/_modals.html')

    <script src="./scripts/app.js" type="module"></script>
  </body>
</html>
`;

function log(message, type = 'success') {
  const icons = { success: '✓', skip: '−' };
  console.log(`    ${icons[type]} ${message}`);
}

console.log('\n  🧹 Demo cleanup\n');

if (fs.existsSync(resolvePath(DEMO_COMPONENT))) {
  fs.rmSync(resolvePath(DEMO_COMPONENT));
  log(`Removed ${DEMO_COMPONENT}`);
} else {
  log(`${DEMO_COMPONENT} already removed`, 'skip');
}

fs.writeFileSync(resolvePath(INDEX_PAGE), INDEX_SKELETON);
log(`Reset ${INDEX_PAGE} to a clean skeleton`);

console.log('\n  ✅ Done! Start building: pnpm dev\n');
