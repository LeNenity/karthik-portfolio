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
