/* ───────────── expressions for markup: values published with val() ───────────── */
const EXPR_MATH = {sin: Math.sin, cos: Math.cos, tan: Math.tan, abs: Math.abs, min: Math.min, max: Math.max, sqrt: Math.sqrt,
  pow: Math.pow, exp: Math.exp, log: Math.log, sign: Math.sign, round: Math.round, floor: Math.floor, ceil: Math.ceil,
  hypot: Math.hypot, atan2: Math.atan2, PI: Math.PI, deg: d => d * Math.PI / 180, todeg: r => r * 180 / Math.PI, clamp};
const IDENT = /^[A-Za-z_$][\w$]*$/;
const exprCache = new Map();
function valKeys() { return Object.keys(R.vals).filter(k => IDENT.test(k) && !(k in EXPR_MATH) && k !== 'P' && k !== 't'); }
function evalExpr(src) {
  src = String(src ?? '').trim();
  if (!src) return {ok: true, v: 1};
  const keys = valKeys(), sig = src + '|' + keys.join(',');
  let fn = exprCache.get(sig);
  if (fn === undefined) {
    try { fn = compileScript(['P', 't', ...Object.keys(EXPR_MATH), ...keys], 'return (' + src + '\n);').fn; } catch (e) { fn = null; }
    if (exprCache.size > 500) exprCache.clear();
    exprCache.set(sig, fn);
  }
  if (!fn) return {ok: false, v: NaN};
  try { const v = +fn(R.P, R.t, ...Object.values(EXPR_MATH), ...keys.map(k => R.vals[k])); return {ok: isFinite(v), v}; }
  catch (e) { return {ok: false, v: NaN}; }
}
const PH_RE = /\{([^{}]+)\}/g;
function interp(str) {   // "e = {e:1} V" → "e = 7,2 V"
  return String(str ?? '').replace(PH_RE, (m, inner) => {
    const mm = /^(.*):(\d)$/.exec(inner), ex = mm ? mm[1] : inner, d = mm ? +mm[2] : undefined;
    const r = evalExpr(ex);
    return r.ok ? fmt(r.v, d) : '?';
  });
}
function interpCode(str) {   // the same label as JavaScript for "copy as code"
  const parts = []; let last = 0; String(str ?? '').replace(PH_RE, (m, inner, idx) => {
    if (idx > last) parts.push(JSON.stringify(str.slice(last, idx)));
    const mm = /^(.*):(\d)$/.exec(inner);
    parts.push(mm ? `fmt(${mm[1]}, ${mm[2]})` : `fmt(${inner})`);
    last = idx + m.length; return m;
  });
  if (last < String(str ?? '').length) parts.push(JSON.stringify(str.slice(last)));
  return parts.length ? parts.join(' + ') : '""';
}
const markRt = new Map();   // per-mark running state (flow offset), not saved

