// Reusable 3D CV 2026-11 specimens (pure three.js geometry, zero external 3D models, flicker-free).
import * as THREE from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

function cast(o) {
  o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  return o;
}

export function makePlinthDisc(r, h = 0.075, baseCol = 0x26140f, metalCol = 0xc89b4f) {
  const g = new THREE.Group();
  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r * 1.07, h, 48),
    new THREE.MeshStandardMaterial({ color: baseCol, roughness: 0.5, metalness: 0.05 })
  );
  disc.position.y = h / 2;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(r * 1.045, 0.009, 10, 64),
    new THREE.MeshStandardMaterial({ color: metalCol, metalness: 0.94, roughness: 0.28, envMapIntensity: 1.25 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = h * 0.8;
  g.add(disc, ring);
  return g;
}

// ---------- Specimen I: 4-Column Calibrated Brass & Crystal Oversight Gauge (ZERO sphere!) ----------
// Represents the 4 models in code-oversight-bench (Qwen 7B, Haiku 4.5, Qwen 14B, Sonnet 5.5).
// Clicking evaluation arms in the drawer smoothly animates the 4 physical 3D columns in real time!
export function createSafetySpecimen(opts = {}) {
  const metalCol = opts.metalCol ?? 0xd4a657;
  const baseCol = opts.baseCol ?? 0x221510;
  const metal = new THREE.MeshStandardMaterial({ color: metalCol, metalness: 0.94, roughness: 0.28, envMapIntensity: 1.25 });
  const ebony = new THREE.MeshStandardMaterial({ color: baseCol, roughness: 0.52, metalness: 0.05 });
  const slateBack = new THREE.MeshStandardMaterial({ color: 0x151d36, roughness: 0.65, metalness: 0.12 });

  const g = new THREE.Group();

  // Beveled rectangular ebony & brass instrument base
  const plinth = new THREE.Mesh(new RoundedBoxGeometry(0.76, 0.085, 0.44, 3, 0.018), ebony);
  plinth.position.y = 0.0425;
  const baseTrim = new THREE.Mesh(new THREE.BoxGeometry(0.79, 0.016, 0.47), metal);
  baseTrim.position.y = 0.018;
  baseTrim.castShadow = false;
  g.add(plinth, baseTrim);

  // Calibrated rectangular brass architectural frame (left/right pillars + top crown + back scale plate)
  const frameH = 0.80;
  const frameY0 = 0.085;
  const frameW = 0.66;
  [-frameW / 2, frameW / 2].forEach((x) => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, frameH, 16), metal);
    pillar.position.set(x, frameY0 + frameH / 2, 0);
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.028, 16, 12), metal);
    finial.position.set(x, frameY0 + frameH + 0.03, 0);
    g.add(pillar, finial);
  });
  const topBar = new THREE.Mesh(new RoundedBoxGeometry(frameW + 0.08, 0.036, 0.14, 2, 0.008), metal);
  topBar.position.set(0, frameY0 + frameH + 0.005, 0);
  g.add(topBar);

  // Recessed calibration scale backing plate with crisp engraved 0% / 25% / 50% / 75% / 100% brass ticks
  const backPlate = new THREE.Mesh(new THREE.BoxGeometry(frameW - 0.05, frameH - 0.06, 0.024), slateBack);
  backPlate.position.set(0, frameY0 + frameH / 2, -0.075);
  g.add(backPlate);

  const colMaxH = 0.66;
  const colBaseY = frameY0 + 0.045;
  [0.25, 0.5, 0.75, 1.0].forEach((frac) => {
    const wire = new THREE.Mesh(new THREE.BoxGeometry(frameW - 0.06, 0.006, 0.008), metal);
    wire.position.set(0, colBaseY + frac * colMaxH, -0.055);
    wire.castShadow = false;
    g.add(wire);
  });

  // 4 Glass tubes + 4 animated physical telemetry columns (Qwen 7B, Haiku 4.5, Qwen 14B, Sonnet 5.5)
  const xs = [-0.21, -0.07, 0.07, 0.21];
  const tubeMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.06, transparent: true, opacity: 0.18,
    envMapIntensity: 1.1, clearcoat: 1, side: THREE.FrontSide, depthWrite: false,
  });

  const barMeshes = [];
  const barCaps = [];
  const barMats = [];
  const targetFracs = [0.89, 0.80, 0.38, 0.08];
  const currentFracs = [0.89, 0.80, 0.38, 0.08];
  const initialCols = [0xe85d44, 0xee8a38, 0xdba53a, 0x3ec48f];

  xs.forEach((x, idx) => {
    const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.058, 0.038, 24), metal);
    socket.position.set(x, frameY0 + 0.019, 0.02);
    g.add(socket);

    const bMat = new THREE.MeshStandardMaterial({
      color: initialCols[idx], emissive: initialCols[idx], emissiveIntensity: 0.24,
      roughness: 0.32, metalness: 0.15,
    });
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 1, 24), bMat);
    bar.position.set(x, colBaseY, 0.02);
    bar.castShadow = true;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.018, 24), metal);
    cap.position.set(x, colBaseY, 0.02);
    g.add(bar, cap);
    barMeshes.push(bar);
    barCaps.push(cap);
    barMats.push(bMat);

    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, colMaxH + 0.03, 28, 1, true), tubeMat);
    tube.position.set(x, colBaseY + (colMaxH + 0.03) / 2, 0.02);
    tube.castShadow = false;
    tube.renderOrder = 2;
    g.add(tube);
  });

  function applyHeights() {
    for (let i = 0; i < 4; i++) {
      const h = Math.max(0.028, currentFracs[i] * colMaxH);
      barMeshes[i].scale.y = h;
      barMeshes[i].position.y = colBaseY + h / 2;
      barCaps[i].position.y = colBaseY + h + 0.009;
    }
  }
  applyHeights();

  function setArmBars(rows) {
    const colMap = { bad: 0xe85d44, mid: 0xee9538, '': 0x3ec48f };
    rows.forEach(([, pct, , cls], i) => {
      if (i >= 4) return;
      targetFracs[i] = Math.max(0.02, Math.min(1, pct / 100));
      const hex = colMap[cls] ?? 0x3ec48f;
      barMats[i].color.setHex(hex);
      barMats[i].emissive.setHex(hex);
    });
  }

  function update(dt, instant = false) {
    const k = instant ? 1 : 1 - Math.exp(-dt * 7.5);
    let dirty = false;
    for (let i = 0; i < 4; i++) {
      const d = targetFracs[i] - currentFracs[i];
      if (Math.abs(d) > 0.0005) { currentFracs[i] += d * k; dirty = true; }
    }
    if (dirty) applyHeights();
  }

  // Slight angled presentation so the brass instrument reads with rich 3D depth
  g.rotation.y = 0.24;
  // Keep compatible API (.spin stub + .setArmBars + .update)
  return { group: cast(g), spin: { rotation: { y: 0 } }, setArmBars, setAnomalyRate: () => {}, update };
}

