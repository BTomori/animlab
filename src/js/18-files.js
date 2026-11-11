/* ───────────── files ───────────── */
let dl = null;
try {
  if (window.claude && typeof window.claude.use === 'function') {
    window.claude.use('downloads').then(ns => { dl = ns || null; }).catch(() => {});
  }
} catch (e) { /* not inside Claude */ }
function inFrame() { try { return window.top !== window.self; } catch (e) { return true; } }
async function saveFile(name, data, mime) {
  if (dl) {
    try { await dl.save({filename: name, data}); toast(T('saved') + ' ' + name); }
    catch (e) {
      if (e && e.code === 'declined') toast(T('saveDeclined'));
      else toast(T('saveFail') + ' ' + ((e && (e.message || e.code)) || e));
    }
    return;
  }
  const blob = data instanceof Blob ? data : new Blob([data], {type: mime || 'application/octet-stream'});
  const ext = (/\.[a-z0-9]+$/i.exec(name) || [''])[0].toLowerCase();   // pl. / e.g. ".json", ".html"
  if (window.showSaveFilePicker && !inFrame()) {
    try {
      // A fájltípust is megadjuk, különben egyes rendszereken a kiterjesztés elveszhet
      // Pass the file type too, otherwise some systems drop the extension
      const opts = {suggestedName: name};
      if (ext && mime) opts.types = [{description: FILE_KINDS[ext] ? tr(FILE_KINDS[ext]) : ext.slice(1).toUpperCase(), accept: {[mime]: [ext]}}];
      const h = await window.showSaveFilePicker(opts);
      const w = await h.createWritable(); await w.write(blob); await w.close();
      let saved = h.name;
      if (ext && !saved.toLowerCase().endsWith(ext) && typeof h.move === 'function') {
        try { await h.move(saved + ext); saved += ext; } catch (e) { /* the file is saved anyway */ }
      }
      toast(T('saved') + ' ' + saved); return;
    } catch (e) { if (e && e.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  toast(T('saved') + ' ' + name);
}
const FILE_KINDS = {
  '.json': {hu: 'AnimLab-jelenet (JSON)', en: 'AnimLab scene (JSON)'},
  '.html': {hu: 'Önálló AnimLab-jelenet (HTML)', en: 'Standalone AnimLab scene (HTML)'},
  '.png': {hu: 'PNG-kép', en: 'PNG image'}, '.webm': {hu: 'WebM-videó', en: 'WebM video'}, '.mp4': {hu: 'MP4-videó', en: 'MP4 video'},
  '.md': {hu: 'Markdown-szöveg', en: 'Markdown text'},
};
function fileBase() {
  const n = (scene.name || 'animlab').trim().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w\-]+/g, '_').replace(/^_+|_+$/g, '');
  return n || 'animlab';
}
function sceneData() {
  return {format: 'animlab-scene', version: 1, name: scene.name, script: scene.script, params: scene.params, assets: scene.assets, marks: scene.marks || [], overrides: scene.overrides || {}, timeScale: speed};
}
function loadScene(obj, opts = {}) {
  const prev = opts.undo ? JSON.parse(JSON.stringify(sceneData())) : null;
  scene = {
    name: String(obj.name || ''), script: String(obj.script || ''),
    params: (obj.params && typeof obj.params === 'object') ? {...obj.params} : {},
    assets: (obj.assets && typeof obj.assets === 'object') ? {...obj.assets} : {},
    marks: Array.isArray(obj.marks) ? JSON.parse(JSON.stringify(obj.marks)) : [],
    overrides: (obj.overrides && typeof obj.overrides === 'object') ? JSON.parse(JSON.stringify(obj.overrides)) : {},
    timeScale: +obj.timeScale > 0 ? +obj.timeScale : 1,
  };
  markId = scene.marks.reduce((m, x) => Math.max(m, x.id || 0), 0);
  markRt.clear(); seenMarks.clear(); cmSig = '';
  pathDraft = null; drag = null;
  renderMarkList();
  imgCache.clear();
  $('#code').value = scene.script; updateGutter();
  $('#sceneName').value = scene.name;
  setSpeed(scene.timeScale);
  firstRun = !(+obj.timeScale > 0 && obj.timeScale !== 1) ;
  ctlSig = null; kbSel = null;
  renderAssets();
  runScene();
  setPlaying(true);
  scheduleAutosave();
  if (prev) toast(T('loaded') + ' ' + (scene.name || '—'), {label: T('undo'), fn: () => loadScene(prev)});
}
// Az egyetlen beépített jelenet; a többi példa a galériából nyílik / the only built-in scene; every other example opens from the gallery
function templateScene() {
  return {name: tr(TEMPLATE_NAME), script: $('#preset-template').textContent.replace(/^\n/, ''), params: {}, assets: {}, marks: []};
}
// Jelenet egy .json vagy egy exportált .html fájl szövegéből / a scene from the text of a .json or an exported .html file
function parseSceneText(text) {
  let obj;
  if (/^\s*</.test(text)) {
    // Önálló HTML-export: a jelenet az embedded-scene blokkban van / standalone HTML export: the scene is embedded
    const doc = new DOMParser().parseFromString(text, 'text/html');
    const emb = doc.getElementById('embedded-scene');
    obj = JSON.parse(emb ? emb.textContent : '');
  } else obj = JSON.parse(text);
  if (!obj || obj.format !== 'animlab-scene' || typeof obj.script !== 'string') throw new Error('format');
  return obj;
}
async function openFile(f) {
  try {
    const obj = parseSceneText(await f.text());
    if (!obj || obj.format !== 'animlab-scene' || typeof obj.script !== 'string') throw new Error('format');
    loadScene(obj, {undo: true});
  } catch (e) { toast(T('openFail')); }
}
function buildStandalone() {
  const doc = new DOMParser().parseFromString(SRC, 'text/html');
  doc.querySelectorAll('script:not([data-app])').forEach(s => s.remove());
  doc.querySelectorAll('meta[http-equiv]').forEach(m => m.remove());
  const emb = doc.getElementById('embedded-scene');
  emb.textContent = JSON.stringify(sceneData()).replace(/</g, '\\u003c');
  return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
}

let rec = null, recChunks = [], recStart = 0;
function toggleRecord() {
  if (rec) { rec.stop(); return; }
  if (!stageCv.captureStream || typeof MediaRecorder === 'undefined') { toast(T('recUnsupported')); return; }
  const types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
  const mime = types.find(m => { try { return MediaRecorder.isTypeSupported(m); } catch (e) { return false; } }) || '';
  let stream;
  try {
    stream = stageCv.captureStream(60);
    rec = new MediaRecorder(stream, mime ? {mimeType: mime, videoBitsPerSecond: 8000000} : undefined);
  } catch (e) { rec = null; toast(T('recUnsupported')); return; }
  recChunks = [];
  rec.ondataavailable = e => { if (e.data && e.data.size) recChunks.push(e.data); };
  rec.onstop = () => {
    const type = (rec && rec.mimeType) || mime || 'video/webm';
    const ext = type.includes('mp4') ? 'mp4' : 'webm';
    const blob = new Blob(recChunks, {type});
    stream.getTracks().forEach(t => t.stop());
    rec = null; updateRecUI();
    saveFile(fileBase() + '.' + ext, blob, type);
  };
  rec.start(250); recStart = performance.now();
  updateRecUI(); toast(T('recStarted'));
  if (!playing) setPlaying(true);
}
function updateRecUI() {
  recBadge.hidden = !rec; recBadge.title = T('exVideoStop');
  $('#exVideoLbl').textContent = rec ? T('exVideoStop') : T('exVideo');
}

