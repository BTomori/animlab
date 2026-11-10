/* ───────────── main loop ───────────── */
const DT = 1 / 240;   // longest physics step; slow motion uses shorter steps so motion stays smooth
function simStep(dt) {
  for (const f of R.updates) f(dt, R.t);
  if (R.world) worldStep(R.world, dt);
  R.t += dt; R.advanced = true;
}
function loop(now) {
  const real = Math.min(0.1, Math.max(0, (now - lastNow) / 1000));
  lastNow = now;
  if (needsRerun) { needsRerun = false; runScene(); }
  kbTick(real);
  R.advanced = false;
  if (!R.error) {
    let simT = 0;
    if (playing) simT += real * speed;
    if (stepReq) { simT += speed / 60; stepReq = false; }
    if (simT > 0) {
      try {
        const n = Math.min(480, Math.ceil(simT / DT - 1e-9)), dt = simT / n;
        for (let k = 0; k < n; k++) simStep(dt);
      } catch (e) { fail(e); }
    }
  }
  render();
  requestAnimationFrame(loop);
}

let tok = {};
function readTokens() {
  const cs = getComputedStyle(document.documentElement);
  tok = {ink: cs.getPropertyValue('--ink').trim(), muted: cs.getPropertyValue('--muted').trim(), line: cs.getPropertyValue('--line').trim(), plotBg: cs.getPropertyValue('--plot-bg').trim()};
}

function render() {
  const c = stageCtx;
  c.setTransform(stageK * dpr, 0, 0, stageK * dpr, 0, 0);
  c.globalAlpha = 1;
  c.fillStyle = R.bg; c.fillRect(0, 0, R.stageW, R.stageH);
  g = c; R.worldDrawn = false; R.reg = new Map(); R.occ = {}; R.flowN = 0;
  if (!R.error) {
    try {
      for (const f of R.draws) {
        c.save();
        try { f(R.t); flush3(); }
        finally { batch3 = null; while (R.depth > 0) { c.restore(); R.depth--; } c.restore(); }
      }
      if (R.world && !R.worldDrawn) drawWorldImpl();
    } catch (e) { fail(e); }
  }
  innerDraw++;
  try { drawBound(); } catch (e) { /* a broken binding never stops the scene */ }
  try { drawMarks(); } catch (e) { /* a broken mark never stops the scene */ }
  finally { innerDraw--; }
  if (R.title) {
    c.save(); c.font = `600 22px ${FONT_C}`; c.fillStyle = R.titleColor; c.textBaseline = 'top'; c.textAlign = 'left';
    c.fillText(tr(R.title), 22, 18); c.restore();
  }
  if (Math.abs(speed - 1) > 1e-3) {
    c.save(); c.font = `500 13px ${FONT}`; c.fillStyle = 'rgba(70, 80, 95, 0.75)'; c.textAlign = 'right';
    c.fillText(`${fmtSpeed(speed)} ${speed < 1 ? T('slowmo') : T('fastmo')}`, R.stageW - 14, R.stageH - 14); c.restore();
  }
  g = null;

  for (const [key, v] of R.pending) {
    const p = R.plots.get(key);
    if (!p) continue;
    const last = p.data[p.data.length - 1];
    if (!p.data.length || (R.advanced && R.t - last[0] >= R.plotWindow / 2000)) {
      p.data.push([R.t, v]);
      const cut = R.t - R.plotWindow * 1.05;
      while (p.data.length > 2 && p.data[0][0] < cut) p.data.shift();
      if (p.data.length > 6000) p.data.splice(0, p.data.length - 6000);
    }
  }
  R.pending.clear();
  drawPlots();
  renderReadouts(false);
  const tl = 't = ' + fmt(R.t, speed < 0.005 ? 4 : (R.plotWindow < 0.5 || speed < 0.05) ? 3 : 2) + ' s';
  if (timeLbl.textContent !== tl) timeLbl.textContent = tl;
  if (rec) recBadge.textContent = '● REC ' + fmtClock((performance.now() - recStart) / 1000);
}
const timeLbl = $('#timeLbl'), recBadge = $('#recBadge');
const fmtClock = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.floor(s % 60)).padStart(2, '0');

