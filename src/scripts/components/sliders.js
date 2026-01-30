/* global Swiper */

const sliderConfigs = {
  '.swiper': {
    grabCursor: true,
    speed: 500,
    spaceBetween: 15,
    slidesPerView: 1,
    watchOverflow: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  },
};

class Sliders {
  constructor() {
    this.instances = new Map();
    this.init();
  }

  init() {
    // Check if Swiper is available
    if (typeof Swiper === 'undefined') {
      console.warn('[Sliders] Swiper is not loaded. Include Swiper library to use sliders.');
      return;
    }

    Object.entries(sliderConfigs).forEach(([selector, config]) => {
      const sliders = document.querySelectorAll(selector);
      if (!sliders.length) return;

      sliders.forEach((slider, index) => {
        const wrapper = slider.querySelector('.swiper-wrapper');
        const slidesCount = wrapper ? wrapper.children.length : 0;

        if (slidesCount < 1) return;

        try {
          const instance = new Swiper(slider, {
            loop: slidesCount > 1,
            ...config,
          });

          this.instances.set(`${selector}-${index}`, instance);
        } catch (error) {
          console.error(`[Sliders] Failed to initialize slider "${selector}":`, error);
        }
      });
    });
  }

  get(selector, index = 0) {
    return this.instances.get(`${selector}-${index}`);
  }

  destroy(selector, index = 0) {
    const instance = this.get(selector, index);
    if (instance) {
      instance.destroy();
      this.instances.delete(`${selector}-${index}`);
    }
  }

  destroyAll() {
    this.instances.forEach((instance) => instance.destroy());
    this.instances.clear();
  }
}

export default new Sliders();
