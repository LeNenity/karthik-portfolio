/* Automatic, local-only quality adaptation. No user setting or tracking. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const memory = navigator.deviceMemory || Infinity, cores = navigator.hardwareConcurrency || Infinity;
  let level = memory <= 2 || cores <= 2 ? 2 : memory <= 4 || cores <= 4 ? 1 : 0;
  let bad = 0, cost = 0, costSamples = 0, last = 0, start = 0, frames = 0, slowFrames = 0, raf = 0;
  let timer = 0;
  function networkSlow() {
    return !!(connection && (connection.saveData || /^(slow-2g|2g|3g)$/.test(connection.effectiveType || '') ||
      (connection.downlink > 0 && connection.downlink < 1.5) || connection.rtt > 450));
  }
  function publish() {
    const previous = root.dataset.autoQuality;
    root.dataset.autoQuality = ['high','balanced','low'][level];
    root.dataset.network = networkSlow() ? 'slow' : 'normal';
    if (previous !== root.dataset.autoQuality) document.dispatchEvent(new Event('portfolio-quality-change'));
  }
  function stop() { cancelAnimationFrame(raf); clearTimeout(timer); raf = timer = 0; }
  function startSample() {
    stop(); if (document.hidden || reduced.matches || level === 2) return;
    last = start = frames = slowFrames = cost = costSamples = 0;
    raf = requestAnimationFrame(sample);
  }
  function sample(now) {
    if (document.hidden || reduced.matches) { stop(); return; }
    if (!start) start = now;
    if (last) { frames++; if (now-last > 26) slowFrames++; }
    last = now;
    if (now-start < 2400) { raf = requestAnimationFrame(sample); return; }
    raf = 0;
    const fps = frames * 1000 / Math.max(1, now-start);
    const poor = frames > 0 && (fps < 43 && slowFrames/frames > .35 || costSamples > 15 && cost/costSamples > 14);
    bad = poor ? bad+1 : 0;
    // Require sustained pressure, not a single startup or background-tab stall.
    if (bad >= 2 && level < 2) { level++; bad = 0; publish(); }
    if (level < 2) timer = setTimeout(startSample, poor ? 1600 : 12000);
  }
  window.portfolioPerf = {
    get level() { return level; },
    get slowNetwork() { return networkSlow(); },
    get allowPrefetch() { return !!(connection && connection.effectiveType === '4g' && !networkSlow()); },
    ratio(max) { return Math.min(devicePixelRatio || 1, max, [2,1,.75][level]); },
    interval(high, balanced, low) { return [high, balanced, low][level]; },
    paintCost(ms) { if (raf) {cost += ms; costSamples++;} }
  };
  publish();
  connection?.addEventListener?.('change', publish);
  reduced.addEventListener('change', startSample);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else startSample(); });
  // Let initial page layout settle before benchmarking animation performance.
  if (document.readyState !== 'loading') timer = setTimeout(startSample, 2200);
  else document.addEventListener('DOMContentLoaded', () => { timer = setTimeout(startSample, 2200); }, {once:true});
})();
