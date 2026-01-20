const SELECTOR = '[data-da]';
const CLASS_NAME = '_dynamic_adapt_';

class DynamicAdapt {
  constructor(type = 'max') {
    this.type = type;
    this.objects = [];
    this.nodes = document.querySelectorAll(SELECTOR);

    if (!this.nodes.length) return;

    this.init();
  }

  init() {
    this.nodes.forEach((node) => {
      const data = node.dataset.da.trim();
      const [destination, breakpoint = '767', place = 'last'] = data.split(',').map((s) => s.trim());

      this.objects.push({
        element: node,
        parent: node.parentNode,
        destination: document.querySelector(destination),
        breakpoint,
        place,
        index: this.getIndex(node.parentNode, node),
      });
    });

    this.objects.sort((a, b) => {
      return this.type === 'min' ? a.breakpoint - b.breakpoint : b.breakpoint - a.breakpoint;
    });

    const breakpoints = [...new Set(this.objects.map((o) => o.breakpoint))];

    breakpoints.forEach((bp) => {
      const mediaQuery = window.matchMedia(`(${this.type}-width: ${bp}px)`);
      const filtered = this.objects.filter((o) => o.breakpoint === bp);

      const handleChange = () => this.handleMedia(mediaQuery, filtered);
      mediaQuery.addEventListener('change', handleChange);
      handleChange();
    });
  }

  handleMedia(mediaQuery, objects) {
    if (mediaQuery.matches) {
      objects.forEach((obj) => {
        obj.index = this.getIndex(obj.parent, obj.element);
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
    const { element, parent, index } = obj;

    element.classList.remove(CLASS_NAME);

    if (parent.children[index]) {
      parent.children[index].before(element);
    } else {
      parent.appendChild(element);
    }
  }

  getIndex(parent, element) {
    return [...parent.children].indexOf(element);
  }
}

export default new DynamicAdapt('max');
