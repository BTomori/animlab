/* ───────────── wiring ───────────── */
function selectTab(name) {
  $$('.tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
  $$('.tab-panel').forEach(p => { p.hidden = p.id !== 'tab-' + name; });
  store.set('tab', name);
  if (curTab !== name || !document.documentElement.style.getPropertyValue('--side-w')) { curTab = name; applySideWidth(sideWidthFor(name)); }
  if (name === 'code') updateGutter();
  if (name === 'marks') { renderCodeMarks(true); renderBound(true); }
  if (name !== 'marks' && markTool) setTool(markTool);
}
$$('.tabs button').forEach(b => b.addEventListener('click', () => selectTab(b.dataset.tab)));
$$('.lang button').forEach(b => b.addEventListener('click', () => { LANG = b.dataset.lang; store.set('lang', LANG); applyLang(); }));

$('#btPlay').addEventListener('click', () => setPlaying(!playing));
$('#btStep').addEventListener('click', () => { setPlaying(false); stepReq = true; });
$('#btReset').addEventListener('click', () => { needsRerun = true; });
$('#btFull').addEventListener('click', async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await $('#stageCol').requestFullscreen(); } catch (e) { /* refused */ }
});

/* ── nézetek: asztali, mobil, csak-vászon / views: desktop, mobile, canvas only ── */
// Mobil: keskeny képernyő, vagy érintőképernyő alacsony (fekvő) ablakkal. / Mobile: a narrow screen, or touch with a low (landscape) window.
const mqMobile = window.matchMedia('(max-width: 900px), (pointer: coarse) and (max-height: 560px)');
let mview = store.get('mview') || 'canvas';     // mobilon látható képernyő / screen shown on mobile: canvas | controls | code | assets | marks | help
let pseudoFull = false;                          // csak-vászon CSS-sel, ahol nincs teljes képernyős API (iPhone) / CSS canvas-only where there is no fullscreen API
let landscapeAuto = true;                        // fekvő telefonon a vászon nézet magától csak-vászon / in landscape the canvas view turns canvas-only by itself
function isLandscape() { return window.innerWidth > window.innerHeight; }
function canvasOnly() { return document.fullscreenElement === $('#stageWrap') || document.body.classList.contains('cvonly'); }
function updateMode() {
  const b = document.body, mob = mqMobile.matches;
  b.classList.toggle('mobile', mob);
  b.dataset.mview = mob ? mview : 'canvas';
  if (!isLandscape()) landscapeAuto = true;      // álló helyzetben újra élesedik / re-armed in portrait
  const cv = pseudoFull || (mob && mview === 'canvas' && isLandscape() && landscapeAuto && !document.fullscreenElement);
  b.classList.toggle('cvonly', cv);
  $$('.mnav button').forEach(x => x.setAttribute('aria-current', String(x.dataset.view === mview)));
  if (!mob) $('.topbar').classList.remove('open');
  if (canvasOnly()) showOverlay();
  setTimeout(layoutStage, 30);
}
function setMview(v) {
  mview = v; store.set('mview', v);
  if (v !== 'canvas') selectTab(v);
  updateMode();
  const lay = $('.layout'); if (lay) lay.scrollTop = 0;
}
$$('.mnav button').forEach(x => x.addEventListener('click', () => setMview(x.dataset.view)));
$('#btnMore').addEventListener('click', () => {
  const tb = $('.topbar'), open = !tb.classList.contains('open');
  tb.classList.toggle('open', open); $('#btnMore').setAttribute('aria-expanded', String(open));
  setTimeout(layoutStage, 30);
});
(mqMobile.addEventListener ? mqMobile.addEventListener('change', updateMode) : mqMobile.addListener(updateMode));
window.addEventListener('orientationchange', () => setTimeout(updateMode, 200));

