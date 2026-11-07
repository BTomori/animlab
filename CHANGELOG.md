# Változások / Changelog

## Készülő / Unreleased

- **Példagaléria a programban / example gallery in the app:** a **Galéria** gomb kártyákon mutatja a példákat (`examples/index.json`), téma, tanári / diák, címke és kereső szerint szűrve; kattintásra betölti a példát (visszavonható), a neve a kártya címe az aktuális nyelven. Egy új példa programfrissítés nélkül megjelenik. Internet nélkül a legutóbbi lista és a készüléken már megnyitott példák érhetők el. / The **Gallery** button shows the examples as cards (`examples/index.json`), filtered by topic, teacher / student, tag and search; a click loads an example (undoable), named with the card title in the current language. A new example shows up with no app release. Offline, the last list and the examples already opened on the device are available.
- **Kisebb program / smaller app:** csak a Sablon maradt beépítve, ezzel indul a program, ha nincs automatikusan mentett jelenet; a Mintajelenetek lista helyett Galéria gomb van. A 21 korábbi mintajelenet az `examples/teacher/` mappába költözött, a kódjuk nem változott; a Sablon a galériából is megnyitható. / Only the Template stays built in, and the app starts with it when there is no autosaved scene; a Gallery button replaces the Example scenes list. The 21 former built-in scenes moved to `examples/teacher/`, with their code unchanged; the Template opens from the gallery too.
- `examples/index.json` 2-es változat: `topics` (rögzített témalista), `tags` (a korábbi szabad szöveges címkék), `thumb` (később) / version 2: `topics` (fixed topic list), `tags` (the former free-text labels), `thumb` (later)
- Új diákpélda / new student example: Körökre osztott harc – paríroz! / Turn-based combat – parry! (`examples/students/13e_AD_harc`, A. D., 13.E)
- Új tanári példák kollégáknak / new teacher examples for colleagues: Fogaskerék-áttétel / Gear ratio (`fogaskerek-attetel`), Folyamatábra / Flowchart (`folyamatabra`), Hálózati térkép / Network map (`halozati-terkep`), Bemutató diákkal / Slide presentation (`bemutato-diak`), kiemelve a példák élén / featured at the top of the examples
- Új bevezető a README-ben: elsősorban STEM-tárgyakhoz, de játék és prezentáció is készíthető vele, így bármely tantárgyban használható / new README introduction: built mainly for STEM subjects, but also for games and presentations, so it fits any subject

## v0.5 – 2026-11-05

- **Billentyűzetes vezérlés / keyboard control:**
  - billentyű a csúszkán, kapcsolón, listán, gombon: `param(..., {keys: "q a"})`, `toggle(..., {key: "s"})`, `choice(..., {key: "c"})`, `button(..., {key: "Enter"})`; nyomva tartva folyamatosan állít, Shift = 10×; kis billentyűjel a Vezérlők fülön / keys on sliders, switches, lists and buttons; holding moves smoothly, Shift = 10×; a small key badge on the Controls tab
  - a jelenet kódjában: `key("ArrowLeft")` (igaz, amíg nyomva van), `onKey(" ", fn)` (lenyomásonként egyszer) / in scene code: `key()` (true while held), `onKey()` (once per press)
  - telefonon és táblagépen a `key()` / `onKey()` billentyűi gombként jelennek meg a vásznon (`{label}` = felirat) / on phones and tablets the `key()` / `onKey()` keys appear as touch buttons on the canvas (`{label}` = text)
  - kód nélkül, minden jelenetnél: 1–9 kiválaszt egy csúszkát, a nyilak állítják, Esc / 0 = kész; kiemelés a Vezérlők fülön és a vásznon (csak-vászon módban is) / no code, every scene: 1–9 picks a slider, the arrows move it, Esc / 0 = done; highlighted on the Controls tab and on the canvas (also in canvas-only mode)
  - ha a jelenet lefoglalja a Szóközt, az R-t vagy a →-t, a jelenet nyer; új tartalék lejátszás / szünet: P / if a scene binds Space, R or →, the scene wins; new backup play / pause: P
  - billentyűlista: ⌨ gomb a vászon sarkában vagy a ? billentyű, a Vezérlők fülön összecsukható sor; a `key()` / `onKey()` leírása: `{help}` / key list: a ⌨ button in the canvas corner or the ? key, a collapsible line on the Controls tab; describe `key()` / `onKey()` with `{help}`
  - régi jelenetek, amelyek saját `key` vagy `onKey` változót hoznak létre, továbbra is futnak / older scenes that declare their own `key` or `onKey` variable still run
