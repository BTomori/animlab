/* ───────────── resizable side panel (wider by default on the Code tab) ───────────── */
let curTab = 'controls';
const wideTab = tab => tab === 'code' || tab === 'help';   // code and help examples get the wide panel
const sideKey = tab => wideTab(tab) ? 'sideWCode' : 'sideW';
function defaultSide(tab) { return wideTab(tab) ? Math.round(clamp(window.innerWidth * 0.46, 560, 860)) : 400; }
function applySideWidth(w) {
  const max = Math.max(320, window.innerWidth * 0.72);
  w = Math.round(clamp(w, 300, max));
  document.documentElement.style.setProperty('--side-w', w + 'px');
  layoutStage();
  return w;
}
function sideWidthFor(tab) { const v = +store.get(sideKey(tab)); return v > 0 ? v : defaultSide(tab); }
(function () {
  const sp = $('#splitter');
  let dragging = false;
  sp.addEventListener('pointerdown', e => { dragging = true; sp.classList.add('drag'); document.body.classList.add('resizing'); try { sp.setPointerCapture(e.pointerId); } catch (err) { /* old browser */ } e.preventDefault(); });
  sp.addEventListener('pointermove', e => {
    if (!dragging) return;
    const pad = parseFloat(getComputedStyle($('.layout')).paddingRight) || 12;
    applySideWidth(window.innerWidth - e.clientX - pad - 6);
  });
  const end = () => {
    if (!dragging) return; dragging = false; sp.classList.remove('drag'); document.body.classList.remove('resizing');
    store.set(sideKey(curTab), String(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--side-w'))));
  };
  sp.addEventListener('pointerup', end); sp.addEventListener('pointercancel', end);
  sp.addEventListener('dblclick', () => { try { localStorage.removeItem('animlab.' + sideKey(curTab)); } catch (e) { /* no storage */ } applySideWidth(defaultSide(curTab)); });
  sp.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault(); e.stopPropagation();
    const cur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--side-w')) || 400;
    store.set(sideKey(curTab), String(applySideWidth(cur + (e.key === 'ArrowLeft' ? 30 : -30))));
  });
})();

