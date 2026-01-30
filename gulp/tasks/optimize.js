import fs from 'fs/promises';
import path from 'path';
import { config } from '../configs/config.js';

// ─────────────────────────────────────────────────────────────
// Sitemap Generator
// ─────────────────────────────────────────────────────────────
export const sitemap = async () => {
  if (!config.seo.sitemap.enabled) {
    return;
  }

  const { hostname, lastmod, changefreq, priority } = config.seo.sitemap;
  const buildDir = app.paths.build;

  // Find all HTML files
  const htmlFiles = await findHtmlFiles(buildDir);

  // Generate sitemap XML
  const urls = htmlFiles.map((file) => {
    const relativePath = path.relative(buildDir, file).replace(/\\/g, '/');
    const url = relativePath === 'index.html' ? '' : relativePath.replace(/\.html$/, '');

    return `  <url>
    <loc>${hostname}/${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  await fs.writeFile(path.join(buildDir, 'sitemap.xml'), sitemapContent, 'utf-8');
  console.log('  ✓ sitemap.xml generated');
};

// ─────────────────────────────────────────────────────────────
// Robots.txt Generator
// ─────────────────────────────────────────────────────────────
export const robots = async () => {
  if (!config.seo.robots.enabled) {
    return;
  }

  const { allow, disallow, sitemap: includeSitemap } = config.seo.robots;
  const buildDir = app.paths.build;

  const lines = ['User-agent: *'];

  // Add Allow rules
  allow.forEach((path) => {
    lines.push(`Allow: ${path}`);
  });

  // Add Disallow rules
  disallow.forEach((path) => {
    lines.push(`Disallow: ${path}`);
  });

  // Add sitemap reference
  if (includeSitemap && config.seo.sitemap.enabled) {
    lines.push('');
    lines.push(`Sitemap: ${config.seo.sitemap.hostname}/sitemap.xml`);
  }

  const robotsContent = lines.join('\n') + '\n';

  await fs.writeFile(path.join(buildDir, 'robots.txt'), robotsContent, 'utf-8');
  console.log('  ✓ robots.txt generated');
};

// ─────────────────────────────────────────────────────────────
// Helper: Find HTML files recursively
// ─────────────────────────────────────────────────────────────
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
