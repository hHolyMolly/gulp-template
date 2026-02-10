# Gulp Template

Modern Gulp template for frontend development — SCSS, Nunjucks, SVG sprites, image optimization, and flexible configuration.

<!-- [Live Demo](https://hholymolly.github.io/gulp-template) — раскомментируй после деплоя -->

## Quick Start

```bash
pnpm dlx degit hHolyMolly/gulp-template my-project
cd my-project
pnpm install
pnpm start
```

## Features

- **BrowserSync** — live reload dev server
- **SCSS** — sourcemaps, autoprefixer, media query merging
- **Nunjucks** — modular HTML templates (layouts, pages, components)
- **SVG Sprites** — automatic sprite generation with SVGO
- **WebP** — automatic image conversion (jpg/png → webp)
- **Sharp** — production image optimization
- **Critical CSS** — optional above-the-fold styles
- **SEO** — sitemap.xml + robots.txt generation
- **Size Report** — gzipped build size analysis
- **ESLint + Prettier + Stylelint** — code quality tools
- **Tailwind CSS** — optional setup via `pnpm tailwind:setup`

## Commands

| Command | Description |
|---|---|
| `pnpm start` | Dev server with hot reload |
| `pnpm build:dev` | Development build |
| `pnpm build:prod` | Production build (minified + optimized) |
| `pnpm lint` | ESLint + Stylelint with auto-fix |
| `pnpm format` | Prettier formatting |
| `pnpm tailwind:setup` | Add Tailwind CSS to project |
| `pnpm clean` | Remove dist |
| `pnpm clean:cache` | Clear build caches |
| `pnpm clean:all` | Remove node_modules + dist |

## Project Structure

```
src/
├── html/
│   ├── layouts/        # Base layout + partials (_head, _header, _footer)
│   ├── pages/          # Pages → compiled to dist/*.html
│   └── components/     # Reusable HTML components
├── styles/
│   ├── vars.scss       # CSS custom properties
│   ├── normalize.scss  # CSS reset
│   ├── fonts.scss      # @font-face declarations
│   ├── main.scss       # Main styles + auto-imports components/*
│   ├── ui.scss         # Auto-imports ui/*
│   ├── utils.scss      # Utility classes
│   ├── critical.scss   # Above-the-fold styles (optional)
│   ├── components/     # Component styles
│   └── ui/             # UI element styles
├── scripts/
│   ├── app.js          # Entry point
│   ├── components/     # JS components
│   └── utils/          # Utility functions
└── assets/
    ├── fonts/          # Font files
    ├── img/            # Images (auto WebP + optimization)
    ├── sprites/        # SVG → sprite.symbol.svg
    └── video/          # Video files
```

## Configuration

All settings in [`project.config.js`](project.config.js):

- **Folders & extensions** — directory names and file patterns
- **Server** — port and hostname (from `.env`)
- **Optimization** — minification, critical CSS, sitemap, robots
- **Images** — WebP quality, sprites config
- **Size report** — gzip analysis toggle

## License

MIT © [HolyMolly](https://github.com/hHolyMolly)
