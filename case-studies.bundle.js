/* START scripts/pages/shared-project-chrome.js */
/* The six project stories share the homepage header and footer from one template. */
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
<img alt="Utility meter connected to an IoT modem during my internship testing" decoding="async" height="720" loading="eager" fetchpriority="low" src="assets/internship-s47-preparation-display.webp" width="960"/>
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
/* START scripts/shared/icons.js */
/* Lucide icons, ISC license; see THIRD_PARTY_LICENSES.txt. */
(()=>{const nodes={"lucide:house":[["path",{"d":"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}],["path",{"d":"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}]],"lucide:briefcase-business":[["path",{"d":"M12 12h.01"}],["path",{"d":"M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"}],["path",{"d":"M22 13a18.15 18.15 0 0 1-20 0"}],["rect",{"width":"20","height":"14","x":"2","y":"6","rx":"2"}]],"lucide:user-round":[["circle",{"cx":"12","cy":"8","r":"5"}],["path",{"d":"M20 21a8 8 0 0 0-16 0"}]],"lucide:mail":[["path",{"d":"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"}],["rect",{"x":"2","y":"4","width":"20","height":"16","rx":"2"}]],"lucide:sun":[["circle",{"cx":"12","cy":"12","r":"4"}],["path",{"d":"M12 2v2"}],["path",{"d":"M12 20v2"}],["path",{"d":"m4.93 4.93 1.41 1.41"}],["path",{"d":"m17.66 17.66 1.41 1.41"}],["path",{"d":"M2 12h2"}],["path",{"d":"M20 12h2"}],["path",{"d":"m6.34 17.66-1.41 1.41"}],["path",{"d":"m19.07 4.93-1.41 1.41"}]],"lucide:arrow-up-right":[["path",{"d":"M7 7h10v10"}],["path",{"d":"M7 17 17 7"}]],"lucide:copy":[["rect",{"width":"14","height":"14","x":"8","y":"8","rx":"2","ry":"2"}],["path",{"d":"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]],"lucide:linkedin":[["path",{"d":"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}],["path",{"d":"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"}]],"lucide:message-circle":[["path",{"d":"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"}]],"lucide:x":[["path",{"d":"M18 6 6 18"}],["path",{"d":"m6 6 12 12"}]],"lucide:plus":[["path",{"d":"M5 12h14"}],["path",{"d":"M12 5v14"}]],"lucide:arrow-up":[["path",{"d":"m5 12 7-7 7 7"}],["path",{"d":"M12 19V5"}]],"lucide:toggle-right":[["rect",{"x":"2","y":"5","width":"20","height":"14","rx":"7"}],["circle",{"cx":"15","cy":"12","r":"4"}]],"lucide:cpu":[["rect",{"x":"4","y":"4","width":"16","height":"16","rx":"2"}],["rect",{"x":"9","y":"9","width":"6","height":"6"}],["path",{"d":"M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"}]],"lucide:settings":[["path",{"d":"M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"}],["path",{"d":"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-1.9 1.9-.06-.06A1.65 1.65 0 0 0 16 18.4a1.65 1.65 0 0 0-1 .27A1.65 1.65 0 0 0 14.25 20v.1h-4.5V20A1.65 1.65 0 0 0 9 18.67a1.65 1.65 0 0 0-1-.27 1.65 1.65 0 0 0-1.82.33l-.06.06-1.9-1.9.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.33-1H3.1V10h.17A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06 1.9-1.9.06.06A1.65 1.65 0 0 0 8 5.6c.37 0 .71-.1 1-.27A1.65 1.65 0 0 0 9.75 4v-.1h4.5V4A1.65 1.65 0 0 0 15 5.33c.29.17.63.27 1 .27.65 0 1.31-.33 1.82-.33l.06-.06 1.9 1.9-.06.06A1.65 1.65 0 0 0 19.4 9c.17.29.27.63.27 1H20.9v4h-1.23c0 .37-.1.71-.27 1z"}]],"lucide:play":[["polygon",{"points":"6 3 20 12 6 21 6 3"}]],"lucide:pause":[["rect",{"x":"6","y":"4","width":"4","height":"16","rx":"1"}],["rect",{"x":"14","y":"4","width":"4","height":"16","rx":"1"}]],"lucide:moon":[["path",{"d":"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"}]]};Object.assign(nodes,{"lucide:thermometer-sun":[["path",{"d":"M14 14.76V5a3 3 0 0 0-6 0v9.76a5 5 0 1 0 6 0Z"}],["path",{"d":"M11 11v8"}],["path",{"d":"M20 12h2 M18.3 5.7l1.4-1.4 M18 9a3 3 0 0 0-3-3"}]],"lucide:sprout":[["path",{"d":"M12 22V12"}],["path",{"d":"M12 12C6 12 4 8 4 4c6 0 8 3 8 8Z"}],["path",{"d":"M12 15c0-6 3-9 9-9 0 6-3 9-9 9Z"}]],"lucide:radio":[["rect",{"x":3,"y":8,"width":18,"height":13,"rx":2}],["path",{"d":"M7 8 17 2 M7 13h6 M7 17h4"}],["circle",{"cx":17,"cy":16,"r":2}]],"lucide:radio-tower":[["circle",{"cx":12,"cy":10,"r":2}],["path",{"d":"m5 22 7-10 7 10 M8 18h8 M6.3 5.5a8 8 0 0 0 0 9 M17.7 5.5a8 8 0 0 1 0 9"}]],"lucide:database":[["ellipse",{"cx":12,"cy":5,"rx":9,"ry":3}],["path",{"d":"M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5 M3 12c0 1.7 4 3 9 3s9-1.3 9-3"}]],"lucide:users":[["path",{"d":"M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2 M20 21v-2a4 4 0 0 0-3-3.87"}],["circle",{"cx":9.5,"cy":7,"r":4}],["path",{"d":"M17 3.1a4 4 0 0 1 0 7.8"}]],"lucide:network":[["rect",{"x":9,"y":2,"width":6,"height":6,"rx":1}],["rect",{"x":2,"y":16,"width":6,"height":6,"rx":1}],["rect",{"x":16,"y":16,"width":6,"height":6,"rx":1}],["path",{"d":"M12 8v4 M5 16v-4h14v4"}]],"lucide:server":[["rect",{"x":3,"y":2,"width":18,"height":9,"rx":2}],["rect",{"x":3,"y":13,"width":18,"height":9,"rx":2}],["path",{"d":"M7 6h.01 M7 17h.01 M11 6h6 M11 17h6"}]],"lucide:images":[["rect",{"x":4,"y":3,"width":17,"height":15,"rx":2}],["path",{"d":"m4 14 4-4 3 3 4-4 6 6 M2 8v13h17"}],["circle",{"cx":9,"cy":7,"r":1}]],"lucide:activity":[["path",{"d":"M2 12h4l3-8 5 16 3-8h5"}]],"lucide:bell-ring":[["path",{"d":"M18 8a6 6 0 0 0-12 0c0 8-3 9-3 11h18c0-2-3-3-3-11 M10 22h4 M3 4l2-2 M21 4l-2-2"}]],"lucide:wallet":[["rect",{"x":3,"y":5,"width":18,"height":16,"rx":2}],["path",{"d":"M3 9h18 M3 5l3-3h11 M16 15h3"}]],"lucide:layers":[["path",{"d":"m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5"}]],"lucide:database-zap":[["ellipse",{"cx":12,"cy":5,"rx":9,"ry":3}],["path",{"d":"M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5 M3 12c0 1.7 4 3 9 3s9-1.3 9-3"}],["path",{"d":"m12 9-3 5h3l-1 5 4-7h-3l1-3"}]],"lucide:chart-no-axes-combined":[["path",{"d":"M3 20h18 M4 15l5-5 4 3 7-8 M17 5h3v3"}],["path",{"d":"M5 17v3 M11 15v5 M17 12v8"}]]});Object.assign(nodes,{"lucide:search":[["circle",{"cx":"11","cy":"11","r":"8"}],["path",{"d":"m21 21-4.35-4.35"}]]});Object.assign(nodes,{
"lucide:chevron-down":[["path",{"d":"M6 9l6 6 6-6"}]],
"lucide:chevron-left":[["path",{"d":"M15 18l-6-6 6-6"}]],
"lucide:chevron-right":[["path",{"d":"M9 18l6-6-6-6"}]],
"lucide:arrow-down-right":[["path",{"d":"M7 7l10 10m0-10v10H7"}]],
"lucide:calendar-days":[["path",{"d":"M4 5h16v15H4zM8 3v4m8-4v4M4 10h16m-12 4h.01m4 0h.01m4 0h.01m-8 3h.01m4 0h.01m4 0h.01"}]],
"lucide:clipboard-list":[["path",{"d":"M9 5H6v16h12V5h-3M9 3h6v4H9zM9 12h6m-6 4h6"}]],
"lucide:building-2":[["path",{"d":"M3 21h18M5 21V5h9v16m0-11h5v11M8 9h3m-3 4h3m-3 4h3m5-3h.01m0 3h.01"}]],
"lucide:clipboard-check":[["path",{"d":"M9 5H6v16h12V5h-3M9 3h6v4H9zm0 11 2 2 4-4"}]],
"lucide:file-check-2":[["path",{"d":"M6 3h8l4 4v14H6zM14 3v5h4M9 14l2 2 4-4"}]],
"lucide:arrow-left":[["path",{"d":"m12 19-7-7 7-7"}],["path",{"d":"M19 12H5"}]],
"lucide:arrow-right":[["path",{"d":"M5 12h14"}],["path",{"d":"m12 5 7 7-7 7"}]],
"lucide:award":[["circle",{"cx":"12","cy":"8","r":"6"}],["path",{"d":"M8.21 13.89 7 23l5-3 5 3-1.21-9.12"}]],
"lucide:medal":[["circle",{"cx":"12","cy":"15","r":"6"}],["path",{"d":"M9.8 9.4 6 2h12l-3.8 7.4"}],["path",{"d":"m12 12 1 2 2.2.4-1.6 1.6.4 2.2-2-1-2 1 .4-2.2-1.6-1.6L11 14z"}]],
"lucide:star":[["path",{"d":"m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"}]],
"lucide:book-open":[["path",{"d":"M12 7v14"}],["path",{"d":"M3 18V5a1 1 0 0 1 1-1h4a4 4 0 0 1 4 4 4 4 0 0 1 4-4h4a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-4a4 4 0 0 0-4 2 4 4 0 0 0-4-2H4a1 1 0 0 1-1-1Z"}]],
"lucide:info":[["circle",{"cx":"12","cy":"12","r":"10"}],["path",{"d":"M12 16v-4"}],["path",{"d":"M12 8h.01"}]],
"lucide:check":[["path",{"d":"M20 6 9 17l-5-5"}]],
"lucide:sparkles":[["path",{"d":"m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"}],["path",{"d":"M5 3v4M3 5h4 M20 17v4 M18 19h4"}]]
});Object.assign(nodes,{
"lucide:badge-check":[["path",{"d":"M8.21 13.89 7 23l5-3 5 3-1.21-9.12"}],["circle",{"cx":"12","cy":"8","r":"6"}],["path",{"d":"m9 8 2 2 4-4"}]],
"lucide:file-text":[["path",{"d":"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"}],["path",{"d":"M14 2v6h6 M8 13h8 M8 17h8"}]],
"lucide:expand":[["path",{"d":"M15 3h6v6 M9 21H3v-6 M21 3l-7 7 M3 21l7-7"}]],
"lucide:folder-open":[["path",{"d":"M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2"}],["path",{"d":"M4 20 7 12h14l-3 8"}]]
});class LocalIcon extends HTMLElement{static get observedAttributes(){return ['icon'];}connectedCallback(){this.render();}attributeChangedCallback(){if(this.isConnected)this.render();}render(){const data=nodes[this.getAttribute('icon')];this.replaceChildren();if(!data)return;const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');for(const[k,v]of Object.entries({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'2','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'}))svg.setAttribute(k,v);for(const[tag,attrs]of data){const e=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,String(v));svg.append(e);}this.append(svg);}}customElements.define('iconify-icon',LocalIcon);})();

/* END scripts/shared/icons.js */
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
