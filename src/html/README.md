# HTML Templates (Nunjucks)

Pages extend a base layout and override blocks. Partials are included with `{% include %}`.

## Structure

```
html/
├── layouts/
│   ├── base.html          # Base layout (all pages extend this)
│   ├── _head.html         # <head> meta, styles
│   ├── _header.html       # Site header
│   ├── _footer.html       # Site footer
│   └── _modals.html       # Modals
├── components/
│   └── welcome.html       # Reusable components
└── pages/
    ├── index.html          # → dist/index.html
    └── template.html       # → dist/template.html
```

## Page Example

```html
{% extends "layouts/base.html" %}

{% block title %}About{% endblock %}

{% block header %}
  {% include "layouts/_header.html" %}
{% endblock %}

{% block content %}
  <section class="about">
    <h1>About page</h1>
  </section>
{% endblock %}

{% block footer %}
  {% include "layouts/_footer.html" %}
{% endblock %}
```

## Available Blocks

| Block | Purpose | Default |
|-------|---------|---------|
| `title` | Page `<title>` | `gulp-template` |
| `header` | Header area | empty |
| `content` | Main content | empty |
| `footer` | Footer area | empty |
| `modals` | Modals after wrapper | empty |

## Quick Reference

```html
{# Comment #}

{{ variable }}

{% include "components/card.html" %}

{% if showBanner %}
  <div class="banner">...</div>
{% endif %}

{% for item in items %}
  <li>{{ item }}</li>
{% endfor %}

{% set year = 2026 %}
```
