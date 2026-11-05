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

### 2. Példagaléria a programban / Example gallery in the app

- A program beolvassa az `examples/index.json`-t, és kártyákon mutatja a példákat (cím, szerző, osztály, leírás), egy kattintással megnyitja őket. / The app reads `examples/index.json` and shows the examples as cards (title, author, class, description), opening one with a click.
- Helyi fájlból (`file://`) a lista nem tölthető le: ott a GitHubos listát kérje le, vagy jelezze, hogy internet kell. / From a local file the list cannot be fetched: use the GitHub copy there, or say that internet is needed.

## Nyitott ügyek / Open items

- **Linkek / links:** „Link másolása” gomb a programban; a `?scene=` fogadja el a GitHubos fájl-URL-t is (`github.com/.../blob/main/...`). / a "Copy link" button in the app; `?scene=` accepting a GitHub file URL too.
- **README:** kép a program felületéről; az üres `## ` címsor (egyelőre szándékosan marad). / a screenshot of the app; the empty `## ` heading (kept on purpose for now).
- **Tároló beállításai (a GitHub weboldalán) / repository settings (on the GitHub website):** témák (topics), social preview kép feltöltése, a Wiki és Projects fül kikapcsolása. / topics, uploading the social preview picture, turning off the Wiki and Projects tabs.
- **Apróság / small:** telefonon a „Betöltve… Visszavonás” üzenet egy ideig eltakar egy részt; lehetne kisebb vagy rövidebb ideig látszó. / on phones the "Loaded… Undo" message covers part of the screen for a while; it could be smaller or shorter.