// ---------- Specimen II: 82-Vertex Cohn Spherical Code Polyhedron + Stealthy Brass Rings ----------
function sphericalPoints(n = 82) {
  const P = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (2 * i + 1) / n, r = Math.sqrt(1 - y * y), th = i * Math.PI * (3 - Math.sqrt(5));
    P.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r));
  }
  const F = P.map(() => new THREE.Vector3());
  const d = new THREE.Vector3();
  for (let it = 0; it < 260; it++) {
    for (const f of F) f.set(0, 0, 0);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      d.subVectors(P[i], P[j]);
      const l2 = d.lengthSq(), w = 1 / (l2 * Math.sqrt(l2));
      F[i].addScaledVector(d, w); F[j].addScaledVector(d, -w);
    }
    for (let i = 0; i < n; i++) P[i].addScaledVector(F[i], 0.6 / n).normalize();
  }
  return P;
}

export function createMathSpecimen(opts = {}) {
  const hullCol = opts.hullCol ?? 0xa6742e;
  const hullMetal = opts.hullMetal ?? 0.85;
  const metalCol = opts.metalCol ?? 0xd4a657;
  const baseCol = opts.baseCol ?? 0x221510;
  const pearlCol = opts.pearlCol ?? 0xf4ede1;

  const metal = new THREE.MeshStandardMaterial({ color: metalCol, metalness: 0.94, roughness: 0.28, envMapIntensity: 1.25 });
  const g = new THREE.Group();
  const R = 0.35;
  const pts = sphericalPoints().map((p) => p.multiplyScalar(R));
  const hull = new THREE.Mesh(new ConvexGeometry(pts), new THREE.MeshStandardMaterial({
    color: hullCol, metalness: hullMetal, roughness: 0.34, flatShading: true, envMapIntensity: 1.25,
  }));
  const pearlGeo = new THREE.SphereGeometry(0.017, 12, 8);
  const pearlMat = new THREE.MeshStandardMaterial({ color: pearlCol, roughness: 0.32, metalness: 0.05 });
  const pearls = new THREE.InstancedMesh(pearlGeo, pearlMat, pts.length);
  pearls.castShadow = false;
  const m = new THREE.Matrix4();
  pts.forEach((p, i) => { m.makeTranslation(p.x * 1.016, p.y * 1.016, p.z * 1.016); pearls.setMatrixAt(i, m); });

  const ringA = new THREE.Mesh(new THREE.TorusGeometry(R * 1.22, 0.007, 10, 64), metal);
  ringA.rotation.set(1.15, 0.3, 0); ringA.castShadow = false;
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(R * 1.33, 0.0055, 10, 64), metal);
  ringB.rotation.set(-0.9, 0.7, 0.2); ringB.castShadow = false;

  const head = new THREE.Group();
  head.add(hull, pearls, ringA, ringB);
  head.position.y = 0.075 + 0.28 + R;
  head.rotation.set(0.32, 0.4, 0.08);
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.02, 0.3, 16), metal);
  rod.position.y = 0.075 + 0.15;
  g.add(makePlinthDisc(0.28, 0.075, baseCol, metalCol), rod, head);

  let spinVel = 0;
  function kick() {
    spinVel = Math.min(spinVel + 3.4, 7.0);
  }
  function update(dt, reduced = false) {
    if (reduced) return;
    head.rotation.y += dt * (0.13 + spinVel);
    ringA.rotation.z -= dt * (0.09 + spinVel * 0.65);
    ringB.rotation.x += dt * (0.07 + spinVel * 0.48);
    if (spinVel > 0.001) spinVel *= Math.exp(-dt * 2.1);
    else spinVel = 0;
  }
  return { group: cast(g), spin: head, kick, update };
}

