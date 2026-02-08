const SELECTORS = {
  container: '[data-spollers]',
  trigger: '[data-spoller]',
};

const CLASSES = {
  init: 'is-init',
  active: 'is-active',
  sliding: 'is-sliding',
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

      if (!config) {
        this.activate(container);
      } else {
        const [breakpoint, type = 'max'] = config.split(',').map((s) => s.trim());
        const mediaQuery = window.matchMedia(`(${type}-width: ${breakpoint}px)`);

        const handleChange = () => {
          if (mediaQuery.matches) {
            this.activate(container);
          } else {
            this.deactivate(container);
          }
        };

        mediaQuery.addEventListener('change', handleChange);
        handleChange();
      }
    });
  }

  activate(container) {
    container.classList.add(CLASSES.init);

    const triggers = container.querySelectorAll(SELECTORS.trigger);
    triggers.forEach((trigger) => {
      trigger.removeAttribute('tabindex');
      const content = trigger.nextElementSibling;
      if (!trigger.classList.contains(CLASSES.active) && content) {
        content.hidden = true;
      }
    });

    container.addEventListener('click', this._handleClick);
  }

  deactivate(container) {
    container.classList.remove(CLASSES.init);

    const triggers = container.querySelectorAll(SELECTORS.trigger);
    triggers.forEach((trigger) => {
      trigger.setAttribute('tabindex', '-1');
      const content = trigger.nextElementSibling;
      if (content) content.hidden = false;
    });

    container.removeEventListener('click', this._handleClick);
  }

  _handleClick = (e) => {
    const trigger = e.target.closest(SELECTORS.trigger);
    if (!trigger) return;

    e.preventDefault();

    const container = trigger.closest(SELECTORS.container);
    const isOneSpoller = container.hasAttribute('data-one-spoller');

    // Блокируем пока идёт анимация
    if (container.querySelectorAll(`.${CLASSES.sliding}`).length) return;

    if (isOneSpoller && !trigger.classList.contains(CLASSES.active)) {
      const activeTrigger = container.querySelector(`${SELECTORS.trigger}.${CLASSES.active}`);
      if (activeTrigger) {
        activeTrigger.classList.remove(CLASSES.active);
        this._slideUp(activeTrigger.nextElementSibling, this.speed);
      }
    }

    trigger.classList.toggle(CLASSES.active);
    this._slideToggle(trigger.nextElementSibling, this.speed);
  };

  _slideToggle(target, duration = 500) {
    if (target.hidden) {
      this._slideDown(target, duration);
    } else {
      this._slideUp(target, duration);
    }
  }

  _slideDown(target, duration = 500) {
    if (target.classList.contains(CLASSES.sliding)) return;
    target.classList.add(CLASSES.sliding);

    if (target.hidden) target.hidden = false;

    const height = target.offsetHeight;

    target.style.overflow = 'hidden';
    target.style.height = '0';
    target.style.paddingTop = '0';
    target.style.paddingBottom = '0';
    target.style.marginTop = '0';
    target.style.marginBottom = '0';
    target.offsetHeight; // reflow

    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = `${duration}ms`;
    target.style.height = `${height}px`;
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');

    setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove(CLASSES.sliding);
    }, duration);
  }

  _slideUp(target, duration = 500) {
    if (target.classList.contains(CLASSES.sliding)) return;
    target.classList.add(CLASSES.sliding);

    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = `${duration}ms`;
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight; // reflow

    target.style.overflow = 'hidden';
    target.style.height = '0';
    target.style.paddingTop = '0';
    target.style.paddingBottom = '0';
    target.style.marginTop = '0';
    target.style.marginBottom = '0';

    setTimeout(() => {
      target.hidden = true;
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove(CLASSES.sliding);
    }, duration);
  }
}

export default new Spollers();
