# Copilot Instructions — Gulp Template

## Project Overview

Modern Gulp 4 template for fast frontend development with SCSS, Nunjucks HTML templates, SVG sprites, and automatic image optimization. Uses ESM modules, BrowserSync for hot reload, and a centralized configuration system.

**Stack:** Gulp 4, SCSS (Dart Sass), Nunjucks, PostCSS (Autoprefixer), Sharp, SVG Sprite, BrowserSync, ESLint + Prettier + Stylelint, pnpm

## Architecture

### Global App Object

The project uses `globalThis.app` as a global context available in all gulp tasks:

```js
globalThis.app = { gulp, paths, plugins, config };
```

- `gulp` — Gulp instance
- `paths` — computed file paths and globs (from `gulp/configs/paths.js`)
- `plugins` — shared gulp plugins (from `gulp/configs/plugins.js`)
- `config` — project configuration (from `project.config.js`)

Always access these via destructuring: `const { gulp, paths, plugins, config } = app;`

### Configuration System

All project settings are in `project.config.js` at root level:

- `folders` — directory names (src, build, styles, scripts, etc.)
- `extensions` — file extension patterns for globs
- `server` — port, hostname (from .env)
- `env` — `isDev` / `isProd` flags
- `sourceMaps` — enabled in dev
- `optimization` — minification flags (html, css, js, images), criticalCSS, sitemap, robots
- `images.webp` — WebP conversion settings
- `sprites` — SVG sprite settings
- `sizeReport` — build size analysis

Environment variables are loaded from `.env.development` or `.env.production` via `gulp/configs/env.js` (must be imported before config).

### Paths

All paths are computed dynamically in `gulp/configs/paths.js` from folder names in config. Never hardcode paths — use `paths.srcStyles`, `paths.buildImages`, `paths.globs.html`, etc.

Helper functions:
- `paths.getSrc('styles', 'components')` → `src/styles/components`
- `paths.getBuild('assets', 'img')` → `dist/assets/img`
- `paths.exclude(pattern)` → `!pattern`

## Directory Structure

```
src/
├── assets/              # Static assets (copied as-is, except images and sprites)
│   ├── fonts/           # Font files (@font-face in fonts.scss)
│   ├── img/             # Images (auto WebP conversion, sharp optimization)
│   ├── sprites/         # SVG files → combined into sprite.symbol.svg
│   └── video/           # Video files
├── html/
│   ├── layouts/         # Nunjucks layouts (base.html + _partials)
│   ├── components/      # Reusable HTML components
│   └── pages/           # Page files → compiled to dist/*.html
├── scripts/
│   ├── app.js           # Main entry point
│   ├── components/      # JS components (modals, sliders, etc.)
│   └── utils/           # Utility functions (debounce, DOM helpers)
└── styles/
    ├── vars.scss         # CSS custom properties
    ├── normalize.scss    # CSS reset
    ├── fonts.scss        # @font-face declarations
    ├── utils.scss        # Utility classes (.sr-only, .ibg, .icon)
    ├── ui.scss           # Auto-imports ui/* folder
    ├── main.scss         # Main styles, auto-imports components/*
    ├── critical.scss     # Above-the-fold styles (optional)
    ├── components/       # Component styles (_header.scss, _footer.scss)
    └── ui/               # UI element styles (_button.scss)

gulp/
├── configs/             # Configuration modules
│   ├── config.js        # Re-exports projectConfig
│   ├── env.js           # Loads .env files via dotenv
│   ├── paths.js         # Computed paths and globs
│   └── plugins.js       # Shared plugins + errorHandler
├── tasks/               # Gulp tasks
│   ├── assets.js        # Copy static assets
│   ├── clean.js         # Clean dist + cache clearing
│   ├── html.js          # Nunjucks → HTML + beautify
│   ├── images.js        # Copy images + WebP conversion
│   ├── minify.js        # HTML/CSS/JS/Image minification (prod)
│   ├── optimize.js      # sitemap.xml + robots.txt generation
│   ├── scripts.js       # JS processing + sourcemaps
│   ├── server.js        # BrowserSync dev server
│   ├── sprite.js        # SVG sprite generation
│   └── styles.js        # SCSS → CSS pipeline
└── utils/
    ├── index.js          # Re-exports
    ├── logger.js         # Console logger with ANSI colors + notifications
    └── stream.js         # sizeReporter, sourcemapsInit/Write, noop
```

## Conventions

### HTML (Nunjucks)

- Pages go in `src/html/pages/` — each page compiles to a root-level HTML file in `dist/`
- Layouts use `base.html` as master template with `{% extends "layouts/base.html" %}`
- Partials (head, header, footer, modals) are prefixed with `_` underscore
- Components are included via `{% include "components/name.html" %}`
- Auto-escape is OFF (`autoescape: false`) — output raw HTML when needed

