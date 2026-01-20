export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

export function $$(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

export function exists(selector) {
  return document.querySelector(selector) !== null;
}

export function on(target, event, callback, options = {}) {
  const elements = typeof target === 'string' ? document.querySelectorAll(target) : target;

  if (elements instanceof NodeList || Array.isArray(elements)) {
    elements.forEach((el) => el.addEventListener(event, callback, options));
  } else if (elements) {
    elements.addEventListener(event, callback, options);
  }
}

export function off(target, event, callback) {
  const elements = typeof target === 'string' ? document.querySelectorAll(target) : target;

  if (elements instanceof NodeList || Array.isArray(elements)) {
    elements.forEach((el) => el.removeEventListener(event, callback));
  } else if (elements) {
    elements.removeEventListener(event, callback);
  }
}
