<div align="center">
  <h1>Gulp Template</h1>
  <p>Modern Gulp 5 starter for fast frontend development</p>

  <p>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D22-brightgreen?style=flat-square" alt="Node.js"></a>
    <a href="https://gulpjs.com"><img src="https://img.shields.io/badge/gulp-5-cf4647?style=flat-square" alt="Gulp"></a>
    <a href="https://github.com/hHolyMolly/gulp-template/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License"></a>
  </p>
</div>

<br />

## Features

- **SCSS** — Dart Sass (sass-embedded), Autoprefixer, media query merging
- **HTML Includes** — `@@include` partials with parameters
- **SVG Sprites** — symbol sprite + `_icon.html` partial
- **Images** — Sharp optimization, auto WebP, opt-in AVIF
- **Vendors** — library files copied from `node_modules` into `dist`
- **BrowserSync 3** — dev server, hot reload, 404 fallback
- **Production** — Lightning CSS + Terser + html-minifier; optional sitemap, robots.txt, inline critical CSS
- **Tailwind CSS v4** — optional, one command, zero patching
- **WordPress Handoff** — self-sufficient `dist/` with Tailwind rebuild kit & CDN dev mode
- **Code Quality** — ESLint 9, Prettier, Stylelint 17

## Quick Start

```bash
npx degit hHolyMolly/gulp-template my-project
cd my-project
pnpm install
pnpm dev
```

> Node.js 22+, pnpm 10+

## Commands

| Command               | Description                             |
| --------------------- | --------------------------------------- |
| `pnpm dev`            | Dev server with hot reload              |
| `pnpm build:dev`      | Development build (readable)            |
| `pnpm build:prod`     | Production build (minified + optimized) |
| `pnpm preview`        | Production build + preview server       |
| `pnpm serve`          | Serve existing `dist/` (no rebuild)     |
| `pnpm zip`            | Production build + `dist/` → zip        |
| `pnpm lint`           | ESLint + Stylelint with auto-fix        |
| `pnpm lint:check`     | Lint check only (CI)                    |
| `pnpm format`         | Prettier formatting                     |
| `pnpm format:check`   | Prettier check only (CI)                |
| `pnpm tailwind:setup` | Add Tailwind CSS v4                     |
| `pnpm clean:demo`     | Remove demo content, reset index.html   |
| `pnpm clean`          | Remove `dist/`                          |
| `pnpm clean:cache`    | Clear build & linter caches             |
| `pnpm clean:all`      | Remove `node_modules/` and `dist/`      |

## Project Structure

```
src/
├── html/
│   ├── layouts/          # _head, _header, _footer, _modals
│   ├── pages/            # Each file → dist/*.html
│   └── components/       # Reusable blocks (_icon.html, demo.html)
├── styles/
│   ├── vars.scss         # CSS custom properties
│   ├── normalize.scss    # CSS reset
│   ├── fonts.scss        # @font-face
│   ├── main.scss         # Layout + components/_index.scss
│   ├── ui.scss           # UI elements via ui/_index.scss
│   ├── utils.scss        # Utility classes
│   └── critical.scss     # Above-the-fold (optional)
├── scripts/
│   ├── app.js            # Entry — native ES modules, no bundler
│   ├── components/       # modals, sliders, spollers, …
│   └── utils/            # DOM, debounce, bodyLock
└── assets/
    ├── fonts/  img/  sprites/  video/
```

New SCSS partials: add a `@forward` line to `components/_index.scss` or `ui/_index.scss`.

## Configuration

[`project.config.js`](project.config.js) — the only settings file:

| Setting                    | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| `server`                   | Port, hostname, auto-open (values come from `.env`)                |
| `sourceMaps`               | CSS/JS sourcemaps (dev only by default)                            |
| `optimization`             | HTML/CSS/JS/image minification, sitemap, robots                    |
| `optimization.criticalCSS` | Inline compiled `critical.scss` into `<head>` of every page        |
| `tailwind`                 | `'auto'` (on when `src/styles/tailwind.css` exists) / `true/false` |
| `vendors`                  | Files copied from `node_modules` into `dist/**/vendor/`            |
| `images`                   | WebP/AVIF/JPEG/PNG quality                                         |
| `sprites`                  | SVG sprite toggle and filename                                     |
| `sizeReport`               | Gzip build size report                                             |
| `postcss`                  | Extra PostCSS plugins                                              |

Env: `.env.development` / `.env.production` (committed, no secrets) + `.env.local` (gitignored, wins). `PORT` and `SITE_URL` — hostname falls back to `http://localhost:<PORT>` automatically.

> Changes to `project.config.js`, `.env.*` or the `vendors` list require a dev server restart.

## SVG Icons

Drop an SVG into `src/assets/sprites/` and include it anywhere:

```html
@@include('components/_icon.html', {"name": "arrow-right"})
```

Icons size from `font-size` and color from `currentColor` (`.icon` in `ui/_icon.scss`).

## Responsive Images

The build creates a `.webp` sibling for every jpg/png (AVIF — opt-in via `images.avif`):

```html
@@include('components/_picture.html', { "src": "./assets/img/demo", "ext": "jpg", "alt": "…", "class": "", "loading":
"lazy", "width": "1200", "height": "675" })
```

## Vendor Libraries

```bash
pnpm add swiper
```

```js
// project.config.js
vendors: [
  'swiper/swiper-bundle.min.js',
  { from: 'swiper/swiper-bundle.min.css', to: 'swiper.min.css' },
],
```

```html
<link rel="stylesheet" href="./styles/vendor/swiper.min.css" />
<script src="./scripts/vendor/swiper-bundle.min.js"></script>
<script src="./scripts/app.js" type="module"></script>
```

## Tailwind CSS v4 (optional)

```bash
pnpm tailwind:setup   # installs packages, creates src/styles/tailwind.css + demo page
pnpm dev              # restart — pipeline activates automatically
```

CSS-first config in `src/styles/tailwind.css` (`@theme`, `@source`). Additive — SCSS entries untouched.

## WordPress Handoff

`pnpm build:prod` makes `dist/` self-sufficient inside a theme:

- JS ships as readable per-file ES modules; set `optimization.minify.*: false` for fully hand-editable output
- **Rebuild kit** (Tailwind active): `dist/package.json` + `TAILWIND.md` — after editing `.php`: `npm install && npm run css`
- **CDN dev mode**: on `localhost` / `*.local` / `*.test` pages auto-load the pinned Tailwind browser build (SRI) — new classes work without rebuild; production hosts load nothing. Override: `window.TW_CDN = true/false`

## Production Headers

Set on the server (static output can't):

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
# CSP on staging with Tailwind CDN dev mode: allow script-src https://cdn.jsdelivr.net
```

## License

MIT © [HolyMolly](https://github.com/hHolyMolly)
