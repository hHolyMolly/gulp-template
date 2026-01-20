const SELECTORS = {
  container: '[data-spollers]',
  trigger: '[data-spoller]',
};

const CLASSES = {
  init: '_init',
  active: 'is-active',
  sliding: '_slide',
};

class Spollers {
  constructor() {
    this.speed = 500;
    this.containers = document.querySelectorAll(SELECTORS.container);
    if (!this.containers.length) return;

    this.init();
  }

  init() {
    this.containers.forEach((container) => {
      const config = container.dataset.spollers;
      const isOneSpoller = container.hasAttribute('data-one-spoller');

      if (!config) {
        this.activate(container, isOneSpoller);
      } else {
        const [breakpoint, type = 'max'] = config.split(',').map((s) => s.trim());
        const mediaQuery = window.matchMedia(`(${type}-width: ${breakpoint}px)`);

        const handleChange = () => {
          if (mediaQuery.matches) {
            this.activate(container, isOneSpoller);
          } else {
            this.deactivate(container);
          }
        };

        mediaQuery.addEventListener('change', handleChange);
        handleChange();
      }
    });
  }

  activate(container, isOneSpoller) {
    container.classList.add(CLASSES.init);

    const triggers = container.querySelectorAll(SELECTORS.trigger);
    triggers.forEach((trigger) => {
      const content = trigger.nextElementSibling;
      if (!trigger.classList.contains(CLASSES.active) && content) {
        content.hidden = true;
      }
    });

    container.addEventListener('click', (e) => this.handleClick(e, isOneSpoller));
  }

  deactivate(container) {
    container.classList.remove(CLASSES.init);

    const triggers = container.querySelectorAll(SELECTORS.trigger);
    triggers.forEach((trigger) => {
      const content = trigger.nextElementSibling;
      if (content) content.hidden = false;
    });
  }

  handleClick(e, isOneSpoller) {
    const trigger = e.target.closest(SELECTORS.trigger);
    if (!trigger) return;

    const container = trigger.closest(SELECTORS.container);
    if (container.querySelector(`.${CLASSES.sliding}`)) return;

    if (isOneSpoller && !trigger.classList.contains(CLASSES.active)) {
      const activeTrigger = container.querySelector(`${SELECTORS.trigger}.${CLASSES.active}`);
      if (activeTrigger) this.toggle(activeTrigger);
    }

    this.toggle(trigger);
  }

  toggle(trigger) {
    const content = trigger.nextElementSibling;
    if (!content) return;

    trigger.classList.toggle(CLASSES.active);

    if (trigger.classList.contains(CLASSES.active)) {
      this.slideDown(content);
    } else {
      this.slideUp(content);
    }
  }

  slideDown(element) {
    element.hidden = false;
    element.classList.add(CLASSES.sliding);
    element.style.height = '0';
    element.style.overflow = 'hidden';
    element.style.transition = `height ${this.speed}ms ease`;

    requestAnimationFrame(() => {
      element.style.height = `${element.scrollHeight}px`;
    });

    setTimeout(() => {
      element.style.removeProperty('height');
      element.style.removeProperty('overflow');
      element.style.removeProperty('transition');
      element.classList.remove(CLASSES.sliding);
    }, this.speed);
  }

  slideUp(element) {
    element.classList.add(CLASSES.sliding);
    element.style.height = `${element.scrollHeight}px`;
    element.style.overflow = 'hidden';
    element.style.transition = `height ${this.speed}ms ease`;

    requestAnimationFrame(() => {
      element.style.height = '0';
    });

    setTimeout(() => {
      element.hidden = true;
      element.style.removeProperty('height');
      element.style.removeProperty('overflow');
      element.style.removeProperty('transition');
      element.classList.remove(CLASSES.sliding);
    }, this.speed);
  }
}

export default new Spollers();
