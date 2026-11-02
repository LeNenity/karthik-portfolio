// Hide on downward scroll; restore on upward scroll or after scrolling stops.
(() => {
  const header = document.querySelector('.floating-header');
  if (!header) return;
  const position = () => Math.max(0, Math.min(window.scrollY,
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight)));
  let previous = position(), direction = 0, distance = 0, scheduled = false;
  let idleTimer = null;

  function show() {
    header.classList.remove('is-scroll-hidden');
  }

  function update() {
    scheduled = false;
    const current = position();
    const delta = current - previous;
    previous = current;
    if (current <= 100 || document.body.classList.contains('menu-open') ||
        header.querySelector('.nav-preview:not([hidden])') ||
        header.querySelector(':focus-visible')) {
      show();
      distance = 0;
      direction = 0;
      return;
    }
    if (!delta) return;
    const nextDirection = Math.sign(delta);
    if (nextDirection !== direction) distance = 0;
    direction = nextDirection;
    distance += Math.abs(delta);
    if (direction > 0 && distance >= 20) header.classList.add('is-scroll-hidden');
    if (direction < 0 && distance >= 8) show();
  }

  window.addEventListener('scroll', () => {
    if (idleTimer !== null) clearTimeout(idleTimer);
    idleTimer = setTimeout(reset, 650);
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }, {passive: true});
  function reset() {
    if (idleTimer !== null) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
    previous = position();
    direction = 0;
    distance = 0;
    show();
  }
  header.addEventListener('focusin', reset);
  window.addEventListener('hashchange', reset);
  window.addEventListener('pageshow', reset);
  window.addEventListener('resize', reset);
})();
