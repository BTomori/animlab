/* ───────────── stage layout ───────────── */
function layoutStage() {
  if (!R) return;
  dpr = Math.max(1, window.devicePixelRatio || 1);
  const wrap = $('#stageWrap');
  let availW = wrap.clientWidth - 2;
  let availH = Infinity;
  const plotsH = $('#plotsWrap').hidden ? 0 : $('#plotsWrap').offsetHeight + 10;
  if (canvasOnly()) {
    // csak a vászon: kitölti a képernyőt / canvas only: fills the screen
    availW = wrap.clientWidth; availH = wrap.clientHeight;
  } else if (document.fullscreenElement) {
    availH = Math.max(120, window.innerHeight - $('.transport').offsetHeight - plotsH - 40);
  } else if (document.body.classList.contains('mobile')) {
    // mobil vászon nézet: fejléc, alsó sáv, vezérlősor és grafikonok nélküli hely / mobile canvas view: what is left
    availH = Math.max(140, window.innerHeight - $('.topbar').offsetHeight - $('#mnav').offsetHeight - $('.transport').offsetHeight - plotsH - 34);
  } else {
    availH = Math.max(200, window.innerHeight - $('.topbar').offsetHeight - $('.transport').offsetHeight - plotsH - 48);
  }
  const k = Math.max(0.05, Math.min(availW / R.stageW, availH / R.stageH));
  const cw = Math.floor(R.stageW * k), ch = Math.floor(R.stageH * k);
  stageCv.style.width = cw + 'px'; stageCv.style.height = ch + 'px';
  stageCv.width = Math.round(cw * dpr); stageCv.height = Math.round(ch * dpr);
  stageK = cw / R.stageW;
}

