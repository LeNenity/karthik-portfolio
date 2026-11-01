(()=>{
  const root=document.documentElement;
  const themeButton=document.getElementById('all-theme-toggle');
  const themeIcon=document.getElementById('all-theme-icon');
  function updateTheme(theme){
    root.dataset.theme=theme;
    themeButton.setAttribute('aria-label',theme==='dark'?'Switch to light mode':'Switch to dark mode');
    themeIcon.setAttribute('icon',theme==='dark'?'lucide:sun':'lucide:moon');
    try{localStorage.setItem('karthik-beige-theme',theme)}catch{}
  }
  let savedTheme;
  try{savedTheme=localStorage.getItem('karthik-beige-theme')}catch{}
  updateTheme(savedTheme==='dark'?'dark':'light');
  themeButton.addEventListener('click',()=>updateTheme(root.dataset.theme==='dark'?'light':'dark'));

  const search=document.getElementById('ap-search-input');
  const filters=[...document.querySelectorAll('.ap-filter')];
  const cards=[...document.querySelectorAll('.ap-card')];
  const count=document.getElementById('ap-results');
  const empty=document.getElementById('ap-empty');
  let selected='all';
  const galleryViewport=document.querySelector('.ap-scroll-region');
  function refresh(){
    const q=search.value.trim().toLocaleLowerCase();
    let hits=0;
    for(const card of cards){
      const visible=(selected==='all'||card.dataset.category===selected)&&(!q||card.dataset.search.includes(q));
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
  document.getElementById('ap-reset').addEventListener('click',()=>{search.value='';selected='all';refresh();search.focus()});
  document.addEventListener('keydown',event=>{
    if(event.key==='/'&&!event.altKey&&!event.ctrlKey&&!event.metaKey&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){
      event.preventDefault();search.focus();
    }
    if(event.key==='Escape'&&document.activeElement===search){search.value='';refresh();search.blur()}
  });
  refresh();
})();

// Lightweight ambient dots on the All Projects page. This matches Contact's
// independent fade rhythm while keeping the scrollable gallery responsive.
(() => {
  const section = document.getElementById('all-projects-main');
  const canvas = document.getElementById('ap-ambient-dots');
  if (!section || !canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, dots = [], visible = false, frame = 0, previous = 0;

  function resize() {
    const rect = section.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = width < 650 ? 38 : Math.min(94, Math.round(width * height / 16000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1.7 + Math.random() * 2.1,
      strength: .30 + Math.random() * .40,
      phase: Math.random() * Math.PI * 2,
      speed: .5 + Math.random() * .85,
      drift: 1.6 + Math.random() * 3.8
    }));
  }

  function draw(time) {
    frame = 0;
    if (!visible || document.hidden || reducedMotion.matches) return;
    if (time - previous >= 33) {
      previous = time;
      ctx.clearRect(0, 0, width, height);
      const t = time / 1000;
      const rgb = document.documentElement.dataset.theme === 'dark' ? '235,235,235' : '50,42,34';
      for (const dot of dots) {
        const pulse = Math.max(0, Math.sin(t * dot.speed + dot.phase));
        const alpha = pulse * pulse * dot.strength;
        if (alpha < .01) continue;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb},${alpha.toFixed(3)})`;
        ctx.arc(dot.x + Math.sin(t * .27 + dot.phase) * dot.drift,
                dot.y + Math.cos(t * .23 + dot.phase) * dot.drift,
                dot.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    frame = requestAnimationFrame(draw);
  }

  function update() {
    if (visible && !document.hidden && !reducedMotion.matches) {
      if (!frame) frame = requestAnimationFrame(draw);
    } else {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      ctx.clearRect(0, 0, width, height);
    }
  }

  new ResizeObserver(resize).observe(section);
  resize();
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    update();
  }, { threshold: 0, rootMargin: '90px 0px' }).observe(section);
  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener('change', update);
})();
