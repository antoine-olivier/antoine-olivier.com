// Direction N · Le Cabinet des Cloches (Polished flicker-free fusion: dawn mullions, mahogany credenza, clickable architect lamp, orbit camera, 3 interactive specimens under seamless lifting glass cloches).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RESULTS } from './results.js';
import { createSafetySpecimen, createMathSpecimen, createAzertySpecimen, createGlassBell, makeSafetyLab } from './specimens.js';

const root = document.documentElement;
const params = new URLSearchParams(location.search);
const shot = params.has('shot');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || params.has('static') || shot;
let framesLeft = Infinity;
if (shot) root.classList.add('shot');

const canvas = document.getElementById('scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) {
  root.classList.add('no-webgl');
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;
renderer.setClearColor(0x141a33, 1);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x141a33, 16, 38);
const camera = new THREE.PerspectiveCamera(27, 1, 0.1, 80);

const loader = new THREE.TextureLoader();
const maxAniso = renderer.capabilities.getMaxAnisotropy();
function loadTex(name, srgb, rx = 3, ry = 1.5) {
  const t = loader.load(`./assets/tex/dark_wood_${name}_1k.jpg`);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = maxAniso;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const mahoganyMat = new THREE.MeshStandardMaterial({
  color: 0x9c725a, map: loadTex('diff', true, 3, 1.4), normalMap: loadTex('nor_gl', false, 3, 1.4),
  roughnessMap: loadTex('rough', false, 3, 1.4), roughness: 0.9, metalness: 0.04, envMapIntensity: 0.9,
});
const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4a657, metalness: 0.94, roughness: 0.26, envMapIntensity: 1.3 });
const indigoVelvet = new THREE.MeshStandardMaterial({ color: 0x1a2245, roughness: 0.94, metalness: 0 });
const darkBronze = new THREE.MeshStandardMaterial({ color: 0x20222b, metalness: 0.72, roughness: 0.38 });

function windowGobo() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, 512, 512);
  const pad = 64, bar = 18, w = (512 - 2 * pad - bar) / 2, h = (512 - 2 * pad - 2 * bar) / 3;
  const grd = g.createRadialGradient(256, 256, 40, 256, 256, 300);
  grd.addColorStop(0, '#fff'); grd.addColorStop(1, '#cfcfcf');
  g.fillStyle = grd;
  for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) g.fillRect(pad + i * (w + bar), pad + j * (h + bar), w, h);
  g.filter = 'blur(6px)'; g.drawImage(c, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Room: midnight indigo wall + horizontal brass gallery rail + parquet floor
const wall = new THREE.Mesh(new THREE.PlaneGeometry(70, 26), new THREE.MeshStandardMaterial({ color: 0x263166, roughness: 0.95 }));
wall.position.set(0, 2, -2.15); wall.receiveShadow = true; scene.add(wall);
const rail = new THREE.Mesh(new THREE.BoxGeometry(70, 0.045, 0.05), brassMat);
rail.position.set(0, 0.95, -2.1); scene.add(rail);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 30), new THREE.MeshStandardMaterial({ color: 0x10152b, roughness: 0.85 }));
floor.rotation.x = -Math.PI / 2; floor.position.y = -2.25; floor.receiveShadow = true; scene.add(floor);

