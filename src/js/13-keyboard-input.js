/* ───────────── keyboard input ───────────── */
// Egy bemeneti rendszer, három réteggel / one input system with three layers:
//  1. billentyű a vezérlőkön / keys on the controls: param(..., {keys: "q a"}), toggle(..., {key: "s"}), choice(..., {key: "c"}), button(..., {key: "Enter"})
//  2. a jelenet kódjában / in the scene code: key("ArrowLeft") igaz, amíg nyomva van / true while held; onKey(" ", fn) lenyomásonként egyszer / once per press.
//     Érintős eszközön ezekhez gombok jelennek meg a vásznon / on touch devices these get buttons on the canvas.
//  3. kód nélkül, minden jelenetnél / no code, every scene: 1–9 kiválaszt egy csúszkát, a nyilak állítják / 1–9 picks a slider, the arrows move it; Esc / 0 = kész / done.
// Ha a jelenet lefoglal egy billentyűt (Szóköz, R, →), a jelenet nyer; a lejátszás tartalék billentyűje: P
// If the scene binds a key (Space, R, →), the scene wins; backup key for play / pause: P
const keysDown = new Set();          // most lenyomott billentyűk (egységes névvel) / keys held now (normalised names)
const kbHolds = new Set();           // nyomva tartott csúszkabillentyűk / held slider keys: {k, id, dir, acc, t0, nav}
let kbShift = false, kbSel = null, kbSelAt = 0;
const KEY_NAMES = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'Tab', 'Backspace', 'Delete', 'Insert',
  'Home', 'End', 'PageUp', 'PageDown', 'Shift', 'Control', 'Alt'];
const KEY_ALIAS = {space: ' ', spacebar: ' ', left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown',
  '←': 'ArrowLeft', '→': 'ArrowRight', '↑': 'ArrowUp', '↓': 'ArrowDown', esc: 'Escape', del: 'Delete', return: 'Enter', ctrl: 'Control'};
