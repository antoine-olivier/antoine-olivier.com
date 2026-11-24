import { RESULTS } from './results.js';
import { makeSafetyLab } from './safety-lab.js';

const root = document.documentElement;
const dioramaEl = document.getElementById('diorama');
const nav = document.querySelector('.tags');
const drawer = document.getElementById('drawer');
const body = drawer.querySelector('.drawer-body');
const closeBtn = drawer.querySelector('.drawer-close');
const plainBtn = document.querySelector('.plain-toggle');
const plainBack = document.querySelector('.plain-back');
const lampBtn = document.querySelector('.hud-lamp');
const btn3d = document.querySelector('.hud-3d');
const toastEl = document.querySelector('.studio-toast');

const byId = Object.fromEntries(RESULTS.map((r) => [r.id, r]));
const lab = makeSafetyLab();
const ac = new AbortController();
const { signal } = ac;

let openId = null;
let openerEl = null;
let lampOn = true;
let toastTimer = 0;
let loading3d = false;

function showToast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 1900);
}

const SPECIMEN_SVG = {
  safety: `<svg viewBox="0 0 64 76" class="dio-spec" aria-hidden="true">
    <rect x="14" y="56" width="36" height="8" rx="2" fill="#201510" stroke="#d9a959" stroke-width="1.2"/>
    <rect x="20" y="20" width="24" height="36" rx="4" fill="#182246" stroke="#d9a959" stroke-width="1.4"/>
    <path d="M25 46 L25 32 M32 46 L32 26 M39 46 L39 38" stroke="#ff9a62" stroke-width="3" stroke-linecap="round"/>
    <circle cx="32" cy="14" r="3.5" fill="#d9a959"/>
  </svg>`,
  math: `<svg viewBox="0 0 64 76" class="dio-spec" aria-hidden="true">
    <rect x="14" y="56" width="36" height="8" rx="2" fill="#201510" stroke="#d9a959" stroke-width="1.2"/>
    <line x1="32" y1="45" x2="32" y2="56" stroke="#d9a959" stroke-width="2"/>
    <polygon points="32,14 48,25 44,44 20,44 16,25" fill="rgba(217,169,89,0.22)" stroke="#e4b86a" stroke-width="1.5"/>
    <line x1="32" y1="14" x2="32" y2="44" stroke="#e4b86a" stroke-width="1" opacity="0.7"/>
    <line x1="16" y1="25" x2="48" y2="25" stroke="#e4b86a" stroke-width="1" opacity="0.7"/>
    <circle cx="32" cy="14" r="2.2" fill="#fff0d1"/>
    <circle cx="48" cy="25" r="2.2" fill="#fff0d1"/>
    <circle cx="16" cy="25" r="2.2" fill="#fff0d1"/>
  </svg>`,
  azerty: `<svg viewBox="0 0 64 76" class="dio-spec" aria-hidden="true">
    <rect x="14" y="56" width="36" height="8" rx="2" fill="#201510" stroke="#d9a959" stroke-width="1.2"/>
    <rect x="16" y="30" width="14" height="12" rx="2" fill="#a43a1c" stroke="#ffb88c" stroke-width="1"/>
    <rect x="34" y="30" width="14" height="12" rx="2" fill="#cbbda5" stroke="#fff8ef" stroke-width="1"/>
    <rect x="16" y="44" width="14" height="10" rx="2" fill="#cbbda5" stroke="#fff8ef" stroke-width="1"/>
    <rect x="34" y="44" width="14" height="10" rx="2" fill="#152046" stroke="#7d90c8" stroke-width="1"/>
    <text x="23" y="39" text-anchor="middle" font-size="8" font-family="monospace" fill="#fff8ef">É</text>
    <text x="41" y="39" text-anchor="middle" font-size="8" font-family="monospace" fill="#121a36">œ</text>
  </svg>`,
};

dioramaEl.innerHTML = `
  <div class="dio-window" aria-hidden="true"></div>
  <div class="dio-stage">
    <div class="dio-bells">
      ${RESULTS.map((r) => `
        <button type="button" class="dio-bell" data-id="${r.id}" aria-label="Open ${r.tag}">
          <span class="dio-dome">
            <span class="dio-knob"></span>
            <span class="dio-shine"></span>
            ${SPECIMEN_SVG[r.id] || ''}
            <span class="dio-rim"></span>
          </span>
          <span class="dio-pedestal dio-pedestal-${r.id}"></span>
        </button>`).join('')}
    </div>
    <button type="button" class="dio-lamp" aria-label="Toggle architect lamp" aria-pressed="true">
      <span class="dio-lamp-glow"></span>
      <svg viewBox="0 0 56 88" class="dio-lamp-svg" aria-hidden="true">
        <ellipse cx="38" cy="82" rx="12" ry="3.5" fill="#1a1c28" stroke="#d4a657" stroke-width="1"/>
        <path d="M38 80 L34 44 L18 28" fill="none" stroke="#d4a657" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="34" cy="44" r="3" fill="#e6ba6c"/>
        <polygon points="10,22 26,22 29,34 7,34" fill="#1b2347" stroke="#d4a657" stroke-width="1.3"/>
        <ellipse cx="18" cy="34" rx="8" ry="2.5" fill="#ffdf9e" class="dio-bulb"/>
      </svg>
    </button>
    <div class="dio-velvet"></div>
    <div class="dio-credenza"></div>
  </div>
`;