// Strictly non-overlapping vertical clearances to guarantee ZERO z-fighting / flicker!
const benchY = -0.96;
const topSlab = new THREE.Mesh(new RoundedBoxGeometry(7.6, 0.18, 2.25, 4, 0.03), mahoganyMat);
topSlab.position.set(0.1, benchY - 0.09, 0.05); topSlab.castShadow = true; topSlab.receiveShadow = true;
const bodyBox = new THREE.Mesh(new RoundedBoxGeometry(7.2, 1.25, 1.95, 2, 0.02), mahoganyMat);
bodyBox.position.set(0.1, benchY - 0.81, -0.05); bodyBox.castShadow = true; bodyBox.receiveShadow = true;
const frontRail = new THREE.Mesh(new THREE.BoxGeometry(7.62, 0.028, 0.025), brassMat);
frontRail.position.set(0.1, benchY - 0.03, 1.185);
const velvetRim = new THREE.Mesh(new THREE.BoxGeometry(6.04, 0.016, 1.60), brassMat);
velvetRim.position.set(-0.22, benchY + 0.008, 0.02);
const velvet = new THREE.Mesh(new RoundedBoxGeometry(5.96, 0.022, 1.52, 2, 0.008), indigoVelvet);
velvet.position.set(-0.22, benchY + 0.027, 0.02); velvet.receiveShadow = true;
scene.add(topSlab, bodyBox, frontRail, velvetRim, velvet);

const matTopY = benchY + 0.038;

// Clickable Articulated 3D Brass Architect Lamp
const lamp = new THREE.Group();
lamp.position.set(3.22, benchY + 0.002, -0.42);
const lBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.08, 36), darkBronze);
lBase.position.y = 0.04; lBase.castShadow = true;
const lArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.03, 1.32, 16), brassMat);
lArm1.position.set(-0.10, 0.67, 0); lArm1.rotation.z = 0.14; lArm1.castShadow = true;
const lJoint = new THREE.Mesh(new THREE.SphereGeometry(0.055, 18, 14), brassMat);
lJoint.position.set(-0.19, 1.31, 0);
const lArm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.024, 1.05, 16), brassMat);
lArm2.position.set(-0.62, 1.56, 0.14); lArm2.rotation.z = 1.12; lArm2.rotation.y = -0.2; lArm2.castShadow = true;
const lShade = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.36, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0x1b2347, metalness: 0.45, roughness: 0.35, side: THREE.DoubleSide }));
const baseShadeRotZ = 0.56;
lShade.position.set(-1.04, 1.72, 0.26); lShade.rotation.z = baseShadeRotZ; lShade.rotation.x = 0.14; lShade.castShadow = true;
const lRim = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.013, 10, 36), brassMat);
lRim.position.set(0, -0.18, 0); lRim.rotation.x = Math.PI / 2; lShade.add(lRim);
const lBulbMat = new THREE.MeshStandardMaterial({ color: 0xfff3d4, emissive: 0xffb870, emissiveIntensity: 2.2 });
const lBulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), lBulbMat);
lBulb.position.set(0, -0.07, 0); lShade.add(lBulb);
// Invisible click proxy around the shade for effortless clicking
const lHit = new THREE.Mesh(new THREE.SphereGeometry(0.46, 12, 10), new THREE.MeshBasicMaterial({ visible: false }));
lHit.position.set(-0.96, 1.66, 0.24);
lamp.add(lBase, lArm1, lJoint, lArm2, lShade, lHit);
lamp.traverse((o) => { o.userData.action = 'lamp'; });
scene.add(lamp);

// Three DISTINCT 3D specimens under seamless lifting glass cloches
const POS = [
  { id: 'safety', x: -2.18, stepH: 0.16, bellR: 0.57, bellH: 0.86, scale: 1.04 },
  { id: 'math',   x: -0.25, stepH: 0.38, bellR: 0.58, bellH: 0.90, scale: 1.06 },
  { id: 'azerty', x:  1.62, stepH: 0.16, bellR: 0.60, bellH: 0.68, scale: 1.04 },
];

const safety = createSafetySpecimen({ metalCol: 0xd9a959, baseCol: 0x201510 });
const math = createMathSpecimen({ hullCol: 0xa6742e, metalCol: 0xd9a959, baseCol: 0x201510 });
const azerty = createAzertySpecimen({ accentBg: '#a43a1c', accentFg: '#fff8ef', darkBg: '#152046', lightBg: '#cbbda5', baseCol: 0x201510, metalCol: 0xd9a959 });
const objs = { safety, math, azerty };
const bells = {};
const spots = {};
const anchors = [];

