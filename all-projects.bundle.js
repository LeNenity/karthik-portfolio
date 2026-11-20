
;
/* START scripts/pages/all-projects.js */
(()=>{
  const search=document.getElementById('ap-search-input');
  const clearSearch=document.getElementById('ap-search-clear');
  const searchShortcut=document.getElementById('ap-search-shortcut');
  const filters=[...document.querySelectorAll('.ap-filter')];
  const cards=[...document.querySelectorAll('.ap-card')].map(card=>({
    card,
    text:`${card.querySelector('.ap-card-title').textContent} ${card.dataset.search}`.toLocaleLowerCase()
  }));
  const count=document.getElementById('ap-results');
  const empty=document.getElementById('ap-empty');
  let selected='all';
  const galleryViewport=document.querySelector('.ap-scroll-region');
  function refresh(){
    const terms=search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    clearSearch.hidden=search.value.length===0;
    searchShortcut.hidden=!clearSearch.hidden;
    let hits=0;
    for(const {card,text} of cards){
      const visible=(selected==='all'||card.dataset.category===selected)&&terms.every(term=>text.includes(term));
      card.hidden=!visible;
      if(visible)hits++;
    }
    empty.hidden=hits!==0;
    if(galleryViewport)galleryViewport.hidden=hits===0;
    count.textContent=`Showing ${hits} ${hits===1?'project':'projects'}`;
    filters.forEach(button=>{
      const active=button.dataset.filter===selected;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    });
  }
  filters.forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.filter;refresh();if(galleryViewport)galleryViewport.scrollTop=0;}));
  search.addEventListener('input',()=>{refresh();if(galleryViewport)galleryViewport.scrollTop=0;});
  clearSearch.addEventListener('click',()=>{search.value='';refresh();search.focus()});
  document.getElementById('ap-reset').addEventListener('click',()=>{search.value='';selected='all';refresh();search.focus()});
  document.addEventListener('keydown',event=>{
    if(event.key==='/'&&!event.altKey&&!event.ctrlKey&&!event.metaKey&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){
      event.preventDefault();search.focus();
    }
    if(event.key==='Escape'&&document.activeElement===search){search.value='';refresh();search.blur()}
  });
  refresh();
})();

/* END scripts/pages/all-projects.js */
;
/* START scripts/shared/footer.js */
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

/* END scripts/shared/footer.js */
;
/* START scripts/shared/navigation.js */
// The internship shortcut supports hover, keyboard focus and dismissal.
(() => {
  const header = document.querySelector('.floating-header');
  if (!header) return;
  const desktop = matchMedia('(min-width: 901px)');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const triggers = [...header.querySelectorAll('.dock .nav-item[aria-controls]')];
  let active = null;
  let openTimer = 0;
  let closeTimer = 0;

  function setPanel(menu, open) {
    const {panel, trigger} = menu;
    const rest = {opacity: 1, translate: '-50% 0', scale: '1'};
    const tucked = {opacity: 0, translate: '-50% -12px', scale: '.975'};
    const computed = panel.hidden ? null : getComputedStyle(panel);
    const initial = computed ? {opacity: computed.opacity, translate: computed.translate, scale: computed.scale} : tucked;
    menu.animation?.cancel();
    menu.animation = null;
    trigger.setAttribute('aria-expanded', String(open));
    panel.inert = !open;
    panel.classList.add('dock-animated-panel');
    panel.dispatchEvent(new CustomEvent('portfolio:preview-toggle', {detail: {open}}));
    if (reduceMotion.matches || !desktop.matches || typeof panel.animate !== "function") {
      panel.hidden = !open;
      return;
    }
    panel.hidden = false;
    const animation = panel.animate([initial, open ? rest : tucked], {
      duration: open ? 390 : 270, easing: open ? 'cubic-bezier(.22,1,.36,1)' : 'cubic-bezier(.4,0,.2,1)', fill: 'both'
    });
    menu.animation = animation;
    animation.finished.then(() => {
      if (menu.animation !== animation) return;
      panel.hidden = !open;
      menu.animation = null;
      animation.cancel();
    }, () => {});
  }

  function close() {
    clearTimeout(openTimer);
    openTimer = 0;
    clearTimeout(closeTimer);
    if (!active) return;
    const previous = active;
    active = null;
    setPanel(previous, false);
  }

  function open(menu) {
    if (!desktop.matches || menu === active) return;
    close();
    active = menu;
    header.classList.remove('is-scroll-hidden');
    setPanel(active, true);
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      if (!active?.panel.contains(document.activeElement) && !active?.panel.matches(':hover') &&
          !active?.trigger.matches(':hover')) close();
    }, 170);
  }

  for (const trigger of triggers) {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) continue;
    const menu = {trigger, panel};
    // A centered dock moves its link boxes as it opens. Only physical
    // pointer movement should trigger About's dropdown during that shift.
    trigger.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' || !desktop.matches) return;
      clearTimeout(closeTimer);
      if (active === menu || openTimer) return;
      openTimer = setTimeout(() => {
        openTimer = 0;
        if (trigger.matches(':hover')) open(menu);
      }, active || reduceMotion.matches ? 35 : 130);
    });
    trigger.addEventListener('pointerleave', () => {
      clearTimeout(openTimer);
      openTimer = 0;
      scheduleClose();
    });
    trigger.addEventListener('keydown', event => {
      if (!desktop.matches || !['ArrowDown', ' '].includes(event.key)) return;
      event.preventDefault();
      open(menu);
      panel.querySelector('a, button')?.focus({preventScroll: true});
    });
    panel.addEventListener('pointerenter', () => clearTimeout(closeTimer));
    panel.addEventListener('pointerleave', scheduleClose);
  }

  // Leave the normal destinations on the parent links and menu links intact.
  header.addEventListener('click', event => {
    if (event.target.closest('a')) close();
  });
  header.addEventListener('focusin', event => {
    if (active && event.target !== active.trigger && !active.panel.contains(event.target)) close();
  });
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) close();
  });
  document.addEventListener('pointerdown', event => {
    if (!header.contains(event.target)) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !active) return;
    const {trigger, panel} = active;
    const restoreFocus = panel.contains(document.activeElement);
    close();
    if (restoreFocus) trigger.focus({preventScroll: true});
  });
  desktop.addEventListener('change', close);
  window.addEventListener('hashchange', close);
})();

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

