/* ───────────── boundArrow: declared in code, shown and edited on the Markup tab ───────────── */
let hlBound = null, bSig = '';
const hexCv = document.createElement('canvas').getContext('2d');
function toHex(c) { if (hexRgb(c)) return c.toLowerCase(); try { hexCv.fillStyle = '#000000'; hexCv.fillStyle = String(c); return hexCv.fillStyle; } catch (e) { return '#000000'; } }
function numOf(src, def) {
  if (src == null || String(src).trim() === '') return def;
  if (typeof src === 'number') return src;
  const r = evalExpr(String(src)); return r.ok ? r.v : def;
}
function boundEval(d) {
  const L = numOf(d.length, 100), W = Math.abs(numOf(d.width, 3));
  let col = d.color || C.red;
  if (d.colorBy != null && String(d.colorBy).trim()) {
    const c = colorFor({colorExpr: d.colorBy, cmin: d.colorMin, cmax: d.colorMax, c0: toHex(d.color || C.blue), c1: toHex(d.colorTo || C.red)});
    if (c) col = c;
  }
  return {L, W, col};
}
function drawBound() {
  if (!R || !R.bound || !R.bound.size || !g) return;
  for (const d of R.bound.values()) {
    const now = boundEval(d); d._now = now;
    if (d.hidden) continue;
    const a = (+d.angle || 0) * Math.PI / 180, x = +d.x || 0, y = +d.y || 0, dx = now.L * Math.cos(a), dy = -now.L * Math.sin(a);
    if (hlBound === d.id) haloLine(x, y, x + dx, y + dy, now.W);
    if (Math.hypot(dx, dy) >= 1) D.vector(x, y, dx, dy, {stroke: now.col, lw: now.W, head: d.head}, d.label ? interp(d.label) : '');
  }
}