// ---------- Specimen III: AZERTY Global 4-Pillar Matte PBT Mechanical Keycaps ----------
// Verified canonical mappings from AZERTY Global.json:
// É (E02 Caps+é), œ (D09 AltGr+o), « (B01 AltGr+w), { (C03 AltGr+d)
function keyTopTexture(glyph, sub, bg, fg, subCol) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 512, 512);
  // Subtle machined keycap dish rim
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 14; ctx.strokeRect(18, 18, 476, 476);
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 4; ctx.strokeRect(30, 30, 452, 452);

  ctx.fillStyle = fg;
  ctx.font = '600 250px "Besley", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(glyph, 256, 218);

  ctx.fillStyle = subCol;
  ctx.font = '600 54px "Martian Mono", monospace';
  ctx.fillText(sub, 256, 412);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function createAzertySpecimen(opts = {}) {
  const accentBg = opts.accentBg ?? '#c95632';
  const accentFg = opts.accentFg ?? '#fdf7ee';
  const darkBg = opts.darkBg ?? '#1d2a57';
  const darkFg = opts.darkFg ?? '#f7f0e2';
  const lightBg = opts.lightBg ?? '#e5dac4';
  const lightFg = opts.lightFg ?? '#192242';
  const baseCol = opts.baseCol ?? 0x221510;
  const metalCol = opts.metalCol ?? 0xd4a657;

  const g = new THREE.Group();
  const ebony = new THREE.MeshStandardMaterial({ color: baseCol, roughness: 0.55, metalness: 0.05 });
  const metal = new THREE.MeshStandardMaterial({ color: metalCol, metalness: 0.92, roughness: 0.3, envMapIntensity: 1.2 });

  const pad = new THREE.Group();
  pad.position.set(0, 0.05, 0);
  const tilt = 0.42;

  const plinth = new THREE.Mesh(new RoundedBoxGeometry(0.84, 0.13, 0.78, 4, 0.028), ebony);
  plinth.position.y = 0.085; plinth.rotation.x = tilt;
  // Recessed brass switch plate cleanly raised above plinth
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.018, 0.70), metal);
  bezel.position.set(0, 0.158, -0.032); bezel.rotation.x = tilt; bezel.castShadow = false;
  pad.add(plinth, bezel);

  // 4 canonical AZERTY Global keys: French accented cap, typographic ligature, French guillemet, dev home-row brace
  const keys = [
    { g: 'É', s: 'Caps+é',  x: -0.175, z: -0.155, bg: accentBg, fg: accentFg, sub: '#ffd9c7' },
    { g: 'œ', s: 'AltGr+o', x:  0.175, z: -0.155, bg: lightBg,  fg: '#121a36', sub: '#2f3854' },
    { g: '«', s: 'AltGr+w', x: -0.175, z:  0.165, bg: lightBg,  fg: '#121a36', sub: '#2f3854' },
    { g: '{', s: 'AltGr+d', x:  0.175, z:  0.165, bg: darkBg,   fg: darkFg,   sub: '#c8d2ea' },
  ];

  const keyGroup = new THREE.Group();
  keyGroup.position.set(0, 0.23, -0.062); keyGroup.rotation.x = tilt;
  const keyCaps = [];
  keys.forEach((k, idx) => {
    const sideMat = new THREE.MeshStandardMaterial({ color: k.bg, roughness: 0.9, metalness: 0.0, envMapIntensity: 0.15 });
    const topMat = new THREE.MeshStandardMaterial({ map: keyTopTexture(k.g, k.s, k.bg, k.fg, k.sub), roughness: 0.92, metalness: 0.0, envMapIntensity: 0.12 });
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.13, 0.26), [sideMat, sideMat, topMat, sideMat, sideMat, sideMat]);
    cap.position.set(k.x, 0, k.z);
    cap.userData.keyIndex = idx;
    cap.userData.keyInfo = { glyph: k.g, combo: k.s };
    keyGroup.add(cap);
    keyCaps.push({ mesh: cap, topMat, depth: 0, vel: 0, flash: 0, info: { glyph: k.g, combo: k.s } });
  });
  pad.add(keyGroup);
  pad.rotation.y = -0.18;

  g.add(pad);
  let lastIdx = -1;
  function pressKey(idx) {
    const i = typeof idx === 'number' && idx >= 0 && idx < keyCaps.length ? idx : (lastIdx + 1) % keyCaps.length;
    lastIdx = i;
    const item = keyCaps[i];
    item.depth = 0.056;
    item.vel = -0.18;
    item.flash = 1;
    return item.info;
  }
  function update(dt, reduced = false) {
    keyCaps.forEach((item) => {
      if (reduced) { item.depth = 0; item.vel = 0; item.flash = 0; item.mesh.position.y = 0; return; }
      if (item.depth > 0.0005 || Math.abs(item.vel) > 0.0005) {
        const spring = -item.depth * 140 - item.vel * 18;
        item.vel += spring * dt;
        item.depth = Math.max(0, item.depth + item.vel * dt);
        item.mesh.position.y = -item.depth;
      } else if (item.mesh.position.y !== 0) {
        item.mesh.position.y = 0;
      }
      if (item.flash > 0.001) {
        item.flash = Math.max(0, item.flash - dt * 3.5);
        item.topMat.emissive.setHex(0xffb47d);
        item.topMat.emissiveIntensity = item.flash * 0.28;
      } else if (item.topMat.emissiveIntensity !== 0) {
        item.topMat.emissiveIntensity = 0;
      }
    });
  }
  return { group: cast(g), spin: pad, pressKey, update };
}

