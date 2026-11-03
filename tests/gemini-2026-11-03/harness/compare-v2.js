// Runs every Gemini and reference scene in AnimLab with the same slider values, reads the readouts, takes screenshots
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
// Run from anywhere: node tests/gemini-2026-11-03/harness/compare-v2.js  (needs Node and Playwright with Chromium)
const ROOT = path.join(__dirname, '..'), APP = 'file://' + path.resolve(__dirname, '../../../index.html');
const G = path.join(ROOT, 'v2/gemini-codes') + '/', F = path.join(ROOT, 'reference-codes') + '/', S = path.join(ROOT, 'v2/screenshots') + '/';
const cases = [
  {id: 'T1', name: 'Ohm v2', g: 'T1-ohm-gemini-v2.js', r: 'T1-ohm-reference.js', speed: 1, wait: 2500,
   pg: {U: 12, R: 6}, pr: {U: 12, R: 6}, extra: [{tag: 'U0', pg: {U: 0}, pr: {U: 0}}]},
  {id: 'T2', name: 'Transformer v2', g: 'T2-transformer-gemini-v2.js', r: 'T2-transformer-reference.js', speed: 0.002, wait: 6000,
   pg: {U1: 230, N1: 500, N2: 50, R: 10}, pr: {U1: 230, N1: 500, N2: 50, R: 10}},
  {id: 'T3', name: 'Projectile v2', g: 'T3-projectile-gemini-v2.js', r: 'T3-projectile-reference.js', speed: 1, wait: 3500,
   pg: {v0: 10, ang: 45}, pr: {v0: 10, ang: 45}, extra: [{tag: 'v20a30', pg: {v0: 20, ang: 30}, pr: {v0: 20, ang: 30}, wait: 4500}]},
  {id: 'T3b', name: 'Bouncing ball v2', g: 'T3b-bouncing-ball-gemini-v2.js', r: 'T3b-bouncing-ball-reference.js', speed: 1, wait: 4000,
   pg: {h0: 5, e: 0.8}, pr: {h0: 5, e: 0.8}},
  {id: 'T6', name: 'Rotor photo v2', g: 'T6-dcmotor-photo-gemini-v2.js', r: 'T6-dcmotor-photo-reference.js', speed: 1, wait: 2500, asset: true,
   pg: {n: 60}, pr: {n: 60}},
];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(APP); await p.waitForTimeout(600);
  // index of each control in R.defs order (param/toggle/choice/button calls at the top level)
  function ctlIndex(code) {
    const m = {}; let i = 0; const re = /^\s*(param|toggle|choice|button)\(\s*("([^"]+)")?/gm; let x;
    while ((x = re.exec(code))) { if (x[1] !== 'button') m[x[3]] = i; i++; }
    return m;
  }
  async function run(file, params, speed, wait, asset, shot) {
    const code = fs.readFileSync(file, 'utf8');
    await p.click('#btnNew'); await p.waitForTimeout(400);
    if (asset) { await p.click('.tabs button[data-tab="assets"]'); await p.setInputFiles('#imgIn', path.join(__dirname, 'rotor.png')); await p.waitForTimeout(500); }
    await p.click('.tabs button[data-tab="code"]');
    await p.fill('#code', code);
    await p.click('#btRun'); await p.waitForTimeout(500);
    const err0 = await p.$eval('#codeErr', e => e.hidden ? '' : e.textContent);
    await p.click('.tabs button[data-tab="controls"]');
    const idx = ctlIndex(code);
    for (const [k, v] of Object.entries(params)) {
      const i = idx[k]; if (i == null) { console.error('no control', k, file); continue; }
      const rr = await p.evaluate(({i, v}) => {
        const cb = document.querySelector('#ctl_' + i + '[type=checkbox]');
        if (cb) { cb.checked = v; cb.dispatchEvent(new Event('change')); return; }
        const nm = document.getElementById('ctl_' + i + '_n'); if (!nm) return 'missing ctl_' + i; nm.value = v; nm.dispatchEvent(new Event('change'));
      }, {i, v}); if (rr) console.error(rr, k, file);
      await p.waitForTimeout(150);
    }
    await p.evaluate(s => { const sp = document.getElementById('speed'); sp.value = Math.log2(s); sp.dispatchEvent(new Event('input')); }, speed);
    await p.waitForTimeout(wait);
    const ro = await p.$$eval('#readouts > *', r => r.map(x => x.innerText.replace(/\s+/g, ' ').trim()));
    if (shot) await p.locator('#stage').screenshot({ path: shot });
    return {err: err0, readouts: ro};
  }
  const out = {};
  for (const c of cases) {
    const o = out[c.id] = {name: c.name};
    o.gemini = await run(G + c.g, c.pg, c.speed, c.wait, c.asset, S + c.id + '-gemini.png');
    o.reference = await run(F + c.r, c.pr, c.speed, c.wait, c.asset, S + c.id + '-reference.png');
    for (const x of c.extra || []) {
      o['gemini_' + x.tag] = await run(G + c.g, x.pg, c.speed, x.wait || c.wait, c.asset, S + c.id + '-' + x.tag + '-gemini.png');
      o['reference_' + x.tag] = await run(F + c.r, x.pr, c.speed, x.wait || c.wait, c.asset, S + c.id + '-' + x.tag + '-reference.png');
    }
    if (c.broken) o.brokenInput = await run(G + c.broken, c.pg, c.speed, 800, false, null);
  }
  out.pageErrors = errs;
  fs.writeFileSync(path.join(ROOT, 'v2/results-v2.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
