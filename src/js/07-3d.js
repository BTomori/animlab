/* ───────────── 3D: projection, depth-sorted drawing ───────────── */
const V3D = {x: 500, y: 300, scale: 100, yaw: -0.6, pitch: 0.35, dist: 14};
const V3 = {...V3D};
let batch3 = null;
function viewRot(p) {
  const [x, y, z] = p, cy = Math.cos(V3.yaw), sy = Math.sin(V3.yaw);
  const X = x * cy + z * sy, Z1 = -x * sy + z * cy;
  const cp = Math.cos(V3.pitch), sp = Math.sin(V3.pitch);
  return [X, y * cp - Z1 * sp, y * sp + Z1 * cp];
}
function proj3(p) {
  const [X, Y, Z] = viewRot(p);
  const k = V3.dist > 0 ? V3.dist / Math.max(0.2, V3.dist - Z) : 1;
  return [V3.x + X * V3.scale * k, V3.y - Y * V3.scale * k, Z, k];
}
function emit3(z, fn) { if (batch3) batch3.push({z, fn, i: batch3.length}); else fn(); }
function flush3() {
  if (!batch3) return;
  const b = batch3; batch3 = null;
  b.sort((a, c) => a.z - c.z || a.i - c.i);
  for (const it of b) it.fn();
}
const AX = {x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1]};
const vec = a => Array.isArray(a) ? a : (AX[a] || [0, 0, 1]);
function rot3(p, axis, a) {
  const k = vec(axis), L = Math.hypot(...k) || 1, [kx, ky, kz] = k.map(v => v / L), [x, y, z] = p;
  const c = Math.cos(a), s = Math.sin(a), d = kx * x + ky * y + kz * z;
  return [x * c + (ky * z - kz * y) * s + kx * d * (1 - c), y * c + (kz * x - kx * z) * s + ky * d * (1 - c), z * c + (kx * y - ky * x) * s + kz * d * (1 - c)];
}
function circle3(c, axis, r, n = 48) {
  const k = vec(axis), L = Math.hypot(...k) || 1, a = k.map(v => v / L);
  const t = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  let u = [a[1] * t[2] - a[2] * t[1], a[2] * t[0] - a[0] * t[2], a[0] * t[1] - a[1] * t[0]];
  const ul = Math.hypot(...u); u = u.map(v => v / ul);
  const v = [a[1] * u[2] - a[2] * u[1], a[2] * u[0] - a[0] * u[2], a[0] * u[1] - a[1] * u[0]];
  const out = [];
  for (let i = 0; i < n; i++) { const q = i / n * 2 * Math.PI, cq = Math.cos(q) * r, sq = Math.sin(q) * r; out.push([c[0] + u[0] * cq + v[0] * sq, c[1] + u[1] * cq + v[1] * sq, c[2] + u[2] * cq + v[2] * sq]); }
  return out;
}
function segs3(list, closed) { const p = list.slice(); if (closed && p.length > 2) p.push(p[0]); return p; }
function sampler3(p, closed) {
  const q = segs3(p, closed), seg = []; let L = 0;
  for (let i = 1; i < q.length; i++) { const l = Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1], q[i][2] - q[i - 1][2]); seg.push(l); L += l; }
  return {L, at(s) {
    let i = 0; while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++; }
    const a = q[i], b = q[i + 1], l = seg[i] || 1e-9, f = Math.min(1, Math.max(0, s / l));
    return {p: [0, 1, 2].map(j => a[j] + (b[j] - a[j]) * f), u: [0, 1, 2].map(j => (b[j] - a[j]) / l)};
  }};
}
Object.assign(D, {
  path3(list, s, closed) {
    if (!g) return; s = norm(s, false); const q = segs3(list, closed);
    for (let i = 1; i < q.length; i++) {
      const a = proj3(q[i - 1]), b = proj3(q[i]);
      emit3((a[2] + b[2]) / 2, () => D.line(a[0], a[1], b[0], b[1], {...s, lw: (s.lw ?? 2) * (a[3] + b[3]) / 2}));
    }
  },
  wire3(list, o = {}, closed) {
    if (!g) return; const q = segs3(list, closed);
    const col = o.color || C.copper, lw = o.lw ?? 8, dark = shade(col, -0.35), light = shade(col, 0.55);
    for (let i = 1; i < q.length; i++) {
      const a = proj3(q[i - 1]), b = proj3(q[i]), k = (a[3] + b[3]) / 2, w = lw * k;
      emit3((a[2] + b[2]) / 2, () => {
        D.line(a[0], a[1], b[0], b[1], {stroke: dark, lw: w + 2, alpha: o.alpha});
        D.line(a[0], a[1], b[0], b[1], {stroke: col, lw: w, alpha: o.alpha});
        D.line(a[0], a[1] - w * 0.22, b[0], b[1] - w * 0.22, {stroke: light, lw: Math.max(1, w * 0.3), alpha: (o.alpha ?? 1) * 0.8});
      });
    }
  },
  arrow3(a, b, s) {
    if (!g) return; s = norm(s, false);
    const ov = regMark('arrow3', s.label || '', s);
    if (ov) {
      if (ov.hidden) return;
      s = ovStyle(ov, s);
      if (ov.scale != null && isFinite(ov.scale) && ov.scale !== 1) b = [0, 1, 2].map(j => a[j] + (b[j] - a[j]) * ov.scale);
    }
    const A = proj3(a), B = proj3(b), k = (A[3] + B[3]) / 2, hl = ov && ov.key === hlKey;
    emit3(Math.max(A[2], B[2]) + 0.01, () => {
      if (hl) haloLine(A[0], A[1], B[0], B[1], (s.lw ?? 2) * k);
      innerDraw++;
      try { D.arrow(A[0], A[1], B[0], B[1], {...s, lw: (s.lw ?? 2) * k, head: s.head ? s.head * k : undefined}); } finally { innerDraw--; }
    });
  },
  flow3(list, o = {}, closed) {
    if (!g) return;
    const ov = regMark('flow3', '', o);
    if (ov) {
      if (ov.hidden) return;
      o = ovStyle(ov, o, 'color');
      if (ov.scale != null && isFinite(ov.scale) && ov.scale !== 1) o.size = (o.size ?? 11) * ov.scale;
    }
    const S = sampler3(list, closed);
    const col = o.color || C.blue, size = o.size ?? 11;
    flowHeads(S, o, (q, dir) => {
      const A = proj3(q.p), B = proj3(q.p.map((v, j) => v + q.u[j] * 0.05 * dir));
      const dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1e-9;
      if (l < 0.02) return;   // pointing straight at the viewer: nothing to show
      emit3(A[2] + 0.02, () => arrowHead2(A[0], A[1], dx / l, dy / l, size * A[3], col, o.alpha));
    });
  },
  face3(list, s) {
    if (!g) return; s = norm(s, true); const P2 = list.map(proj3);
    emit3(P2.reduce((m, p) => m + p[2], 0) / P2.length, () => D.polygon(P2.map(p => [p[0], p[1]]), s));
  },
  box3(c, size, s = {}) {
    if (!g) return; s = norm(s, true);
    const [hx, hy, hz] = size.map(v => v / 2), col = s.fill || C.gray;
    const V = (i, j, k) => [c[0] + i * hx, c[1] + j * hy, c[2] + k * hz];
    const faces = [
      [[1, 0, 0], [V(1, -1, -1), V(1, 1, -1), V(1, 1, 1), V(1, -1, 1)]], [[-1, 0, 0], [V(-1, -1, -1), V(-1, -1, 1), V(-1, 1, 1), V(-1, 1, -1)]],
      [[0, 1, 0], [V(-1, 1, -1), V(-1, 1, 1), V(1, 1, 1), V(1, 1, -1)]], [[0, -1, 0], [V(-1, -1, -1), V(1, -1, -1), V(1, -1, 1), V(-1, -1, 1)]],
      [[0, 0, 1], [V(-1, -1, 1), V(1, -1, 1), V(1, 1, 1), V(-1, 1, 1)]], [[0, 0, -1], [V(-1, -1, -1), V(-1, 1, -1), V(1, 1, -1), V(1, -1, -1)]],
    ];
    const light = [-0.35, 0.75, 0.55];
    for (const [n, quad] of faces) {
      if (viewRot(n)[2] <= 0) continue;   // back face
      const b = n[0] * light[0] + n[1] * light[1] + n[2] * light[2];
      D.face3(quad, {fill: shade(col, b > 0 ? b * 0.25 : b * 0.3), stroke: shade(col, -0.4), lw: 1, alpha: s.alpha});
    }
  },
  text3(str, p, s) {
    if (!g) return; const A = proj3(p);
    emit3(A[2] + 0.05, () => D.text(str, A[0], A[1], s));
  },
});

