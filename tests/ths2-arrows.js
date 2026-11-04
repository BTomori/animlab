// Toyota THS-II scene: power-arrow test. Run: node tests/ths2-arrows.js  (no browser needed)
// Runs the scene's update() and draw() with a stub API and checks, for every frame and every arrow path,
//  (1) arrowheads point the way the arrows move, (2) that way is the physical power direction,
//  (3) electric and mechanical sides of MG1/MG2 have the same sign.
const fs = require('fs');
const path = require('path');
const code = JSON.parse(fs.readFileSync(path.join(__dirname, '../examples/teacher/toyota-ths2-hajtaslanc.animlab.json'), 'utf8')).script;
function run(init, T, label) {
  const P = {}; let upd = null, drw = null, flows = [];
  const M = Math, noop = () => {};
  const api = {
    P, C: new Proxy({}, {get: () => '#000'}),
    stage: noop, title: noop, timeScale: noop, plotWindow: noop, button: noop, resetOn: noop, reset: noop,
    param(id, l, mn, mx, v) { P[id] = id in init ? init[id] : v; }, toggle(id, l, v) { P[id] = id in init ? init[id] : v; },
    choice(id, l, o, v) { P[id] = id in init ? init[id] : v; }, setParam(id, v) { P[id] = v; },
    update(f) { upd = f; }, draw(f) { drw = f; },
    rect: noop, circle: noop, line: noop, polyline: noop, polygon: noop, text: noop, show: noop, plot: noop, val: noop,
    flow(path, o) { flows.push({k: path[0].join(','), pos: o.pos, dir: o.dir}); },
    PI: M.PI, sin: M.sin, cos: M.cos, atan: M.atan, sqrt: M.sqrt, abs: M.abs, min: M.min, max: M.max, pow: M.pow,
    round: M.round, sign: M.sign, clamp: (v, a, b) => M.min(b, M.max(a, v)), lerp: (a, b, f) => a + (b - a) * f,
    mod: (a, n) => ((a % n) + n) % n, fmt: (v, d = 2) => (+v).toFixed(d), tr: l => typeof l === 'string' ? l : l.en, lang: () => 'en',
  };
  const names = Object.keys(api);
  new Function(...names, code + '\n;globalThis.__st = () => ({op, vv, we, teAct});')(...names.map(n => api[n]));
  const dt = 1 / 240; let prev = {}, prevDir = {}, frames = 0, bad = 0, flips = 0, seen = {}, flipT = {}; const msgs = [];
  for (let i = 0; i * dt <= T; i++) {
    upd(dt, i * dt);
    if (i % 4) continue;                       // a frame every 1/60 s
    flows = []; drw(i * dt); frames++;
    const s = __st(), o = s.op;
    const expect = {                           // physical direction along each path (first point → last point)
      '838,140': o.pb, '688,140': o.pe1, '735,208': o.pe2, '285,377': s.teAct * s.we,
      '622,212': o.p1, '745,373': -o.p2, '618,595': o.tRing * o.wr, '568,635': o.fDl * s.vv, '632,635': o.fDl * s.vv};
    const err = m => { bad++; if (msgs.length < 8) msgs.push(`${label} t=${(i * dt).toFixed(2)} mode=${o.mode}: ${m}`); };
    if (Math.abs(o.p1) > 60 && Math.sign(o.p1) !== Math.sign(o.pe1)) err('MG1 mech/elec sign differ');
    if (Math.abs(o.p2) > 60 && Math.sign(o.p2) !== Math.sign(o.pe2)) err('MG2 mech/elec sign differ');
    const now = {};
    for (const f of flows) {
      if (!(f.k in expect)) { err('unknown path ' + f.k); continue; }
      seen[f.k] = (seen[f.k] || 0) + 1;
      if (Math.sign(expect[f.k]) !== f.dir) err(`path ${f.k}: head ${f.dir} but power ${expect[f.k].toFixed(0)} W`);
      const p0 = prev[f.k], d0 = prevDir[f.k];
      if (d0 != null && d0 !== f.dir) {                 // power reversed since the last frame
        flips++; const ts = flipT[f.k] || (flipT[f.k] = []); ts.push(i * dt);
        while (ts.length && ts[0] < i * dt - 1) ts.shift();
        if (ts.length > 2) err(`path ${f.k}: flickers (${ts.length} reversals within 1 s)`);
      } else if (p0 != null && f.pos !== p0 && Math.sign(f.pos - p0) !== f.dir) err(`path ${f.k}: head ${f.dir} but moves ${Math.sign(f.pos - p0)}`);
      now[f.k] = f.pos; prevDir[f.k] = f.dir;
    }
    prev = now; for (const k in prevDir) if (!(k in now)) delete prevDir[k];
  }
  console.log(`${bad ? 'FAIL' : 'ok  '} ${label.padEnd(34)} frames=${frames} errors=${bad} reversals=${flips} paths seen=${Object.keys(seen).length}`);
  msgs.forEach(m => console.log('     ' + m));
  return bad;
}
let total = 0;
const cases = [
  ['demo cycle (all modes)', {}, 175],
  ['EV launch', {drv: 'man', acc: 18}, 15],
  ['full throttle 0→170', {drv: 'man', acc: 100}, 40],
  ['negative split 100 km/h held', {drv: 'man', vmode: 'hold', V: 100, acc: 15}, 8],
  ['negative split 140 km/h held', {drv: 'man', vmode: 'hold', V: 140, acc: 20}, 8],
  ['split 50 km/h held', {drv: 'man', vmode: 'hold', V: 50, acc: 35}, 8],
  ['split+charge low SOC 60 held', {drv: 'man', vmode: 'hold', V: 60, acc: 20, soc: 44}, 8],
  ['boost 60 km/h held', {drv: 'man', vmode: 'hold', V: 60, acc: 100}, 8],
  ['regen 40 km/h held', {drv: 'man', vmode: 'hold', V: 40, brk: 30}, 6],
  ['regen at 120 km/h, engine spun', {drv: 'man', vmode: 'hold', V: 120, brk: 30}, 6],
  ['coast 120 km/h (fuel cut)', {drv: 'man', vmode: 'hold', V: 120}, 6],
  ['SOC 90 % braking (no regen)', {drv: 'man', vmode: 'hold', V: 50, brk: 30, soc: 90}, 6],
  ['charge at standstill', {drv: 'man', brk: 40, soc: 42}, 10],
  ['reverse', {drv: 'man', gear: 'R', acc: 30}, 10],
  ['reverse with low SOC', {drv: 'man', gear: 'R', acc: 30, soc: 42}, 10],
  ['hill 15 %, no pedal (roll back)', {drv: 'man', grade: 15}, 6],
  ['hill start 15 %, 70 % pedal', {drv: 'man', grade: 15, acc: 70}, 10],
  ['downhill -10 %, coasting', {drv: 'man', grade: -10, V: 60}, 15],
  ['neutral, braking from 50', {drv: 'man', gear: 'N', V: 50, brk: 20}, 6],
];
for (const [l, init, T] of cases) total += run(init, T, l);
console.log(total ? `TOTAL ERRORS: ${total}` : 'ALL ARROW CHECKS PASSED');
