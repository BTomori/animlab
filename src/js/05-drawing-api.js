/* ───────────── drawing API ───────────── */
function norm(s, closed) {
  if (s == null) return {stroke: C.ink};
  if (typeof s === 'string') return closed ? {fill: s} : {stroke: s};
  return s;
}
function paint(s, closed) {
  g.save();
  if (s.alpha != null) g.globalAlpha *= s.alpha;
  if (closed && s.fill) { g.fillStyle = s.fill; g.fill(); }
  const sc = s.stroke !== undefined ? s.stroke : ((closed && s.fill) ? null : C.ink);
  if (sc) {
    g.strokeStyle = sc; g.lineWidth = s.lw ?? 2; g.setLineDash(s.dash || []);
    g.lineCap = s.cap || 'round'; g.lineJoin = 'round'; g.stroke();
  }
  g.restore();
}
function pts(list) { return (list || []).map(p => Array.isArray(p) ? p : [p.x, p.y]); }
const D = {
  circle(x, y, r, s) { if (!g || !(r > 0)) return; s = norm(s, true); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); paint(s, true); },
  ellipse(x, y, rx, ry, s, angle = 0) { if (!g) return; s = norm(s, true); g.beginPath(); g.ellipse(x, y, Math.abs(rx), Math.abs(ry), angle, 0, Math.PI * 2); paint(s, true); },
  rect(x, y, w, h, s) {
    if (!g) return; s = norm(s, true); g.beginPath();
    if (s.radius && g.roundRect) g.roundRect(x, y, w, h, s.radius); else g.rect(x, y, w, h);
    paint(s, true);
  },
  box(cx, cy, w, h, angle = 0, s) {
    if (!g) return; g.save(); g.translate(cx, cy); g.rotate(angle || 0); D.rect(-w / 2, -h / 2, w, h, s); g.restore();
  },
  line(x1, y1, x2, y2, s) { if (!g) return; s = norm(s, false); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); paint(s, false); },
  polyline(list, s) {
    if (!g) return; const p = pts(list); if (p.length < 2) return; s = norm(s, false);
    g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); paint(s, false);
  },
  polygon(list, s) {
    if (!g) return; const p = pts(list); if (p.length < 3) return; s = norm(s, true);
    g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.closePath(); paint(s, true);
  },
  arc(x, y, r, a0, a1, s) { if (!g || !(r > 0)) return; s = norm(s, false); g.beginPath(); g.arc(x, y, r, a0, a1, !!s.ccw); paint(s, false); },
  arrow(x1, y1, x2, y2, s) {
    if (!g) return; s = norm(s, false);
    const ov = regMark('arrow', '', s);
    if (ov) {
      if (ov.hidden) return;
      s = ovStyle(ov, s);
      if (ov.scale != null && isFinite(ov.scale) && ov.scale !== 1) { x2 = x1 + (x2 - x1) * ov.scale; y2 = y1 + (y2 - y1) * ov.scale; }
      if (ov.key === hlKey) haloLine(x1, y1, x2, y2, s.lw ?? 2);
    }
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 0.5) return;
    const lw = s.lw ?? 2, hs = Math.min(s.head ?? Math.max(9, lw * 3.4), L), ux = dx / L, uy = dy / L;
    const bx = x2 - ux * hs, by = y2 - uy * hs;
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(bx + ux, by + uy); paint({...s, fill: null}, false);
    g.beginPath(); g.moveTo(x2, y2);
    g.lineTo(bx - uy * hs * 0.45, by + ux * hs * 0.45); g.lineTo(bx + uy * hs * 0.45, by - ux * hs * 0.45); g.closePath();
    paint({fill: s.stroke || C.ink, stroke: null, alpha: s.alpha}, true);
  },
  vector(x, y, dx, dy, s, label) {
    if (!g) return; s = norm(s, false);
    const ov = regMark('vector', label, s);
    if (ov) {
      if (ov.hidden) return;
      s = ovStyle(ov, s);
      if (ov.scale != null && isFinite(ov.scale) && ov.scale !== 1) { dx *= ov.scale; dy *= ov.scale; }
      if (ov.label != null && ov.label !== '') label = interp(ov.label);
      if (ov.key === hlKey) haloLine(x, y, x + dx, y + dy, s.lw ?? 2);
    }
    const L = Math.hypot(dx, dy); if (L < 1) return;
    innerDraw++; try { D.arrow(x, y, x + dx, y + dy, s); } finally { innerDraw--; }
    if (label != null && label !== '') {
      const ux = dx / L, uy = dy / L;
      D.text(label, x + dx + ux * 14 + (Math.abs(uy) > 0.9 ? 10 : 0), y + dy + uy * 14 + 5,
        {size: s.labelSize ?? 15, bold: true, italic: true, color: s.stroke || C.ink, align: Math.abs(uy) > 0.9 ? 'left' : 'center'});
    }
  },
  text(str, x, y, s) {
    if (!g) return; s = typeof s === 'string' ? {color: s} : (s || {});
    const size = s.size ?? 16;
    g.save(); if (s.alpha != null) g.globalAlpha *= s.alpha;
    g.font = `${s.italic ? 'italic ' : ''}${s.bold ? '600 ' : '400 '}${size}px ${s.font || FONT}`;
    g.textAlign = s.align || 'left'; g.textBaseline = s.baseline || 'alphabetic';
    tr(str).split('\n').forEach((ln, i) => {
      const yy = y + i * size * 1.25;
      if (s.bg) {
        const m = g.measureText(ln), w = m.width + 8;
        const ox = g.textAlign === 'center' ? -w / 2 : g.textAlign === 'right' ? -w + 4 : -4;
        g.fillStyle = s.bg; g.fillRect(x + ox, yy - size * 0.95, w, size * 1.3);
      }
      g.fillStyle = s.color || C.ink; g.fillText(ln, x, yy);
    });
    g.restore();
  },
  image(name, x, y, o = {}) {
    if (!g) return; const img = getImg(name);
    let w = o.w, h = o.h;
    if (img) {
      const nw = img.naturalWidth || 100, nh = img.naturalHeight || 100, ar = nw / nh;
      if (w == null && h == null) { w = nw; h = nh; } else if (w == null) w = h * ar; else if (h == null) h = w / ar;
    } else { w = w ?? 100; h = h ?? w; }
    g.save(); g.translate(x, y); if (o.angle) g.rotate(o.angle); if (o.alpha != null) g.globalAlpha *= o.alpha;
    if (o.flip) g.scale(-1, 1);
    // pivot: a kép melyik pontja kerül (x; y)-ra, és e körül forog – arányban (0…1) / which point of the picture sits on (x; y) and is the rotation centre – as fractions (0…1)
    const pv = Array.isArray(o.pivot) ? o.pivot : (o.center === false ? [0, 0] : [0.5, 0.5]);
    const ox = -w * (+pv[0] || 0), oy = -h * (+pv[1] || 0);
    if (img) g.drawImage(img, ox, oy, w, h);
    else {
      const e = imgCache.get(name), bad = !scene.assets[name] || (e && e.err);
      g.setLineDash([6, 5]); g.strokeStyle = bad ? C.red : C.gray; g.lineWidth = 1.5; g.strokeRect(ox, oy, w, h); g.setLineDash([]);
      g.fillStyle = bad ? C.red : C.gray; g.font = `500 13px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('"' + name + '"', ox + w / 2, oy + h / 2 - (bad ? 9 : 0));
      if (bad) g.fillText(tr(!scene.assets[name] ? {hu: 'nincs ilyen nevű kép', en: 'no picture with this name'} : {hu: 'nem tölthető be', en: 'cannot be loaded'}), ox + w / 2, oy + h / 2 + 9);
    }
    if (o.showPivot) { g.beginPath(); g.arc(0, 0, 5, 0, Math.PI * 2); g.fillStyle = C.red; g.fill(); }
    g.restore();
  },
  spring(x1, y1, x2, y2, o = {}) {
    if (!g) return; const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 1) return;
    const n = o.coils ?? 10, w = o.width ?? 12, lead = Math.min(o.lead ?? 10, L / 4), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const body = Math.max(0, L - 2 * lead);
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 + ux * lead, y1 + uy * lead);
    for (let i = 0; i < n * 2; i++) {
      const f = (i + 0.5) / (n * 2), side = i % 2 ? -1 : 1;
      g.lineTo(x1 + ux * (lead + body * f) + nx * w * side, y1 + uy * (lead + body * f) + ny * w * side);
    }
    g.lineTo(x2 - ux * lead, y2 - uy * lead); g.lineTo(x2, y2);
    paint({stroke: o.color || o.stroke || C.ink, lw: o.lw ?? 2, alpha: o.alpha}, false);
  },
  current(x, y, dir, r = 12, s) {
    if (!g) return; s = norm(s, false);
    const col = s.stroke || C.ink, al = s.alpha;
    D.circle(x, y, r, {fill: s.fill || '#ffffff', stroke: col, lw: s.lw ?? 2, alpha: al});
    if (dir > 0) D.circle(x, y, r * 0.28, {fill: col, stroke: null, alpha: al});
    else if (dir < 0) {
      const k = r * 0.52;
      D.line(x - k, y - k, x + k, y + k, {stroke: col, lw: s.lw ?? 2, alpha: al});
      D.line(x - k, y + k, x + k, y - k, {stroke: col, lw: s.lw ?? 2, alpha: al});
    }
  },
  ring(x, y, r1, r2, s) {
    if (!g) return; s = norm(s, true);
    g.beginPath(); g.arc(x, y, Math.max(r1, r2), 0, Math.PI * 2);
    g.moveTo(x + Math.min(r1, r2), y); g.arc(x, y, Math.min(r1, r2), 0, Math.PI * 2, true);
    paint(s, true);
  },
  phasor(x, y, len, angle, s, label) {
    D.vector(x, y, len * Math.cos(angle), -len * Math.sin(angle), s, label);
  },
  stator3(x, y, o = {}) {
    if (!g) return;
    const ri = o.ri ?? 175, ro = o.ro ?? 245, p = Math.max(1, Math.round(o.p ?? 1)), rs = o.rs ?? ri + 20;
    const cur = o.i || [0, 0, 0];
    const imax = o.imax ?? Math.max(1e-9, ...cur.map(Math.abs));
    const axes = o.axes || [0, 2 * Math.PI / 3, 4 * Math.PI / 3], cols = o.colors || [C.L1, C.L2, C.L3];
    D.ring(x, y, ri, ro, {fill: o.fill || '#d5dae2', stroke: '#9aa3b1', lw: 2});
    for (let k = 0; k < 3; k++) for (let m = 0; m < p; m++) for (const side of [1, -1]) {
      // go conductor (⊙ for i > 0) sits 90° ahead of the coil axis, the return conductor 90° behind
      const psi = (axes[k] + side * Math.PI / 2) / p + m * 2 * Math.PI / p;
      const sx = x + rs * Math.cos(psi), sy = y - rs * Math.sin(psi);
      const ik = side * (cur[k] || 0), rel = Math.min(1, Math.abs(ik) / imax);
      D.circle(sx, sy, 15, {fill: '#f4f6f9', stroke: '#9aa3b1', lw: 1});
      D.current(sx, sy, rel > 0.03 ? Math.sign(ik) : 0, 11, {stroke: cols[k], lw: 2.5, alpha: 0.3 + 0.7 * rel});
      if (o.labels !== false && m === 0) {
        D.text(String(k + 1) + (side < 0 ? "'" : ''), x + (ro + 17) * Math.cos(psi), y - (ro + 17) * Math.sin(psi) + 5,
          {size: 14, bold: true, color: cols[k], align: 'center'});
      }
    }
  },
  ground(y, o = {}) {
    if (!g) return; const x1 = o.x1 ?? 0, x2 = o.x2 ?? R.stageW, col = o.color || '#7c8696';
    D.line(x1, y, x2, y, {stroke: col, lw: 2, cap: 'butt'});
    g.save(); g.beginPath(); g.rect(x1, y, x2 - x1, 14); g.clip();
    for (let x = x1; x < x2 + 14; x += 12) D.line(x, y + 1, x - 11, y + 12, {stroke: col, lw: 1, alpha: 0.6});
    g.restore();
  },
  grid(step = 50, color = 'rgba(40, 60, 90, 0.07)') {
    if (!g) return; g.save(); g.strokeStyle = color; g.lineWidth = 1; g.beginPath();
    for (let x = step; x < R.stageW; x += step) { g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, R.stageH); }
    for (let y = step; y < R.stageH; y += step) { g.moveTo(0, y + 0.5); g.lineTo(R.stageW, y + 0.5); }
    g.stroke(); g.restore();
  },
  push() { if (!g) return; g.save(); R.depth++; },
  pop() { if (!g || R.depth <= 0) return; g.restore(); R.depth--; },
  translate(x, y) { if (g) g.translate(x, y); },
  rotate(a) { if (g) g.rotate(a); },
  scale(sx, sy) { if (g) g.scale(sx, sy ?? sx); },
};

