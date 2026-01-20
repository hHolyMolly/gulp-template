export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, wait = 300) {
  let isThrottled = false;
  let savedArgs = null;

  function wrapper(...args) {
    if (isThrottled) {
      savedArgs = args;
      return;
    }

    func(...args);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (savedArgs) {
        wrapper(...savedArgs);
        savedArgs = null;
      }
    }, wait);
  }

  return wrapper;
}