- Új minta / new preset: Kocsi nyilakkal (billentyűzet, Newton II.) / Cart with the arrow keys (keyboard, Newton's second law)
- Aszinkron motor: terhelőnyomaték W / S, forgásirány V, indítás Enter / induction motor: load torque W / S, reverse V, start Enter
- Súgó: Billentyűzet szakasz és lecke; mindkét útmutató és az AI-utasítások kiegészítve / Help: Keyboard section and lesson; both guides and the AI instructions updated
- Új diákpélda / new student example: Logikai kapuk – fényrendszer / Logic gates – light system (`examples/students/13e_B_logikai-kapuk`, B., 13.E)
- Új diákpélda / new student example: Vitorlás a nyílt tengeren / Sailing ship at sea (`examples/students/13e_AD_hajo`, A. D., 13.E)
- Új diákpélda / new student example: Sugárkövetés: kocka és padló / Ray tracing: cube and floor (`examples/students/13e_AD_raytracing-kocka`, A. D., 13.E)
- Toyota THS-II példa: szerzők / authors: Tömöri Balázs, Dobi József; AI: Claude
- Toyota THS-II példa: a forrás PDF a `media` mappába került / Toyota THS-II example: the source PDF moved into `media`
- Toyota THS-II példa: a teljesítmény-táblázat soronként kiírja az állapotot (pl. „Akku – töltés”, „MG1 – generátor”), a jármű energiamérlege számokkal / Toyota THS-II example: the power chart names each component's state (e.g. "Battery – charging", "MG1 – generator"), with the vehicle's energy balance written out
- Az Elhagyott ház osztálya javítva 13.E-re, a mappa új neve `13e_AD_elhagyott-haz` / Abandoned house: class corrected to 13.E, folder renamed to `13e_AD_elhagyott-haz`

## v0.4 – 2026-11-04

- Csak a vászon teljes képernyőn, lebegő lejátszás / visszaállítás / menü / kilépés gombokkal / canvas-only full screen with floating play, reset, menu and exit buttons
- A grafikonsáv magassága húzással állítható (normál és teljes képernyős módban is; dupla kattintás = alapérték) / graph strip height adjustable by dragging, also in full screen (double-click resets)
- Telefonos nézet: alsó sáv a vászon, vezérlők, kód (teljes magasságú szerkesztő), képek, jelölők és súgó között; tömör felső sáv ☰ menüvel / phone view: bottom bar switching between canvas, controls, full-height code editor, pictures, markup and help; compact top bar with a ☰ menu
- Telefon elforgatásakor a vászon kitölti a képernyőt / turning the phone sideways fills the screen with the canvas
- Minden példa saját mappában: `scene.animlab.json`, `README.md` (leírás, források), `media/` (képek, videók); `examples/index.json` a későbbi galériához / every example in its own folder with `scene.animlab.json`, a `README.md` (description, sources) and `media/` (pictures, videos); `examples/index.json` for a later gallery
- Rövidebb jelenetlink: `?scene=examples/teacher/lengo-labda` (mappa); a régi, fájlra mutató linkek is működnek / shorter scene links pointing to a folder; old links to the file still work

## v0.3 – 2026-11-04

- Mentés: a fájltípus megadásával a kiterjesztés megmarad (`.animlab.json`, `.html`) / saving keeps the file extension
- Exportálás → Megosztás üzenetben: önálló HTML a telefon megosztó menüjével / Export → Share in a chat via the share sheet
- A Megnyitás az exportált `.html` fájlt is betölti / Open also loads an exported `.html`
- Link egy jelenetre: `?scene=examples/...` / link to a scene: `?scene=examples/...`
- A jelenetlink mindig a legfrissebb változatot tölti be, nem a böngésző gyorsítótárából / a scene link always loads the newest version, not the browser's cached copy
- `examples/` mappa tanári mintákkal, diákmunkáknak, és beküldő űrlap / `examples/` folder with teacher examples, a place for student work and a submission form

## v0.2 – 2026-11-03

- 21 mintajelenet; új / new: Ohm törvénye izzóval (Ohm's law with a lamp), RC kör (RC circuit), forgó fázor (rotating phasor), egyfázisú transzformátor (single-phase transformer), forgórész fényképről (rotor from a photo), ferde hajítás: mérés és elmélet (projectile measured vs. theory), pattogó labda (bouncing ball), csillapított rugós rezgés (damped spring)
- Kód írása AI-jal: Súgó fül → AI-utasítások másolása / Writing code with AI: Help tab → Copy AI instructions
- Képforgatás forgásponttal, SVG-javítás, hibajelzés hiányzó képnél / picture rotation with a pivot, SVG repair, warning for a missing picture
- Mozgó nyilak nem ugrálnak változó sebességnél / moving arrows no longer jump when their speed changes
- Programozási útmutató magyarul és angolul / programming guide in Hungarian and English
- Tesztjelentés / test report: `tests/gemini-2026-11-03/`

## v0.1 – 2026-11-03

- Első, tesztelésre szánt kiadás / first release for testing
