// A small shared footer interaction: back-to-top + the original text scramble.
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const backToTop = document.getElementById('footer-back-to-top');
  backToTop?.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: reduceMotion.matches ? 'instant' : 'smooth'});
  });

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  document.querySelectorAll('[data-footer-scramble]').forEach(element => {
    const label = element.querySelector('.footer-scramble-text');
    if (!label) return;
    const original = label.textContent;
    let animation = 0;
    let start = 0;

    const reset = () => {
      cancelAnimationFrame(animation);
      animation = 0;
      label.textContent = original;
    };
    element.addEventListener('pointerenter', event => {
      if (reduceMotion.matches || event.pointerType === 'touch') return;
      reset();
      const animate = now => {
        if (!start) start = now;
        const revealed = Math.floor(((now - start) / 520) * original.length);
        label.textContent = Array.from(original, (letter, index) => {
          if (/[ .·]/.test(letter) || index < revealed) return letter;
          return alphabet[Math.floor(Math.random() * alphabet.length)];
        }).join('');
        if (revealed < original.length) animation = requestAnimationFrame(animate);
        else reset();
      };
      start = 0;
      animation = requestAnimationFrame(animate);
    });
    element.addEventListener('pointerleave', reset);
    element.addEventListener('blur', reset);
  });
})();
