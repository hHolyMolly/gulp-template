/**
 * Tailwind Setup Configuration
 */

// Directory names (mirrors gulp/configs/paths.js)
export const folders = {
  src: 'src',
  styles: 'styles',
  html: 'html',
  pages: 'pages',
};

// ─────────────────────────────────────────────────────────────
// Packages (Tailwind v4, CSS-first config)
// ─────────────────────────────────────────────────────────────

export const packages = ['tailwindcss@^4', '@tailwindcss/postcss@^4'];

// ─────────────────────────────────────────────────────────────
// Files created by the setup
// ─────────────────────────────────────────────────────────────

export const files = {
  // Creating this file activates the Tailwind pipeline (tailwind.enabled: 'auto')
  entry: `${folders.src}/${folders.styles}/tailwind.css`,
  demo: `${folders.src}/${folders.html}/${folders.pages}/tailwind.html`,
};

export const urls = {
  docs: 'https://tailwindcss.com/docs',
};
