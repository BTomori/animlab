/* ───────────── scene API ───────────── */
function makeApi() {
  const M = Math;
  const api = {
    P: R.P, C,
    // Az utolsó objektum-argumentum beállítás: {keys: "q a"} (fel / le), {key: "s"}, {rate} – lásd: billentyűzet
    // The last object argument holds options: {keys: "q a"} (up / down), {key: "s"}, {rate} – see: keyboard
    param(id, label, ...rest) {
      let o = {}, min, max, value, step, unit;
      if (rest[0] && typeof rest[0] === 'object') { o = rest[0]; ({min, max, value, step, unit} = o); }
      else {
        const i = rest.findIndex(isOptObj);
        if (i >= 0) o = rest[i];
        [min, max, value, step, unit] = i >= 0 ? rest.slice(0, i) : rest;
      }
      min = +min; max = +max; value = +value;
      if (!isFinite(min) || !isFinite(max) || max <= min) throw new Error(`param("${id}"): min < max`);
      if (!isFinite(value)) value = min;
      if (!(step > 0)) step = niceStep((max - min) / 200);
      const saved = scene.params[id];
      const v = (typeof saved === 'number' && saved >= min && saved <= max) ? saved : clamp(value, min, max);
      R.defs.push({kind: 'range', id, label, min, max, step: +step, unit: unit || '', def: value, keys: parseKeys(o.keys ?? o.key), rate: +o.rate > 0 ? +o.rate : 0});
      R.P[id] = v; return v;
    },
    toggle(id, label, value = false, o) {
      if (isOptObj(value)) { o = value; value = o.value ?? false; }
      o = o || {};
      const saved = scene.params[id];
      const v = typeof saved === 'boolean' ? saved : !!value;
      R.defs.push({kind: 'toggle', id, label, def: !!value, keys: parseKeys(o.key ?? o.keys)});
      R.P[id] = v; return v;
    },
    choice(id, label, options, value, o) {
      if (isOptObj(value)) { o = value; value = o.value; }
      o = o || {};
      const opts = (options || []).map(o => Array.isArray(o) ? [String(o[0]), o[1] ?? o[0]] : [String(o), o]);
      const saved = scene.params[id];
      const v = opts.some(o => o[0] === saved) ? saved : String(value ?? (opts[0] && opts[0][0]));
      R.defs.push({kind: 'choice', id, label, options: opts, def: v, keys: parseKeys(o.key ?? o.keys)});
      R.P[id] = v; return v;
    },
    button(label, fn, o) {
      if (isOptObj(fn)) [fn, o] = [o, fn];
      o = o || {};
      R.defs.push({kind: 'button', label, fn, keys: parseKeys(o.key ?? o.keys)});
    },
    // Billentyűzet a jelenet kódjában / keyboard in the scene code ({label} = érintőgomb felirata / touch button text, {help} = leírás a billentyűlistában / text in the key list):
    //   key("ArrowLeft") igaz, amíg nyomva van / is true while held;  onKey(" ", fn) lenyomásonként egyszer fut / runs once per press
    key(k, o) {
      const ks = Array.isArray(k) ? k.map(normKey) : [normKey(k)];
      let down = false;
      for (const x of ks) {
        if (!R.keyPoll.has(x)) R.keyPoll.add(x);
        if (o && o.label != null && !R.keyLabel.has(x)) R.keyLabel.set(x, o.label);
        if (o && o.help != null && !R.keyHelp.has(x)) R.keyHelp.set(x, o.help);
        if (keysDown.has(x)) down = true;
      }
      return down;
    },
    onKey(k, fn, o) {
      if (typeof fn !== 'function') return;
      for (const x of (Array.isArray(k) ? k.map(normKey) : [normKey(k)])) {
        if (!R.keyOn.has(x)) R.keyOn.set(x, []);
        R.keyOn.get(x).push(fn);
        if (o && o.label != null && !R.keyLabel.has(x)) R.keyLabel.set(x, o.label);
        if (o && o.help != null && !R.keyHelp.has(x)) R.keyHelp.set(x, o.help);
      }
    },
    setParam(id, v) { setP(id, v); syncControls(); },
    resetOn(...ids) { ids.flat().forEach(i => R.resetOn.add(i)); },
    reset() { needsRerun = true; },
    title(x, o = {}) { R.title = x; if (o.color) R.titleColor = o.color; },
    stage(w = 1000, h = 600, bg) { R.stageW = Math.max(100, +w || 1000); R.stageH = Math.max(100, +h || 600); if (bg) R.bg = bg; },
    timeScale(s) { if (firstRun && s > 0) setSpeed(s); },
    plotWindow(s) { if (s > 0) R.plotWindow = s; },
    update(fn) { if (typeof fn === 'function') R.updates.push(fn); },
    draw(fn) { if (typeof fn === 'function') R.draws.push(fn); },
    show(label, value, unit = '', digits) { R.readouts.set(tr(label), {v: value, u: unit, d: digits}); },
    plot(label, value, o = {}) {
      const key = typeof label === 'object' ? (label.en || label.hu || JSON.stringify(label)) : String(label);
      if (!R.plots.has(key)) R.plots.set(key, {label, unit: o.unit || '', color: o.color || C.list[R.plots.size % C.list.length], min: o.min, max: o.max, group: o.group != null ? String(o.group) : '\u0000' + key, data: []});
      if (typeof value === 'number' && isFinite(value)) R.pending.set(key, value);
    },
    world: o => makeWorld(o), ball: o => makeBall(o), link: (a, b, o) => makeLink(a, b, o),
    drawWorld: () => drawWorldImpl(), wx, wy, ws,
    PI: M.PI, TAU: 2 * M.PI, sin: M.sin, cos: M.cos, tan: M.tan, asin: M.asin, acos: M.acos, atan: M.atan, atan2: M.atan2,
    sqrt: M.sqrt, cbrt: M.cbrt, abs: M.abs, min: M.min, max: M.max, pow: M.pow, exp: M.exp, log: M.log, log10: M.log10,
    floor: M.floor, ceil: M.ceil, round: M.round, sign: M.sign, hypot: M.hypot, random: M.random,
    deg: d => d * M.PI / 180, todeg: r => r * 180 / M.PI, clamp, lerp: (a, b, t) => a + (b - a) * t,
    mod: (a, n) => ((a % n) + n) % n, fmt, tr, lang: () => LANG,
    wrap: a => { const t = (a + M.PI) % (2 * M.PI); return (t < 0 ? t + 2 * M.PI : t) - M.PI; },
    complex: (re, im = 0) => new Cx(re, im), cpolar: (r, a) => new Cx(r * M.cos(a), r * M.sin(a)),
    phases: (amp, angle, phi = 0) => [0, 1, 2].map(k => amp * M.sin(angle + phi - k * 2 * M.PI / 3)),
    // Változóhoz kötött nyíl: a Jelölők fül megmutatja és visszaírja a beállításait ide a kódba
    // Arrow bound to variables: the Markup tab shows its settings and writes changes back into this code
    boundArrow(id, o = {}) {
      const d = {x: 0, y: 0, angle: 0, length: 100, width: 3, color: '#d64045', colorBy: '', colorMin: 0, colorMax: 1, colorTo: '#2f6fd6', label: '', hidden: false, ...o, id: String(id)};
      R.bound.set(d.id, d); return d;
    },
    val(name, v) { if (name && typeof name === 'object') Object.assign(R.vals, name); else R.vals[name] = v; return v; },
    vals: () => R.vals,
    view3d(o = {}) { Object.assign(V3, o); return V3; },
    p3: p => proj3(p).slice(0, 3), rot3, circle3,
    begin3() { flush3(); batch3 = []; },
    end3() { flush3(); },
    fieldVec(i, axes) {
      const ax = axes || [0, 2 * M.PI / 3, 4 * M.PI / 3];
      let x = 0, y = 0;
      for (let k = 0; k < 3; k++) { x += (i[k] || 0) * M.cos(ax[k]); y += (i[k] || 0) * M.sin(ax[k]); }
      return {x, y, mag: M.hypot(x, y), angle: M.atan2(y, x)};
    },
  };
  // Rajzoló parancsok csak a draw belsejében rajzolnak; máshol egyszer figyelmeztetünk
  // Drawing commands only draw inside draw; elsewhere we warn once
  for (const k of Object.keys(D)) {
    api[k] = (...a) => { if (!g) { warnOutside(k); return; } return D[k](...a); };
  }
  return api;
}

