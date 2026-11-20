/* START scripts/pages/shared-project-chrome.js */
/* The seven project stories share the homepage header and footer from one template. */
(()=>{
  const header=document.getElementById('site-chrome-header');
  const footer=document.getElementById('site-chrome-footer');
  if(header) header.innerHTML=`
<header class="floating-header">
<button aria-controls="mobile-sidebar" aria-expanded="false" aria-label="Open menu" class="menu-toggle glass" id="menu-toggle" type="button">
<span aria-hidden="true" class="menu-bars"><span></span><span></span><span></span></span>
</button>
<nav aria-label="Main navigation" class="dock glass">
<a aria-label="Home" class="nav-item" href="index.html#home" id="nav-home"><iconify-icon aria-hidden="true" icon="lucide:house"></iconify-icon><span class="nav-label">Home</span></a>
<a aria-controls="about-preview" aria-expanded="false" aria-label="About" class="nav-item" data-about-trigger="" href="index.html#about" id="nav-about"><iconify-icon aria-hidden="true" icon="lucide:user-round"></iconify-icon><span class="nav-label">About</span></a>
<a aria-current="page" aria-label="Projects" class="nav-item" href="all-projects.html" id="nav-projects"><iconify-icon aria-hidden="true" icon="lucide:briefcase-business"></iconify-icon><span class="nav-label">Projects</span></a><a aria-label="Achievements and Certificates" class="nav-item" href="certificates.html" id="nav-awards"><iconify-icon aria-hidden="true" icon="lucide:award"></iconify-icon><span class="nav-label">Achievements</span></a>
</nav>
<button aria-label="Switch to light mode" class="theme-toggle glass" id="theme-toggle" type="button"><iconify-icon aria-hidden="true" icon="lucide:sun" id="theme-icon"></iconify-icon></button>
<a class="contact-pill" href="index.html#contact" id="header-contact"><span class="disc"><iconify-icon aria-hidden="true" icon="lucide:arrow-up-right"></iconify-icon></span>Contact me</a>
<div aria-label="Internship preview" class="nav-preview about-preview glass" hidden="" id="about-preview">
<div class="about-preview-copy">
<div class="about-preview-meta"><span>MY INTERNSHIP</span><span>APR to AUG 2024</span></div>
<h2>IoT Intern<br/><em>at iWOW Connections.</em></h2>
<p>Connected-device setup, utility-meter monitoring and on-site signal tests.</p>
<a class="internship-cta about-preview-link" href="internship.html">View my internship <iconify-icon aria-hidden="true" icon="lucide:arrow-right"></iconify-icon></a>
</div>
<figure class="about-preview-photo">
<img alt="Utility meter connected to an IoT modem during my internship testing" decoding="async" height="720" loading="lazy" fetchpriority="low" src="assets/internship-s47-preparation-display.webp" width="960"/>
<figcaption>Connected devices from my time at iWOW.</figcaption>
</figure>
</div>
</header><div class="sidebar-backdrop" hidden="" id="sidebar-backdrop"></div><aside aria-label="Sidebar navigation" class="mobile-sidebar" hidden="" id="mobile-sidebar">
<div class="sidebar-shell">
<div class="sidebar-head">
<div>
<span class="sidebar-kicker">KARTHIK</span>
<strong>Navigate the portfolio</strong>
</div>
<button aria-label="Close menu" class="sidebar-close" id="menu-close" type="button"><iconify-icon aria-hidden="true" icon="lucide:x"></iconify-icon></button>
</div>
<nav aria-label="Mobile navigation" class="sidebar-nav">
<a class="sidebar-link" href="index.html#home"><iconify-icon aria-hidden="true" icon="lucide:house"></iconify-icon><span>Home</span></a>
<a class="sidebar-link" href="index.html#about"><iconify-icon aria-hidden="true" icon="lucide:user-round"></iconify-icon><span>About</span></a>
<a class="sidebar-link" href="internship.html"><iconify-icon aria-hidden="true" icon="lucide:briefcase-business"></iconify-icon><span>Internship</span></a>
<a class="sidebar-link" href="certificates.html"><iconify-icon aria-hidden="true" icon="lucide:award"></iconify-icon><span>Achievements &amp; Certificates</span></a><a class="sidebar-link" href="all-projects.html"><iconify-icon aria-hidden="true" icon="lucide:briefcase-business"></iconify-icon><span>Projects</span></a>
<a class="sidebar-link" href="index.html#contact"><iconify-icon aria-hidden="true" icon="lucide:mail"></iconify-icon><span>Contact</span></a>
</nav>
<div class="sidebar-actions">
<button class="sidebar-theme" id="sidebar-theme-toggle" type="button"><iconify-icon aria-hidden="true" icon="lucide:sparkles"></iconify-icon><span>Switch theme</span></button>
<a class="sidebar-cta" href="index.html#contact">Contact me <iconify-icon aria-hidden="true" icon="lucide:arrow-up-right"></iconify-icon></a>
</div>
</div>
</aside>
`;
  if(footer) footer.innerHTML=`
<footer aria-label="Portfolio footer" class="site-footer footer-compact">
<div class="frame footer-minimal">
<a aria-label="Karthik, home" class="footer-wordmark" data-footer-scramble="" href="index.html#home"><span aria-hidden="true" class="footer-scramble-text">Karthik.</span></a>
<p class="footer-credit">Palaniappan Alagu Karthik · Portfolio 2026</p>
<button aria-label="Back to top" class="footer-back-to-top" data-footer-scramble="" id="footer-back-to-top" type="button">
<span aria-hidden="true" class="footer-scramble-text">Back to top</span>
<iconify-icon aria-hidden="true" icon="lucide:arrow-up"></iconify-icon>
</button>
</div>
</footer>
`;
})();
/* END scripts/pages/shared-project-chrome.js */
;