POS.forEach((p) => {
  const step = new THREE.Mesh(new RoundedBoxGeometry(1.34, p.stepH, 1.34, 3, 0.025), mahoganyMat);
  step.position.set(p.x, matTopY + p.stepH / 2, 0.02); step.castShadow = true; step.receiveShadow = true;
  const sTrim = new THREE.Mesh(new THREE.BoxGeometry(1.37, 0.02, 1.37), brassMat);
  sTrim.position.set(p.x, matTopY + p.stepH - 0.032, 0.02);
  scene.add(step, sTrim);

  const floorY = matTopY + p.stepH + 0.004;
  const spec = objs[p.id];
  spec.group.position.set(p.x, floorY, 0.02);
  spec.group.scale.setScalar(p.scale);
  spec.group.traverse((o) => { o.userData.id = p.id; o.userData.part = 'specimen'; });
  scene.add(spec.group);

  const bell = createGlassBell(p.bellR, p.bellH, 0xd4a657);
  bell.position.set(p.x, floorY, 0.02);
  bell.traverse((o) => { o.userData.id = p.id; o.userData.part = 'bell'; });
  scene.add(bell);
  bells[p.id] = { group: bell, baseY: floorY, lift: 0 };

  const sp = new THREE.SpotLight(0xffe0b5, p.id === 'azerty' ? 2.5 : 13, 7.5, 0.48, 0.85, 1.5);
  sp.position.set(p.x, 2.65, 0.55); sp.target.position.set(p.x, floorY + 0.35, 0.02);
  scene.add(sp, sp.target);
  spots[p.id] = sp;

  anchors.push(new THREE.Vector3(p.x, benchY - 0.05, 1.15));
});

// Balanced lighting: midnight fill + diagonal dawn window mullions + toggleable desk-lamp glow
scene.add(new THREE.HemisphereLight(0x4b5db5, 0x0c0f1f, 1.15));
const dawn = new THREE.SpotLight(0xffb47d, 520, 32, 0.45, 0.55, 1.55);
dawn.position.set(-7.2, 5.2, 7.2); dawn.target.position.set(-0.2, -0.1, 0);
const narrowScreen = innerWidth <= 900;
dawn.map = windowGobo(); dawn.castShadow = true; dawn.shadow.mapSize.set(narrowScreen ? 1024 : 2048, narrowScreen ? 1024 : 2048);
dawn.shadow.bias = -0.0007; dawn.shadow.normalBias = 0.045; dawn.shadow.radius = 4;
scene.add(dawn, dawn.target);

const deskPool = new THREE.SpotLight(0xffcb85, 18, 10, 0.72, 0.85, 1.6);
deskPool.position.set(2.25, 0.75, -0.05); deskPool.target.position.set(1.5, benchY, 0.05);
scene.add(deskPool, deskPool.target);

const pmrem = new THREE.PMREMGenerator(renderer);
const useLiteEnv = narrowScreen || Boolean(navigator.connection && navigator.connection.saveData);
const envReady = useLiteEnv
  ? Promise.resolve().then(() => {
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 0.34;
    })
  : new HDRLoader().loadAsync('./assets/hdr/museum_of_ethnography_1k.hdr').then((hdr) => {
      scene.environment = pmrem.fromEquirectangular(hdr).texture;
      scene.environmentIntensity = 0.36;
      hdr.dispose();
    }).catch(() => {});

// Spherical damped camera orbit state (works before clicking any bell jar AND while inspecting a specimen!)
const orbit = { yaw: 0, pitch: 0.09, dist: 9.75, target: new THREE.Vector3(0.05, 0.08, 0) };
const orbitWant = { yaw: 0, pitch: 0.09, dist: 9.75, target: new THREE.Vector3(0.05, 0.08, 0) };
const orbitDefault = { yaw: 0, pitch: 0.09, dist: 9.75 };
const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

let openId = null, openerEl = null;
let mobileFocus = 'safety';
let hoverId = null, hoverAction = null;
let lampOn = true, lampGlow = 1, lampNod = 0, lampNodVel = 0;