const keyNameMap = new Map(KEY_NAMES.map(k => [k.toLowerCase(), k]));
const normCache = new Map();
// Billentyűnév egységesítése: betű kisbetűvel, "Space" → " ", "left" → "ArrowLeft" / normalise a key name
function normKey(k) {
  if (k == null) return '';
  k = String(k);
  let r = normCache.get(k);
  if (r !== undefined) return r;
  if (k.length === 1) r = k.toLowerCase();
  else {
    const l = k.trim().toLowerCase();
    r = KEY_ALIAS[l] ?? keyNameMap.get(l) ?? (/^f\d{1,2}$/.test(l) ? 'F' + l.slice(1) : l.length === 1 ? l : k.trim());
  }
  normCache.set(k, r);
  return r;
}
// A lenyomott billentyű neve; Shift-tel a számsor is számot ad / name of the pressed key; with Shift the digit row still gives digits
function evKey(e) {
  let k = e.key;
  if (!k || k === 'Unidentified' || k === 'Dead') k = e.code || '';
  if (e.shiftKey && /^(Digit|Numpad)\d$/.test(e.code || '')) k = e.code.slice(-1);
  return normKey(k);
}
// "q a" → ["q", "a"]; " " → szóköz / Space; tömb is jó / an array works too
function parseKeys(x) {
  if (x == null || x === '') return [];
  if (Array.isArray(x)) return x.map(normKey).filter(k => k !== '');
  x = String(x);
  if (x.trim() === '') return [' '];
  return x.trim().split(/\s+/).map(normKey);
}
// Beállítás-objektum (nem kétnyelvű felirat) / an options object (not a two-language label)
function isOptObj(a) { return !!a && typeof a === 'object' && !Array.isArray(a) && !('hu' in a) && !('en' in a); }
function keyText(k) {
  return {' ': T('kSpace'), ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓', Escape: 'Esc'}[k] ?? (k.length === 1 ? k.toUpperCase() : k);
}
function kbdBadges(keys) {
  if (!keys || !keys.length) return '';
  return ' <span class="kbds">' + keys.map(k => `<kbd>${esc(keyText(k))}</kbd>`).join('') + '</span>';
}
// Vezérlők billentyűi: billentyű → [{idx, dir}] / keys of the controls: key → [{idx, dir}]
function buildCtlKeys() {
  const m = new Map();
  R.defs.forEach((d, idx) => (d.keys || []).forEach((k, j) => {
    if (d.kind === 'range' && j > 1) return;
    if (!m.has(k)) m.set(k, []);
    m.get(k).push({idx, dir: j === 1 ? -1 : 1});     // csúszka: első = fel, második = le / slider: first = up, second = down
  }));
  return m;
}
function sceneOwns(k) { return R.ctlKeys.has(k) || R.keyOn.has(k) || R.keyPoll.has(k); }
function rangeDefs() { return R.defs.filter(d => d.kind === 'range'); }
function snapRange(d, v) {
  const s = d.step;
  return clamp(roundStep(d.min + Math.round((v - d.min) / s) * s, s), d.min, d.max);
}
function setRange(d, v) {
  v = snapRange(d, v);
  if (v !== R.P[d.id]) { setP(d.id, v); syncControls(); }
}
function flashCtl(el) {
  if (!el) return;
  el.classList.remove('kbhit'); void el.offsetWidth; el.classList.add('kbhit');
}
// Lenyomás: billentyűzetről vagy érintőgombról / a press, from the keyboard or a touch button
function pressKey(k, shift) {
  if (keysDown.has(k)) return;
  keysDown.add(k);
  if (R.error) return;
  const now = performance.now();
  for (const b of R.ctlKeys.get(k) || []) {
    const d = R.defs[b.idx];
    if (!d) continue;
    const el = ctlEls[d.kind === 'button' ? '\u0000b' + b.idx : d.id];
    flashCtl(el && (el.row || el.b));
    if (d.kind === 'range') {
      // egy koppintás = egy lépés (Shift: 10), nyomva tartva folyamatosan / a tap = one step (Shift: 10), holding = smooth
      setRange(d, R.P[d.id] + b.dir * d.step * (shift ? 10 : 1));
      kbHolds.add({k, id: d.id, dir: b.dir, acc: R.P[d.id], t0: now});
    } else if (d.kind === 'toggle') { setP(d.id, !R.P[d.id]); syncControls(); }
    else if (d.kind === 'choice') {
      const o = d.options, i = o.findIndex(x => x[0] === R.P[d.id]);
      if (o.length) { setP(d.id, o[((i + b.dir * (shift ? -1 : 1)) % o.length + o.length) % o.length][0]); syncControls(); }
    } else if (d.kind === 'button' && d.fn) safeCall(d.fn);
  }
  for (const fn of R.keyOn.get(k) || []) safeCall(() => fn(k));
}
function releaseKey(k) {
  keysDown.delete(k);
  for (const h of kbHolds) if (h.k === k) kbHolds.delete(h);
}
function releaseAll() {
  keysDown.clear(); kbHolds.clear();
  for (const b of document.querySelectorAll('.kb-key.down')) b.classList.remove('down');
}
// 3. réteg: csúszka kiválasztása 1–9-cel / layer 3: pick a slider with 1–9
function kbSelect(id) {
  kbSel = id || null; kbSelAt = performance.now();
  for (const e of Object.values(ctlEls)) if (e.kind === 'range' && e.row) e.row.classList.toggle('kbsel', e.row.dataset.id === kbSel);
  const e = kbSel && ctlEls[kbSel];
  if (e && e.row && !$('#tab-controls').hidden) e.row.scrollIntoView({block: 'nearest'});
  renderHud();
}
function pressNav(k, shift) {
  const d = rangeDefs().find(x => x.id === kbSel);
  if (!d) { kbSelect(null); return; }
  keysDown.add(k);
  const dir = (k === 'ArrowRight' || k === 'ArrowUp') ? 1 : -1;
  setRange(d, R.P[d.id] + dir * d.step * (shift ? 10 : 1));
  kbHolds.add({k, id: d.id, dir, acc: R.P[d.id], t0: performance.now(), nav: true});
  kbSelAt = performance.now();
  flashCtl(ctlEls[d.id] && ctlEls[d.id].row);
}
// Minden képkockán: nyomva tartott billentyűk, kijelzés, érintőgombok / every frame: held keys, display, touch buttons
function kbTick(real) {
  if (kbHolds.size) {
    const now = performance.now();
    for (const h of kbHolds) {
      if (!keysDown.has(h.k)) { kbHolds.delete(h); continue; }
      if (now - h.t0 < 300) continue;
      const d = rangeDefs().find(x => x.id === h.id);
      if (!d) { kbHolds.delete(h); continue; }
      // alapból 10 s alatt fut végig a teljes tartományon, Shift-tel 10× gyorsabban / the whole range in 10 s, 10× faster with Shift
      h.acc = clamp(h.acc + h.dir * (d.rate || (d.max - d.min) / 10) * real * (kbShift ? 10 : 1), d.min, d.max);
      setRange(d, h.acc);
      if (h.nav) kbSelAt = now;
    }
  }
  if (kbSel) renderHud();
  updatePad();
  updateKbList();
}
function renderHud() {
  const el = $('#kbHud');
  const d = kbSel && rangeDefs().find(x => x.id === kbSel);
  if (!d) {
    if (kbSel) kbSel = null;
    if (!el.hidden) el.hidden = true;
    return;
  }
  const n = rangeDefs().indexOf(d) + 1, v = R.P[d.id];
  const s = `${n} · ${tr(d.label)}: ${typeof v === 'number' ? fmt(v, Math.min(6, stepDecimals(d.step))) : v}${d.unit ? ' ' + d.unit : ''}`;
  const h = T('kbHudHint');
  if (el._s !== s) { el.firstChild.textContent = s; el._s = s; }
  if (el._h !== h) { el.lastChild.textContent = h; el._h = h; }
  el.classList.toggle('idle', performance.now() - kbSelAt > 2500);
  if (el.hidden) el.hidden = false;
}
// Érintőgombok a key() / onKey() billentyűihez, csak érintős eszközön / touch buttons for the key() / onKey() keys, touch devices only
const mqCoarse = matchMedia('(pointer: coarse)');
let padSig = null;
function updatePad() {
  const pad = $('#kbPad');
  const keys = (mqCoarse.matches && !R.error) ? [...new Set([...R.keyPoll, ...R.keyOn.keys()])] : [];
  const sig = LANG + '|' + keys.map(k => k + '\u0001' + tr(R.keyLabel.get(k) ?? '')).join('\u0002');
  if (sig === padSig) return;
  padSig = sig;
  for (const b of pad.querySelectorAll('.kb-key.down')) releaseKey(b.dataset.key);
  pad.innerHTML = '';
  pad.hidden = !keys.length;
  if (!keys.length) return;
  const mk = k => {
    const b = document.createElement('button'), lb = R.keyLabel.get(k);
    b.type = 'button'; b.className = 'kb-key'; b.dataset.key = k;
    b.textContent = lb != null ? tr(lb) : keyText(k);
    b.title = keyText(k);
    if (/^Arrow/.test(k)) b.classList.add('kb-' + k.slice(5).toLowerCase());
    return b;
  };
  const arrows = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].filter(k => keys.includes(k));
  const rest = keys.filter(k => !arrows.includes(k));
  if (arrows.length) { const g = document.createElement('div'); g.className = 'kb-dpad'; arrows.forEach(k => g.appendChild(mk(k))); pad.appendChild(g); }
  if (rest.length) { const g = document.createElement('div'); g.className = 'kb-btns'; rest.forEach(k => g.appendChild(mk(k))); pad.appendChild(g); }
}
(() => {
  const pad = $('#kbPad');
  pad.addEventListener('pointerdown', e => {
    const b = e.target.closest('.kb-key'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    try { b.setPointerCapture(e.pointerId); } catch (err) { /* old browser */ }
    b.classList.add('down'); pressKey(b.dataset.key, false);
  });
  const up = e => {
    const b = e.target.closest && e.target.closest('.kb-key');
    if (!b || !b.classList.contains('down')) return;
    b.classList.remove('down'); releaseKey(b.dataset.key);
  };
  for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) pad.addEventListener(ev, up);
  pad.addEventListener('contextmenu', e => e.preventDefault());
})();

