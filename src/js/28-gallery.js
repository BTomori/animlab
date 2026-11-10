/* ───────────── gallery ───────────── */
// Az examples/index.json kártyákon; a jelenetek a hálózatról jönnek, a megnyitottak a tárolóba is kerülnek
// examples/index.json as cards; scenes come from the network, the opened ones are also stored
const GAL_HOME = 'https://btomori.github.io/animlab/';
const GAL_REPO = 'https://github.com/BTomori/animlab/tree/main/examples/';
const galPanel = $('#galleryPanel'), galList = $('#galList'), galStatus = $('#galStatus'), galTopics = $('#galTopics'), galSearch = $('#galSearch');
const gal = {open: false, state: 'idle', base: '', topics: [], items: [], offline: false, group: 'all', active: new Set(), q: '', listTok: 0, sceneTok: 0};
const galSceneKey = p => 'gallery:scene:' + p;
const galText = v => (v && typeof v === 'object') ? (v[LANG] || v.hu || v.en || '') : String(v || '');
const galFold = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();   // kis- és ékezetfüggetlen / ignores case and accents
const galOkPath = p => typeof p === 'string' && /^[^\s:?#\\]+$/.test(p) && !p.startsWith('/') && !p.split('/').includes('..');
const galUrl = (base, rel) => new URL('examples/' + rel.split('/').map(encodeURIComponent).join('/'), base).href;
const galArr = a => Array.isArray(a) ? a.filter(x => typeof x === 'string') : [];
function galForgetScenes() {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('animlab.' + galSceneKey('')));
    keys.forEach(k => localStorage.removeItem(k));
    return keys.length > 0;
  } catch (e) { return false; }
}
// Az ismeretlen mezőket figyelmen kívül hagyjuk, az érvénytelen útvonalú elemet kihagyjuk / unknown fields are ignored, an entry without a valid path is skipped
function galApply(data, base, offline) {
  gal.base = base; gal.offline = offline; gal.state = 'ready';
  gal.topics = (Array.isArray(data.topics) ? data.topics : []).filter(t => t && typeof t.key === 'string');
  const items = data.examples.filter(e => e && galOkPath(e.path)).map(e => {
    const x = {...e, topics: galArr(e.topics), tags: galArr(e.tags)};
    x.hay = galFold([e.title && e.title.hu, e.title && e.title.en, e.description && e.description.hu, e.description && e.description.en, e.author, e.class, ...x.tags].join(' \n '));
    return x;
  });
  gal.items = [...items.filter(e => e.featured), ...items.filter(e => !e.featured)];
  const used = new Set(gal.items.flatMap(e => e.topics));
  gal.active = new Set([...gal.active].filter(k => used.has(k)));
}
async function galLoad() {
  const tok = ++gal.listTok;
  gal.state = 'loading'; galRender();
  // http(s): először a saját mappa (egy saját másolat a saját példáit mutatja) / first next to the page (a fork shows its own examples)
  const bases = /^https?:$/.test(location.protocol) ? [location.href, GAL_HOME] : [GAL_HOME];
  for (const base of bases) {
    try {
      const r = await fetch(galUrl(base, 'index.json'), {cache: 'no-cache'});
      if (!r.ok) continue;
      const text = await r.text(), data = JSON.parse(text);
      if (!data || !Array.isArray(data.examples)) continue;
      if (tok !== gal.listTok) return;
      store.set('gallery:index', JSON.stringify({base, text}));
      galApply(data, base, false); galRender();
      return;
    } catch (e) { /* a következő forrás / next source */ }
  }
  if (tok !== gal.listTok) return;
  try {
    const saved = JSON.parse(store.get('gallery:index'));
    galApply(JSON.parse(saved.text), saved.base, true);
  } catch (e) { gal.state = 'nolist'; gal.items = []; }
  galRender();
}
function galCard(e) {
  const off = gal.offline && store.get(galSceneKey(e.path)) === null;
  const topics = e.topics.map(k => gal.topics.find(t => t.key === k)).filter(Boolean).map(t => galText(t) || t.key).join(', ');
  const author = [e.author, e.class].filter(Boolean).join(', ');
  const thumb = galOkPath(e.thumb) ? `<img class="gal-thumb" src="${esc(galUrl(gal.base, e.path + '/' + e.thumb))}" alt="" loading="lazy">` : '';
  return `<article class="gal-card${off ? ' off' : ''}" data-path="${esc(e.path)}">${thumb}
    <button class="gal-open" type="button"${off ? ' aria-disabled="true"' : ''}><span class="gal-t">${e.featured ? '⭐ ' : ''}${esc(galText(e.title) || e.path)}</span><span class="gal-d">${esc(galText(e.description))}</span></button>
    <div class="gal-meta">${esc([author, topics].filter(Boolean).join(' · '))}</div>
    ${e.tags.length ? `<div class="gal-tags">${e.tags.map(t => `<button class="gal-tag" type="button" data-tag="${esc(t)}">${esc(t)}</button>`).join('')}</div>` : ''}
    ${off ? `<div class="gal-note">${esc(T('galleryNotCached'))}</div>` : ''}
    <div class="gal-foot"><a href="${esc(GAL_REPO + e.path.split('/').map(encodeURIComponent).join('/'))}" target="_blank" rel="noopener">${esc(T('galleryGithub'))}</a></div>
  </article>`;
}
function galRender() {
  if (!gal.open) return;
  $$('#galGroup button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.group === gal.group)));
  const ready = gal.state === 'ready';
  const used = ready ? gal.topics.filter(t => gal.items.some(e => e.topics.includes(t.key))) : [];
  galTopics.hidden = !used.length;
  galTopics.innerHTML = used.map(t => `<button class="gal-chip" type="button" data-topic="${esc(t.key)}" aria-pressed="${gal.active.has(t.key)}">${esc(galText(t) || t.key)}</button>`).join('');
  const status = gal.state === 'loading' ? T('galleryLoading') : gal.state === 'nolist' ? T('galleryNoList') : gal.offline ? T('galleryOfflineList') : '';
  galStatus.hidden = !status; galStatus.textContent = status;
  if (!ready) { galList.innerHTML = ''; return; }
  const q = galFold(gal.q).trim().replace(/\s+/g, ' ');
  const shown = gal.items.filter(e => (gal.group === 'all' || e.group === gal.group)
    && (!gal.active.size || e.topics.some(k => gal.active.has(k)))
    && (!q || e.hay.includes(q)));
  galList.innerHTML = shown.length ? shown.map(galCard).join('') : `<div class="gal-none">${esc(T('galleryNoMatch'))}</div>`;
  galList.scrollTop = 0;
}
async function galOpenScene(ex, card) {
  const tok = ++gal.sceneTok, key = galSceneKey(ex.path);
  $$('.gal-card.busy', galList).forEach(c => c.classList.remove('busy'));
  card.classList.add('busy');
  let text = null;
  try {
    const r = await fetch(galUrl(gal.base, ex.path + '/scene.animlab.json'), {cache: 'no-cache'});
    if (r.ok) text = await r.text();
  } catch (e) { /* nincs hálózat: tároló / no network: storage */ }
  const fresh = text !== null;
  if (!fresh) text = store.get(key);
  if (tok !== gal.sceneTok) return;
  let obj = null;
  if (text !== null) { try { obj = parseSceneText(text); } catch (e) { obj = null; } }
  if (!obj) { card.classList.remove('busy'); toast(T('galleryLoadError') + ' ' + (galText(ex.title) || ex.path)); return; }
  if (fresh) store.set(key, text);   // ha nem fér el, csendben kimarad / skipped quietly if it does not fit
  galSetOpen(false, false);
  // A jelenet neve a kártya címe az aktuális nyelven / the scene's name is the card title in the current language
  loadScene({...obj, name: galText(ex.title) || obj.name}, {undo: true});
}
function galSetOpen(open, refocus = true) {
  gal.open = open; galPanel.hidden = !open;
  ['.topbar', '.layout', '.mnav'].forEach(s => { const el = $(s); if (el) el.inert = open; });
  if (open) {
    closeMenu();
    galLoad();
    if (mqMobile.matches) $('.gal', galPanel).focus(); else galSearch.focus();   // telefonon ne ugorjon fel a billentyűzet / no pop-up keyboard on phones
  } else {
    gal.listTok++; gal.sceneTok++;
    if (refocus) $('#btnGallery').focus();
    else if (document.activeElement) document.activeElement.blur();   // a billentyűk a jelenethez jussanak / keys go to the scene
  }
}
$('#btnGallery').addEventListener('click', () => galSetOpen(true));
$('#galClose').addEventListener('click', () => galSetOpen(false));
galPanel.addEventListener('click', e => { if (e.target === galPanel) galSetOpen(false); });
galSearch.addEventListener('input', () => { gal.q = galSearch.value; galRender(); });
$('#galGroup').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { gal.group = b.dataset.group; galRender(); } });
galTopics.addEventListener('click', e => {
  const b = e.target.closest('.gal-chip'); if (!b) return;
  const k = b.dataset.topic;
  if (gal.active.has(k)) gal.active.delete(k); else gal.active.add(k);
  galRender();
  const again = $$('.gal-chip', galTopics).find(x => x.dataset.topic === k);   // az újrarajzolás után a fókusz maradjon / keep the focus after redrawing
  if (again) again.focus();
});
galList.addEventListener('click', e => {
  const tag = e.target.closest('.gal-tag');
  if (tag) { galSearch.value = gal.q = tag.dataset.tag; galRender(); return; }
  if (e.target.closest('a')) return;
  const card = e.target.closest('.gal-card');
  if (!card || card.classList.contains('off')) return;
  const ex = gal.items.find(x => x.path === card.dataset.path);
  if (ex) galOpenScene(ex, card);
});
galList.addEventListener('error', e => { if (e.target.tagName === 'IMG') e.target.remove(); }, true);