// Csak a vászon teljes képernyőn; telefonon fekvő helyzetbe is fordít, ha a böngésző engedi.
// Ahol nincs teljes képernyős API (iPhone), CSS-sel tölti ki az ablakot.
// Canvas only, full screen; on a phone it also turns to landscape where the browser allows it.
// Where there is no fullscreen API (iPhone), CSS fills the window instead.
async function enterCanvasOnly() {
  const w = $('#stageWrap');
  if (w.requestFullscreen && document.fullscreenEnabled !== false) {
    try {
      await w.requestFullscreen({navigationUI: 'hide'});
      if (mqMobile.matches && screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
      return;
    } catch (e) { /* refused: fall back to CSS */ }
  }
  pseudoFull = true; updateMode();
}
async function exitCanvasOnly() {
  if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch (e) { /* ignore */ } }
  try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) { /* ignore */ }
  if (pseudoFull) pseudoFull = false;
  else if (document.body.classList.contains('cvonly')) landscapeAuto = false;   // fekvő telefonon: vissza a normál vászon nézetbe / landscape phone: back to the normal canvas view
  updateMode();
}
$('#btCanvasFull').addEventListener('click', () => { if (canvasOnly()) exitCanvasOnly(); else enterCanvasOnly(); });
$('#cvExit').addEventListener('click', exitCanvasOnly);
$('#cvPlay').addEventListener('click', () => { setPlaying(!playing); showOverlay(); });
$('#cvReset').addEventListener('click', () => { needsRerun = true; showOverlay(); });
$('#cvMenu').addEventListener('click', async () => {
  pseudoFull = false; landscapeAuto = false;
  if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch (e) { /* ignore */ } }
  if (mqMobile.matches) setMview('controls'); else updateMode();
});
// A lebegő gombok érintésre / egérmozgásra előjönnek, 3 s után elhalványulnak
// The floating buttons appear on touch / mouse movement and fade after 3 s
let ovTimer = 0;
function showOverlay() {
  const o = $('#cvOverlay'); o.classList.add('show');
  clearTimeout(ovTimer); ovTimer = setTimeout(() => o.classList.remove('show'), 3000);
}
['pointerdown', 'pointermove'].forEach(ev => $('#stageWrap').addEventListener(ev, () => { if (canvasOnly()) showOverlay(); }));
document.addEventListener('fullscreenchange', () => { updateMode(); setTimeout(layoutStage, 80); });

// A grafikonsáv magassága: az elválasztó húzásával (fel = nagyobb grafikonok), nyilakkal, dupla kattintás = alap
// Graph strip height: drag the handle (up = taller graphs), arrow keys, double-click = default
(function () {
  const hs = $('#plotSplit');
  let y0 = 0, h0 = 0, drag = false;
  const setLane = h => { plotLaneH = clamp(Math.round(h), 24, 240); drawPlots(); };
  hs.addEventListener('pointerdown', e => {
    drag = true; y0 = e.clientY; h0 = plotLaneH; hs.classList.add('drag'); document.body.classList.add('resizing-v');
    try { hs.setPointerCapture(e.pointerId); } catch (err) { /* old browser */ } e.preventDefault();
  });
  hs.addEventListener('pointermove', e => {
    if (!drag) return;
    const lanes = Math.max(1, plotCount);
    setLane(h0 + (y0 - e.clientY) / lanes);
  });
  const end = () => { if (!drag) return; drag = false; hs.classList.remove('drag'); document.body.classList.remove('resizing-v'); store.set('plotLaneH', String(plotLaneH)); };
  hs.addEventListener('pointerup', end); hs.addEventListener('pointercancel', end);
  hs.addEventListener('dblclick', () => { setLane(64); store.set('plotLaneH', '64'); });
  hs.addEventListener('keydown', e => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault(); e.stopPropagation();
    setLane(plotLaneH + (e.key === 'ArrowUp' ? 8 : -8)); store.set('plotLaneH', String(plotLaneH));
  });
})();
$('#speed').addEventListener('input', e => { setSpeed(Math.pow(2, +e.target.value)); scheduleAutosave(); });
$('#speed').addEventListener('dblclick', () => setSpeed(1));

