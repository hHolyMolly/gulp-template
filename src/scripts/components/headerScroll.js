const SELECTORS = {
  header: '.header',
};

const CLASSES = {
  scrolled: 'is-scroll',
};

class HeaderScroll {
  constructor(selector = SELECTORS.header) {
    this.header = document.querySelector(selector);
    if (!this.header) return;

    this.observer = null;
    this.init();
  }

  init() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.header.classList.toggle(CLASSES.scrolled, !entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );

    this.observer.observe(this.header);
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.header?.classList.remove(CLASSES.scrolled);
  }
}

export { HeaderScroll };
export default new HeaderScroll();