// --- a tiny reader for  name("id", { key: value, … })  calls, so single values can be rewritten in place ---
function skipStr(src, i) { const q = src[i]; i++; while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++; } return i + 1; }
function scanObject(src, start) {
  const props = {}; let i = start + 1, depth = 1, state = 'key', key = null, vs = -1, lastVe = start + 1;
  const endVal = pos => {
    if (key && !props[key]) { let e = vs >= 0 ? pos : pos; const b = vs >= 0 ? vs : pos; while (e > b && /\s/.test(src[e - 1])) e--; props[key] = {vs: b, ve: e}; lastVe = Math.max(lastVe, e); }
    key = null; state = 'after';
  };
  while (i < src.length) {
    const c = src[i], c2 = src[i + 1];
    if (c === '/' && c2 === '/') { if (state === 'val' && depth === 1) endVal(i); const j = src.indexOf('\n', i); i = j < 0 ? src.length : j; continue; }
    if (c === '/' && c2 === '*') { if (state === 'val' && depth === 1) endVal(i); const j = src.indexOf('*/', i + 2); i = j < 0 ? src.length : j + 2; continue; }
    if (c === '"' || c === "'" || c === '`') {
      const j = skipStr(src, i);
      if (depth === 1 && state === 'key') {
        let n = j; while (/\s/.test(src[n])) n++;
        if (src[n] === ':') { key = src.slice(i + 1, j - 1); state = 'val'; vs = -1; i = n + 1; continue; }
      } else if (state === 'val' && depth === 1 && vs < 0) vs = i;
      i = j; continue;
    }
    if (depth === 1 && state === 'key' && /[A-Za-z_$]/.test(c)) {
      let j = i; while (/[\w$]/.test(src[j])) j++;
      let n = j; while (/\s/.test(src[n])) n++;
      if (src[n] === ':') { key = src.slice(i, j); state = 'val'; vs = -1; i = n + 1; continue; }
      i = j; continue;
    }
    if ('{[('.includes(c)) { if (state === 'val' && depth === 1 && vs < 0) vs = i; depth++; i++; continue; }
    if ('}])'.includes(c)) { depth--; if (depth === 0) { if (state === 'val') endVal(i); return {start, end: i + 1, props, lastVe}; } i++; continue; }
    if (c === ',' && depth === 1) { if (state === 'val') endVal(i); state = 'key'; key = null; i++; continue; }
    if (state === 'val' && depth === 1 && vs < 0 && !/\s/.test(c)) vs = i;
    i++;
  }
  return null;
}
function findCall(src, fname, id) {
  const esc2 = String(id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = new RegExp(fname + '\\(\\s*(["\'`])' + esc2 + '\\1\\s*,\\s*').exec(src);
  if (!m) return null;
  const i = m.index + m[0].length;
  return src[i] === '{' ? scanObject(src, i) : null;
}
// Writes one property of a boundArrow(...) call back into the code (or adds it if missing)
function setCodeProp(fname, id, key, literal) {
  const ta = $('#code'), src = ta.value;
  const loc = findCall(src, fname, id);
  if (!loc) return false;
  const pr = loc.props[key];
  let out;
  if (pr) out = src.slice(0, pr.vs) + literal + src.slice(pr.ve);
  else {
    const first = Object.values(loc.props)[0];
    let indent = '  ';
    if (first) { const ls = src.lastIndexOf('\n', first.vs) + 1; indent = (src.slice(ls, first.vs).match(/^\s*/) || ['  '])[0] || '  '; }
    out = first ? src.slice(0, loc.lastVe) + ',\n' + indent + key + ': ' + literal + src.slice(loc.lastVe)
                : src.slice(0, loc.start + 1) + key + ': ' + literal + src.slice(loc.start + 1);
  }
  const wasClean = src === lastRunScript;
  ta.value = out; scene.script = out; if (wasClean) lastRunScript = out;
  updateGutter(); updateCodeState(); scheduleAutosave();
  return true;
}
const BOUND_FIELDS = [   // [key, kind, label key]
  ['x', 'num', 'bX'], ['y', 'num', 'bY'], ['angle', 'num', 'bAngle'],
  ['length', 'expr', 'bLength'], ['width', 'expr', 'bWidth'],
  ['color', 'color', 'bColor'], ['colorBy', 'expr', 'bColorBy'], ['colorMin', 'num', 'fCmin'], ['colorMax', 'num', 'fCmax'], ['colorTo', 'color', 'bColorTo'],
  ['label', 'text', 'fLabel'],
];
function boundNowHTML(d) {
  const n = d._now; if (!n) return '';
  return `${esc(T('bNow'))} ${esc(T('bLen'))} ${esc(fmt(n.L, 0))} px · ${esc(T('bWid'))} ${esc(fmt(n.W, 1))} px · <i style="background:${esc(n.col)}"></i> ${esc(toHex(n.col))}`;
}
function updateBoundNow() {
  for (const row of $$('#boundList .cm')) {
    const d = R.bound.get(row.dataset.id), el = $('.now', row);
    if (d && el) { const h = boundNowHTML(d); if (el._h !== h) { el.innerHTML = h; el._h = h; } }
  }
}
function renderBound(force) {
  const box = $('#boundList'); if (!box || !R) return;
  const list = [...R.bound.values()];
  const sig = LANG + '|' + list.map(d => d.id).join('|') + '|' + R.runId;
  if (!force && (sig === bSig || box.contains(document.activeElement) || hlBound)) { updateBoundNow(); return; }
  bSig = sig;
  $('#bCount').textContent = list.length;
  if (!list.length) { box.innerHTML = `<p class="muted bound-empty">${T('bEmpty')}</p>`; return; }
  box.innerHTML = '';
  for (const d of list) {
    const row = document.createElement('div'); row.className = 'cm'; row.dataset.id = d.id;
    const f = BOUND_FIELDS.map(([k, kind, lab]) => {
      const v = d[k];
      if (kind === 'num') return `<label>${esc(T(lab))}<input type="number" step="any" data-b="${k}" data-kind="num" value="${esc(v ?? 0)}"></label>`;
      if (kind === 'color') return `<label>${esc(T(lab))}<input type="color" data-b="${k}" data-kind="color" value="${esc(toHex(v || '#000000'))}"></label>`;
      const ph = k === 'colorBy' ? T('bColorByPh') : k === 'label' ? 'i = {i:1} A' : '';
      return `<label class="wide">${esc(T(lab))}<input data-b="${k}" data-kind="${kind}" value="${esc(v ?? '')}" placeholder="${esc(ph)}" spellcheck="false"></label>`;
    }).join('');
    row.innerHTML = `<div class="cm-h"><label><input type="checkbox" data-b="hidden" data-kind="bool" ${d.hidden ? '' : 'checked'}><b>${esc(d.id)}</b><span class="kind">boundArrow</span></label></div><p class="now">${boundNowHTML(d)}</p><div class="mark-f">${f}</div>`;
    row.addEventListener('mouseenter', () => { hlBound = d.id; row.classList.add('on'); });
    row.addEventListener('mouseleave', () => { if (hlBound === d.id) hlBound = null; row.classList.remove('on'); });
    row.addEventListener('input', ev => {
      const k = ev.target.dataset.b, kind = ev.target.dataset.kind; if (!k) return;
      const dd = R.bound.get(d.id) || d;
      let v, lit;
      if (kind === 'bool') { v = !ev.target.checked; lit = String(v); }
      else if (kind === 'num') { v = parseFloat(String(ev.target.value).replace(',', '.')); if (!isFinite(v)) return; lit = String(v); }
      else if (kind === 'color') { v = ev.target.value; lit = JSON.stringify(v); }
      else {
        const t = String(ev.target.value);
        v = /^\s*-?\d+(\.\d+)?\s*$/.test(t) ? +t : t; lit = typeof v === 'number' ? String(v) : JSON.stringify(v);
        if (kind === 'expr') ev.target.classList.toggle('bad', !!t.trim() && !evalExpr(t).ok);
      }
      dd[k] = v;                                                   // azonnal látszik / takes effect at once
      if (!setCodeProp('boundArrow', d.id, k, lit)) toast(T('bNoCode'));   // és a kódba is beíródik / and is written into the code
    });
    box.appendChild(row);
  }
}

