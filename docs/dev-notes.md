# AnimLab – fejlesztői jegyzet / developer notes

Ez a jegyzet annak szól, aki (ember vagy AI) az AnimLab programot fejleszti tovább. A felhasználói leírás a [README](../README.md)-ben és a programozási útmutatókban van. A teendők listája: [TODO.md](../TODO.md).
These notes are for whoever (person or AI) develops AnimLab further. User documentation is in the [README](../README.md) and the programming guides. The to-do list: [TODO.md](../TODO.md).

The rest is in English, because it is mostly about code.

## 1. Where things are

| Place | What |
| --- | --- |
| GitHub `BTomori/animlab`, branch `main` | The source of truth. GitHub Pages serves it at https://btomori.github.io/animlab/ |
| `index.html` | The whole app in one file (HTML + CSS + JS + presets + embedded pictures), about 450 kB |
| `docs/` | Programming guides (HU, EN), AI instructions, these notes, social preview picture |
| `examples/` | One folder per example: `scene.animlab.json`, `README.md`, `media/`; `index.json` lists them all |
| `tests/` (GitHub) | The Gemini test of 2026-11-03 and two older scripts. New tests are not added here (see section 5) |
| Teacher's PC: `Documents\AnimLab` | Local copy: `app\animlab.html` (= `index.html`), docs, examples, and **`dev-tests\`**, the local test suite, which is not on GitHub |
| Claude artifact "AnimLab" | A copy of the app inside Claude, updated together with `index.html` |

## 2. Inside `index.html`

The file is plain HTML with no build step. Edit it directly. Sections in order:

1. `<style>`: all CSS. The phone layout is driven by `body.mobile` rules, not media queries (see section 3).
2. Markup: top bar, stage column (`#stageWrap` canvas, transport, `#plotSplit`, plots), side panel with tabs, `.mnav` bottom bar for phones.
3. `<script type="application/json" id="embedded-scene">`: empty in the app; an exported standalone HTML puts its scene here.
4. Presets, each in `<script type="text/plain" id="preset-ID" data-app>`, optionally with `assets-ID` (pictures as data URLs, JSON) and `marks-ID` (Markup-tab marks, JSON).
5. `<script type="text/plain" id="ai-instructions">`: the AI instructions. **Must be identical to `docs/animlab-ai-instructions.md`**; the Help tab copies or saves this text.
6. The main `<script data-app>`: one IIFE, so nothing is reachable from outside (tests must drive the UI elements). Sections are marked with `/* ───── name ───── */` comments:
   - `UI text`: `UI.hu` / `UI.en` strings; use `T('key')` for UI strings and `tr({hu, en})` for inline ones. Every new string needs both languages.
   - `PRESETS`: the preset menu (`{id, name: {hu, en}, assets?: 'other-id'}`).
   - drawing API, animated arrows, 3D, physics world, complex numbers.
   - `scene API` (`makeApi`): every function a scene script can call. A new command must also go into the Help tab, both programming guides and the AI instructions.
   - main loop, plots, controls panel, stage layout, errors, transport, files (`saveFile`, `loadScene`, `parseSceneText`), autosave, assets, boundArrow, markup layer, code editor, help, guide, language, side panel, wiring, boot.
7. At the end of boot: the `?scene=` loader (`sceneLinkCandidates`: folder → `scene.animlab.json`; old `name.animlab.json` links fall back to the folder).

Storage: `store.get/set` wraps `localStorage` with the prefix `animlab.` (language, tab, panel widths, `plotLaneH`, autosave).

## 3. Layout modes

- **Desktop:** side panel + stage column. `#btFull` = full screen of the stage column (canvas + graphs); `#btCanvasFull` = canvas only (element full screen of `#stageWrap`, overlay buttons `#cvOverlay`).
- **Phone:** `body.mobile` is set from `matchMedia('(max-width: 900px), (pointer: coarse) and (max-height: 560px)')`. `body[data-mview]` (canvas | controls | code | assets | marks | help) picks the screen; `.mnav` switches it.
- **Canvas only without a full-screen API** (iPhone) and **phone landscape on the canvas screen:** `body.cvonly` (CSS fixed overlay).
- Graph strip height: `plotLaneH` (24–240 px per graph), dragged on `#plotSplit`, double-click resets to 64.

## 4. Rules for changes

- Keep it one file, working offline, no external libraries or fonts.
- Bilingual everything: UI strings, preset titles and labels (`{hu, en}`), comments in presets and examples.
- Scene file format stays backward compatible: old `.animlab.json` files and old links must keep working.
- Students may be minors: only initials and class in the public repo, no faces or full names in pictures or videos.
- Commit and push only when the teacher asks. Answer questions ("can you…?", "how could…?") with options first, act only on an explicit request.
- After a change to `index.html`: run the local tests, update `CHANGELOG.md`, and if a command changed, the Help tab, both guides and the AI instructions (and keep `docs/animlab-ai-instructions.md` equal to the embedded copy).

## 5. Testing

Tests stay on the teacher's computer in `Documents\AnimLab\dev-tests\` (not on GitHub, unless the teacher asks). See the README there. In short:

```
cd Documents\AnimLab\dev-tests
npm install
npx playwright install chromium
node run-all.js                 # tests ..\app\animlab.html
node run-all.js D:\path\x.html  # tests another copy
```

| Script | Checks |
| --- | --- |
| `presets.js` | every preset loads without errors, first readouts, screenshot of each; Help → copy AI instructions equals `docs/animlab-ai-instructions.md` |
| `ui.js` | graph strip drag (normal and full screen), full screen, canvas only and its exit, phone views, landscape canvas only |
| `save-share.js` | save keeps `.animlab.json`, export `.html`, share sheet and its download fallback, opening both formats, standalone HTML runs |
| `links.js` | `?scene=` links for every example in `examples/index.json`: folder, folder/, full path, old link; missing scene shows an error |

Screenshots go to `dev-tests\out\`. A Claude session without access to the PC can copy the scripts from there or recreate them from this table.

## 6. Publishing a new version

1. Edit `index.html` (in a clone of the repo).
2. Run the tests.
3. `CHANGELOG.md`: new entry, HU / EN.
4. Commit and push to `main`; Pages updates within a minute or two.
5. Copy `index.html` to `Documents\AnimLab\app\animlab.html` and update the Claude artifact copy.
