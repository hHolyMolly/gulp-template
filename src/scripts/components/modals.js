import { bodyLock, bodyUnLock } from '../utils/bodyLock.js';

const SELECTORS = {
  wrapper: '#modal-wrapper',
  popup: '.popup',
  body: '.popup__body',
  trigger: '[data-popup]',
  close: '[data-popup-close]',
};

const CLASSES = {
  active: 'is-active',
};

/**
 * Get transition duration from CSS custom property or computed style
 * @param {HTMLElement} element - Element to get transition from
 * @param {string} cssVar - CSS variable name (e.g., '--popup-speed')
 * @returns {number} Duration in milliseconds (0 if not defined in CSS)
 */
const getTransitionDuration = (element, cssVar = '--popup-speed') => {
  if (!element) return 0;

  const styles = getComputedStyle(element);

  // First try to get from CSS variable
  const cssVarValue = styles.getPropertyValue(cssVar).trim();
  if (cssVarValue) {
    const parsed = parseFloat(cssVarValue);
    // If value is in seconds (< 10), convert to ms
    return parsed < 10 ? parsed * 1000 : parsed;
  }

  // Fallback to computed transition-duration
  const transitionDuration = styles.transitionDuration;
  if (transitionDuration && transitionDuration !== '0s') {
    const parsed = parseFloat(transitionDuration);
    return parsed * 1000;
  }

  // Return 0 if no CSS transition defined
  return 0;
};

class Modal {
  constructor() {
    this.wrapper = document.querySelector(SELECTORS.wrapper);
    if (!this.wrapper) return;

    // Speed from CSS variable --popup-speed
    this.speed = getTransitionDuration(this.wrapper);
    this.isLocked = false;

    this.init();
  }

  init() {
    document.addEventListener('click', this.handleClick.bind(this));
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  handleClick(e) {
    const trigger = e.target.closest(SELECTORS.trigger);
    const closeBtn = e.target.closest(SELECTORS.close);

    if (trigger) {
      e.preventDefault();
      const popupId = trigger.dataset.popup;
      const popup = document.getElementById(popupId);
      if (popup) this.open(popup);
      return;
    }

    if (closeBtn) {
      const popup = closeBtn.closest(SELECTORS.popup);
      if (popup) this.close(popup);
      return;
    }

    const activePopup = e.target.closest(SELECTORS.popup);
    if (activePopup && !e.target.closest(SELECTORS.body)) {
      this.close(activePopup);
    }
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      const activePopup = document.querySelector(`${SELECTORS.popup}.${CLASSES.active}`);
      if (activePopup) this.close(activePopup);
    }
  }

  open(popup) {
    if (!popup || this.isLocked) return;

    const activePopup = document.querySelector(`${SELECTORS.popup}.${CLASSES.active}`);

    if (activePopup) {
      this.close(activePopup, false);
    } else {
      bodyLock();
    }

    popup.classList.add(CLASSES.active);
  }

  close(popup, unlock = true) {
    if (!popup || this.isLocked) return;

    popup.classList.remove(CLASSES.active);

    if (unlock) {
      bodyUnLock(this.speed);
    }
  }
}

export default new Modal();
