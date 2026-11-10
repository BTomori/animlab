/* ───────────── animated arrows along paths, field loops ───────────── */
function shade(col, amt) {
  const m = /^#([0-9a-f]{6})$/i.exec(String(col || ''));
  if (!m) return col;
  const n = parseInt(m[1], 16), rgb = [n >> 16, (n >> 8) & 255, n & 255];
  const out = rgb.map(v => Math.round(amt >= 0 ? v + (255 - v) * amt : v * (1 + amt)));
  return '#' + out.map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}
function pathSampler(p, closed) {
  const q = closed ? p.concat([p[0]]) : p, seg = [];
  let L = 0;
  for (let i = 1; i < q.length; i++) { const l = Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]); seg.push(l); L += l; }
  return {
    L, at(s) {
      let i = 0;
      while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++; }
      const a = q[i], b = q[i + 1], l = seg[i] || 1e-9, f = Math.min(1, Math.max(0, s / l));
      return {x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, ux: (b[0] - a[0]) / l, uy: (b[1] - a[1]) / l};
    },
  };
}
function arrowHead2(x, y, ux, uy, size, color, alpha) {
  if (!g) return;
  const bx = x - ux * size, by = y - uy * size, w = size * 0.55;
  g.beginPath(); g.moveTo(x + ux * size * 0.35, y + uy * size * 0.35);
  g.lineTo(bx - uy * w, by + ux * w); g.lineTo(bx + ux * size * 0.25, by + uy * size * 0.25); g.lineTo(bx + uy * w, by - ux * w); g.closePath();
  paint({fill: color, stroke: shade(color, -0.35), lw: 1, alpha}, true);
}
// Arrowheads spaced along a path. Offset = o.pos (if given) or t·speed; direction from the sign.
// Offset of the arrowheads. With pos given it is used as is; otherwise the speed is integrated over time for each
// flow call of the frame, so a speed that changes (a current, a slider) moves the arrows smoothly instead of making
// them jump (t·speed would jump whenever the speed changes). For a constant speed this equals t·speed.
function flowOffset(o, speed) {
  if (o.pos != null) return o.pos;
  if (o.t != null) return o.t * speed;
  const k = (R.flowN = (R.flowN || 0) + 1);
  const st = R.flowSt || (R.flowSt = new Map());
  let e = st.get(k);
  if (!e || R.t < e.t || R.t - e.t > 1) e = {off: R.t * speed, t: R.t};
  else { e.off += speed * (R.t - e.t); e.t = R.t; }
  st.set(k, e);
  return e.off;
}
function flowHeads(S, o, put) {
  if (S.L < 1) return;
  const speed = o.speed ?? 60, sp = o.spacing ?? 80;
  const n = Math.max(1, Math.round(S.L / sp)), step = S.L / n;
  const off0 = flowOffset(o, speed);
  const off = ((off0 % step) + step) % step;
  const dir = o.dir != null ? (Math.sign(o.dir) || 1) : (speed < 0 ? -1 : 1);
  for (let k = 0; k < n; k++) { const s = off + k * step; if (s <= S.L) put(S.at(s), dir); }
}
Object.assign(D, {
  flow(list, o = {}) {
    if (!g) return; const p = pts(list); if (p.length < 2) return;
    const ov = regMark('flow', '', o);
    if (ov) {
      if (ov.hidden) return;
      o = ovStyle(ov, o, 'color'); if (ov.color) { o.arrowColor = ov.color; o.lineColor = undefined; }
      if (ov.scale != null && isFinite(ov.scale) && ov.scale !== 1) o.size = (o.size ?? Math.max(9, (o.lw ?? 2) * 3.5)) * ov.scale;
      if (ov.key === hlKey) D.polyline(p, {stroke: 'rgba(255, 196, 0, 0.55)', lw: (o.lw ?? 2) + 12});
    }
    const closed = !!o.closed, col = o.color || C.blue, lw = o.lw ?? 2;
    if (o.line !== false) {
      const st = {stroke: o.lineColor || col, lw, alpha: o.alpha, dash: o.dash};
      closed ? D.polygon(p, {...st, fill: null}) : D.polyline(p, st);
    }
    const size = o.size ?? Math.max(9, lw * 3.5);
    flowHeads(pathSampler(p, closed), o, (q, dir) => arrowHead2(q.x, q.y, q.ux * dir, q.uy * dir, size, o.arrowColor || col, o.alpha));
  },
  fieldLoop(x, y, rx, ry, angle = 0, o = {}) {
    if (!g) return;
    const ov = regMark('loop', '', o);
    if (ov) {
      if (ov.hidden) return;
      o = ovStyle(ov, o, 'color'); if (ov.color) o.arrowColor = shade(ov.color, -0.2);
      if (ov.scale != null && isFinite(ov.scale) && ov.scale !== 1) { rx *= ov.scale; ry *= ov.scale; }
    }
    const n = 72, p = [], ca = Math.cos(angle), sa = Math.sin(angle);
    for (let k = 0; k < n; k++) {
      const u = k / n * 2 * Math.PI, lx = rx * Math.cos(u), ly = ry * Math.sin(u);
      p.push([x + lx * ca - ly * sa, y - (lx * sa + ly * ca)]);
    }
    if (ov && ov.key === hlKey) D.polygon(p, {stroke: 'rgba(255, 196, 0, 0.55)', lw: (o.lw ?? 2) + 12, fill: null});
    innerDraw++;
    try {
      D.flow(p, {closed: true, color: o.color || '#c8963e', arrowColor: o.arrowColor || '#e0663a', lw: o.lw ?? 2,
        speed: o.speed ?? 60, spacing: o.spacing ?? Math.max(60, Math.PI * (rx + ry) / (o.arrows ?? 4)), size: o.size, t: o.t, pos: o.pos, dir: o.dir, alpha: o.alpha});
    } finally { innerDraw--; }
  },
});

