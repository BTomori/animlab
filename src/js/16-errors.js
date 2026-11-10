/* ───────────── errors ───────────── */
function fail(e) {
  if (R) R.error = e;
  showError(e);
}
function showError(e) {
  const line = errLine(e);
  const msg = (e && e.message) || String(e);
  const ce = $('#codeErr');
  ce.classList.remove('warn'); ce.hidden = false; ce.dataset.line = line || '';
  ce.textContent = T('errScript') + (line ? ` (${T('errLine')} ${line})` : '') + ': ' + msg;
  const se = $('#stageErr'); se.hidden = false; se.textContent = T('errStage') + '  ' + msg;
}
function clearError() { const ce = $('#codeErr'); ce.hidden = true; ce.classList.remove('warn'); $('#stageErr').hidden = true; }
function gotoLine(n) {
  if (!n) return;
  const ta = $('#code'), lines = ta.value.split('\n');
  let pos = 0; for (let i = 0; i < n - 1 && i < lines.length; i++) pos += lines[i].length + 1;
  ta.focus(); ta.setSelectionRange(pos, pos + (lines[n - 1] || '').length);
  ta.scrollTop = Math.max(0, (n - 4) * parseFloat(getComputedStyle(ta).lineHeight));
}

