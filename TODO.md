# Teendők és tervek / To-do and plans

Fejlesztési ötletek és nyitott kérdések. Ha egy pont elkészül, kerüljön át a [CHANGELOG](CHANGELOG.md)-be, innen pedig törölhető. A fejlesztés menete: [docs/dev-notes.md](docs/dev-notes.md).
Development ideas and open questions. When an item is done, it goes into the [CHANGELOG](CHANGELOG.md) and can be removed from here. How development works: [docs/dev-notes.md](docs/dev-notes.md).

## Következő / Next

### 1. Billentyűzetes vezérlés / Keyboard control

Három réteg, ugyanarra a bemeneti rendszerre építve / three layers on one input system:

- **Billentyű a csúszkán, kapcsolón, gombon / keys on sliders, switches, buttons:** `param(..., {keys: "q a"})`, `toggle(..., {key: "s"})`, `button(..., {key: "Enter"})`. Nyomva tartva folyamatosan állít, Shift = 10× gyorsabb; a Vezérlők fülön kis billentyűjel látszik. / Holding a key moves the slider smoothly, Shift = 10× faster; a small key badge shows on the Controls tab.
- **Bármely része az animációnak / any part of the animation:** `key("ArrowLeft")` igaz, amíg nyomva van (az `update`-ben), `onKey(" ", fn)` lenyomásonként egyszer fut. / `key("ArrowLeft")` is true while held (in `update`), `onKey(" ", fn)` runs once per press.
- **Kód nélkül, minden jelenetnél / no code, every scene:** 1–9 kiválaszt egy csúszkát, a nyilak állítják; kiemelés csak-vászon módban is. / 1–9 picks a slider, the arrow keys adjust it; highlighted in canvas-only mode too.
- Ütközések / conflicts: ma Szóköz = lejátszás, R = újraindítás, → = léptetés. Ha a jelenet lefoglal egy ilyen billentyűt, a jelenet nyer; tartalék lejátszás: P. / Today Space = play, R = reset, → = step. If a scene binds one, the scene wins; backup play/pause: P.
- Vele együtt: Súgó, mindkét útmutató, AI-utasítások, 1–2 új minta (kocsi nyilakkal, motor terhelése billentyűvel). / Along with it: Help, both guides, AI instructions, 1–2 new presets (a cart driven with arrows, motor load set by keys).
- **Eldöntendő / to decide:** mindhárom réteg kell-e; telefonon legyenek-e érintőgombok a `key()` / `onKey()` jelenetekhez. / whether all three layers are wanted; whether phones get touch buttons for `key()` / `onKey()` scenes.

### 2. Külső eszköz bemenet (ESP32) / Device input (ESP32)

Közös formátum: soronként `név=érték` (vagy JSON); a jelenetben `input("pot")`, `param(..., {input: "pot", map: [0, 4095]})`, `toggle(..., {input: "btn"})`, visszafelé `send("led", 1)`. / Shared format: `name=value` per line (or JSON); in a scene `input("pot")`, `{input: …}` on controls, and `send(…)` back to the device.

1. **USB soros port (Web Serial)** – először; Chrome / Edge asztali gépen, GitHub Pages-ről és helyi fájlból is. ESP32 oldalon egy `Serial.printf` sor. / first; Chrome / Edge on desktop, from GitHub Pages or a local file. One `Serial.printf` line on the ESP32.
2. **Bluetooth LE (Web Bluetooth)** – vezeték nélkül, Androidon is (iPhone-on nem); kész ESP32 mintaprogrammal. / wireless, Android too (not iPhone); with a ready ESP32 sketch.
3. **WebSocket** – a https oldal (GitHub Pages) nem csatlakozhat `ws://` címre; helyi fájlból vagy az ESP32-ről kiszolgált oldalról működik. / an https page cannot connect to `ws://`; works from a local file or a page served by the ESP32.

- **Eldöntendő / to decide:** a billentyűzetes frissítéssel együtt vagy utána; melyik panellel teszteljünk (ESP32 DevKit / S3 / C3). / together with the keyboard update or after it; which board to test with.

### 3. Példagaléria a programban / Example gallery in the app

- A program beolvassa az `examples/index.json`-t, és kártyákon mutatja a példákat (cím, szerző, osztály, leírás), egy kattintással megnyitja őket. / The app reads `examples/index.json` and shows the examples as cards (title, author, class, description), opening one with a click.
- Helyi fájlból (`file://`) a lista nem tölthető le: ott a GitHubos listát kérje le, vagy jelezze, hogy internet kell. / From a local file the list cannot be fetched: use the GitHub copy there, or say that internet is needed.

## Nyitott ügyek / Open items

- **Linkek / links:** „Link másolása” gomb a programban; a `?scene=` fogadja el a GitHubos fájl-URL-t is (`github.com/.../blob/main/...`). / a "Copy link" button in the app; `?scene=` accepting a GitHub file URL too.
- **README:** kép a program felületéről; az üres `## ` címsor (egyelőre szándékosan marad). / a screenshot of the app; the empty `## ` heading (kept on purpose for now).
- **Tároló beállításai (a GitHub weboldalán) / repository settings (on the GitHub website):** témák (topics), v0.4 kiadás, social preview kép feltöltése, a Wiki és Projects fül kikapcsolása. / topics, a v0.4 release, uploading the social preview picture, turning off the Wiki and Projects tabs.
- **Apróság / small:** telefonon a „Betöltve… Visszavonás” üzenet egy ideig eltakar egy részt; lehetne kisebb vagy rövidebb ideig látszó. / on phones the "Loaded… Undo" message covers part of the screen for a while; it could be smaller or shorter.
