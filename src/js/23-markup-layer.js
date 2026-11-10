/* ───────────── markup layer (mouse-drawn marks, saved with the scene) ───────────── */
const SWATCH = ['#d64045', '#2f6fd6', '#e8862a', '#c8963e', '#2e9e6a', '#7c5cd6', '#1d2430', '#ffffff'];
let markTool = null, drag = null, pathDraft = null, pivotFor = null, hoverPt = null, markId = 0;
const r1 = v => Math.round(v);

function markPoints(m) {   // the mark's own points before any spin
  if (m.type === 'loop') {
    const p = [], a = (m.angle || 0) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    for (let k = 0; k < 72; k++) {
      const u = k / 72 * 2 * Math.PI, lx = m.rx * Math.cos(u), ly = m.ry * Math.sin(u);
      p.push([m.c[0] + lx * ca - ly * sa, m.c[1] - (lx * sa + ly * ca)]);
    }
    return p;
  }
  return m.pts;
}
function markCenter(m) {
  if (m.type === 'loop') return m.c;
  const p = m.pts; return [p.reduce((s, q) => s + q[0], 0) / p.length, p.reduce((s, q) => s + q[1], 0) / p.length];
}
function spinFn(m) {
  const sp = +m.spin || 0;
  if (!sp) return q => q;
  const a = sp * Math.PI / 180 * R.t, pv = m.pivot || markCenter(m);
  if (m.mode === 'axis') {   // revolve about a line through the pivot: the across-axis part shrinks with cos
    const aa = (+m.axis || 0) * Math.PI / 180, ux = Math.cos(aa), uy = -Math.sin(aa), nx = -uy, ny = ux, c = Math.cos(a);
    return q => { const dx = q[0] - pv[0], dy = q[1] - pv[1], u = dx * ux + dy * uy, v = (dx * nx + dy * ny) * c; return [pv[0] + ux * u + nx * v, pv[1] + uy * u + ny * v]; };
  }
  const c = Math.cos(a), s = Math.sin(a);
  return q => { const dx = q[0] - pv[0], dy = q[1] - pv[1]; return [pv[0] + dx * c + dy * s, pv[1] - dx * s + dy * c]; };
}
function drawMark(m, pre) {
  const f = pre ? (q => q) : spinFn(m), p = markPoints(m).map(f), col = colorFor(m) || m.color || C.red;
  const wk = exprMul(m.lwExpr), wmul = wk == null ? 1 : Math.abs(wk);   // vastagság-szorzó / width factor
  if (m.type === 'arrow') {
    const k = evalExpr(m.lenExpr), mul = k.ok ? k.v : 1;   // hossz-szorzó / length factor
    const a = p[0], b = [a[0] + (p[1][0] - a[0]) * mul, a[1] + (p[1][1] - a[1]) * mul];
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 2) return;
    if (m.label) D.vector(a[0], a[1], b[0] - a[0], b[1] - a[1], {stroke: col, lw: (m.lw ?? 3) * wmul}, interp(m.label));
    else D.arrow(a[0], a[1], b[0], b[1], {stroke: col, lw: (m.lw ?? 3) * wmul});
  } else if (m.type === 'loop' || m.type === 'path') {
    const k = evalExpr(m.flowExpr), sp = (+m.flow || 0) * (k.ok ? k.v : 1);   // áramlás-szorzó / flow factor
    let st = markRt.get(m.id);
    if (!st || R.t < st.t) { st = {pos: 0, t: R.t}; markRt.set(m.id, st); }
    st.pos += sp * (R.t - st.t); st.t = R.t;
    const o = {color: col, lw: (m.lw ?? (m.type === 'loop' ? 2 : 3)) * wmul, pos: st.pos, dir: sp};
    if (m.type === 'loop') D.flow(p, {...o, closed: true, arrowColor: shade(col, -0.2), spacing: Math.max(60, Math.PI * (m.rx + m.ry) / 4)});
    else D.flow(p, {...o, spacing: 60});
  } else if (m.type === 'text') {
    D.text(interp(m.text), p[0][0], p[0][1], {size: (m.size ?? 22) * wmul, bold: true, color: col, align: 'center', baseline: 'middle'});
  }
}
function drawMarks() {
  if (!g) return;
  for (const m of scene.marks) drawMark(m);
  // drafts and handles only while a tool is in use
  if (drag && drag.type === 'arrow') D.arrow(drag.a[0], drag.a[1], drag.b[0], drag.b[1], {stroke: C.red, lw: 3, alpha: 0.6});
  if (drag && drag.type === 'loop') {
    const c = [(drag.a[0] + drag.b[0]) / 2, (drag.a[1] + drag.b[1]) / 2];
    D.fieldLoop(c[0], c[1], Math.abs(drag.b[0] - drag.a[0]) / 2 + 1, Math.abs(drag.b[1] - drag.a[1]) / 2 + 1, 0, {alpha: 0.6, speed: 0});
  }
  if (pathDraft) D.polyline(hoverPt ? pathDraft.concat([hoverPt]) : pathDraft, {stroke: C.blue, lw: 2, dash: [5, 4], alpha: 0.8});
  if (markTool === 'move' || pivotFor) {
    for (const d of (R.bound ? R.bound.values() : [])) D.circle(+d.x || 0, +d.y || 0, 6, {fill: '#ffffff', stroke: '#7c5cd6', lw: 2});
    for (const m of scene.marks) {
      const c = markCenter(m);
      D.circle(c[0], c[1], 5, {fill: '#ffffff', stroke: C.accent || '#1f47c4', lw: 2});
      if (m.pivot && +m.spin) D.circle(m.pivot[0], m.pivot[1], 4, {fill: C.purple, stroke: null});
    }
  }
}
function stagePt(e) {
  const r = stageCv.getBoundingClientRect();
  return [(e.clientX - r.left) / stageK, (e.clientY - r.top) / stageK];
}
function addMark(m) {
  m.id = ++markId; scene.marks.push(m);
  renderMarkList(); scheduleAutosave();
}
function setTool(t) {
  markTool = markTool === t ? null : t;
  pathDraft = null; drag = null; pivotFor = null;
  $$('.tools .btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === markTool)));
  stageCv.classList.toggle('tool-on', !!markTool);
  updateToolHint();
}
function updateToolHint() {
  const map = {move: 'hMove', arrow: 'hArrow', loop: 'hLoop', path: 'hPath', text: 'hText', pick: 'hPick'};
  $('#toolHint').textContent = pivotFor ? T('hPivot') : (markTool ? T(map[markTool]) : '');
}
function finishPath() {
  if (pathDraft && pathDraft.length >= 2) addMark({type: 'path', pts: pathDraft.map(q => [r1(q[0]), r1(q[1])]), color: '#2f6fd6', lw: 3, flow: 60, spin: 0});
  pathDraft = null;
}
stageCv.addEventListener('pointerdown', e => {
  if (!markTool && !pivotFor) return;
  e.preventDefault();
  const p = stagePt(e);
  if (pivotFor) {
    const m = scene.marks.find(x => x.id === pivotFor);
    if (m) m.pivot = [r1(p[0]), r1(p[1])];
    pivotFor = null; stageCv.classList.toggle('tool-on', !!markTool); updateToolHint(); renderMarkList(); scheduleAutosave();
    return;
  }
  if (markTool === 'arrow' || markTool === 'loop') { drag = {type: markTool, a: p, b: p}; }
  else if (markTool === 'path') { if (!pathDraft) pathDraft = []; pathDraft.push(p); }
  else if (markTool === 'text') addMark({type: 'text', pts: [[r1(p[0]), r1(p[1])]], text: 'B', color: '#1d2430', size: 22, spin: 0});
  else if (markTool === 'pick') {
    const s = r1(p[0]) + ', ' + r1(p[1]);
    try { navigator.clipboard.writeText(s).then(() => toast(T('coordCopied') + ' ' + s), () => toast(s)); } catch (err) { toast(s); }
  } else if (markTool === 'move') {
    for (const d of (R.bound ? R.bound.values() : [])) {
      if (Math.hypot((+d.x || 0) - p[0], (+d.y || 0) - p[1]) < 30 / stageK + 10) { drag = {type: 'bmove', d, last: p}; break; }
    }
    if (drag) { try { stageCv.setPointerCapture(e.pointerId); } catch (err) { /* old browser */ } return; }
    let best = null, bd = 30 / stageK + 10;
    for (const m of scene.marks) {
      for (const q of markPoints(m).concat([markCenter(m)])) { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = m; } }
    }
    if (best) drag = {type: 'move', m: best, last: p};
  }
  try { stageCv.setPointerCapture(e.pointerId); } catch (err) { /* old browser */ }
});
stageCv.addEventListener('pointermove', e => {
  const p = stagePt(e);
  hoverPt = p;
  $('#markCoord').textContent = `x = ${r1(p[0])}   y = ${r1(p[1])}`;
  if (!drag) return;
  if (drag.type === 'bmove') { drag.d.x = (+drag.d.x || 0) + p[0] - drag.last[0]; drag.d.y = (+drag.d.y || 0) + p[1] - drag.last[1]; drag.last = p; return; }
  if (drag.type === 'move') {
    const dx = p[0] - drag.last[0], dy = p[1] - drag.last[1], m = drag.m;
    if (m.type === 'loop') m.c = [m.c[0] + dx, m.c[1] + dy]; else m.pts = m.pts.map(q => [q[0] + dx, q[1] + dy]);
    if (m.pivot) m.pivot = [m.pivot[0] + dx, m.pivot[1] + dy];
    drag.last = p;
  } else drag.b = p;
});
stageCv.addEventListener('pointerup', () => {
  if (!drag) return;
  const d = drag; drag = null;
  if (d.type === 'arrow' && Math.hypot(d.b[0] - d.a[0], d.b[1] - d.a[1]) > 6) {
    addMark({type: 'arrow', pts: [[r1(d.a[0]), r1(d.a[1])], [r1(d.b[0]), r1(d.b[1])]], color: '#d64045', lw: 3, label: '', spin: 0});
  } else if (d.type === 'loop' && Math.abs(d.b[0] - d.a[0]) > 8) {
    addMark({type: 'loop', c: [r1((d.a[0] + d.b[0]) / 2), r1((d.a[1] + d.b[1]) / 2)], rx: r1(Math.abs(d.b[0] - d.a[0]) / 2),
      ry: r1(Math.max(4, Math.abs(d.b[1] - d.a[1]) / 2)), angle: 0, color: '#c8963e', lw: 2, flow: 60, spin: 0});
  } else if (d.type === 'bmove') {
    d.d.x = r1(d.d.x); d.d.y = r1(d.d.y);
    setCodeProp('boundArrow', d.d.id, 'x', String(d.d.x)); setCodeProp('boundArrow', d.d.id, 'y', String(d.d.y));
    bSig = ''; renderBound(true);
  } else if (d.type === 'move') {
    const m = d.m;
    if (m.type === 'loop') m.c = m.c.map(r1); else m.pts = m.pts.map(q => q.map(r1));
    if (m.pivot) m.pivot = m.pivot.map(r1);
    scheduleAutosave();
  }
});
stageCv.addEventListener('dblclick', e => { if (markTool === 'path') { e.preventDefault(); if (pathDraft) pathDraft.pop(); finishPath(); } });
stageCv.addEventListener('pointerleave', () => { hoverPt = null; });

