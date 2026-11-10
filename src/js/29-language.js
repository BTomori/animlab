/* ───────────── language ───────────── */
function applyLang() {
  document.documentElement.lang = LANG;
  $$('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
  $$('[data-i18n-title]').forEach(el => { el.title = T(el.dataset.i18nTitle); el.setAttribute('aria-label', el.title); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = T(el.dataset.i18nPh); });
  $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === LANG)));
  if (R) { buildControls(true); R.readouts.clear(); renderReadouts(true); if (R.error) showError(R.error); }
  galRender();
  renderHelp(); renderAssets(); renderMarkList(); updateToolHint(); updateRecUI(); setPlaying(playing); setSpeed(speed); updateCodeState();
}

