
(() => {
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const root=document.documentElement,themeButton=document.getElementById('theme-toggle'),themeIcon=document.getElementById('theme-icon');
function setTheme(theme){root.dataset.theme=theme;themeButton?.setAttribute('aria-label',theme==='dark'?'Switch to beige mode':'Switch to warm dark mode');themeIcon?.setAttribute('icon',theme==='dark'?'lucide:sun':'lucide:moon');try{localStorage.setItem('karthik-beige-theme',theme);}catch{}}
let savedTheme;try{savedTheme=localStorage.getItem('karthik-beige-theme');}catch{}setTheme(savedTheme==='dark'?'dark':'light');themeButton?.addEventListener('click',()=>setTheme(root.dataset.theme==='dark'?'light':'dark'));
const loader=document.getElementById('page-loader');
if(loader){
  document.body.classList.add('is-loading');
  const count=loader.querySelector('#loader-count');
  const started=performance.now();
  let pageReady=document.readyState==='complete';
  let lastValue=-1;
  addEventListener('load',()=>{pageReady=true;},{once:true});
  const fallback=setTimeout(()=>{pageReady=true;},4500);
  function updateLoader(now){
    const elapsed=now-started;
    const minimum=motion.matches?0:1200;
    const target=pageReady
      ? elapsed>=minimum?100:Math.min(99,Math.floor(elapsed/minimum*95))
      : Math.min(92,Math.floor(92*(1-Math.exp(-elapsed/700))));
    const value=Math.max(lastValue,target);
    if(value!==lastValue){
      count.textContent=String(value).padStart(3,'0');
      loader.style.setProperty('--loader-progress',value+'%');
      lastValue=value;
    }
    if(value===100){
      clearTimeout(fallback);
      const finishLoader=()=>{
        loader.remove();
        document.body.classList.remove('is-loading');
      };
      if(motion.matches){finishLoader();return;}
      setTimeout(()=>{
        loader.addEventListener('transitionend',event=>{
          if(event.target===loader&&event.propertyName==='transform')finishLoader();
        });
        loader.classList.add('is-complete');
        setTimeout(finishLoader,1000);
      },120);
    }else requestAnimationFrame(updateLoader);
  }
  requestAnimationFrame(updateLoader);
}

const menuToggle=document.getElementById('menu-toggle');
const menuClose=document.getElementById('menu-close');
const sidebar=document.getElementById('mobile-sidebar');
const sidebarBackdrop=document.getElementById('sidebar-backdrop');
const sidebarThemeToggle=document.getElementById('sidebar-theme-toggle');
function setSidebarOpen(open){
  document.body.classList.toggle('menu-open',open);
  sidebar.hidden=!open;
  sidebarBackdrop.hidden=!open;
  menuToggle?.setAttribute('aria-expanded',String(open));
  if(open){menuClose?.focus({preventScroll:true});}
}
menuToggle?.addEventListener('click',()=>setSidebarOpen(sidebar.hidden));
menuClose?.addEventListener('click',()=>setSidebarOpen(false));
sidebarBackdrop?.addEventListener('click',()=>setSidebarOpen(false));
sidebarThemeToggle?.addEventListener('click',()=>themeButton.click());
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!sidebar.hidden)setSidebarOpen(false);});
sidebar?.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>setSidebarOpen(false)));

// Decorative atmosphere. The weather cycle is fictional artwork, not live local weather.
const weatherRain=document.getElementById('weather-rain');
const weatherSnow=document.getElementById('weather-snow');
const weatherSplashes=document.getElementById('weather-splashes');
const weatherModes=['clear','sunrays','rain','snow','mist'];
let weatherIndex=0,weatherTimer=null,weatherFadeTimer=null;
function populateWeather(){
  if(weatherRain && !weatherRain.childElementCount){
    for(let i=0;i<42;i++){
      const drop=document.createElement('span');
      drop.style.left=(Math.random()*100).toFixed(2)+'%';
      drop.style.animationDuration=(.82+Math.random()*.72).toFixed(2)+'s';
      drop.style.animationDelay=(-Math.random()*2).toFixed(2)+'s';
      drop.style.height=(32+Math.random()*56).toFixed(0)+'px';
      drop.style.opacity=(.18+Math.random()*.38).toFixed(2);
      weatherRain.appendChild(drop);
    }
  }
  if(weatherSnow && !weatherSnow.childElementCount){
    for(let i=0;i<44;i++){
      const flake=document.createElement('span');
      const size=2+Math.random()*4.5;
      flake.style.left=(Math.random()*100).toFixed(2)+'%';
      flake.style.width=size.toFixed(2)+'px';flake.style.height=size.toFixed(2)+'px';
      flake.style.animationDuration=(7+Math.random()*10).toFixed(2)+'s';
      flake.style.animationDelay=(-Math.random()*15).toFixed(2)+'s';
      flake.style.opacity=(.20+Math.random()*.6).toFixed(2);
      flake.style.setProperty('--snow-drift',(Math.random()*90-45).toFixed(1)+'px');
      weatherSnow.appendChild(flake);
    }
  }
  if(weatherSplashes && !weatherSplashes.childElementCount){
    for(let i=0;i<19;i++){
      const splash=document.createElement('span');
      splash.style.left=(4+i*5.0+Math.random()*2).toFixed(1)+'%';
      splash.style.bottom=(4+Math.random()*22).toFixed(1)+'px';
      splash.style.animationDelay=(-Math.random()*2.2).toFixed(2)+'s';
      splash.style.animationDuration=(1.15+Math.random()*.85).toFixed(2)+'s';
      weatherSplashes.appendChild(splash);
    }
  }
}
function setWeather(mode,immediate=false){
  clearTimeout(weatherFadeTimer);
  if(immediate||motion.matches||root.dataset.weather===mode){
    root.dataset.weather=mode;
    return;
  }
  // Let the outgoing scene fully soften before revealing the next one.
  root.dataset.weather='clear';
  weatherFadeTimer=setTimeout(()=>{
    root.dataset.weather=mode;
  },1350);
}
function startWeatherCycle(){
  clearTimeout(weatherFadeTimer);
  if(weatherTimer!==null){clearInterval(weatherTimer);weatherTimer=null;}
  populateWeather();
  // Both themes share the same scene cycle; CSS adapts colours to each theme.
  setWeather(weatherModes[weatherIndex],true);
  if(motion.matches)return;
  weatherTimer=setInterval(()=>{
    if(document.hidden||activeSection!=='home'||isDetail)return;
    weatherIndex=(weatherIndex+1)%weatherModes.length;
    setWeather(weatherModes[weatherIndex]);
  },10000);
}
const themeObserver=new MutationObserver(startWeatherCycle);
themeObserver.observe(root,{attributes:true,attributeFilter:['data-theme']});
motion.addEventListener('change',startWeatherCycle);


