/* ───────────── code-drawn marks: registry and user overrides (Markup tab) ───────────── */
let innerDraw = 0;     // > 0 while a composite helper draws its parts: those parts are not listed separately
let hlKey = null;      // the code mark being hovered in the Markup tab
const MARK_KINDS = ['arrow', 'vector', 'loop', 'flow', 'arrow3', 'flow3'];
function stableLabel(label) {
  const raw = label && typeof label === 'object' ? (label.en || label.hu || '') : String(label ?? '');
  return raw.replace(/[−+-]?\d+(?:[.,]\d+)?/g, '#').trim();
}
// Registers one drawn item and returns its override ({key, color, lw, scale, label, hidden}) or null
// Every code mark seen since the scene was loaded: the Markup list is built from this, so it stays
// steady even when an arrow is drawn only on some frames (e.g. only while its value is large enough)
const seenMarks = new Map();
function hexRgb(c) { const m = /^#([0-9a-f]{6})$/i.exec(String(c || '')); if (!m) return null; const n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function mixColor(c0, c1, f) {
  const a = hexRgb(c0), b = hexRgb(c1); if (!a || !b) return f < 0.5 ? c0 : c1;
  return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * f).toString(16).padStart(2, '0')).join('');
}
// Colour from a value: c0 at or below cmin, c1 at or above cmax, blended in between
function colorFor(m) {
  if (!m || !m.colorExpr || !String(m.colorExpr).trim()) return null;
  const r = evalExpr(m.colorExpr); if (!r.ok) return null;
  const lo = isFinite(+m.cmin) ? +m.cmin : 0, hi = isFinite(+m.cmax) ? +m.cmax : 1;
  const f = hi === lo ? (r.v >= hi ? 1 : 0) : clamp((r.v - lo) / (hi - lo), 0, 1);
  return mixColor(m.c0 || '#2f6fd6', m.c1 || '#d64045', f);
}
function exprMul(src) { if (!src || !String(src).trim()) return null; const r = evalExpr(src); return r.ok ? r.v : null; }
function regMark(kind, label, s) {
  if (!R || innerDraw > 0 || !R.reg) return null;
  let key;
  if (s && s.id != null) key = String(s.id);
  else {
    const base = kind + ':' + stableLabel(label);
    const n = (R.occ[base] = (R.occ[base] || 0) + 1);
    key = base + '#' + n;
  }
  const e = R.reg.get(key);
  if (e) e.count++;
  else R.reg.set(key, {kind, label: label == null ? '' : tr(label), count: 1, id: s && s.id != null});
  if (!seenMarks.has(key)) seenMarks.set(key, {kind, label: label == null ? '' : tr(label), id: s && s.id != null, max: 1});
  const ov = scene.overrides && scene.overrides[key];
  if (!ov) return {key};
  const o = {key, ...ov};
  const k1 = exprMul(ov.lenExpr); if (k1 != null) o.scale = (ov.scale ?? 1) * k1;            // hossz a változóból / length from the variable
  const k2 = exprMul(ov.lwExpr); if (k2 != null) o.lw = (ov.lw ?? 1) * Math.abs(k2);         // vastagság a változóból / width from the variable
  const c = colorFor(ov); if (c) o.color = c;                                                 // szín a változóból / colour from the variable
  return o;
}
function ovStyle(ov, s, colorKey = 'stroke') {
  const o = {...s};
  if (ov.color) o[colorKey] = ov.color;
  if (ov.lw != null && isFinite(ov.lw) && ov.lw !== 1) o.lw = (s.lw ?? 2) * ov.lw;
  return o;
}
function haloLine(x1, y1, x2, y2, w) {
  g.save(); g.strokeStyle = 'rgba(255, 196, 0, 0.55)'; g.lineWidth = w + 12; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.restore();
}

