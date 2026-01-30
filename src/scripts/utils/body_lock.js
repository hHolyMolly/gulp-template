const body = document.body;
const lockPadding = document.querySelectorAll('.is-lock-padding');

export function bodyLock() {
  const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

  if (lockPadding) {
    lockPadding.forEach((elem) => {
      elem.style.paddingRight = lockPaddingValue;
    });
  }

  body.style.paddingRight = lockPaddingValue;
  body.classList.add('is-lock-scroll');
}

export function bodyUnLock(speed = 0) {
  setTimeout(() => {
    if (lockPadding) {
      lockPadding.forEach((elem) => {
        elem.style.paddingRight = '0px';
      });
    }

    body.style.paddingRight = '0px';
    body.classList.remove('is-lock-scroll');
  }, speed);
}
