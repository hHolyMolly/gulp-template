# HTML Templates

Each page is a standalone document. Shared parts are included via `@@include` with parameters. Paths are relative to `src/html/`.

## Structure

```
html/
├── layouts/
│   ├── _head.html         # <head> meta, OG tags, styles
│   ├── _header.html       # Site header
│   ├── _footer.html       # Site footer
│   ├── _modals.html       # Modal wrapper + script
│   └── _tailwind-cdn.html # Tailwind CDN dev mode (prod builds only)
├── components/
│   ├── _icon.html         # SVG sprite icon
│   └── demo.html          # Demo section (pnpm clean:demo)
└── pages/
    ├── index.html         # → dist/index.html
    ├── template.html      # → dist/template.html (starter page)
    └── 404.html           # → dist/404.html (noindex)
```

## Creating a Page

Copy `template.html`. Every page passes params to `_head.html`:

```html
<!-- prettier-ignore -->
@@include('layouts/_head.html', {
  "title": "About",
  "description": "About page description",
  "image": "./assets/img/previews/global.webp"
})
```

| Parameter     | Used for                      |
| ------------- | ----------------------------- |
| `title`       | `<title>` + OG/Twitter title  |
| `description` | Meta + OG/Twitter description |
| `image`       | OG/Twitter Card preview       |

## Icons

Add an SVG to `src/assets/sprites/`, then:

```html
@@include('components/_icon.html', {"name": "arrow-right"})
```

## Context Variables (`@@if`)

| Variable      | True when                          |
| ------------- | ---------------------------------- |
| `tailwind`    | Tailwind pipeline active           |
| `tailwindCdn` | Tailwind active + production build |

Used by `_head.html` — vanilla projects emit nothing.

## Vendor Libraries

Classic tags **before** the module entry (globals like `window.Swiper`):

```html
<link rel="stylesheet" href="./styles/vendor/swiper.min.css" />
<script src="./scripts/vendor/swiper-bundle.min.js"></script>
<script src="./scripts/app.js" type="module"></script>
```
