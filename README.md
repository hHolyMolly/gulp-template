# Gulp Template

Modern Gulp-based frontend template with SCSS, Nunjucks, SVG sprites, image optimization, and flexible build configuration.

## Quick Start

```bash
npx degit hHolyMolly/gulp-template my-project
cd my-project
npm install    # or pnpm install / yarn install
npm run dev    # or pnpm dev / yarn dev
```

> Requires **Node.js 22+**.

## Tech Stack

| Category      | Technology                                        |
| ------------- | ------------------------------------------------- |
| Task Runner   | Gulp 4                                            |
| Dev Server    | BrowserSync (live reload)                         |
| Styling       | SCSS (autoprefixer, media query merging)          |
| Templates     | Nunjucks (layouts, pages, components)             |
| Icons         | SVG sprites (SVGO optimization)                   |
| Images        | WebP conversion + Sharp optimization              |
| Code Quality  | ESLint 9 + Prettier + Stylelint                   |
| CSS Framework | Tailwind CSS (optional, `npm run tailwind:setup`) |
| SEO           | sitemap.xml + robots.txt generation               |
| Analysis      | Gzipped build size report                         |

## Commands

| Command                  | Description                             |
| ------------------------ | --------------------------------------- |
| `npm run dev`            | Dev server with hot reload              |
| `npm run build:dev`      | Development build                       |
| `npm run build:prod`     | Production build (minified + optimized) |
| `npm run lint`           | ESLint + Stylelint with auto-fix        |
| `npm run format`         | Prettier formatting                     |
| `npm run tailwind:setup` | Add Tailwind CSS to project             |
| `npm run clean`          | Remove `dist`                           |
| `npm run clean:cache`    | Clear build caches                      |
| `npm run clean:all`      | Remove `node_modules` + `dist`          |

## Project Structure

```
src/
├── html/
│   ├── layouts/             # Base layout + partials (_head, _header, _footer)
│   ├── pages/               # Pages → compiled to dist/*.html
│   └── components/          # Reusable HTML components
├── styles/
│   ├── vars.scss            # CSS custom properties
│   ├── normalize.scss       # CSS reset
│   ├── fonts.scss           # @font-face declarations
│   ├── main.scss            # Main styles + auto-imports components/*
│   ├── ui.scss              # Auto-imports ui/*
│   ├── utils.scss           # Utility classes
│   ├── critical.scss        # Above-the-fold styles (optional)
│   ├── components/          # Component styles
│   └── ui/                  # UI element styles
├── scripts/
│   ├── app.js               # Entry point
│   ├── components/          # JS components
│   └── utils/               # Utility functions
└── assets/
    ├── fonts/               # Font files
    ├── img/                 # Images (auto WebP + optimization)
    │   └── previews/        # OG / social media previews
    ├── sprites/             # SVG → sprite.symbol.svg
    └── video/               # Video files
```

## Configuration

All settings in [`project.config.js`](project.config.js):

| Setting              | Description                                 |
| -------------------- | ------------------------------------------- |
| Folders & Extensions | Directory names and file patterns           |
| Server               | Port and hostname (from `.env`)             |
| Optimization         | Minification, critical CSS, sitemap, robots |
| Images               | WebP quality, sprites config                |
| Size Report          | Gzip analysis toggle                        |

## License

MIT © [HolyMolly](https://github.com/hHolyMolly)
