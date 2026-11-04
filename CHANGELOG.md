# Változások / Changelog

## Következő / Unreleased

- Új diákpélda / new student example: Logikai kapuk – fényrendszer / Logic gates – light system (`examples/students/13e_B_logikai-kapuk`, B., 13.E)
- Új diákpélda / new student example: Vitorlás a nyílt tengeren / Sailing ship at sea (`examples/students/13e_AD_hajo`, A. D., 13.E)
- Új diákpélda / new student example: Sugárkövetés: kocka és padló / Ray tracing: cube and floor (`examples/students/13e_AD_raytracing-kocka`, A. D., 13.E)
- Toyota THS-II példa: szerzők / authors: Tömöri Balázs, Dobi József; AI: Claude
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
