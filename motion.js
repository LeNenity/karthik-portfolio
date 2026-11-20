(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const handoffKey = 'karthik:page-signal-v2';
  const root = document.documentElement;
  const sweepDuration = window.portfolioPerf.level === 2 ? 240 : 360;
  const shape = y => (y - .5) * .87 + Math.sin((y - .12) * Math.PI) * .16;
  const accelerate = t => t * (.48 + .52 * t);
  const colors = ['#ddc9ff', '#8bcfff', '#a690ff', '#f2eaff'];
  const glyphs = ['K', '0', '1', '7', '+', '×', '⌁', '◇'];
  const sparks = Array.from({length: 44}, (_, index) => ({
    lane: ((index * .618034 + .23) % 1) * 1.28 - .07,
    offset: ((index * .754878 + .19) % 1 - .68) * .26,
    color: colors[index % colors.length],
    size: 1.2 + index % 6 * .45,
    glyph: index % 4 === 0 ? glyphs[Math.floor(index / 4) % glyphs.length] : ''
  }));
  let leaving = false;
  let activeCanvas;

  function sweep(entering, onDone) {
    activeCanvas?.remove();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) { onDone(); return; }
    canvas.className = 'edition-sweep';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.append(canvas);
    const {width, height} = canvas.getBoundingClientRect();
    if (!width || !height) {
      canvas.remove();
      onDone();
      return;
    }
    const ratio = window.portfolioPerf.ratio(1);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    activeCanvas = canvas;
    root.classList.add('is-transitioning');
    ctx.scale(canvas.width / width, canvas.height / height);

    // Match the curtain shown by motion.css before this script runs.
    const fill = ctx.createLinearGradient(0, 0, width, 0);
    fill.addColorStop(0, '#0c102a');
    fill.addColorStop(.48, '#201945');
    fill.addColorStop(.76, '#352565');
    fill.addColorStop(1, '#232959');
    const rim = ctx.createLinearGradient(0, height, width, 0);
    rim.addColorStop(0, '#603ce0');
    rim.addColorStop(.42, '#c19bff');
    rim.addColorStop(.7, '#dae1ff');
    rim.addColorStop(1, '#71c9ff');
    const from = -shape(1) * width - 2;
    const to = (1 - shape(0)) * width + 2;
    let start = performance.now();

    let rebased = false;
    function next(now) {
      if (!rebased) { rebased = true; start = now; }
      paint(now);
    }
    function paint(now) {
      if (!canvas.isConnected) return;
      const t = Math.max(0, Math.min(1, (now - start) / sweepDuration));
      // Pair the velocity of the two halves where the documents swap.
      const progress = entering ? 1 - accelerate(1 - t) : accelerate(t);
      const foreground = from + (to - from) * progress;
      const light = Math.sin(t * Math.PI) ** .65;
      const curve = (y, offset = 0) => foreground + width * shape(y) + offset;
      const trace = offset => {
        ctx.moveTo(curve(0, offset), 0);
        for (let step = 1; step <= 24; step++) {
          const y = step / 24;
          ctx.lineTo(curve(y, offset), y * height);
        }
      };

      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 1;
      ctx.fillStyle = fill;
      ctx.beginPath();
      trace(0);
      const side = entering ? width * 4 : -width * 3;
      ctx.lineTo(side, height);
      ctx.lineTo(side, 0);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = rim;
      for (const [offset, thickness, alpha] of [
        [0, 30, .045], [0, 14, .095], [0, 5, .19], [0, 1.4, .95], [-20, .85, .41], [-49, .65, .23]
      ]) {
        ctx.globalAlpha = light * alpha;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        trace(offset);
        ctx.stroke();
      }

      ctx.lineCap = 'round';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const spark of (window.portfolioPerf.level === 2 ? sparks.filter((_,i)=>i%2===0) : sparks)) {
        const y = spark.lane - t * .2;
        const x = curve(y, spark.offset * width + Math.sin(y * 10 + t * 8) * 15);
        const py = y * height;
        ctx.globalAlpha = light * (spark.glyph ? .64 : .84);
        ctx.fillStyle = ctx.strokeStyle = spark.color;
        if (spark.glyph) {
          ctx.font = '600 ' + (9 + spark.size) + 'px monospace';
          ctx.fillText(spark.glyph, x, py);
          continue;
        }
        const trail = (11 + spark.size * 7) * (.63 + light * .37);
        ctx.lineWidth = Math.max(.7, spark.size * .42);
        ctx.beginPath();
        ctx.moveTo(x - trail, py + trail * .41);
        ctx.quadraticCurveTo(x - trail * .36, py + trail * .13, x, py);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, py, spark.size * .49, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (t < 1) requestAnimationFrame(next);
      else {
        if (entering) {
          canvas.remove();
          root.classList.remove('is-transitioning');
        }
        onDone();
      }
    }
    paint(start);
  }

  if (root.classList.contains('sweep-arriving')) {
    try {
      if (!reduced.matches) sweep(true, () => {});
    } finally {
      root.classList.remove('sweep-arriving');
    }
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
        event.shiftKey || event.altKey || reduced.matches || document.hidden) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const next = new URL(link.href);
    if (!['http:', 'https:', 'file:'].includes(next.protocol) || next.origin !== location.origin ||
        next.pathname === location.pathname || !next.pathname.endsWith('.html')) return;
    event.preventDefault();
    if (leaving) return;
    leaving = true;
    let committed = false;
    const navigate = () => {
      if (committed) return;
      committed = true;
      clearTimeout(fallback);
      try { sessionStorage.setItem(handoffKey, JSON.stringify({url: next.href, time: Date.now()})); } catch {}
      location.assign(next.href);
    };
    const fallback = setTimeout(() => {
      if (activeCanvas?.isConnected) {
        root.classList.add('sweep-arriving');
        activeCanvas.remove();
      }
      navigate();
    }, sweepDuration + 120);
    sweep(false, navigate);
  });

  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    activeCanvas?.remove();
    root.classList.remove('sweep-arriving', 'is-transitioning');
    leaving = false;
  });
})();