const resetBtn = document.querySelector('.hud-reset');
const lampBtn = document.querySelector('.hud-lamp');
const toastEl = document.querySelector('.studio-toast');
let toastTimer = null;

function showToast(msg) {
  if (!toastEl || shot) return;
  toastEl.textContent = msg;
  toastEl.hidden = false;
  requestAnimationFrame(() => toastEl.classList.add('is-shown'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('is-shown');
    setTimeout(() => { if (!toastEl.classList.contains('is-shown')) toastEl.hidden = true; }, 220);
  }, 1900);
}

function updateResetButton() {
  if (!resetBtn) return;
  const moved = Math.abs(orbitWant.yaw - orbitDefault.yaw) > 0.04
    || Math.abs(orbitWant.pitch - orbitDefault.pitch) > 0.04
    || Math.abs(orbitWant.dist - orbitDefault.dist) > 0.25;
  resetBtn.hidden = !moved;
}

function clampOrbit() {
  const maxYaw = openId ? 1.18 : 0.84;
  const minPitch = openId ? 0.04 : 0.03;
  const maxPitch = openId ? 0.65 : 0.56;
  const minDist = openId ? 2.4 : 5.6;
  const maxDist = openId ? 5.3 : 12.2;
  orbitWant.yaw = Math.max(-maxYaw, Math.min(maxYaw, orbitWant.yaw));
  orbitWant.pitch = Math.max(minPitch, Math.min(maxPitch, orbitWant.pitch));
  orbitWant.dist = Math.max(minDist, Math.min(maxDist, orbitWant.dist));
  updateResetButton();
}

function frameAll() {
  const wide = innerWidth > 900;
  const wantFov = wide ? 27 : 39;
  if (camera.fov !== wantFov) {
    camera.fov = wantFov;
    camera.updateProjectionMatrix();
  }
  if (wide) {
    orbitWant.target.set(0.05, 0.08, 0);
    orbitDefault.yaw = 0; orbitDefault.pitch = 0.09; orbitDefault.dist = 9.75;
  } else {
    orbitWant.target.set(-0.25, 0.05, 0);
    orbitDefault.yaw = 0; orbitDefault.pitch = 0.09; orbitDefault.dist = 10.6;
  }
  orbitWant.yaw = orbitDefault.yaw;
  orbitWant.pitch = orbitDefault.pitch;
  orbitWant.dist = orbitDefault.dist;
  updateResetButton();
}

function frameItem(id) {
  const p = POS.find((q) => q.id === id);
  const wide = innerWidth > 900;
  orbitWant.target.set(p.x + (wide ? 0.82 : 0), matTopY + p.stepH + 0.55, 0.02);
  orbitDefault.yaw = wide ? -0.06 : 0;
  orbitDefault.pitch = 0.16;
  orbitDefault.dist = wide ? 3.62 : 4.35;
  orbitWant.yaw = orbitDefault.yaw;
  orbitWant.pitch = orbitDefault.pitch;
  orbitWant.dist = orbitDefault.dist;
  updateResetButton();
}

function resetCamera(silent = false) {
  orbitWant.yaw = orbitDefault.yaw;
  orbitWant.pitch = orbitDefault.pitch;
  orbitWant.dist = orbitDefault.dist;
  updateResetButton();
  if (!silent) showToast('Camera view reset');
}

function toggleLamp() {
  lampOn = !lampOn;
  lampNodVel = lampOn ? -2.2 : 2.2;
  if (lampBtn) {
    lampBtn.setAttribute('aria-pressed', String(lampOn));
    lampBtn.textContent = lampOn ? 'Lamp on' : 'Lamp off';
  }
  showToast(lampOn ? 'Architect lamp on' : 'Architect lamp off');
}

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  if (!openId) frameAll(); else frameItem(openId);
}
addEventListener('resize', resize);
addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse') return;
  pointer.x = (e.clientX / innerWidth) * 2 - 1;
  pointer.y = (e.clientY / innerHeight) * 2 - 1;
});

