// The About shortcut previews the internship without leaving the current page.
(() => {
  const header = document.querySelector('.floating-header');
  const trigger = header?.querySelector('[data-about-trigger]');
  const panel = header?.querySelector('#about-preview');
  if (!header || !trigger || !panel) return;
  const compact = matchMedia('(max-width:900px)');
  let openTimer = null, closeTimer = null;

  function cancelOpen() {
    if (openTimer !== null) clearTimeout(openTimer);
    openTimer = null;
  }
  function cancelClose() {
    if (closeTimer !== null) clearTimeout(closeTimer);
    closeTimer = null;
  }
  function setOpen(open) {
    cancelOpen();
    cancelClose();
    open = open && !compact.matches;
    if (open) header.dispatchEvent(new CustomEvent('portfolio:preview-open', {detail: {id: panel.id}}));
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    header.classList.toggle('about-preview-open', open);
    if (open) header.classList.remove('is-scroll-hidden');
  }
  function scheduleClose() {
    cancelClose();
    closeTimer = setTimeout(() => {
      closeTimer = null;
      if (header.matches(':hover') || header.querySelector(':focus-visible')) return;
      setOpen(false);
    }, 220);
  }

  trigger.addEventListener('pointermove', event => {
    if (!panel.hidden || compact.matches || openTimer !== null || event.pointerType === 'touch' ||
        Math.abs(event.movementX || 0) + Math.abs(event.movementY || 0) < 1) return;
    openTimer = setTimeout(() => {
      openTimer = null;
      if (trigger.matches(':hover')) setOpen(true);
    }, 160);
  });
  trigger.addEventListener('pointerleave', cancelOpen);
  // Clicking keeps the About link working; hover and ArrowDown open the preview.
  trigger.addEventListener('click', () => setOpen(false));
  trigger.addEventListener('keydown', event => {
    if (compact.matches) return;
    if (event.key === 'ArrowDown' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
      panel.querySelector('.about-preview-link')?.focus({preventScroll: true});
    }
  });
  header.addEventListener('pointerenter', cancelClose);
  header.addEventListener('pointerleave', scheduleClose);
  panel.addEventListener('pointerenter', cancelClose);
  panel.addEventListener('pointerleave', scheduleClose);
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) setOpen(false);
  });
  header.querySelectorAll('.nav-item:not([data-about-trigger]),.theme-toggle,.contact-pill').forEach(link => {
    link.addEventListener('pointerenter', () => setOpen(false));
  });
  panel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  header.addEventListener('portfolio:preview-open', event => {
    if (event.detail?.id !== panel.id) setOpen(false);
  });
  document.addEventListener('pointerdown', event => {
    if (!panel.hidden && !header.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || panel.hidden) return;
    const focusWasInside = panel.contains(document.activeElement);
    setOpen(false);
    if (focusWasInside) trigger.focus({preventScroll: true});
  });
  window.addEventListener('resize', () => {
    if (compact.matches) setOpen(false);
  });
})();