let compileMode = 'function';   // falls back to 'inject' if the page forbids eval
function compileScript(names, code) {
  if (compileMode === 'function') {
    try { return {fn: new Function(...names, '"use strict";' + code + '\n//# sourceURL=animlab-scene.js'), offset: 2}; }
    catch (e) {
      if (e instanceof SyntaxError) {
        const line = injectLineOf(names, code);
        if (line) e._line = line;
        throw e;
      }
      if (/eval|Content Security/i.test(String(e && e.message)) || (e && e.name === 'EvalError')) compileMode = 'inject';
      else throw e;
    }
  }
  return {fn: compileInject(names, code), offset: 0};
}
function compileInject(names, code) {
  window.__animlabFn = null;
  let err = null;
  const onErr = ev => { err = ev.error || new SyntaxError(ev.message); if (err && ev.lineno) err._line = ev.lineno; ev.preventDefault(); };
  window.addEventListener('error', onErr);
  const s = document.createElement('script');
  s.textContent = 'window.__animlabFn = function(' + names.join(',') + '){"use strict";' + code + '\n};\n//# sourceURL=animlab-scene.js';
  document.head.appendChild(s); s.remove();
  window.removeEventListener('error', onErr);
  if (err) throw err;
  if (typeof window.__animlabFn !== 'function') throw new Error('The scene could not be compiled.');
  const fn = window.__animlabFn; window.__animlabFn = null;
  return fn;
}
function injectLineOf(names, code) {
  try { compileInject(names, code); } catch (e) { return e._line || 0; }
  return 0;
}
let lineOffset = 2;
function errLine(e) {
  if (!e) return 0;
  if (e._line) return e._line;
  const m = String(e.stack || '').match(/animlab-scene\.js:(\d+)/);
  if (m) return Math.max(1, +m[1] - lineOffset);
  return 0;
}

