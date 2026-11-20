/* Original interaction layer: zero runtime dependencies, no external component code. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'), fine=matchMedia('(hover:hover) and (pointer:fine)');
 const selector='#hero-projects,.project-index-link,.about-resume-button,.contact-socials a,.cert-card-cta,.outpost-mission .upgrade-action,.case-primary-action';
 const excluded='.floating-header,.mobile-sidebar,#mobile-sidebar,.about-preview,.internship-cta,.theme-toggle,[data-carousel-step],.upgrade-options button';
 function eligible(el){return !el.closest(excluded)&& !/view (my )?internship/i.test(el.textContent);}
 const states=new Map(); let active=null,raf=0, pointerFrame=0, latestEvent=null, pressed=null;
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 function collect(){for(const el of document.querySelectorAll(selector)){if(states.has(el)||!eligible(el))continue;el.classList.add('upgrade-magnetic');states.set(el,{el,x:0,y:0,tx:0,ty:0});}}
 collect();
 function frame(){raf=0;let more=false;for(const s of states.values()){
  if(!s.el.isConnected)continue;
  s.x+=(s.tx-s.x)*.19;s.y+=(s.ty-s.y)*.19;
  const moving=Math.abs(s.x-s.tx)+Math.abs(s.y-s.ty)>.08;
  if(!moving){s.x=s.tx;s.y=s.ty;}
  if(s.x||s.y||moving){s.el.setAttribute('data-mag-active','');s.el.style.setProperty('--mag-x',s.x.toFixed(2)+'px');s.el.style.setProperty('--mag-y',s.y.toFixed(2)+'px');s.el.style.setProperty('--mag-inner-x',(s.x*.26).toFixed(2)+'px');s.el.style.setProperty('--mag-inner-y',(s.y*.26).toFixed(2)+'px');}
  else if(s.el.hasAttribute('data-mag-active')){s.el.removeAttribute('data-mag-active');for(const key of ['--mag-x','--mag-y','--mag-inner-x','--mag-inner-y'])s.el.style.removeProperty(key);}
  more||=moving;
 }if(more)raf=requestAnimationFrame(frame);}
 function wake(){if(!raf)raf=requestAnimationFrame(frame);}
 function reset(){pressed=null;latestEvent=null;active=null;for(const s of states.values()){s.tx=s.ty=0;}wake();}
 function position(e){if(pressed)return;if(reduced.matches||!fine.matches||e.pointerType==='touch'){reset();return;}const hit=e.target.closest?.(selector);let best=null,dist=Infinity,rect=null;
  // Use untranslated bounds to prevent a button chasing its own transform.
  for(const s of states.values()){
   if(!s.el.isConnected||!s.el.getClientRects().length||s.el.closest('[inert],[hidden]'))continue;
   const r=s.el.getBoundingClientRect(),l=r.left-s.x,t=r.top-s.y,w=r.width,h=r.height;
   if(w<18||h<12||r.bottom<0||r.top>innerHeight)continue;
   const dx=e.clientX-(l+w/2),dy=e.clientY-(t+h/2),d=Math.hypot(Math.max(Math.abs(dx)-w/2,0),Math.max(Math.abs(dy)-h/2,0));
   const large=s.el.matches('#hero-projects,.outpost-mission .upgrade-action,.outpost-page .case-primary-action');const radius=large?44:10;
   if(d<=radius&&(s.el===hit||d<dist)){best=s;dist=s.el===hit?-1:d;rect={dx,dy,w,h,large,radius,d};if(s.el===hit)break;}
  }
  if(active&&active!==best){active.tx=active.ty=0;}
  active=best;if(best){const {dx,dy,w,h,large,radius,d}=rect;const max=large?26:8;const strength=1-d/(radius+1);best.tx=clamp(dx/Math.max(w*.5,24)*max,-max,max)*strength;best.ty=clamp(dy/Math.max(h*.5,25)*max,-max,max)*strength;}
  wake();
 }
 document.addEventListener('pointermove',e=>{latestEvent=e;if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;if(latestEvent)position(latestEvent);});},{passive:true});document.documentElement.addEventListener('pointerleave',reset);window.addEventListener('blur',reset);window.addEventListener('scroll',reset,{passive:true});reduced.addEventListener('change',reset);fine.addEventListener('change',reset);document.addEventListener('visibilitychange',reset);
 // Hold the visual position from pointer-down to pointer-up so the target
 // cannot drift away during a click. Reset safely if the pointer is cancelled.
 document.addEventListener('pointerdown',e=>{const el=e.target.closest?.('.upgrade-magnetic');const s=states.get(el);if(s){pressed=s;s.tx=s.x;s.ty=s.y;}},{passive:true});
 window.addEventListener('pointerup',e=>{if(!pressed)return;pressed=null;position(e);},{passive:true});
 window.addEventListener('pointercancel',reset,{passive:true});
 // Dynamic shared navigation and featured carousel may be built after this script.
 window.addEventListener('load',collect,{once:true});
 function options(container,attribute,render){if(!container)return;const buttons=[...container.querySelectorAll('button')];function select(btn){buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));render(btn.dataset[attribute]);}buttons.forEach(b=>b.addEventListener('click',()=>select(b)));select(buttons.find(b=>b.getAttribute('aria-pressed')==='true')||buttons[0]);}
 function chart(el,rows,max,format){if(!el)return;el.replaceChildren();for(const [label,v,qualifier] of rows){const row=document.createElement('div');row.className='upgrade-chart-row';const line=document.createElement('div');line.className='upgrade-chart-label';const name=document.createElement('span'),value=document.createElement('strong');name.textContent=label;value.textContent=qualifier||format(v);line.append(name,value);const track=document.createElement('div');track.className='upgrade-track';track.setAttribute('aria-hidden','true');const bar=document.createElement('div');bar.className='upgrade-bar';bar.style.width=(v/max*100)+'%';track.append(bar);row.append(line,track);el.append(row);}}
 const models=[['Original Decision Tree',84.62,.90,100],['Tuned Decision Tree',84.62,.90,98.08],['Original AdaBoost',79.49,.86,100],['Tuned AdaBoost',94.87,.97,100]];
 options(document.querySelector('[data-metric-options]'),'metric',key=>{const n=key==='f1'?2:key==='training'?3:1;chart(document.querySelector('[data-metric-chart]'),models.map(m=>[m[0],m[n]]),key==='f1'?1:100,v=>key==='f1'?v.toFixed(2):v.toFixed(2)+'%');});
 const roads={deaths:[[['2006',4.7],['2016',2.2]],'Reported road traffic death rate.'],injuries:[[['2008',12.2],['2016',10.3]],'Reported road traffic injury-rate measure.'],conditions:[[['2013',16],['2016 onward',5,'≤5']],'Five is the reported upper bound for annual road-condition accidents from 2016 onward.']};
 options(document.querySelector('[data-road-options]'),'road',key=>{const [rows,note]=roads[key];chart(document.querySelector('[data-road-chart]'),rows,Math.max(...rows.map(r=>r[1]))*1.12,v=>String(v));document.querySelector('[data-road-note]').textContent=note;});
})();

// Project-specific evidence explorers. All calculations use documented inputs.
(()=>{
 const q=(selector)=>document.querySelector(selector), put=(selector,value)=>{const node=q(selector);if(node)node.textContent=value;};
 function options(selector,attr,render){const group=q(selector);if(!group)return;const btns=[...group.querySelectorAll('button')];function choose(b){btns.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render(b.dataset[attr]);}btns.forEach(b=>b.addEventListener('click',()=>choose(b)));choose(btns.find(b=>b.getAttribute('aria-pressed')==='true')||btns[0]);}
 const confusion={tree:[7,3,3,26],boost:[9,1,1,28]};options('[data-confusion-options]','model',key=>{const values=confusion[key];values.forEach((v,i)=>put('[data-cell="'+i+'"]',v));const correct=values[0]+values[3];put('[data-confusion-note]',correct+' correct · '+(39-correct)+' errors · '+(100*correct/39).toFixed(2)+'% test accuracy');});
 // Do not leave a broken image when the external screenshot host is unavailable.
 document.querySelectorAll('[data-remote-game]').forEach(img=>{function fail(){if(img.dataset.failed)return;img.dataset.failed='true';img.src='assets/outpost-07-cover.svg';img.alt='Illustrated mission cover; external gameplay image unavailable';const caption=img.closest('figure')?.querySelector('figcaption');if(caption)caption.textContent+=' · External image unavailable; open the original link.';}img.addEventListener('error',fail);if(img.complete&&!img.naturalWidth)fail();});
})();
