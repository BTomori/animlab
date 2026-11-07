# Teendők és tervek / To-do and plans

Fejlesztési ötletek és nyitott kérdések. Ha egy pont elkészül, kerüljön át a [CHANGELOG](CHANGELOG.md)-be, innen pedig törölhető. A fejlesztés menete: [docs/dev-notes.md](docs/dev-notes.md).
Development ideas and open questions. When an item is done, it goes into the [CHANGELOG](CHANGELOG.md) and can be removed from here. How development works: [docs/dev-notes.md](docs/dev-notes.md).

## Következő / Next

### 1. Külső eszköz bemenet (ESP32) / Device input (ESP32)

Közös formátum: soronként `név=érték` (vagy JSON); a jelenetben `input("pot")`, `param(..., {input: "pot", map: [0, 4095]})`, `toggle(..., {input: "btn"})`, visszafelé `send("led", 1)`. / Shared format: `name=value` per line (or JSON); in a scene `input("pot")`, `{input: …}` on controls, and `send(…)` back to the device.

1. **USB soros port (Web Serial)** – először; Chrome / Edge asztali gépen, GitHub Pages-ről és helyi fájlból is. ESP32 oldalon egy `Serial.printf` sor. / first; Chrome / Edge on desktop, from GitHub Pages or a local file. One `Serial.printf` line on the ESP32.
2. **Bluetooth LE (Web Bluetooth)** – vezeték nélkül, Androidon is (iPhone-on nem); kész ESP32 mintaprogrammal. / wireless, Android too (not iPhone); with a ready ESP32 sketch.
3. **WebSocket** – a https oldal (GitHub Pages) nem csatlakozhat `ws://` címre; helyi fájlból vagy az ESP32-ről kiszolgált oldalról működik. / an https page cannot connect to `ws://`; works from a local file or a page served by the ESP32.

- A billentyűzetes rendszerre épülhet (`kbTick`, `pressKey`): az `input()` értékei ugyanúgy jutnak a csúszkákra. / Can build on the keyboard system (`kbTick`, `pressKey`): `input()` values reach the sliders the same way.
- **Eldöntendő / to decide:** melyik panellel teszteljünk (ESP32 DevKit / S3 / C3). / which board to test with.

### 2. Példagaléria: ami hátravan / Example gallery: what is left

- **Bélyegképek / thumbnails:** a galéria kártyája megmutatja az `index.json` `thumb` mezőjét (pl. `"thumb": "media/thumb.png"`), de a képek még nem készültek el. / The gallery card shows the `thumb` field of `index.json` (e.g. `"thumb": "media/thumb.png"`), but the pictures are not made yet.
- **Javasolt / proposed:** `minVersion` mező az `index.json`-ban, hogy egy régi programpéldány ne töltsön be olyan jelenetet, amelyet nem tud futtatni. / a `minVersion` field in `index.json` so an old app copy does not load a scene it cannot run.

### 3. Interaktív vászon / Interactive canvas

A vászon elemei kattinthatók és rámutatásra reagálnak, így a jelenetet a saját rajzolt elemei vezérlik. / Canvas elements react to clicks and hovering, so a scene is controlled by its own drawn elements.

- **Alap / base:** egérállapot és kattintás: `mouse()` (x, y, lenyomva), `onClick(fn)`, `inside(x, y, alakzat)`. / pointer state and clicks: `mouse()` (x, y, down), `onClick(fn)`, `inside(x, y, shape)`.
- **Elnevezett elemek (javasolt első lépés) / named hotspots (suggested first step):** bármely alakzat kaphat nevet (`{id: "k1"}`), a program képkockánként megjegyzi a körvonalát (forgatással, 3D vetítéssel); a jelenetben `hover("k1")`, `clicked("k1")`, `onClick("k1", fn)`. Kötés a vezérlőkhöz: `{toggle: "S"}` kattintásra vált, `{param: "U", drag: "y"}` húzásra állítja a csúszkát; az érték együtt mozog a Vezérlők füllel, az automatikus mentéssel és a billentyűzettel. / any shape can get a name (`{id: "k1"}`); each frame the app records its outline (with rotation and 3D projection); the scene uses `hover("k1")`, `clicked("k1")`, `onClick("k1", fn)`. Binding to controls: `{toggle: "S"}` flips on click, `{param: "U", drag: "y"}` moves the slider when dragged; the value stays in sync with the Controls tab, autosave and the keyboard.
- **Később / later:** kész vászonelemek (forgatógomb, kapcsoló, nyomógomb, csúszka), korlátozott húzás, fizikai testek megfogása, 3D kijelölés, többujjas érintés. / ready-made canvas widgets (knob, switch, push button, slider), constrained dragging, grabbing physics bodies, 3D picking, multi-touch.
- **Figyelni / watch out for:** a Jelölők fül eszközei elsőbbséget kapnak; telefonon nincs rámutatás (koppintás = kattintás, érintéskor ne görgessen az oldal); szüneteltetve is működjön; régi jelenetek és önálló HTML változatlanul fussanak; a csak-vászon nézet gombjai ne ütközzenek. / Markup-tab tools take priority; no hover on phones (tap = click, no page scroll while touching an element); works while paused; old scenes and standalone HTML keep working; no clash with the canvas-only overlay buttons.
- Új parancsok: Súgó fül, mindkét programozási útmutató, AI-utasítások; példa és tesztek. / New commands: Help tab, both programming guides, AI instructions; an example and tests.
- **Eldöntendő / to decide:** automatikus kiemelés rámutatáskor, vagy a jelenet dönti el; legyen-e húzással állítás az első változatban; sorrend az ESP32 bemenethez képest (az ESP32-vel közös úton jutnak az értékek a vezérlőkre). / automatic highlight on hover, or left to the scene; whether drag-to-set is in the first version; order relative to the ESP32 input (both feed values to the controls the same way).

## Nyitott ügyek / Open items

- **Linkek / links:** „Link másolása” gomb a programban; a `?scene=` fogadja el a GitHubos fájl-URL-t is (`github.com/.../blob/main/...`). / a "Copy link" button in the app; `?scene=` accepting a GitHub file URL too.
- **README:** kép a program felületéről; az üres `## ` címsor (egyelőre szándékosan marad). / a screenshot of the app; the empty `## ` heading (kept on purpose for now).
- **Tároló beállításai (a GitHub weboldalán) / repository settings (on the GitHub website):** témák (topics), social preview kép feltöltése, a Wiki és Projects fül kikapcsolása. / topics, uploading the social preview picture, turning off the Wiki and Projects tabs.
- **Apróság / small:** telefonon a „Betöltve… Visszavonás” üzenet egy ideig eltakar egy részt; lehetne kisebb vagy rövidebb ideig látszó. / on phones the "Loaded… Undo" message covers part of the screen for a while; it could be smaller or shorter.
