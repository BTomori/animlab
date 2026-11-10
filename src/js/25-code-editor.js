/* ───────────── code editor ───────────── */
function updateGutter() {
  const n = $('#code').value.split('\n').length;
  const gt = $('#gutter');
  if (gt._n !== n) { gt._n = n; let s = ''; for (let i = 1; i <= n; i++) s += i + '\n'; gt.textContent = s; }
  gt.scrollTop = $('#code').scrollTop;
}
function updateCodeState() {
  const el = $('#codeState'), dirty = $('#code').value !== lastRunScript;
  el.textContent = dirty ? T('codeDirty') : T('codeClean');
  el.classList.toggle('dirty', dirty);
}
function runCode() { scene.script = $('#code').value; seenMarks.clear(); cmSig = ''; runScene(); setPlaying(true); scheduleAutosave(); }

