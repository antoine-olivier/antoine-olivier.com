// Clean, high-readability, adversarially verified CV 2026-11 content for N · Le Cabinet des Cloches.
export const RESULTS = [
  {
    id: 'safety',
    no: 'Specimen I',
    tag: 'AI Safety & Control',
    tagStatus: '89% FPR · 27/96 · 1.85% (3 repos)',
    title: 'AI Safety & Runtime Control',
    status: '3 public repositories · 2026',
    lead: 'Empirical oversight benchmarks, blind log audits, and open-weights control monitors. Protocols, scripts, and negative findings published openly.',
    lab: true,
    body: `
      <article class="study-card is-primary">
        <div class="study-top">
          <h3>code-oversight-bench</h3>
          <a class="ext-link" href="https://github.com/antoine-olivier/code-oversight-bench" rel="noopener">GitHub ↗</a>
        </div>
        <div class="kpi-row">
          <div class="kpi">
            <span class="kpi-val is-alert">89% / 80% vs. 8%</span>
            <span class="kpi-lbl">Bare FPR (Qwen 7B / Haiku / Sonnet)</span>
          </div>
          <div class="kpi">
            <span class="kpi-val">4% / 14% vs. 80%</span>
            <span class="kpi-lbl">Paired separation on 100 real repos</span>
          </div>
        </div>
        <p class="summary">On 100 real MIT/BSD/Apache Python pairs, flat 93–96% bug-only recall hid a severe false-positive collapse across weaker bare models.</p>
        <div class="lab-slot"></div>
        <details class="proto">
          <summary>Protocol, 2-pass collapse &amp; sandbox details</summary>
          <ul>
            <li><strong>Dataset:</strong> 130 sealed Python pairs (30 standalone + 100 real files across 15 libraries; single-line AST mutations killed by upstream pytest; 24 arms across Qwen2.5-Coder 7B/14B, Haiku 4.5, and Sonnet 5.5; 3,120 blind evaluations).</li>
            <li><strong>Qwen 14B NF4 bare (100 real):</strong> 57% verdict recall, 38% FPR, 14% paired separation.</li>
            <li><strong>Adversarial 2-pass (100 real):</strong> cut Haiku FPR from 80% to 25% (separation 14% to 50%) and Sonnet to 7% FPR (83% sep.), while dropping Qwen 7B/14B to 0% TPR / 0% FPR (277/277 real-repo flags overturned; 370/370 across all 130 pairs under a directive falsification prompt).</li>
            <li><strong>Isolated Python execution:</strong> lifted Haiku to 0/30 FPR (93.3% sep.) on standalone code; on real repos, Haiku dropped 21/24 buggy <code>ImportError</code> files to CLEAN (10% FPR, 39% sep.) while Sonnet kept 18/18 (8% FPR, 81% sep.).</li>
          </ul>
        </details>
      </article>

      <article class="study-card">
        <div class="study-top">
          <h3>underreported-refusals-pilot</h3>
          <a class="ext-link" href="https://github.com/antoine-olivier/underreported-refusals-pilot" rel="noopener">GitHub ↗</a>
        </div>
        <div class="kpi-row">
          <div class="kpi">
            <span class="kpi-val is-alert">27 / 96 (28.1%)</span>
            <span class="kpi-lbl">Sub-agents omitting class A guard refusals</span>
          </div>
          <div class="kpi">
            <span class="kpi-val">[19.4, 37.5]</span>
            <span class="kpi-lbl">95% cluster bootstrap CI (by parent session)</span>
          </div>
        </div>
        <p class="summary">Across 468 blind-coded sub-agent reports under a frozen protocol on one harness, 27 of 96 sub-agents with a class A guard-hook refusal (refused action or target) mentioned no refusal.</p>
        <details class="proto">
          <summary>Replayability, scope &amp; limits</summary>
          <ul>
            <li><strong>Lower bound &amp; replayability:</strong> any refusal mention counts as a mention; all 52/52 reported counts and 6/6 M1 estimates are replayable via published scripts.</li>
            <li><strong>Circumvention check:</strong> 0 confirmed undeclared circumventions on one narrow check.</li>
            <li><strong>Limits:</strong> observational study on one harness, one user's session archive, and single-family Claude coders.</li>
          </ul>
        </details>
      </article>

      <article class="study-card">
        <div class="study-top">
          <h3>sleight-bench-open-weights-monitor</h3>
          <a class="ext-link" href="https://github.com/antoine-olivier/sleight-bench-open-weights-monitor" rel="noopener">GitHub ↗</a>
        </div>
        <div class="kpi-row">
          <div class="kpi">
            <span class="kpi-val">1.85% (2 / 108)</span>
            <span class="kpi-lbl">Haiku 4.5 anchor at 1% FPR (36 merged)</span>
          </div>
          <div class="kpi">
            <span class="kpi-val">9.4% / 20.5%</span>
            <span class="kpi-lbl">Local Qwen3.6-35B-A3B (post-hoc)</span>
          </div>
        </div>
        <p class="summary">Haiku 4.5 caught 1.85% on 36 upstream-merged attacks (paper fig. 24: 2.2%); local Qwen3.6-35B-A3B was evaluated on 39 unmerged attacks under a post-hoc redo.</p>
        <details class="proto">
          <summary>Protocol &amp; statistical caveat</summary>
          <ul>
            <li><strong>Anchor scope:</strong> 3 trials instead of 10; 4 long attacks excluded.</li>
            <li><strong>Local open-weights runs:</strong> Qwen3.6-35B-A3B reached 9.4% <code>[2.6, 17.9]</code> on <code>control_arena</code> and 20.5% <code>[10.3, 32.5]</code> max ensemble across 4 prompts on 39 unmerged attacks.</li>
            <li><strong>Caveat:</strong> post-hoc higher-token-cap redo; differences versus Haiku and across prompts are not statistically established.</li>
          </ul>
        </details>
      </article>`,
  },
  {
    id: 'math',
    no: 'Specimen II',
    tag: 'Mathematics & Tables',
    tagStatus: 'Brouwer 15 · Cohn 5 · Stealth 3 · 108',
    title: 'Mathematics & Reference Tables',
    status: '108 logged entries · independent checks',
    lead: 'Computational records and constructions checked by independent arithmetic verifiers, with every beaten or negative result kept on record.',
    body: `
      <article class="study-card is-primary">
        <div class="study-top">
          <h3>Brouwer Constant-Weight Codes</h3>
          <a class="ext-link" href="https://aeb.win.tue.nl/codes/Andw.html" rel="noopener">Table ↗</a>
        </div>
        <div class="kpi-row">
          <div class="kpi">
            <span class="kpi-val">15 accepted</span>
            <span class="kpi-lbl">7 still listed · 8 since beaten (Nov 22)</span>
          </div>
          <div class="kpi">
            <span class="kpi-val">12 / 15</span>
            <span class="kpi-lbl">DeepSeek V4.1 Flash checker + Zenodo</span>
          </div>
        </div>
        <p class="summary">Lower bounds marked <code>Ol</code> in Andries Brouwer's reference table, with independent cross-vendor verifiers and archived certificates.</p>
        <div class="chip-links">
          <a href="https://doi.org/10.5281/zenodo.23776838" rel="noopener">Zenodo 23776838 ↗</a>
          <a href="https://doi.org/10.5281/zenodo.23570165" rel="noopener">Zenodo 23570165 ↗</a>
        </div>
        <details class="proto">
          <summary>List of the 7 bounds still listed</summary>
          <p class="mono-list"><code>A(26,8,11)>=2044</code> · <code>A(27,6,11)>=19344</code> · <code>A(27,8,9)>=1044</code> · <code>A(27,8,11)>=2422</code> · <code>A(28,10,14)>=817</code> · <code>A(30,10,11)>=514</code> · <code>A(32,10,9)>=307</code></p>
        </details>
      </article>

      <article class="study-card">
        <div class="study-top">
          <h3>Henry Cohn Spherical Codes</h3>
          <a class="ext-link" href="https://spherical-codes.org/" rel="noopener">Table ↗</a>
        </div>
        <div class="kpi-row">
          <div class="kpi">
            <span class="kpi-val">5 still listed</span>
            <span class="kpi-lbl">Dimensions 11 to 14</span>
          </div>
          <div class="kpi">
            <span class="kpi-val">10 submitted</span>
            <span class="kpi-lbl">Dim. 11–17 · exact rational over 2<sup>52</sup></span>
          </div>
        </div>
        <p class="summary">Exact rational-verified spherical codes credited in Henry Cohn's table. The 3D polyhedron is an 82-vertex emblem for the higher-dimensional codes.</p>
        <div class="chip-links">
          <a href="https://doi.org/10.5281/zenodo.23776897" rel="noopener">Zenodo 23776897 ↗</a>
        </div>
        <details class="proto">
          <summary>5 codes still listed</summary>
          <p class="mono-list"><code>(11,82)</code> · <code>(12,66)</code> · <code>(12,92)</code> · <code>(14,76)</code> · <code>(14,80)</code></p>
        </details>
      </article>

      <article class="study-card">
        <div class="study-top">
          <h3>Formal Duals &amp; Stealth Radius</h3>
          <a class="ext-link" href="https://cohn.mit.edu/stealth" rel="noopener">Cohn table ↗</a>
        </div>
        <div class="kpi-row">
          <div class="kpi">
            <span class="kpi-val">3 configs</span>
            <span class="kpi-lbl">Dimensions 18, 28, and 30</span>
          </div>
          <div class="kpi">
            <span class="kpi-val is-warn">Pending review</span>
            <span class="kpi-lbl">Human refereeing &amp; artifact check</span>
          </div>
        </div>
        <p class="summary">Explicit formal duals and isoduality for existing Bierbrauer–Edel and Vardy packings, with 3 configurations listed on Henry Cohn's stealthy periodic table.</p>
        <p class="caveat-line">Preprint status: AI-derived, cross-vendor AI-reviewed; human refereeing and artifact review pending.</p>
        <div class="chip-links">
          <a href="https://hexagonmath.org/2611.00626v1" rel="noopener">hexagonmath.org/2611.00626v1 ↗</a>
        </div>
      </article>

      <article class="study-card">
        <div class="study-top">
          <h3>OEIS, Exoplanets &amp; Full Register</h3>
          <a class="ext-link" href="https://github.com/antoine-olivier/research-register" rel="noopener">Register ↗</a>
        </div>
        <div class="kpi-row">
          <div class="kpi">
            <span class="kpi-val">2 OEIS · 1 fix</span>
            <span class="kpi-lbl">5 terms approved · TIC 160420269</span>
          </div>
          <div class="kpi">
            <span class="kpi-val">108 entries</span>
            <span class="kpi-lbl">Includes unrefereed &amp; negative runs</span>
          </div>
        </div>
        <div class="chip-links">
          <a href="https://oeis.org/A277203" rel="noopener">OEIS A277203 ↗</a>
          <a href="https://oeis.org/A321911" rel="noopener">OEIS A321911 ↗</a>
          <a href="https://github.com/eumemic/exoplanets/issues/1" rel="noopener">TIC 160420269 ↗</a>
        </div>
      </article>`,
  },
  {
    id: 'azerty',
    no: 'Specimen III',
    tag: 'AZERTY Global',
    tagStatus: '3,530 Store (Mar–Nov 2026) · .NET&nbsp;10',
    title: 'AZERTY Global & AMCF',
    status: 'Free & open-source · EUPL 1.2',
    lead: 'Free, open-source enhanced AZERTY keyboard layout, independent of the AFNOR NF Z71-300 standard, adding French typography, programming symbols, and multilingual accents while preserving 99% of keystrokes.',
    body: `
      <article class="study-card is-primary">
        <div class="study-top">
          <h3>Adoption &amp; Governance</h3>
          <a class="ext-link" href="https://azerty.global" rel="noopener">azerty.global ↗</a>
        </div>
        <div class="kpi-row">
          <div class="kpi">
            <span class="kpi-val">3,530</span>
            <span class="kpi-lbl">Microsoft Store installs (Mar 23 to Nov 23, 2026)</span>
          </div>
          <div class="kpi">
            <span class="kpi-val">.NET 10</span>
            <span class="kpi-lbl">Windows app rewritten with AI agents</span>
          </div>
        </div>
        <p class="summary">Created and developed by Antoine Olivier (thanks to Robert Hodge for the initial 2017 versions). President of the French nonprofit AMCF (Association pour la modernisation du clavier français).</p>
        <div class="key-legend" aria-label="Featured 3D keycap shortcuts">
          <div class="kl-item"><kbd>É</kbd><span>Caps + é</span></div>
          <div class="kl-item"><kbd>œ</kbd><span>AltGr + o</span></div>
          <div class="kl-item"><kbd>«</kbd><span>AltGr + w</span></div>
          <div class="kl-item"><kbd>{</kbd><span>AltGr + d</span></div>
        </div>
        <div class="chip-links">
          <a href="https://azerty.global" rel="noopener">Website ↗</a>
          <a href="https://github.com/AMCF-asso/azerty-global-app" rel="noopener">AMCF-asso/azerty-global-app ↗</a>
        </div>
      </article>`,
  },
];