const bellBtns = Array.from(dioramaEl.querySelectorAll('.dio-bell'));
const dioLamp = dioramaEl.querySelector('.dio-lamp');

nav.innerHTML = '';
const tags = RESULTS.map((r) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'tag';
  b.dataset.id = r.id;
  b.innerHTML = `<span class="tag-no">${r.no}</span><span class="tag-title">${r.tag}</span><span class="tag-status">${r.tagStatus}</span>`;
  b.addEventListener('click', () => show(r.id, b), { signal });
  nav.append(b);
  return b;
});

function syncActive(id) {
  tags.forEach((t) => t.classList.toggle('is-mobile-active', t.dataset.id === id));
  bellBtns.forEach((b) => b.classList.toggle('is-lifted', b.dataset.id === id));
}

function show(id, from) {
  const r = byId[id];
  if (!r) return;
  openId = id;
  openerEl = from || tags.find((t) => t.dataset.id === id);
  syncActive(id);
  body.innerHTML = `<p class="no">${r.no}</p><h2 id="drawer-title" tabindex="-1">${r.title}</h2><p class="status">${r.status}</p><p class="drawer-lead">${r.lead}</p>${r.body}`;
  if (r.lab) body.querySelector('.lab-slot').replaceWith(lab);
  drawer.hidden = false;
  root.classList.add('is-open');
  drawer.scrollTop = 0;
  requestAnimationFrame(() => {
    const h = document.getElementById('drawer-title');
    if (h) h.focus({ preventScroll: true });
  });
}

function hide() {
  if (!openId) return;
  openId = null;
  drawer.hidden = true;
  root.classList.remove('is-open');
  syncActive(null);
  if (openerEl) openerEl.focus({ preventScroll: true });
}

function toggleLamp() {
  lampOn = !lampOn;
  dioramaEl.classList.toggle('is-lamp-off', !lampOn);
  if (lampBtn) {
    lampBtn.setAttribute('aria-pressed', String(lampOn));
    lampBtn.textContent = lampOn ? 'Lamp on' : 'Lamp off';
  }
  if (dioLamp) dioLamp.setAttribute('aria-pressed', String(lampOn));
  showToast(lampOn ? 'Architect lamp on' : 'Architect lamp off');
}

function setPlain(on) {
  root.classList.toggle('plain-mode', on);
  plainBtn.setAttribute('aria-pressed', String(on));
  if (on) {
    hide();
    document.getElementById('plain').focus({ preventScroll: true });
  } else {
    plainBtn.focus({ preventScroll: true });
  }
}

async function enter3D() {
  if (loading3d) return;
  loading3d = true;
  if (btn3d) {
    btn3d.disabled = true;
    btn3d.textContent = 'Loading 3D…';
  }
  showToast('Loading 3D studio…');
  try {
    ac.abort();
    hide();
    await import('./scene.js');
  } catch (err) {
    loading3d = false;
    if (btn3d) {
      btn3d.disabled = false;
      btn3d.textContent = '3D studio';
    }
    showToast('3D studio unavailable');
  }
}

bellBtns.forEach((b) => b.addEventListener('click', () => show(b.dataset.id, b), { signal }));
if (dioLamp) dioLamp.addEventListener('click', toggleLamp, { signal });
if (lampBtn) lampBtn.addEventListener('click', toggleLamp, { signal });
closeBtn.addEventListener('click', hide, { signal });
plainBtn.addEventListener('click', () => setPlain(!root.classList.contains('plain-mode')), { signal });
plainBack.addEventListener('click', () => setPlain(false), { signal });
if (btn3d) {
  btn3d.hidden = false;
  btn3d.addEventListener('click', enter3D, { signal });
}

body.addEventListener('click', (e) => {
  const item = e.target.closest('.kl-item');
  if (!item || openId !== 'azerty') return;
  const glyph = item.querySelector('strong')?.textContent || '';
  const combo = item.textContent.replace(glyph, '').trim();
  showToast(`${glyph} · ${combo}`);
}, { signal });

addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea')) return;
  if (e.key === 'Escape') {
    if (root.classList.contains('plain-mode')) setPlain(false);
    else hide();
  }
}, { signal });

const wideMq = matchMedia('(min-width: 901px)');
wideMq.addEventListener('change', (e) => {
  if (e.matches && !window.__sceneReady) enter3D();
}, { signal });

window.__dioramaReady = true;
