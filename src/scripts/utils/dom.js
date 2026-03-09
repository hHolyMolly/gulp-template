export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

export function $$(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

export function exists(selector) {
  return document.querySelector(selector) !== null;
}

/**
 * Add event listener(s) to element(s)
 * @returns {Function} Cleanup function to remove all added listeners
 */
export function on(target, event, callback, options = {}) {
  const elements = typeof target === 'string' ? [...document.querySelectorAll(target)] : target;
  const list = elements instanceof NodeList ? [...elements] : Array.isArray(elements) ? elements : [elements];

  list.forEach((el) => {
    if (el) el.addEventListener(event, callback, options);
  });

  return () => {
    list.forEach((el) => {
      if (el) el.removeEventListener(event, callback, options);
    });
  };
}
