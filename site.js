
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
  {slug:'data-engineering',category:'Data engineering',title:'Data Engineering Project',name:'Data Engineering Project',image:'assets/project-data.jpg',summary:'A wearable sensor system that detects falls, slips and near-misses on construction sites.',mapLabel:'Data Engineering Project',mapPosition:[24,55],topics:['sensors','ble','realtime','python','pandas','mysql','powerbi','preprocessing','wearables']},
  {slug:'engineering-exploration',category:'Engineering exploration',title:'Engineering Exploration Project',name:'Engineering Exploration Project',image:'assets/project-engineering.jpg',summary:'A motorised tri-star wheel attachment that helps self-propelled wheelchair users climb curbs.',mapLabel:'Engineering Exploration Project',mapPosition:[58,42],topics:['accessibility','mechanical','arduino','motors','circuit','prototype','sketch','testing']},
  {slug:'iot-sustainable-living',category:'Internet of Things',title:'IoT System for Sustainable Household Living',name:'IoT System for Sustainable Household Living',image:'assets/iot-hardware-workbench.webp',summary:'We used sensors to help with four things at home: temperature, lights, plants and the front door.',mapLabel:'IoT System for Sustainable Household Living',mapPosition:[77,61],topics:['sensors','connected','energy','automation','embedded','sustainability','arduino']},
  {slug:'cloud-computing',category:'Cloud Computing',title:'Cloud Computing Development Project',name:'Cloud Computing Development Project',image:'assets/cloud-storefront-1.webp',summary:'I built a small music-store website on AWS, then worked out how to keep it running and within budget.',mapLabel:'Cloud Computing Development Project',mapPosition:[77,-43],topics:['aws','ec2','rds','s3','monitoring','python','mysql']}
];
const projectMapTopics=[
  {id:'python',label:'Python',coords:[5,-30]},
  {id:'pandas',label:'Pandas',coords:[-25,-7]},
  {id:'mysql',label:'MySQL',coords:[-39,-48]},
  {id:'powerbi',label:'Power BI',coords:[-8,8]},
  {id:'preprocessing',label:'Data processing',coords:[-55,-22]},
  {id:'wearables',label:'Wearable sensors',coords:[-8,-78]},
  {id:'realtime',label:'Real-time data',coords:[15,-67]},
  {id:'accessibility',label:'Accessibility',coords:[64,-43]},
  {id:'mechanical',label:'Mechanical design',coords:[54,43]},
  {id:'arduino',label:'Arduino Uno',coords:[33,-17]},
  {id:'motors',label:'DC motors',coords:[43,22]},
  {id:'circuit',label:'Circuit building',coords:[30,-46]},
  {id:'prototype',label:'Prototyping',coords:[24,7]},
  {id:'sketch',label:'3D sketching',coords:[45,-77]},
  {id:'testing',label:'Prototype testing',coords:[-38,-83]},
  {id:'connected',label:'Connected devices',coords:[18,85]},
  {id:'energy',label:'Energy saving',coords:[-40,68]},
  {id:'automation',label:'Home automation',coords:[-24,112]},
  {id:'embedded',label:'Embedded systems',coords:[-3,108]},
  {id:'sustainability',label:'Sustainable living',coords:[-57,39]},
  {id:'sensors',label:'Sensors',coords:[27,61]},
  {id:'aws',label:'AWS Cloud',coords:[-28,-124]},
  {id:'ec2',label:'EC2 & Scaling',coords:[29,-128]},
  {id:'rds',label:'RDS Multi-AZ',coords:[-48,-134]},
  {id:'s3',label:'S3 Storage',coords:[50,-111]},
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
    'cloud-computing':[2,-122]
  };
  const globeNodes=[
    ...projectData.map(project=>({id:project.slug,label:project.mapLabel,project,coords:sph(...geo[project.slug])})),
    ...projectMapTopics.map(topic=>({id:topic.id,label:topic.label,coords:sph(...topic.coords)}))
  ];
  const byId=new Map(globeNodes.map(node=>[node.id,node]));
  const edges=projectData.flatMap(project=>(project.topics||[]).filter(t=>byId.has(t)).map(topic=>[byId.get(project.slug),byId.get(topic)]));
  for(let i=0;i<projectData.length;i++){
    edges.push([byId.get(projectData[i].slug),byId.get(projectData[(i+1)%projectData.length].slug)]);
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
  const number=document.createElement('span');number.textContent=String(index+1).padStart(2,'0');
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
  card.querySelector('.project-meta span:first-child').textContent=String(index+1).padStart(2,'0');
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
  'data-engineering':[
    ['Overview','.ed-project-hero'],['Problem & solution','.nesso-pair'],
    ['How it works','.nesso-system'],['Results','.nesso-results-media'],
    ['My contribution','.nesso-role'],['Outcome','.nesso-outcome']
  ],
  'engineering-exploration':[
    ['Overview','.ed-project-hero'],['The problem','.tri-intro'],
    ['The solution','.tri-mechanism'],['Design process','.tri-process'],
    ['Prototype test','.tri-demo'],['My contribution','.tri-role'],['Outcome','.tri-finale']
  ],
  'iot-sustainable-living':[
    ['Overview','.ed-project-hero'],['The challenge','.iot-home-intro'],['Four systems','.iot-features'],['Actual hardware','.iot-evidence'],['My contribution','.iot-contribution'],['Outcome','.iot-conclusion']
  ],
  'cloud-computing':[
    ['Overview','.ed-project-hero'],['The challenge','.cloud-intro'],['Architecture','.cloud-architecture'],['The storefront','.cloud-storefront'],['Operations','.cloud-operations'],['Outcome','.cloud-finale']
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
  sectionRail.innerHTML=homeRailHTML;
  sectionRail.setAttribute('aria-label','Section shortcuts');
  detailRailTargets=[];
}
function showProjectRail(project){
  if(!sectionRail)return;
  const sections=projectRailSections[project.slug]||[];
  detailRailTargets=sections.map(([label,selector],index)=>{
    const target=detail.querySelector(selector);
    if(!target)return null;
    const id=`case-${project.slug}-section-${index+1}`;
    target.id=id;
    return {id,label,target};
  }).filter(Boolean);
  sectionRail.setAttribute('aria-label',`${project.name} sections`);
  sectionRail.innerHTML=detailRailTargets.map(({id,label})=>
    `<a href="#${id}" data-detail-rail="${id}" aria-label="${label}"><span class="rail-stroke"></span><span class="rail-name">${label}</span></a>`
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
    <div class="nesso-fact-strip" aria-label="Project at a glance">
      <div><strong>04</strong><span>NESSO devices tested</span></div>
      <div><strong>0.1<span>s</span></strong><span>Motion reading interval</span></div>
      <div><strong>60<span>s</span></strong><span>Data processing cycle</span></div>
    </div>
    <section class="nesso-story nesso-pair" aria-label="The problem and solution">
      <article class="nesso-story-problem"><span class="nesso-card-ornament" aria-hidden="true">✳</span>
        <span class="ed-label">THE PROBLEM</span>
        <h2>On a construction site, an accident can go unnoticed.</h2>
        <p>Falls, slips, trips and near-misses can happen in seconds. Supervisors need a clearer way to monitor worker safety.</p>
      </article>
      <article class="nesso-story-solution"><div class="nesso-solution-motif" aria-hidden="true"><span></span><span></span><span></span></div>
        <span class="ed-label">THE SOLUTION</span>
        <h2>Turn movement into useful safety data.</h2>
        <p>We built a wearable NESSO system that collects movement readings, identifies possible incidents and shows them in Power BI.</p>
      </article>
    </section>

    <section class="nesso-story nesso-system" aria-label="How our NESSO safety monitoring pipeline works">
      <div class="nesso-section-heading flow-intro">
        <span class="ed-label">HOW IT WORKS</span>
        <h2>One flow.<br>From sensor to insight.</h2>
        <p>From four wearable NESSO devices to a worker-safety dashboard, with Python running the data pipeline.</p>
      </div>
      <div class="nesso-clean-flow" data-flow-animated="true" role="img" aria-label="Main.py starts and monitors the collection and processing programs in parallel. DataCollection.py receives BLE readings from four NESSO devices every 0.1 seconds and writes complete CSV files to a queue every 60 seconds. Preprocessing and Upload.py processes those files, classifies incidents, saves data to MySQL, and Power BI displays the results.">
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
      </div>
    </section>

    <section class="nesso-story nesso-results-media" aria-label="Database and original Power BI results">
      <div class="nesso-section-heading"><span class="ed-label">ACTUAL PROJECT RESULTS</span><h2>Here's what<br>we built.</h2><p>Original visuals from our MySQL database and Power BI dashboard.</p></div>
      <div class="nesso-results-gallery">
        <figure class="nesso-image-card nesso-gallery-main"><button class="ed-image-open" type="button" data-photo="assets/nesso-dashboard-overview.png" data-alt="Power BI original dashboard overview with acceleration, incidents, severity and movement charts" aria-label="Open Power BI dashboard image"><img src="assets/nesso-dashboard-overview.png" loading="lazy" alt="Original Power BI overview of worker movement and incident data"></button><figcaption>Power BI · Worker safety overview <span aria-hidden="true">↗</span></figcaption></figure>
        <figure class="nesso-image-card"><button class="ed-image-open" type="button" data-photo="assets/nesso-database.png" data-alt="Original MySQL worker safety database table" aria-label="Open original MySQL database screenshot"><img src="assets/nesso-database.png" loading="lazy" alt="MySQL records from wearable NESSO sensors"></button><figcaption>MySQL · Individual worker readings <span aria-hidden="true">↗</span></figcaption></figure>
        <figure class="nesso-image-card"><button class="ed-image-open" type="button" data-photo="assets/nesso-acceleration-chart.png" data-alt="Actual acceleration magnitude chart from Power BI" aria-label="Open acceleration chart"><img src="assets/nesso-acceleration-chart.png" loading="lazy" alt="Power BI acceleration magnitude trend with spikes"></button><figcaption>Acceleration · Possible incidents appear as spikes <span aria-hidden="true">↗</span></figcaption></figure>
        <figure class="nesso-image-card"><button class="ed-image-open" type="button" data-photo="assets/nesso-incidents-chart.png" data-alt="Actual accident distribution chart with near misses, slips trips falls and falls from height" aria-label="Open incident breakdown"><img src="assets/nesso-incidents-chart.png" loading="lazy" alt="Power BI accident distribution chart showing near misses and other incidents"></button><figcaption>Incident types · Near-misses were most common <span aria-hidden="true">↗</span></figcaption></figure>
      </div>
    </section>

    <section class="nesso-story nesso-role" aria-label="My contribution">
      <div class="nesso-section-heading"><span class="ed-label">MY CONTRIBUTION</span><h2>Making the<br>pieces work together.</h2><span class="nesso-code-mark" aria-hidden="true">&lt;/&gt;</span></div>
      <div class="nesso-role-copy"><div class="nesso-role-file"><span class="nesso-role-file-dot" aria-hidden="true"></span> MAIN.PY <span class="nesso-role-file-meta">SOFTWARE / LAUNCHER</span></div><p>I developed <strong>Main.py</strong>, the launcher that takes worker and BLE device names, then starts the data collection and processing scripts together.</p><p>It made startup and shutdown simpler and helped the team run both parts of the pipeline side by side.</p></div>
    </section>

    <section class="nesso-story nesso-outcome" aria-label="Outcome, testing and technologies">
      <div class="nesso-outcome-photo nesso-image-card"><button class="ed-image-open" type="button" data-photo="assets/nesso-field-test.png" data-alt="Original school field testing photograph of the team testing four NESSO devices" aria-label="View original field testing photo"><img src="assets/nesso-field-test.png" loading="lazy" alt="In-school field test with the group using NESSO devices"></button><span class="nesso-photo-caption">In-school field testing · Original presentation</span></div>
      <div class="nesso-outcome-copy"><span class="ed-label">THE OUTCOME</span><h2>Four sensors.<br>A working prototype.</h2><p>In our school test, all four NESSO devices collected data and the system recorded simulated near-misses, slips/trips and fall events. Data moved through the pipeline to the dashboard within about a minute.</p><p class="nesso-outcome-note">Still a prototype: fixed thresholds can produce false flags, and Bluetooth range and battery life need improving before real-world deployment.</p><div class="ed-tags"><span>Python</span><span>BLE</span><span>Arduino NESSO</span><span>Pandas</span><span>MySQL</span><span>Power BI</span></div></div>
    </section>
  `,
  'engineering-exploration':`

    <section class="tri-intro tri-reveal" aria-label="The problem">
      <div class="tri-intro-copy"><span class="tri-eyebrow">THE PROBLEM</span>
        <h2>A small curb.<br><em>A big barrier.</em></h2>
        <p>For many self-propelled wheelchair users, getting past a curb can mean taking a longer route or relying on a ramp. We wanted to explore another way forward.</p>
        <span class="tri-sidenote">A mobility concept developed by our team</span>
      </div>
      <figure class="tri-image-tile tri-curb-photo">
        <button class="ed-image-open" type="button" data-photo="assets/tri-curb.jpg" data-alt="Original curb photograph from the TRI-STAR presentation" aria-label="Enlarge photograph of the curb"><img src="assets/tri-curb.jpg" alt="A curb separating a footpath and road" loading="lazy"></button>
        <figcaption>THE EVERYDAY OBSTACLE <span aria-hidden="true">↗</span></figcaption>
      </figure>
    </section>

<section class="tri-mechanism tri-reveal tri-mechanism--authentic tri-mechanism--interactive" aria-label="TRI-STAR wheel concept and how the mechanism works">
  <div class="tri-mechanism-left">
    <span class="tri-eyebrow">THE SOLUTION</span>
    <h2>Three wheels.<br>One idea.</h2>
    <p>The front caster is replaced by three small wheels positioned around a motor-driven hub, designed to help a wheelchair move over raised curbs.</p>
    <button class="tri-rotate-button" type="button" data-tri-toggle aria-pressed="true" aria-label="Pause wheel animation"><iconify-icon icon="lucide:pause" aria-hidden="true"></iconify-icon><span>Pause animation</span></button>
  </div>
  <div class="tri-mechanism-art" aria-label="Animated side view of three wheels revolving around a central hub, demonstrating the TRI-STAR design approaching a curb" role="img">
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
  </div>
</section>

    <section class="tri-process tri-reveal" aria-label="The design process">
      <div class="tri-section-head"><div><span class="tri-eyebrow">THE DESIGN PROCESS</span><h2>From sketches<br>to a prototype.</h2></div><p>We brainstormed, compared ideas and tested a scaled wheel mechanism.</p></div>
      <div class="tri-process-grid">
        <article class="tri-process-ideation tri-process-card"><span class="tri-card-label">EXPLORE / IDEATE</span><strong class="tri-card-number">08</strong><h3>Eight early concepts.</h3><p>We compared different ways to overcome curbs before choosing the tri-star idea.</p>
          <details class="tri-ideas"><summary>See the eight concepts <span aria-hidden="true">+</span></summary><ul><li>Big wheels at the front</li><li>Curb-climber lever</li><li>Belt / tank wheelchair</li><li>Rear piston wheel</li><li>Tri-star front wheels</li><li>Front belt / tank wheels</li><li>Lower centre of gravity</li><li>Front piston wheel</li></ul></details>
        </article>
        <figure class="tri-process-sketch tri-process-card tri-process-drawings"><span class="tri-card-label">OUR HAND-DRAWN IDEAS</span><a href="https://static.wixstatic.com/media/a3abd1_c107b200cdaa4b649ca409b76e899055~mv2.png/v1/fill/w_980%2Ch_710%2Cal_c%2Cq_90%2Cusm_0.66_1.00_0.01%2Cenc_auto/dfdfdfadasasasa.png" target="_blank" rel="noopener noreferrer" aria-label="View the original hand-drawn designs on Wix"><img src="https://static.wixstatic.com/media/a3abd1_c107b200cdaa4b649ca409b76e899055~mv2.png/v1/fill/w_980%2Ch_710%2Cal_c%2Cq_90%2Cusm_0.66_1.00_0.01%2Cenc_auto/dfdfdfadasasasa.png" alt="Team's original wheelchair ideation drawings" loading="lazy"></a><figcaption>ORIGINAL SKETCH SHEET <span>↗</span></figcaption></figure>
        <figure class="tri-process-build tri-process-card"><span class="tri-card-label">BUILD / TEST</span><button class="ed-image-open" type="button" data-photo="assets/tri-prototype-closeup.jpg" data-alt="Original photograph of the small TRI-STAR wheel prototype" aria-label="Expand original prototype photograph"><img src="assets/tri-prototype-closeup.jpg" alt="Close-up of the team's scaled prototype, with three wheels on the rotating assembly" loading="lazy"></button><figcaption>ACTUAL SCALED PROTOTYPE <span>↗</span></figcaption></figure>
      </div>
    </section>

    <section class="tri-demo tri-reveal" aria-label="Original prototype demonstration videos">
      <div class="tri-section-head tri-demo-head"><div><span class="tri-eyebrow">PROTOTYPE DEMONSTRATION</span><h2>See the difference.</h2></div><p>Watch the two original prototype tests right here.</p></div>
      <div class="tri-demo-grid">
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
      </div>
    </section>

    <section class="tri-role tri-reveal" aria-label="My contribution">
      <article class="tri-role-main"><span class="tri-eyebrow">MY CONTRIBUTION</span><h2>I worked on the<br><em>circuit that drives it.</em></h2><p>I designed and wired the slide switch, Arduino Uno and DC motor setup. I also shared ideas during our Crazy 8s brainstorming and helped test the connections with the team.</p></article>
      <article class="tri-role-circuit"><span class="tri-card-label">HOW THE CIRCUIT WORKS</span><div class="tri-circuit-stages" aria-label="Slide switch sends an input to the Arduino Uno, which activates the DC motor"><div><span class="tri-circuit-mark"><iconify-icon icon="lucide:toggle-right" aria-hidden="true"></iconify-icon></span><strong>Slide switch</strong><small>Input</small></div><span class="tri-circuit-line" aria-hidden="true"></span><div><span class="tri-circuit-mark"><iconify-icon icon="lucide:cpu" aria-hidden="true"></iconify-icon></span><strong>Arduino Uno</strong><small>Control</small></div><span class="tri-circuit-line" aria-hidden="true"></span><div><span class="tri-circuit-mark"><iconify-icon icon="lucide:settings" aria-hidden="true"></iconify-icon></span><strong>DC motor</strong><small>Output</small></div></div><p>Flick the switch, and the controller activates the motor that turns the tri-star wheels.</p></article>
    </section>

    <section class="tri-finale tri-reveal" aria-label="Outcome and skills">
      <div class="tri-outcome"><span class="tri-eyebrow">THE OUTCOME</span><h2>From an idea<br>to a working test.</h2><p>Our team built a small prototype that demonstrated the rotating tri-star mechanism. The circuit successfully triggered the DC motor. Further material development, testing and safety refinement would be needed for a full-size wheelchair.</p></div>
      <div class="tri-finale-aside"><span class="tri-eyebrow">SKILLS &amp; TECHNOLOGIES</span><div class="ed-tags"><span>Engineering design</span><span>Arduino Uno</span><span>DC motor</span><span>Circuit building</span><span>Prototyping</span><span>3D sketching</span><span>Testing</span></div><p class="tri-future">NEXT STEP / The team proposed further research, materials and unit testing.</p></div>
    </section>
  `,
  'iot-sustainable-living':`
  <section class="iot-home-intro case-reveal-parent" aria-label="Project challenges">
    <div class="iot-intro-type"><span class="ed-label">THE PROBLEM</span><h2>We started with everyday problems.</h2><p>Our group wanted to make a few things around the house easier: keeping a room cool, switching off lights when there’s enough daylight, checking plant soil and knowing when someone is near the door.</p></div>
    <div class="iot-intro-index"><span>01 — COMFORT</span><span>02 — ENERGY</span><span>03 — PLANT CARE</span><span>04 — SECURITY</span></div>
  </section>
  <section class="iot-features" aria-label="Four connected home systems">
    <div class="iot-heading"><span class="ed-label">THE SOLUTION</span><h2>We gave each problem<br>its own sensor.</h2><p>Then we connected everything through an Arduino so the system could respond on its own.</p></div>
    <div class="iot-feature-grid">
      <article class="iot-feature-tile"><span class="iot-feature-id">01 / TEMPERATURE</span><div class="iot-feature-icon"><iconify-icon icon="lucide:thermometer-sun"></iconify-icon></div><h3>When it gets too warm.</h3><p>At 29°C or above, the DHT11 tells the Arduino to switch on the ventilation relay.</p><div class="iot-rule"><span>29°C+</span><span>VENTILATION ON</span></div></article>
      <article class="iot-feature-tile"><span class="iot-feature-id">02 / LIGHT</span><div class="iot-feature-icon"><iconify-icon icon="lucide:sun"></iconify-icon></div><h3>When there’s enough daylight.</h3><p>The light sensor checks how bright it is outside. If there’s enough light, the relay switches the indoor lights off.</p><div class="iot-rule"><span>LDR</span><span>LIGHT CONTROL</span></div></article>
      <article class="iot-feature-tile"><span class="iot-feature-id">03 / PLANTS</span><div class="iot-feature-icon"><iconify-icon icon="lucide:sprout"></iconify-icon></div><h3>When the plants need water.</h3><p>The NeoPixel shows red for dry soil, green for moist and blue for wet, so it’s easy to see when to water.</p><div class="iot-soil-dots" aria-label="Red dry, green moist, blue wet"><i title="Dry"></i><i title="Moist"></i><i title="Wet"></i><small>DRY · MOIST · WET</small></div></article>
      <article class="iot-feature-tile"><span class="iot-feature-id">04 / DOORWAY</span><div class="iot-feature-icon"><iconify-icon icon="lucide:radio"></iconify-icon></div><h3>When someone’s at the door.</h3><p>If someone stays within 150 cm of the door for three seconds, the ultrasonic sensor triggers an MP3 alert.</p><div class="iot-rule"><span>≤150 CM</span><span>3-SECOND CHECK</span></div></article>
    </div>
  </section>
  <section class="iot-connection" aria-label="Connecting hardware and cloud">
    <div class="iot-connect-copy"><span class="ed-label">SYSTEM FLOW</span><h2>Getting the readings online.</h2><p>The Arduino handled the sensors and their responses. We then used a Raspberry Pi, ZigBee and Python to send readings to ThingSpeak, where we could follow them on a dashboard.</p><div class="ed-tags"><span>Arduino Nano</span><span>Raspberry Pi</span><span>ZigBee</span><span>Python</span><span>ThingSpeak</span></div></div>
    <div class="iot-wire" role="img" aria-label="Sensor readings into Arduino Nano, through Raspberry Pi and Python, then to ThingSpeak dashboards"><div><iconify-icon icon="lucide:radio-tower"></iconify-icon><strong>Sensors</strong><small>4 household uses</small></div><b aria-hidden="true">→</b><div><iconify-icon icon="lucide:cpu"></iconify-icon><strong>Arduino Nano</strong><small>Read &amp; respond</small></div><b aria-hidden="true">→</b><div><iconify-icon icon="lucide:database"></iconify-icon><strong>ThingSpeak</strong><small>Live data charts</small></div></div>
  </section>
  <section class="iot-evidence" aria-label="Original report photographs and ThingSpeak dashboards">
    <div class="iot-heading"><span class="ed-label">ACTUAL PROJECT MEDIA</span><h2>What we actually built.</h2><p>Here’s our setup during testing, along with the ThingSpeak charts and indicators we used to check the readings.</p></div>
    <div class="iot-evidence-grid">
      <figure class="iot-evidence-photo iot-evidence-main"><button class="ed-image-open" type="button" data-photo="assets/iot-hardware-workbench.webp" data-alt="Complete IoT sensor prototype connected on a workbench" aria-label="Enlarge actual IoT project hardware photograph"><img src="assets/iot-hardware-workbench.webp" loading="lazy" alt="The team's connected sensors, Arduino and Raspberry Pi on a workbench"></button><figcaption>01 / INTEGRATED HARDWARE</figcaption></figure>
      <figure class="iot-evidence-photo"><button class="ed-image-open" type="button" data-photo="assets/iot-dashboard.webp" data-alt="ThingSpeak sensor charts for ultrasonic, temperature, light and moisture readings" aria-label="Enlarge original ThingSpeak dashboard"><img src="assets/iot-dashboard.webp" loading="lazy" alt="Original ThingSpeak monitoring dashboard with four sensor charts"></button><figcaption>02 / THINGSPEAK DASHBOARD</figcaption></figure>
      <figure class="iot-evidence-photo"><button class="ed-image-open" type="button" data-photo="assets/iot-indicators.webp" data-alt="ThingSpeak indicator widgets including ventilation, moisture and temperature" aria-label="Enlarge original ThingSpeak indicator widgets"><img src="assets/iot-indicators.webp" loading="lazy" alt="Original ThingSpeak color-coded indicators and temperature widgets"></button><figcaption>03 / STATUS INDICATORS</figcaption></figure>
    </div>
  </section>
  <section class="iot-contribution" aria-label="My contribution to the IoT project">
    <div><span class="ed-label">MY CONTRIBUTION</span><h2>The parts I worked on.</h2></div>
    <div class="iot-role-text"><p>I wrote the Arduino code for the <strong>DHT11 and ventilation relay</strong>, as well as the <strong>ultrasonic sensor and MP3 alert</strong>.</p><p>I also brought the group’s code together, worked on the Python upload to ThingSpeak through MobaXterm and helped set up the dashboard. Getting the MP3 player and all four data fields working together took some trial and error.</p></div>
  </section>
  <section class="iot-conclusion" aria-label="Project outcome">
    <span class="ed-label">THE OUTCOME</span><h2>We got the whole setup working together.</h2><p>By the end, we could demonstrate all four features and see the readings on ThingSpeak. It was a school prototype, not something installed in a real home, but I learned a lot about getting sensors, code and cloud services to work together.</p>
    <div class="ed-tags"><span>C / C++</span><span>Arduino</span><span>Raspberry Pi</span><span>Python</span><span>Relay</span><span>NeoPixel</span><span>ThingSpeak</span></div>
  </section>
`,
  'cloud-computing':`
  <section class="cloud-intro" aria-label="The cloud computing challenge">
    <span class="ed-label">THE CHALLENGE</span>
    <div><h2>It had to be more than a website that looked finished.</h2><p>The assignment was to get a nine-product music store running on AWS. I had to connect the servers, database and image storage, plan for more traffic and work within a <strong>$50 budget</strong>.</p></div>
    <div class="cloud-stats"><div><strong>09</strong><span>PRODUCTS</span></div><div><strong>02</strong><span>AVAILABILITY ZONES</span></div><div><strong>$50</strong><span>BUDGET LIMIT</span></div></div>
  </section>
  <section class="cloud-architecture" aria-label="Interactive cloud architecture diagram">
    <div class="cloud-heading"><div><span class="ed-label">ARCHITECTURE</span><h2>How I put it<br>all together.</h2></div><p>Visitors reach the load balancer first. It sends requests to my EC2 servers, which get the product details from MySQL and the images from S3. Hover over each service to explore the setup.</p></div>
    <div class="cloud-topology" role="group" aria-label="AWS application flow from visitors to load balancer, EC2 autoscaling, RDS database and S3 storage, with CloudWatch monitoring">
      <div class="cloud-topology-head"><span><i></i> AWS · US-EAST-1</span><span>VPC · 10.0.0.0/16</span></div>
      <div class="cloud-topology-row cloud-topology-entry"><div class="cloud-node cloud-node--entry" tabindex="0"><iconify-icon icon="lucide:users"></iconify-icon><b>Visitors</b><small>Internet requests</small></div></div>
      <div class="cloud-topology-down" aria-hidden="true">↓</div>
      <div class="cloud-topology-row"><div class="cloud-node cloud-node--balancer" tabindex="0"><iconify-icon icon="lucide:network"></iconify-icon><b>Application Load Balancer</b><small>Distributes HTTP requests</small></div></div>
      <div class="cloud-topology-down" aria-hidden="true">↓</div>
      <div class="cloud-topology-core"><span>WEB APPLICATION / AUTO SCALING GROUP</span><div class="cloud-ec2-pair"><div class="cloud-node" tabindex="0"><iconify-icon icon="lucide:server"></iconify-icon><b>EC2 capacity</b><small>Public subnet / AZ A</small></div><div class="cloud-node" tabindex="0"><iconify-icon icon="lucide:server"></iconify-icon><b>EC2 capacity</b><small>Public subnet / AZ B</small></div></div></div>
      <div class="cloud-topology-down" aria-hidden="true">↓</div>
      <div class="cloud-topology-services"><div class="cloud-node" tabindex="0"><iconify-icon icon="lucide:database"></iconify-icon><b>RDS MySQL</b><small>Product information · Multi-AZ</small></div><div class="cloud-node" tabindex="0"><iconify-icon icon="lucide:images"></iconify-icon><b>Amazon S3</b><small>Product images</small></div></div>
      <div class="cloud-topology-foot"><span><iconify-icon icon="lucide:activity"></iconify-icon> CloudWatch · Monitoring</span><span><iconify-icon icon="lucide:bell-ring"></iconify-icon> SNS · Alerts</span><span><iconify-icon icon="lucide:wallet"></iconify-icon> AWS Budgets</span></div>
    </div>
  </section>
  <section class="cloud-storefront" aria-label="Actual music-store storefront screenshots">
    <div class="cloud-heading"><div><span class="ed-label">THE APPLICATION</span><h2>The website people<br>would actually see.</h2></div><p>I built a simple page to display nine musical instruments. MySQL held their names, prices and descriptions, while their photos came from S3. These are screenshots from the project.</p></div>
    <div class="cloud-storefront-gallery">
      <figure><button class="ed-image-open" type="button" data-photo="assets/cloud-storefront-1.webp" data-alt="Storefront screenshot showing drum, flute and guitar product cards" aria-label="Expand storefront products 1 to 3"><img src="assets/cloud-storefront-1.webp" loading="lazy" alt="Storefront product cards showing drums, flute and guitar"></button><figcaption>01 — DRUM / FLUTE / GUITAR</figcaption></figure>
      <figure><button class="ed-image-open" type="button" data-photo="assets/cloud-storefront-2.webp" data-alt="Storefront screenshot showing guqin, harmonica and harp product cards" aria-label="Expand storefront products 4 to 6"><img src="assets/cloud-storefront-2.webp" loading="lazy" alt="Storefront product cards showing guqin, harmonica and harp"></button><figcaption>02 — GUQIN / HARMONICA / HARP</figcaption></figure>
      <figure><button class="ed-image-open" type="button" data-photo="assets/cloud-storefront-3.webp" data-alt="Storefront screenshot showing piano, trumpet and violin product cards" aria-label="Expand storefront products 7 to 9"><img src="assets/cloud-storefront-3.webp" loading="lazy" alt="Storefront product cards showing piano, trumpet and violin"></button><figcaption>03 — PIANO / TRUMPET / VIOLIN</figcaption></figure>
    </div>
  </section>
  <section class="cloud-operations" aria-label="Performance and monitoring decisions">
    <div class="cloud-operations-title"><span class="ed-label">RELIABILITY &amp; OPERATIONS</span><h2>I also had to think<br>about what could go wrong.</h2></div>
    <div class="cloud-operations-cards">
      <article><span>01 / SCALABILITY</span><iconify-icon icon="lucide:layers"></iconify-icon><h3>More people visiting?</h3><p>Auto Scaling can add or remove EC2 instances behind the load balancer as demand changes.</p></article>
      <article><span>02 / RESILIENCE</span><iconify-icon icon="lucide:database-zap"></iconify-icon><h3>What if the database fails?</h3><p>I set up Multi-AZ RDS, with a standby database in another availability zone.</p></article>
      <article><span>03 / VISIBILITY</span><iconify-icon icon="lucide:chart-no-axes-combined"></iconify-icon><h3>How would I spot a problem?</h3><p>I used CloudWatch to watch resource usage and SNS to send an email if an instance failed its health check.</p></article>
      <article><span>04 / COSTS</span><iconify-icon icon="lucide:wallet"></iconify-icon><h3>How much would it cost?</h3><p>I set a $50 budget with an alert at 80%, then compared two EC2 sizes. The smaller t3.micro was enough for this project.</p></article>
    </div>
    <figure class="cloud-monitor-image"><button class="ed-image-open" type="button" data-photo="assets/cloud-monitoring.webp" data-alt="Original CloudWatch graphs showing EC2 and RDS CPU utilization and network traffic" aria-label="Open CloudWatch monitoring dashboard"><img src="assets/cloud-monitoring.webp" loading="lazy" alt="CloudWatch dashboard showing EC2 and database CPU usage and network traffic"></button><figcaption>CLOUDWATCH DASHBOARD FROM MY PROJECT</figcaption></figure>
  </section>
  <section class="cloud-finale" aria-label="My contribution and project outcome">
    <div class="cloud-finale-main"><span class="ed-label">MY CONTRIBUTION</span><h2>I put the AWS setup together from end to end.</h2><p>I set up the VPC, web servers, load balancer, Auto Scaling, MySQL database and S3 storage. I also tested two EC2 sizes with ApacheBench, set up CloudWatch and budget alerts, and wrote a Python boto3 script to check the Auto Scaling Group’s health.</p></div>
    <div class="cloud-finale-result"><span class="ed-label">THE OUTCOME</span><h3>The store worked, and so did the services behind it.</h3><p>In the end, I had a nine-product catalogue running on AWS, with the database and images stored separately. This was a school project, not a real online shop, but it helped me understand how the different cloud services depend on each other.</p><div class="ed-tags"><span>Amazon EC2</span><span>ALB</span><span>Auto Scaling</span><span>RDS MySQL</span><span>S3</span><span>CloudWatch</span><span>SNS</span><span>Python · boto3</span></div></div>
  </section>
`
};
function initCaseInteractives(){
  const lightbox=detail.querySelector('#case-lightbox');
  if(!lightbox)return;
  // External Wix drawings remain original. If unavailable offline, show a local
  // concept-art preview and keep the link to the real sketches on Wix.
  detail.querySelectorAll('.tri-original-sketch-sheet img,.tri-process-drawings img').forEach(img=>{
    img.addEventListener('error',()=>{
      img.src='assets/tri-wheelchair-concept.jpg';
      img.alt='Original TRI-STAR digital concept-art preview. Open the link to see the hand-drawn sketches on Wix.';
      img.classList.add('tri-drawing-fallback');
    },{once:true});
  });
  const wheelToggle=detail.querySelector('[data-tri-toggle]');
  if(wheelToggle){wheelToggle.addEventListener('click',()=>{const stage=detail.querySelector('.tri-mechanism');const paused=stage.classList.toggle('tri-is-paused');wheelToggle.setAttribute('aria-pressed',String(!paused));wheelToggle.setAttribute('aria-label',paused?'Play wheel animation':'Pause wheel animation');wheelToggle.querySelector('span').textContent=paused?'Play animation':'Pause animation';wheelToggle.querySelector('iconify-icon')?.setAttribute('icon',paused?'lucide:play':'lucide:pause');});}
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
  const targets=[...root.querySelectorAll('.nesso-fact-strip,.nesso-pair>article,.nesso-section-heading,.nesso-clean-flow,.nesso-results-gallery>figure,.nesso-role-file,.nesso-role-copy p,.nesso-outcome-photo,.nesso-outcome-copy,.tri-reveal,.tri-process-card,.tri-demo-card,.tri-role-main,.tri-role-circuit,.ed-eng-pair>article,.ed-eng-mechanism,.ed-eng-contribution,.ed-eng-close>div,.ed-iot-intro>div,.ed-iot-gallery figure,.ed-iot-contribution,.ed-iot-ending>div,.iot-home-intro,.iot-feature-tile,.iot-connection,.iot-evidence-photo,.iot-contribution,.iot-conclusion,.cloud-intro,.cloud-architecture,.cloud-storefront-gallery figure,.cloud-operations-cards article,.cloud-finale')];
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
  'data-engineering':'Data Engineering Project',
  'engineering-exploration':'Engineering Exploration Project',
  'iot-sustainable-living':'IoT System for Sustainable Household Living',
  'cloud-computing':'Cloud Computing Development Project'
 }[p.slug];
 const subtitle={
  'data-engineering':'A wearable sensor system that identifies possible falls, slips and near-misses on construction sites.',
  'engineering-exploration':'TRI-STAR: a motorised wheel concept designed to help wheelchair users overcome curbs.',
  'iot-sustainable-living':'For this school project, we built a small smart-home setup to manage temperature, lights, plant care and doorstep alerts.',
  'cloud-computing':'I built a music-store website on AWS and connected the servers, database and storage behind it.'
 }[p.slug];
 const category={
  'data-engineering':'DATA ENGINEERING',
  'engineering-exploration':'ENGINEERING EXPLORATION',
  'iot-sustainable-living':'INTERNET OF THINGS',
  'cloud-computing':'CLOUD COMPUTING'
 }[p.slug];
 const imageAlt={
  'data-engineering':'Original Data Engineering sensor project photo',
  'engineering-exploration':'Original wheelchair tri-star wheel design sketch',
  'iot-sustainable-living':'Original IoT system hardware and sensors on a workbench',
  'cloud-computing':'Music-store product catalogue from the AWS cloud computing project'
 }[p.slug];
 return `<div class="frame detail-shell case-shell editorial-case editorial-case--${p.slug}">
    <header class="ed-project-hero ed-project-hero--split" aria-labelledby="case-page-heading">
      <div class="ed-new-hero-copy">
        <span class="ed-new-hero-label">${category}</span>
        <h1 id="case-page-heading" data-text="${headline}">${headline}</h1>
        <p>${subtitle}</p>
      </div>
      <figure class="ed-new-hero-visual ed-media-card">
        <button class="ed-image-open ed-new-hero-open" type="button" data-photo="${p.image}" data-alt="${imageAlt}" aria-label="Expand the original ${p.name} image">
          <img src="${p.image}" alt="${imageAlt}" data-detail-cover loading="eager" fetchpriority="high">
        </button>
      </figure>
    </header>
    ${caseStudyContent[p.slug]||''}
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
else{const name=sectionNames.includes(hash)?hash:'home';if(isDetail){const current=projectData.find(p=>detail.querySelector('[data-detail-cover]')?.getAttribute('src')===p.image);oldCover=detail.querySelector('[data-detail-cover]');if(oldCover)oldCover.style.viewTransitionName='project-cover';const render=()=>{main.hidden=false;detail.hidden=true;isDetail=false;if(projectRevealObserver){projectRevealObserver.disconnect();projectRevealObserver=null;}showHomeRail();scrollSection(name,true);if(name==='projects'&&current){const c=document.querySelector('[data-cover="'+current.slug+'"]');if(c)c.style.viewTransitionName='project-cover';}};if(!motion.matches&&document.startViewTransition){const t=document.startViewTransition(render);try{await t.finished;}catch{}}else render();document.querySelectorAll('[data-cover]').forEach(e=>e.style.removeProperty('view-transition-name'));if(oldCover)oldCover.style.viewTransitionName='';}
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
  {href:'#project-data-engineering',image:'assets/project-data.jpg',title:'Data Engineering Project',summary:'Wearable sensors · Worker safety'},
  {href:'#project-engineering-exploration',image:'assets/project-engineering.jpg',title:'Engineering Exploration Project',summary:'Tri-star wheels · Easier curb climbing'},
  {href:'#project-iot-sustainable-living',image:'assets/iot-hardware-workbench.webp',title:'IoT System for Sustainable Household Living',summary:'Connected sensors · Smarter home'},
  {href:'#project-cloud-computing',image:'assets/cloud-storefront-1.webp',title:'Cloud Computing Development Project',summary:'AWS cloud · Online music store'}
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
const roles=['AI & Data|Engineering Student','Internet of Things|Enthusiast','Background in|Electronics'];let roleIndex=0;const role=document.getElementById('rotating-role');function putRole(text){role.replaceChildren();text.split('|').forEach((line,n)=>{if(n)role.append(document.createElement('br'));line.split(' ').forEach((word,j)=>{if(j)role.append(document.createTextNode(' '));const group=document.createElement('span');group.className='role-word';for(const char of word){const span=document.createElement('span');span.className='role-character';span.textContent=char;group.append(span);}role.append(group);});});}putRole(roles[0]);setInterval(async()=>{if(motion.matches||document.hidden||isDetail||activeSection!=='home')return;const chars=[...role.querySelectorAll('.role-character')];await Promise.all(chars.map((c,i)=>c.animate([{opacity:1,transform:'translateY(0)',filter:'blur(0)'},{opacity:0,transform:'translateY(-10px)',filter:'blur(4px)'}],{duration:220,delay:i*3,fill:'forwards'}).finished));roleIndex=(roleIndex+1)%roles.length;putRole(roles[roleIndex]);role.querySelectorAll('.role-character').forEach((c,i)=>c.animate([{opacity:0,transform:'translateY(14px)',filter:'blur(5px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:550,delay:i*12,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'}));},5200);



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
    const avatar=document.createElement('span');avatar.className='chat-message-avatar';avatar.setAttribute('aria-hidden','true');const avatarImg=document.createElement('img');avatarImg.src='assets/chat-smiley.png';avatarImg.alt='';avatar.append(avatarImg);row.append(avatar);
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
  if(/\b(hi|hey|hello|sup|yo|good morning|good evening)\b/.test(q)&&q.split(/\s+/).length<5)return {message:'Hey! I’m Karthik — well, my little prewritten portfolio assistant. Want to see my projects, skills, internship or achievements?'};
  if(/\b(thanks|thank you|tysm|thx)\b/.test(q))return {message:'You’re welcome! Want to explore another part of my portfolio?'};
  if(/\b(contact|email|reach|message|linkedin|hire|connect|collab|talk to|social)\b/.test(q))return {message:`You can contact me at ${portfolioMail}, or connect with me on LinkedIn.`,link:{label:'Contact me',href:'#contact'}};
  if(/\b(resume|cv|curriculum vitae|download pdf|download (it|file))\b/.test(q))return {message:'You can view or download my resume. It includes my education, achievements, technical skills and internship experience.',link:{label:'Open my resume (PDF)',href:'assets/karthik-resume.pdf'}};
  if(/\b(intern|internship|iwow|work experience|worked at|job|600|300|1200|lora|modbus|meter|esso)\b/.test(q))return {message:'I interned at iWOW Connections from April to August 2024. I configured 4G modems, IoT sensors and Modbus RTU devices, helped monitor meters over LoRa networks, and supported signal testing and documentation.',link:{label:'See my experience',href:'#about'}};
  if(/\b(awards?|prizes?|merit|director.s list|achievements?|honou?rs?|sinda|recognition|aeis)\b/.test(q))return {message:'My achievements include the Director’s List at NYP, two Director’s List awards at ITE, the ITE Certificate of Merit, the SINDA Excellence Awards 2025 and the AEIS Book Prize from ITE.',link:{label:'My achievements',href:'#about'}};
  if(/\b(tri[- ]?star|wheelchair|curb|engineering exploration|mobility|wheel attachment)\b/.test(q))return {message:'For my Engineering Exploration Project, my team explored a motorised tri-star wheel attachment to help wheelchair users overcome curbs. I worked on the switch, Arduino Uno and DC motor circuit, and took part in brainstorming and testing. We tested the concept with a small-scale prototype.',link:{label:'My engineering project',href:'#project-engineering-exploration'}};
  if(/\b(construction|fall detection|fall|slip|near[- ]?miss|safety|wearable|vest|data engineering project)\b/.test(q))return {message:'For my Data Engineering Project, my team built a wearable-sensor prototype to collect movement data and highlight potential slips, falls and near-misses. I developed the Main.py launcher that starts our Python data collection and processing scripts.',link:{label:'My data project',href:'#project-data-engineering'}};
  if(/\b(aws|cloud computing|ec2|s3 bucket|auto scaling|load balancer|rds|boto3)\b/.test(q))return {message:'In my Cloud Computing Development Project, I built an AWS-hosted music-store catalogue using EC2, an Application Load Balancer, Auto Scaling, RDS MySQL and S3. I also configured monitoring, budget alerts and Python health checks.',link:{label:'My Cloud project',href:'#project-cloud-computing'}};
  if(/\b(sustainable|smart home|plant care|thing speak|thingspeak|zigbee|home automation|energy saving)\b/.test(q))return {message:'I built the DHT11 ventilation and ultrasonic alert logic, helped integrate the Arduino code, and sent readings to ThingSpeak using Python. Our school prototype also included lighting and soil-moisture monitoring.',link:{label:'My IoT project',href:'#project-iot-sustainable-living'}};
  if(/\b(projects?|portfolio|built|build|work on|made|case stud)\b/.test(q))return {message:'I’m featuring four projects: NESSO construction-safety monitoring, the TRI-STAR wheelchair concept, a connected IoT household prototype, and an AWS-hosted music-store application. Each has its own project page.',link:{label:'Explore my projects',href:'#projects'}};
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


// Direct AJAX form delivery for the static portfolio. FormSubmit requires a one-time
// activation email to the owner's inbox before it starts forwarding submissions.
const portfolioContactForm=document.getElementById('portfolio-contact-form');
const contactFormStatus=document.getElementById('contact-form-status');
let contactSending=false;
portfolioContactForm?.addEventListener('submit',async event=>{
  event.preventDefault();
  if(contactSending || !portfolioContactForm.reportValidity()) return;
  const values=new FormData(portfolioContactForm);
  const name=String(values.get('name')||'').trim();
  const sender=String(values.get('email')||'').trim();
  const subject=String(values.get('subject')||'').trim();
  const message=String(values.get('message')||'').trim();
  if(!name||!sender||!subject||!message)return;
  const shell=portfolioContactForm.closest('.contact-form-shell');
  const button=portfolioContactForm.querySelector('.contact-submit');
  const buttonContents=button.innerHTML;
  const payload={name,email:sender,subject,message,_replyto:sender,
    _subject:'Portfolio contact: '+subject,_template:'table',_captcha:'false',
    _honey:String(values.get('_honey')||'')};
  contactSending=true;
  button.disabled=true;
  button.textContent='Sending…';
  contactFormStatus.classList.remove('is-error','is-success');
  contactFormStatus.textContent='Sending your message securely…';
  shell?.classList.remove('is-launching');
  try {
    const response=await fetch(portfolioContactForm.action,{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(payload),
    });
    const result=await response.json();
    // The service may return HTTP 200 with success: "false": do not coerce strings.
    if(!response.ok || !(result?.success===true || result?.success==='true')) {
      const details=typeof result?.message==='string' ? result.message : '';
      if(/activat|confirm|verif/i.test(details)) {
        throw new Error('The contact form is awaiting one-time email verification. Please try again once it has been activated.');
      }
      throw new Error('The message could not be submitted. Please try again shortly.');
    }
    portfolioContactForm.reset();
    contactFormStatus.classList.add('is-success');
    contactFormStatus.textContent='Message submitted! Thank you for reaching out.';
    // Only launch after the sending service confirms the submission was accepted.
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      void shell?.offsetWidth;
      shell?.classList.add('is-launching');
      window.setTimeout(()=>shell?.classList.remove('is-launching'),2350);
    }
  } catch(error) {
    contactFormStatus.classList.add('is-error');
    contactFormStatus.textContent=(error instanceof Error)?error.message:'Network error. Please check your connection and try again.';
  } finally {
    contactSending=false;
    button.disabled=false;
    button.innerHTML=buttonContents;
  }
});

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

const canvas=document.getElementById('particles'),ctx=canvas.getContext('2d');let width=0,height=0,stars=[],last=0;let pointer={x:0,y:0};function resize(){const rect=canvas.parentElement.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);stars=Array.from({length:width<760?40:85},()=>({x:Math.random()*width,y:Math.random()*height,r:.5+Math.random()*1.6,v:.08+Math.random()*.18,a:.15+Math.random()*.55}));}new ResizeObserver(resize).observe(canvas.parentElement);resize();document.getElementById('home').addEventListener('pointermove',event=>{pointer.x=(event.clientX/innerWidth-.5)*8;pointer.y=(event.clientY/innerHeight-.5)*8;});function draw(time){if(!motion.matches&&!document.hidden&&!isDetail&&activeSection==='home'&&time-last>28){last=time;ctx.clearRect(0,0,width,height);const rgb=root.dataset.theme==='dark'?'235,235,235':'30,30,30';stars.forEach(s=>{s.y+=s.v;if(s.y>height)s.y=0;ctx.beginPath();ctx.fillStyle=`rgba(${rgb},${s.a})`;ctx.arc(s.x+pointer.x*s.r,s.y+pointer.y*s.r,s.r,0,Math.PI*2);ctx.fill();});}requestAnimationFrame(draw);}requestAnimationFrame(draw);
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
