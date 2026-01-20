# Button Component

## Использование

### Основной синтаксис

```html
@@include('UI/button/index.html', { "text": "Нажми меня" })
```

### Параметры

- `text` - текст кнопки (обязательно)

### Примеры

```html
@@include('UI/button/index.html', { "text": "Отправить" }) @@include('UI/button/index.html', { "text": "Кнопка" })
@@include('UI/button/index.html', { "text": "Нажми меня" })
```

## Кастомизация стилей

Отредактируйте `index.scss` для изменения стилей:

```scss
.button-template {
  // Ваши стили
}
```

## Добавление в проект

Импортируйте стили в `main.scss`:

```scss
@import '../html/UI/button/index.scss';
```

Используйте в любом HTML файле через `@@include`.
