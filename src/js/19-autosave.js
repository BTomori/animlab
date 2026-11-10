/* ───────────── autosave ───────────── */
let autosaveTimer = null, warnedStorage = false;
function scheduleAutosave() {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    const data = JSON.stringify(sceneData());
    // A saját munka fontosabb a galéria tárolt jeleneteinél / the user's own work matters more than the gallery's stored scenes
    if (!store.set('autosave', data) && !(galForgetScenes() && store.set('autosave', data))) {
      store.set('autosave', JSON.stringify({...sceneData(), assets: {}}));
      if (!warnedStorage && Object.keys(scene.assets).length) { warnedStorage = true; toast(T('storageFull')); }
    }
  }, 700);
}