const projectData=[
  {slug:'data-engineering',category:'Data engineering',title:'NESSO Safety Monitoring System',name:'NESSO Safety Monitoring System',image:'assets/project-data.jpg',summary:'We used four NESSO devices to collect movement readings and flag possible safety incidents.',mapPosition:[24,55],topics:['sensors','ble','python','mysql','powerbi']},
  {slug:'engineering-exploration',category:'Engineering exploration',title:'Engineering Exploration Project',name:'Engineering Exploration Project',image:'assets/project-engineering.jpg',summary:'Our small-scale tri-star wheel prototype, with an Arduino-controlled motor circuit.',mapPosition:[58,42],topics:['mechanical','arduino','prototype']},
  {slug:'iot-sustainable-living',category:'Internet of Things',title:'IoT System for Sustainable Household Living',name:'IoT System for Sustainable Household Living',image:'assets/iot-hardware-workbench.webp',summary:'Four sensor functions for ventilation, lighting, soil moisture and doorway alerts.',mapPosition:[77,61],topics:['sensors','arduino']},
  {slug:'cloud-computing',category:'Cloud Computing',title:'AWS Music Store Web Application',name:'AWS Music Store Web Application',image:'assets/cloud-storefront-1.webp',summary:'A nine-instrument catalogue on AWS, with MySQL product data and S3 images.',mapPosition:[77,-43],topics:['aws','ec2','rds','monitoring']},
  {slug:'road-safety',number:'06',category:'Data & analytics',title:'Road Safety & Infrastructure Analysis',name:'Road Safety & Infrastructure Analysis',image:'assets/road-safety-cover.webp',summary:'My Power BI analysis of Singapore road infrastructure, accidents, injuries and deaths.',mapPosition:[-58,18],topics:['powerbi']}
];
const projectMapTopics=[
  {id:'python',label:'Python',coords:[5,-30]},
  {id:'mysql',label:'MySQL',coords:[-39,-48]},
  {id:'powerbi',label:'Power BI',coords:[-8,8]},
  {id:'mechanical',label:'Mechanical design',coords:[54,43]},
  {id:'arduino',label:'Arduino Uno',coords:[33,-17]},
  {id:'prototype',label:'Prototyping',coords:[24,7]},
  {id:'sensors',label:'Sensors',coords:[27,61]},
  {id:'aws',label:'AWS Cloud',coords:[-28,-124]},
  {id:'ec2',label:'EC2 & Scaling',coords:[29,-128]},
  {id:'rds',label:'RDS Multi-AZ',coords:[-48,-134]},
  {id:'monitoring',label:'CloudWatch',coords:[-4,-149]},
  {id:'ble',label:'Bluetooth LE',coords:[7,34]}
];
// A rotating constellation of project hubs and their related skills.
const mapStage=document.getElementById('project-map-stage');
const mapCanvas=document.getElementById('project-globe-canvas');
const mapNodes=document.getElementById('project-map-nodes');
if(mapStage && mapCanvas && mapNodes){
  const context=mapCanvas.getContext('2d',{alpha:true});
  const rad=Math.PI/180;
  const sph=(lat,lon)=>({x:Math.cos(lat*rad)*Math.sin(lon*rad),y:-Math.sin(lat*rad),z:Math.cos(lat*rad)*Math.cos(lon*rad)});
  const geo={
    'data-engineering':[-14,-39],
    'engineering-exploration':[52,-5],
    'iot-sustainable-living':[-7,62],
    'cloud-computing':[2,-122],
    'road-safety':[-28,112]
  };
  const globeProjects=projectData.filter(project=>Array.isArray(geo[project.slug]));
  const activeTopicIds=new Set(globeProjects.flatMap(project=>project.topics||[]));
  const globeTopics=projectMapTopics.filter(topic=>activeTopicIds.has(topic.id));
  const globeNodes=[
    ...globeProjects.map(project=>({id:project.slug,label:project.title,project,coords:sph(...geo[project.slug])})),
    ...globeTopics.map(topic=>({id:topic.id,label:topic.label,coords:sph(...topic.coords)}))
  ];
  const byId=new Map(globeNodes.map(node=>[node.id,node]));
  const edges=globeProjects.flatMap(project=>(project.topics||[]).filter(t=>byId.has(t)).map(topic=>[byId.get(project.slug),byId.get(topic)]));
  for(let i=0;i<globeProjects.length;i++){
    edges.push([byId.get(globeProjects[i].slug),byId.get(globeProjects[(i+1)%globeProjects.length].slug)]);
  }
  const labels=new Map(),labelSizes=new Map();
  globeNodes.forEach(node=>{
    const element=document.createElement(node.project?'a':'span');
    element.className='project-globe-label '+(node.project?'project-globe-label--project':'project-globe-label--topic');
    element.textContent=node.label;
    if(node.project){element.href='#project-'+node.id;element.setAttribute('aria-label','Open '+node.project.name);}
    else element.setAttribute('aria-hidden','true');
    mapNodes.append(element);labels.set(node.id,element);
  });
  const stars=Array.from({length:145},(_,i)=>({
    x:((i*47.41+17.3)%100)/100,y:((i*29.73+8.8)%100)/100,
    r:i%11===0?1.2:i%4===0?.85:.45,a:.10+(i%7)*.045
  }));
  let width=0,height=0,radius=0,cx=0,cy=0,dpr=1;
  let yaw=-.08,pitch=-.04,velocity=.0022,pitchVelocity=0;
  let hovering=false,overLabel=false,dragging=false,moved=false,gesture=null;
  let targetPitch=-.04;
  let pointerX=0,pointerY=0,visible=true,frameId=0,lastTime=0;
  const calm=()=>motion.matches;
  const norm=(p)=>{
    const ya=yaw,pi=pitch;
    const x=p.x*Math.cos(ya)+p.z*Math.sin(ya);
    const z=p.z*Math.cos(ya)-p.x*Math.sin(ya);
    return {x,y:p.y*Math.cos(pi)-z*Math.sin(pi),z:p.y*Math.sin(pi)+z*Math.cos(pi)};
  };
  const proj=p=>{
    const q=norm(p),scale=1+q.z*.16;
    return {x:cx+q.x*radius*scale,y:cy+q.y*radius*scale,z:q.z,scale};
  };
  function sizeGlobe(){
    labelSizes.clear();
    const r=mapStage.getBoundingClientRect();
    width=Math.max(100,r.width);height=Math.max(200,r.height);
    dpr=Math.min(devicePixelRatio||1,2);
    mapCanvas.width=Math.round(width*dpr);mapCanvas.height=Math.round(height*dpr);
    mapCanvas.style.width=width+'px';mapCanvas.style.height=height+'px';
    context.setTransform(dpr,0,0,dpr,0,0);
    radius=Math.min(width*.35,height*.43,310);
    if(width<620)radius=Math.min(width*.40,height*.42,170);
    cx=width*.5;cy=height*.5;
    draw();
  }
  function circle(x,y,r,color){context.beginPath();context.arc(x,y,r,0,Math.PI*2);context.fillStyle=color;context.fill();}
  // Sample links in 3D so their arcs retain depth as the constellation rotates.
  function sphericalCurve(a,b,alpha){
    const dot=Math.max(-1,Math.min(1,a.x*b.x+a.y*b.y+a.z*b.z));
    const omega=Math.acos(dot),denom=Math.sin(omega)||1;
    const at=t=>{
      const s0=omega<.0001?1-t:Math.sin((1-t)*omega)/denom;
      const s1=omega<.0001?t:Math.sin(t*omega)/denom;
      return proj({x:a.x*s0+b.x*s1,y:a.y*s0+b.y*s1,z:a.z*s0+b.z*s1});
    };
    for(let i=0;i<28;i++){
      const p=at(i/28),q=at((i+1)/28);
      const depth=Math.max(.12,Math.min(1,((p.z+q.z)*.5+1)/1.8));
      context.beginPath();context.moveTo(p.x,p.y);context.lineTo(q.x,q.y);
      context.strokeStyle='rgba(210,210,210,'+(alpha*depth).toFixed(3)+')';
      context.lineWidth=.7;context.stroke();
    }
  }
  function draw(){
    if(!context||!width)return;
    context.clearRect(0,0,width,height);
    for(const star of stars)circle(star.x*width,star.y*height,star.r,'rgba(220,220,220,'+star.a+')');
    for(const [a,b] of edges)sphericalCurve(a.coords,b.coords,(a.project&&b.project)? .23:.30);
    const projected=globeNodes.map(node=>({node,p:proj(node.coords)}));
    for(const {node,p} of [...projected].sort((a,b)=>a.p.z-b.p.z)){
      const depth=Math.max(.12,(p.z+1)/2);
      if(node.project){
        circle(p.x,p.y,7,'rgba(230,230,230,'+(.03+.04*depth).toFixed(3)+')');
        circle(p.x,p.y,4.2+1.2*depth,'rgba(245,245,245,'+(.25+.75*depth).toFixed(3)+')');
      }else circle(p.x,p.y,1.7+1.1*depth,'rgba(220,220,220,'+(.18+.62*depth).toFixed(3)+')');
    }
    // Place project names first, then fit supporting labels around them.
    // The remaining dots and links stay visible when a label needs more room.
    const occupied=[];
    projected.sort((a,b)=>Number(!!b.node.project)-Number(!!a.node.project)||b.p.z-a.p.z);
    for(const {node,p} of projected){
      const label=labels.get(node.id);
      if(!labelSizes.has(node.id))labelSizes.set(node.id,{w:label.offsetWidth||130,h:label.offsetHeight||18});
      const {w,h}=labelSizes.get(node.id);
      let shown=node.project?p.z>-.12:p.z>-.15;
      const clampX=x=>Math.max(8,Math.min(width-w-8,x));
      const clampY=y=>Math.max(8,Math.min(height-h-8,y));
      const positions=[
        {x:clampX(p.x-w/2),y:clampY(p.y+13)},
        {x:clampX(p.x-w/2),y:clampY(p.y-h-13)},
        {x:clampX(p.x+14),y:clampY(p.y-h/2)},
        {x:clampX(p.x-w-14),y:clampY(p.y-h/2)},
        {x:clampX(p.x+16),y:clampY(p.y+13)},
        {x:clampX(p.x-w-16),y:clampY(p.y+13)},
        {x:clampX(p.x+16),y:clampY(p.y-h-13)},
        {x:clampX(p.x-w-16),y:clampY(p.y-h-13)}
      ];
      const free=positions.find(box=>!occupied.some(other=>box.x<other.x+other.w+9&&box.x+w+9>other.x&&box.y<other.y+other.h+8&&box.y+h+8>other.y));
      const box=free||positions[0];
      // Never stack labels on each other: hide crowded/back-facing names
      // until rotation gives them enough room again.
      if(!free)shown=false;
      if(shown)occupied.push({...box,w,h});
      label.style.left=box.x+'px';label.style.top=box.y+'px';label.style.transform='none';
      label.style.opacity=shown?String(Math.min(1,.32+(p.z+1)*.34)):'0';
      label.style.visibility=shown?'visible':'hidden';
      if(node.project){label.tabIndex=shown?0:-1;label.style.zIndex=String(Math.round((p.z+1)*10));}
    }
  }
  function animate(time){
    frameId=0;
    if(!visible||document.hidden)return;
    const dt=Math.min(2.5,Math.max(.1,(time-lastTime)/16.667||1));lastTime=time;
    if(!dragging){
      let target=.0022;
      if(hovering&&!overLabel)target=((pointerX/width)-.5)*.021;
      if(overLabel)target=0;
      velocity+=(target-velocity)*.034*dt;
      yaw+=velocity*dt;
      if(hovering&&!overLabel){
        targetPitch=Math.max(-.55,Math.min(.55,(.5-pointerY/height)*.52));
        pitch+=(targetPitch-pitch)*.014*dt;
      }
      pitch+=pitchVelocity*dt;
      pitchVelocity*=Math.pow(.92,dt);
      pitch=Math.max(-.95,Math.min(.95,pitch));
    }
    draw();
    if(!calm())frameId=requestAnimationFrame(animate);
  }
  function restart(){if(!frameId&&!calm()&&visible&&!document.hidden){lastTime=performance.now();frameId=requestAnimationFrame(animate);}else if(calm())draw();}
  function point(event){const r=mapStage.getBoundingClientRect();return {x:event.clientX-r.left,y:event.clientY-r.top};}
  mapStage.addEventListener('pointerenter',e=>{hovering=true;const p=point(e);pointerX=p.x;pointerY=p.y;restart();});
  mapStage.addEventListener('pointerleave',()=>{hovering=false;overLabel=false;if(!dragging)velocity=.0022;});
  mapStage.addEventListener('pointerdown',e=>{
    if(e.button!==0||e.target.closest('a,button'))return;
    const p=point(e);gesture={x:p.x,y:p.y,lastX:p.x,lastY:p.y};
    moved=false;dragging=true;
    mapStage.setPointerCapture(e.pointerId);
    mapStage.classList.add('is-dragging');
  });
  mapStage.addEventListener('pointermove',e=>{
    const p=point(e);pointerX=p.x;pointerY=p.y;
    if(!dragging||!gesture)return;
    const dx=p.x-gesture.lastX,dy=p.y-gesture.lastY;
    gesture.lastX=p.x;gesture.lastY=p.y;
    if(Math.hypot(p.x-gesture.x,p.y-gesture.y)>5)moved=true;
    yaw+=dx*.0083;pitch=Math.max(-.95,Math.min(.95,pitch+dy*.006));
    velocity=Math.max(-.055,Math.min(.055,dx*.004));
    pitchVelocity=Math.max(-.018,Math.min(.018,dy*.0018));
    draw();restart();
  });
  const stopDrag=()=>{if(!dragging)return;dragging=false;gesture=null;mapStage.classList.remove('is-dragging');restart();};
  mapStage.addEventListener('pointerup',stopDrag);
  mapStage.addEventListener('pointercancel',stopDrag);
  mapStage.addEventListener('lostpointercapture',stopDrag);
  mapStage.addEventListener('click',e=>{
    if(moved){e.preventDefault();e.stopPropagation();moved=false;}
  },true);
  mapNodes.addEventListener('pointerover',e=>{if(e.target.closest('a')){overLabel=true;velocity=0;}});
  mapNodes.addEventListener('pointerout',e=>{if(e.target.closest('a'))overLabel=false;});
  mapNodes.addEventListener('focusin',()=>{overLabel=true;});
  mapNodes.addEventListener('focusout',()=>{overLabel=false;});
  mapStage.addEventListener('keydown',e=>{
    if(e.target!==mapStage)return;
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'||e.key==='ArrowUp'||e.key==='ArrowDown'){
      e.preventDefault();yaw+=(e.key==='ArrowLeft'?.18:e.key==='ArrowRight'?-.18:0);
      pitch+=e.key==='ArrowUp'?.12:e.key==='ArrowDown'?-.12:0;
      pitch=Math.max(-.95,Math.min(.95,pitch));draw();restart();
    }
  });
  mapStage.tabIndex=0;
  mapStage.setAttribute('aria-label','Interactive project globe. Drag to rotate, use arrow keys to turn, or open a visible project name.');
  new ResizeObserver(sizeGlobe).observe(mapStage);
  document.fonts?.ready.then(sizeGlobe);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)restart();else if(frameId){cancelAnimationFrame(frameId);frameId=0;}},{threshold:0}).observe(mapStage);
  motion.addEventListener('change',()=>{if(calm()&&frameId){cancelAnimationFrame(frameId);frameId=0;draw();}else restart();});
  sizeGlobe();restart();
}
// A fixed three-card project gallery. The cards never leave their columns:
// their photographs are revealed in place, inspired by editorial image transitions.
const projectRail=document.getElementById('project-rail');
const projectSection=document.getElementById('projects');
const galleryMotion=matchMedia('(prefers-reduced-motion: reduce)');
const galleryPreloads=projectData.map(project=>{const image=new Image();image.src=project.image;image.decode?.().catch(()=>{});return image;});
function makeProjectCard(project,index){
  const card=document.createElement('a');
  card.className='project-card';
  card.href='#project-'+project.slug;
  card.setAttribute('aria-label','Open '+project.name);
  const cover=document.createElement('div');cover.className='project-cover';
  const image=document.createElement('img');image.src=project.image;image.alt=project.name;image.loading='eager';image.width=800;image.height=600;image.dataset.cover=project.slug;
  const imageCta=document.createElement('span');imageCta.className='project-image-cta';imageCta.setAttribute('aria-hidden','true');imageCta.textContent='View project ↗';
  cover.append(image,imageCta);
  const copy=document.createElement('div');copy.className='project-card-copy';
  const meta=document.createElement('div');meta.className='project-meta';
  const number=document.createElement('span');number.textContent=project.number||String(index+1).padStart(2,'0');
  const category=document.createElement('span');category.textContent=project.category;
  meta.append(number,category);
  const title=document.createElement('h3');title.textContent=project.title;
  const summary=document.createElement('p');summary.textContent=project.summary;
  const link=document.createElement('span');link.className='project-open';link.innerHTML='View project <span aria-hidden="true">↗</span>';
  copy.append(meta,title,summary,link);card.append(cover,copy);
  return card;
}
const galleryCount=Math.min(3,projectData.length);
const galleryCards=Array.from({length:galleryCount},(_,i)=>makeProjectCard(projectData[i],i));
projectRail.replaceChildren(...galleryCards);
projectRail.setAttribute('aria-roledescription','rotating gallery');
let galleryIndex=0, galleryBusy=false, galleryVisible=false, galleryHovered=false, galleryFocused=false;
let galleryLoopTimer=null, galleryTransitionToken=0;
function setGalleryCardData(card,project,index,updateImage=true){
  card.href='#project-'+project.slug;
  card.setAttribute('aria-label','Open '+project.name);
  const image=card.querySelector('.project-cover img:not(.project-cover-reveal)');
  if(updateImage){image.src=project.image;image.alt=project.name;image.dataset.cover=project.slug;}
  card.querySelector('.project-meta span:first-child').textContent=project.number||String(index+1).padStart(2,'0');
  card.querySelector('.project-meta span:last-child').textContent=project.category;
  card.querySelector('.project-card-copy h3').textContent=project.title;
  card.querySelector('.project-card-copy p').textContent=project.summary;
}
function advanceGallery(direction=1){
  if(galleryBusy||projectData.length<=galleryCount)return;
  galleryBusy=true;
  const token=++galleryTransitionToken;
  galleryIndex=(galleryIndex+direction+projectData.length)%projectData.length;
  let settled=0;
  galleryCards.forEach((card,slot)=>{
    const nextIndex=(galleryIndex+slot)%projectData.length;
    const nextProject=projectData[nextIndex];
    const cover=card.querySelector('.project-cover');
    const copy=card.querySelector('.project-card-copy');
    const delay=galleryMotion.matches?0:slot*90;
    setTimeout(()=>{
      if(token!==galleryTransitionToken)return;
      if(galleryMotion.matches){setGalleryCardData(card,nextProject,nextIndex);settled++;if(settled===galleryCount)galleryBusy=false;return;}
      card.classList.add('gallery-is-transitioning');
      copy.classList.add('gallery-copy-exit');
      const incoming=document.createElement('img');
      incoming.className='project-cover-reveal';
      incoming.src=nextProject.image; incoming.alt='';incoming.setAttribute('aria-hidden','true');
      incoming.width=800;incoming.height=600;
      cover.append(incoming);
      // Images are predecoded before cycling; no network wait or layout measurement.
      incoming.classList.add('is-unveiling');
      setTimeout(()=>{
        if(token!==galleryTransitionToken)return;
        setGalleryCardData(card,nextProject,nextIndex,false);
        copy.classList.remove('gallery-copy-exit');
        copy.classList.add('gallery-copy-enter');
        setTimeout(()=>copy.classList.remove('gallery-copy-enter'),600);
      },190);
      setTimeout(()=>{
        if(token!==galleryTransitionToken)return;
        setGalleryCardData(card,nextProject,nextIndex,true);
        incoming.remove();
        card.classList.remove('gallery-is-transitioning');
        settled++;
        if(settled===galleryCount)galleryBusy=false;
      },920);
    },delay);
  });
}
function pauseGalleryLoop(){
  if(galleryLoopTimer!==null){clearInterval(galleryLoopTimer);galleryLoopTimer=null;}
}
function startGalleryLoop(){
  if(galleryLoopTimer!==null||galleryMotion.matches||!galleryVisible||galleryHovered||galleryFocused||document.hidden)return;
  galleryLoopTimer=setInterval(()=>{
    if(!galleryBusy&&!galleryHovered&&!galleryFocused&&!document.hidden&&galleryVisible)advanceGallery();
  },4300);
}
projectRail.addEventListener('pointerenter',()=>{galleryHovered=true;pauseGalleryLoop();});
projectRail.addEventListener('pointerleave',()=>{galleryHovered=false;startGalleryLoop();});
projectRail.addEventListener('focusin',()=>{galleryFocused=true;pauseGalleryLoop();});
projectRail.addEventListener('focusout',e=>{if(!projectRail.contains(e.relatedTarget)){galleryFocused=false;startGalleryLoop();}});
projectRail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
  e.preventDefault();advanceGallery(e.key==='ArrowRight'?1:-1);
}});
// Trackpad horizontal scrolling / Shift+wheel rotates through the fixed project
// positions. Normal vertical scrolling still scrolls the page.
let galleryLastGesture=0;
projectRail.addEventListener('wheel',e=>{
  const horizontal=Math.abs(e.deltaX)>Math.abs(e.deltaY)*1.1;
  if(!horizontal&&!e.shiftKey)return;
  e.preventDefault();
  if(performance.now()-galleryLastGesture<1050)return;
  const delta=horizontal?e.deltaX:e.deltaY;
  if(Math.abs(delta)<8)return;
  galleryLastGesture=performance.now();
  advanceGallery(delta>0?1:-1);
},{passive:false});
let galleryTouchStart=null;
projectRail.addEventListener('touchstart',e=>{
  if(e.touches.length!==1)return;
  galleryTouchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};
},{passive:true});
projectRail.addEventListener('touchend',e=>{
  if(!galleryTouchStart||!e.changedTouches.length)return;
  const dx=e.changedTouches[0].clientX-galleryTouchStart.x;
  const dy=e.changedTouches[0].clientY-galleryTouchStart.y;
  galleryTouchStart=null;
  if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3){
    advanceGallery(dx<0?1:-1);
  }
},{passive:true});
new IntersectionObserver(([entry])=>{galleryVisible=entry.isIntersecting;if(galleryVisible)startGalleryLoop();else pauseGalleryLoop();},{threshold:.05}).observe(projectRail);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGalleryLoop();else startGalleryLoop();});
galleryMotion.addEventListener('change',()=>{if(galleryMotion.matches)pauseGalleryLoop();else startGalleryLoop();});
const sectionNames=['home','about','projects','contact'];
const main=document.getElementById('main-content'),detail=document.getElementById('project-detail');
let activeSection='home',isDetail=false,previousMainScroll=0,initialNavigation=true,heldTriggered=false;
startWeatherCycle();
// The desktop rail follows the current page: homepage sections on the homepage,
// or the sections of the active case study when a project is open.
const sectionRail=document.querySelector('.section-rail');
const homeRailHTML=sectionRail?.innerHTML||'';
let detailRailTargets=[];
const projectRailSections={
  "data-engineering": [
    [
      "Overview",
      ".project-summary"
    ],
    [
      "The problem",
      "[data-detail-section=\"1\"]"
    ],
    [
      "The solution",
      "[data-detail-section=\"2\"]"
    ],
    [
      "What I worked on",
      "[data-detail-section=\"3\"]"
    ],
    [
      "Technologies",
      "[data-detail-section=\"4\"]"
    ],
    [
      "Outcome",
      "[data-detail-section=\"5\"]"
    ]
  ],
  "engineering-exploration": [
    [
      "Overview",
      ".project-summary"
    ],
    [
      "The problem",
      "[data-detail-section=\"1\"]"
    ],
    [
      "The solution",
      "[data-detail-section=\"2\"]"
    ],
    [
      "What I worked on",
      "[data-detail-section=\"3\"]"
    ],
    [
      "Technologies",
      "[data-detail-section=\"4\"]"
    ],
    [
      "Outcome",
      "[data-detail-section=\"5\"]"
    ]
  ],
  "iot-sustainable-living": [
    [
      "Overview",
      ".project-summary"
    ],
    [
      "The problem",
      "[data-detail-section=\"1\"]"
    ],
    [
      "The solution",
      "[data-detail-section=\"2\"]"
    ],
    [
      "What I worked on",
      "[data-detail-section=\"3\"]"
    ],
    [
      "Technologies",
      "[data-detail-section=\"4\"]"
    ],
    [
      "Outcome",
      "[data-detail-section=\"5\"]"
    ]
  ],
  "cloud-computing": [
    [
      "Overview",
      ".project-summary"
    ],
    [
      "The problem",
      "[data-detail-section=\"1\"]"
    ],
    [
      "The solution",
      "[data-detail-section=\"2\"]"
    ],
    [
      "What I worked on",
      "[data-detail-section=\"3\"]"
    ],
    [
      "Technologies",
      "[data-detail-section=\"4\"]"
    ],
    [
      "Outcome",
      "[data-detail-section=\"5\"]"
    ]
  ],
  "road-safety": [
    [
      "Overview",
      ".project-summary"
    ],
    [
      "The problem",
      "[data-detail-section=\"1\"]"
    ],
    [
      "The solution",
      "[data-detail-section=\"2\"]"
    ],
    [
      "What I worked on",
      "[data-detail-section=\"3\"]"
    ],
    [
      "Technologies",
      "[data-detail-section=\"4\"]"
    ],
    [
      "Outcome",
      "[data-detail-section=\"5\"]"
    ]
  ]
};
function paintRail(activeIndex){
  if(!sectionRail)return;
  const links=[...sectionRail.querySelectorAll('a')];
  const widths=[60,42,27,14];
  links.forEach((link,index)=>{
    if(index===activeIndex)link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
    link.style.setProperty('--rail-width',widths[Math.min(3,Math.abs(index-activeIndex))]+'px');
  });
}
function showHomeRail(){
  if(!sectionRail)return;
  sectionRail.hidden=false;
  delete sectionRail.dataset.railMode;
  sectionRail.innerHTML=homeRailHTML;
  sectionRail.setAttribute('aria-label','Section shortcuts');
  detailRailTargets=[];
}
function showProjectRail(project){
  if(!sectionRail)return;
  sectionRail.hidden=true;
  sectionRail.dataset.railMode='project';
  const sections=projectRailSections[project.slug]||[];
  detailRailTargets=sections.map(([label,selector],index)=>{
    const target=detail.querySelector(selector);
    if(!target)return null;
    const id=`case-${project.slug}-section-${index+1}`;
    target.id=id;
    return {id,label,target};
  }).filter(Boolean);
  sectionRail.setAttribute('aria-label',`${project.name} sections`);
  sectionRail.innerHTML=detailRailTargets.map(({id,label},index)=>
    `<a href="#${id}" data-detail-rail="${id}" aria-label="${index===0?'Overview':String(index).padStart(2,'0')+' '+label}"><span class="rail-number" aria-hidden="true">${String(index).padStart(2,'0')}</span><span class="rail-stroke" aria-hidden="true"></span><span class="rail-name">${label}</span></a>`
  ).join('');
  paintRail(0);
}
function updateProjectRailPosition(){
  if(!isDetail||!detailRailTargets.length)return;
  const cutoff=innerHeight*.40;
  let current=0;
  detailRailTargets.forEach(({target},index)=>{
    if(target.getBoundingClientRect().top<=cutoff)current=index;
  });
  paintRail(current);
}
sectionRail?.addEventListener('click',event=>{
  const link=event.target.closest('a[data-detail-rail]');
  if(!link||!isDetail)return;
  const item=detailRailTargets.find(s=>s.id===link.dataset.detailRail);
  if(!item)return;
  event.preventDefault(); // Keep the project's route in the URL.
  paintRail(detailRailTargets.indexOf(item));
  scrollTo({top:Math.max(0,item.target.getBoundingClientRect().top+scrollY-105),behavior:motion.matches?'instant':'smooth'});
});
function setActive(name){
  activeSection=name;
  document.body.dataset.activeSection=name;
  document.body.classList.toggle('project-detail-active',isDetail);
  document.querySelectorAll('.nav-item').forEach(a=>{
    if(a.getAttribute('href')==='#'+name)a.setAttribute('aria-current','location');
    else a.removeAttribute('aria-current');
  });
  if(!isDetail){
    const rail=[...sectionRail.querySelectorAll('a')];
    paintRail(Math.max(0,rail.findIndex(a=>a.getAttribute('href')==='#'+name)));
  }
}
// Each case study has its own composition, sharing only the essentials.
// Content was based on Karthik's supplied project descriptions and portfolio media.
// Project-specific layouts use only the existing project descriptions and original photos.
// Detail views are crops of the same photos, not additional project photographs.
const caseStudyContent={
  'data-engineering':`


<div class="project-notes"><p>For our group Data Engineering Project, we built a worker-safety prototype using <strong>four Arduino NESSO N1 devices</strong>. The aim was to collect movement readings from several workers and flag possible slips, trips, falls and near-misses in one system.</p>
<p>The devices sent accelerometer and gyroscope readings over <strong>Bluetooth Low Energy at 0.1-second intervals</strong>. Python collected timestamped CSV files and passed completed files for processing every 60 seconds. The processing program used acceleration magnitude and fixed thresholds to classify events, then stored records in <strong>MySQL</strong>. Power BI read the database through ODBC and required a manual refresh to show the latest data.</p>
<p>My software contribution was <mark class="project-highlight">Main.py</mark>, the launcher that accepted worker and BLE device names and started the collection and processing programs together. I worked on making startup and shutdown easier to manage. We tested the system with four devices and simulated events at school, rather than deploying it on a construction site.</p><section class="andrea-feature andrea-architecture" data-architecture><p class="andrea-eyebrow">CLICKABLE ARCHITECTURE</p><h2>Follow a sensor reading.</h2><p>Select a component to see its part in the project.</p><div class="andrea-architecture-layout"><div class="andrea-architecture-steps" role="group" aria-label="Architecture components"><button type="button" class="andrea-architecture-step" data-architecture-step data-step-name="Wearable sensors" data-step-description="Four NESSO wearables collect movement readings at 0.1-second intervals." aria-pressed="true"><span class="andrea-step-number">01</span><span><strong>Wearable sensors</strong><small>4 NESSO devices</small></span><span aria-hidden="true">→</span></button><button type="button" class="andrea-architecture-step" data-architecture-step data-step-name="BLE collection" data-step-description="Readings are sent over Bluetooth Low Energy. The collection program passes completed CSV files to processing every 60 seconds." aria-pressed="false"><span class="andrea-step-number">02</span><span><strong>BLE collection</strong><small>DataCollection.py</small></span><span aria-hidden="true">→</span></button><button type="button" class="andrea-architecture-step" data-architecture-step data-step-name="Python processing" data-step-description="The processing program organises the sensor data and applies thresholds to flag possible safety incidents." aria-pressed="false"><span class="andrea-step-number">03</span><span><strong>Python processing</strong><small>Threshold-based classification</small></span><span aria-hidden="true">→</span></button><button type="button" class="andrea-architecture-step" data-architecture-step data-step-name="MySQL database" data-step-description="Processed readings and incident records are stored in MySQL, with one table per worker." aria-pressed="false"><span class="andrea-step-number">04</span><span><strong>MySQL database</strong><small>Worker records</small></span><span aria-hidden="true">→</span></button><button type="button" class="andrea-architecture-step" data-architecture-step data-step-name="Power BI dashboard" data-step-description="Power BI reads MySQL through ODBC to show movement and incident records. A manual dashboard refresh is needed to retrieve the latest data." aria-pressed="false"><span class="andrea-step-number">05</span><span><strong>Power BI dashboard</strong><small>Charts and incident summaries</small></span><span aria-hidden="true">→</span></button></div><div class="andrea-architecture-description" aria-live="polite" aria-atomic="true"><span class="andrea-eyebrow">SELECTED COMPONENT</span><h3 data-step-title>Wearable sensors</h3><p data-step-copy>Four NESSO wearables collect movement readings at 0.1-second intervals.</p></div></div><div class="project-ideas project-diagram"><h3 class="project-diagram-title">Complete diagram</h3><div class="nesso-clean-flow" data-flow-animated="true" role="img" aria-label="Main.py starts and monitors the collection and processing programs in parallel. DataCollection.py receives BLE readings from four NESSO devices every 0.1 seconds and writes complete CSV files to a queue every 60 seconds. Preprocessing and Upload.py processes those files, classifies incidents, saves data to MySQL, and Power BI displays the results.">
        <div class="nf-launcher">
          <span class="nf-eyebrow">THE LAUNCHER</span>
          <strong>Main.py</strong>
          <span class="nf-launcher-detail">Starts both programs. Monitors and manages shutdown.</span>
        </div>
        <div class="nf-fork" aria-hidden="true"><span>RUNNING TOGETHER</span></div>
        <div class="nf-process-row">
          <article class="nf-node nf-collect">
            <span class="nf-eyebrow">01 / DATA COLLECTION</span>
            <h3>DataCollection.py</h3>
            <p>Receives movement data from four NESSO wearables through Bluetooth LE.</p>
            <div class="nf-node-foot"><span>NESSO N1</span><span>0.1s readings</span></div>
          </article>
          <div class="nf-transfer" aria-label="Completed CSV files are passed to processing every 60 seconds">
            <span>CSV FILES</span>
            <div class="nf-transfer-line" aria-hidden="true"><span>→</span></div>
            <small>every 60s</small>
          </div>
          <article class="nf-node nf-process">
            <span class="nf-eyebrow">02 / DATA PROCESSING</span>
            <h3>Preprocessing &amp;<br>Upload.py</h3>
            <p>Organises sensor readings and flags possible slips, falls and near-misses.</p>
            <div class="nf-node-foot"><span>PYTHON</span><span>PANDAS</span></div>
          </article>
        </div>
        <div class="nf-downstream" aria-hidden="true"><span>CLASSIFIED DATA</span><i>↓</i></div>
        <div class="nf-output-row">
          <div class="nf-output-node"><span class="nf-eyebrow">03 / STORE</span><strong>MySQL</strong><small>One table per worker</small></div>
          <div class="nf-output-arrow" aria-hidden="true"><span>→</span><small>ODBC</small></div>
          <div class="nf-output-node"><span class="nf-eyebrow">04 / VISUALISE</span><strong>Power BI</strong><small>Movement &amp; incident dashboards</small></div>
        </div>
      </div></div></section><section class="andrea-feature "><h2>Dashboard and testing</h2><p>These images show our school test, database records and Power BI charts.</p><div class="project-photo-grid project-photo-grid--nesso"><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/nesso-field-test.png" data-alt="School test with the four NESSO devices" aria-label="Enlarge School test with the four NESSO devices"><img src="assets/nesso-field-test.png" alt="School test with the four NESSO devices" loading="lazy"></button><figcaption>Our school testing session.</figcaption></figure><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/nesso-database.png" data-alt="MySQL worker sensor records" aria-label="Enlarge MySQL worker sensor records"><img src="assets/nesso-database.png" alt="MySQL worker sensor records" loading="lazy"></button><figcaption>Individual worker readings stored in MySQL.</figcaption></figure><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/nesso-acceleration-chart.png" data-alt="Power BI acceleration chart" aria-label="Enlarge Power BI acceleration chart"><img src="assets/nesso-acceleration-chart.png" alt="Power BI acceleration chart" loading="lazy"></button><figcaption>Acceleration spikes helped us inspect possible incidents.</figcaption></figure><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/nesso-incidents-chart.png" data-alt="Power BI incident breakdown" aria-label="Enlarge Power BI incident breakdown"><img src="assets/nesso-incidents-chart.png" alt="Power BI incident breakdown" loading="lazy"></button><figcaption>Incident categories recorded during testing.</figcaption></figure></div></section><div class="andrea-detail-list"><section class="andrea-detail-section" data-detail-section="1"><span class="andrea-section-number">01</span><div><h2>The problem</h2><p>Movement readings are difficult to review on their own. Our group needed a way to collect data from several workers, flag possible incidents and inspect the results together.</p></div></section><section class="andrea-detail-section" data-detail-section="2"><span class="andrea-section-number">02</span><div><h2>The solution</h2><p>We connected <strong>four NESSO devices</strong> to a Python collection and processing pipeline. The processed records were stored in <strong>MySQL</strong> and displayed in <strong>Power BI</strong>.</p></div></section><section class="andrea-detail-section" data-detail-section="3"><span class="andrea-section-number">03</span><div><h2>What I worked on</h2><ul><li>Built <strong>Main.py</strong> to accept BLE device names and worker names before a session.</li><li>Used <strong>subprocess</strong> to launch DataCollection.py and Preprocessing &amp; Upload.py together.</li><li>Managed startup and shutdown from one launcher so the team did not have to start the programs separately.</li><li>Explained the project objectives, data pipeline and Main.py launcher in the group presentation.</li></ul><p>The collection and processing scripts were presented by another teammate, and the Power BI analysis was handled by the data and analysis role.</p></div></section><section class="andrea-detail-section" data-detail-section="4"><span class="andrea-section-number">04</span><div><h2>Technologies</h2><div class="andrea-tech"><span>Python</span><span>Bluetooth LE</span><span>Arduino NESSO</span><span>Pandas</span><span>MySQL</span><span>Power BI</span><span>ODBC</span></div></div></section><section class="andrea-detail-section" data-detail-section="5"><span class="andrea-section-number">05</span><div><h2>Outcome</h2><p>Our school test collected readings from <strong>four devices at the same time</strong> and recorded simulated slips, trips, falls and near-misses. Near-miss false positives were a known issue.</p><ul><li>Collection produced readings at <strong>0.1-second intervals</strong>, with completed CSV files passed for processing every <strong>60 seconds</strong>.</li><li><strong>Power BI required a manual refresh</strong> to show the latest MySQL records.</li><li>The devices were held in our hands or placed in pockets during testing. Gyroscope readings were unreliable, so classification relied on acceleration magnitude.</li><li>Hardcoded thresholds, device startup, BLE range and battery life still needed improvement. The school simulations did not establish accuracy on a construction site.</li></ul></div></section></div></div>


`,
  'engineering-exploration':`


<div class="project-notes"><p>Our group Engineering Exploration Project looked at a problem faced by self-propelled wheelchair users: getting past a curb when there is no nearby ramp. We explored a <strong>motorised tri-star wheel attachment</strong> as an alternative to the conventional front caster.</p>
<p>The concept uses <strong>three small wheels around a rotating hub</strong>. As the assembly turns, a wheel can move onto a raised edge. We brainstormed different approaches through Crazy 8s, chose the tri-star arrangement and built a small-scale mechanism to test the idea. An <strong>Arduino Uno, slide switch and DC motor</strong> controlled the wheel assembly.</p>
<p>I worked on the <mark class="project-highlight">circuit design and wiring</mark>, contributed ideas during brainstorming and helped check the connections during testing. The prototype demonstrated the rotating mechanism and motor circuit. It was not a full-size wheelchair tested with a person, so load capacity, materials and safety would still need further development.</p><section class="andrea-feature "><h2>Design &amp; development</h2><div class="project-mechanism"><div><p>A curb can force a wheelchair user to look for a ramp or take another route. This was the problem we chose for our engineering exploration project.</p><p>The diagram illustrates the rotating wheel idea. It is a concept view, not a full-size wheelchair test.</p><button class="tri-rotate-button" type="button" data-tri-toggle aria-pressed="true" aria-label="Pause wheel animation"><iconify-icon icon="lucide:pause" aria-hidden="true"></iconify-icon><span>Pause animation</span></button></div><div class="tri-mechanism-art" aria-label="Animated side view of three wheels revolving around a central hub, demonstrating the TRI-STAR design approaching a curb" role="img">
    <svg viewBox="0 0 420 420" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="tri-grid" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" fill="none" stroke="currentColor" stroke-opacity=".07" stroke-width=".8"/></pattern>
        <linearGradient id="tri-ground" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#c4b39b"/><stop offset="1" stop-color="#8c7b66"/></linearGradient>
      </defs>
      <rect x="5" y="5" width="410" height="410" rx="22" fill="url(#tri-grid)"/>
      <path class="tri-surface" d="M25 348 H310 V286 H406" fill="none" stroke="currentColor" stroke-opacity=".56" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="tri-step-shape" d="M310 286 H406 V376 H310 Z" fill="currentColor" fill-opacity=".085"/>
      <text class="tri-diagram-small" x="325" y="271" fill="currentColor">CURB</text>
      <path d="M40 345 H308" stroke="currentColor" stroke-opacity=".15" stroke-dasharray="3 8" stroke-width="1"/>
      <circle cx="200" cy="242" r="121" fill="none" stroke="currentColor" stroke-opacity=".12" stroke-dasharray="3 10" stroke-width="1.5"/>
      <g class="tri-wheel-orbit">
        <path d="M200 242 L200 146 M200 242 L283 290 M200 242 L117 290" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="17" stroke-linecap="round" />
        <path d="M200 242 L200 146 M200 242 L283 290 M200 242 L117 290" fill="none" stroke="currentColor" stroke-opacity=".9" stroke-width="5" stroke-linecap="round" />
        <g class="tri-tire" transform="translate(200 146)">
          <circle r="38" fill="#d9cbb7" stroke="#564a3d" stroke-width="9"/><circle r="29.5" fill="#a79278" stroke="#eaddca" stroke-width="1.4"/>
          <path d="M-26 0H26M0-26V26M-18-18L18 18M-18 18L18-18" stroke="#f5eadc" stroke-width="2" opacity=".8"/><circle r="8" fill="#4d4034" stroke="#f0e4d4" stroke-width="2"/>
        </g>
        <g class="tri-tire" transform="translate(283 290)">
          <circle r="38" fill="#d9cbb7" stroke="#564a3d" stroke-width="9"/><circle r="29.5" fill="#a79278" stroke="#eaddca" stroke-width="1.4"/>
          <path d="M-26 0H26M0-26V26M-18-18L18 18M-18 18L18-18" stroke="#f5eadc" stroke-width="2" opacity=".8"/><circle r="8" fill="#4d4034" stroke="#f0e4d4" stroke-width="2"/>
        </g>
        <g class="tri-tire" transform="translate(117 290)">
          <circle r="38" fill="#d9cbb7" stroke="#564a3d" stroke-width="9"/><circle r="29.5" fill="#a79278" stroke="#eaddca" stroke-width="1.4"/>
          <path d="M-26 0H26M0-26V26M-18-18L18 18M-18 18L18-18" stroke="#f5eadc" stroke-width="2" opacity=".8"/><circle r="8" fill="#4d4034" stroke="#f0e4d4" stroke-width="2"/>
        </g>
        <circle cx="200" cy="242" r="22" fill="#e9dcca" stroke="#4d4034" stroke-width="6"/>
        <circle cx="200" cy="242" r="9" fill="#574536"/>
        <circle cx="200" cy="242" r="3.6" fill="#fff6eb"/>
      </g>
      <path d="M160 103Q207 65 264 107" stroke="currentColor" stroke-opacity=".4" stroke-width="2" stroke-dasharray="5 7" fill="none"/>
      <path d="M254 92L264 107L249 112" stroke="currentColor" stroke-opacity=".75" stroke-width="2" fill="none" stroke-linecap="round"/>
      <text class="tri-diagram-small" x="26" y="36" fill="currentColor">ROTATING HUB · CONCEPT VIEW</text>
      <text class="tri-diagram-small" x="26" y="394" fill="currentColor">SIDE VIEW  /  NOT TO SCALE</text>
    </svg>
    <div class="tri-diagram-caption"><span>THREE-WHEEL MECHANISM</span><span class="tri-live-dot" aria-hidden="true"></span></div>
  </div></div><p>We used <strong>Crazy 8s</strong> to sketch different ways of getting past a curb, then chose the tri-star arrangement for the prototype.</p>
      <details class="project-ideas"><summary>View the eight ideas we considered</summary><ul><li>Larger front wheels</li><li>A curb-climber lever</li><li>A belt or tank-style wheelchair</li><li>A rear piston wheel</li><li>Tri-star front wheels</li><li>Front belt or tank wheels</li><li>A lower centre of gravity</li><li>A front piston wheel</li></ul></details>
      <div class="project-photo-grid project-photo-grid--engineering"><figure class="project-photo project-photo--wide"><a href="https://static.wixstatic.com/media/a3abd1_c107b200cdaa4b649ca409b76e899055~mv2.png/v1/fill/w_980%2Ch_710%2Cal_c%2Cq_90%2Cusm_0.66_1.00_0.01%2Cenc_auto/dfdfdfadasasasa.png" target="_blank" rel="noopener noreferrer"><img class="project-idea-sketch" src="https://static.wixstatic.com/media/a3abd1_c107b200cdaa4b649ca409b76e899055~mv2.png/v1/fill/w_980%2Ch_710%2Cal_c%2Cq_90%2Cusm_0.66_1.00_0.01%2Cenc_auto/dfdfdfadasasasa.png" alt="Our team’s wheelchair concept sketches" loading="lazy"></a><figcaption>Our original concept sketches. Open to view the full sheet.</figcaption></figure><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/tri-prototype-closeup.jpg" data-alt="Small-scale tri-star wheel prototype" aria-label="Enlarge Small-scale tri-star wheel prototype"><img src="assets/tri-prototype-closeup.jpg" alt="Small-scale tri-star wheel prototype" loading="lazy"></button><figcaption>The wheel assembly we built for testing.</figcaption></figure><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/tri-curb.jpg" data-alt="Curb beside a footpath" aria-label="Enlarge Curb beside a footpath"><img src="assets/tri-curb.jpg" alt="Curb beside a footpath" loading="lazy"></button><figcaption>The type of obstacle we were considering.</figcaption></figure></div></section><section class="andrea-feature "><h2>Prototype demonstration</h2><p>Our normal caster and tri-star prototype tests.</p><div class="tri-demo-grid">
        <article class="tri-demo-card tri-video-card">
          <video class="tri-native-video" controls playsinline preload="metadata" poster="assets/tri-normal-caster.jpg" aria-label="Before: normal caster wheel prototype demonstration">
            <source src="assets/tri-normal-caster.mp4" type="video/mp4">
            Your browser does not support embedded videos.
          </video>
          <div class="tri-video-caption"><span>VIDEO / NORMAL CASTER</span><strong>Before</strong></div>
        </article>
        <article class="tri-demo-card tri-video-card">
          <video class="tri-native-video" controls playsinline preload="metadata" poster="assets/tri-prototype-step.jpg" aria-label="After: TRI-STAR wheel prototype demonstration">
            <source src="assets/tri-star-wheels.mp4" type="video/mp4">
            Your browser does not support embedded videos.
          </video>
          <div class="tri-video-caption"><span>VIDEO / TRI-STAR WHEELS</span><strong>After</strong></div>
        </article>
      </div></section><div class="andrea-detail-list"><section class="andrea-detail-section" data-detail-section="1"><span class="andrea-section-number">01</span><div><h2>The problem</h2><p>Curbs can force self-propelled wheelchair users to look for a ramp or take another route. Our team explored a different front-wheel arrangement for getting over a raised edge.</p></div></section><section class="andrea-detail-section" data-detail-section="2"><span class="andrea-section-number">02</span><div><h2>The solution</h2><p>The tri-star concept uses <strong>three wheels around a motor-driven hub</strong> in place of a conventional front caster. A slide switch sends an input to an Arduino Uno, which activates the DC motor.</p></div></section><section class="andrea-detail-section" data-detail-section="3"><span class="andrea-section-number">03</span><div><h2>What I worked on</h2><ul><li><mark class="project-highlight">Designed and wired</mark> the <strong>slide switch, Arduino Uno and DC motor</strong> circuit.</li><li>Helped brainstorm the wheel concepts with the team.</li><li><strong>Checked the circuit connections</strong> and helped test the prototype.</li></ul><p>The switch sends an input to the Arduino, which activates the DC motor to turn the wheel assembly.</p></div></section><section class="andrea-detail-section" data-detail-section="4"><span class="andrea-section-number">04</span><div><h2>Technologies</h2><div class="andrea-tech"><span>Engineering design</span><span>Arduino Uno</span><span>DC motor</span><span>Circuit design</span><span>Prototyping</span><span>Testing</span></div></div></section><section class="andrea-detail-section" data-detail-section="5"><span class="andrea-section-number">05</span><div><h2>Outcome</h2><p>The circuit activated the motor and our <strong>small-scale prototype</strong> demonstrated the rotating mechanism. We did not test a full-size wheelchair carrying a person.</p><p>Suitable materials, load testing and further mechanical and safety testing would be needed before anyone used a full-size version.</p></div></section></div></div>


`,
  'iot-sustainable-living':`


<div class="project-notes"><p>For our IoT Programming &amp; Cloud Services mini project, we built a <strong>household monitoring prototype with four sensor functions</strong>. It covered ventilation, switching lights off when there was enough daylight, checking plant soil moisture and detecting someone near the doorway.</p>
<p>An <strong>Arduino Nano</strong> read the sensors and controlled the relay, NeoPixel and MP3 outputs. A Raspberry Pi, ZigBee and Python were used to upload readings to <strong>ThingSpeak</strong>. The dashboard charts and widgets let us check the sensor values and see whether each response was working during our demonstration.</p>
<p>I wrote the code for the <strong>DHT11 and ventilation relay</strong>, as well as the ultrasonic sensor and MP3 alert. I also worked on <mark class="project-highlight">combining the group’s code</mark>, uploading all four data fields and setting up the dashboard. Troubleshooting the MP3 playback and ThingSpeak upload was a substantial part of my work. This was a school prototype, not a system we installed and tested in a home.</p><section class="andrea-feature andrea-architecture" data-architecture><p class="andrea-eyebrow">CLICKABLE ARCHITECTURE</p><h2>Follow a sensor reading.</h2><p>Select a component to see its part in the project.</p><div class="andrea-architecture-layout"><div class="andrea-architecture-steps" role="group" aria-label="Architecture components"><button type="button" class="andrea-architecture-step" data-architecture-step data-step-name="Household sensors" data-step-description="Four sensor functions cover room temperature, lighting, plant soil moisture and a doorway alert." aria-pressed="true"><span class="andrea-step-number">01</span><span><strong>Household sensors</strong><small>Temperature, light, moisture and distance</small></span><span aria-hidden="true">→</span></button><button type="button" class="andrea-architecture-step" data-architecture-step data-step-name="Arduino Nano" data-step-description="The Arduino reads the sensors and controls outputs such as the ventilation relay, light relay, NeoPixel and MP3 alert." aria-pressed="false"><span class="andrea-step-number">02</span><span><strong>Arduino Nano</strong><small>Sensor inputs and responses</small></span><span aria-hidden="true">→</span></button><button type="button" class="andrea-architecture-step" data-architecture-step data-step-name="Raspberry Pi and Python" data-step-description="The Raspberry Pi, ZigBee and Python upload process carry readings from the prototype to ThingSpeak." aria-pressed="false"><span class="andrea-step-number">03</span><span><strong>Raspberry Pi and Python</strong><small>ZigBee and data upload</small></span><span aria-hidden="true">→</span></button><button type="button" class="andrea-architecture-step" data-architecture-step data-step-name="ThingSpeak" data-step-description="The dashboard shows the four readings and indicators used to check sensor responses during testing." aria-pressed="false"><span class="andrea-step-number">04</span><span><strong>ThingSpeak</strong><small>Charts and status indicators</small></span><span aria-hidden="true">→</span></button></div><div class="andrea-architecture-description" aria-live="polite" aria-atomic="true"><span class="andrea-eyebrow">SELECTED COMPONENT</span><h3 data-step-title>Household sensors</h3><p data-step-copy>Four sensor functions cover room temperature, lighting, plant soil moisture and a doorway alert.</p></div></div></section><section class="andrea-feature "><h2>System functions and dashboard</h2><ul><li><strong>Temperature:</strong> a DHT11 reading of <strong>29°C or above</strong> switches on the ventilation relay.</li><li><strong>Lighting:</strong> the light sensor switches the indoor lights off when there is enough daylight.</li><li><strong>Soil moisture:</strong> a NeoPixel shows red for dry soil, green for moist soil and blue for wet soil.</li><li><strong>Doorway alert:</strong> the ultrasonic sensor triggers an MP3 alert when someone stays within <strong>150 cm</strong> for <strong>three seconds</strong>.</li></ul><p>ThingSpeak showed the readings as charts and status indicators so we could check how the sensors were responding.</p><div class="project-photo-grid project-photo-grid--iot"><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/iot-dashboard.webp" data-alt="ThingSpeak dashboard with four sensor charts" aria-label="Enlarge ThingSpeak dashboard with four sensor charts"><img src="assets/iot-dashboard.webp" alt="ThingSpeak dashboard with four sensor charts" loading="lazy"></button><figcaption>The four sensor readings on ThingSpeak.</figcaption></figure><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/iot-indicators.webp" data-alt="ThingSpeak sensor status indicators" aria-label="Enlarge ThingSpeak sensor status indicators"><img src="assets/iot-indicators.webp" alt="ThingSpeak sensor status indicators" loading="lazy"></button><figcaption>Status indicators used to check the readings.</figcaption></figure></div></section><div class="andrea-detail-list"><section class="andrea-detail-section" data-detail-section="1"><span class="andrea-section-number">01</span><div><h2>The problem</h2><p>Our group chose four household tasks to work on: ventilation, switching lights off in daylight, checking plant soil and detecting someone near the door.</p></div></section><section class="andrea-detail-section" data-detail-section="2"><span class="andrea-section-number">02</span><div><h2>The solution</h2><p>We built an Arduino-based prototype with a sensor and response for each task. Readings were uploaded to <strong>ThingSpeak</strong> so we could inspect the charts and status indicators.</p></div></section><section class="andrea-detail-section" data-detail-section="3"><span class="andrea-section-number">03</span><div><h2>What I worked on</h2><ul><li>Wrote the Arduino code for the <strong>DHT11 and ventilation relay</strong>.</li><li>Wrote the <strong>ultrasonic sensor and MP3 alert</strong> code.</li><li><mark class="project-highlight">Combined the group’s code</mark> so all four sensor functions could run together.</li><li>Worked on the <strong>Python upload to ThingSpeak</strong> through MobaXterm and fixed the issue with uploading all four fields.</li><li>Helped set up the dashboard widgets and demonstrated the working prototype.</li></ul><p>I also troubleshot the MP3 alert and the three-second doorway check. The light-control and soil-moisture code came from my teammates.</p></div></section><section class="andrea-detail-section" data-detail-section="4"><span class="andrea-section-number">04</span><div><h2>Technologies</h2><div class="andrea-tech"><span>C / C++</span><span>Arduino Nano</span><span>Raspberry Pi</span><span>Python</span><span>ZigBee</span><span>DHT11</span><span>NeoPixel</span><span>ThingSpeak</span></div></div></section><section class="andrea-detail-section" data-detail-section="5"><span class="andrea-section-number">05</span><div><h2>Outcome</h2><p>We demonstrated the <strong>four sensor functions</strong> and checked their values on ThingSpeak. Fixing the MP3 alert involved checking the RX/TX connections and adjusting the code. The four-field upload needed further debugging and help from our lecturer.</p><p>This was a school prototype. It demonstrated the sensor responses, but did not measure household energy savings or prove that it could operate reliably in a home over time.</p></div></section></div></div>


`,
  'cloud-computing':`


<div class="project-notes"><p>For the Cloud Computing Development Project, I built a <strong>music-store catalogue on AWS</strong>. The assignment required a page showing nine instruments, with product details held in a database and images stored separately. It also required attention to reliability, performance and a <strong>$50 budget</strong>.</p>
<p>Requests passed through an <strong>Application Load Balancer</strong> to EC2 instances in an Auto Scaling Group across two availability zones. RDS MySQL held the product information, with Multi-AZ configured for a standby database, while S3 held the images. Security-group rules controlled access between the components.</p>
<p>I worked on the <mark class="project-highlight">AWS configuration and application deployment</mark>, then checked resource usage with CloudWatch and set up SNS and budget alerts. I compared t3.micro and t3.small using ApacheBench and used a Python boto3 script to check the Auto Scaling Group’s health. The result was a working school catalogue, rather than a shop processing real customer orders.</p><section class="andrea-feature andrea-architecture" data-architecture><p class="andrea-eyebrow">CLICKABLE ARCHITECTURE</p><h2>Explore the cloud stack.</h2><p>Select a component to see its part in the project.</p><div class="andrea-architecture-layout"><div class="andrea-architecture-steps" role="group" aria-label="Architecture components"><button type="button" class="andrea-architecture-step" data-architecture-step data-step-name="Visitor" data-step-description="A visitor opens the instrument catalogue in a browser." aria-pressed="true"><span class="andrea-step-number">01</span><span><strong>Visitor</strong><small>Catalogue requests</small></span><span aria-hidden="true">→</span></button><button type="button" class="andrea-architecture-step" data-architecture-step data-step-name="VPC and load balancer" data-step-description="The VPC contains the cloud resources. The Application Load Balancer distributes requests to the web instances." aria-pressed="false"><span class="andrea-step-number">02</span><span><strong>VPC and load balancer</strong><small>Network and request routing</small></span><span aria-hidden="true">→</span></button><button type="button" class="andrea-architecture-step" data-architecture-step data-step-name="EC2 and Auto Scaling" data-step-description="EC2 instances host the website. The Auto Scaling Group can adjust capacity as demand changes." aria-pressed="false"><span class="andrea-step-number">03</span><span><strong>EC2 and Auto Scaling</strong><small>Web servers in two availability zones</small></span><span aria-hidden="true">→</span></button><button type="button" class="andrea-architecture-step" data-architecture-step data-step-name="RDS MySQL" data-step-description="RDS MySQL stores product names, prices and descriptions, with Multi-AZ configured for a standby database." aria-pressed="false"><span class="andrea-step-number">04</span><span><strong>RDS MySQL</strong><small>Product information</small></span><span aria-hidden="true">→</span></button><button type="button" class="andrea-architecture-step" data-architecture-step data-step-name="Amazon S3" data-step-description="S3 stores the product photographs separately from the web servers and database." aria-pressed="false"><span class="andrea-step-number">05</span><span><strong>Amazon S3</strong><small>Product images</small></span><span aria-hidden="true">→</span></button></div><div class="andrea-architecture-description" aria-live="polite" aria-atomic="true"><span class="andrea-eyebrow">SELECTED COMPONENT</span><h3 data-step-title>Visitor</h3><p data-step-copy>A visitor opens the instrument catalogue in a browser.</p></div></div><div class="project-ideas project-diagram"><h3 class="project-diagram-title">Complete diagram</h3><div class="cloud-topology" role="group" aria-label="AWS application flow from visitors to load balancer, EC2 autoscaling, RDS database and S3 storage, with CloudWatch monitoring">
      <div class="cloud-topology-head"><span><i></i> AWS · US-EAST-1</span><span>VPC · 10.0.0.0/16</span></div>
      <div class="cloud-topology-row cloud-topology-entry"><div class="cloud-node cloud-node--entry" tabindex="0"><iconify-icon icon="lucide:users"></iconify-icon><b>Visitors</b><small>Internet requests</small></div></div>
      <div class="cloud-topology-down" aria-hidden="true">↓</div>
      <div class="cloud-topology-row"><div class="cloud-node cloud-node--balancer" tabindex="0"><iconify-icon icon="lucide:network"></iconify-icon><b>Application Load Balancer</b><small>Distributes HTTP requests</small></div></div>
      <div class="cloud-topology-down" aria-hidden="true">↓</div>
      <div class="cloud-topology-core"><span>WEB APPLICATION / AUTO SCALING GROUP</span><div class="cloud-ec2-pair"><div class="cloud-node" tabindex="0"><iconify-icon icon="lucide:server"></iconify-icon><b>EC2 capacity</b><small>Public subnet / AZ A</small></div><div class="cloud-node" tabindex="0"><iconify-icon icon="lucide:server"></iconify-icon><b>EC2 capacity</b><small>Public subnet / AZ B</small></div></div></div>
      <div class="cloud-topology-down" aria-hidden="true">↓</div>
      <div class="cloud-topology-services"><div class="cloud-node" tabindex="0"><iconify-icon icon="lucide:database"></iconify-icon><b>RDS MySQL</b><small>Product information · Multi-AZ</small></div><div class="cloud-node" tabindex="0"><iconify-icon icon="lucide:images"></iconify-icon><b>Amazon S3</b><small>Product images</small></div></div>
      <div class="cloud-topology-foot"><span><iconify-icon icon="lucide:activity"></iconify-icon> CloudWatch · Monitoring</span><span><iconify-icon icon="lucide:bell-ring"></iconify-icon> SNS · Alerts</span><span><iconify-icon icon="lucide:wallet"></iconify-icon> AWS Budgets</span></div>
    </div></div></section><section class="andrea-feature "><h2>Application and monitoring</h2><p>The main image shows the first three products. These screenshots show the remaining six. Select an image to enlarge it.</p><div class="project-photo-grid project-photo-grid--storefront"><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/cloud-storefront-2.webp" data-alt="Music catalogue with guqin, harmonica and harp" aria-label="Enlarge Music catalogue with guqin, harmonica and harp"><img src="assets/cloud-storefront-2.webp" alt="Music catalogue with guqin, harmonica and harp" loading="lazy"></button><figcaption>Guqin, harmonica and harp products.</figcaption></figure><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/cloud-storefront-3.webp" data-alt="Music catalogue with piano, trumpet and violin" aria-label="Enlarge Music catalogue with piano, trumpet and violin"><img src="assets/cloud-storefront-3.webp" alt="Music catalogue with piano, trumpet and violin" loading="lazy"></button><figcaption>Piano, trumpet and violin products.</figcaption></figure></div><p class="project-media-note">I used these <strong>CloudWatch charts</strong> to check server CPU usage, database CPU usage and network traffic.</p><div class="project-photo-grid project-photo-grid--monitoring"><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/cloudwatch-ec2-cpu.webp" data-alt="CloudWatch EC2 CPU chart" aria-label="Enlarge CloudWatch EC2 CPU chart"><img src="assets/cloudwatch-ec2-cpu.webp" alt="CloudWatch EC2 CPU chart" loading="lazy"></button><figcaption>EC2 CPU usage during monitoring.</figcaption></figure><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/cloudwatch-rds-cpu.webp" data-alt="CloudWatch RDS CPU chart" aria-label="Enlarge CloudWatch RDS CPU chart"><img src="assets/cloudwatch-rds-cpu.webp" alt="CloudWatch RDS CPU chart" loading="lazy"></button><figcaption>RDS CPU usage.</figcaption></figure><figure class="project-photo project-photo--wide"><button class="ed-image-open" type="button" data-photo="assets/cloudwatch-network.webp" data-alt="CloudWatch network traffic chart" aria-label="Enlarge CloudWatch network traffic chart"><img src="assets/cloudwatch-network.webp" alt="CloudWatch network traffic chart" loading="lazy"></button><figcaption>Network traffic in and out.</figcaption></figure></div></section><div class="andrea-detail-list"><section class="andrea-detail-section" data-detail-section="1"><span class="andrea-section-number">01</span><div><h2>The problem</h2><p>The assignment required a <strong>nine-product music catalogue</strong> hosted on AWS, with separate product data and image storage. It also included scaling, monitoring and a <strong>$50 budget limit</strong>.</p></div></section><section class="andrea-detail-section" data-detail-section="2"><span class="andrea-section-number">02</span><div><h2>The solution</h2><p>I connected EC2 web servers, an Application Load Balancer, an Auto Scaling Group, RDS MySQL and S3. CloudWatch, SNS and budget alerts were used to monitor the setup.</p></div></section><section class="andrea-detail-section" data-detail-section="3"><span class="andrea-section-number">03</span><div><h2>What I worked on</h2><ul><li>Configured the <strong>VPC, load balancer, EC2 instances, Auto Scaling Group, RDS MySQL and S3</strong> for the catalogue.</li><li>Restricted HTTP access to the web instances so requests came through the <strong>load balancer’s security group</strong>. The database was accessed within the VPC.</li><li>Configured <strong>RDS Multi-AZ</strong> for a standby database in another availability zone.</li><li>Compared <strong>t3.micro and t3.small using ApacheBench</strong> under the same load. The report found comparable performance for this application.</li><li>Monitored CPU usage and network traffic with <strong>CloudWatch</strong>. Set a StatusCheckFailed alarm at Auto Scaling Group level and connected it to SNS email notifications.</li><li>Configured a <strong>$50 monthly budget</strong> with an alert at <strong>80%</strong>. Used a Python boto3 script to check Auto Scaling Group health.</li></ul></div></section><section class="andrea-detail-section" data-detail-section="4"><span class="andrea-section-number">04</span><div><h2>Technologies</h2><div class="andrea-tech"><span>Amazon VPC</span><span>EC2</span><span>Application Load Balancer</span><span>Auto Scaling</span><span>RDS MySQL</span><span>S3</span><span>CloudWatch</span><span>SNS</span><span>Python boto3</span><span>ApacheBench</span></div></div></section><section class="andrea-detail-section" data-detail-section="5"><span class="andrea-section-number">05</span><div><h2>Outcome</h2><p>The catalogue displayed <strong>nine musical instruments</strong>, with names, prices and descriptions in MySQL and product images in S3. The load balancer and Auto Scaling Group handled the web layer, with monitoring and spending alerts configured alongside it.</p><p>The instance comparison supported using <strong>t3.micro</strong> for this workload. This was a school application, not a shop taking real orders or evidence of production-scale performance.</p></div></section></div></div>


`,
  'road-safety':`


<div class="project-notes"><p>Our group data visualisation project examined <strong>traffic accident patterns and road safety in Singapore</strong>. My part was <mark class="project-highlight">Theme 4: infrastructure effectiveness</mark>, which compared changes in traffic lights, ERP gantries, flyovers, vehicular bridges, underpasses and tunnels with safety trends.</p>
<p>The team prepared the datasets using Python and Pandas. I connected the processed tables in <strong>Power BI</strong> and created the <strong>Total Infra Points</strong>, <strong>Injuries per 1000 Vehicles</strong> and <strong>Road Condition Accidents</strong> measures. I used these to build infrastructure-growth charts, comparisons with injury and death rates, distribution charts and a view of accidents linked to road conditions.</p>
<p>I also wrote the infrastructure findings and recommendations for the group report. The charts showed infrastructure growth alongside lower death rates, with injuries declining more slowly. Those patterns were useful for discussion, but they did not prove that infrastructure alone caused the improvements. My contribution focused on this theme, rather than the other members’ analyses of driver behaviour, vehicle types or policy.</p><section class="andrea-feature "><h2>Analysis and charts</h2><ul><li>The reported road traffic death rate fell from <strong>4.7 in 2006 to 2.2 in 2016</strong>, while infrastructure counts increased.</li><li>The injury-rate measure fell more slowly, from <strong>12.2 in 2008 to 10.3 in 2016</strong>.</li><li>Reported road-condition accidents fell from 16 in 2013 to <strong>five or fewer per year</strong> from 2016 onward in the data reviewed.</li><li>Traffic lights made up <strong>about 84%</strong> of the infrastructure counted in 2017.</li></ul><div class="project-photo-grid"><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/road-death-comparison.webp" data-alt="Infrastructure count and road traffic death rate chart" aria-label="Enlarge Infrastructure count and road traffic death rate chart"><img src="assets/road-death-comparison.webp" alt="Infrastructure count and road traffic death rate chart" loading="lazy"></button><figcaption>Infrastructure count compared with the death-rate measure.</figcaption></figure><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/road-injury-comparison.webp" data-alt="Infrastructure count and injury rate chart" aria-label="Enlarge Infrastructure count and injury rate chart"><img src="assets/road-injury-comparison.webp" alt="Infrastructure count and injury rate chart" loading="lazy"></button><figcaption>Infrastructure count compared with the injury-rate measure.</figcaption></figure><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/road-condition-accidents.webp" data-alt="Road-condition accidents from 2012 to 2024" aria-label="Enlarge Road-condition accidents from 2012 to 2024"><img src="assets/road-condition-accidents.webp" alt="Road-condition accidents from 2012 to 2024" loading="lazy"></button><figcaption>Reported accidents attributed to road conditions.</figcaption></figure><figure class="project-photo"><button class="ed-image-open" type="button" data-photo="assets/road-facilities-share.webp" data-alt="Distribution of counted infrastructure in 2017" aria-label="Enlarge Distribution of counted infrastructure in 2017"><img src="assets/road-facilities-share.webp" alt="Distribution of counted infrastructure in 2017" loading="lazy"></button><figcaption>Traffic lights were the largest category in the 2017 count.</figcaption></figure></div></section><div class="andrea-detail-list"><section class="andrea-detail-section" data-detail-section="1"><span class="andrea-section-number">01</span><div><h2>The problem</h2><p>Our group was analysing road safety in Singapore. My part was to examine whether growth in infrastructure, including traffic lights, ERP gantries, flyovers, bridges and underpasses, lined up with changes in safety measures.</p></div></section><section class="andrea-detail-section" data-detail-section="2"><span class="andrea-section-number">02</span><div><h2>The solution</h2><p>We cleaned the datasets with <strong>Python and Pandas</strong>. I linked the relevant tables in <strong>Power BI</strong> and compared infrastructure counts with accident, injury and death-rate trends.</p></div></section><section class="andrea-detail-section" data-detail-section="3"><span class="andrea-section-number">03</span><div><h2>What I worked on</h2><ul><li>Connected the processed traffic facilities, vehicular facilities, death-rate, accident-cause, casualty and vehicle-population tables in <strong>Power BI</strong>.</li><li>Created <strong>Total Infra Points</strong>, combining traffic lights, ERP gantries, flyovers, vehicular bridges, underpasses and tunnels.</li><li>Created the <strong>Injuries per 1000 Vehicles</strong> and <strong>Road Condition Accidents</strong> measures.</li><li>Built the infrastructure-growth chart, injury and death-rate comparisons, infrastructure-distribution charts and road-condition accident chart.</li><li>Wrote up the <strong>Theme 4 findings and recommendations</strong> for the group report.</li></ul></div></section><section class="andrea-detail-section" data-detail-section="4"><span class="andrea-section-number">04</span><div><h2>Technologies</h2><div class="andrea-tech"><span>Python</span><span>Pandas</span><span>Power BI</span><span>DAX</span><span>data.gov.sg</span></div></div></section><section class="andrea-detail-section" data-detail-section="5"><span class="andrea-section-number">05</span><div><h2>Outcome</h2><p>The charts showed infrastructure growth alongside a fall in the reported road traffic death rate from <strong>4.7 in 2006 to 2.2 in 2016</strong>. Injury rates fell more slowly.</p><p>These charts show trends over the same period. They <strong>do not prove</strong> that adding infrastructure caused the fall in deaths or injuries.</p><ul><li>The datasets cover different periods, so not every series can be compared over the same years.</li><li>Driver behaviour and other changes could also affect accident rates.</li><li>Counting facilities does not tell us their condition, location or individual effect on safety.</li></ul><p>If I continued this work, I would look more closely at specific crossings and traffic lights rather than relying on the total number of facilities.</p><p class="project-tools">Tools: Python, Pandas, Power BI and DAX. Data source: data.gov.sg. My focus was infrastructure effectiveness, Theme 4 of the group project.</p></div></section></div></div>


`
};
function initCaseInteractives(){
  const lightbox=detail.querySelector('#case-lightbox');
  if(!lightbox)return;
  // External Wix drawings remain original. If unavailable offline, show a local
  // concept-art preview and keep the link to the real sketches on Wix.
  detail.querySelectorAll('.tri-original-sketch-sheet img,.tri-process-drawings img,.project-idea-sketch').forEach(img=>{
    img.addEventListener('error',()=>{
      img.src='assets/tri-wheelchair-concept.jpg';
      img.alt='Original TRI-STAR digital concept-art preview. Open the link to see the hand-drawn sketches on Wix.';
      img.classList.add('tri-drawing-fallback');
    },{once:true});
  });
  detail.querySelectorAll('[data-architecture]').forEach(panel=>{
    const steps=[...panel.querySelectorAll('[data-architecture-step]')];
    steps.forEach(step=>step.addEventListener('click',()=>{
      steps.forEach(button=>button.setAttribute('aria-pressed',String(button===step)));
      panel.querySelector('[data-step-title]').textContent=step.dataset.stepName;
      panel.querySelector('[data-step-copy]').textContent=step.dataset.stepDescription;
    }));
  });
  const wheelToggle=detail.querySelector('[data-tri-toggle]');
  if(wheelToggle){wheelToggle.addEventListener('click',()=>{const stage=detail.querySelector('.tri-mechanism,.project-mechanism');const paused=stage.classList.toggle('tri-is-paused');wheelToggle.setAttribute('aria-pressed',String(!paused));wheelToggle.setAttribute('aria-label',paused?'Play wheel animation':'Pause wheel animation');wheelToggle.querySelector('span').textContent=paused?'Play animation':'Pause animation';wheelToggle.querySelector('iconify-icon')?.setAttribute('icon',paused?'lucide:play':'lucide:pause');});}
  detail.querySelectorAll('.ed-image-open').forEach(button=>button.addEventListener('click',()=>{
    const image=lightbox.querySelector('img');image.src=button.dataset.photo;image.alt=button.dataset.alt||'';
    lightbox.showModal();
  }));
  lightbox.querySelector('.ed-lightbox-close').addEventListener('click',()=>lightbox.close());
  lightbox.addEventListener('click',event=>{if(event.target===lightbox)lightbox.close()});
}
// Lightweight, accessible project motion. All effects are disabled for reduced motion.
let projectRevealObserver=null;
function initCaseMotion(){
  if(projectRevealObserver){projectRevealObserver.disconnect();projectRevealObserver=null;}
  if(motion.matches||!('IntersectionObserver' in window))return;
  const root=detail.querySelector('.editorial-case');
  if(!root)return;
  const targets=[...root.querySelectorAll('.nesso-fact-strip,.nesso-pair>article,.nesso-section-heading,.nesso-clean-flow,.nesso-results-gallery>figure,.nesso-role-file,.nesso-role-copy p,.nesso-outcome-photo,.nesso-outcome-copy,.tri-reveal,.tri-process-card,.tri-demo-card,.tri-role-main,.tri-role-circuit,.ed-eng-pair>article,.ed-eng-mechanism,.ed-eng-contribution,.ed-eng-close>div,.ed-iot-intro>div,.ed-iot-gallery figure,.ed-iot-contribution,.ed-iot-ending>div,.iot-home-intro,.iot-feature-tile,.iot-connection,.iot-evidence-photo,.iot-contribution,.iot-conclusion,.cloud-intro,.cloud-architecture,.cloud-storefront-gallery figure,.cloud-operations-cards article,.cloud-finale,.road-reveal,.road-question,.road-numbers article,.road-method,.road-steps article,.road-chart,.road-findings,.road-takeaway')];
  targets.forEach((el,i)=>{
    el.classList.add('case-reveal');
    el.style.setProperty('--reveal-delay',(i%3)*85+'ms');
  });
  root.classList.add('case-motion-ready');
  projectRevealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-shown');
        if(entry.target.classList.contains('nesso-clean-flow'))entry.target.classList.add('flow-playing');
        projectRevealObserver.unobserve(entry.target);
      }
    });
  },{rootMargin:'0px 0px -50px 0px',threshold:.09});
  targets.forEach(el=>projectRevealObserver.observe(el));
  const media=root.querySelector('.ed-new-hero-visual');
  if(media&&matchMedia('(hover:hover) and (pointer:fine)').matches){
    let px=0,py=0,frame=0;
    const draw=()=>{frame=0;media.style.setProperty('--hero-shift-x',px+'px');media.style.setProperty('--hero-shift-y',py+'px');};
    media.addEventListener('pointermove',e=>{
      const r=media.getBoundingClientRect();
      px=((e.clientX-r.left)/r.width-.5)*12;py=((e.clientY-r.top)/r.height-.5)*12;
      if(!frame)frame=requestAnimationFrame(draw);
    });
    media.addEventListener('pointerleave',()=>{px=0;py=0;if(!frame)frame=requestAnimationFrame(draw)});
  }
}

