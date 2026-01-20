# gulp-template

Современный шаблон для разработки на Gulp с поддержкой SVG sprites, UI компонентов и гибкой конфигурацией.

## Возможности

- BrowserSync - hot reload
- Tailwind CSS - быстрое подключение через CDN
- SVG Sprites - автоматическая генерация
- UI компоненты - готовая система
- SCSS с компиляцией и минификацией
- Минификация по переменной через .env
- File Include - модульная структура HTML

---

## Установка и запуск

```bash
# Установка зависимостей
pnpm install

# Dev-сервер (http://localhost:5555)
pnpm start

# Сборка
pnpm run build:dev   # без минификации
pnpm run build:prod  # с минификацией
```

---

## Конфигурация

### Файлы .env

`.env.development`:

```env
PORT=5555
MINIFY_HTML=false
```

`.env.production`:

```env
PORT=5555
MINIFY_HTML=true
```

### Централизованный конфиг

Все переменные собраны в `gulp/configs/config.js`:

```javascript
export const config = {
  port: parseInt(process.env.PORT) || 5555,
  minifyHTML: process.env.MINIFY_HTML === 'true',
  minifyCSS: process.env.MINIFY_CSS !== 'false',
  minifyJS: process.env.MINIFY_JS !== 'false',
  isDev: process.env.NODE_ENV !== 'production',
  isProd: process.env.NODE_ENV === 'production',
};
```

---

## Tailwind CSS

### Установка

```bash
pnpm run tailwind:setup
```

Скрипт автоматически:

1. Установит `tailwindcss@3.4.17`
2. Создаст `tailwind.config.js`
3. Создаст `src/styles/tailwind.css`
4. Добавит `<!-- TAILWIND_CDN -->` в `_head.html`

### Использование

```html
<div class="flex items-center justify-center bg-blue-500 p-4 rounded-lg">
  <h1 class="text-4xl font-bold text-white">Hello Tailwind</h1>
</div>
```

---

## SVG Sprites

### Как использовать

1. Положите SVG файлы в `src/assets/icons/`

```
src/assets/icons/
├── arrow.svg
├── close.svg
├── menu.svg
└── search.svg
```

2. При сборке автоматически создается `dist/assets/sprite.svg`

3. Вставляйте иконки через `<use>`:

```html
<!-- Иконка arrow -->
<svg class="icon" width="24" height="24">
  <use xlink:href="./assets/sprite.svg#arrow"></use>
</svg>

<!-- Иконка menu -->
<svg class="icon" width="32" height="32">
  <use xlink:href="./assets/sprite.svg#menu"></use>
</svg>
```

4. Стили для иконок:

```css
.icon {
  fill: currentColor; /* наследует цвет от родителя */
}

/* Или конкретный цвет */
.icon-primary {
  fill: #3b82f6;
}
```

### Важно

- Имя файла = ID иконки (`arrow.svg` → `#arrow`)
- Удалите `fill` и `stroke` из SVG для управления цветом через CSS
- Спрайт пересобирается автоматически при изменении файлов

---

## UI Компоненты

### Button

```html
@@include('ui/button/button.html', { "text": "Нажми меня", "modifier": "btn--primary" }) @@include('ui/button/button.html', { "text": "Submit", "modifier": "btn--success btn--lg",
"attributes": "type='submit'" })
```

Модификаторы:

- `btn--primary`, `btn--secondary`, `btn--success`, `btn--danger`
- `btn--outline`
- `btn--sm`, `btn--lg`

### Создание компонента

```
src/html/ui/my-component/
├── my-component.html
├── my-component.scss
├── my-component.js (опционально)
└── README.md
```

Импорт стилей в `main.scss`:

```scss
@import '../html/ui/my-component/my-component.scss';
```

---

## Структура проекта

```
gulp-template/
├── src/
│   ├── html/
│   │   ├── index.html
│   │   ├── components/     # _head, _header, _footer
│   │   └── ui/             # UI компоненты
│   ├── styles/
│   │   └── main.scss
│   ├── scripts/
│   │   └── app.js
│   └── assets/
│       ├── icons/          # SVG для спрайтов
│       └── img/
├── gulp/
│   ├── configs/
│   │   ├── paths.js
│   │   ├── plugins.js
│   │   └── config.js       # Централизованный конфиг
│   ├── tasks/
│   └── tailwind-setup.js   # Скрипт установки Tailwind
├── .env.development
├── .env.production
└── gulpfile.js
```

---

## Команды

```bash
pnpm start              # Dev режим с watch
pnpm run build:dev      # Сборка для разработки
pnpm run build:prod     # Production сборка
pnpm run tailwind:setup # Установить Tailwind CSS
pnpm run clean          # Очистка проекта
```
