# AnimLab – fejlesztői jegyzet / developer notes

Ez a jegyzet azoknak szól, akik saját módosítást készítenének az AnimLab programhoz. A felhasználói leírás a [README](../README.md)-ben és a programozási útmutatókban van, a tervek a [TODO.md](../TODO.md)-ben.
These notes are for anyone who wants to make their own modification of AnimLab. User documentation is in the [README](../README.md) and the programming guides, plans are in [TODO.md](../TODO.md).

The rest is in English, because it is mostly about code.

## 1. Getting started

- Fork the repository (or download it), open `index.html` in a browser. Nothing to install for **using** it: the whole app is this one built file, and it works offline.
- To **modify** it, edit the sources in `src/` and run `node build.js` in the repository folder; it writes `index.html`. Node.js (any recent version, no packages) is needed only for modifying, not for using. Reload the page.
  - `node build.js --check` tells whether `index.html` is up to date with `src/` (exit code 1 and the first differing line if not).
  - `node build.js --watch` rebuilds after every save.
  - Do not edit `index.html` by hand: it is a build output and the next build overwrites it. The comment on its second line says so.
- Your fork gets its own live copy with **Settings → Pages → Deploy from a branch → main**. Commit the rebuilt `index.html` together with your `src/` changes: Pages serves the built file.

| Path | What |
| --- | --- |
| `index.html` | The built app (HTML + CSS + JS + the built-in Template), about 300 kB; generated from `src/`, committed so that Pages, forks and downloads need no build |
| `src/` | The app source: `app.html` shell, `css/`, `js/` (see section 2) |
| `build.js` | The build (plain Node, no dependencies): `node build.js [--check | --watch]` |
| `docs/` | Programming guides (HU, EN), AI instructions, these notes |
| `examples/` | One folder per example: `scene.animlab.json`, `README.md`, `media/`; `index.json` lists them all and feeds the in-app gallery |
| `tests/` | Reports of earlier tests |

## 2. Inside `src/` (and the built `index.html`)

`src/app.html` is the page shell: head, markup, the `<style>` and `<script>` tags. Wherever content was cut out, a marker line `<!-- @include path -->` stands, and the build replaces it (with its line break) by that file; the path is relative to `src/`, and `path#field` takes one field of a JSON file. Every file in `src/` must be included exactly once, and each ends with a newline. The built file is the former single file line for line, plus the generated-file comment on line 2.

| File | What |
| --- | --- |
| `src/app.html` | Shell: `<head>`, the `<style>` with the CSS includes, the markup (top bar, stage column with `#stageWrap` canvas, transport, `#plotSplit`, plots; side panel with tabs; `.mnav` bottom bar for phones), the data scripts and the main script's IIFE wrapper with the JS includes |
| `src/css/00-base.css` … `06-gallery.css` | All CSS in order: `:root` variables and base, top bar, main layout, side panel, graph-strip resizing, canvas-only mode, gallery. The phone layout is driven by `body.mobile` rules, not media queries (see section 3) |
| `#embedded-scene` (in `app.html`) | `<script type="application/json">`, empty in the app; an exported standalone HTML puts its scene here |
| `#preset-template` | The built-in Template, the scene the app starts with when there is no autosave. Included from `examples/teacher/sablon/scene.animlab.json` (`script` field), so the Template has one source and the gallery shows the same scene. Every other example lives only in `examples/` (see section 5) |
| `#ai-instructions` | The AI instructions, which the Help tab copies or saves. Included from `docs/animlab-ai-instructions.md`: edit that file |
| `src/js/NN-name.js` | The main `<script data-app>`: one IIFE (`(() => { 'use strict'; … })();` in `app.html`), so nothing is reachable from outside. The IIFE body is cut at its `/* ───── name ───── */` markers into one file per section, numbered in the order they are included. They are pieces of **one closure**, not modules: a `const` in `02-state.js` is visible in `31-wiring.js`, and the order matters |

The `src/js/` files in order:

| File | Section |
| --- | --- |
| `00-prelude.js` | `SRC` (own source for export), `$`, `$$`, `esc`, `store` |
| `01-ui-text.js` | `UI.hu` / `UI.en` strings; `T('key')` for UI strings, `tr({hu, en})` for inline ones |
| `02-state.js`, `03-helpers.js` | runtime state (`R`, …), small helpers |
| `04-marks-registry.js` | code-drawn marks: registry and user overrides (Markup tab) |
| `05-drawing-api.js`, `06-arrows.js`, `07-3d.js`, `08-physics-world.js`, `09-complex.js` | drawing API, animated arrows along paths and field loops, 3D projection and depth-sorted drawing, physics world, complex numbers (phasors) |
| `10-scene-api.js` | `scene API` (`makeApi`): every function a scene script can call |
| `11-main-loop.js`, `12-plots.js` | main loop, plots |
| `13-keyboard-input.js` | one system for all keys. `pressKey(k)` / `releaseKey(k)` take normalised key names (`normKey`: letters lower-case, `" "` = Space, `"ArrowLeft"` …) from the keyboard and from the touch buttons (`#kbPad`); `R.ctlKeys` (keys on controls), `R.keyOn` (`onKey`) and `R.keyPoll` (keys read with `key()`) decide whether the scene owns a key before Space / R / → / 1–9 are handled; `kbTick` moves held sliders every frame |
| `14-controls-panel.js`, `15-stage-layout.js`, `16-errors.js`, `17-transport.js` | controls panel, stage layout, errors, transport |
| `18-files.js`, `19-autosave.js`, `20-assets.js` | files (`saveFile`, `loadScene`, `parseSceneText`, standalone export), autosave, assets (images) |
| `21-markup-expressions.js`, `22-bound-arrow.js`, `23-markup-layer.js` | expressions for markup (values published with `val()`), `boundArrow`, the markup layer (mouse-drawn marks, saved with the scene) |
| `24-toast.js`, `25-code-editor.js`, `26-help.js`, `27-guide.js`, `28-gallery.js` | toast, code editor, help, guide (short lessons), gallery (see section 5) |
| `29-language.js`, `30-side-panel.js`, `31-wiring.js` | language, resizable side panel, wiring of all buttons and events |
| `32-boot.js` | boot; at its end the `?scene=` loader (`sceneLinkCandidates`: folder → `scene.animlab.json`; old `name.animlab.json` links fall back to the folder) |

Storage: `store.get/set` wraps `localStorage` with the prefix `animlab.` (language, tab, panel widths, graph height, autosave, gallery cache).

## 3. Layout modes

- **Desktop:** side panel + stage column. `#btFull` = full screen of the stage column (canvas + graphs); `#btCanvasFull` = canvas only (element full screen of `#stageWrap`, overlay buttons `#cvOverlay`).
- **Phone:** `body.mobile` is set from `matchMedia('(max-width: 900px), (pointer: coarse) and (max-height: 560px)')`. `body[data-mview]` (canvas | controls | code | assets | marks | help) picks the screen; `.mnav` switches it.
- **Canvas only without a full-screen API** (iPhone) and **phone landscape on the canvas screen:** `body.cvonly` (CSS fixed overlay).
- Graph strip height: `plotLaneH` (24–240 px per graph), dragged on `#plotSplit`, double-click resets to 64.

## 4. Conventions

- One built file (`index.html`, generated from `src/` by `build.js`), working offline (only the gallery needs a network), no external libraries, no bundler, no npm packages.
- **New features go into their own file** in `src/js/` (later `src/physics/`, `src/editor/`), expose **one named object** as their interface, and do not reach into other sections' internals. The existing sections are still pieces of one closure; they are converted only when a task says so.
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