// Shared mobile navigation.
(() => {
  const toggle = document.getElementById('menu-toggle');
  const close = document.getElementById('menu-close');
  const menu = document.getElementById('mobile-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (!toggle || !menu || !backdrop) return;

  function show(open, restoreFocus = false) {
    menu.hidden = !open;
    backdrop.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) close?.focus({preventScroll: true});
    else if (restoreFocus) toggle.focus({preventScroll: true});
  }
  toggle.addEventListener('click', () => show(menu.hidden));
  close?.addEventListener('click', () => show(false, true));
  backdrop.addEventListener('click', () => show(false, true));
  for (const link of menu.querySelectorAll('a')) link.addEventListener('click', () => show(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) show(false, true);
  });
})();

/* END scripts/shared/navigation.js */
;
/* START scripts/home/skills.js */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const browser = document.querySelector('.skills-browser');
  if (!browser) return;

  const skills = {
    ai: {
      heading: 'AI & data',
      description: 'From exploring data to training and evaluating machine-learning models. Currently learning deeper AI topics.',
      chips: ['Machine Learning', 'scikit-learn', 'Power BI', 'Deep Learning (learning)', 'NLP (learning)', 'Computer Vision (learning)']
    },
    hardware: {
      heading: 'IoT & hardware',
      description: 'Bringing sensors and devices into software systems using hands-on prototyping.',
      chips: ['Raspberry Pi', 'Arduino', 'M5Stack', 'BLE', 'IoT', 'Sensors']
    },
    cloud: {
      heading: 'Cloud & systems',
      description: 'Deploying applications and connecting reliable cloud-backed data services.',
      chips: ['AWS Cloud', 'EC2', 'S3', 'RDS / MySQL', 'Power BI dashboards']
    }
  };
  const tabs = [...browser.querySelectorAll('.skills-tab')];
  const details = browser.querySelector('.skills-details');
  const original = details.querySelector('.skills-content');
  const panels = new Map([['code', original]]);

  for (const [name, skill] of Object.entries(skills)) {
    const panel = original.cloneNode(true);
    panel.querySelector('h3').textContent = skill.heading;
    panel.querySelector('p').textContent = skill.description;
    panel.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    const chips = panel.querySelector('.skills-chips');
    chips.replaceChildren(...skill.chips.map(value => {
      const chip = document.createElement('span');
      chip.textContent = value;
      return chip;
    }));
    panels.set(name, panel);
    details.append(panel);
  }

  const interval = 5700;
  let selected = 0;
  let visible = !('IntersectionObserver' in window);
  let lastManualChoice = -Infinity;
  let timer;

  function schedule() {
    clearTimeout(timer);
    const focused = document.activeElement;
    const focusNeedsStability = details.contains(focused) ||
      (browser.contains(focused) && focused.tagName === 'A');
    if (!visible || focusNeedsStability || document.hidden || reduce.matches) return;
    const cooldown = Math.max(0, 9000 - (performance.now() - lastManualChoice));
    timer = setTimeout(() => choose((selected + 1) % tabs.length), Math.max(interval, cooldown));
  }

  function choose(index) {
    selected = index;
    for (const [position, tab] of tabs.entries()) {
      const active = position === selected;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = panels.get(tab.dataset.skill);
      panel.classList.toggle('is-inactive', !active);
      panel.inert = !active;
    }
    details.setAttribute('aria-labelledby', tabs[selected].id);
    schedule();
  }

  for (const [index, tab] of tabs.entries()) {
    tab.addEventListener('click', () => { lastManualChoice = performance.now(); choose(index); });
    tab.addEventListener('keydown', event => {
      let next;
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          next = (index + 1) % tabs.length;
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          next = (index - 1 + tabs.length) % tabs.length;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = tabs.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      lastManualChoice = performance.now();
      choose(next);
      tabs[next].focus();
    });
  }

  browser.addEventListener('focusin', schedule);
  browser.addEventListener('focusout', () => queueMicrotask(schedule));
  document.addEventListener('visibilitychange', schedule);
  reduce.addEventListener('change', schedule);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= .35;
      schedule();
    }, {threshold: .35}).observe(browser);
  }
  choose(0);
})();


