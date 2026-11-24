export function makeSafetyLab(safetyObj = null) {
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
    if (safetyObj?.setArmBars) safetyObj.setArmBars(a.rows);
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
