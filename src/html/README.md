# HTML Templates

Each page is a complete HTML document. Shared parts (head, header, footer) are included via `@@include`.

## Structure

```
html/
├── layouts/
│   ├── _head.html         # <head> meta, styles
│   ├── _header.html       # Site header
│   └── _footer.html       # Site footer
├── components/
│   └── demo.html          # Reusable components
└── pages/
    ├── index.html          # → dist/index.html
    └── template.html       # → dist/template.html
```

## Page Example

```html
<!doctype html>
<html lang="en">
  <head>
    @@include('layouts/_head.html')
    <title>About</title>
  </head>

  <body>
    @@include('layouts/_header.html')

    <main class="page">
      <section class="about">
        <div class="container">
          <h1>About page</h1>
        </div>
      </section>
    </main>

    @@include('layouts/_footer.html')

    <script src="./scripts/app.js" type="module"></script>
  </body>
</html>
```

## Include Syntax

```html
@@include('layouts/_header.html') @@include('components/card.html')
```

Paths are relative to `src/html/`.
