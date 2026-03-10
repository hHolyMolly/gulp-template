# HTML Templates

Each page is a standalone HTML document. Shared parts (`<head>`, header, footer, modals) are included via `@@include` with parameters.

## Structure

```
html/
├── layouts/
│   ├── _head.html         # <head> meta, OG tags, styles
│   ├── _header.html       # Site header
│   ├── _footer.html       # Site footer
│   └── _modals.html       # Modal wrapper + script
├── components/
│   └── demo.html          # Demo section (delete after starting)
└── pages/
    ├── index.html         # → dist/index.html
    ├── template.html      # → dist/template.html (starter page)
    └── 404.html           # → dist/404.html (noindex)
```

## Creating a Page

Use `template.html` as a base. Each page passes `title`, `description`, and `image` to the shared `_head.html` layout:

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- prettier-ignore -->
    @@include('layouts/_head.html', {
      "title": "About",
      "description": "About page description",
      "image": "./assets/img/previews/global.webp"
    })
  </head>

  <body>
    @@include('layouts/_header.html')

    <main class="page">
      <section class="about">
        <div class="container">
          <h1>About</h1>
        </div>
      </section>
    </main>

    @@include('layouts/_footer.html') @@include('layouts/_modals.html')

    <script src="./scripts/app.js" type="module"></script>
  </body>
</html>
```

## Parameters

| Parameter     | Description                               | Example                               |
| ------------- | ----------------------------------------- | ------------------------------------- |
| `title`       | Page title & OG/Twitter title             | `"Home Page"`                         |
| `description` | Meta description & OG/Twitter description | `"Page description"`                  |
| `image`       | OG & Twitter Card preview image           | `"./assets/img/previews/global.webp"` |

## Include Syntax

```html
@@include('layouts/_header.html') @@include('components/card.html')
```

Paths are relative to `src/html/`.