function renderMarkList() {
  const box = $('#markList');
  if (!scene.marks.length) { box.innerHTML = `<p class="muted">${esc(T('noMarks'))}</p>`; return; }
  box.innerHTML = '';
  const names = {arrow: 'mArrow', loop: 'mLoop', path: 'mPath', text: 'mText'};
  scene.marks.forEach((m, i) => {
    const el = document.createElement('div'); el.className = 'mark';
    const f = [];
    const num = (key, label, val, step = 1) => f.push(`<label>${esc(T(label))}<input type="number" data-k="${key}" step="${step}" value="${esc(val ?? 0)}"></label>`);
    const wide = (key, label, val, ph, expr) => f.push(`<label class="wide">${esc(T(label))}<input data-k="${key}"${expr ? ' data-expr="1"' : ''} value="${esc(val || '')}" placeholder="${esc(ph)}" spellcheck="false"></label>`);
    if (m.type === 'arrow') wide('label', 'fLabel', m.label, 'e = {e:1} V');
    if (m.type === 'text') wide('text', 'fLabel', m.text, 'n = {n:0} 1/min');
    if (m.type === 'loop' || m.type === 'path') wide('flowExpr', 'fFlowExpr', m.flowExpr, 'I / 5', true);
    if (m.type === 'text') num('size', 'fSize', m.size ?? 22); else num('lw', 'fWidth', m.lw ?? 2, 0.5);
    if (m.type === 'loop' || m.type === 'path') num('flow', 'fFlow', m.flow ?? 0, 5);
    if (m.type === 'loop') num('angle', 'fAngle', m.angle ?? 0, 1);
    num('spin', 'fSpin', m.spin ?? 0, 5);
    f.push(`<label>${esc(T('fMode'))}<select data-k="mode"><option value="plane">${esc(T('modePlane'))}</option><option value="axis"${m.mode === 'axis' ? ' selected' : ''}>${esc(T('modeAxis'))}</option></select></label>`);
    if (m.mode === 'axis') num('axis', 'fAxis', m.axis ?? 0, 5);
    f.push(`<button type="button" class="btn" data-a="pivot">${esc(T('fPivot'))}${m.pivot ? ` (${m.pivot[0]}, ${m.pivot[1]})` : ''}</button>`);
    el.innerHTML = `<div class="mark-h"><b>${i + 1}. ${esc(T(names[m.type]))}</b><span class="swatches">${SWATCH.map(c => `<button type="button" data-c="${c}" style="background:${c}" aria-label="${c}" aria-pressed="${String((m.color || '').toLowerCase() === c)}"></button>`).join('')}</span><button type="button" class="x" data-a="del" aria-label="${esc(T('del'))}">×</button></div><div class="mark-f">${f.join('')}</div>${bindHTML(m, 'data-k', m.type === 'arrow')}`;
    el.addEventListener('input', ev => {
      const k = ev.target.dataset.k; if (!k) return;
      const v = ev.target.type === 'number' ? parseFloat(ev.target.value) : ev.target.value;
      if (ev.target.type === 'color') { m[k] = v; scheduleAutosave(); return; }
      if (ev.target.type === 'number' && !isFinite(v)) return;
      m[k] = v; scheduleAutosave();
      if (ev.target.dataset.expr) ev.target.classList.toggle('bad', !evalExpr(v).ok);
      if (k === 'mode') renderMarkList();
    });
    el.addEventListener('click', ev => {
      const b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.c) { m.color = b.dataset.c; renderMarkList(); scheduleAutosave(); }
      else if (b.dataset.a === 'del') {
        const idx = scene.marks.indexOf(m); scene.marks.splice(idx, 1); renderMarkList(); scheduleAutosave();
        toast(T('del') + ': ' + T(names[m.type]), {label: T('undo'), fn: () => { scene.marks.splice(idx, 0, m); renderMarkList(); scheduleAutosave(); }});
      } else if (b.dataset.a === 'pivot') { pivotFor = m.id; stageCv.classList.add('tool-on'); updateToolHint(); }
    });
    box.appendChild(el);
  });
}
const KIND_T = {arrow: 'kArrow', vector: 'kVector', loop: 'kLoop', flow: 'kFlow', arrow3: 'kArrow3', flow3: 'kFlow3'};
// "Bind to a variable" fields: length, width, colour by value. attr = 'data-k' (user marks) or 'data-f' (code marks)
function bindHTML(o, attr, withLen) {
  const ex = (k, label, ph) => `<label class="wide">${esc(T(label))}<input ${attr}="${k}" data-expr="1" value="${esc(o[k] || '')}" placeholder="${esc(ph)}" spellcheck="false"></label>`;
  const open = ['lenExpr', 'lwExpr', 'colorExpr'].some(k => o[k] && String(o[k]).trim()) ? ' open' : '';
  return `<details class="bind"${open}><summary>${esc(T('fBind'))}</summary><div class="mark-f">` +
    (withLen ? ex('lenExpr', 'fLenExpr', 'e / P.U') : '') + ex('lwExpr', 'fLwExpr', '1 + abs(I) / 2') + ex('colorExpr', 'fColorExpr', 'I') +
    `<label>${esc(T('fCmin'))}<input type="number" step="any" ${attr}="cmin" value="${esc(o.cmin ?? 0)}"></label>` +
    `<label>${esc(T('fCmax'))}<input type="number" step="any" ${attr}="cmax" value="${esc(o.cmax ?? 1)}"></label>` +
    `<label>${esc(T('fC0'))}<input type="color" ${attr}="c0" value="${esc(o.c0 || '#2f6fd6')}"></label>` +
    `<label>${esc(T('fC1'))}<input type="color" ${attr}="c1" value="${esc(o.c1 || '#d64045')}"></label>` +
    `</div></details>`;
}
let cmSig = '';
function setOverride(key, k, v) {
  scene.overrides = scene.overrides || {};
  const o = scene.overrides[key] || (scene.overrides[key] = {});
  if (v === null || v === '' || ((k === 'lw' || k === 'scale') && v === 1)) delete o[k]; else o[k] = v;
  if (!Object.keys(o).length) delete scene.overrides[key];
  scheduleAutosave();
}
function renderCodeMarks(force) {
  if (!R || !R.reg) return;
  for (const [k, e] of R.reg) { const s0 = seenMarks.get(k); if (s0 && e.count > s0.max) s0.max = e.count; }
  const entries = [...seenMarks.entries()];
  const sig = LANG + '|' + entries.map(([k]) => k).join('|');   // csak új elem esetén épül újra / rebuilt only when a new item appears
  if (!force && (sig === cmSig || hlKey || $('#codeMarkList').contains(document.activeElement))) return;
  cmSig = sig;
  $('#cmCount').textContent = entries.length;
  const box = $('#codeMarkList'); box.innerHTML = '';
  const perKind = {};
  for (const [key, e] of entries) {
    const ov = (scene.overrides || {})[key] || {};
    const n = (perKind[e.kind] = (perKind[e.kind] || 0) + 1);
    const name = e.id ? key : (e.label || T(KIND_T[e.kind] || 'kArrow') + ' ' + n);
    const row = document.createElement('div'); row.className = 'cm'; row.dataset.key = key;
    const canScale = true, canLabel = e.kind === 'vector';
    row.innerHTML = `<div class="cm-h"><label><input type="checkbox" ${ov.hidden ? '' : 'checked'} data-f="show"><b>${esc(name)}</b><span class="kind">${esc(T(KIND_T[e.kind] || 'kArrow'))}${e.max > 1 ? ' ×' + e.max : ''}</span></label><span class="swatches">${SWATCH.map(c => `<button type="button" data-c="${c}" style="background:${c}" aria-label="${c}" aria-pressed="${String((ov.color || '') === c)}"></button>`).join('')}</span>${ov.color ? `<button type="button" class="rs" data-f="rc" title="${esc(T('cmOrig'))}">↺</button>` : ''}</div>
<div class="mark-f"><label>${esc(T('cmWidth'))}<input type="number" step="0.1" min="0" data-f="lw" value="${ov.lw ?? 1}"></label>${canScale ? `<label>${esc(T('cmScale'))}<input type="number" step="0.1" data-f="scale" value="${ov.scale ?? 1}"></label>` : ''}${canLabel ? `<label class="wide">${esc(T('cmLabel'))}<input data-f="label" value="${esc(ov.label || '')}" placeholder="${esc(e.label)}"></label>` : ''}</div>${bindHTML(ov, 'data-f', true)}`;
    row.addEventListener('mouseenter', () => { hlKey = key; row.classList.add('on'); });
    row.addEventListener('mouseleave', () => { if (hlKey === key) hlKey = null; row.classList.remove('on'); });
    row.addEventListener('focusin', () => { hlKey = key; row.classList.add('on'); });
    row.addEventListener('focusout', () => { if (hlKey === key) hlKey = null; row.classList.remove('on'); });
    row.addEventListener('input', ev => {
      const f = ev.target.dataset.f; if (!f) return;
      if (f === 'show') setOverride(key, 'hidden', ev.target.checked ? null : true);
      else if (f === 'label' || f === 'c0' || f === 'c1') setOverride(key, f, ev.target.value);
      else if (ev.target.dataset.expr) { setOverride(key, f, ev.target.value); ev.target.classList.toggle('bad', !!ev.target.value.trim() && !evalExpr(ev.target.value).ok); }
      else { const v = parseFloat(ev.target.value); if (isFinite(v)) setOverride(key, f, v); }
    });
    row.addEventListener('click', ev => {
      const b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.c) setOverride(key, 'color', b.dataset.c);
      else if (b.dataset.f === 'rc') setOverride(key, 'color', null);
      renderCodeMarks(true);
    });
    box.appendChild(row);
  }
}
$('#cmReset').addEventListener('click', () => {
  const keep = scene.overrides || {}; scene.overrides = {}; renderCodeMarks(true); scheduleAutosave();
  toast(T('cmReset'), {label: T('undo'), fn: () => { scene.overrides = keep; renderCodeMarks(true); scheduleAutosave(); }});
});