// ---------- Seamless Single-Mesh Glass Cloche (LatheGeometry, FrontSide -> ZERO sorting flicker!) ----------
export function createGlassBell(radius = 0.56, height = 0.84, metalCol = 0xd4a657) {
  const g = new THREE.Group();
  const pts = [];
  pts.push(new THREE.Vector2(radius, 0.015));
  pts.push(new THREE.Vector2(radius, height));
  const steps = 20;
  for (let i = 1; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(Math.max(0.002, Math.cos(a) * radius), height + Math.sin(a) * radius));
  }
  const glassGeo = new THREE.LatheGeometry(pts, 64);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.13,
    envMapIntensity: 1.3, clearcoat: 1, clearcoatRoughness: 0.05, side: THREE.FrontSide, depthWrite: false,
  });
  const shell = new THREE.Mesh(glassGeo, glassMat);
  shell.castShadow = false;
  shell.receiveShadow = false;
  shell.renderOrder = 4;

  const metal = new THREE.MeshStandardMaterial({ color: metalCol, metalness: 0.94, roughness: 0.25, envMapIntensity: 1.35 });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.013, 12, 64), metal);
  rim.rotation.x = Math.PI / 2; rim.position.y = 0.016; rim.castShadow = false;
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.042, 20, 14), metal);
  knob.position.y = height + radius + 0.028; knob.castShadow = false;

  g.add(shell, rim, knob);
  return g;
}