function makeDetail(p){
 const next=projectData[(projectData.indexOf(p)+1)%projectData.length];
 const headline={
  'data-engineering':'NESSO Safety Monitoring System',
  'engineering-exploration':'Engineering Exploration Project',
  'iot-sustainable-living':'IoT System for Sustainable Household Living',
  'cloud-computing':'AWS Music Store Web Application',
  'road-safety':'Road Safety & Infrastructure Analysis'
 }[p.slug];
 const subtitle={
  'data-engineering':'A group project using NESSO wearables, Python, MySQL and Power BI to track movement and flag possible safety incidents.',
  'engineering-exploration':'Our team’s small-scale test of a motorised tri-star wheel attachment for climbing curbs.',
  'iot-sustainable-living':'A school prototype for temperature control, lighting, soil moisture and doorway alerts.',
  'cloud-computing':'I built a music-store website on AWS and connected the servers, database and storage behind it.',
  'road-safety':'My infrastructure analysis for a group project using Singapore road-safety data.'
 }[p.slug];
 const category={
  'data-engineering':'DATA ENGINEERING',
  'engineering-exploration':'ENGINEERING EXPLORATION',
  'iot-sustainable-living':'INTERNET OF THINGS',
  'cloud-computing':'CLOUD COMPUTING',
  'road-safety':'DATA ANALYSIS'
 }[p.slug];
 const titleImage={
  'data-engineering':{src:'assets/project-data-closeup.webp',width:1810,height:1130,alt:'NESSO wearable sensor showing movement readings and BLE connection status'},
  'engineering-exploration':{src:'assets/project-engineering.jpg',width:1072,height:885,alt:'Our tri-star wheelchair concept design'},
  'iot-sustainable-living':{src:'assets/iot-hardware-workbench.webp',width:1600,height:940,alt:'Our household sensor prototype with Arduino and Raspberry Pi'},
  'cloud-computing':{src:'assets/cloud-storefront-1.webp',width:1435,height:849,alt:'Music-store product catalogue from my AWS project'},
  'road-safety':{src:'assets/road-infrastructure-growth.webp',width:1050,height:455,alt:'Power BI chart of Singapore road infrastructure growth'}
 }[p.slug];
 const article=(caseStudyContent[p.slug]||'').replace(/(<div class="project-notes">\s*)((?:<p>[\s\S]*?<\/p>\s*)+)/,(_match,opening,overview)=>`${opening}<div class="project-summary"><div class="project-summary-copy"><h2>Project overview</h2>${overview}</div></div>`);
 return `<div class="frame detail-shell case-shell editorial-case project-notes-page andrea-method editorial-case--${p.slug}" data-project-slug="${p.slug}">
    <a class="project-back-link" href="#projects"><iconify-icon icon="lucide:arrow-left" aria-hidden="true"></iconify-icon><span>Back to portfolio</span></a>
    <header class="ed-project-hero ed-project-hero--split project-page-header" aria-labelledby="case-page-heading">
      <div class="ed-new-hero-copy">
        <span class="project-category">${p.number||String(projectData.indexOf(p)+1).padStart(2,'0')} / ${category}</span>
        <h1 id="case-page-heading">${headline}</h1>
        <p>${subtitle}</p>
      </div>
      <figure class="project-title-image">
        <button class="ed-image-open project-title-image-open" type="button" data-photo="${titleImage.src}" data-alt="${titleImage.alt}" aria-label="Expand the original ${p.name} image">
          <img class="project-title-image-file" src="${titleImage.src}" alt="${titleImage.alt}" width="${titleImage.width}" height="${titleImage.height}" data-detail-cover loading="eager" decoding="async" fetchpriority="high">
        </button>
      </figure>
    </header>
    ${article}
    <section class="ed-more-projects" aria-label="Continue to the next project">
      <span class="ed-more-kicker">Finished reading?</span>
      
      <a id="detail-next" href="#project-${next.slug}" class="ed-more-link" aria-label="Next project: ${next.name}">
        <span class="ed-more-next-label">Up next</span>
        <strong>${next.name}</strong>
        <iconify-icon icon="lucide:arrow-up-right" aria-hidden="true"></iconify-icon>
      </a>
    </section>
    <dialog id="case-lightbox" class="ed-lightbox" aria-label="Project image enlarged"><button type="button" class="ed-lightbox-close" aria-label="Close image"><iconify-icon icon="lucide:x" aria-hidden="true"></iconify-icon></button><img src="" alt=""></dialog>
  </div>`;
}
function scrollSection(name,instant){const el=document.getElementById(name);const y=el.getBoundingClientRect().top+scrollY-(name==='home'?0:84);scrollTo({top:Math.max(0,y),behavior:instant||motion.matches?'instant':'smooth'});setActive(name);}
async function navigate(){const hash=location.hash.slice(1)||'home';if(hash==='main-content'){main.focus({preventScroll:true});return;}const project=projectData.find(p=>'project-'+p.slug===hash);let oldCover;
if(project){if(!isDetail)previousMainScroll=scrollY;oldCover=isDetail?detail.querySelector('[data-detail-cover]'):document.querySelector('[data-cover="'+project.slug+'"]');if(oldCover)oldCover.style.viewTransitionName='project-cover';const render=()=>{main.hidden=true;detail.hidden=false;detail.innerHTML=makeDetail(project);initCaseInteractives();initCaseMotion();if(detail.querySelector('[data-detail-cover]'))detail.querySelector('[data-detail-cover]').style.viewTransitionName='project-cover';isDetail=true;showProjectRail(project);setActive('projects');scrollTo({top:0,behavior:'instant'});};if(!initialNavigation&&!motion.matches&&document.startViewTransition){const t=document.startViewTransition(render);try{await t.finished;}catch{}}else render();if(oldCover)oldCover.style.viewTransitionName='';detail.querySelector('[data-detail-cover]')?.style.removeProperty('view-transition-name');}
else{const name=sectionNames.includes(hash)?hash:'home';if(isDetail){const current=projectData.find(p=>p.slug===detail.querySelector('.editorial-case')?.dataset.projectSlug);oldCover=detail.querySelector('[data-detail-cover]');if(oldCover)oldCover.style.viewTransitionName='project-cover';const render=()=>{main.hidden=false;detail.hidden=true;isDetail=false;if(projectRevealObserver){projectRevealObserver.disconnect();projectRevealObserver=null;}showHomeRail();scrollSection(name,true);if(name==='projects'&&current){const c=document.querySelector('[data-cover="'+current.slug+'"]');if(c)c.style.viewTransitionName='project-cover';}};if(!motion.matches&&document.startViewTransition){const t=document.startViewTransition(render);try{await t.finished;}catch{}}else render();document.querySelectorAll('[data-cover]').forEach(e=>e.style.removeProperty('view-transition-name'));if(oldCover)oldCover.style.viewTransitionName='';}
else if(!initialNavigation)scrollSection(name,false);else if(name!=='home')requestAnimationFrame(()=>scrollSection(name,true));}
initialNavigation=false;}
document.addEventListener('click',event=>{const a=event.target.closest('a[href^="#"]');if(!a)return;const hash=a.getAttribute('href');if(hash==='#main-content')return;if(!sectionNames.includes(hash.slice(1))&&!hash.startsWith('#project-'))return;event.preventDefault();setPreviewOpen(false);if(a.id==='hero-about'&&heldTriggered){heldTriggered=false;return;}if(document.body.classList.contains('menu-open'))setSidebarOpen(false);history.pushState(null,'',hash);navigate();});
window.addEventListener('hashchange',navigate);setActive('home');navigate();
let scrollTick=false;addEventListener('scroll',()=>{if(scrollTick)return;scrollTick=true;requestAnimationFrame(()=>{scrollTick=false;if(isDetail){updateProjectRailPosition();return;}let name='home';for(const id of sectionNames){const r=document.getElementById(id).getBoundingClientRect();if(r.top<innerHeight*.45)name=id;}setActive(name);});},{passive:true});
addEventListener('resize',()=>{if(isDetail)updateProjectRailPosition();},{passive:true});


