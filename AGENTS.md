# gulp-template — agent instructions

Static-markup starter: Gulp 5 + SCSS + `@@include` HTML partials, no JS bundler.
Build output (`dist/`) is a WordPress-handoff artifact: readable, self-sufficient,
hand-editable. Keep it that way.

## Architecture

- `gulpfile.js` sets `globalThis.app = { gulp, paths, plugins, config }`; every
  task destructures from that global instead of importing configs.
- Import order in gulpfile matters: `gulp/configs/env.js` (dotenv) must load
  before `config.js`.
- `gulp/configs/paths.js` — all folder names/globs, computed, not user-facing.
- `gulp/configs/config.js` — validates `project.config.js`, resolves
  `config.tailwind.active` (`'auto'` → `existsSync('src/styles/tailwind.css')`).
  Only shallow-copies the config (it may contain functions — never
  `structuredClone` it).
- `project.config.js` — the only user-facing settings file.
- `gulp/utils/transforms.js` — small Transform streams replace single-purpose
  gulp plugins (prettier/terser/lightningcss/sharp/svgo). They catch their own
  errors and pass files through so watch survives.
- `gulp/utils/stream.js` — `sizeReporter` (PassThrough when disabled),
  `handleError(title)` (attach via `.on('error', ...)` to plugin streams:
  logs, rings bell, `this.emit('end')`), `streamToPromise` (for async tasks
  that can't return a stream — calls `.resume()` then awaits `finished`).

## Conventions

- **Incremental builds**: `{ since: gulp.lastRun(task) }` — no gulp-cached /
  gulp-remember / gulp-newer. `html` is incremental per page; `htmlAll`
  (same stream, no `since`) runs when layouts/components change.
- **Binary streams need `{ encoding: false }`** in `gulp.src` (Gulp 5 decodes
  UTF-8 by default): images, assets (fonts/video/favicon), vendor copies.
- **Sass**: gulp-sass + sass-embedded. No glob imports — partials are
  registered in `styles/components/_index.scss` / `styles/ui/_index.scss` via
  `@forward`. Folder names are lowercase (case-sensitive FS compatibility).
  Breakpoints live in `styles/_mixins.scss` (`$breakpoints` map,
  `media-up/down/between`, `hover`, `fluid()`) — never hardcode media queries.
  Design tokens (colors/z-index/radius/header-height) in `styles/vars.scss`.
- **Sizing pattern**: all sizes are written in pixels through `rem()` / `em()`
  (`rem(18)`, `rem(12 24)`, `rem(0 auto)`, `rem(320px)`, `em(20)`) — never raw
  `px`/`rem` literals in declarations. Only exceptions: media queries inside
  `_mixins.scss` (px by design) and the typed zero fallback in
  `var(--header-height, 0rem)` (bare 0 breaks calc()).
- **Critical CSS**: `optimization.criticalCSS: true` inlines compiled
  `critical.scss` into `<head>` (html task, `__CRITICAL_CSS__` placeholder) —
  it never compiles to a standalone file.
- **JS is copied 1:1** as native ES modules — never add a bundler/transpiler.
  Libraries come in via `vendors` in project.config.js → `dist/**/vendor/`.
- **Minification happens in the main tasks** (single pass, gated by
  `config.optimization.minify.*`) — there is no separate minify stage.
- **Sprite**: `gulp-svg-sprite` bundles svgo@2 internally — its plugin name is
  `cleanupIDs` (capital IDs), do not "fix" it to the svgo3 spelling. Icons are
  included via `@@include('components/_icon.html', {"name": "<file>"})`
  (`.icon` styles in `styles/ui/_icon.scss`).
- **Env**: defaults (port 3000, derived localhost URL) are defined ONCE in
  `gulp/configs/env.js`, which exports resolved `env` — never hardcode
  ports/URLs elsewhere. Load order: `.env.local` wins over `.env.{NODE_ENV}`.

## Tailwind v4 (optional feature)

- Activation is file-based: `src/styles/tailwind.css` exists → pipeline active.
  `pnpm tailwind:setup` (`.template/setup/tailwind/`) only installs
  `tailwindcss` + `@tailwindcss/postcss` and copies template files — it must
  never patch gulpfile.js or \_head.html.
- `gulp/tasks/tailwind.js` imports `@tailwindcss/postcss` **dynamically**
  (the package is absent in vanilla projects) and warns instead of crashing.
- `_head.html` uses `@@if (tailwind)` / `@@if (tailwindCdn)` — booleans passed
  as gulp-file-include `context` from the html task. `tailwindCdn` is
  prod-builds-only.
- The `@theme` block between `/* tw-theme:start */` … `/* tw-theme:end */`
  markers in tailwind.css is extracted and inlined into pages (replaces the
  `/* __TW_THEME__ */` placeholder in `layouts/_tailwind-cdn.html`) so tokens
  reach the CDN dev mode. Keep the markers.
- CDN loader: pinned `@tailwindcss/browser` version + SRI hash live in
  `layouts/_tailwind-cdn.html` — when bumping the version, recompute the hash:
  `curl -sL <url> | openssl dgst -sha384 -binary | openssl base64 -A`.
- `gulp/tasks/tailwindKit.js` writes the dist rebuild kit (package.json,
  tailwind.css without `@source` lines, TAILWIND.md) on prod builds only.

## Commands & verification

- `pnpm dev` / `pnpm build:dev` / `pnpm build:prod` / `pnpm preview` /
  `pnpm serve` (no rebuild) / `pnpm zip` (handoff archive)
- `pnpm tailwind:setup` (add Tailwind) / `pnpm clean:demo` (remove demo content
  — destructive, test only on a copy)
- `pnpm lint:check` and `pnpm format:check` must pass (CI runs both).
- After build changes verify: all 6 CSS entries in `dist/styles/`, sprite in
  `dist/assets/sprites/`, `.webp` siblings for jpg/png, no `@@` leftovers in
  dist HTML, no `dist/package.json` unless Tailwind is active in prod.
- The template repo itself stays vanilla: no tailwindcss/swiper in
  devDependencies, `vendors: []` commented out. Test features, then revert.

## Supply chain

- `pnpm-workspace.yaml` sets `minimumReleaseAge: 4320` (3 days) — a too-fresh
  dependency version fails install; lower the range floor (pnpm picks the
  newest mature version) instead of excluding packages.
- GitHub Actions are pinned to commit SHAs (`# vX` comment alongside) — keep
  pins when updating.
- `gulp/utils/prepare.js` runs on `pnpm install` for degit clones only
  (no `.git`): strips LICENSE/.github/workflows, resets package.json,
  self-deletes.
