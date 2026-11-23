
;
/* START scripts/home/home.js */

(() => {
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;

const projectData=[
  {slug:'outpost-07',category:'07 / NASA Space Apps · Hackathon',name:'Outpost 07',summary:'NASA Space Apps 2026 team submission · Galactic Problem Solver recognition.'},
  {slug:'machine-learning',category:'06 / Machine learning',name:'Parkinson’s Disease Prediction',summary:'94.87% AdaBoost test accuracy on 39 held-out recordings · individual ML project.'},
  {slug:'data-engineering',category:'03 / Data engineering',name:'NESSO Safety Monitoring System',summary:'Four-device BLE field test · I built the coordinated Python pipeline launcher.'},
  {slug:'engineering-exploration',category:'01 / Engineering exploration',name:'Tri-Star Wheel Prototype',summary:'Our small-scale tri-star wheel prototype, with an Arduino-controlled motor circuit.'},
  {slug:'iot-sustainable-living',category:'02 / Internet of Things',name:'IoT System for Sustainable Household Living',summary:'An Arduino and Raspberry Pi prototype for household automation.'},
  {slug:'cloud-computing',category:'04 / Cloud Computing',name:'AWS Music Store Web Application',summary:'A nine-instrument catalogue on AWS, with MySQL product data and S3 images.'},
  {slug:'road-safety',category:'05 / Data & analytics',name:'Road Safety & Infrastructure Analysis',summary:'My Power BI analysis of Singapore road infrastructure, accidents, injuries and deaths.'}
];
// Project titles and previews share the same projected position as their globe nodes.
const globe = document.getElementById('project-sphere');
const globeCanvas = document.getElementById('project-sphere-canvas');
const projectSpace = document.getElementById('project-space-field');
const projectSpaceContext = projectSpace.getContext('2d');
const pinLayer = document.getElementById('project-sphere-pins');
const globeStatus = document.getElementById('project-globe-status');
const globeContext = globeCanvas.getContext('2d');
const globeProjects = {
  'outpost-07': [-37, 142, 'https://raw.githubusercontent.com/bigbobopenguin-abc/andrea-portfolio/main/static/images/outpost-07/outpost.jpg'],
  'machine-learning': [19, -55, 'assets/ml-model-comparison-display.webp'],
  'engineering-exploration': [52, -8, 'assets/project-engineering-display.webp'],
  'iot-sustainable-living': [19, 54, 'assets/iot-hardware-workbench-display.webp'],
  'road-safety': [-30, 55, 'assets/road-safety-cover-display.webp'],
  'data-engineering': [-29, -50, 'assets/project-data-fast.webp'],
  'cloud-computing': [18, 148, 'assets/cloud-storefront-1-display.webp']
};
const fullTurn = 2 * Math.PI;
const radians = degrees => degrees * Math.PI / 180;
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
const surfacePoint = (latitude, longitude) => ({
  x: Math.cos(latitude) * Math.sin(longitude),
  y: -Math.sin(latitude),
  z: Math.cos(latitude) * Math.cos(longitude)
});
const globeCameraDistance = 4.8;
const globeHorizon = 1 / globeCameraDistance;
const globeTopics = [
  ['NASA DONKI', -55, 125, ['outpost-07'], 1],
  ['Roblox Studio', -15, 115, ['outpost-07'], -1],
  ['Tri-star wheels', 65, 32, ['engineering-exploration'], -1],
  ['Arduino', 43, -61, ['engineering-exploration', 'iot-sustainable-living'], -1],
  ['Raspberry Pi', 44, 61, ['iot-sustainable-living'], -1],
  ['ThingSpeak', -5, 66, ['iot-sustainable-living'], 1],
  ['Python', -6, -69, ['machine-learning', 'data-engineering'], 1],
  ['AdaBoost', 19, -23, ['machine-learning'], 1],
  ['Decision trees', 10, 7, ['machine-learning'], 1],
  ['Bluetooth LE', -13, -15, ['data-engineering'], 1],
  ['Wearable motion data', -47, -65, ['data-engineering'], -1],
  ['MySQL', -41, 175, ['data-engineering', 'cloud-computing'], 1],
  ['Power BI', -20, 24, ['data-engineering', 'road-safety'], 1],
  ['Singapore traffic trends', -54, 36, ['road-safety'], 1],
  ['Amazon EC2', 20, 110, ['cloud-computing'], -1],
  ['Amazon S3', -15, 157, ['cloud-computing'], 1],
  ['CloudWatch', 55, 139, ['cloud-computing'], -1]
].map(([label, lat, lon, links, direction]) => ({
  label, point: surfacePoint(radians(lat), radians(lon)), links, direction
}));
const stars = Array.from({length: 220}, (_, i) => ({
  x: (i * .618033989 + .13) % 1,
  y: (i * .754877666 + .39) % 1,
  radius: i % 17 === 0 ? 1.35 : .45 + (i % 4) * .17,
  opacity: .12 + (i % 5) * .063
}));
let globeWidth = 0;
let globeHeight = 0;
let globeView;
let globeOrientation = {x: 0, y: 0, z: 0, w: 1};
let globeFrame = 0;
let globeLastFrame = 0;
let globeElapsed = 0;
let globeVisible = false;
let globeAutoSpin = !motion.matches;
let globeSpinAfter = 0;
let globeCardHovered = false;
let globeDrag = null;
let globeGlide = null;
let globeTurn = null;
const globeSteer = {x: 0, y: 0, targetX: 0, targetY: 0};

function multiplyGlobeRotations(a, b) {
  return {
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z
  };
}

function globeAxisRotation(axis, angle) {
  const scale = Math.sin(angle / 2);
  return {x: axis.x * scale, y: axis.y * scale, z: axis.z * scale, w: Math.cos(angle / 2)};
}

function globeRotationAxis(from, to) {
  let x = from.y * to.z - from.z * to.y;
  let y = from.z * to.x - from.x * to.z;
  let z = from.x * to.y - from.y * to.x;
  const dot = clamp(from.x * to.x + from.y * to.y + from.z * to.z, -1, 1);
  let length = Math.hypot(x, y, z);
  // Select a perpendicular axis if the two points face exactly opposite directions.
  if (length < 1e-7) {
    [x, y, z] = Math.abs(from.x) < .9 ? [0, from.z, -from.y] : [-from.z, 0, from.x];
    length = Math.hypot(x, y, z);
  }
  return {axis: {x: x / length, y: y / length, z: z / length}, angle: Math.acos(dot)};
}

function rotateGlobePoint({x, y, z}, q) {
  const dx = 2 * (q.y * z - q.z * y);
  const dy = 2 * (q.z * x - q.x * z);
  const dz = 2 * (q.x * y - q.y * x);
  return {
    x: x + q.w * dx + q.y * dz - q.z * dy,
    y: y + q.w * dy + q.z * dx - q.x * dz,
    z: z + q.w * dz + q.x * dy - q.y * dx
  };
}

const globeHorizontalAxis = {x: 0, y: 1, z: 0};
const globeVerticalAxis = {x: 1, y: 0, z: 0};
const globeFront = {x: 0, y: 0, z: 1};

function globeDisplayOrientation() {
  const tilt = globeAxisRotation(globeVerticalAxis, globeSteer.x);
  const pan = globeAxisRotation(globeHorizontalAxis, globeSteer.y);
  return multiplyGlobeRotations(tilt, multiplyGlobeRotations(pan, globeOrientation));
}

function resetGlobeSteering() {
  globeOrientation = globeDisplayOrientation();
  Object.assign(globeSteer, {x: 0, y: 0, targetX: 0, targetY: 0});
}

const globeMarkers = Object.entries(globeProjects).map(([slug, [latitude, longitude, image]], index) => {
  const project = projectData.find(item => item.slug === slug);
  const lat = radians(latitude), lon = radians(longitude);
  const marker = document.createElement('div');
  marker.className = 'project-sphere-marker';
  marker.id = 'globe-' + project.slug;

  const title = document.createElement('h3');
  const select = document.createElement('a');
  select.className = 'project-sphere-title';
  select.id = marker.id + '-title';
  select.href = project.slug + '.html';
  select.textContent = project.category.split(' / ')[0] + ' · ' + project.name;
  select.setAttribute('aria-label', 'Open ' + project.name + ' project');
  title.append(select);

  const preview = document.createElement('a');
  preview.className = 'project-sphere-preview project-sphere-direct';
  preview.href = project.slug + '.html';
  preview.setAttribute('aria-label', 'Open ' + project.name + ' project');
  const photo = document.createElement('img');
  photo.loading = 'lazy';
  photo.fetchPriority = 'low';
  photo.src = image;
  photo.alt = ''; 
  photo.decoding = 'async';
  const caption = document.createElement('span');
  caption.className = 'project-sphere-action';
  caption.id = marker.id + '-action';
  caption.textContent = 'View project';
  const arrow = document.createElement('iconify-icon');
  arrow.setAttribute('icon', 'lucide:arrow-up-right');
  arrow.setAttribute('aria-hidden', 'true');
  preview.append(photo, caption, arrow);
  marker.append(title, preview);
  pinLayer.append(marker);

  return {slug, project, marker, select, point: surfacePoint(lat, lon), width: 0, height: 0};
});

const globePoints = new Map(globeMarkers.map(({slug, point}) => [slug, point]));
const globeRoute = ['data-engineering', 'machine-learning', 'engineering-exploration', 'iot-sustainable-living', 'road-safety', 'cloud-computing'];
const globeConnections = [
  ...globeRoute.slice(1).map((slug, index) => [globePoints.get(globeRoute[index]), globePoints.get(slug)]),
  ...globeTopics.flatMap(topic => topic.links.map(slug => [topic.point, globePoints.get(slug)]))
].map(([from, to]) => {
  const dx = to.x - from.x, dy = to.y - from.y, dz = to.z - from.z;
  return Array.from({length: 33}, (_, i) => {
    const t = i / 32;
    const x = from.x + dx * t, y = from.y + dy * t, z = from.z + dz * t;
    const length = Math.hypot(x, y, z);
    return {x: x / length, y: y / length, z: z / length};
  });
});

function overlapsGlobeBox(a, b, gap = 0) {
  return a.x < b.x + b.width + gap && a.x + a.width + gap > b.x &&
    a.y < b.y + b.height + gap && a.y + a.height + gap > b.y;
}

function positionGlobeMarker(item, placed, compact) {
  const {position, width, height} = item;
  const inset = 8, gap = 8;
  const right = globeWidth - inset - width;
  const bottom = globeHeight - inset - height;
  if (right < inset || bottom < inset) return null;

  const startX = position.x - width / 2;
  const startY = position.y + 12;
  const xs = compact ? [inset, right] : [startX, inset, right];
  const ys = [startY, inset, bottom];
  for (const box of placed) {
    if (!compact) xs.push(box.x - width - gap, box.x + box.width + gap);
    ys.push(box.y - height - gap, box.y + box.height + gap);
  }

  let best = null;
  let bestDistance = Infinity;
  for (const x of xs) {
    for (const y of ys) {
      const candidate = {x: clamp(x, inset, right), y: clamp(y, inset, bottom), width, height};
      const distance = (candidate.x - startX) ** 2 + 1.65 * (candidate.y - startY) ** 2;
      if (distance >= bestDistance || placed.some(box => overlapsGlobeBox(candidate, box, gap))) continue;
      best = candidate;
      bestDistance = distance;
    }
  }
  return best;
}

function drawProjectSpace() {
  const width = projectSpace.clientWidth, height = projectSpace.clientHeight;
  if (!projectSpaceContext || !width || !height) return;
  const scale = window.portfolioPerf.ratio(2);
  projectSpace.width = Math.round(width * scale);
  projectSpace.height = Math.round(height * scale);
  projectSpaceContext.setTransform(scale, 0, 0, scale, 0, 0);
  const ink = root.dataset.theme === 'dark' ? '225, 226, 255' : '78, 68, 132';
  for (const star of stars) {
    projectSpaceContext.beginPath();
    projectSpaceContext.arc(star.x * width, star.y * height, star.radius, 0, fullTurn);
    projectSpaceContext.fillStyle = 'rgba(' + ink + ', ' + star.opacity + ')';
    projectSpaceContext.fill();
  }
}

new ResizeObserver(drawProjectSpace).observe(projectSpace);
new MutationObserver(() => {
  drawProjectSpace();
  drawGlobe();
}).observe(root, {attributes: true, attributeFilter: ['data-theme']});

function drawGlobe() {
  if (!globeContext || !globeView) return;
  const ctx = globeContext;
  const {centerX, centerY, radius} = globeView;
  const focalLength = radius * Math.sqrt(globeCameraDistance ** 2 - 1);
  const orientation = globeDisplayOrientation();
  const dark = root.dataset.theme === 'dark';
  const ink = dark ? '225, 226, 255' : '65, 54, 138';

  function project(point) {
    const {x, y, z} = rotateGlobePoint(point, orientation);
    const scale = focalLength / (globeCameraDistance - z);
    return {x: centerX + x * scale, y: centerY + y * scale, z};
  }

  ctx.clearRect(0, 0, globeWidth, globeHeight);
  ctx.lineWidth = dark ? 1 : 1.3;

  function strokeCurves(curves, front, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (const curve of curves) {
      for (let i = 1; i < curve.length; i++) {
        const a = curve[i - 1], b = curve[i];
        if (front !== ((a.z + b.z) / 2 >= globeHorizon)) continue;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
    }
    ctx.stroke();
  }

  const connections = globeConnections.map(curve => curve.map(project));
  strokeCurves(connections, false, `rgba(${ink}, .21)`);
  strokeCurves(connections, true, `rgba(${ink}, .58)`);

  // The lead pulse crosses project nodes; five quieter pulses travel separate links.
  const distance = ((globeElapsed + 4300) / 14500) % 2;
  const routePosition = (1 - Math.abs(1 - distance)) * (globeRoute.length - 1);
  const leg = Math.min(Math.floor(routePosition), globeRoute.length - 2);
  function drawPulse(curve, fraction, index) {
    const travel = fraction * (curve.length - 1);
    const segment = Math.min(Math.floor(travel), curve.length - 2);
    const a = curve[segment], b = curve[segment + 1], t = travel - segment;
    const depth = a.z + (b.z - a.z) * t;
    const violet = index % 2 === 0;
    ctx.globalAlpha = .34 + .66 * clamp((depth + .35) / 1.2, 0, 1);
    ctx.fillStyle = violet ? (dark ? '#cfb5ff' : '#703fc8') : (dark ? '#a0e4ff' : '#3869c9');
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = index === 0 ? 11 : 6;
    ctx.beginPath();
    ctx.arc(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, index === 0 ? 3.4 : 2.75, 0, fullTurn);
    ctx.fill();
  }
  ctx.save();
  drawPulse(connections[leg], routePosition - leg, 0);
  for (let i = 0; i < 5; i++) {
    const phase = (globeElapsed / (4900 + 640 * i) + (i + 1) * .29) % 2;
    drawPulse(connections[5 + i * 3], 1 - Math.abs(1 - phase), i + 1);
  }
  ctx.restore();

  const projected = globeMarkers.map(marker => ({...marker, position: project(marker.point)}));
  const placed = [];
  const active = document.activeElement;
  const compact = globeWidth < 440;
  // Stack narrow-screen previews from top to bottom along the sides of the sphere.
  projected.sort((a, b) => Number(b.marker.contains(active)) - Number(a.marker.contains(active)) ||
    (compact ? a.position.y - b.position.y : b.position.z - a.position.z));
  for (const item of projected) {
    const {marker, position} = item;
    const box = position.z >= globeHorizon ? positionGlobeMarker(item, placed, compact) : null;
    if (!box && marker.contains(active)) globe.focus({preventScroll: true});
    marker.toggleAttribute('data-visible', Boolean(box));
    if (box) {
      placed.push(box);
      marker.style.transform = 'translate(' + box.x + 'px, ' + box.y + 'px)';
      const labelX = box.x + box.width / 2;
      const labelY = box.y;
      ctx.beginPath();
      ctx.moveTo(position.x, position.y);
      ctx.lineTo(labelX, labelY);
      ctx.strokeStyle = `rgba(${ink}, .34)`;
      ctx.stroke();
    }
    ctx.beginPath();
    const front = position.z >= globeHorizon;
    const nodeRadius = front ? 3.6 + position.z * 2.3 : 2.6;
    ctx.arc(position.x, position.y, nodeRadius + 3, 0, fullTurn);
    const selected = marker.classList.contains('is-selected');
    ctx.fillStyle = front && selected ? 'rgba(158, 112, 255, .40)' : `rgba(${ink}, ${front ? .14 : .05})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(position.x, position.y, nodeRadius, 0, fullTurn);
    ctx.fillStyle = `rgba(${ink}, ${front ? .58 + .38 * position.z : .28})`;
    ctx.fill();
  }

  const topicFont = globeWidth < 480 ? 11 : 14;
  ctx.font = topicFont + 'px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const topic of globeTopics) {
    const {x, y, z} = project(topic.point);
    ctx.beginPath();
    const front = z >= globeHorizon;
    ctx.arc(x, y, front ? 2 + z * 1.6 : 1.45, 0, fullTurn);
    ctx.fillStyle = `rgba(${ink}, ${front ? .76 : .28})`;
    ctx.fill();
    if (!front) continue;
    const labelWidth = ctx.measureText(topic.label).width;
    const labelX = clamp(x, labelWidth / 2 + 6, globeWidth - labelWidth / 2 - 6);
    for (const direction of [topic.direction, -topic.direction]) {
      const labelY = y + direction * (topicFont + 4);
      const label = {x: labelX - labelWidth / 2, y: labelY - topicFont / 2, width: labelWidth, height: topicFont};
      if (label.y < 4 || label.y + label.height > globeHeight - 4 || placed.some(box => overlapsGlobeBox(label, box, 5))) continue;
      ctx.fillStyle = dark ? '#b8bdd7' : '#524a71';
      ctx.fillText(topic.label, labelX, labelY);
      placed.push(label);
      break;
    }
  }
}

function scheduleGlobeFrame() {
  if (!globeFrame && globeVisible && !document.hidden) globeFrame = requestAnimationFrame(animateGlobe);
}

function animateGlobe(now) {
  globeFrame = 0;
  const minimum = window.portfolioPerf.interval(0, 32, 48);
  if (globeLastFrame && now - globeLastFrame < minimum) { scheduleGlobeFrame(); return; }
  const dt = globeLastFrame ? clamp(now - globeLastFrame, 0, 80) : 0;
  globeLastFrame = now;
  const canSpin = globeAutoSpin && !globeDrag;
  let redraw = false;

  if (globeTurn) {
    const {from, axis, angle, started} = globeTurn;
    const progress = clamp((now - started) / 560, 0, 1);
    globeOrientation = multiplyGlobeRotations(globeAxisRotation(axis, angle * (1 - (1 - progress) ** 3)), from);
    if (progress === 1) globeTurn = null;
    redraw = true;
  } else if (!globeDrag && globeGlide) {
    globeOrientation = multiplyGlobeRotations(globeAxisRotation(globeGlide.axis, globeGlide.speed * dt), globeOrientation);
    globeGlide.speed *= Math.exp(-dt / 290);
    if (globeGlide.speed < .00014) globeGlide = null;
    redraw = true;
  } else if (canSpin && now >= globeSpinAfter) {
    globeOrientation = multiplyGlobeRotations(globeAxisRotation(globeHorizontalAxis, dt * .00016), globeOrientation);
    redraw = true;
  }

  const steerDistance = Math.hypot(globeSteer.targetX - globeSteer.x, globeSteer.targetY - globeSteer.y);
  if (steerDistance > .0002) {
    const blend = 1 - Math.exp(-dt / 120);
    globeSteer.x += (globeSteer.targetX - globeSteer.x) * blend;
    globeSteer.y += (globeSteer.targetY - globeSteer.y) * blend;
    redraw = true;
  }
  if (redraw) {
    if (!motion.matches) globeElapsed += dt;
    const paintStart = performance.now();
    drawGlobe();
    window.portfolioPerf.paintCost(performance.now() - paintStart);
  }
  if (canSpin || globeGlide || globeTurn || steerDistance > .0002) scheduleGlobeFrame();
  else globeLastFrame = 0;
}

if (globeContext) {
  globe.dataset.ready = 'true';
  globe.tabIndex = 0;

  function toggleGlobeSpin() {
    globeAutoSpin = !globeAutoSpin;
    globeGlide = null;
    globeSpinAfter = performance.now();
    globeStatus.textContent = globeAutoSpin ? 'Automatic rotation enabled' : 'Automatic rotation paused';
    scheduleGlobeFrame();
  }

  function syncGlobeAnimation() {
    if (globeVisible && !document.hidden) {
      globeSpinAfter = performance.now();
      scheduleGlobeFrame();
    } else {
      cancelAnimationFrame(globeFrame);
      globeFrame = 0;
      globeLastFrame = 0;
      globeGlide = null;
    }
  }

  function fitGlobe() {
    globeWidth = globe.clientWidth;
    globeHeight = globe.clientHeight;
    if (!globeWidth || !globeHeight) return;
    const radius = Math.min(globeWidth * .445, globeHeight * .41);
    const centerX = globeWidth * .5, centerY = globeHeight * .28 + radius * .42;
    globeView = {centerX, centerY, radius};
    globe.style.setProperty('--globe-center-x', `${centerX}px`);
    globe.style.setProperty('--globe-center-y', `${centerY}px`);
    globe.style.setProperty('--globe-diameter', `${2 * radius}px`);
    const scale = window.portfolioPerf.ratio(2);
    globeCanvas.width = Math.round(globeWidth * scale);
    globeCanvas.height = Math.round(globeHeight * scale);
    globeContext.setTransform(scale, 0, 0, scale, 0, 0);
    for (const item of globeMarkers) {
      item.width = item.marker.offsetWidth;
      item.height = item.marker.offsetHeight;
    }
    drawGlobe();
  }

  function gesturePoint(event, rect) {
    const {centerX, centerY, radius} = globeView;
    const x = (event.clientX - rect.left - globe.clientLeft - centerX) / radius;
    const y = (event.clientY - rect.top - globe.clientTop - centerY) / radius;
    const distance = Math.hypot(x, y);
    const z = distance < Math.SQRT1_2 ? Math.sqrt(1 - distance ** 2) : .5 / distance;
    const length = Math.hypot(x, y, z);
    return {x: x / length, y: y / length, z: z / length};
  }

  new ResizeObserver(fitGlobe).observe(globe);
  document.addEventListener('portfolio-quality-change', () => { fitGlobe(); drawProjectSpace(); });
  document.fonts.ready.then(fitGlobe);
  new IntersectionObserver(([entry]) => {
    globeVisible = entry.isIntersecting;
    syncGlobeAnimation();
  }, {threshold: .16}).observe(globe);
  document.addEventListener('visibilitychange', syncGlobeAnimation);
  motion.addEventListener('change', () => {
    globeAutoSpin = !motion.matches;
    globeGlide = null;
    resetGlobeSteering();
    if (motion.matches && globeTurn) {
      globeOrientation = multiplyGlobeRotations(globeAxisRotation(globeTurn.axis, globeTurn.angle), globeTurn.from);
      globeTurn = null;
    }
    drawGlobe();
    scheduleGlobeFrame();
  });
  globe.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse') return;
    globeCardHovered = false;
    globeSteer.targetX = 0;
    globeSteer.targetY = 0;
    scheduleGlobeFrame();
  });
  globe.addEventListener('pointerover', event => {
    if (!event.target.closest('.project-sphere-marker')) return;
    if (event.pointerType === 'mouse') globeCardHovered = true;
    globeGlide = null;
    resetGlobeSteering();
  });
  globe.addEventListener('pointerout', event => {
    if (event.pointerType !== 'mouse' || !globeCardHovered || event.relatedTarget?.closest?.('.project-sphere-marker')) return;
    globeCardHovered = false;
    scheduleGlobeFrame();
  });
  globe.addEventListener('focusin', () => {
    globeGlide = null;
    resetGlobeSteering();
  });
  globe.addEventListener('focusout', scheduleGlobeFrame);
  globe.addEventListener('pointerdown', event => {
    if (!globeView || !event.isPrimary || event.button !== 0 || event.target.closest('a, button')) return;
    if (event.pointerType === 'touch' && !event.target.closest('.project-sphere-gesture')) return;
    event.preventDefault();
    resetGlobeSteering();
    globeTurn = null;
    globeGlide = null;
    const rect = globe.getBoundingClientRect();
    globeDrag = {
      id: event.pointerId, rect, point: gesturePoint(event, rect), moved: event.timeStamp, velocity: null,
      startX: event.clientX, startY: event.clientY, tap: true
    };
    globe.setPointerCapture(event.pointerId);
    globe.classList.add('is-dragging');
  });
  globe.addEventListener('pointermove', event => {
    if (globeDrag?.id === event.pointerId) {
      if (globeDrag.tap && Math.hypot(event.clientX - globeDrag.startX, event.clientY - globeDrag.startY) < 6) return;
      globeDrag.tap = false;
      const point = gesturePoint(event, globeDrag.rect);
      const {axis, angle} = globeRotationAxis(globeDrag.point, point);
      globeOrientation = multiplyGlobeRotations(globeAxisRotation(axis, angle), globeOrientation);
      globeDrag.velocity = {axis, speed: Math.min(angle / Math.max(8, event.timeStamp - globeDrag.moved), .008)};
      globeDrag.moved = event.timeStamp;
      globeDrag.point = point;
      drawGlobe();
      return;
    }
    if (!globeView || globeDrag || globeTurn || globeGlide || motion.matches || event.pointerType !== 'mouse' || event.target.closest('a, button') || globe.contains(document.activeElement)) return;
    const rect = globe.getBoundingClientRect();
    globeSteer.targetX = (0.5 - (event.clientY - rect.top) / rect.height) * .25;
    globeSteer.targetY = ((event.clientX - rect.left) / rect.width - 0.5) * .36;
    scheduleGlobeFrame();
  });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    globe.addEventListener(type, event => {
      if (globeDrag?.id !== event.pointerId) return;
      globeGlide = null; // Resume steady automatic rotation immediately after drag.
      globeDrag = null;
      globeSpinAfter = performance.now();
      globe.classList.remove('is-dragging');
      scheduleGlobeFrame();
    });
  }
  globe.addEventListener('keydown', event => {
    if (event.target === globe && event.key === ' ') {
      event.preventDefault();
      if (!event.repeat) toggleGlobeSpin();
      return;
    }
    const turns = {
      ArrowLeft: [globeHorizontalAxis, -.18], ArrowRight: [globeHorizontalAxis, .18],
      ArrowUp: [globeVerticalAxis, .18], ArrowDown: [globeVerticalAxis, -.18]
    };
    const turn = turns[event.key];
    if (event.target !== globe || !turn) return;
    event.preventDefault();
    globeTurn = null;
    globeGlide = null;
    resetGlobeSteering();
    globeOrientation = multiplyGlobeRotations(globeAxisRotation(...turn), globeOrientation);
    drawGlobe();
  });
}

const projectCarousel = document.getElementById('project-carousel');
const projectRail = document.getElementById('project-rail');
const galleryStatus = document.getElementById('project-carousel-announcement');
const galleryTemplate = projectRail.firstElementChild;
let galleryIndex = 0;
let galleryTouch = null;
let gallerySuppressClick = 0;
let galleryTimer;
let galleryVisible = false;
let galleryHovered = false;

function scheduleGallery() {
  clearTimeout(galleryTimer);
  if (!galleryVisible || galleryHovered || galleryTouch || document.hidden || motion.matches ||
      projectCarousel.contains(document.activeElement)) return;
  galleryTimer = setTimeout(() => showGalleryProject(galleryIndex + 1), 4600);
}

const featuredProjects = ["outpost-07", "data-engineering", "machine-learning"].map(slug => projectData.find(project => project.slug === slug));
const galleryCards = featuredProjects.map((project, index) => {
  const card = galleryTemplate.cloneNode(true);
  card.dataset.project = project.slug;
  const link = card.querySelector('a');
  link.href = project.slug + '.html';
  const image = card.querySelector('img');
  image.loading = 'lazy';
  image.fetchPriority = 'low';
  image.src = project.slug === "outpost-07" ? "https://raw.githubusercontent.com/bigbobopenguin-abc/andrea-portfolio/main/static/images/outpost-07/outpost.jpg" : globeProjects[project.slug][2];
  if (project.slug === "outpost-07") { image.dataset.outpostPhoto = ""; image.addEventListener("error", () => { if (!image.src.endsWith("outpost-07-cover.svg")) {image.src = "assets/outpost-07-cover.svg"; image.alt = "Illustrated Outpost 07 cover — gameplay image unavailable";} }, {once:true}); }
  image.dataset.cover = project.slug;
  image.decoding = 'async';
  image.loading = 'lazy';
  image.fetchPriority = 'low';
  card.querySelector('.project-carousel-category').textContent = project.category;
  card.querySelector('h4').textContent = project.name;
  card.querySelector('.project-carousel-copy > p:last-of-type').textContent = project.summary;

  return {card, link};
});
projectRail.replaceChildren(...galleryCards.map(item => item.card));
document.getElementById('project-carousel-controls').hidden = false;

function showGalleryProject(index, announce = false) {
  const moveFocus = projectRail.contains(document.activeElement);
  galleryIndex = (index + galleryCards.length) % galleryCards.length;
  for (const [position, item] of galleryCards.entries()) {
    const offset = (position - galleryIndex + galleryCards.length) % galleryCards.length;
    const state = offset === 0 ? 'current' : offset === 1 ? 'next' : offset === galleryCards.length - 1 ? 'previous' : 'away';
    item.card.dataset.position = state;
    item.card.inert = state === 'away';
    item.link.inert = state === 'away';
  }
  if (moveFocus) galleryCards[galleryIndex].link.focus({preventScroll: true});
  document.getElementById('project-carousel-number').textContent = String(galleryIndex + 1).padStart(2, '0');
  if (announce) galleryStatus.textContent = featuredProjects[galleryIndex].name;
  scheduleGallery();
}

for (const button of projectCarousel.querySelectorAll('[data-carousel-step]')) {
  button.addEventListener('click', () => showGalleryProject(galleryIndex + Number(button.dataset.carouselStep), true));
}
projectCarousel.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  showGalleryProject(galleryIndex + (event.key === 'ArrowLeft' ? -1 : 1), true);
});
projectRail.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'touch' || !event.isPrimary) return;
  galleryTouch = event;
  scheduleGallery();
});
projectRail.addEventListener('pointercancel', () => { galleryTouch = null; scheduleGallery(); });
projectRail.addEventListener('pointerup', event => {
  if (!galleryTouch || galleryTouch.pointerId !== event.pointerId) return;
  const dx = event.clientX - galleryTouch.clientX, dy = event.clientY - galleryTouch.clientY;
  galleryTouch = null;
  scheduleGallery();
  if (Math.abs(dx) < 42 || Math.abs(dx) <= Math.abs(dy) * 1.2) return;
  gallerySuppressClick = performance.now() + 400;
  showGalleryProject(galleryIndex + (dx < 0 ? 1 : -1), true);
});
projectRail.addEventListener('click', event => {
  if (event.detail && performance.now() < gallerySuppressClick) {
    event.preventDefault();
    event.stopPropagation();
  }
}, {capture: true});
new IntersectionObserver(([entry]) => {
  galleryVisible = entry.intersectionRatio >= .42;
  scheduleGallery();
}, {threshold: .42}).observe(projectRail);
projectCarousel.addEventListener('pointerenter', event => {
  if (event.pointerType === 'touch') return;
  galleryHovered = true;
  scheduleGallery();
});
projectCarousel.addEventListener('pointerleave', () => { galleryHovered = false; scheduleGallery(); });
projectCarousel.addEventListener('focusin', scheduleGallery);
projectCarousel.addEventListener('focusout', () => queueMicrotask(scheduleGallery));
document.addEventListener('visibilitychange', scheduleGallery);
motion.addEventListener('change', scheduleGallery);
showGalleryProject(0);

const sectionNames=['home','about','projects','contact'];
const sectionAnchors=[...sectionNames,'skills'];
const main = document.getElementById('main-content');
let activeSection = 'home';
const sectionRail = document.querySelector('.section-rail');
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
function setActive(name){
  activeSection=name;
  document.body.dataset.activeSection=name;
  document.querySelectorAll('.nav-item').forEach(a=>{
    if(a.getAttribute('href')==='#'+name)a.setAttribute('aria-current','location');
    else a.removeAttribute('aria-current');
  });
  const links = [...sectionRail.querySelectorAll('a')];
  paintRail(Math.max(0, links.findIndex(link => link.hash === '#' + name)));
}
let sectionScrollFrame = 0;
function cancelSectionScroll() {
  cancelAnimationFrame(sectionScrollFrame);
  sectionScrollFrame = 0;
  document.documentElement.classList.remove('section-scrolling');
}
for (const type of ['wheel', 'touchstart']) window.addEventListener(type, cancelSectionScroll, {passive: true});
window.addEventListener('keydown', e => {
  if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key)) cancelSectionScroll();
});
function scrollSection(name, immediate = false) {
  const section = document.getElementById(name);
  if (!section) return;
  cancelSectionScroll();
  const start = window.scrollY;
  const target = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight,
    section.getBoundingClientRect().top + start - (name === 'home' ? 0 : 84)));
  if (immediate || motion.matches || Math.abs(target - start) < 2) {
    window.scrollTo({top: target, behavior: 'instant'});
    setActive(name === 'skills' ? 'about' : name);
    return;
  }
  document.documentElement.classList.add('section-scrolling');
  document.querySelector('.floating-header')?.classList.remove('is-scroll-hidden');
  const duration = Math.min(1050, Math.max(600, 440 + Math.abs(target - start) * .38));
  const began = performance.now();
  function step(now) {
    const t = Math.min(1, (now - began) / duration);
    const eased = t * t * t * (t * (t * 6 - 15) + 10);
    window.scrollTo({top: start + (target - start) * eased, behavior: 'instant'});
    if (t < 1) sectionScrollFrame = requestAnimationFrame(step);
    else {
      cancelSectionScroll();
      setActive(name === 'skills' ? 'about' : name);
    }
  }
  sectionScrollFrame = requestAnimationFrame(step);
}

function navigate(immediate = false) {
  const hash = location.hash.slice(1) || 'home';
  if (hash === 'main-content') {
    main.focus({preventScroll: true});
    return;
  }
  const project = projectData.find(item => 'project-' + item.slug === hash);
  if (project) {
    location.replace(project.slug + '.html');
    return;
  }
  if (sectionAnchors.includes(hash)) scrollSection(hash, immediate);
}

document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const destination = link.hash;
  if (!sectionAnchors.includes(destination.slice(1))) return;
  event.preventDefault();
  if (location.hash !== destination) history.pushState(null, '', destination);
  navigate();
});
window.addEventListener('hashchange', () => navigate());
setActive('home');
if (location.hash) requestAnimationFrame(() => navigate(true));
let scrollTick = 0;
window.addEventListener('scroll', () => {
  if (scrollTick) return;
  scrollTick = requestAnimationFrame(() => {
    scrollTick = 0;
    let section = 'home';
    for (const id of sectionNames) {
      if (document.getElementById(id).getBoundingClientRect().top < innerHeight * .45) section = id;
    }
    if (section !== activeSection) setActive(section);
  });
}, {passive: true});

// The homepage introduction is always visible; no click-to-expand controls.
const roles = ['Applied|Machine Learning', 'AI & Data|Engineering Student', 'Background in|Electronics'];
const role = document.getElementById('rotating-role');
let roleIndex = 0;

function buildRole(text, animateLetters) {
  const contents = document.createDocumentFragment();
  for (const [lineIndex, line] of text.split('|').entries()) {
    if (lineIndex) contents.append(document.createElement('br'));
    for (const [wordIndex, word] of line.split(' ').entries()) {
      if (wordIndex) contents.append(' ');
      const group = document.createElement('span');
      group.className = 'role-word';
      if (!animateLetters) group.textContent = word;
      else for (const letter of word) {
        const character = document.createElement('span');
        character.className = 'role-character';
        character.textContent = letter;
        group.append(character);
      }
      contents.append(group);
    }
  }
  return contents;
}

// Invisible copies reserve room for whichever role wraps to the most lines.
for (const text of roles) {
  const measurement = document.createElement('span');
  measurement.className = 'role-sizing';
  measurement.setAttribute('aria-hidden', 'true');
  measurement.append(buildRole(text, false));
  role.before(measurement);
}
role.replaceChildren(buildRole(roles[0], true));
setInterval(async () => {
  if (motion.matches || document.hidden || activeSection !== 'home') return;
  const outgoing = [...role.querySelectorAll('.role-character')];
  await Promise.allSettled(outgoing.map((letter, index) => letter.animate([
    {opacity: 1, translate: '0 0'}, {opacity: 0, translate: '0 -9px'}
  ], {duration: 160, delay: index * 3, fill: 'forwards'}).finished));
  roleIndex = (roleIndex + 1) % roles.length;
  role.replaceChildren(buildRole(roles[roleIndex], true));
  role.querySelectorAll('.role-character').forEach((letter, index) => letter.animate([
    {opacity: 0, translate: '0 12px'}, {opacity: 1, translate: '0 0'}
  ], {duration: 400, delay: index * 7, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both'}));
}, 4700);



document.getElementById('copy-email').addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{await navigator.clipboard.writeText('alagu.karthik17@gmail.com');status.textContent='Email address copied.';}catch{status.textContent='You can select the email address above or click it to open your email app.';}});

// Interactions use the existing photograph and respect reduced motion.
const hero=document.querySelector('.hero'),portrait=document.querySelector('.portrait-frame');let tiltTarget={x:0,y:0},tilt={x:0,y:0};
hero.addEventListener('pointermove',e=>{if(motion.matches||e.pointerType==='touch')return;const r=hero.getBoundingClientRect();const px=(e.clientX-r.left)/r.width;const py=(e.clientY-r.top)/r.height;hero.style.setProperty('--pointer-x',(px*100)+'%');hero.style.setProperty('--pointer-y',(py*100)+'%');hero.style.setProperty('--sun-tx',((px-.5)*8).toFixed(1)+'px');hero.style.setProperty('--sun-ty',((py-.45)*5).toFixed(1)+'px');hero.style.setProperty('--ray-tilt',(-2.6+px*1.8).toFixed(2)+'deg');});hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--sun-tx','0px');hero.style.setProperty('--sun-ty','0px');hero.style.setProperty('--ray-tilt','-2deg');});
let portraitFrame=0;function tiltFrame(){portraitFrame=0;if(motion.matches || activeSection!=='home' || document.hidden){tilt={x:0,y:0};portrait.style.transform='';return;}tilt.x+=(tiltTarget.x-tilt.x)*.16;tilt.y+=(tiltTarget.y-tilt.y)*.16;portrait.style.transform='perspective(1000px) rotateX('+tilt.x.toFixed(3)+'deg) rotateY('+tilt.y.toFixed(3)+'deg)';if(Math.abs(tilt.x-tiltTarget.x)>.025 || Math.abs(tilt.y-tiltTarget.y)>.025)portraitFrame=requestAnimationFrame(tiltFrame);}
function queueTilt(){if(!portraitFrame)portraitFrame=requestAnimationFrame(tiltFrame);}
portrait.addEventListener('pointermove',e=>{if(motion.matches||e.pointerType==='touch')return;const r=portrait.getBoundingClientRect();tiltTarget.x=-(e.clientY-r.top-r.height/2)/r.height*8;tiltTarget.y=(e.clientX-r.left-r.width/2)/r.width*10;queueTilt();});
portrait.addEventListener('pointerleave',()=>{tiltTarget={x:0,y:0};queueTilt();});
window.addEventListener('visibilitychange',()=>{tiltTarget={x:0,y:0};queueTilt();});
document.querySelectorAll('.pill-link:not(.refresh-hero-actions .pill-link),.contact-pill,.project-card').forEach(el=>el.addEventListener('pointermove',e=>{if(motion.matches)return;const r=el.getBoundingClientRect();el.style.setProperty('--hover-x',(e.clientX-r.left)+'px');el.style.setProperty('--hover-y',(e.clientY-r.top)+'px');}));
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

})();

/* END scripts/home/home.js */
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
    if (current <= 100 || document.documentElement.classList.contains('section-scrolling') || document.body.classList.contains('menu-open') ||
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
/* START scripts/home/neural-artwork.js */
(() => {
  'use strict';

  const canvas = document.getElementById('neural-field');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;

  const panel = canvas.closest('.neural-panel');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer: coarse)');
  const angle = Math.PI * 2;
  const colors = ['#3f36b6', '#5b4fe3', '#7d74ff', '#9b98ff', '#62b8ff'];
  const glyphs = ['A', 'K', 'R', 'T', 'H', 'I', '0', '1', '3', '7', '&', '@', '#', '+', '×', '∞', '≋', '•', '{', '}', '⌁', '/'];
  const glyphSteps = [3, 5, 7, 9, 13, 15, 17, 19];
  const cycleEvery = 9500;
  const artworkCount = 3;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, inside: false };
  let width = 0;
  let height = 0;
  let particles = [];
  let mode = 0;
  let oldMode = 0;
  let changedAt = -1550;
  let lastSwitchAt = 0;
  let ripple;
  let inView = false;
  let frameId = 0;
  let lastTime = 0;
  let elapsed = 0;
  let lastPaint = 0;
  let manualMode = false;
  let manualUntil = 0;
  const controls = [...document.querySelectorAll('[data-artwork]')];

  // Rasterize the glyphs once. Each sample can then be drawn with one blit.
  const atlas = document.createElement('canvas');
  const cell = 40;
  atlas.width = cell * glyphs.length;
  atlas.height = cell * colors.length;
  const brush = atlas.getContext('2d');
  brush.font = '700 27px "Space Grotesk Refresh", Consolas, monospace';
  brush.textAlign = 'center';
  brush.textBaseline = 'middle';
  colors.forEach((color, row) => {
    brush.fillStyle = color;
    glyphs.forEach((glyph, column) => brush.fillText(glyph, (column + 0.5) * cell, (row + 0.54) * cell));
  });

  function wavePoint(u, v, drift) {
    const phi = v * angle;
      // Original neural ribbon — broad and airy across the hero.
      const slope = Math.sin(u * 6.6 - 0.4 + drift);
      const taper = Math.pow(Math.sin(u * Math.PI), 0.61);
      const twist = phi + u * 8.7 + drift * 0.66;
      return {
        x: (u - 0.5) * 1.88 + Math.sin(twist) * taper * 0.105,
        y: slope * 0.29 + Math.cos(twist) * taper * (0.19 + 0.23 * Math.sin(u * Math.PI)),
        z: Math.sin(twist + 0.3) * taper,
        scale: 1,
      };
  }

  function helixPoint(u, strand, drift, lane = 0) {
    const phase = u * angle * 2.65 - drift * .92 + strand * Math.PI;
    const depth = Math.cos(phase);
    const x = (u - .5) * 1.94 + depth * (.05 + lane * .031);
    const y = Math.sin(phase) * (.28 + .056 * Math.sin(u * Math.PI)) * (1 + lane * .28);
    return {x: x * .984 + y * .178, y: y * .984 - x * .178, z: depth * .88,
      scale: .72 + depth * .12 + Math.abs(lane) * .20};
  }


  // The canvas reuses the same glyphs as it changes shape.
  function sample(pattern, particle, drift) {
    const {u, v} = particle;
    if (pattern === 0) return wavePoint(particle.waveU, particle.waveV, drift);
    if (pattern === 1) {
      const {orbit, dustRadius, dustAngle, seed} = particle;
      const falling = !orbit && seed < .35;
      const progress = (seed * 17 + drift * (.083 + seed * .1)) % 1;
      const radial = orbit ? .19 + orbit.ring * .137 + (particle.spacing - .5) * .055 :
        falling ? .10 + .86 * (1 - progress) ** 1.53 : dustRadius;
      const theta = orbit ? angle * (orbit.slot + particle.spacing - .5) / orbit.count + drift * (1.05 - orbit.ring * .13) + orbit.ring * .37 :
        dustAngle + drift * (.34 + (1.1 - radial) * .53) + (falling ? progress * 7.2 : 0);
      const x = Math.cos(theta) * radial * 1.07;
      const y = Math.sin(theta) * radial * .55;
      return {
        x: x * .981 + y * .195,
        y: y * .981 - x * .195,
        z: Math.sin(theta) * .72,
        scale: orbit ? .86 : falling ? .34 + Math.sin(progress * Math.PI) * .30 : .26 + seed * .32,
      };
    }
    const strand = v < .5 ? 0 : 1;
    return helixPoint(u, strand, drift, (v * 2 - strand - .5) * 2);
  }

  // Mix each particle ID so adjacent glyphs do not share a repeating pattern.
  function particleNoise(key) {
    let bits = Math.imul(key + 1, 0x9e3779b1);
    bits = Math.imul(bits ^ (bits >>> 16), 0x21f0aaad);
    bits = Math.imul(bits ^ (bits >>> 15), 0x735a2d97);
    return ((bits ^ (bits >>> 15)) >>> 0) / 4294967296;
  }

  function makeParticles() {
    const compact = width < 510 || coarse.matches || window.portfolioPerf.level > 0;
    const low = window.portfolioPerf.level === 2;
    const tracks = low ? 7 : compact ? 10 : 14;
    const columns = low ? 21 : compact ? 27 : 44;
    const stride = 4;
    const ringCounts = compact ? [8, 12, 17, 21, 26] : [18, 29, 38, 50, 62];
    const orbitSlots = ringCounts.reduce((sum, count) => sum + count, 0);
    particles = Array.from({ length: tracks * columns }, (_, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const key = index * 8;
      const seed = particleNoise(key);
      const isOrbit = index % stride === 0 && index / stride < orbitSlots;
      let orbit = null;
      if (isOrbit) {
        let ordinal = index / stride;
        for (let ring = 0; ring < ringCounts.length; ring++) {
          if (ordinal < ringCounts[ring]) {
            orbit = { ring, slot: ordinal, count: ringCounts[ring] };
            break;
          }
          ordinal -= ringCounts[ring];
        }
      }
      // Irrational increments avoid visible grid-like clumping in the halo.
      const dustSeed = (index * 0.6180339887498948) % 1;
      const dustRadialSeed = (index * 0.7548776662466927) % 1;
      return {
        u: (column + .06 + .88 * particleNoise(key + 1)) / columns,
        v: (row + .06 + .88 * particleNoise(key + 2)) / tracks,
        seed,
        glyph: Math.floor(particleNoise(key + 3) * glyphs.length),
        spacing: particleNoise(key + 4),
        phase: particleNoise(key + 5),
        glyphEvery: 2500 + 2400 * particleNoise(key + 6),
        glyphStep: glyphSteps[Math.floor(particleNoise(key + 7) * glyphSteps.length)],
        orbit,
        dustAngle: dustSeed * angle,
        dustRadius: 0.29 + Math.sqrt(dustRadialSeed) * 0.86,
        dx: 0,
        dy: 0,
      };
    });

    // Original ribbon lattice. The regular staggered grid creates the visible
    // twisting rows of characters, without changing the other art modes.
    const waveTracks = low ? 8 : compact ? 12 : 16;
    const waveColumns = low ? 22 : compact ? 28 : 52;
    const waveTotal = waveTracks * waveColumns;
    const sharedCount = particles.length;
    const occupied = new Set();
    function setWaveCoordinates(particle, index) {
      const row = Math.floor(index / waveColumns);
      const column = index % waveColumns;
      particle.waveU = (column + .5 + (row % 2 ? .24 : -.24)) / waveColumns;
      particle.waveV = (row + .5) / waveTracks;
      particle.waveOnly = false;
    }
    particles.forEach((particle, index) => {
      const slot = Math.floor(index * waveTotal / sharedCount);
      occupied.add(slot);
      setWaveCoordinates(particle, slot);
    });
    for (let slot = 0; slot < waveTotal; slot++) {
      if (occupied.has(slot)) continue;
      const template = particles[Math.min(sharedCount - 1, Math.floor(slot * sharedCount / waveTotal))];
      const extra = {...template, dx: 0, dy: 0, glyph: Math.floor(particleNoise(slot + 10000) * glyphs.length)};
      setWaveCoordinates(extra, slot);
      extra.waveOnly = true;
      particles.push(extra);
    }
  }

  // Crisp art direction for non-wave scenes. These are drawn behind/above
  // the animated glyphs using the same canvas, not extra image dependencies.
  function blackHoleField(alpha, drift, radius, cx, cy) {
    if (alpha <= .001) return;
    const dark = document.documentElement.dataset.theme === 'dark';
    const size = Math.max(20, Math.min(53, radius * .076)) * alpha;
    context.save();
    context.translate(cx, cy);
    context.rotate(-.195);
    context.globalAlpha = alpha;
    const haze = context.createRadialGradient(0, 0, size * .7, 0, 0, size * 5.5);
    haze.addColorStop(0, dark ? '#7966ffab' : '#6755ed75');
    haze.addColorStop(.45, dark ? '#5d49de66' : '#7665ef3c');
    haze.addColorStop(.76, dark ? '#518dff20' : '#809bf22d');
    haze.addColorStop(1, '#9388ff00');
    context.beginPath();
    context.arc(0, 0, size * 5.5, 0, angle);
    context.fillStyle = haze;
    context.fill();

    for (let arm = 0; arm < 6; arm++) {
      context.beginPath();
      for (let point = 0; point <= 78; point++) {
        const progress = point / 78;
        const orbit = (.1 + progress ** 1.38 * .94) * alpha;
        const theta = progress * 7.1 + drift * .57 + arm * angle / 6;
        const x = Math.cos(theta) * orbit * radius * 1.07;
        const y = Math.sin(theta) * orbit * radius * .55;
        if (point === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.strokeStyle = dark ? '#a898fc53' : '#6a59e03b';
      context.lineWidth = dark ? 1.15 : 1.45;
      context.stroke();
    }

    const band = context.createLinearGradient(-size * 5, 0, size * 5, 0);
    band.addColorStop(0, '#9a76ff00');
    band.addColorStop(.27, dark ? '#ac97ffac' : '#7857f5a0');
    band.addColorStop(.5, '#e5dfff');
    band.addColorStop(.77, dark ? '#72baffaf' : '#5e7ce9b3');
    band.addColorStop(1, '#6c92f000');
    for (let lane = 0; lane < 10; lane++) {
      context.beginPath();
      const offset = Math.sin(lane * 4.8 + drift * 1.8) * .15;
      context.ellipse(0, 0, size * (1.6 + lane * .38), size * (.23 + lane * .12 + offset * .28),
        offset, 0, angle);
      context.strokeStyle = band;
      context.globalAlpha = alpha * (.96 - lane * .058);
      context.lineWidth = lane < 4 ? 2.5 : 1.2;
      context.stroke();
    }
    context.restore();
  }

  function blackHoleCore(alpha, drift, radius, cx, cy) {
    if (alpha <= .001) return;
    const dark = document.documentElement.dataset.theme === 'dark';
    const size = Math.max(20, Math.min(53, radius * .076)) * alpha;
    context.save();
    context.translate(cx, cy);
    context.rotate(-.195);
    context.globalAlpha = alpha;
    const shadow = context.createRadialGradient(-size * .13, -size * .21, 0, 0, 0, size);
    shadow.addColorStop(0, '#030415');
    shadow.addColorStop(.72, '#08071d');
    shadow.addColorStop(1, dark ? '#201b45' : '#29234d');
    context.beginPath();
    context.arc(0, 0, size, 0, angle);
    context.fillStyle = shadow;
    context.fill();

    context.shadowColor = dark ? '#aa91ff' : '#6446df';
    context.shadowBlur = 9;
    context.strokeStyle = dark ? '#c9b8ff' : '#7960e5';
    context.lineWidth = 2.1;
    context.beginPath();
    context.arc(0, 0, size * 1.035, 0, angle);
    context.stroke();
    context.lineWidth = 3.3;
    context.strokeStyle = '#f0e7ff';
    context.beginPath();
    context.arc(0, 0, size * 1.047, -2.93 + Math.sin(drift) * .16, -1.34 + Math.sin(drift) * .16);
    context.stroke();
    context.shadowBlur = 0;
    context.beginPath();
    context.ellipse(0, 0, size * 1.65, size * .37, 0, .08, Math.PI - .08);
    context.lineWidth = 2.15;
    context.strokeStyle = dark ? '#e5dbff' : '#b29cfa';
    context.stroke();
    context.restore();
  }

  // Helix: two actual spatial strands, illuminated rungs, and travelling markers.
  // Depth-dependent line weights make the DNA ribbon readable from a distance.
  function helixLinks(alpha, drift, radius, cx, cy) {
    if (alpha <= .001) return;
    const dark = document.documentElement.dataset.theme === 'dark';
    const span = radius * 1.86;
    const point = (u, strand = 0) => {
      const p = helixPoint(u, strand, drift);
      return {x: cx + p.x * radius, y: cy + p.y * radius, depth: p.z};
    };
    context.save();
    const aura = context.createLinearGradient(cx - span / 2, cy, cx + span / 2, cy);
    aura.addColorStop(0, '#7e62ea00');
    aura.addColorStop(.35, dark ? '#7b68e96b' : '#6557cf46');
    aura.addColorStop(.67, dark ? '#79c5ff7c' : '#4f8ed777');
    aura.addColorStop(1, '#83b4f100');
    context.strokeStyle = dark ? 'rgba(176,177,255,.36)' : 'rgba(91,86,193,.31)';
    for (let i=0;i<=38;i++) {
      const u=i/38;
      const a=point(u,0),b=point(u,1);
      const depth=(a.depth+1)/2;
      context.globalAlpha=alpha * (.32 + .62 * depth);
      context.lineWidth=1 + 1.4 * depth;
      context.beginPath();context.moveTo(a.x,a.y);context.lineTo(b.x,b.y);context.stroke();
    }
    for (let strand=0; strand<2; strand++) {
      context.beginPath();
      for (let i=0;i<=108;i++) {
        const p=point(i/108,strand);
        if(i===0)context.moveTo(p.x,p.y);else context.lineTo(p.x,p.y);
      }
      context.globalAlpha=alpha;
      context.lineCap='round';
      context.strokeStyle = strand === 0 ? (dark ? '#ac8bff9e' : '#7657d875') : (dark ? '#7bd6ff9e' : '#3885d175');
      context.lineWidth=5.2;
      context.stroke();
      context.strokeStyle=aura;
      context.lineWidth=2.7;
      context.stroke();
    }
    // Light beads indicate phase, direction and interactivity without labels.
    for(let i=0;i<32;i++) {
      const u=(i+.5)/32;
      const p=point(u,i%2);
      const depth=(p.depth+1)/2;
      context.globalAlpha=alpha * (.35 + depth * .55);
      context.fillStyle=i%2 ? (dark?'#80caff':'#4d8ade'):(dark?'#cab8ff':'#6556d4');
      context.beginPath();context.arc(p.x,p.y,1.6+depth*1.5,0,angle);context.fill();
    }
    for(let i=0;i<3;i++) {
      const u=((drift * .065 + i / 3) % 1 + 1) % 1;
      const p=point(u,i%2);
      context.globalAlpha=alpha * Math.sin(u*Math.PI);
      context.shadowColor=dark?'#aceaff':'#6b62e9';
      context.shadowBlur=12;
      context.fillStyle=dark?'#e5f4ff':'#7869ee';
      context.beginPath();context.arc(p.x,p.y,3.2,0,angle);context.fill();
    }
    context.restore();
  }

  function setMode(next) {
    if (next === mode) return;
    oldMode = mode;
    mode = (next + artworkCount) % artworkCount;
    controls.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.artwork) === mode)));
    changedAt = elapsed;
    lastSwitchAt = elapsed;
    if (reduce.matches) draw();
  }

  function draw() {
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);
    const drift = elapsed / 4250;
    const progress = Math.max(0, Math.min(1, (elapsed - changedAt) / 1550));
    // Smoothstep keeps velocity continuous as one art shape becomes another.
    const blend = reduce.matches ? 1 : progress * progress * (3 - 2 * progress);
    const radius = Math.min(width * 0.6, height * 0.98);
    const midX = width * 0.52;
    const midY = height * 0.5;
    const reach = Math.min(115, Math.max(54, width * 0.17));
    const age = ripple ? elapsed - ripple.start : Infinity;
    const pulseRadius = age * 0.39;
    const pulseOpacity = Math.max(0, 1 - age / 850);
    const baseSize = width < 510 ? 16 : 22;
    // Supporting curves and the event horizon can appear progressively, but
    // every symbol remains visible throughout the whole morph.
    const holeAmount = mode === 1 ? blend : oldMode === 1 ? 1 - blend : 0;
    const helixAmount = mode === 2 ? blend : oldMode === 2 ? 1 - blend : 0;
    const waveAmount = mode === 0 ? blend : oldMode === 0 ? 1 - blend : 0;
    blackHoleField(holeAmount, drift, radius, midX, midY);
    helixLinks(helixAmount, drift, radius, midX, midY);
    pointer.x += (pointer.targetX - pointer.x) * 0.13;
    pointer.y += (pointer.targetY - pointer.y) * 0.13;
    pointer.strength += ((pointer.inside ? 1 : 0) - pointer.strength) * 0.11;

    const still = reduce.matches;
    for (const particle of particles) {
      if (particle.waveOnly && waveAmount <= .001) continue;
      const {seed, phase} = particle;
      const swaps = still || seed > .57 ? 0 : Math.floor((elapsed / particle.glyphEvery) + phase);
      const glyph = (particle.glyph + swaps * particle.glyphStep) % glyphs.length;
      const to = sample(particle.waveOnly ? 0 : mode, particle, drift);
      const from = blend === 1 || particle.waveOnly ? to : sample(oldMode, particle, drift);
      // Follow a continuous arc between the artwork shapes.
      const turn = Math.sin(blend * Math.PI) * 0.032 * (seed - 0.5);
      const next = {
        x: from.x + (to.x - from.x) * blend + turn * (to.y - from.y),
        y: from.y + (to.y - from.y) * blend - turn * (to.x - from.x),
        z: from.z + (to.z - from.z) * blend,
        scale: from.scale + (to.scale - from.scale) * blend,
      };
      const depth = 0.5 + 0.5 * next.z;
      const perspective = 0.92 + depth * 0.13;
      const sway = phase * angle + drift * (.75 + seed * .64);
      const spread = radius * (.005 + .013 * particle.spacing) * (1 - waveAmount);
      const x = midX + next.x * radius * perspective + Math.cos(sway) * spread;
      const y = midY + next.y * radius * perspective + Math.sin(sway) * spread;
      let pushX = 0;
      let pushY = 0;
      if (!reduce.matches && pointer.strength > 0.01) {
        const rx = x - pointer.x;
        const ry = y - pointer.y;
        const distance = Math.hypot(rx, ry);
        if (distance < reach) {
          const force = (1 - distance / reach) ** 2 * pointer.strength * 48;
          const safeDistance = Math.max(8, distance);
          pushX += ((rx - ry * 0.36) / safeDistance) * force;
          pushY += ((ry + rx * 0.36) / safeDistance) * force;
        }
      }
      let pulse = 0;
      if (ripple && pulseOpacity && !reduce.matches) {
        const rx = x - ripple.x;
        const ry = y - ripple.y;
        const distance = Math.hypot(rx, ry);
        const band = Math.max(0, 1 - Math.abs(distance - pulseRadius) / 32);
        pulse = band * pulseOpacity;
        const safeDistance = Math.max(4, distance);
        pushX += (rx / safeDistance) * pulse * 35;
        pushY += (ry / safeDistance) * pulse * 35;
      }
      particle.dx += (pushX - particle.dx) * 0.18;
      particle.dy += (pushY - particle.dy) * 0.18;
      const lit = depth + pulse * 0.5;
      const tint =
        (seed > 0.975 && lit > 0.45) || pulse > 0.48
          ? 4
          : lit > 0.85
            ? 3
            : lit > 0.55
              ? 2
              : lit > 0.26
                ? 1
                : 0;
      const size = baseSize * ((.74 + depth * .57 + .18 * phase) * (1 - waveAmount) + (.8 + depth * .58) * waveAmount + pulse * .26) * next.scale;
      // Do NOT interpolate alpha between art modes. Symbols physically move
      // and resize, without an invisible gap or crossfade.
      context.globalAlpha = Math.min(1, 0.52 + depth * 0.41 + pulse * 0.2) * (particle.waveOnly ? waveAmount : 1);
      context.drawImage(
        atlas,
        glyph * cell,
        tint * cell,
        cell,
        cell,
        x + particle.dx - size / 2,
        y + particle.dy - size / 2,
        size,
        size,
      );
    }
    context.globalAlpha = 1;
    blackHoleCore(holeAmount, drift, radius, midX, midY);
  }

  function fit() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const scale = window.portfolioPerf.ratio(1.25);
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    context.setTransform(scale, 0, 0, scale, 0, 0);
    makeParticles();
    draw();
  }

  function tick(time) {
    frameId = 0;
    if (!inView || document.hidden || reduce.matches) return;
    if (document.documentElement.classList.contains('is-transitioning')) {
      lastTime = time;
      frameId = requestAnimationFrame(tick);
      return;
    }
    elapsed += Math.max(0, Math.min(40, time - lastTime));
    lastTime = time;
    if (manualMode && elapsed >= manualUntil) {manualMode = false;lastSwitchAt = elapsed;}
    if (!manualMode && elapsed - lastSwitchAt >= cycleEvery) setMode(mode + 1);
    if (elapsed - lastPaint >= window.portfolioPerf.interval(coarse.matches ? 42 : 32, 42, 48)) {
      const paintStart = performance.now();
      draw();
      window.portfolioPerf.paintCost(performance.now() - paintStart);
      lastPaint = elapsed;
    }
    frameId = requestAnimationFrame(tick);
  }

  function sync() {
    if (inView && !document.hidden && !reduce.matches) {
      if (!frameId) {
        lastTime = performance.now();
        frameId = requestAnimationFrame(tick);
      }
    } else if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
    if (reduce.matches) draw();
  }


  for (const button of controls) {
    button.addEventListener('click', () => {
      manualMode = true;
      manualUntil = elapsed + 13500;
      setMode(Number(button.dataset.artwork));
    });
  }
  if (controls.length) {
    const switcher = controls[0].parentElement;
    switcher.hidden = false;
    switcher.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const current = controls.indexOf(document.activeElement);
      const step = event.key === 'ArrowRight' ? 1 : -1;
      const next = controls[(current + step + controls.length) % controls.length];
      next.focus();
      next.click();
    });
  }

  // Canvas drawing uses clientWidth/clientHeight, while the visible canvas
  // is transformed by CSS. Invert that scale, including its transform origin.
  function artworkPoint(event) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height || !width || !height) return null;
    return {x: (event.clientX - rect.left) * width / rect.width,
            y: (event.clientY - rect.top) * height / rect.height};
  }
  const interactionSurface = panel.closest('.hero') || panel;
  interactionSurface.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const point = artworkPoint(event);
    if (!point) return;
    pointer.targetX = point.x;
    pointer.targetY = point.y;
    if (!pointer.inside) {
      pointer.x = pointer.targetX;
      pointer.y = pointer.targetY;
    }
    pointer.inside = true;
  });
  interactionSurface.addEventListener('pointerleave', () => {
    pointer.inside = false;
  });
  interactionSurface.addEventListener('click', (event) => {
    if (reduce.matches || event.target.closest('a,button')) return;
    const point = artworkPoint(event);
    if (!point) return;
    ripple = { ...point, start: elapsed };
  });

  reduce.addEventListener('change', () => {
    pointer.inside = false;
    pointer.strength = 0;
    for (const particle of particles) {
      particle.dx = 0;
      particle.dy = 0;
    }
    sync();
  });
  coarse.addEventListener('change', () => {
    fit();
  });
  new ResizeObserver(fit).observe(canvas);
  document.addEventListener('portfolio-quality-change', fit);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }).observe(panel);
  document.addEventListener('visibilitychange', sync);
  new MutationObserver(() => { if (reduce.matches) draw(); }).observe(document.documentElement, {
    attributes: true, attributeFilter: ['data-theme']
  });
  fit();
  panel.classList.add('is-rendering');
})();

/* END scripts/home/neural-artwork.js */
;
/* START scripts/home/portrait-and-about.js */
/* Shared, progressive enhancements: keep the original interactions intact. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const photo = document.querySelector('.refresh-photo-card');
  if(photo){
    photo.addEventListener('pointermove',event=>{
      if(reduce.matches || event.pointerType==='touch') return;
      const r=photo.getBoundingClientRect();
      photo.style.setProperty('--shine-x',`${((event.clientX-r.left)/r.width)*100}%`);
      photo.style.setProperty('--shine-y',`${((event.clientY-r.top)/r.height)*100}%`);
    });
    photo.addEventListener('keydown',event=>{
      if(event.key==='Enter' || event.key===' '){event.preventDefault();location.href='index.html#about';}
    });
  }
  // Lightweight reveal for the compact About section only.
  const compact = document.querySelector('.refresh-about-inner');
  if(compact){
    if(reduce.matches || !('IntersectionObserver' in window)){compact.classList.add('in-view');}
    else new IntersectionObserver((entries,observer)=>{
      for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}
    },{threshold:.08}).observe(compact);
  }
})();

/* END scripts/home/portrait-and-about.js */
;
/* START scripts/home/about-signature.js */
// Same one-letter-at-a-time scramble character language as the footer; gently loops.
(() => {
  const label = document.querySelector('.about-handwritten-scramble');
  if (!label) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const original = label.textContent.trim();
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@+×';
  let visible = false, motionId = 0, timer = 0;
  const reset = () => {label.textContent = original;};
  const scramble = () => {
    if (reduced.matches || !visible || document.hidden) return reset();
    const start = performance.now();
    const draw = (now) => {
      const revealed = Math.floor((now - start) / 700 * original.length);
      label.textContent = [...original].map((char, i) =>
        !/[a-z]/i.test(char) || i < revealed ? char : alphabet[Math.floor(Math.random() * alphabet.length)]
      ).join('');
      if (revealed < original.length && visible && !reduced.matches) motionId = requestAnimationFrame(draw);
      else {reset(); motionId = 0;}
    };
    motionId = requestAnimationFrame(draw);
  };
  function sync() {
    clearInterval(timer); timer = 0;
    if (!visible || document.hidden || reduced.matches) {
      cancelAnimationFrame(motionId); motionId = 0; reset(); return;
    }
    timer = setInterval(scramble, 3800);
  }
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; sync();
  });
  observer.observe(label);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide',()=>{clearInterval(timer);cancelAnimationFrame(motionId);});
  window.addEventListener('pageshow', sync);
})();

/* END scripts/home/about-signature.js */
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

  for (const panel of panels.values()) {
    const title = panel.querySelector('h3');
    const text = title.textContent.trim();
    title.setAttribute('aria-label', text);
    title.replaceChildren();
    let order = 0;
    for (const [index, word] of text.split(' ').entries()) {
      if (index) title.append(' ');
      const group = document.createElement('span');
      group.className = 'skills-title-word';
      group.setAttribute('aria-hidden', 'true');
      for (const symbol of word) {
        const letter = document.createElement('span');
        letter.className = 'skills-title-letter';
        letter.style.setProperty('--letter-index', order++);
        letter.textContent = symbol;
        group.append(letter);
      }
      title.append(group);
    }
  }

  const interval = 3600;
  let selected = 0;
  let visible = !('IntersectionObserver' in window);
  let lastManualChoice = -Infinity;
  let timer;

  function schedule() {
    clearTimeout(timer);
    const focused = document.activeElement;
    const focusNeedsStability = details.contains(focused) ||
      (tabs.includes(focused) && focused.matches(':focus-visible'));
    if (!visible || focusNeedsStability || document.hidden || reduce.matches) return;
    const cooldown = Math.max(0, 6000 - (performance.now() - lastManualChoice));
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
      panel.classList.toggle('is-introducing', active && !reduce.matches);
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
      visible = entry.intersectionRatio >= .3;
      browser.classList.toggle('is-in-view', visible);
      schedule();
    }, {threshold: .3}).observe(browser);
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
