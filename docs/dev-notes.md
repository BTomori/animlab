# AnimLab – fejlesztői jegyzet / developer notes

Ez a jegyzet azoknak szól, akik saját módosítást készítenének az AnimLab programhoz. A felhasználói leírás a [README](../README.md)-ben és a programozási útmutatókban van, a tervek a [TODO.md](../TODO.md)-ben.
These notes are for anyone who wants to make their own modification of AnimLab. User documentation is in the [README](../README.md) and the programming guides, plans are in [TODO.md](../TODO.md).

The rest is in English, because it is mostly about code.

## 1. Getting started

- Fork the repository (or download it), open `index.html` in a browser. There is no build step and nothing to install: the whole app is this one file.
- Edit `index.html` in any text editor and reload the page.
- Your fork gets its own live copy with **Settings → Pages → Deploy from a branch → main**.

| Path | What |
| --- | --- |
| `index.html` | The whole app (HTML + CSS + JS + the built-in Template), about 300 kB |
| `docs/` | Programming guides (HU, EN), AI instructions, these notes |
| `examples/` | One folder per example: `scene.animlab.json`, `README.md`, `media/`; `index.json` lists them all and feeds the in-app gallery |
| `tests/` | Reports of earlier tests |

## 2. Inside `index.html`

Sections in order:

1. `<style>`: all CSS. The phone layout is driven by `body.mobile` rules, not media queries (see section 3).
2. Markup: top bar, stage column (`#stageWrap` canvas, transport, `#plotSplit`, plots), side panel with tabs, `.mnav` bottom bar for phones.
3. `<script type="application/json" id="embedded-scene">`: empty in the app; an exported standalone HTML puts its scene here.
4. The built-in Template in `<script type="text/plain" id="preset-template" data-app>`, the scene the app starts with when there is no autosave. `examples/teacher/sablon` is a copy of it for the gallery, so change both together. Every other example lives only in `examples/` (see section 5).
5. `<script type="text/plain" id="ai-instructions">`: the AI instructions, which the Help tab copies or saves. Keep it identical to `docs/animlab-ai-instructions.md`.
6. The main `<script data-app>`: one IIFE, so nothing is reachable from outside. Sections are marked with `/* ───── name ───── */` comments:
   - `UI text`: `UI.hu` / `UI.en` strings; `T('key')` for UI strings, `tr({hu, en})` for inline ones.
   - drawing API, animated arrows, 3D, physics world, complex numbers.
   - `scene API` (`makeApi`): every function a scene script can call.
   - main loop, plots, keyboard input, controls panel, stage layout, errors, transport, files (`saveFile`, `loadScene`, `parseSceneText`), autosave, assets, boundArrow, markup layer, code editor, help, guide, gallery, language, side panel, wiring, boot.
   - `keyboard input`: one system for all keys. `pressKey(k)` / `releaseKey(k)` take normalised key names (`normKey`: letters lower-case, `" "` = Space, `"ArrowLeft"` …) from the keyboard and from the touch buttons (`#kbPad`); `R.ctlKeys` (keys on controls), `R.keyOn` (`onKey`) and `R.keyPoll` (keys read with `key()`) decide whether the scene owns a key before Space / R / → / 1–9 are handled; `kbTick` moves held sliders every frame.
7. At the end of boot: the `?scene=` loader (`sceneLinkCandidates`: folder → `scene.animlab.json`; old `name.animlab.json` links fall back to the folder).

Storage: `store.get/set` wraps `localStorage` with the prefix `animlab.` (language, tab, panel widths, graph height, autosave, gallery cache).

## 3. Layout modes

- **Desktop:** side panel + stage column. `#btFull` = full screen of the stage column (canvas + graphs); `#btCanvasFull` = canvas only (element full screen of `#stageWrap`, overlay buttons `#cvOverlay`).
- **Phone:** `body.mobile` is set from `matchMedia('(max-width: 900px), (pointer: coarse) and (max-height: 560px)')`. `body[data-mview]` (canvas | controls | code | assets | marks | help) picks the screen; `.mnav` switches it.
- **Canvas only without a full-screen API** (iPhone) and **phone landscape on the canvas screen:** `body.cvonly` (CSS fixed overlay).
- Graph strip height: `plotLaneH` (24–240 px per graph), dragged on `#plotSplit`, double-click resets to 64.

## 4. Conventions

- One file, working offline (only the gallery needs a network), no external libraries or fonts.
- Bilingual everything: UI strings, example titles and labels (`{hu, en}`), comments in examples.
- The scene file format stays backward compatible: old `.animlab.json` files and old links must keep working.
- A new scene command belongs in the Help tab, both programming guides and the AI instructions, so people and AI assistants can use it.
- Examples by students: initials and class only, no faces or full names in pictures or videos.
- Note your changes in `CHANGELOG.md`.

## 5. Examples and the gallery

- **Adding an example:** a folder in `examples/teacher/` or `examples/students/` plus an entry in `examples/index.json` (`path`, `group`, `title`, `description`, `topics`, `tags`, `author`, `added`; optional `class`, `ai`, `featured`, `thumb`). No app change is needed: the gallery reads the list every time it opens.
- **`index.json` (version 2):** the top-level `topics` array (`{key, hu, en}`) is the filter list, in filter order; an example's `topics` are keys from it. A new topic only needs a new item there. `tags` are free text in the `"hu / en"` form; features are spelled exactly `kezdő / starter`, `3D`, `billentyűzet / keyboard`, `képek / images`, `jelölők / markup`. Unknown fields are ignored; an entry without a valid `path` is skipped.
- **Source:** served over http(s), the gallery first tries `examples/index.json` next to the page, so a fork on its own GitHub Pages shows its own examples. If that fails, or from a local file, it uses `https://btomori.github.io/animlab/`. Scenes and thumbnails load from the same base.
- **Offline:** the last list (`gallery:index`) and the scenes opened on this device (`gallery:scene:<path>`) stay in `store`. A scene that does not fit is skipped. When the autosave of the user's own scene does not fit, the stored scenes are dropped first (`galForgetScenes`).
- **Scene name:** a scene opened from the gallery takes the card `title` in the current language, not the `name` in its file. `?scene=` links and **Open** keep the file's `name`.
- **Code:** the `gallery` section of the main script; `#galleryPanel` in the markup. The `?scene=` loader at the end of boot is separate and does not use `index.json`.
