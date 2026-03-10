<div align="center">
  <h1>Gulp Template</h1>
  <p>Modern Gulp 4 starter for fast frontend development</p>

  <p>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D22-brightgreen" alt="Node.js"></a>
    <a href="https://gulpjs.com"><img src="https://img.shields.io/badge/gulp-4-cf4647" alt="Gulp"></a>
    <a href="https://github.com/hHolyMolly/gulp-template/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License"></a>
  </p>
</div>

---

## Features

- **SCSS** — Dart Sass, autoprefixer, media query merging
- **Nunjucks** — layouts, pages, components templating
- **SVG Sprites** — automatic symbol sprite generation
- **Image Optimization** — Sharp (JPG/PNG/WebP/GIF) + auto WebP conversion
- **BrowserSync** — dev server with hot reload & 404 fallback
- **Production Build** — HTML/CSS/JS minification, sitemap, robots.txt
- **Code Quality** — ESLint 9 + Prettier + Stylelint
- **Tailwind CSS** — optional, one command setup

## Quick Start

```bash
npx degit hHolyMolly/gulp-template my-project
cd my-project
pnpm install
pnpm dev
```

> **Requirements:** Node.js 22+, pnpm

## Commands

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `pnpm dev`           | Dev server with hot reload              |
| `pnpm build:dev`     | Development build                       |
| `pnpm build:prod`    | Production build (minified + optimized) |
| `pnpm lint`          | ESLint + Stylelint with auto-fix        |
| `pnpm format`        | Prettier formatting                     |
| `pnpm tailwind:setup`| Add Tailwind CSS to project             |
| `pnpm clean`         | Remove `dist/`                          |

## Project Structure

```
src/
├── html/
│   ├── layouts/          # Base layout + partials (_head, _header, _footer)
│   ├── pages/            # Each page → dist/*.html
│   └── components/       # Reusable HTML blocks
├── styles/
│   ├── vars.scss         # CSS custom properties
│   ├── normalize.scss    # CSS reset
│   ├── fonts.scss        # @font-face declarations
│   ├── main.scss         # Main styles (auto-imports components/*)
│   ├── ui.scss           # Auto-imports ui/*
│   ├── utils.scss        # Utility classes
│   └── critical.scss     # Above-the-fold styles (optional)
├── scripts/
│   ├── app.js            # Entry point
│   ├── components/       # JS components (modals, sliders, etc.)
│   └── utils/            # Helper functions
└── assets/
    ├── fonts/            # Font files
    ├── img/              # Images (auto WebP + optimization)
    ├── sprites/          # SVG icons → sprite.symbol.svg
    └── video/            # Video files
```

## Configuration

All user-facing settings are in [`project.config.js`](project.config.js):

| Setting        | Description                                 |
| -------------- | ------------------------------------------- |
| `server`       | Port, hostname, auto-open browser           |
| `optimization` | HTML/CSS/JS/image minification, sitemap     |
| `images`       | WebP/JPEG/PNG quality and compression       |
| `sprites`      | SVG sprite toggle and filename              |
| `sizeReport`   | Gzip build size analysis                    |
| `postcss`      | Additional PostCSS plugins                  |

Environment variables are loaded from `.env.development` / `.env.production`.

## Build Pipeline

**Development** — `pnpm dev`

```
clean → [html, styles, scripts, images, sprites, assets] → watch + BrowserSync
```

Sourcemaps enabled, no minification, file caching for fast rebuilds.

**Production** — `pnpm build:prod`

```
clean → [html, styles, scripts, images, sprites, assets] → minify → sitemap + robots.txt
```

HTML/CSS/JS minified, images optimized via Sharp, sourcemaps removed.

## Tech Stack

| Category     | Technology                                       |
| ------------ | ------------------------------------------------ |
| Task Runner  | [Gulp 4](https://gulpjs.com)                     |
| Styling      | [Dart Sass](https://sass-lang.com) + [PostCSS](https://postcss.org) (Autoprefixer) |
| Templates    | [Nunjucks](https://mozilla.github.io/nunjucks/)  |
| Dev Server   | [BrowserSync](https://browsersync.io)            |
| Images       | [Sharp](https://sharp.pixelplumbing.com) + [gulp-webp](https://github.com/sindresorhus/gulp-webp) |
| Icons        | [SVG Sprite](https://github.com/svg-sprite/svg-sprite) + [SVGO](https://svgo.dev) |
| Code Quality | [ESLint 9](https://eslint.org) + [Prettier](https://prettier.io) + [Stylelint](https://stylelint.io) |

## License

MIT