// Shared background for the project, certificate and internship pages.
(() => {
  const regions = [...document.querySelectorAll('[data-ambient-dots]')];
  if (!regions.length) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'edition-ambient';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  const glyphs = 'KARTHIK0123456789+×';
  let width, height, points;
  let frame = 0;
  let lastPaint = 0;
  let paintTimer = 0;
  function schedulePaint() {
    clearTimeout(paintTimer);
    if (!visible.size || document.hidden || reduced.matches) return;
    const delay = Math.max(0, window.portfolioPerf.interval(45,65,100) - (performance.now() - lastPaint) - 8);
    paintTimer = setTimeout(() => { frame = requestAnimationFrame(tick); }, delay);
  }

  function render(now) {
    ctx.clearRect(0, 0, width, height);
    const dark = document.documentElement.dataset.theme === 'dark';
    const ranges = [...visible].map(region => region.getBoundingClientRect());
    ctx.font = '650 11px ui-monospace, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const point of points) {
      if (!ranges.some(range => point.y >= range.top && point.y <= range.bottom)) continue;
      const pulse = reduced.matches ? .52 : ((1 + Math.sin(now * point.speed + point.phase)) * .5) ** 1.7;
      const x = point.x + (reduced.matches ? 0 : Math.sin(now * .00027 + point.phase) * 3);
      ctx.globalAlpha = pulse * (point.glyph ? .37 : .47);
      ctx.fillStyle = point.blue ? (dark ? '#8bc9ff' : '#406ac7') : (dark ? '#bdaeff' : '#6550b5');

      if (point.glyph) ctx.fillText(point.glyph, x, point.y);
      else {
        ctx.beginPath();
        ctx.arc(x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function tick(now) {
    frame = 0;
    if (!visible.size || document.hidden || reduced.matches) return;
    if (now - lastPaint >= window.portfolioPerf.interval(45, 65, 100)) {
      lastPaint = now;
      const paintStart = performance.now();
      render(now);
      window.portfolioPerf.paintCost(performance.now() - paintStart);
    }
    schedulePaint();
  }

  function sync() {
    cancelAnimationFrame(frame);
    clearTimeout(paintTimer);
    frame = 0;
    canvas.hidden = !visible.size;
    if (!points || !visible.size || document.hidden) return;
    lastPaint = performance.now();
    render(lastPaint);
    if (!reduced.matches) schedulePaint();
  }

  function fit() {
    width = document.documentElement.clientWidth;
    height = innerHeight;
    const ratio = window.portfolioPerf.ratio(1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(216, Math.max(43, Math.round(width * height / 7200 * [1,.65,.4][window.portfolioPerf.level])));
    points = Array.from({length: count}, (_, i) => ({
      x: ((i * .618034 + .13) % 1) * width,
      y: ((i * .754878 + .39) % 1) * height,
      phase: i * 1.323,
      speed: .0009 + i % 7 * .00015,
      radius: i % 11 === 0 ? 3.6 : 1.2 + i % 6 * .27,
      blue: i % 4 === 0,
      glyph: i % 6 === 0 ? glyphs[Math.floor(i * .618) % glyphs.length] : ''
    }));
    sync();
  }

  const observer = new IntersectionObserver(entries => {
    for (const {target, isIntersecting} of entries) {
      if (isIntersecting) visible.add(target);
      else visible.delete(target);
    }
    sync();
  });
  regions.forEach(region => observer.observe(region));
  window.addEventListener('resize', fit, {passive: true});
  document.addEventListener('portfolio-quality-change', fit);
  window.addEventListener('scroll', () => { if (reduced.matches && visible.size) render(performance.now()); }, {passive: true});
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  new MutationObserver(sync).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
  fit();
})();



// The dock keeps one highlight for the hovered or keyboard-focused link.
(() => {
  const dock = document.querySelector('.floating-header .dock');
  if (!dock) return;

  const mark = document.createElement('span');
  mark.className = 'dock-highlight';
  mark.setAttribute('aria-hidden', 'true');
  dock.prepend(mark);

  const desktop = matchMedia('(min-width: 901px)');
  let hovered;
  let focused;
  let positionFrame = 0;

  function place() {
    positionFrame = 0;
    const target = hovered || focused;
    mark.classList.toggle('is-active', Boolean(target && desktop.matches));
    if (!target || !desktop.matches) return;
    mark.style.setProperty('--dock-marker-x', target.offsetLeft + 'px');
    mark.style.setProperty('--dock-marker-w', target.offsetWidth + 'px');
  }

  function layout() {
    if (!positionFrame) positionFrame = requestAnimationFrame(place);
  }

  for (const item of dock.querySelectorAll('.nav-item')) {
    item.addEventListener('focusin', () => {
      focused = item.matches(':focus-visible') ? item : null;
      layout();
    });
  }
  let pointerX, pointerY;
  dock.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || (event.clientX === pointerX && event.clientY === pointerY)) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    hovered = event.target.closest('.nav-item');
    layout();
  });
  dock.addEventListener('pointerleave', () => {
    hovered = null;
    pointerX = pointerY = undefined;
    layout();
  });
  dock.addEventListener('focusout', event => {
    if (!dock.contains(event.relatedTarget)) {
      focused = null;
      layout();
    }
  });
  new ResizeObserver(layout).observe(dock);
  desktop.addEventListener('change', layout);
})();


// Warm only the single intentionally hovered destination on a known fast connection.
(() => {
  const warmed = new Set(); let timer = 0, pending = null;
  function clear() { clearTimeout(timer); pending = null; }
  document.addEventListener('pointerover', event => {
    if (!window.portfolioPerf.allowPrefetch || event.pointerType === 'touch' || document.hidden || document.readyState !== 'complete') return;
    const anchor = event.target.closest?.('a[href]');
    if (!anchor || anchor.hasAttribute('download') || anchor.target === '_blank' || anchor === pending) return;
    let url; try {url=new URL(anchor.href,location.href);} catch {return;}
    if (url.origin !== location.origin || !url.pathname.endsWith('.html') || url.pathname === location.pathname) return;
    url.hash = ''; if (warmed.has(url.href) || warmed.size >= 2) return;
    clear(); pending=anchor;
    timer=setTimeout(()=>{
      if (!window.portfolioPerf.allowPrefetch || document.hidden || !anchor.matches(':hover')) return;
      warmed.add(url.href); const hint=document.createElement('link'); hint.rel='prefetch'; hint.href=url.href; document.head.append(hint);
      pending=null;
    },300);
  }, {passive:true});
  document.addEventListener('pointerout', event=>{if(pending && !pending.contains(event.relatedTarget))clear();},{passive:true});
  document.addEventListener('visibilitychange',clear);
})();
