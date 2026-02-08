import fs from 'fs/promises';
import path from 'path';
import { logSuccess } from '../utils/index.js';

async function findHtmlFiles(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await findHtmlFiles(fullPath, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

export const sitemap = async () => {
  const { paths, config } = app;

  if (!config.optimization.sitemap) {
    return;
  }

  const hostname = config.server.hostname;
  const buildDir = paths.build;
  const htmlFiles = await findHtmlFiles(buildDir);

  const urls = htmlFiles.map((file) => {
    const relativePath = path.relative(buildDir, file).replace(/\\/g, '/');
    const url = relativePath === 'index.html' ? '' : relativePath.replace(/\.html$/, '');

    return `  <url>
    <loc>${hostname}/${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`;
  });

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  await fs.writeFile(path.join(buildDir, 'sitemap.xml'), content, 'utf-8');
  logSuccess('sitemap.xml generated');
};

export const robots = async () => {
  const { paths, config } = app;

  if (!config.optimization.robots) {
    return;
  }

  const lines = ['User-agent: *', 'Allow: /'];

  if (config.optimization.sitemap) {
    lines.push('', `Sitemap: ${config.server.hostname}/sitemap.xml`);
  }

  await fs.writeFile(path.join(paths.build, 'robots.txt'), lines.join('\n') + '\n', 'utf-8');
  logSuccess('robots.txt generated');
};
