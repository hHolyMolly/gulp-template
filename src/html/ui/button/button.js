// Button component scripts
export function initButtons() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach((button) => {
    // Добавляем ripple эффект
    button.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('btn-ripple');

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Инициализация при загрузке DOM
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initButtons);
}
