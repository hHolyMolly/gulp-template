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

    this.init();
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.header.classList.toggle(CLASSES.scrolled, !entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );

    observer.observe(this.header);
  }
}

export default new HeaderScroll();
