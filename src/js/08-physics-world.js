/* ───────────── physics world ───────────── */
function makeWorld(o = {}) {
  const W = {
    g: o.gravity ?? 9.81, scale: o.scale ?? 50,
    ox: o.origin ? o.origin[0] : 40, oy: o.origin ? o.origin[1] : R.stageH - 40,
    ground: o.ground ?? true, walls: o.walls ?? false, e: o.restitution ?? 0.7, friction: o.friction ?? 0.2,
    collide: o.collide ?? true, drag: o.drag ?? 0, vScale: o.vScale ?? 8, bodies: [], links: [],
  };
  W.xMax = o.width ?? (R.stageW - 2 * W.ox) / W.scale;
  R.world = W;
  return W;
}
const wx = m => R.world ? R.world.ox + m * R.world.scale : m;
const wy = m => R.world ? R.world.oy - m * R.world.scale : m;
const ws = m => R.world ? m * R.world.scale : m;
function makeBall(o = {}) {
  const W = R.world || makeWorld({});
  const b = {
    x: o.x ?? 1, y: o.y ?? 1, vx: o.vx ?? 0, vy: o.vy ?? 0, r: o.r ?? 0.25, m: o.m ?? 1,
    color: o.color ?? C.list[W.bodies.length % C.list.length], fixed: !!o.fixed, trailLen: o.trail === true ? 300 : (+o.trail || 0), trail: [], ta: 1,
    label: o.label ?? '', showV: !!o.showV, e: o.e, fx: 0, fy: 0, ax: 0, ay: 0, onGround: false, hidden: !!o.hidden, hits: 0,
  };
  b.applyForce = (fx, fy) => { b.fx += fx; b.fy += fy; };
  Object.defineProperty(b, 'speed', {get: () => Math.hypot(b.vx, b.vy)});
  W.bodies.push(b);
  return b;
}
function makeLink(a, b, o = {}) {
  const W = R.world || makeWorld({});
  const P = e => Array.isArray(e) ? {x: e[0], y: e[1], vx: 0, vy: 0, fx: 0, fy: 0, anchor: true} : e;
  const L = {a: P(a), b: P(b), k: o.k ?? 50, damping: o.damping ?? 0.5, color: o.color ?? C.ink, coils: o.coils ?? 10};
  L.len = o.len ?? Math.hypot(L.b.x - L.a.x, L.b.y - L.a.y);
  W.links.push(L);
  return L;
}
function worldStep(W, dt) {
  for (const L of W.links) {
    const a = L.a, b = L.b, dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1e-9, ux = dx / d, uy = dy / d;
    const f = L.k * (d - L.len) + L.damping * ((b.vx - a.vx) * ux + (b.vy - a.vy) * uy);
    if (!a.anchor) { a.fx += f * ux; a.fy += f * uy; }
    if (!b.anchor) { b.fx -= f * ux; b.fy -= f * uy; }
  }
  for (const b of W.bodies) {
    b.onGround = false;
    if (b.fixed) { b.fx = b.fy = 0; b.vx = b.vy = 0; continue; }
    const ax = b.fx / b.m - W.drag * b.vx, ay = b.fy / b.m - W.g - W.drag * b.vy;
    b.ax = ax; b.ay = ay;
    b.vx += ax * dt; b.vy += ay * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.fx = b.fy = 0;
    const e = b.e ?? W.e;
    if (W.ground && b.y - b.r < 0) {
      b.y = b.r; b.onGround = true;
      if (b.vy < 0) { b.vy = -b.vy * e; if (b.vy < 0.08) b.vy = 0; }
      if (b.vy === 0 && W.friction > 0) {
        const dv = W.friction * Math.abs(W.g) * dt;
        b.vx = Math.abs(b.vx) <= dv ? 0 : b.vx - Math.sign(b.vx) * dv;
      }
    }
    if (W.walls) {
      if (b.x - b.r < 0) { b.x = b.r; if (b.vx < 0) b.vx = -b.vx * e; }
      if (b.x + b.r > W.xMax) { b.x = W.xMax - b.r; if (b.vx > 0) b.vx = -b.vx * e; }
    }
    if (b.trailLen) {
      b.ta += dt;
      if (b.ta >= 1 / 30) { b.ta = 0; b.trail.push([b.x, b.y]); if (b.trail.length > b.trailLen) b.trail.shift(); }
    }
  }
  if (!W.collide) return;
  const B = W.bodies;
  for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
    const a = B[i], b = B[j], dx = b.x - a.x, dy = b.y - a.y, rr = a.r + b.r, d2 = dx * dx + dy * dy;
    if (d2 >= rr * rr || d2 === 0) continue;
    const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
    const ia = a.fixed ? 0 : 1 / a.m, ib = b.fixed ? 0 : 1 / b.m, is = ia + ib;
    if (!is) continue;
    const pen = rr - d;
    a.x -= nx * pen * ia / is; a.y -= ny * pen * ia / is; b.x += nx * pen * ib / is; b.y += ny * pen * ib / is;
    const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
    if (vn < 0) {
      const e = Math.min(a.e ?? W.e, b.e ?? W.e), jj = -(1 + e) * vn / is;
      a.vx -= jj * nx * ia; a.vy -= jj * ny * ia; b.vx += jj * nx * ib; b.vy += jj * ny * ib;
      a.hits++; b.hits++;
    }
  }
}
function drawWorldImpl() {
  const W = R.world; if (!W || !g) return;
  R.worldDrawn = true;
  if (W.ground) D.ground(wy(0), {x1: 0, x2: R.stageW});
  if (W.walls) {
    D.line(wx(0), wy(0), wx(0), 0, {stroke: '#7c8696', lw: 3});
    D.line(wx(W.xMax), wy(0), wx(W.xMax), 0, {stroke: '#7c8696', lw: 3});
  }
  for (const L of W.links) {
    D.spring(wx(L.a.x), wy(L.a.y), wx(L.b.x), wy(L.b.y), {color: L.color, coils: L.coils});
    if (L.a.anchor) D.rect(wx(L.a.x) - 5, wy(L.a.y) - 5, 10, 10, {fill: C.ink});
    if (L.b.anchor) D.rect(wx(L.b.x) - 5, wy(L.b.y) - 5, 10, 10, {fill: C.ink});
  }
  for (const b of W.bodies) {
    if (b.trail.length > 1) D.polyline(b.trail.map(([x, y]) => [wx(x), wy(y)]).concat([[wx(b.x), wy(b.y)]]), {stroke: b.color, lw: 2, alpha: 0.45});
  }
  for (const b of W.bodies) {
    if (b.hidden) continue;
    D.circle(wx(b.x), wy(b.y), ws(b.r), {fill: b.color, stroke: 'rgba(0,0,0,0.35)', lw: 1.5});
    if (b.label) D.text(b.label, wx(b.x), wy(b.y) + 1, {size: Math.max(11, ws(b.r) * 0.9), bold: true, color: '#fff', align: 'center', baseline: 'middle'});
    if (b.showV) D.vector(wx(b.x), wy(b.y), b.vx * W.vScale, -b.vy * W.vScale, {stroke: C.ink, lw: 2}, 'v');
  }
}