// Navigation preview: the left list NEVER scrolls automatically. Visitors can
// scroll all four shortcuts themselves; only the image/title on the right cycles.
const previewTrigger=document.getElementById('nav-projects');
const navPreview=document.getElementById('nav-preview');
const navHeader=document.querySelector('.floating-header');
const previewRotator=document.getElementById('nav-preview-rotator');
const previewTrack=document.getElementById('nav-preview-track');
const previewImageLayers=[document.getElementById('nav-preview-image'),document.getElementById('nav-preview-next-image')];
const previewCaptionLayers=[document.getElementById('nav-caption-first'),document.getElementById('nav-caption-second')];
const previewData=[
  {href:'#project-data-engineering',image:'assets/project-data.jpg',title:'NESSO Safety Monitoring System',summary:'Wearable sensors · Worker safety'},
  {href:'#project-engineering-exploration',image:'assets/project-engineering.jpg',title:'Engineering Exploration Project',summary:'Tri-star wheels · Easier curb climbing'},
  {href:'#project-iot-sustainable-living',image:'assets/iot-hardware-workbench.webp',title:'IoT System for Sustainable Household Living',summary:'Connected sensors · Smarter home'},
  {href:'#project-cloud-computing',image:'assets/cloud-storefront-1.webp',title:'AWS Music Store Web Application',summary:'AWS cloud · Online music store'},
  {href:'#project-road-safety',image:'assets/road-safety-cover.webp',title:'Road Safety & Infrastructure Analysis',summary:'Road infrastructure · Power BI analysis'}
];
const previewMotion=matchMedia('(prefers-reduced-motion: reduce)');
const previewPreloads=previewData.map(p=>{const im=new Image();im.src=p.image;im.decode?.().catch(()=>{});return im;});
let previewSelectedIndex=0,previewActiveLayer=0;
let previewCycleTimer=null,previewVisualToken=0,previewVisualTimer=null;
let previewInteracting=false;
function stopPreviewCycle(){
  if(previewCycleTimer!==null){clearInterval(previewCycleTimer);previewCycleTimer=null;}
}
function startPreviewCycle(){
  stopPreviewCycle();
  if(!navPreview||navPreview.hidden||document.hidden||previewInteracting||previewMotion.matches)return;
  previewCycleTimer=setInterval(()=>selectPreview((previewSelectedIndex+1)%previewData.length),3600);
}
function createPreviewRow(item,index){
  const row=document.createElement('a');
  row.className='nav-preview-item';
  row.dataset.previewIndex=String(index);
  row.href=item.href;
  row.setAttribute('aria-label','Open '+item.title);
  const heading=document.createElement('strong');heading.textContent=item.title;
  const icon=document.createElement('iconify-icon');
  icon.setAttribute('icon','lucide:arrow-up-right');icon.setAttribute('aria-hidden','true');
  row.append(heading,icon);
  row.addEventListener('pointerenter',()=>{previewInteracting=true;stopPreviewCycle();selectPreview(index);});
  row.addEventListener('focus',()=>{previewInteracting=true;stopPreviewCycle();selectPreview(index);});
  row.addEventListener('click',()=>setPreviewOpen(false));
  return row;
}
const previewRows=previewData.map(createPreviewRow);
previewTrack.replaceChildren(...previewRows);
function highlightPreviewRows(){
  previewRows.forEach((row,index)=>{
    const selected=index===previewSelectedIndex;
    row.classList.toggle('is-selected',selected);
    if(selected)row.setAttribute('aria-current','true');else row.removeAttribute('aria-current');
  });
}
function updatePreviewCaption(layer,index){
  layer.querySelector('strong').textContent=previewData[index].summary;
}
function showPreviewVisual(index){
  if(index<0||index>=previewData.length)return;
  const token=++previewVisualToken;
  if(previewVisualTimer!==null){clearTimeout(previewVisualTimer);previewVisualTimer=null;}
  const current=previewActiveLayer,next=1-current;
  const oldImage=previewImageLayers[current],image=previewImageLayers[next];
  const oldCaption=previewCaptionLayers[current],caption=previewCaptionLayers[next];
  image.classList.remove('is-revealing','is-active');
  caption.classList.remove('is-revealing','is-active');
  image.src=previewData[index].image;
  image.alt=previewData[index].title+' preview';
  updatePreviewCaption(caption,index);
  if(navPreview.hidden||previewMotion.matches){
    image.classList.add('is-active');caption.classList.add('is-active');
    oldImage.classList.remove('is-revealing','is-active');
    oldCaption.classList.remove('is-revealing','is-active');
    previewActiveLayer=next;
    return;
  }
  const reveal=()=>{
    if(token!==previewVisualToken||navPreview.hidden)return;
    // Stable stacked layers: no layout shifts or synchronous image decoding.
    oldImage.style.zIndex='0';image.style.zIndex='2';
    oldCaption.style.zIndex='2';caption.style.zIndex='3';
    image.classList.add('is-revealing');caption.classList.add('is-revealing');
    previewVisualTimer=setTimeout(()=>{
      if(token!==previewVisualToken)return;
      image.classList.remove('is-revealing');caption.classList.remove('is-revealing');
      image.classList.add('is-active');caption.classList.add('is-active');
      oldImage.classList.remove('is-revealing','is-active');
      oldCaption.classList.remove('is-revealing','is-active');
      previewActiveLayer=next;
      previewVisualTimer=null;
    },900);
  };
  const preload=previewPreloads[index];
  if(preload.complete&&preload.naturalWidth)requestAnimationFrame(reveal);
  else if(preload.decode)preload.decode().then(()=>requestAnimationFrame(reveal)).catch(()=>requestAnimationFrame(reveal));
  else requestAnimationFrame(reveal);
}
function selectPreview(index){
  if(index===previewSelectedIndex)return;
  previewSelectedIndex=index;
  highlightPreviewRows();
  showPreviewVisual(index);
  // Intentionally NEVER call scrollIntoView/scrollBy/scrollTop here.
}
function setPreviewOpen(open){
  if(!navPreview)return;
  if(matchMedia('(max-width:900px)').matches)open=false;
  if(navPreview.hidden===!open)return;
  navPreview.hidden=!open;
  previewTrigger?.setAttribute('aria-expanded',String(open));
  if(open){
    previewInteracting=false;
    // A fresh opening starts at the top; subsequent rotations do not touch it.
    previewRotator.scrollTop=0;
    startPreviewCycle();
  }else{previewInteracting=false;stopPreviewCycle();}
}
highlightPreviewRows();
previewTrigger?.addEventListener('pointerenter',()=>setPreviewOpen(true));
previewTrigger?.addEventListener('focus',()=>setPreviewOpen(true));
navHeader?.querySelectorAll('.nav-item:not(#nav-projects),#theme-toggle,#header-contact').forEach(el=>el.addEventListener('pointerenter',()=>setPreviewOpen(false)));
navHeader?.addEventListener('pointerleave',()=>setPreviewOpen(false));
navHeader?.addEventListener('focusout',e=>{if(!navHeader.contains(e.relatedTarget))setPreviewOpen(false);});
previewRotator?.addEventListener('pointerleave',()=>{previewInteracting=false;startPreviewCycle();});
previewRotator?.addEventListener('focusout',e=>{if(!previewRotator.contains(e.relatedTarget)){previewInteracting=false;startPreviewCycle();}});
previewRotator?.addEventListener('wheel',()=>{previewInteracting=true;stopPreviewCycle();},{passive:true});
previewRotator?.addEventListener('touchstart',()=>{previewInteracting=true;stopPreviewCycle();},{passive:true});
previewRotator?.addEventListener('keydown',event=>{
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){
    previewInteracting=true;stopPreviewCycle();
    // Native keyboard scrolling; the list does not wrap or jump.
  }
});
navPreview?.querySelector('.nav-preview-all')?.addEventListener('click',()=>setPreviewOpen(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navPreview&&!navPreview.hidden)setPreviewOpen(false);});
window.addEventListener('resize',()=>{if(innerWidth<=900)setPreviewOpen(false);});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPreviewCycle();else startPreviewCycle();});

