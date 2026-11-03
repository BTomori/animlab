# AnimLab

**Interaktív fizikai és villamosgép-animációk tanításhoz – egyetlen HTML-fájlban, magyarul és angolul.**
*Interactive physics and electrical-machine animations for teaching – in a single HTML file, in Hungarian and English.*

▶ **Kipróbálás / Try it:** https://btomori.github.io/animlab/

> Ez az első, tesztelésre szánt kiadás. / This is the first release, meant for testing.

---

## 

Az AnimLab egy böngészőben futó animációs eszköz villamos és fizika tantárgyakhoz. Csúszkákkal állítható modelleket, élő grafikonokat és mért értékeket mutat, és saját jelenetek is írhatók benne néhány sor JavaScripttel. Telepíteni nem kell semmit, és internet nélkül is működik: elég megnyitni az `index.html` fájlt.

### Mintajelenetek

| Villamos gépek és hálózatok | Mechanika |
| --- | --- |
| Egyenáramú motor (kommutátor, Lorentz-erő, ellen-EMF) | Ferde hajítás (légellenállással) |
| Generátor (csúszógyűrű / kommutátor) | Lejtő súrlódással |
| Háromfázisú rendszer (csillag / delta, fázorok) | Ütközés (lendület, energia) |
| Forgó mágneses mező | Matematikai inga |
| Aszinkron (kalickás) motor, M(n) jelleggörbe | Sablon: alakzatok, képek, fizika |
| Szinkronmotor (terhelési szög, gerjesztés) | |
| 3D: forgó vezetőkeret mágneses térben | |
| 3D: kalickás forgórész forgó mezőben | |

### Főbb funkciók

- **Kétnyelvű felület** (HU/EN gomb); a jelenetek feliratai is kétnyelvűek.
- **Saját jelenetek** a Kód fülön: csúszkák, kapcsolók, fizika (`update`), rajzolás (`draw`), mért értékek és grafikonok.
- **Rajzolóeszközök:** alakzatok, nyilak, vektorok, fázorok, mozgó nyilak, erővonal-hurkok, háromfázisú állórész, 3D nézet, fizikai világ (gravitáció, ütközés, rugók), komplex számok.
- **Képek** feltöltése és animálása (például forgó forgórész).
- **Jelölők fül:** nyilak, erővonalak, áramutak, feliratok egérrel; méretük, vastagságuk és színük változóhoz köthető. A `boundArrow` nyilak beállításai a kód és a fül között mindkét irányban szinkronban vannak.
- **Mentés és exportálás:** jelenetfájl (`.animlab.json`), önálló HTML-fájl, videó (WebM) és állókép (PNG).
- **Súgó** lépésenkénti, kommentezett példákkal; részletes [programozási útmutató](docs/programozasi-utmutato.md) mind a 13 modell leírásával.

### Használat

1. Nyisd meg a [webes változatot](https://btomori.github.io/animlab/), vagy töltsd le az `index.html` fájlt, és nyisd meg bármely böngészőben.
2. A **Mintajelenetek** menüből válassz egy modellt, és állítsd a csúszkákat a **Vezérlők** fülön.
3. A **Kód** fülön a jelenet programja olvasható és átírható; **Ctrl+Enter** futtatja.
4. A **Mentés** gombbal a jelenet fájlba menthető, az **Exportálás → Önálló HTML-fájl** pedig egy tanulóknak kiadható fájlt készít.

Billentyűk: Szóköz – lejátszás/szünet, → – léptetés, R – újraindítás, Ctrl+S – mentés, Ctrl+O – megnyitás.

---

## English

AnimLab is a browser-based animation tool for electrical engineering and physics lessons. It shows models you control with sliders, together with live charts and readouts, and you can write your own scenes in a few lines of JavaScript. Nothing to install, and it works offline: just open `index.html`.

### Example scenes

DC motor, generator, three-phase system (star/delta, phasors), rotating magnetic field, induction motor with torque–speed curve, synchronous motor (load angle, excitation), two 3D scenes (rotating loop in a magnetic field, cage rotor in a rotating field), projectile motion, inclined plane, collision, simple pendulum, and a template scene.

### Main features

- **Bilingual interface** (HU/EN switch); scene labels are bilingual too.
- **Your own scenes** on the Code tab: sliders, switches, physics (`update`), drawing (`draw`), readouts and charts.
- **Drawing tools:** shapes, arrows, vectors, phasors, moving arrows, field-line loops, a three-phase stator, 3D view, a physics world (gravity, collisions, springs), complex numbers.
- **Upload and animate pictures** (e.g. a rotating rotor).
- **Markup tab:** arrows, field lines, current paths and labels drawn with the mouse; their size, width and colour can follow variables. `boundArrow` settings stay in sync between the code and the tab in both directions.
- **Save and export:** scene file (`.animlab.json`), standalone HTML file, video (WebM) and snapshot (PNG).
- **Help** with commented step-by-step examples, and a detailed [programming guide](docs/programozasi-utmutato.md) (in Hungarian) covering all 13 models.

### Usage

1. Open the [web version](https://btomori.github.io/animlab/), or download `index.html` and open it in any browser.
2. Pick a model from **Example scenes** and adjust the sliders on the **Controls** tab.
3. The **Code** tab shows the scene's program; edit it and press **Ctrl+Enter** to run.
4. **Save** writes the scene to a file; **Export → Standalone HTML file** makes a single file you can hand out to students.

---

## Fájlok / Files

| Fájl / File | Tartalom / Contents |
| --- | --- |
| `index.html` | Az alkalmazás / The application |
| `docs/programozasi-utmutato.md` | Programozási útmutató (magyar) / Programming guide (Hungarian) |
| `examples/valtozo-nyil.animlab.json` | Példajelenet: változóhoz kötött nyíl / Example scene: arrow bound to a variable |

## Licenc / License

[MIT](LICENSE) © 2026 Tömöri Balázs Gergely