const nav = document.querySelector('.tags');
nav.innerHTML = '';
root.classList.remove('diorama-mode');
const btn3d = document.querySelector('.hud-3d');
if (btn3d) btn3d.hidden = true;
const drawer = document.getElementById('drawer');
const body = drawer.querySelector('.drawer-body');
const closeBtn = drawer.querySelector('.drawer-close');
const byId = Object.fromEntries(RESULTS.map((r) => [r.id, r]));
const lab = makeSafetyLab(safety);

const tags = RESULTS.map((r) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'tag'; b.dataset.id = r.id;
  if (r.id === mobileFocus) b.classList.add('is-mobile-active');
  b.innerHTML = `<span class="tag-no">${r.no}</span><span class="tag-title">${r.tag}</span><span class="tag-status">${r.tagStatus}</span>`;
  b.addEventListener('click', () => {
    mobileFocus = r.id;
    tags.forEach((t) => t.classList.toggle('is-mobile-active', t.dataset.id === mobileFocus));
    show(r.id, b);
  });
  nav.append(b);
  return b;
});

function show(id, from) {
  const r = byId[id]; openId = id;
  openerEl = from || tags.find((t) => t.dataset.id === id);
  body.innerHTML = `<p class="no">${r.no}</p><h2 id="drawer-title" tabindex="-1">${r.title}</h2><p class="status">${r.status}</p><p class="drawer-lead">${r.lead}</p>${r.body}`;
  if (r.lab) body.querySelector('.lab-slot').replaceWith(lab);
  drawer.hidden = false; root.classList.add('is-open');
  drawer.scrollTop = 0;
  frameItem(id);
  requestAnimationFrame(() => { const h = document.getElementById('drawer-title'); if (h) h.focus({ preventScroll: true }); });
}
function hide() {
  if (!openId) return;
  openId = null; drawer.hidden = true; root.classList.remove('is-open');
  frameAll();
  if (openerEl) openerEl.focus({ preventScroll: true });
}

// Clicking the 4 AZERTY keycap legend pills in the drawer physically presses the matching 3D keycap!
body.addEventListener('click', (e) => {
  const item = e.target.closest('.kl-item');
  if (!item || openId !== 'azerty') return;
  const items = Array.from(body.querySelectorAll('.kl-item'));
  const idx = items.indexOf(item);
  if (idx >= 0) {
    const info = azerty.pressKey(idx);
    showToast(`${info.glyph} · ${info.combo}`);
  }
});

const plainBtn = document.querySelector('.plain-toggle');
const plainBack = document.querySelector('.plain-back');
function setPlain(on) {
  root.classList.toggle('plain-mode', on);
  plainBtn.setAttribute('aria-pressed', String(on));
  if (on) { hide(); document.getElementById('plain').focus({ preventScroll: true }); }
  else plainBtn.focus({ preventScroll: true });
}
closeBtn.addEventListener('click', hide);
if (resetBtn) resetBtn.addEventListener('click', () => resetCamera(false));
if (lampBtn) lampBtn.addEventListener('click', toggleLamp);

addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea')) return;
  if (e.key === 'Escape') {
    if (root.classList.contains('plain-mode')) setPlain(false);
    else hide();
  } else if ((e.key === 'r' || e.key === 'R') && !root.classList.contains('plain-mode')) {
    resetCamera(false);
  } else if ((e.key === 'l' || e.key === 'L') && !root.classList.contains('plain-mode')) {
    toggleLamp();
  }
});
plainBtn.addEventListener('click', () => setPlain(!root.classList.contains('plain-mode')));
plainBack.addEventListener('click', () => setPlain(false));

const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
const pickables = [
  ...Object.values(objs).map((o) => o.group),
  ...Object.values(bells).map((b) => b.group),
  lamp,
];
function pickHit(e) {
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  return ray.intersectObjects(pickables, true)[0] || null;
}