// The homepage introduction is always visible; no click-to-expand controls.
const roles=['AI & Data|Engineering Student','Internet of Things|Enthusiast','Background in|Electronics'];let roleIndex=0;const role=document.getElementById('rotating-role');function putRole(text){role.replaceChildren();text.split('|').forEach((line,n)=>{if(n)role.append(document.createElement('br'));line.split(' ').forEach((word,j)=>{if(j)role.append(document.createTextNode(' '));const group=document.createElement('span');group.className='role-word';for(const char of word){const span=document.createElement('span');span.className='role-character';span.textContent=char;group.append(span);}role.append(group);});});}putRole(roles[0]);setInterval(async()=>{if(motion.matches||document.hidden||isDetail||activeSection!=='home')return;const chars=[...role.querySelectorAll('.role-character')];await Promise.all(chars.map((c,i)=>c.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-10px)'}],{duration:220,delay:i*3,fill:'forwards'}).finished));roleIndex=(roleIndex+1)%roles.length;putRole(roles[roleIndex]);role.querySelectorAll('.role-character').forEach((c,i)=>c.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,delay:i*12,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));},5200);



// Portfolio assistant: private, browser-only replies grounded in this website.
const chatToggle=document.getElementById('chat-toggle');
const chatPanel=document.getElementById('portfolio-chat');
const chatMessages=document.getElementById('chat-messages');
const chatQuestion=document.getElementById('question');
const chatSend=document.getElementById('chat-send');
const chatQuickQuestions=document.getElementById('chat-quick-questions');
const chatWelcome=chatMessages.firstElementChild.cloneNode(true);
const portfolioMail='alagu.karthik17@gmail.com';

function openChat(){
  chatPanel.hidden=false;
  chatToggle.setAttribute('aria-expanded','true');
  chatQuestion.focus({preventScroll:true});
  chatMessages.scrollTop=chatMessages.scrollHeight;
}
function closeChat(){
  chatPanel.hidden=true;
  chatToggle.setAttribute('aria-expanded','false');
  chatToggle.focus({preventScroll:true});
}
chatToggle.addEventListener('click',()=>chatPanel.hidden?openChat():closeChat());
document.getElementById('chat-close').addEventListener('click',closeChat);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!chatPanel.hidden)closeChat();});
function updateComposer(){
  chatSend.disabled=!chatQuestion.value.trim();
  chatQuestion.style.height='auto';
  chatQuestion.style.height=Math.min(chatQuestion.scrollHeight,120)+'px';
}
chatQuestion.addEventListener('input',updateComposer);
chatQuestion.addEventListener('keydown',event=>{
  if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();submitChat();}
});
function addChatLine(who,message,link,reaction=false){
  const row=document.createElement('div');
  row.className='chat-line chat-line--'+who;
  if(who==='bot'){
    const avatar=document.createElement('span');avatar.className='chat-message-avatar';avatar.setAttribute('aria-hidden','true');avatar.textContent='K';row.append(avatar);
  }
  const bubble=document.createElement('div');bubble.className='chat-bubble';
  if(reaction){
    const sticker=document.createElement('div');sticker.className='chat-reaction';sticker.setAttribute('aria-label','Karthik says nope');
    const emoji=document.createElement('span');emoji.className='chat-reaction-emoji';emoji.textContent='🙃';
    const words=document.createElement('span');words.className='chat-reaction-words';words.textContent='NAH, WE GOOD';
    sticker.append(emoji,words);bubble.append(sticker);
  }
  const body=document.createElement('span');body.textContent=message;bubble.append(body);
  if(link){
    const action=document.createElement('a');action.className='chat-action';action.href=link.href;
    action.textContent=link.label+' ↗';
    if(link.href.startsWith('https://')){action.target='_blank';action.rel='noopener noreferrer';}
    bubble.append(action);
  }
  row.append(bubble);chatMessages.append(row);
  chatMessages.scrollTop=chatMessages.scrollHeight;
}
// Prewritten, self-contained portfolio knowledge. No external model or API key.

