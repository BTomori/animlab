/* ───────────── transport ───────────── */
const PLAY_SVG = '<svg viewBox="0 0 24 24"><path d="M7 5v14l11-7z" fill="currentColor"/></svg>';
const PAUSE_SVG = '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>';
function setPlaying(p) {
  playing = p;
  const b = $('#btPlay'); b.innerHTML = p ? PAUSE_SVG : PLAY_SVG;
  const cp = $('#cvPlay'); if (cp) cp.innerHTML = p ? PAUSE_SVG : PLAY_SVG;
  b.title = T(p ? 'pause' : 'play'); b.setAttribute('aria-label', b.title);
}
function fmtSpeed(s) { return fmt(s, s >= 1 ? 2 : s >= 0.1 ? 2 : 3) + '×'; }
function setSpeed(s) {
  speed = clamp(s, Math.pow(2, -10), 2);
  $('#speed').value = Math.log2(speed);
  $('#speedOut').textContent = fmtSpeed(speed);
  scene.timeScale = speed;
}