### Styles (SCSS)

- Entry files (without `_` prefix) compile as separate CSS files: `normalize.css`, `vars.css`, `fonts.css`, `utils.css`, `ui.css`, `main.css`
- Partials start with `_` underscore and are auto-imported via `@use 'components/*'` / `@use 'ui/*'`
- CSS custom properties defined in `vars.scss` — use `var(--name)` everywhere
- Component styles match HTML component names: `_header.scss` for header
- Media queries are merged automatically via `gulp-merge-media-queries`
- Autoprefixer runs via PostCSS — no vendor prefixes needed
- Sourcemaps enabled in dev mode only
- If adding Tailwind CSS, run `pnpm tailwind:setup`

### Scripts (JavaScript)

- Entry point is `src/scripts/app.js` — import components from there
- Components are in `src/scripts/components/` — one file per feature
- Utilities are in `src/scripts/utils/` — pure helper functions
- Use ES module imports (`import`/`export`)
- `console.log` is allowed in dev — stripped in production build via terser

### Images

- Place images in `src/assets/img/`
- JPG/PNG are auto-converted to WebP format alongside originals
- In production: Sharp optimizes JPG (quality 80), PNG (compression 9), WebP (quality 80)
- SVG files for sprites go in `src/assets/sprites/`

### SVG Sprites

- Place SVG icons in `src/assets/sprites/`
- Output: `dist/assets/sprites/sprite.symbol.svg`
- Usage in HTML: `<svg class="icon"><use href="assets/sprites/sprite.symbol.svg#icon-name"></use></svg>`
- SVGO settings: keeps viewBox, removes xmlns, cleans up IDs

## Build Pipeline

### Development (`pnpm start`)

```
clean → [html, styles, scripts, images+webp, sprite, assets] → watch + BrowserSync
```

- Sourcemaps enabled, no minification
- File caching — only changed files are reprocessed
- BrowserSync auto-reloads on changes
- Layout/component changes trigger full HTML cache clear

### Production (`pnpm build:prod`)

```
clean → [html, styles, scripts, images+webp, sprite, assets] → minify → SEO
```

- HTML minified (whitespace, comments removed)
- CSS minified via CSSO
- JS minified via terser (console/debugger removed)
- Images optimized via Sharp
- Optional sitemap.xml and robots.txt generation

## Creating New Gulp Tasks

Follow the existing pattern:

```js
// gulp/tasks/myTask.js
import { sizeReporter } from '../utils/index.js';

export const myTask = () => {
  const { gulp, paths, plugins, config } = app;

  return gulp
    .src('source/glob')
    .pipe(plugins.errorHandler('Task Name'))
    .pipe(/* transforms */)
    .pipe(sizeReporter('Task Name'))
    .pipe(gulp.dest(paths.build))
    .pipe(plugins.browserSync.stream());
};
```

Then register in `gulpfile.js`:
1. Import the task
2. Add to watch if needed
3. Add to appropriate task group (mainTasks, optimizeTasks, etc.)

## Utility Functions

### Stream Helpers (`gulp/utils/stream.js`)

- `sizeReporter(title, options)` — conditional gzip size report
- `sourcemapsInit()` — conditional sourcemaps initialization
- `sourcemapsWrite(dest)` — conditional sourcemaps write
- `noop()` — no-op stream placeholder

### Logger (`gulp/utils/logger.js`)

- `logSuccess(message)` — green checkmark
- `logWarning(message)` — yellow warning
- `logError(message)` — red cross
- `logInfo(message)` — cyan info
- `logBuildStart(done)` / `logBuildEnd(done)` — build lifecycle messages
- `logServerStart(port)` — server start banner

### Error Handling

Always use `plugins.errorHandler('Task Name')` as the first pipe in any task. It wraps `gulp-plumber` with `gulp-notify` for desktop notifications on errors.

## Code Style

- **ESM modules** — `import`/`export`, not `require`/`module.exports`
- **ESLint** — `@eslint/js` recommended + Prettier integration
- **Prettier** — auto-formatting
- **Stylelint** — `stylelint-config-standard-scss` for SCSS files
- **No TypeScript** — plain JavaScript
- **No bundler** — scripts are copied with sourcemaps (no webpack/rollup)
- Lint + format: `pnpm lint` and `pnpm format`

## Commands Reference

| Command | Description |
|---------|-------------|
| `pnpm start` | Dev server with hot reload |
| `pnpm build:dev` | Development build (no minification) |
| `pnpm build:prod` | Production build (minified + optimized) |
| `pnpm lint` | ESLint + Stylelint with auto-fix |
| `pnpm format` | Prettier formatting |
| `pnpm tailwind:setup` | Add Tailwind CSS to project |
| `pnpm clean` | Remove dist folder |
| `pnpm clean:cache` | Clear build caches |
| `pnpm clean:all` | Remove node_modules + dist |