function offTopicResponse(q){
  if(/\b(suicide|self[- ]harm|hurt myself|kill myself|want to die)\b/i.test(q)){
    return {message:'If this is about your safety or someone else’s, please talk with a trusted person or local emergency service right now. This is only my prewritten portfolio assistant.'};
  }
  if(/\b(porn|nudes?|explicit sex|sexual content|rape|racial slur|hate speech|make (a )?bomb|explosives?|hack (an? |the )?(account|password|computer)|steal (data|passwords?|money)|make malware|doxx?|home address)\b/i.test(q)){
    return {message:'I keep this little portfolio chat focused on my projects, skills and engineering work. Try asking about one of those instead!',reaction:true};
  }
  if(/\b(fuck|shit|bitch|bastard|asshole|dumbass|idiot|stupid|loser|shut up|screw you|hate you|you suck|karthik sucks)\b/i.test(q)){
    return {message:'Let’s keep it friendly 😅 Ask me about what I’ve built or what I’m learning.',reaction:true};
  }
  return null;
}
function portfolioReply(raw){
  const q=raw.toLowerCase().replace(/[’]/g,"'").trim();
  const redir=offTopicResponse(q);
  if(redir)return redir;
  if(/\b(are you (a|an) (ai|bot)|are you real|are you human|(?:r u|are u|u r|u a|you are).{0,22}\b(?:ai|bot|human|real)|chatgpt|ai chatbot|who are you|who r u|karthikgpt)\b/.test(q))return {message:'I’m the prewritten portfolio version of Karthik, not a live AI or a real-time conversation with him. I answer in his voice using information from the site.'};
  if(/\b(hi|hey|hello|sup|yo|good morning|good evening)\b/.test(q)&&q.split(/\s+/).length<5)return {message:'Hey! I’m Karthik, well, my little prewritten portfolio assistant. Want to see my projects, skills, internship or achievements?'};
  if(/\b(thanks|thank you|tysm|thx)\b/.test(q))return {message:'You’re welcome! Want to explore another part of my portfolio?'};
  if(/\b(contact|email|reach|message|linkedin|hire|connect|collab|talk to|social)\b/.test(q))return {message:`You can contact me at ${portfolioMail}, or connect with me on LinkedIn.`,link:{label:'Contact me',href:'#contact'}};
  if(/\b(resume|cv|curriculum vitae|download pdf|download (it|file))\b/.test(q))return {message:'You can view or download my resume. It includes my education, achievements, technical skills and internship experience.',link:{label:'Open my resume (PDF)',href:'assets/karthik-resume.pdf'}};
  if(/\b(intern|internship|iwow|work experience|worked at|job|600|300|1200|lora|modbus|meter|esso)\b/.test(q))return {message:'I interned at iWOW Connections from April to August 2024. I configured 4G modems, IoT sensors and Modbus RTU devices, helped monitor meters over LoRa networks, and supported signal testing and documentation.',link:{label:'See my experience',href:'internship.html'}};
  if(/\b(awards?|prizes?|merit|director.s list|achievements?|honou?rs?|sinda|recognition|aeis)\b/.test(q))return {message:'My achievements include the Director’s List at NYP, two Director’s List awards at ITE, the ITE Certificate of Merit, the SINDA Excellence Awards 2025 and the AEIS Book Prize from ITE.',link:{label:'My achievements',href:'#about'}};
  if(/\b(tri[- ]?star|wheelchair|curb|engineering exploration|mobility|wheel attachment)\b/.test(q))return {message:'For my Engineering Exploration Project, my team explored a motorised tri-star wheel attachment to help wheelchair users overcome curbs. I worked on the switch, Arduino Uno and DC motor circuit, and took part in brainstorming and testing. We tested the concept with a small-scale prototype.',link:{label:'My engineering project',href:'#project-engineering-exploration'}};
  if(/\b(road safety|road accident|road infrastructure|traffic accidents?|traffic lights|fatalities|death rate|injury rate|road condition)\b/.test(q))return {message:'For my Road Safety & Infrastructure Analysis project, I used Singapore road data and Power BI to compare infrastructure growth with accident, injury and death trends. I focused on the infrastructure theme for our group.',link:{label:'My road safety project',href:'#project-road-safety'}};
  if(/\b(construction|fall detection|fall|slip|near[- ]?miss|safety|wearable|vest|data engineering project)\b/.test(q))return {message:'For my Data Engineering Project, my team built a wearable-sensor prototype to collect movement data and highlight potential slips, falls and near-misses. I developed the Main.py launcher that starts our Python data collection and processing scripts.',link:{label:'My data project',href:'#project-data-engineering'}};
  if(/\b(aws|cloud computing|ec2|s3 bucket|auto scaling|load balancer|rds|boto3)\b/.test(q))return {message:'In my Cloud Computing Development Project, I built an AWS-hosted music-store catalogue using EC2, an Application Load Balancer, Auto Scaling, RDS MySQL and S3. I also configured monitoring, budget alerts and Python health checks.',link:{label:'My Cloud project',href:'#project-cloud-computing'}};
  if(/\b(sustainable|smart home|plant care|thing speak|thingspeak|zigbee|home automation|energy saving)\b/.test(q))return {message:'I built the DHT11 ventilation and ultrasonic alert logic, helped integrate the Arduino code, and sent readings to ThingSpeak using Python. Our school prototype also included lighting and soil-moisture monitoring.',link:{label:'My IoT project',href:'#project-iot-sustainable-living'}};
  if(/\b(projects?|portfolio|built|build|work on|made|case stud)\b/.test(q))return {message:'I’m featuring five published projects: NESSO construction-safety monitoring, the TRI-STAR wheelchair concept, a connected IoT household prototype, an AWS-hosted music store, and my road safety analysis. Project 05 is reserved for later. Each has its own project page.',link:{label:'Explore my projects',href:'#projects'}};
  if(/\b(higher nitec|ite|electronics|education|degree|diploma|nyp|polytechnic|stud(y|ies|ying)|school|course|qualification|graduate|secondary)\b/.test(q))return {message:'I’m studying for a Diploma in AI & Data Engineering at Nanyang Polytechnic. Before that, I completed Higher Nitec in Electronics Engineering at ITE, and I attended Christ Church Secondary School.',link:{label:'My education timeline',href:'#about'}};
  if(/\b(python|power bi|powerbi|mysql|sql|pandas|numpy|matplotlib|aws|machine learning|code|programming|skills?|tools?|technology|stack|arduino|raspberry|sensor|iot|ble|cloud|deep learning|nlp|computer vision)\b/.test(q))return {message:'I work with Python, Pandas, NumPy, Matplotlib, Power BI, Scikit-learn, Arduino (C/C++), Raspberry Pi, M5Stack, BLE, AWS Cloud and MySQL. I’m also learning more about Deep Learning, NLP and Computer Vision.',link:{label:'My skills & tools',href:'#about'}};
  if(/\b(interest|passion|motivat|why ai|artificial intelligence|data science|future|goal|aspir)\b/.test(q))return {message:'I enjoy exploring how AI, data and connected devices can turn practical ideas into useful things. That’s why I like learning by building projects.',link:{label:'More about me',href:'#about'}};
  if(/\b(hobb|free time|outside|fun|video games?|games?|books?|reading|shows?|movies?|spare time)\b/.test(q))return {message:'Outside of technology, I enjoy reading, watching shows and playing video games.'};
  if(/\b(name|karthik|who is he|about him|background|tell me about|about you|who you are)\b/.test(q))return {message:'I’m Palaniappan Alagu Karthik, an AI & Data Engineering student at Nanyang Polytechnic. I previously studied Electronics Engineering at ITE, and I enjoy AI, IoT and hands-on engineering projects.',link:{label:'More about me',href:'#about'}};
  return {message:'I don’t have a reliable answer to that in my portfolio notes yet. Try asking about my internship, projects, education, achievements or skills.',link:{label:'Explore my projects',href:'#projects'}};
}

