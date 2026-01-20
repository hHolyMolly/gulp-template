import { bodyLock, bodyUnLock } from '../utils/body_lock.js';

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

class Modal {
  constructor() {
    this.wrapper = document.querySelector(SELECTORS.wrapper);
    if (!this.wrapper) return;

    this.speed = Number(this.wrapper.dataset.popupSpeed) || 500;
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
