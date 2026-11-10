/* ───────────── assets ───────────── */
function readAsDataURL(f) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); });
}
function downscale(src, maxDim, type) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight, m = Math.max(w, h);
      if (!m || m <= maxDim) return res(src);
      const k = maxDim / m, cv = document.createElement('canvas');
      cv.width = Math.round(w * k); cv.height = Math.round(h * k);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      res(cv.toDataURL(type === 'image/jpeg' ? 'image/jpeg' : 'image/png', 0.9));
    };
    img.onerror = () => res(src);
    img.src = src;
  });
}
function cleanName(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '') || 'kep';
}
function uniqueName(base, except) {
  let n = base, i = 2;
  while (scene.assets[n] && n !== except) n = base + '_' + i++;
  return n;
}
// Fájltípus a tartalom alapján (a telefonok fájlválasztója néha rossz vagy üres típust ad)
// File type from the content (phone file pickers sometimes report a wrong or empty type)
function sniffType(bytes) {
  const b = bytes, txt = new TextDecoder('utf-8', {fatal: false}).decode(b.slice(0, 2048)).replace(/^\uFEFF/, '').trimStart();
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return 'image/png';
  if (b[0] === 0xFF && b[1] === 0xD8) return 'image/jpeg';
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return 'image/gif';
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45) return 'image/webp';
  if (/^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE[^>]*>\s*)?<svg[\s>]/i.test(txt)) return 'image/svg+xml';
  return '';
}
// SVG javítása: hiányzó xmlns pótlása (nélküle a böngésző nem tölti be képként) / add a missing xmlns (browsers refuse SVG images without it)
function fixSvgText(t) {
  return t.replace(/<svg\b([^>]*)>/i, (m, attrs) => /\sxmlns\s*=/.test(attrs) ? m : `<svg xmlns="http://www.w3.org/2000/svg"${/xlink:/.test(t) && !/xmlns:xlink/.test(attrs) ? ' xmlns:xlink="http://www.w3.org/1999/xlink"' : ''}${attrs}>`);
}
function b64(bytes) { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); }
function svgDataUrl(text) { return 'data:image/svg+xml;base64,' + b64(new TextEncoder().encode(fixSvgText(text))); }
// Már elmentett jelenetek képeit is rendbe teszi betöltéskor / also repairs pictures of scenes saved earlier
function fixDataUrl(src) {
  const m = /^data:([^;,]*)(;base64)?,(.*)$/s.exec(String(src || ''));
  if (!m || /^image\/(png|jpeg|gif|webp)$/.test(m[1])) return src;
  try {
    const bytes = m[2] ? Uint8Array.from(atob(m[3]), c => c.charCodeAt(0)) : new TextEncoder().encode(decodeURIComponent(m[3]));
    const type = sniffType(bytes);
    if (type === 'image/svg+xml') return svgDataUrl(new TextDecoder().decode(bytes));
    if (type && type !== m[1]) return 'data:' + type + ';base64,' + b64(bytes);
  } catch (e) { /* leave it as it is */ }
  return src;
}
async function addImageFile(f) {
  const bytes = new Uint8Array(await f.arrayBuffer());
  const type = sniffType(bytes) || f.type || '';
  let src;
  if (type === 'image/svg+xml') src = svgDataUrl(new TextDecoder().decode(bytes));
  else {
    src = 'data:' + (type || 'application/octet-stream') + ';base64,' + b64(bytes);
    src = await downscale(src, 1600, type);
  }
  const name = uniqueName(cleanName(f.name.replace(/\.[^.]+$/, '')));
  scene.assets[name] = src;
  renderAssets(); scheduleAutosave();
  toast(T('imgAdded') + ` image("${name}", x, y)`);
}
function renderAssetStatus() {
  for (const el of $$('#assetList .asset-err')) { const e = imgCache.get(el.dataset.name); el.hidden = !(e && e.err); }
}
function renderAssets() {
  const box = $('#assetList');
  const names = Object.keys(scene.assets);
  if (!names.length) { box.innerHTML = `<p class="muted">${esc(T('noAssets'))}</p>`; return; }
  box.innerHTML = '';
  for (const n of names) {
    const row = document.createElement('div'); row.className = 'asset';
    const snippet = `image("${n}", 500, 300, {w: 120});`;
    row.innerHTML = `<img alt="" src="${esc(fixDataUrl(scene.assets[n]))}"><div><input value="${esc(n)}" aria-label="${esc(n)}"><code>${esc(snippet)}</code><p class="asset-err" data-name="${esc(n)}" hidden>${esc(T('imgBad'))}</p><div class="row"><button type="button" class="btn" data-a="copy">${esc(T('copy'))}</button><button type="button" class="btn" data-a="del">${esc(T('del'))}</button></div></div>`;
    $('input', row).addEventListener('change', ev => {
      const nn = uniqueName(cleanName(ev.target.value), n);
      if (nn !== n) { scene.assets[nn] = scene.assets[n]; delete scene.assets[n]; imgCache.delete(n); }
      renderAssets(); scheduleAutosave();
    });
    $('[data-a=copy]', row).addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(snippet); toast(T('copied') + ' ' + snippet); }
      catch (e) { const c = $('code', row); const r = document.createRange(); r.selectNodeContents(c); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    });
    $('[data-a=del]', row).addEventListener('click', () => {
      const keep = scene.assets[n]; delete scene.assets[n]; imgCache.delete(n); renderAssets(); scheduleAutosave();
      toast(T('del') + ': ' + n, {label: T('undo'), fn: () => { scene.assets[n] = keep; renderAssets(); scheduleAutosave(); }});
    });
    box.appendChild(row);
  }
}