function arrowDecl(m, id) {
  const [a, b] = m.pts, dx = b[0] - a[0], dy = b[1] - a[1];
  const L0 = Math.round(Math.hypot(dx, dy)), ang = Math.round(Math.atan2(-dy, dx) * 180 / Math.PI);
  const has = k => m[k] != null && String(m[k]).trim() !== '';
  const P2 = [[`x: ${a[0]}, y: ${a[1]}`, LANG === 'hu' ? 'kezdőpont (px)' : 'start point (px)'],
              [`angle: ${ang}`, LANG === 'hu' ? 'irány fokban (0 = jobbra, 90 = fel)' : 'direction in degrees (0 = right, 90 = up)'],
              [`length: ${has('lenExpr') ? JSON.stringify(L0 + ' * (' + m.lenExpr + ')') : L0}`, LANG === 'hu' ? 'hossz px-ben' : 'length in px'],
              [`width: ${has('lwExpr') ? JSON.stringify((m.lw ?? 3) + ' * abs(' + m.lwExpr + ')') : (m.lw ?? 3)}`, LANG === 'hu' ? 'vastagság px-ben' : 'width in px']];
  if (has('colorExpr')) {
    P2.push([`color: ${JSON.stringify(m.c0 || '#2f6fd6')}, colorBy: ${JSON.stringify(m.colorExpr)}`, LANG === 'hu' ? 'szín és amitől függ' : 'colour and what it follows']);
    P2.push([`colorMin: ${+m.cmin || 0}, colorMax: ${isFinite(+m.cmax) ? +m.cmax : 1}, colorTo: ${JSON.stringify(m.c1 || '#d64045')}`, LANG === 'hu' ? 'határok, szín a felső határnál' : 'limits, colour at the upper limit']);
  } else P2.push([`color: ${JSON.stringify(m.color || '#d64045')}`, LANG === 'hu' ? 'szín' : 'colour']);
  if (has('label')) P2.push([`label: ${JSON.stringify(m.label)}`, LANG === 'hu' ? 'felirat; {név:1} = érték' : 'label; {name:1} = value']);
  return `boundArrow(${JSON.stringify(id)}, {\n` + P2.map(([c, n], i) => `  ${c}${i < P2.length - 1 ? ',' : ''}`.padEnd(46) + `// ${n}`).join('\n') + '\n});';
}
function marksCode() {
  const top = [];
  const used = new Set(R && R.bound ? R.bound.keys() : []);
  let n = 1;
  for (const m of scene.marks) if (m.type === 'arrow') {
    let id; do { id = (LANG === 'hu' ? 'nyíl ' : 'arrow ') + n++; } while (used.has(id));
    used.add(id); top.push(arrowDecl(m, id));
  }
  const others = scene.marks.filter(m => m.type !== 'arrow');
  if (!others.length) return '// ' + (LANG === 'hu' ? 'Jelölők (a Jelölők fülön is szerkeszthetők)' : 'Markup (also editable on the Markup tab)') + '\n' + top.join('\n');
  const L = ['// ' + (LANG === 'hu' ? 'Jelölők' : 'Markup')].concat(top, ['draw(t => {']);
  const keys = valKeys();
  if (keys.length) L.push(`  const {${keys.join(', ')}} = vals();   // val(...) ${LANG === 'hu' ? 'értékek' : 'values'}`);
  const sp = (m) => m.flowExpr && String(m.flowExpr).trim() ? `${m.flow || 0} * (${m.flowExpr})` : `${m.flow || 0}`;
  for (const m of others) {
    const col = JSON.stringify(m.color || '#d64045');
    if (m.type === 'loop') L.push(`  fieldLoop(${m.c[0]}, ${m.c[1]}, ${m.rx}, ${m.ry}, deg(${m.angle || 0}), {speed: ${sp(m)}, color: ${col}, lw: ${m.lw ?? 2}});`);
    else if (m.type === 'path') L.push(`  flow(${JSON.stringify(m.pts)}, {speed: ${sp(m)}, color: ${col}, lw: ${m.lw ?? 3}, spacing: 60});`);
    else if (m.type === 'text') L.push(`  text(${interpCode(m.text)}, ${m.pts[0][0]}, ${m.pts[0][1]}, {size: ${m.size ?? 22}, bold: true, color: ${col}, align: "center", baseline: "middle"});`);
    if (+m.spin) L.push(`  // ${LANG === 'hu' ? 'forgás' : 'spin'}: ${m.spin} °/s, ${m.mode === 'axis' ? 'axis' : 'plane'}, pivot ${JSON.stringify(m.pivot || markCenter(m).map(r1))}`);
  }
  L.push('});');
  return L.join('\n');
}
$$('.tools .btn').forEach(b => b.addEventListener('click', () => setTool(b.dataset.tool)));
$('#marksCopy').addEventListener('click', async () => {
  const s = marksCode();
  try { await navigator.clipboard.writeText(s); toast(T('copied') + ' ' + scene.marks.length); } catch (e) { toast(T('saveFail')); }
});
$('#marksToCode').addEventListener('click', () => {
  if (!scene.marks.length) return;
  const prev = JSON.parse(JSON.stringify(sceneData()));
  const ta = $('#code'); ta.value = ta.value.replace(/\s*$/, '') + '\n\n' + marksCode() + '\n';
  scene.marks = []; renderMarkList(); updateGutter(); runCode();
  toast(T('marksMoved'), {label: T('undo'), fn: () => loadScene(prev)});
});
$('#marksClear').addEventListener('click', () => {
  if (!scene.marks.length) return;
  const keep = scene.marks; scene.marks = []; renderMarkList(); scheduleAutosave();
  toast(T('marksCleared'), {label: T('undo'), fn: () => { scene.marks = keep; renderMarkList(); scheduleAutosave(); }});
});

