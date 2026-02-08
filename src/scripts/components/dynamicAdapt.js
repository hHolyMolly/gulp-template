/**
 * Dynamic Adapt
 *
 * Перемещает элементы в DOM при указанном брейкпоинте.
 *
 * Формат: data-da="селектор, брейкпоинт, [...опции]"
 *   селектор   — CSS-селектор контейнера назначения (обязательный)
 *   брейкпоинт — ширина в px (по умолчанию 767)
 *   опции      — порядок НЕ важен, автоопределение:
 *     min | max            → тип брейкпоинта (по умолчанию max)
 *     first | last | число → позиция в контейнере (по умолчанию last)
 *
 * Примеры:
 *   data-da=".footer, 768"              → в конец .footer при ≤768px
 *   data-da=".sidebar, 1024, first"     → в начало .sidebar при ≤1024px
 *   data-da=".nav, 768, min"            → в конец .nav при ≥768px
 *   data-da=".nav, 768, min, first"     → в начало .nav при ≥768px
 *   data-da=".nav, 768, first, min"     → то же самое (порядок не важен)
 *   data-da=".target, 480, 2"           → перед 3-м дочерним при ≤480px
 */

const SELECTOR = '[data-da]';
const CLASS_NAME = '_dynamic_adapt_';

class DynamicAdapt {
  constructor() {
    this.objects = [];
    this.nodes = document.querySelectorAll(SELECTOR);

    if (!this.nodes.length) return;

    this.init();
  }

  /**
   * Парсит параметры из data-da с автоопределением типа и позиции.
   */
  _parseOptions(data) {
    const parts = data.split(',').map((s) => s.trim());
    const destination = parts[0];
    const breakpoint = parts[1] || '767';

    let place = 'last';
    let type = 'max';

    // Остальные параметры — автоопределение по значению
    for (let idx = 2; idx < parts.length; idx++) {
      const val = parts[idx];

      if (val === 'min' || val === 'max') {
        type = val;
      } else if (val === 'first' || val === 'last') {
        place = val;
      } else if (!isNaN(val) && val !== '') {
        place = val;
      }
    }

    return { destination, breakpoint, place, type };
  }

  init() {
    this.nodes.forEach((node) => {
      const data = node.dataset.da.trim();
      const { destination, breakpoint, place, type } = this._parseOptions(data);

      this.objects.push({
        element: node,
        parent: node.parentNode,
        destination: document.querySelector(destination),
        breakpoint,
        place,
        type,
        idx: this.getIndex(node.parentNode, node),
      });
    });

    // Группируем по уникальным комбинациям "тип + брейкпоинт"
    const groups = new Map();

    this.objects.forEach((obj) => {
      const key = `${obj.type}-${obj.breakpoint}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(obj);
    });

    // Сортируем внутри каждой группы
    groups.forEach((items) => {
      const type = items[0].type;
      items.sort((a, b) => (type === 'min' ? a.breakpoint - b.breakpoint : b.breakpoint - a.breakpoint));
    });

    // Создаём медиа-слушатели
    groups.forEach((items, key) => {
      const type = key.split('-')[0];
      const bp = key.split('-').slice(1).join('-');
      const mediaQuery = window.matchMedia(`(${type}-width: ${bp}px)`);

      const handleChange = () => this.handleMedia(mediaQuery, items);
      mediaQuery.addEventListener('change', handleChange);
      handleChange();
    });
  }

  handleMedia(mediaQuery, objects) {
    if (mediaQuery.matches) {
      objects.forEach((obj) => {
        obj.idx = this.getIndex(obj.parent, obj.element);
        this.moveTo(obj);
      });
    } else {
      objects.forEach((obj) => {
        if (obj.element.classList.contains(CLASS_NAME)) {
          this.moveBack(obj);
        }
      });
    }
  }

  moveTo(obj) {
    const { element, destination, place } = obj;
    if (!destination) return;

    element.classList.add(CLASS_NAME);

    if (place === 'last' || Number(place) >= destination.children.length) {
      destination.appendChild(element);
    } else if (place === 'first') {
      destination.prepend(element);
    } else {
      destination.children[place].before(element);
    }
  }

  moveBack(obj) {
    const { element, parent, idx } = obj;

    element.classList.remove(CLASS_NAME);

    if (parent.children[idx]) {
      parent.children[idx].before(element);
    } else {
      parent.appendChild(element);
    }
  }

  getIndex(parent, element) {
    return [...parent.children].indexOf(element);
  }
}

export default new DynamicAdapt();
