# Button Component

## Использование

### Основной синтаксис

```html
@@include('ui/button/button.html', { "text": "Нажми меня", "modifier": "btn-primary", "attributes": "" })
```

### Параметры

- `text` - текст кнопки (обязательно)
- `modifier` - классы модификаторы (опционально)
- `attributes` - дополнительные HTML атрибуты (опционально)

### Примеры

#### Основные стили

```html
<!-- Primary -->
@@include('ui/button/button.html', { "text": "Primary Button", "modifier": "btn-primary" })

<!-- Secondary -->
@@include('ui/button/button.html', { "text": "Secondary Button", "modifier": "btn-secondary" })

<!-- Success -->
@@include('ui/button/button.html', { "text": "Success Button", "modifier": "btn-success" })

<!-- Danger -->
@@include('ui/button/button.html', { "text": "Danger Button", "modifier": "btn-danger" })
```

#### Размеры

```html
<!-- Small -->
@@include('ui/button/button.html', { "text": "Small", "modifier": "btn-primary btn-sm" })

<!-- Large -->
@@include('ui/button/button.html', { "text": "Large", "modifier": "btn-primary btn-lg" })
```

#### Outline стиль

```html
@@include('ui/button/button.html', { "text": "Outline", "modifier": "btn-outline btn-primary" })
```

#### С атрибутами

```html
@@include('ui/button/button.html', { "text": "Disabled", "modifier": "btn-primary", "attributes": "disabled" }) @@include('ui/button/button.html', { "text": "With ID", "modifier":
"btn-success", "attributes": "id='my-button' data-action='submit'" })
```

## Кастомизация стилей

Отредактируйте `button.scss` для изменения стилей:

```scss
.btn {
  // Ваши стили
}
```

## JavaScript функционал

Для инициализации ripple эффекта импортируйте в `app.js`:

```javascript
import { initButtons } from '@/html/ui/button/button.js';

document.addEventListener('DOMContentLoaded', () => {
  initButtons();
});
```

## Добавление в проект

1. Импортируйте стили в `main.scss`:

```scss
@import '../html/ui/button/button.scss';
```

2. Используйте в любом HTML файле через `@@include`
