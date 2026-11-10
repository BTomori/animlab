/* ───────────── controls panel ───────────── */
function setP(id, v) {
  R.P[id] = v; scene.params[id] = v;
  if (R.resetOn.has(id)) needsRerun = true;
  scheduleAutosave();
}
function buildControls(force) {
  const sig = LANG + '|' + JSON.stringify(R.defs.map(d => [d.kind, d.id, tr(d.label), d.min, d.max, d.step, d.unit, d.options && d.options.map(o => tr(o[1])), d.keys]));
  if (!force && sig === ctlSig) { syncControls(); return; }
  ctlSig = sig; ctlEls = {};
  const box = $('#controls'); box.innerHTML = '';
  if (!R.defs.length) { box.innerHTML = `<p class="muted">${esc(T('noParams'))}</p>`; return; }
  const btnRow = document.createElement('div'); btnRow.className = 'ctl-buttons';
  let nRange = 0;
  R.defs.forEach((d, idx) => {
    const uid = 'ctl_' + idx;
    if (d.kind === 'range') {
      const row = document.createElement('div'); row.className = 'ctl'; row.dataset.id = d.id;
      // 1–9: a csúszka sorszáma billentyűzethez / number of the slider for the keyboard (1–9, then ← →)
      const n = ++nRange, num = n <= 9 ? `<span class="kbn" title="${esc(T('kbNumTip').replace('{n}', n))}">${n}</span>` : '';
      row.innerHTML = `<div class="ctl-head"><label for="${uid}">${num}${esc(tr(d.label))}${kbdBadges(d.keys)}</label><span class="ctl-num"><input type="number" id="${uid}_n" aria-label="${esc(tr(d.label))}" step="${d.step}" min="${d.min}" max="${d.max}"><span class="unit">${esc(d.unit)}</span></span></div><input type="range" id="${uid}" min="${d.min}" max="${d.max}" step="${d.step}">`;
      const sl = $('input[type=range]', row), nm = $('input[type=number]', row);
      sl.value = R.P[d.id]; nm.value = roundStep(R.P[d.id], d.step);
      sl.addEventListener('input', () => { const v = +sl.value; setP(d.id, v); nm.value = roundStep(v, d.step); });
      nm.addEventListener('change', () => {
        let v = parseFloat(String(nm.value).replace(',', '.'));
        if (!isFinite(v)) v = R.P[d.id];
        v = clamp(v, d.min, d.max); setP(d.id, v); sl.value = v; nm.value = roundStep(v, d.step);
      });
      ctlEls[d.id] = {kind: 'range', sl, nm, step: d.step, row};
      if (kbSel === d.id) row.classList.add('kbsel');
      box.appendChild(row);
    } else if (d.kind === 'toggle') {
      const row = document.createElement('label'); row.className = 'ctl ctl-toggle'; row.htmlFor = uid;
      row.innerHTML = `<input type="checkbox" id="${uid}"><span>${esc(tr(d.label))}${kbdBadges(d.keys)}</span>`;
      const cb = $('input', row); cb.checked = !!R.P[d.id];
      cb.addEventListener('change', () => setP(d.id, cb.checked));
      ctlEls[d.id] = {kind: 'toggle', cb, row};
      box.appendChild(row);
    } else if (d.kind === 'choice') {
      const row = document.createElement('div'); row.className = 'ctl';
      row.innerHTML = `<div class="ctl-head"><label for="${uid}">${esc(tr(d.label))}${kbdBadges(d.keys)}</label></div><select id="${uid}">${d.options.map(o => `<option value="${esc(o[0])}">${esc(tr(o[1]))}</option>`).join('')}</select>`;
      const se = $('select', row); se.value = R.P[d.id];
      se.addEventListener('change', () => setP(d.id, se.value));
      ctlEls[d.id] = {kind: 'choice', se, row};
      box.appendChild(row);
    } else if (d.kind === 'button') {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.innerHTML = esc(tr(d.label)) + kbdBadges(d.keys);
      b.addEventListener('click', () => { const dd = R.defs[idx]; if (dd && dd.fn) safeCall(dd.fn); });
      ctlEls['\u0000b' + idx] = {kind: 'button', b};
      btnRow.appendChild(b);
    }
  });
  if (btnRow.children.length) box.prepend(btnRow);
  if (R.defs.some(d => d.kind !== 'button')) {
    const lb = document.createElement('button'); lb.type = 'button'; lb.className = 'link-btn'; lb.textContent = T('defaults');
    lb.addEventListener('click', () => { scene.params = {}; needsRerun = true; scheduleAutosave(); });
    box.appendChild(lb);
  }
}
function syncControls() {
  for (const id in ctlEls) {
    const e = ctlEls[id], v = R.P[id];
    if (v === undefined) continue;
    if (e.kind === 'range') { if (+e.sl.value !== v) e.sl.value = v; const nv = roundStep(v, e.step); if (document.activeElement !== e.nm && +e.nm.value !== nv) e.nm.value = nv; }
    else if (e.kind === 'toggle') e.cb.checked = !!v;
    else if (e.kind === 'choice') e.se.value = v;
  }
}
let lastRO = 0;
function renderVars() {
  if (!$('#tab-marks').hidden) { renderCodeMarks(false); renderBound(false); }
  const keys = valKeys(), pk = Object.keys(R.P);
  const s = T('varsLabel') + ' ' + (keys.length ? keys.join(', ') : '—') + (pk.length ? '   ·   P.' + pk.join(', P.') : '');
  const el = $('#markVars'); if (el && el.textContent !== s) el.textContent = s;
}
function renderReadouts(force) {
  const now = performance.now();
  if (!force && now - lastRO < 120) return;
  lastRO = now;
  renderVars();
  const box = $('#readouts');
  let html;
  if (!R.readouts.size) html = `<p class="muted">${esc(T('noReadouts'))}</p>`;
  else {
    html = '';
    for (const [k, r] of R.readouts) {
      const val = typeof r.v === 'number' ? fmt(r.v, r.d ?? (Number.isInteger(r.v) && Math.abs(r.v) < 1e9 ? 0 : undefined)) : String(r.v);
      html += `<div class="ro"><span class="ro-l">${esc(k)}</span><span class="ro-v">${esc(val)}${r.u ? `<span class="ro-u">${esc(r.u)}</span>` : ''}</span></div>`;
    }
  }
  if (html !== box._html) { box.innerHTML = html; box._html = html; }
}

