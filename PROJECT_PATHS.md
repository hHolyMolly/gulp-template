# 📁 Project Paths Configuration

## Единый источник истины для всех путей проекта

Все пути и имена папок/файлов хранятся в одном месте: **[project.config.js](project.config.js)**

---

## 🎯 Что внутри

### 1. **folders** - Имена папок

```javascript
export const folders = {
  build: 'dist',
  src: 'src',
  styles: 'styles',
  scripts: 'scripts',
  // ...
};
```

### 2. **extensions** - Расширения файлов

```javascript
export const extensions = {
  styles: '{css,scss}',
  scripts: 'js',
  images: '{jpg,jpeg,png,svg,gif,ico,webp}',
  // ...
};
```

### 3. **files** - Имена конкретных файлов

```javascript
export const files = {
  tailwindConfig: 'tailwind.config.js',
  tailwindCSS: 'tailwind.css',
  // ...
};
```

### 4. **paths** - Вычисляемые пути

```javascript
export const paths = {
  srcStyles: 'src/styles',
  buildStyles: 'dist/styles',
  // ...
};
```

### 5. **globs** - Готовые glob-паттерны

```javascript
export const globs = {
  styles: 'src/styles/**/*.{css,scss}',
  images: 'src/assets/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}',
  // ...
};
```

### 6. **Helper функции**

```javascript
getSrc('styles', 'main.scss'); // → 'src/styles/main.scss'
getBuild('css'); // → 'dist/css'
getGlob('images'); // → ready glob pattern
exclude('pattern'); // → '!pattern'
```

---

## 🔧 Как переименовать папку

**Пример:** Переименовать `styles` → `css`

### Шаг 1: Обновить `project.config.js`

```javascript
export const folders = {
  styles: 'css', // ← изменить здесь
  // ...
};
```

### Шаг 2: Переименовать физическую папку

```bash
mv src/styles src/css
```

### ✅ Готово!

Все пути и glob-паттерны автоматически обновятся везде!

---

## 📦 Структура зависимостей

```
project.config.js (единственный источник истины)
    ↓
    ├─→ gulp/configs/paths.js (для gulp tasks)
    │       ↓
    │       └─→ все gulp tasks (используют globs)
    │
    └─→ .template/setup/tailwind/config.js (для setup)
            ↓
            └─→ .template/setup/tailwind/setup.js
```

---

## 🚀 Использование в коде

### Было (многословно)

```javascript
gulp.watch(`${paths.srcStyles}/**/*.{css,scss}`, styles);
gulp.watch(`${paths.srcScripts}/**/*.js`, scripts);
gulp.watch([`${paths.srcAssets}/**/*`, `!${paths.srcImages}/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`], assets);
```

### Стало (лаконично)

```javascript
const { globs: g } = paths;

gulp.watch(g.styles, styles);
gulp.watch(g.scripts, scripts);
gulp.watch(g.assets, assets);
```

### В Gulp tasks

```javascript
// Вместо длинного пути
app.gulp.src(`${app.paths.srcImages}/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`);

// Используем готовый glob
app.gulp.src(app.paths.globs.images);
```

### Helper функции

```javascript
// Построить путь
getSrc('components', 'button.html'); // → 'src/components/button.html'
getBuild('assets', 'sprite.svg'); // → 'dist/assets/sprite.svg'

// Исключить паттерн
exclude('**/_*.html'); // → '!**/_*.html'

// Получить готовый glob
getGlob('styles'); // → 'src/styles/**/*.{css,scss}'
```

---

## 🎨 Доступные globs

| Glob             | Паттерн                                               |
| ---------------- | ----------------------------------------------------- |
| `globs.html`     | `src/html/**/*.html`                                  |
| `globs.styles`   | `src/styles/**/*.{css,scss}`                          |
| `globs.scripts`  | `src/scripts/**/*.js`                                 |
| `globs.images`   | `src/assets/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}` |
| `globs.icons`    | `src/assets/icons/**/*.svg`                           |
| `globs.assets`   | Все assets кроме images и icons (массив)              |
| `globs.tailwind` | Tailwind config и CSS (массив)                        |

---

## 💡 Преимущества

✅ **Нет дублирования** - все в одном месте  
✅ **Нет хардкода** - расширения файлов тоже централизованы  
✅ **Готовые паттерны** - не нужно писать глобы вручную  
✅ **Короткий код** - `g.styles` вместо длинного пути  
✅ **Helper функции** - удобное построение путей  
✅ **Легкий рефакторинг** - одна строка → все обновлено  
✅ **Типобезопасность** - меньше ошибок в путях

---

## ⚠️ Важно

**Никогда не используйте хардкод:**

- ❌ `'src/styles/**/*.css'`
- ❌ `'dist/scripts'`
- ❌ `'*.{jpg,png}'`

**Всегда используйте config:**

- ✅ `paths.globs.styles`
- ✅ `paths.buildScripts`
- ✅ `paths.extensions.images`