/* END scripts/home/skills.js */
;
/* START scripts/shared/experience.js */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const themeToggle = document.querySelector('.theme-toggle');
  const themeKey = 'karthik-beige-theme';
  if (themeToggle) {
    const icons = document.createElement('span');
    icons.className = 'theme-orbit';
    icons.setAttribute('aria-hidden', 'true');
    for (const name of ['moon', 'sun']) {
      const icon = document.createElement('iconify-icon');
      icon.className = 'theme-orbit-' + name;
      icon.setAttribute('icon', 'lucide:' + name);
      icons.append(icon);
    }
    themeToggle.append(icons);
    themeToggle.classList.add('has-orbit-icons');
    const themeColor = document.querySelector('meta[name="theme-color"]');
    let themeFrame;
    function applyTheme(theme) {
      if (root.dataset.theme !== theme) {
        root.classList.add('theme-sync');
        root.dataset.theme = theme;
        cancelAnimationFrame(themeFrame);
        themeFrame = requestAnimationFrame(() => {
          themeFrame = requestAnimationFrame(() => root.classList.remove('theme-sync'));
        });
      }
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeColor?.setAttribute('content', theme === 'dark' ? '#10182d' : '#f8faff');
    }
    applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
    themeToggle.addEventListener('click', () => {
      const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
      try { localStorage.setItem(themeKey, theme); } catch {}
    });
    document.getElementById('sidebar-theme-toggle')?.addEventListener('click', () => themeToggle.click());
    window.addEventListener('storage', event => {
      if (event.key === themeKey) applyTheme(event.newValue === 'dark' ? 'dark' : 'light');
    });
  }

  const titles = document.querySelectorAll('[data-title-reveal]');
  if (!reduce.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const {target, isIntersecting} of entries) {
        if (!isIntersecting) continue;
        target.classList.add('title-revealed');
        observer.unobserve(target);
      }
    }, {threshold: .2});
    titles.forEach(title => {
      if (title.hasAttribute('data-title-cursor')) {
        const cursor = document.createElement('span');
        cursor.className = 'title-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        title.append(cursor);
      }
      observer.observe(title);
    });
  }

  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  if (fine.matches && !reduce.matches) {
    for (const card of document.querySelectorAll('.ap-card, .cert-card, .about-tile, .cert-stage, .intern-workflow-card, .intern-stats > div, .skills-details, .intern-locations-grid article')) {
      card.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch' || reduce.matches) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty('--tilt-x', -y * 10 + 'deg');
        card.style.setProperty('--tilt-y', x * 12 + 'deg');
        card.style.setProperty('--light-x', (x + .5) * 100 + '%');
        card.style.setProperty('--light-y', (y + .5) * 100 + '%');
      });
      card.addEventListener('pointerleave', () => {
        for (const property of ['--tilt-x', '--tilt-y', '--light-x', '--light-y']) {
          card.style.removeProperty(property);
        }
      });
    }
  }

  const buttonLinks = '.pill-link, .contact-pill, .sidebar-cta, .internship-cta, .intern-explore, ' +
    '.project-index-link, .project-preview-open, .project-back-link, .ap-back, ' +
    '.cert-hero-link, .cert-card-cta, #cert-dialog-original';
  const imageControls = '[data-photo], [data-artwork], .project-carousel-peek, .project-sphere-enlarge, .project-sphere-title';
  for (const control of document.querySelectorAll('button, ' + buttonLinks)) {
    if (!control.matches(imageControls)) control.classList.add('depth-button');
  }

  let pressed;
  function clearPress() {
    pressed?.classList.remove('is-pressed');
    pressed = null;
  }
  document.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || !event.isPrimary) return;
    clearPress();
    pressed = event.target.closest('.depth-button:not(:disabled)');
    pressed?.classList.add('is-pressed');
  }, {passive: true});
  document.addEventListener('pointerup', event => {
    if (event.pointerType === 'touch' && event.isPrimary) clearPress();
  }, {passive: true});
  document.addEventListener('pointercancel', clearPress, {passive: true});
  window.addEventListener('pagehide', clearPress);
})();

/* END scripts/shared/experience.js */
;
