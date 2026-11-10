/* ───────────── plots ───────────── */
let plotCount = -1, plotHNow = -1;
// A grafikonsávok magassága px-ben, a húzható elválasztóval állítható / height of one graph lane in px, set with the drag handle
let plotLaneH = clamp(+store.get('plotLaneH') || 64, 24, 240);
function drawPlots() {
  const groups = new Map();
  for (const p of R.plots.values()) { if (!groups.has(p.group)) groups.set(p.group, []); groups.get(p.group).push(p); }
  const lanes = [...groups.values()];
  const wrap = $('#plotsWrap');
  const laneH = plotLaneH, H = lanes.length * laneH + 20;
  if (lanes.length !== plotCount || H !== plotHNow) {
    plotCount = lanes.length; plotHNow = H;
    wrap.hidden = !lanes.length; $('#plotSplit').hidden = !lanes.length;
    plotCv.style.height = H + 'px';
    layoutStage();
  }
  if (!lanes.length) return;
  const Wd = plotCv.clientWidth;
  if (plotCv.width !== Math.round(Wd * dpr) || plotCv.height !== Math.round(H * dpr)) {
    plotCv.width = Math.round(Wd * dpr); plotCv.height = Math.round(H * dpr);
  }
  const c = plotCtx;
  c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, Wd, H);
  const t1 = Math.max(R.t, R.plotWindow), t0 = t1 - R.plotWindow;
  const L = 8, RM = 104, pw = Math.max(40, Wd - L - RM);
  const X = t => L + (t - t0) / (t1 - t0) * pw;
  lanes.forEach((series, i) => {
    const y0 = i * laneH + 4, h = laneH - 12, p0 = series[0];
    let lo = p0.min, hi = p0.max;
    if (lo == null || hi == null) {
      let a = Infinity, b = -Infinity;
      for (const p of series) for (const d of p.data) { if (d[0] < t0) continue; if (d[1] < a) a = d[1]; if (d[1] > b) b = d[1]; }
      if (!isFinite(a)) { a = -1; b = 1; }
      if (lo == null) lo = a; if (hi == null) hi = b;
    }
    if (hi - lo < 1e-9) { const m = Math.abs(hi) || 1; lo -= m * 0.1; hi += m * 0.1; }
    const pad = (hi - lo) * 0.08; if (p0.min == null) lo -= pad; if (p0.max == null) hi += pad;
    const Y = v => y0 + h - (v - lo) / (hi - lo) * h;
    c.fillStyle = tok.plotBg || '#f3f5f8'; c.fillRect(L, y0, pw, h);
    c.strokeStyle = tok.line || '#d2d9e2'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(L, y0 + h / 2 + 0.5); c.lineTo(L + pw, y0 + h / 2 + 0.5); c.stroke();
    if (lo < 0 && hi > 0) {
      c.setLineDash([3, 3]); c.strokeStyle = tok.muted || '#5a6575'; c.globalAlpha = 0.6;
      c.beginPath(); c.moveTo(L, Math.round(Y(0)) + 0.5); c.lineTo(L + pw, Math.round(Y(0)) + 0.5); c.stroke();
      c.setLineDash([]); c.globalAlpha = 1;
    }
    const single = series.length === 1;
    let lastVal = null;
    for (const p of series) {
      const vis = p.data.filter(d => d[0] >= t0 - 0.05);
      if (vis.length > 1) {
        c.save(); c.beginPath(); c.rect(L, y0, pw, h); c.clip();
        if (single) {
          const base = Y(clamp(0, lo, hi));
          c.beginPath(); c.moveTo(X(vis[0][0]), base);
          for (const d of vis) c.lineTo(X(d[0]), Y(d[1]));
          c.lineTo(X(vis[vis.length - 1][0]), base); c.closePath();
          c.fillStyle = p.color; c.globalAlpha = 0.12; c.fill(); c.globalAlpha = 1;
        }
        c.beginPath(); vis.forEach((d, j) => j ? c.lineTo(X(d[0]), Y(d[1])) : c.moveTo(X(d[0]), Y(d[1])));
        c.strokeStyle = p.color; c.lineWidth = single ? 1.8 : 1.6; c.lineJoin = 'round'; c.stroke();
        const last = vis[vis.length - 1];
        c.beginPath(); c.arc(X(last[0]), Y(last[1]), 3.2, 0, Math.PI * 2); c.fillStyle = p.color; c.fill();
        c.restore();
      }
      if (vis.length) lastVal = vis[vis.length - 1][1];
    }
    // legend: each series label in its own colour, unit once
    c.font = `600 12px ${FONT}`; c.textBaseline = 'top'; c.textAlign = 'left';
    let lx = L + 6;
    series.forEach(p => { const s = tr(p.label); c.fillStyle = p.color; c.fillText(s, lx, y0 + 4); lx += c.measureText(s).width + 10; });
    if (p0.unit) { c.fillStyle = tok.muted || '#5a6575'; c.fillText(`[${p0.unit}]`, lx, y0 + 4); }
    c.font = `500 11px ${FONT}`; c.fillStyle = tok.muted || '#5a6575'; c.textAlign = 'left';
    c.textBaseline = 'top'; c.fillText(fmt(hi), L + pw + 6, y0);
    c.textBaseline = 'bottom'; c.fillText(fmt(lo), L + pw + 6, y0 + h);
    if (single && lastVal != null) {
      c.font = `600 13px ${FONT}`; c.fillStyle = tok.ink || '#17202c'; c.textBaseline = 'middle';
      c.fillText(fmt(lastVal), L + pw + 6, y0 + h / 2);
    }
  });
  // time axis
  const yA = lanes.length * laneH + 2;
  c.font = `500 11px ${FONT}`; c.fillStyle = tok.muted || '#5a6575'; c.textBaseline = 'top'; c.textAlign = 'center';
  const stepT = niceStep(R.plotWindow / 6);
  for (let t = Math.ceil(t0 / stepT) * stepT; t <= t1 + 1e-9; t += stepT) {
    const x = X(t); if (x < L + 10 || x > L + pw - 10) continue;
    c.fillText(fmt(t, Math.max(0, -Math.floor(Math.log10(stepT) + 1e-9))) + ' s', x, yA);
  }
}