export function makeSafetyLab(safetyObj) {
  const ARMS = {
    bare: {
      rows: [
        ['Qwen 7B (bf16)', 89, '89.0% FPR', 'bad'],
        ['Haiku 4.5', 80, '80.0% FPR', 'bad'],
        ['Qwen 14B (NF4)', 38, '38.0% FPR', 'mid'],
        ['Sonnet 5.5', 8, '8.0% FPR', '']
      ],
      note: '100 real repo pairs (L0 bare): paired separation 4.0% (Qwen 7B), 14.0% (Haiku & Qwen 14B NF4), vs. 80.0% (Sonnet).'
    },
    twopass: {
      rows: [
        ['Haiku 2-pass', 25, '25.0% FPR', 'mid'],
        ['Sonnet 2-pass', 7, '7.0% FPR', ''],
        ['Qwen 7B (L1)', 0, '0% TPR/FPR', 'bad'],
        ['Qwen 14B (L1)', 0, '0% TPR/FPR', 'bad']
      ],
      note: '100 real repo pairs (L1 2-pass): Haiku FPR 80% to 25% (sep. 50%), Sonnet 7% (sep. 83%), while Qwen 7B/14B flipped 277/277 real-repo flags to CLEAN (370/370 across all 130 pairs).'
    },
    exec: {
      rows: [
        ['Qwen 7B + exec', 69, '69.0% FPR', 'bad'],
        ['Qwen 14B + exec', 14, '14.0% FPR', 'mid'],
        ['Haiku + exec', 10, '10.0% FPR', 'mid'],
        ['Sonnet + exec', 8, '8.0% FPR', '']
      ],
      note: '100 real repo pairs (L2 isolated exec): Haiku dropped 21/24 buggy ImportError files to CLEAN (sep. 39%); Sonnet kept 18/18 (sep. 81%); Qwen 7B 8% sep., Qwen 14B NF4 17% sep.'
    },
    standalone: {
      rows: [
        ['Qwen 7B + exec', 43.3, '43.3% FPR', 'mid'],
        ['Qwen 14B + exec', 23.3, '23.3% FPR', 'mid'],
        ['Sonnet + exec', 10, '10.0% FPR', ''],
        ['Haiku + exec', 0, '0/30 FPR', '']
      ],
      note: '30 standalone pairs (L2 isolated exec): Haiku reached 0/30 FPR and 93.3% paired separation; Sonnet 3/30 FPR (all 3 genuine clean-baseline edge bugs), 90.0% sep.'
    }
  };
  const el = document.createElement('section');
  el.className = 'lab';
  el.setAttribute('aria-label', 'Interactive 4-arm ablation explorer');
  el.innerHTML = `
    <div class="lab-tabs" role="group" aria-label="Evaluation arms">
      <button type="button" class="lab-tab" data-arm="bare" aria-pressed="true">Bare (100 real)</button>
      <button type="button" class="lab-tab" data-arm="twopass" aria-pressed="false">2-pass (100)</button>
      <button type="button" class="lab-tab" data-arm="exec" aria-pressed="false">Py exec (100)</button>
      <button type="button" class="lab-tab" data-arm="standalone" aria-pressed="false">Standalone + exec (30)</button>
    </div>
    <div class="lab-bars"></div>
    <p class="lab-note"></p>`;
  const bars = el.querySelector('.lab-bars');
  const note = el.querySelector('.lab-note');
  const order = ['bare', 'twopass', 'exec', 'standalone'];
  const labels = { bare: 'Bare (100 real)', twopass: '2-pass (100)', exec: 'Py exec (100)', standalone: 'Standalone + exec (30)' };
  let activeKey = 'bare';
  function render(key) {
    activeKey = key;
    const a = ARMS[key];
    bars.innerHTML = a.rows.map(([n, w, lbl, cls]) =>
      `<div class="bar-row"><span>${n}</span><span class="bar-track"><span class="bar-fill ${cls}" style="width:${Math.max(2, w)}%"></span></span><span>${lbl}</span></div>`
    ).join('');
    note.textContent = a.note;
    el.querySelectorAll('.lab-tab').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.arm === key)));
    if (safetyObj.setArmBars) safetyObj.setArmBars(a.rows);
    return labels[key];
  }
  el.cycleArm = () => {
    const next = order[(order.indexOf(activeKey) + 1) % order.length];
    return render(next);
  };
  el.querySelectorAll('.lab-tab').forEach((b) => b.addEventListener('click', () => render(b.dataset.arm)));
  render('bare');
  return el;
}
