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
| `index.html` | The whole app (HTML + CSS + JS + presets + embedded pictures), about 450 kB |
| `docs/` | Programming guides (HU, EN), AI instructions, these notes |
| `examples/` | One folder per example: `scene.animlab.json`, `README.md`, `media/`; `index.json` lists them all |
| `tests/` | Reports of earlier tests |

## 2. Inside `index.html`

Sections in order:

1. `<style>`: all CSS. The phone layout is driven by `body.mobile` rules, not media queries (see section 3).
2. Markup: top bar, stage column (`#stageWrap` canvas, transport, `#plotSplit`, plots), side panel with tabs, `.mnav` bottom bar for phones.
3. `<script type="application/json" id="embedded-scene">`: empty in the app; an exported standalone HTML puts its scene here.
4. Presets, each in `<script type="text/plain" id="preset-ID" data-app>`, optionally with `assets-ID` (pictures as data URLs, JSON) and `marks-ID` (Markup-tab marks, JSON).
5. `<script type="text/plain" id="ai-instructions">`: the AI instructions, which the Help tab copies or saves. Keep it identical to `docs/animlab-ai-instructions.md`.
6. The main `<script data-app>`: one IIFE, so nothing is reachable from outside. Sections are marked with `/* ───── name ───── */` comments:
   - `UI text`: `UI.hu` / `UI.en` strings; `T('key')` for UI strings, `tr({hu, en})` for inline ones.
   - `PRESETS`: the preset menu (`{id, name: {hu, en}, assets?: 'other-id'}`). A new preset needs a `preset-ID` script and an entry here.
   - drawing API, animated arrows, 3D, physics world, complex numbers.
   - `scene API` (`makeApi`): every function a scene script can call.
   - main loop, plots, controls panel, stage layout, errors, transport, files (`saveFile`, `loadScene`, `parseSceneText`), autosave, assets, boundArrow, markup layer, code editor, help, guide, language, side panel, wiring, boot.
7. At the end of boot: the `?scene=` loader (`sceneLinkCandidates`: folder → `scene.animlab.json`; old `name.animlab.json` links fall back to the folder).

Storage: `store.get/set` wraps `localStorage` with the prefix `animlab.` (language, tab, panel widths, graph height, autosave).

## 3. Layout modes

- **Desktop:** side panel + stage column. `#btFull` = full screen of the stage column (canvas + graphs); `#btCanvasFull` = canvas only (element full screen of `#stageWrap`, overlay buttons `#cvOverlay`).
- **Phone:** `body.mobile` is set from `matchMedia('(max-width: 900px), (pointer: coarse) and (max-height: 560px)')`. `body[data-mview]` (canvas | controls | code | assets | marks | help) picks the screen; `.mnav` switches it.
- **Canvas only without a full-screen API** (iPhone) and **phone landscape on the canvas screen:** `body.cvonly` (CSS fixed overlay).
- Graph strip height: `plotLaneH` (24–240 px per graph), dragged on `#plotSplit`, double-click resets to 64.

## 4. Conventions

- One file, working offline, no external libraries or fonts.
- Bilingual everything: UI strings, preset titles and labels (`{hu, en}`), comments in presets and examples.
- The scene file format stays backward compatible: old `.animlab.json` files and old links must keep working.
- A new scene command belongs in the Help tab, both programming guides and the AI instructions, so people and AI assistants can use it.
- Examples by students: initials and class only, no faces or full names in pictures or videos.
- Note your changes in `CHANGELOG.md`.