let warnedOutside = new Set();
function warnOutside(name) {
  if (warnedOutside.has(name)) return;
  warnedOutside.add(name);
  const msg = tr({hu: `Figyelmeztetés: a(z) ${name}() a draw(t => { … }) blokkon kívül fut, ezért nem rajzol semmit. Tedd a draw belsejébe.`,
                  en: `Warning: ${name}() runs outside draw(t => { … }), so it draws nothing. Move it inside draw.`});
  const ce = $('#codeErr');
  if (ce.hidden || ce.classList.contains('warn')) { ce.hidden = false; ce.classList.add('warn'); ce.dataset.line = ''; ce.textContent = msg; }
  toast(msg);
}
function runScene() {
  warnedOutside = new Set();
  clearError();
  R = freshRuntime();
  Object.assign(V3, V3D); batch3 = null;
  const api = makeApi();
  let names = Object.keys(api);
  try {
    let compiled;
    // Ha a jelenet saját változót hoz létre egy parancs nevével (pl. const key = …), a saját változója nyer:
    // így az új parancsok (key, onKey, …) nem rontják el a régi jeleneteket
    // If the scene declares its own variable with a command's name (e.g. const key = …), its variable wins:
    // so new commands (key, onKey, …) never break older scenes
    for (let tries = 0; ; tries++) {
      try { compiled = compileScript(names, scene.script); break; }
      catch (e) {
        const m = tries < 30 && e instanceof SyntaxError && /Identifier '([\w$]+)' has already been declared|redeclaration of (?:formal parameter |let |const |class )?([\w$]+)/.exec(e.message || '');
        const nm = m && (m[1] || m[2]);
        if (nm && names.includes(nm)) { names = names.filter(n => n !== nm); continue; }
        throw e;
      }
    }
    lineOffset = compiled.offset;
    compiled.fn(...names.map(n => api[n]));
  } catch (e) { fail(e); }
  R.ctlKeys = buildCtlKeys();
  firstRun = false;
  lastRunScript = scene.script;
  acc = 0;
  buildControls();
  renderReadouts(true);
  layoutStage();
  updateCodeState();
}
function safeCall(fn) { try { fn(); } catch (e) { fail(e); } }

