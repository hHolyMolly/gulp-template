# 📌 Gulp Template

Modern Gulp template with SCSS, SVG sprites, TypeScript, and flexible configuration.

---

## ✨ Features

- 🔥 **BrowserSync** — Hot reload development server
- 🎨 **SCSS** — With source maps, autoprefixer, and media query merging
- 📦 **SVG Sprites** — Automatic sprite generation (symbol mode)
- 🗂️ **File Include** — Modular HTML structure
- ⚡ **Tailwind CSS** — Optional setup via CDN
- 🔧 **ESLint + Prettier + Stylelint** — Code quality tools
- 📁 **Flexible Config** — Single source of truth
- 🖼️ **WebP/AVIF** — Automatic modern image format generation
- 🗜️ **GZIP/Brotli** — Pre-compression for production
- 📊 **Size Report** — Build size analysis
- 🗺️ **Sitemap & Robots.txt** — SEO files generation (optional)
- 🔄 **Lazy Loading** — Automatic image lazy loading
- 📝 **TypeScript** — Full TypeScript support out of the box
- ⚡ **esbuild** — Fast JavaScript/TypeScript transpilation

---

## 🚀 Installation and Launch

### 1. Installing `PNPM` 📦

Before starting development, install `PNPM`:

```sh
npm install -g pnpm
```

### 2. Installing Dependencies ⚙️

With `PNPM`:

```sh
pnpm install
```

Alternatively, with `NPM`:

```sh
npm install
```

### 3. Running in Development Mode 🖥️

With `PNPM`:

```sh
pnpm start
```

Alternatively, with `NPM`:

```sh
npm run start
```

> Opens dev server at `http://localhost:${PORT}` (default: 3000)

### 4. Build for Development 🔨

With `PNPM`:

```sh
pnpm build:dev
```

Alternatively, with `NPM`:

```sh
npm run build:dev
```

> Builds without minification, includes source maps.

### 5. Build for Production 🛠️

With `PNPM`:

```sh
pnpm build:prod
```

Alternatively, with `NPM`:

```sh
npm run build:prod
```

> Builds with minification (HTML, CSS, JS, images).

---

## ✨ Linting and Formatting

### Check and fix JavaScript with ESLint:

With `PNPM`:

```sh
pnpm lint:js
```

Alternatively, with `NPM`:

```sh
npm run lint:js
```

### Check and fix styles with Stylelint:

With `PNPM`:

```sh
pnpm lint:css
```

Alternatively, with `NPM`:

```sh
npm run lint:css
```

### Run all linters:

With `PNPM`:

```sh
pnpm lint
```

Alternatively, with `NPM`:

```sh
npm run lint
```

### Format code with Prettier:

With `PNPM`:

```sh
pnpm format
```

Alternatively, with `NPM`:

```sh
npm run format
```

---

## 🎨 Tailwind CSS Setup (Optional)

To add Tailwind CSS to your project:

With `PNPM`:

```sh
pnpm tailwind:setup
```

Alternatively, with `NPM`:

```sh
npm run tailwind:setup
```

> This will add Tailwind CDN, create config file, and set up the gulp task.

---

## 🧹 Cleaning the Project

### Clear cache:

With `PNPM`:

```sh
pnpm clean:cache
```

Alternatively, with `NPM`:

```sh
npm run clean:cache
```

### Full cleanup (removes `node_modules`, `dist`, and lock files):

With `PNPM`:

```sh
pnpm clean:all
```

Alternatively, with `NPM`:

```sh
npm run clean:all
```

---

## 📁 Project Structure

```
├── src/
│   ├── assets/          # Static assets (fonts, icons, images)
│   ├── html/            # HTML templates
│   │   ├── components/  # Reusable components
│   │   ├── layouts/     # Layout partials (_head, _header, _footer)
│   │   └── ui/          # UI components with styles
│   ├── scripts/         # JavaScript files
│   │   ├── components/  # JS components (modals, sliders, etc.)
│   │   └── utils/       # Utility functions
│   └── styles/          # SCSS styles
│       └── components/  # Component styles
├── gulp/
│   ├── configs/         # Gulp configuration
│   ├── tasks/           # Gulp tasks
│   └── utils/           # Gulp utilities
├── dist/                # Build output
├── .env.development     # Development environment
├── .env.production      # Production environment
└── project.config.js    # Project paths configuration
```

---

## ⚙️ Configuration

### Environment Files

Configure your environment in `.env.development` and `.env.production`:

```env
# Server port (default: 3000)
PORT=3000
```

### Project Config

All paths and folder names are configured in `project.config.js`:

```js
export const folders = {
  build: 'dist',
  src: 'src',
  styles: 'styles',
  scripts: 'scripts',
  // ...
};
```

---

## 📜 Available Scripts

| Command               | Description                  |
| --------------------- | ---------------------------- |
| `pnpm start`          | Start development server     |
| `pnpm build:dev`      | Build for development        |
| `pnpm build:prod`     | Build for production         |
| `pnpm build:analyze`  | Build with size analysis     |
| `pnpm lint`           | Run all linters              |
| `pnpm lint:js`        | Lint JavaScript/TypeScript   |
| `pnpm lint:css`       | Lint styles                  |
| `pnpm format`         | Format code with Prettier    |
| `pnpm tailwind:setup` | Setup Tailwind CSS           |
| `pnpm clean:cache`    | Clear cache                  |
| `pnpm clean:all`      | Full project cleanup         |

---

## ⚙️ Build Configuration

All build options are configured in `gulp/configs/config.js`:

```js
export const config = {
  // WebP/AVIF generation
  images: {
    webp: { enabled: true, quality: 80 },
    avif: { enabled: true, quality: 50 },
  },

  // SVG Sprite mode: 'symbol' | 'stack' | 'both'
  sprite: { mode: 'symbol' },

  // TypeScript support
  typescript: { enabled: false },

  // Compression
  compression: {
    gzip: { enabled: true },
    brotli: { enabled: true },
  },

  // SEO files
  seo: {
    sitemap: { enabled: false, hostname: 'https://example.com' },
    robots: { enabled: false },
  },
};
```

---

## 📝 License

ISC © [HolyMolly](https://github.com/hHolyMolly)
