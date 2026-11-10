/* ───────────── boot ───────────── */
readTokens();
R = freshRuntime();
let initial = null;
const emb = $('#embedded-scene').textContent.trim();
if (emb) { try { initial = JSON.parse(emb); } catch (e) { initial = null; } }
if (!initial) { const a = store.get('autosave'); if (a) { try { const o = JSON.parse(a); if (o && o.format === 'animlab-scene' && o.script) initial = o; } catch (e) { initial = null; } } }
if (!initial) initial = templateScene();
applyLang();
loadScene(initial);
selectTab(store.get('tab') || 'controls');
if (mqMobile.matches && mview !== 'canvas') selectTab(mview);
updateMode();
requestAnimationFrame(t => { lastNow = t; loop(t); });
// Link egy jelenetre / a link to a scene – bármelyik üzenetben elküldhető / can be sent in any chat:
//   ?scene=examples/teacher/lengo-labda                    → mappa: a benne lévő scene.animlab.json / folder: its scene.animlab.json
//   ?scene=examples/teacher/lengo-labda/scene.animlab.json → maga a fájl / the file itself
//   ?scene=examples/teacher/lengo-labda.animlab.json       → régi link: ha nincs ilyen fájl, a mappát próbálja / old link: falls back to the folder
function sceneLinkCandidates(sp) {
  sp = sp.trim().replace(/\/+$/, '');
  if (!/\.(json|html?)$/i.test(sp)) return [sp + '/scene.animlab.json'];
  const out = [sp];
  if (/\.animlab\.json$/i.test(sp) && !/\/scene\.animlab\.json$/i.test(sp)) out.push(sp.replace(/\.animlab\.json$/i, '/scene.animlab.json'));
  return out;
}
try {
  const sp = new URLSearchParams(location.search).get('scene');
  if (sp && /^https?:$/.test(location.protocol)) {
    (async () => {
      for (const c of sceneLinkCandidates(sp)) {
        // no-cache: a böngésző mindig rákérdez a szerveren, így a link a legfrissebb változatot tölti be
        // no-cache: the browser always checks with the server, so the link loads the newest version
        const r = await fetch(new URL(c, location.href), {cache: 'no-cache'}).catch(() => null);
        if (r && r.ok) { loadScene(parseSceneText(await r.text())); return; }
      }
      throw new Error('not found');
    })().catch(() => toast(tr({hu: 'A linkben megadott jelenet nem tölthető be: ', en: 'The scene in the link cannot be loaded: '}) + sp));
  }
} catch (e) { /* no scene link */ }
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { ctlSig = null; buildControls(); });
