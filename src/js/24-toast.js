/* ───────────── toast ───────────── */
let toastTimer = null;
function toast(msg, action) {
  const el = $('#toast'); el.innerHTML = '';
  const s = document.createElement('span'); s.textContent = msg; el.appendChild(s);
  if (action) {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = action.label;
    b.addEventListener('click', () => { el.hidden = true; action.fn(); }); el.appendChild(b);
  }
  el.hidden = false; clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, action ? 7000 : 3500);
}