// Billentyűparancsok listája: a Vezérlők fülön összecsukható sor, a vásznon ⌨ gomb (vagy ?) – nem foglal helyet, amíg nincs megnyitva
// List of keyboard commands: a collapsible line on the Controls tab, a ⌨ button on the canvas (or ?) – takes no room until opened
let kbListOpen = false, kbListSig = '';
function kbRows() {
  const scene = [], app = [], covered = new Set();
  R.defs.forEach(d => {
    if (!d.keys || !d.keys.length) return;
    const ks = d.kind === 'range' ? d.keys.slice(0, 2) : d.keys;
    ks.forEach(k => covered.add(k));
    const l = tr(d.label);
    scene.push([ks.map(keyText), d.kind === 'range' ? `${l}: ${ks.length > 1 ? '+ / −' : '+'}` :
      d.kind === 'toggle' ? `${l}: ${T('kbOnOff')}` : d.kind === 'choice' ? `${l}: ${T('kbNext')}` : l]);
  });
  // key() és onKey(): az azonos leírású billentyűk egy sorba kerülnek / keys with the same text share a row
  const byText = new Map();
  for (const k of [...R.keyOn.keys(), ...R.keyPoll]) {
    if (covered.has(k)) continue;
    covered.add(k);
    const h = R.keyHelp.get(k) ?? R.keyLabel.get(k);
    const txt = h != null ? tr(h) : T('kbScene');
    if (!byText.has(txt)) byText.set(txt, []);
    byText.get(txt).push(keyText(k));
  }
  for (const [txt, ks] of byText) scene.push([ks, txt]);
  app.push([sceneOwns(' ') ? ['P'] : [T('kSpace'), 'P'], T('kbPlay')]);
  if (!sceneOwns('r')) app.push([['R'], T('kbRestart')]);
  if (!sceneOwns('ArrowRight')) app.push([['→'], T('kbStep')]);
  if (rangeDefs().length) app.push([['1…' + Math.min(9, rangeDefs().length), '← →'], T('kbPick')]);
  if (!sceneOwns('?')) app.push([['?'], T('kbThis')]);
  return {scene, app};
}
function kbListHtml(rows) {
  const tbl = rs => '<table class="kbl">' + rs.map(([ks, txt]) => `<tr><td>${ks.map(k => `<kbd>${esc(k)}</kbd>`).join('')}</td><td>${esc(txt)}</td></tr>`).join('') + '</table>';
  return (rows.scene.length ? `<div class="kbl-h">${esc(T('kbSceneH'))}</div>` + tbl(rows.scene) : '') +
    `<div class="kbl-h">${esc(T('kbAppH'))}</div>` + tbl(rows.app);
}
function updateKbList() {
  const sig = [R.runId, LANG, R.keyPoll.size, R.keyOn.size, ctlSig, mqCoarse.matches, R.error ? 1 : 0].join('|');
  if (sig === kbListSig) return;
  kbListSig = sig;
  const rows = kbRows(), html = kbListHtml(rows), n = rows.scene.length;
  const det = $('#kbHelp');
  // Vezérlők fül: egy összecsukott sor; érintős eszközön csak akkor, ha a jelenetnek vannak billentyűi
  // Controls tab: one collapsed line; on touch devices only when the scene has keys
  det.hidden = !!R.error || (mqCoarse.matches && !n);
  det.querySelector('summary').textContent = '⌨ ' + T('kbList') + (n ? ` (${n})` : '');
  det.querySelector('div').innerHTML = html;
  // Vászon: ⌨ gomb, ha a jelenetnek vannak billentyűi (érintős eszközön ott vannak az érintőgombok)
  // Canvas: ⌨ button when the scene has keys (touch devices have the touch buttons instead)
  const btn = $('#kbHelpBtn'), show = !!n && !R.error && !mqCoarse.matches;
  btn.hidden = !show;
  $('#kbList').innerHTML = `<div class="kbl-title">${esc(T('kbList'))}</div>` + html;
  if (!show) setKbList(false);
}
function setKbList(open) {
  kbListOpen = !!open && !$('#kbHelpBtn').hidden;
  $('#kbList').hidden = !kbListOpen;
  $('#kbHelpBtn').setAttribute('aria-expanded', String(kbListOpen));
}
(() => {
  $('#kbHelpBtn').addEventListener('click', e => { e.stopPropagation(); setKbList(!kbListOpen); });
  document.addEventListener('pointerdown', e => {
    if (kbListOpen && !e.target.closest('#kbList, #kbHelpBtn')) setKbList(false);
  });
  const det = $('#kbHelp');
  det.open = store.get('kbHelpOpen') === '1';
  det.addEventListener('toggle', () => store.set('kbHelpOpen', det.open ? '1' : '0'));
})();