;
/* START scripts/pages/case-study.js */
(() => {
  'use strict';

  const root = document.documentElement;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  root.classList.add('has-js');

  const header = document.querySelector('.site-header');
  if (header) {
  const nav = header.querySelector('.site-nav');
  const menu = header.querySelector('.mobile-toggle');
  const mobile = matchMedia('(max-width: 735px)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  const groups = [...nav.querySelectorAll('.nav-group')].map((element) => ({
    element,
    toggle: element.querySelector('.nav-chevron'),
    panel: element.querySelector('.nav-popover'),
  }));
  let opened;
  let pinned = false;
  let closeTimer;

  function closeDropdown() {
    clearTimeout(closeTimer);
    if (!opened) return;
    opened.toggle.setAttribute('aria-expanded', 'false');
    opened.element.classList.remove('is-open');
    opened.panel.hidden = true;
    opened = undefined;
    pinned = false;
  }

  function openDropdown(group, keepOpen = false) {
    clearTimeout(closeTimer);
    if (opened === group) {
      pinned ||= keepOpen;
      return;
    }
    closeDropdown();
    opened = group;
    pinned = keepOpen;
    group.panel.hidden = false;
    group.toggle.setAttribute('aria-expanded', 'true');
    group.element.classList.add('is-open');
  }

  function setMenu(isOpen) {
    menu.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    menu.querySelector('iconify-icon').setAttribute('icon', isOpen ? 'lucide:x' : 'lucide:menu');
    nav.classList.toggle('is-open', isOpen);
    if (!isOpen) closeDropdown();
  }

  for (const group of groups) {
    group.element.addEventListener('pointerenter', () => {
      if (!mobile.matches && hover.matches && (!pinned || opened === group)) openDropdown(group);
    });
    group.element.addEventListener('pointerleave', () => {
      if (opened !== group || pinned || group.panel.contains(document.activeElement)) return;
      closeTimer = setTimeout(() => {
        if (opened === group && !pinned) closeDropdown();
      }, 175);
    });
    group.toggle.addEventListener('click', () => {
      if (opened === group && pinned) closeDropdown();
      else openDropdown(group, true);
    });
    group.toggle.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      openDropdown(group, true);
      group.panel.querySelector('a').focus();
    });
    group.element.addEventListener('focusout', (event) => {
      if (opened === group && event.relatedTarget && !group.element.contains(event.relatedTarget))
        closeDropdown();
    });
  }

  menu.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  mobile.addEventListener('change', () => setMenu(false));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('click', (event) => {
    const path = event.composedPath();
    if (!path.includes(header)) setMenu(false);
    else if (opened && !path.includes(opened.element)) closeDropdown();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || document.querySelector('dialog[open]')) return;
    if (opened) {
      const trigger = opened.toggle;
      closeDropdown();
      trigger.focus();
    } else if (nav.classList.contains('is-open')) {
      setMenu(false);
      menu.focus();
    }
  });
  function updateHeader() {
    header.classList.toggle('is-scrolled', scrollY > 10);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  } // Legacy header controls are inactive when the shared homepage dock is used.
  const catalog = document.querySelector('.catalog');
  if (catalog) {
    const search = catalog.querySelector('input');
    const buttons = [...catalog.querySelectorAll('[data-filter]')];
    const cards = [...catalog.querySelectorAll('.work-card')];
    const empty = catalog.querySelector('.empty-state');
    const count = catalog.querySelector('.catalog-count');
    let selected = 'all';

    function refreshCatalog() {
      const terms = search.value.toLocaleLowerCase().trim().split(/\s+/);
      let hits = 0;
      cards.forEach((card) => {
        const matchesFilter = selected === 'all' || card.dataset.category === selected;
        const haystack = card.dataset.search + ' ' + card.textContent.toLocaleLowerCase();
        const visible = matchesFilter && terms.every((term) => haystack.includes(term));
        card.classList.toggle('filter-enter', card.hidden && visible);
        card.hidden = !visible;
        if (visible) hits += 1;
      });
      empty.hidden = hits > 0;
      count.textContent = 'Showing ' + hits + (hits === 1 ? ' project' : ' projects');
      buttons.forEach((button) =>
        button.setAttribute('aria-pressed', String(button.dataset.filter === selected)),
      );
    }

    buttons.forEach((button) =>
      button.addEventListener('click', () => {
        selected = button.dataset.filter;
        refreshCatalog();
      }),
    );
    search.addEventListener('input', refreshCatalog);
    empty.querySelector('button').addEventListener('click', () => {
      search.value = '';
      selected = 'all';
      refreshCatalog();
      search.focus();
    });
    document.addEventListener('keydown', (event) => {
      if (
        event.key === '/' &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.target.closest('input, textarea, [contenteditable]')
      ) {
        event.preventDefault();
        search.focus();
      } else if (event.key === 'Escape' && event.target === search) {
        search.value = '';
        refreshCatalog();
      }
    });
  }

  const skillFilters = [...document.querySelectorAll('[data-skill-filter]')];
  const skillGroups = [...document.querySelectorAll('[data-skill-group]')];
  skillFilters.forEach((button) =>
    button.addEventListener('click', () => {
      const selected = button.dataset.skillFilter;
      skillFilters.forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
      skillGroups.forEach((group) => {
        const visible = selected === 'all' || group.dataset.skillGroup === selected;
        group.classList.toggle('filter-enter', group.hidden && visible);
        group.hidden = !visible;
      });
    }),
  );

  const docTabs = [...document.querySelectorAll('[data-document-tab]')];
  if (docTabs.length) {
    const names = docTabs.map((tab) => tab.dataset.documentTab);
    function activateDocumentTab() {
      const requested = location.hash.slice(1);
      const active = names.includes(requested) ? requested : names[0];
      docTabs.forEach((tab) => {
        const selected = tab.dataset.documentTab === active;
        document.getElementById(tab.dataset.documentTab).hidden = !selected;
        if (selected) tab.setAttribute('aria-current', 'location');
        else tab.removeAttribute('aria-current');
      });
    }
    activateDocumentTab();
    window.addEventListener('hashchange', activateDocumentTab);
    docTabs.forEach((tab) =>
      tab.addEventListener('click', (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (location.hash !== tab.hash) history.pushState(null, '', tab.hash);
        activateDocumentTab();
      }),
    );
  }

  const aside = document.querySelector('.case-aside nav');
  if (aside) {
    const links = [...aside.querySelectorAll('a')];
    const targets = links.map((link) => document.getElementById(link.hash.slice(1)));
    let scheduled = false;
    function selectCurrentSection() {
      const line = Math.min(210, innerHeight * 0.35);
      const active = targets.reduce(
        (current, section, index) => (section?.getBoundingClientRect().top < line ? index : current),
        0,
      );
      links.forEach((link, index) => {
        if (index === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      scheduled = false;
    }
    window.addEventListener(
      'scroll',
      () => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(selectCurrentSection);
      },
      { passive: true },
    );
    selectCurrentSection();
  }

  document.querySelectorAll('[data-architecture]').forEach((diagram) => {
    const buttons = [...diagram.querySelectorAll('[data-architecture-step]')];
    const panel = diagram.querySelector('.study-architecture-description');
    const title = panel.querySelector('[data-step-title]');
    const copy = panel.querySelector('[data-step-copy]');
    function selectStep(button) {
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      title.textContent = button.dataset.stepName;
      copy.textContent = button.dataset.stepDescription;
      if (!motion.matches)
        panel.animate(
          [
            { opacity: 0.72, transform: 'translateX(-3px)' },
            { opacity: 1, transform: 'translateX(0)' },
          ],
          { duration: 200, easing: 'ease-out' },
        );
    }
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => selectStep(button));
      button.addEventListener('keydown', (event) => {
        const direction = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[event.key];
        if (!direction) return;
        event.preventDefault();
        const next = buttons[(index + direction + buttons.length) % buttons.length];
        next.focus();
        selectStep(next);
      });
    });
  });

  const wheel = document.querySelector('[data-tri-toggle]');
  if (wheel) {
    const stage = wheel.closest('.project-mechanism');
    const toggleMotion = (playing) => {
      stage.classList.toggle('tri-is-paused', !playing);
      wheel.setAttribute('aria-pressed', String(playing));
      wheel.setAttribute('aria-label', playing ? 'Pause wheel animation' : 'Play wheel animation');
      wheel.querySelector('span').textContent = playing ? 'Pause animation' : 'Play animation';
      wheel.querySelector('iconify-icon').setAttribute('icon', playing ? 'lucide:pause' : 'lucide:play');
    };
    toggleMotion(!motion.matches);
    motion.addEventListener('change', ({ matches }) => toggleMotion(!matches));
    wheel.addEventListener('click', () => toggleMotion(stage.classList.contains('tri-is-paused')));
  }

  const dialog = document.querySelector('.media-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    const previewLinks = [...document.querySelectorAll('[data-preview]')];
    const dialogImage = dialog.querySelector('.dialog-image');
    const dialogTitle = dialog.querySelector('h2');
    const original = dialog.querySelector('.dialog-original');
    const count = dialog.querySelector('.dialog-count');
    const close = dialog.querySelector('[data-close]');
    const previous = dialog.querySelector('[data-prev]');
    const next = dialog.querySelector('[data-next]');
    let current = 0;
    let items = [];
    let opener;
    let closing = false;

    function makeImage(link, src, suffix = '') {
      const alt = link.dataset.alt || link.querySelector('img')?.alt || 'Project image';
      return {
        src: src || link.href,
        href: link.href,
        alt: alt + suffix,
        title:
          link.dataset.title ||
          link.closest('figure')?.querySelector('figcaption')?.textContent.trim() ||
          alt,
      };
    }
    function updatePreview(index) {
      current = (index + items.length) % items.length;
      const item = items[current];
      const image = new Image();
      image.alt = item.alt;
      image.src = item.src;
      image.addEventListener(
        'error',
        () => {
          const message = document.createElement('p');
          message.textContent = 'Preview unavailable. Use Open original to view the source file.';
          if (image.isConnected) dialogImage.replaceChildren(message);
        },
        { once: true },
      );
      dialogImage.replaceChildren(image);
      dialogTitle.textContent = item.title;
      original.href = item.href;
      count.textContent = current + 1 + ' / ' + items.length;
      const multiple = items.length > 1;
      count.hidden = !multiple;
      previous.hidden = !multiple;
      next.hidden = !multiple;
    }
    function closePreview() {
      if (!dialog.open || closing) return;
      if (motion.matches) {
        dialog.close();
        return;
      }
      closing = true;
      dialog.classList.add('is-closing');
      setTimeout(() => dialog.close(), 155);
    }
    previewLinks.forEach((link) =>
      link.addEventListener('click', (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        opener = link;
        if (link.dataset.preview === 'cover') {
          items = [makeImage(link)];
          updatePreview(0);
        } else if (link.dataset.preview === 'document') {
          items = [makeImage(link, link.dataset.image)];
          if (link.dataset.pageTwo) items.push(makeImage(link, link.dataset.pageTwo, ', page 2'));
          updatePreview(0);
        } else {
          const group = previewLinks.filter((item) => item.dataset.preview === link.dataset.preview);
          items = group.map((item) => makeImage(item));
          updatePreview(group.indexOf(link));
        }
        dialog.showModal();
        close.focus();
      }),
    );
    close.addEventListener('click', closePreview);
    next.addEventListener('click', () => updatePreview(current + 1));
    previous.addEventListener('click', () => updatePreview(current - 1));
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closePreview();
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closePreview();
    });
    dialog.addEventListener('close', () => {
      closing = false;
      dialog.classList.remove('is-closing');
      dialogImage.replaceChildren();
      opener?.focus({ preventScroll: true });
    });
    dialog.addEventListener('keydown', (event) => {
      if (items.length < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      updatePreview(current + (event.key === 'ArrowRight' ? 1 : -1));
    });
  }

  document.querySelectorAll('[data-copy-email]').forEach((button) =>
    button.addEventListener('click', async () => {
      const row = button.closest('.email-row');
      const address = row.querySelector('a').getAttribute('href').slice(7);
      const status = row.nextElementSibling;
      try {
        await navigator.clipboard.writeText(address);
        status.textContent = 'Email address copied.';
      } catch {
        status.textContent = 'Copy this address: ' + address;
      }
    }),
  );

  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (!motion.matches)
            entry.target.animate(
              [
                { transform: 'translateY(8px)', opacity: 0.86 },
                { transform: 'translateY(0)', opacity: 1 },
              ],
              { duration: 340, easing: 'cubic-bezier(.2,.75,.24,1)' },
            );
        }
      },
      { threshold: 0.07 },
    );
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
  }
})();

/* END scripts/pages/case-study.js */
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