// Click-and-drag camera orbit + scroll zoom + crisp drag-vs-click disambiguation
const drag = { active: false, moved: false, id: null, startX: 0, startY: 0, lastX: 0, lastY: 0 };
let justDragged = false;

canvas.addEventListener('pointerdown', (e) => {
  if (e.button !== 0 && e.pointerType === 'mouse') return;
  drag.active = true;
  drag.moved = false;
  drag.id = e.pointerId;
  drag.startX = drag.lastX = e.clientX;
  drag.startY = drag.lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener('pointermove', (e) => {
  if (drag.active && e.pointerId === drag.id) {
    const dx = e.clientX - drag.lastX;
    const dy = e.clientY - drag.lastY;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    if (!drag.moved && Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 6) {
      drag.moved = true;
      canvas.classList.add('is-dragging');
      canvas.style.cursor = 'grabbing';
    }
    if (drag.moved) {
      orbitWant.yaw -= dx * 0.0052;
      orbitWant.pitch += dy * 0.0042;
      clampOrbit();
    }
    return;
  }
  if (e.pointerType !== 'mouse') return;
  const hit = pickHit(e);
  hoverId = hit && hit.object.userData.id ? hit.object.userData.id : null;
  hoverAction = hit && hit.object.userData.action ? hit.object.userData.action : null;
  const interactive = Boolean(hoverId || hoverAction);
  canvas.style.cursor = interactive ? 'pointer' : 'grab';
  tags.forEach((t) => t.classList.toggle('is-hot', !openId && t.dataset.id === hoverId));
});

function endDrag(e) {
  if (!drag.active || (e.pointerId !== undefined && e.pointerId !== drag.id)) return;
  if (drag.moved) {
    justDragged = true;
    setTimeout(() => { justDragged = false; }, 60);
  }
  drag.active = false;
  drag.moved = false;
  drag.id = null;
  canvas.classList.remove('is-dragging');
  canvas.style.cursor = (hoverId || hoverAction) ? 'pointer' : 'grab';
  if (e.pointerId !== undefined && canvas.hasPointerCapture(e.pointerId)) {
    canvas.releasePointerCapture(e.pointerId);
  }
}
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);

canvas.addEventListener('wheel', (e) => {
  if (root.classList.contains('plain-mode')) return;
  e.preventDefault();
  orbitWant.dist += e.deltaY * 0.0038;
  clampOrbit();
}, { passive: false });

canvas.addEventListener('dblclick', (e) => {
  const hit = pickHit(e);
  if (!hit) resetCamera(false);
});

canvas.addEventListener('click', (e) => {
  if (justDragged) return;
  const hit = pickHit(e);
  if (hit && hit.object.userData.action === 'lamp') {
    toggleLamp();
    return;
  }
  const id = hit ? hit.object.userData.id : null;
  if (!id) {
    if (openId) hide();
    return;
  }
  if (id !== openId) {
    show(id);
    return;
  }
  // Clicking the currently open specimen triggers its real physical instrument action!
  if (id === 'safety' && lab.cycleArm) {
    const armLabel = lab.cycleArm();
    showToast(`Barometer · ${armLabel}`);
  } else if (id === 'math') {
    math.kick();
    showToast('Cohn (11, 82) spherical code');
  } else if (id === 'azerty') {
    const info = azerty.pressKey(hit.object.userData.keyIndex);
    showToast(`${info.glyph} · ${info.combo}`);
  }
});

const clock = new THREE.Clock(), v = new THREE.Vector3();
function loop() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const k = reduced ? 1 : 1 - Math.exp(-dt * 5.8);

  orbit.yaw += (orbitWant.yaw - orbit.yaw) * k;
  orbit.pitch += (orbitWant.pitch - orbit.pitch) * k;
  orbit.dist += (orbitWant.dist - orbit.dist) * k;
  orbit.target.lerp(orbitWant.target, k);

  if (!reduced) {
    const px = drag.active ? 0 : pointer.x;
    const py = drag.active ? 0 : pointer.y;
    pointer.sx += (px - pointer.sx) * k;
    pointer.sy += (py - pointer.sy) * k;
  }

  safety.update(dt, reduced);
  math.update(dt, reduced);
  azerty.update(dt, reduced);

  // Smooth desk lamp switch + spring nod on the shade
  const lampGoal = lampOn ? 1 : 0;
  lampGlow += (lampGoal - lampGlow) * k;
  deskPool.intensity = 18 * lampGlow;
  lBulbMat.emissiveIntensity = 0.06 + 2.14 * lampGlow;
  let shadowDirty = false;
  if (!reduced && (Math.abs(lampNod) > 0.0005 || Math.abs(lampNodVel) > 0.0005)) {
    const f = -lampNod * 90 - lampNodVel * 12;
    lampNodVel += f * dt;
    lampNod += lampNodVel * dt;
    lShade.rotation.z = baseShadeRotZ + lampNod * 0.09;
    shadowDirty = true;
  } else {
    lShade.rotation.z = baseShadeRotZ;
  }

  for (const [id, b] of Object.entries(bells)) {
    const isHoverPeek = !openId && hoverId === id && !drag.active && !reduced;
    const goal = id === openId ? 1.55 : (isHoverPeek ? 0.11 : 0);
    if (Math.abs(goal - b.lift) > 0.008) shadowDirty = true;
    b.lift += (goal - b.lift) * k;
    b.group.position.y = b.baseY + b.lift;
    const baseInt = id === 'azerty' ? 2.5 : 13;
    const targetInt = id === openId ? baseInt * 1.7 : (isHoverPeek ? baseInt * 1.28 : baseInt);
    spots[id].intensity += (targetInt - spots[id].intensity) * k;
  }
  if (shadowDirty) renderer.shadowMap.needsUpdate = true;

  const effYaw = orbit.yaw + pointer.sx * 0.028;
  const effPitch = Math.max(0.02, orbit.pitch - pointer.sy * 0.015);
  camera.position.set(
    orbit.target.x + orbit.dist * Math.cos(effPitch) * Math.sin(effYaw),
    orbit.target.y + orbit.dist * Math.sin(effPitch),
    orbit.target.z + orbit.dist * Math.cos(effPitch) * Math.cos(effYaw)
  );
  camera.lookAt(orbit.target);
  renderer.render(scene, camera);

  if (!openId && innerWidth > 900) {
    const W = innerWidth, H = innerHeight;
    const placed = anchors.map((a, i) => {
      v.copy(a).project(camera);
      const t = tags[i];
      const w = t.offsetWidth || 232, h = t.offsetHeight || 76;
      const x = Math.max(12, Math.min(W - w - 12, (v.x + 1) / 2 * W - w / 2));
      const y = Math.max(12, Math.min(H - h - 12, (1 - v.y) / 2 * H + 16));
      return { t, x, y, w, h };
    });
    if (W > 900) {
      // Prevent perspective foreshortening from overlapping adjacent cartels during wide 3/4 orbit
      const order = [...placed].sort((a, b) => a.x - b.x);
      for (let i = 1; i < order.length; i++) {
        const minX = order[i - 1].x + order[i - 1].w + 10;
        if (order[i].x < minX) order[i].x = minX;
      }
      const overflow = order[order.length - 1].x + order[order.length - 1].w + 12 - W;
      if (overflow > 0) order.forEach((p) => { p.x = Math.max(12, p.x - overflow); });
    }
    placed.forEach((p) => {
      p.t.style.transform = `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px)`;
    });
  }
  if (--framesLeft > 0) requestAnimationFrame(loop);
}

resize();
root.classList.add('scene-on');
requestAnimationFrame(loop);
Promise.allSettled([envReady, document.fonts.ready]).then(() => {
  window.__sceneReady = true;
  if (shot) framesLeft = 24;
});