// Új: üres jelenet, és rögtön a Kód fül nyílik / New: an empty scene, and the Code tab opens right away
$('#btnNew').addEventListener('click', () => {
  loadScene({name: T('newScene'), script: BLANK}, {undo: true});
  if (mqMobile.matches) setMview('code'); else selectTab('code');
});
$('#btnOpen').addEventListener('click', () => $('#fileOpen').click());
$('#fileOpen').addEventListener('change', e => { const f = e.target.files[0]; if (f) openFile(f); e.target.value = ''; });
$('#btnSave').addEventListener('click', () => {
  scene.script = $('#code').value;
  saveFile(fileBase() + '.animlab.json', JSON.stringify(sceneData(), null, 1), 'application/json');
});
const menu = $('#exportMenu'), menuBtn = $('#btnExport');
function closeMenu() { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); }
menuBtn.addEventListener('click', e => { e.stopPropagation(); menu.hidden = !menu.hidden; menuBtn.setAttribute('aria-expanded', String(!menu.hidden)); });
document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target)) closeMenu(); });
$('#exVideo').addEventListener('click', () => { closeMenu(); toggleRecord(); });
recBadge.addEventListener('click', () => { if (rec) rec.stop(); });
$('#exPng').addEventListener('click', () => {
  closeMenu();
  stageCv.toBlob(b => { if (b) saveFile(fileBase() + '.png', b, 'image/png'); }, 'image/png');
});
$('#exHtml').addEventListener('click', () => {
  closeMenu();
  scene.script = $('#code').value;
  saveFile(fileBase() + '.html', buildStandalone(), 'text/html');
});
// Megosztás: a telefon megosztó menüjével küldi el az önálló HTML-fájlt (a címzett böngészőben megnyitja,
// az AnimLab Megnyitás gombjával pedig szerkesztheti). Ahol ez nem megy, letöltjük a fájlt.
// Share: sends the standalone HTML file through the device's share sheet (the recipient opens it in a browser,
// or edits it with AnimLab's Open button). Where that is not possible, the file is downloaded instead.
$('#exShare').addEventListener('click', async () => {
  closeMenu();
  scene.script = $('#code').value;
  const name = fileBase() + '.html', html = buildStandalone();
  try {
    const file = new File([html], name, {type: 'text/html'});
    if (navigator.canShare && navigator.canShare({files: [file]})) {
      await navigator.share({files: [file], title: scene.name || 'AnimLab', text: tr({hu: 'AnimLab-jelenet – nyisd meg böngészőben.', en: 'AnimLab scene – open it in a browser.'})});
      return;
    }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  await saveFile(name, html, 'text/html');
  toast(T('shareSaved') + ' ' + name);
});
$('#sceneName').addEventListener('input', e => { scene.name = e.target.value; scheduleAutosave(); });
$('#imgIn').addEventListener('change', async e => { for (const f of e.target.files) await addImageFile(f); e.target.value = ''; });
$('#stageErr').addEventListener('click', () => { selectTab('code'); gotoLine(+$('#codeErr').dataset.line); });
$('#codeErr').addEventListener('click', () => gotoLine(+$('#codeErr').dataset.line));
$('#btRun').addEventListener('click', runCode);
$('#help').addEventListener('click', async e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.jump) { const t = $('#help-' + b.dataset.jump); if (t) t.scrollIntoView({block: 'start'}); return; }
  if (b.dataset.ai) {
    const txt = $('#ai-instructions').textContent.replace(/^\n/, '');
    if (b.dataset.ai === 'save') { saveFile('animlab-ai-instructions.md', txt, 'text/markdown'); return; }
    try { await navigator.clipboard.writeText(txt); toast(LANG === 'hu' ? 'Kimásolva: AI-utasítások' : 'Copied: AI instructions'); }
    catch (err) {
      // Ha a böngésző nem engedi a vágólapot, megmutatjuk kijelölve / if the clipboard is blocked, show it selected
      const ta = $('#aiText'); ta.value = txt; ta.hidden = false; ta.focus(); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (_) { /* ignore */ }
      toast(ok ? (LANG === 'hu' ? 'Kimásolva: AI-utasítások' : 'Copied: AI instructions') : (LANG === 'hu' ? 'Kijelölve – másold ki a menüből vagy Ctrl+C-vel.' : 'Selected – copy it with Ctrl+C or the menu.'));
    }
    return;
  }
  const i = b.dataset.try ?? b.dataset.copyex;
  if (i == null) return;
  const s = GUIDE[+i], codeText = guideCode(s.code) + '\n';
  if (b.dataset.try != null) {
    loadScene({name: (LANG === 'hu' ? 'Útmutató ' : 'Guide ') + (+i + 1) + ' – ' + s.t[LANG], script: codeText}, {undo: true});
    selectTab('code');
  } else {
    try { await navigator.clipboard.writeText(codeText); toast(T('copied') + ' ' + s.t[LANG]); }
    catch (err) { const pre = b.closest('.lesson').querySelector('pre'); const r = document.createRange(); r.selectNodeContents(pre); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
  }
});