function submitChat(value){
  const text=(typeof value==='string'?value:chatQuestion.value).trim().slice(0,350);
  if(!text)return;
  addChatLine('user',text);
  if(chatQuickQuestions)chatQuickQuestions.hidden=true;
  chatQuestion.value='';updateComposer();
  const response=portfolioReply(text);
  addChatLine('bot',response.message,response.link,response.reaction);
  chatQuestion.focus({preventScroll:true});
}
document.getElementById('question-form').addEventListener('submit',event=>{event.preventDefault();submitChat();});
chatQuickQuestions.querySelectorAll('[data-chat-question]').forEach(button=>button.addEventListener('click',()=>submitChat(button.dataset.chatQuestion)));
document.getElementById('chat-reset').addEventListener('click',()=>{
  chatMessages.replaceChildren(chatWelcome,chatQuickQuestions);
  chatQuickQuestions.hidden=false;chatQuestion.value='';updateComposer();chatQuestion.focus({preventScroll:true});
});
updateComposer();


document.getElementById('copy-email').addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{await navigator.clipboard.writeText('alagu.karthik17@gmail.com');status.textContent='Email address copied.';}catch{status.textContent='You can select the email address above or click it to open your email app.';}});

// Interactions use the existing photograph and respect reduced motion.
const hero=document.querySelector('.hero'),portrait=document.querySelector('.portrait-frame');let tiltTarget={x:0,y:0},tilt={x:0,y:0};
hero.addEventListener('pointermove',e=>{if(motion.matches||e.pointerType==='touch')return;const r=hero.getBoundingClientRect();const px=(e.clientX-r.left)/r.width;const py=(e.clientY-r.top)/r.height;hero.style.setProperty('--pointer-x',(px*100)+'%');hero.style.setProperty('--pointer-y',(py*100)+'%');hero.style.setProperty('--sun-tx',((px-.5)*8).toFixed(1)+'px');hero.style.setProperty('--sun-ty',((py-.45)*5).toFixed(1)+'px');hero.style.setProperty('--ray-tilt',(-2.6+px*1.8).toFixed(2)+'deg');});hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--sun-tx','0px');hero.style.setProperty('--sun-ty','0px');hero.style.setProperty('--ray-tilt','-2deg');});
portrait.addEventListener('pointermove',e=>{if(motion.matches||e.pointerType==='touch')return;const r=portrait.getBoundingClientRect();tiltTarget.x=-(e.clientY-r.top-r.height/2)/r.height*10;tiltTarget.y=(e.clientX-r.left-r.width/2)/r.width*12;});portrait.addEventListener('pointerleave',()=>{tiltTarget={x:0,y:0};});function tiltFrame(){if(!motion.matches&&!isDetail&&activeSection==='home'){tilt.x+=(tiltTarget.x-tilt.x)*.09;tilt.y+=(tiltTarget.y-tilt.y)*.09;portrait.style.transform='perspective(1000px) rotateX('+tilt.x+'deg) rotateY('+tilt.y+'deg)';}else portrait.style.transform='none';requestAnimationFrame(tiltFrame);}requestAnimationFrame(tiltFrame);
const hold=document.getElementById('hero-about'),holdText=hold.querySelector('.hold-text');let holdStart=0,holdFrame;function cancelHold(){cancelAnimationFrame(holdFrame);hold.style.setProperty('--hold','0%');holdText.textContent='About me';}hold.addEventListener('pointerdown',e=>{if(e.button!==0||motion.matches)return;holdStart=performance.now();heldTriggered=false;const tick=()=>{const amount=Math.min(1,(performance.now()-holdStart)/750);hold.style.setProperty('--hold',amount*100+'%');holdText.textContent=amount>.2?'Keep holding':'About me';if(amount>=1){heldTriggered=true;history.pushState(null,'','#about');navigate();cancelHold();return;}holdFrame=requestAnimationFrame(tick);};holdFrame=requestAnimationFrame(tick);});['pointerup','pointercancel','pointerleave'].forEach(e=>hold.addEventListener(e,cancelHold));
document.querySelectorAll('.pill-link,.contact-pill,.project-card').forEach(el=>el.addEventListener('pointermove',e=>{if(motion.matches)return;const r=el.getBoundingClientRect();el.style.setProperty('--hover-x',(e.clientX-r.left)+'px');el.style.setProperty('--hover-y',(e.clientY-r.top)+'px');}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.about-intro,.tile-animate,.project-card,.contact-view,.about-prompt').forEach(el=>{if(!motion.matches){el.classList.add('scroll-reveal');observer.observe(el);}});motion.addEventListener('change',()=>{if(motion.matches)document.querySelectorAll('.scroll-reveal').forEach(el=>el.classList.add('in-view'));});
// Animate resume metrics once when the relevant card is visible.
const metricsCard=document.querySelector('.tile-internship');
if(metricsCard){
  let metricsAnimated=false;
  const metricsObserver=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting)||metricsAnimated)return;
    metricsAnimated=true;metricsObserver.disconnect();
    if(motion.matches)return;
    metricsCard.querySelectorAll('.count-number').forEach((node,index)=>{
      const target=Number(node.dataset.count);const t0=performance.now();
      node.textContent='0';
      function tick(now){
        const time=Math.min(1,(now-t0-index*80)/1100);
        if(time<0){requestAnimationFrame(tick);return;}
        const eased=1-Math.pow(1-time,3);
        node.textContent=Math.floor(target*eased).toLocaleString('en-SG');
        if(time<1)requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  },{threshold:.2});
  metricsObserver.observe(metricsCard);
}

// Soft, independently fading dots behind the home content.
(() => {
  const canvas = document.getElementById('particles');
  const hero = canvas?.parentElement;
  const ctx = canvas?.getContext('2d');
  if (!hero || !ctx) return;
  let width = 0, height = 0, dots = [], visible = false, frame = 0, previous = 0;

  function paint(now) {
    ctx.clearRect(0, 0, width, height);
    const rgb = root.dataset.theme === 'dark' ? '235,229,219' : '48,42,36';
    for (const dot of dots) {
      const wave = (1 + Math.sin(now / 1000 * dot.speed + dot.phase)) / 2;
      const alpha = motion.matches ? dot.strength * .45 : wave * wave * dot.strength;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${rgb},${alpha})`;
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animate(now) {
    frame = 0;
    if (!visible || document.hidden || motion.matches) return;
    if (now - previous >= 32) {
      previous = now;
      paint(now);
    }
    frame = requestAnimationFrame(animate);
  }

  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (!visible || document.hidden) return;
    paint(performance.now());
    if (!motion.matches) frame = requestAnimationFrame(animate);
  }

  function resizeDots() {
    const rect = hero.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * ratio);
    canvas.height = Math.ceil(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = width < 760 ? 36 : Math.min(110, Math.max(60, Math.round(width * height / 21000)));
    dots = Array.from({length: count}, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: .8 + Math.random() * 2.5,
      strength: .15 + Math.random() * .25,
      phase: Math.random() * Math.PI * 2,
      speed: .55 + Math.random() * .85
    }));
    sync();
  }

  new ResizeObserver(resizeDots).observe(hero);
  new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    sync();
  }).observe(hero);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  new MutationObserver(sync).observe(root, {attributes: true, attributeFilter: ['data-theme']});
  resizeDots();
})();

})();


// Decorative Contact particles: same understated dots as the landing hero,
// but each dot gently fades in and out. Draw only while Contact is visible.
(() => {
  const section = document.getElementById('contact');
  const canvas = document.getElementById('contact-particles');
  if (!section || !canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, dots = [], visible = false, frame = 0, previous = 0;

  function resizeDots() {
    const rect = section.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * pixelRatio);
    canvas.height = Math.ceil(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const count = width < 620 ? 36 : Math.min(94, Math.round(width * height / 16000));
    dots = Array.from({length: count}, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1.7 + Math.random() * 2.1,
      strength: .30 + Math.random() * .40,
      phase: Math.random() * Math.PI * 2,
      speed: .65 + Math.random() * .9,
      drift: 1.5 + Math.random() * 5
    }));
  }

  function draw(now) {
    frame = 0;
    if (!visible || document.hidden || reducedMotion.matches) return;
    if (now - previous >= 32) { // ~30 fps, no layout work in animation loop
      previous = now;
      ctx.clearRect(0, 0, width, height);
      const t = now / 1000;
      const rgb = document.documentElement.dataset.theme === 'dark' ? '235,235,235' : '48,42,36';
      for (const dot of dots) {
        const pulse = Math.max(0, Math.sin(t * dot.speed + dot.phase));
        const alpha = pulse * pulse * dot.strength;
        if (alpha < .012) continue;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb},${alpha.toFixed(3)})`;
        ctx.arc(dot.x + Math.sin(t * .28 + dot.phase) * dot.drift,
                dot.y + Math.cos(t * .2 + dot.phase) * dot.drift,
                dot.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    frame = window.requestAnimationFrame(draw);
  }

  function syncAnimation() {
    if (visible && !document.hidden && !reducedMotion.matches) {
      if (!frame) frame = window.requestAnimationFrame(draw);
    } else {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      ctx.clearRect(0, 0, width, height);
    }
  }

  new ResizeObserver(resizeDots).observe(section);
  resizeDots();
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    syncAnimation();
  }, { threshold: 0, rootMargin: '80px 0px' });
  observer.observe(section);
  document.addEventListener('visibilitychange', syncAnimation);
  reducedMotion.addEventListener('change', syncAnimation);
})();

/* Achievements details remain available as a coming-soon notice. */
(()=>{
  const notice=document.getElementById('coming-soon-notice');
  if(!notice)return;
  let hideTimer,resetTimer;
  const show=label=>{
    clearTimeout(hideTimer);clearTimeout(resetTimer);
    notice.textContent=`${label} page coming soon`;
    notice.hidden=false;
    requestAnimationFrame(()=>notice.classList.add('is-visible'));
    hideTimer=setTimeout(()=>{
      notice.classList.remove('is-visible');
      resetTimer=setTimeout(()=>{notice.hidden=true},220);
    },2400);
  };
  document.querySelectorAll('[data-coming-soon]').forEach(card=>{
    const activate=()=>show(card.dataset.comingSoon);
    card.addEventListener('click',activate);
    card.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){event.preventDefault();activate()}
    });
  });
})();
