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

export const extractMedia = async () => {
  const { paths, config } = app;

  if (!config.optimization?.extractMedia) {
    return;
  }

  const stylesDir = paths.buildStyles;
  const entries = await fs.readdir(stylesDir);
  const cssFiles = entries.filter((f) => f.endsWith('.css') && !f.endsWith('.map') && f !== 'media.css');

  const allMedia = [];
  const mediaRegex = /@media[^{]+\{(?:[^{}]*|\{[^{}]*\})*\}/g;

  for (const file of cssFiles) {
    const filePath = path.join(stylesDir, file);
    let content = await fs.readFile(filePath, 'utf-8');
    const matches = content.match(mediaRegex) || [];

    if (matches.length > 0) {
      allMedia.push(`/* from ${file} */`);
      allMedia.push(...matches);
      content = content.replace(mediaRegex, '').replace(/\n\s*\n\s*\n/g, '\n\n');
      await fs.writeFile(filePath, content, 'utf-8');
    }
  }

  if (allMedia.length > 0) {
    const mediaContent = `/* Media Queries */\n\n${allMedia.join('\n\n')}\n`;
    await fs.writeFile(path.join(stylesDir, 'media.css'), mediaContent, 'utf-8');
    logSuccess('media.css generated');
  }
};

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
