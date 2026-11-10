/* ───────────── helpers ───────────── */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
function niceStep(x) {
  if (!(x > 0)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(x))), m = x / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}
function stepDecimals(step) { const s = String(step); if (s.includes('e-')) return +s.split('e-')[1]; return (s.split('.')[1] || '').length; }
function roundStep(v, step) { return +(+v).toFixed(Math.min(6, stepDecimals(step))); }
function fmt(v, digits) {
  if (typeof v !== 'number') return String(v);
  if (!isFinite(v)) return isNaN(v) ? '—' : (v > 0 ? '∞' : '−∞');
  const a = Math.abs(v);
  const d = digits != null ? digits : (a >= 1000 ? 0 : a >= 100 ? 1 : a >= 1 ? 2 : a >= 0.01 ? 3 : a === 0 ? 2 : 4);
  if (a < 0.5 * Math.pow(10, -d)) v = 0;
  return v.toLocaleString(LANG === 'hu' ? 'hu-HU' : 'en-US', {minimumFractionDigits: d, maximumFractionDigits: d}).replace('-', '−');
}
function getImg(name) {
  const src = scene.assets[name];
  if (!src) return null;
  let e = imgCache.get(name);
  if (!e || e.src !== src) {
    const img = new Image();
    e = {src, img, ok: false, err: false};
    img.onload = () => { e.ok = true; };
    img.onerror = () => { e.err = true; renderAssetStatus(); };   // nem tölthető be / cannot be loaded
    img.src = fixDataUrl(src);
    imgCache.set(name, e);
  }
  return e.ok ? e.img : null;
}