const code = $('#code');
code.addEventListener('input', () => { scene.script = code.value; updateGutter(); updateCodeState(); scheduleAutosave(); });
code.addEventListener('scroll', () => { $('#gutter').scrollTop = code.scrollTop; });
code.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runCode(); return; }
  if (e.key === 'Tab') {
    e.preventDefault();
    const s = code.selectionStart, en = code.selectionEnd;
    code.setRangeText('  ', s, en, 'end'); code.dispatchEvent(new Event('input'));
  } else if (e.key === 'Enter' && !e.shiftKey) {
    const s = code.selectionStart, before = code.value.slice(0, s);
    const lineStart = before.lastIndexOf('\n') + 1;
    let indent = (before.slice(lineStart).match(/^\s*/) || [''])[0];
    if (/[{([]\s*$/.test(before)) indent += '  ';
    e.preventDefault();
    code.setRangeText('\n' + indent, s, code.selectionEnd, 'end'); code.dispatchEvent(new Event('input'));
  }
});

document.addEventListener('keydown', e => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) && e.target.type !== 'range' && e.target.type !== 'checkbox';
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); $('#btnSave').click(); return; }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') { e.preventDefault(); $('#btnOpen').click(); return; }
  // Nyitott galériánál a billentyűk nem jutnak a jelenethez; az Esc bezárja / with the gallery open, keys do not reach the scene; Esc closes it
  if (gal.open) { if (e.key === 'Escape') { e.preventDefault(); galSetOpen(false); } return; }
  kbShift = e.shiftKey;
  if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = evKey(e);
  // a kijelölt csúszkát és az elválasztókat a nyilak a böngészőben állítják / a focused slider or splitter keeps its own arrow keys
  if (/^(Arrow|Home$|End$|Page)/.test(k) && (e.target.type === 'range' || (e.target.getAttribute && e.target.getAttribute('role') === 'separator'))) return;
  if (k === 'Escape') { setKbList(false); if (pseudoFull) exitCanvasOnly(); closeMenu(); if (pathDraft) pathDraft = null; if (pivotFor) { pivotFor = null; updateToolHint(); } if (kbSel) kbSelect(null); }
  // 1–2. a jelenet billentyűi nyernek / the scene's own keys win
  if (sceneOwns(k)) { e.preventDefault(); pressKey(k, e.shiftKey); return; }
  if (k === 'Escape') return;
  if (k === '?') { if (!e.repeat) setKbList(!kbListOpen); return; }
  // 3. 1–9 kiválaszt egy csúszkát, a nyilak állítják, 0 = kész / 1–9 picks a slider, the arrows move it, 0 = done
  if (/^[1-9]$/.test(k)) { const d = rangeDefs()[+k - 1]; if (d) { e.preventDefault(); kbSelect(d.id); } return; }
  if (k === '0') { if (kbSel) kbSelect(null); return; }
  // Q W E T Z U I O: a saját billentyű nélküli kapcsolók be / ki / switches without a key of their own, on / off
  const tg = toggleForKey(k);
  if (tg) { if (!e.repeat) { setP(tg.id, !R.P[tg.id]); syncControls(); flashCtl(ctlEls[tg.id] && ctlEls[tg.id].row); } return; }
  if (kbSel && /^Arrow(Left|Right|Up|Down)$/.test(k)) { e.preventDefault(); pressNav(k, e.shiftKey); return; }
  // lejátszás / transport
  if (k === ' ') { e.preventDefault(); if (!e.repeat) setPlaying(!playing); }
  else if (k === 'p') { if (!e.repeat) setPlaying(!playing); }
  else if (k === 'r') { if (!e.repeat) needsRerun = true; }
  else if (k === 'ArrowRight') { setPlaying(false); stepReq = true; }
  else if (k === 'Enter' && pathDraft) finishPath();
});
document.addEventListener('keyup', e => { kbShift = e.shiftKey; releaseKey(evKey(e)); if (e.key && e.key.length === 1) releaseKey(normKey(e.key)); });
window.addEventListener('blur', releaseAll);
document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAll(); });

window.addEventListener('dragover', e => { e.preventDefault(); });
window.addEventListener('drop', async e => {
  e.preventDefault();
  for (const f of e.dataTransfer.files) {
    if (/json$/i.test(f.name) || f.type === 'application/json') await openFile(f);
    else if (/^image\//.test(f.type)) { await addImageFile(f); selectTab('assets'); }
  }
});
window.addEventListener('resize', () => { updateMode(); if (!mqMobile.matches) applySideWidth(sideWidthFor(curTab)); layoutStage(); readTokens(); });
if (window.ResizeObserver) new ResizeObserver(() => layoutStage()).observe($('#stageWrap'));
try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readTokens); } catch (e) { /* old browser */ }
new MutationObserver(readTokens).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});

