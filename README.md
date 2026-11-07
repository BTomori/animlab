# AnimLab

**Interaktív animációk tanításhoz – elsősorban STEM-tárgyakhoz, de játék és prezentáció is készíthető vele. Egyetlen HTML-fájl, magyarul és angolul.**
*Interactive animations for teaching – built for STEM subjects, and just as good for games and presentations. A single HTML file, in Hungarian and English.*

▶ **Kipróbálás / Try it:** https://btomori.github.io/animlab/

> Tesztelésre szánt kiadás: példagaléria több mint 30 példával, és saját jelenet írása bármelyik ingyenes AI-csevegővel. / A release for testing: an example gallery with more than 30 examples, and your own scenes written with any free AI chat.

---

## 

Az AnimLab egy böngészőben futó animációs eszköz. Elsősorban természettudományos és műszaki (STEM) tárgyakhoz készült: csúszkákkal állítható modelleket, élő grafikonokat és mért értékeket mutat a villamos gépektől a mechanikáig. Mivel minden jelenet néhány sor JavaScript – amelyet akár egy AI-csevegő is megír –, ugyanúgy készíthető benne játék, interaktív prezentáció vagy filmszerű 3D jelenet is, így bármely tantárgyban és területen használható. Telepíteni nem kell semmit, és internet nélkül is működik (csak a példagalériához kell internet): elég megnyitni az `index.html` fájlt.

**Mire használható?**

- **Szemléltetés órán:** villamosság, villamos gépek, fizika, digitális technika – kivetítőn vagy a diákok telefonján
- **Interaktív prezentáció:** kapcsolókkal, billentyűkkel léptethető, lépésenként felépülő ábrák – minta minden tantárgyhoz: [Bemutató diákkal](examples/teacher/bemutato-diak/) ([▶ megnyitás](https://btomori.github.io/animlab/?scene=examples/teacher/bemutato-diak))
- **Játék és kísérletezés:** billentyűvel vezérelhető jelenetek, fizikai világ (gravitáció, ütközés, rugók)
- **Diákprojekt:** a diákok AI segítségével saját jelenetet írnak – lásd a logikai kapukat, a 3D filmjeleneteket és a sugárkövetőt a [példák](examples/) között

### Példagaléria

A program **Galéria** gombja kártyákon mutatja a tanári és diákpéldákat, téma, címke és kereső szerint szűrve; egy kattintás betölti a példát (visszavonható). Egy újonnan feltöltött példa programfrissítés nélkül megjelenik. A példák a GitHubról töltődnek le; internet nélkül a legutóbb letöltött lista és a készüléken már megnyitott példák érhetők el. Az összes példa az [`examples`](examples/) mappában van.

### Főbb funkciók

- **Kétnyelvű felület** (HU/EN gomb); a jelenetek feliratai és a példakódok kommentjei is kétnyelvűek.
- **Saját jelenetek** a Kód fülön: csúszkák, kapcsolók, fizika (`update`), rajzolás (`draw`), mért értékek és grafikonok.
- **Kód írása AI-jal:** a Súgó fülön egy gombbal kimásolhatók az AI-utasítások (lásd lent).
- **Rajzolóeszközök:** alakzatok, nyilak, vektorok, fázorok, mozgó nyilak, erővonal-hurkok, háromfázisú állórész, 3D nézet, fizikai világ (gravitáció, ütközés, rugók), komplex számok.
- **Képek** feltöltése és animálása (például forgó forgórész), forgásponttal.
- **Jelölők fül:** nyilak, erővonalak, áramutak, feliratok egérrel; méretük, vastagságuk és színük változóhoz köthető. A `boundArrow` nyilak beállításai a kód és a fül között mindkét irányban szinkronban vannak.
- **Billentyűzetes vezérlés:** a csúszkák, kapcsolók és gombok billentyűt kaphatnak, a jelenet kódja figyelheti a billentyűket (`key`, `onKey`), telefonon ezekhez gombok jelennek meg a vásznon; kód nélkül is: 1–9 kiválaszt egy csúszkát, a nyilak állítják. A jelenet billentyűi a vászon ⌨ gombjával vagy a ? billentyűvel listázhatók.
- **Teljes képernyő és telefonos nézet:** csak a vászon teljes képernyőn (lebegő gombokkal), a grafikonsáv magassága húzással állítható; telefonon alsó sáv vált a vászon, a vezérlők, a kód, a képek, a jelölők és a súgó között, fekvő helyzetben a vászon kitölti a képernyőt.
- **Mentés és exportálás:** jelenetfájl (`.animlab.json`), önálló HTML-fájl, videó (WebM) és állókép (PNG).
- **Súgó** lépésenkénti, kommentezett példákkal; részletes [programozási útmutató](docs/programozasi-utmutato.md) és angol [programming guide](docs/programming-guide-en.md).

### Használat

1. Nyisd meg a [webes változatot](https://btomori.github.io/animlab/), vagy töltsd le az `index.html` fájlt, és nyisd meg bármely böngészőben.
2. A **Galéria** gombbal válassz egy példát, és állítsd a csúszkákat a **Vezérlők** fülön.
3. A **Kód** fülön a jelenet programja olvasható és átírható; **Ctrl+Enter** futtatja.
4. A **Mentés** gombbal a jelenet fájlba menthető, az **Exportálás → Önálló HTML-fájl** pedig egy tanulóknak kiadható fájlt készít.

### Mentés és megosztás

| Mit szeretnél? | Mit válassz? | Mit kapsz? |
| --- | --- | --- |
| Később folytatni a szerkesztést | **Mentés** | `.animlab.json` fájl; a **Megnyitás** betölti |
| Tanulóknak, kollégáknak elküldeni üzenetben | **Exportálás → Megosztás üzenetben** | Önálló `.html` fájl a telefon megosztó menüjével (Messenger, WhatsApp, Teams, e-mail); a címzett böngészőben nyitja meg, internet nélkül is |
| Egy linket küldeni | Tedd a jelenetet egy saját mappába az [`examples`](examples/) mappán belül | `https://btomori.github.io/animlab/?scene=examples/teacher/lengo-labda` – bármelyik üzenetben megnyitható |

A **Megnyitás** az exportált `.html` fájlt is betölti szerkesztésre, így egy elküldött jelenetet a címzett tovább is fejleszthet.

### Példák és diákmunkák

Az [`examples`](examples/) mappában tanári minták és a diákok által készített jelenetek vannak. Minden példának saját mappája van a jelenettel, egy leírással (források, órai használat) és egy `media` almappával a képeknek és videóknak; mindegyik linkkel megnyitható. Kollégáknak új tanári minták: fogaskerék-áttétel, folyamatábra, hálózati térkép és egy minden tantárgyhoz használható diavetítés. Diákok az **Issues → New issue → Új példa beküldése** űrlappal küldhetnek be új jelenetet; a részletek az [`examples/README.md`](examples/README.md) fájlban vannak.

Billentyűk: Szóköz vagy P – lejátszás/szünet, → – léptetés, R – újraindítás, 1–9 – csúszka kiválasztása, utána ← → állítja (Shift = gyorsabb, Esc = kész), Ctrl+S – mentés, Ctrl+O – megnyitás. Ha a jelenet saját billentyűt használ (például a nyilakat), az nyer; a P mindig működik.

### Jelenet írása AI segítségével

Programozni sem kell tudni: bármelyik ingyenes AI-csevegő (ChatGPT, Gemini, Copilot, Claude…) megírja a jelenetet, ha előbb elolvassa az AnimLab [AI-utasításait](docs/animlab-ai-instructions.md). Ez egy gépeknek írt leírás: a teljes parancskészlet, a hibákat megelőző szabályok és négy kipróbált példa.

1. **Utasítások kimásolása:** AnimLab → **Súgó** fül → **Kód írása AI segítségével** → **AI-utasítások másolása**. (Vagy nyisd meg a [`docs/animlab-ai-instructions.md`](docs/animlab-ai-instructions.md) fájlt, és másold ki az egészet.)
2. **Beillesztés:** nyiss új csevegést az AI-alkalmazásban, és illeszd be első üzenetként.
3. **Kérés:** írd le, mit szeretnél – mit mutasson a jelenet, milyen csúszkák, mért értékek és grafikonok legyenek, kinek szól.
4. **Futtatás:** a válaszban kapott kódot másold be: **Új** → **Kód** fül → Ctrl+Enter.
5. **Javítás:** ha valami nem jó, írd le az AI-nak, vagy másold be neki a piros hibaüzenetet a sorszámmal. Egyszerre egy változtatást kérj.

Rövid példa – a kérés:

> Készíts egy jelenetet: egy labda leng balra-jobbra egy fonálon. A frekvencia csúszkával állítható legyen 0–2 Hz között. Írd ki a kitérést, és rajzolj róla grafikont.

Egy jó válasz ehhez hasonló kódot ad (ezt beillesztve azonnal fut):

```javascript
stage(1000, 600, "#ffffff");                                  // vászon: 1000 × 600 px, fehér háttér
title({hu: "Lengő labda", en: "Swinging ball"});
param("f", {hu: "Frekvencia f", en: "Frequency f"}, 0, 2, 0.5, 0.05, "Hz");   // csúszka → P.f
let phase = 0;                                                // fázisszög (rad), állapotváltozó
update(dt => { phase += 2 * PI * P.f * dt; });                // fizika: a fázis ω·dt-vel nő, ω = 2πf
draw(t => {                                                   // rajzolás minden képkockán
  const x = 500 + 300 * sin(phase);                           // középpont 500 px, amplitúdó 300 px
  line(500, 100, x, 300, {stroke: C.gray, lw: 2});            // a fonál
  circle(x, 300, 30, {fill: C.blue});                         // a labda
  show({hu: "Kitérés", en: "Displacement"}, x - 500, "px");   // mért érték a Vezérlők fülön
  plot("x", x - 500, {unit: "px"});                           // élő grafikon
});
```

Nevezd meg a fizikai modellt (ideális vagy veszteséges), a mértékegységeket és a tartományokat; minél pontosabb a kérés, annál kevesebb javítás kell. Az AI is tévedhet: óra előtt ellenőrizd a képleteket és a kiírt értékeket egy kézzel kiszámolt példán. Az utasításokat a Gemini 3.5 Flash-Lite ingyenes változatával teszteltük, az eredmények a [`tests`](tests/) mappában vannak.

---

## English

AnimLab is a browser-based animation tool. It was built mainly for science and engineering (STEM) subjects: models you control with sliders, with live charts and readouts, from electrical machines to mechanics. Because every scene is a few lines of JavaScript – which an AI chat can write for you – you can just as well make a game, an interactive presentation or a cinematic 3D scene, so it fits any subject or field. Nothing to install, and it works offline (only the example gallery needs the internet): just open `index.html`.

**What can you use it for?**

- **Demonstrations in class:** electricity, electrical machines, physics, digital electronics – on a projector or on students' phones
- **Interactive presentations:** diagrams that build up step by step, driven by switches and keys – a sample for every subject: [Slide presentation](examples/teacher/bemutato-diak/) ([▶ open](https://btomori.github.io/animlab/?scene=examples/teacher/bemutato-diak))
- **Games and experiments:** keyboard-controlled scenes, a physics world (gravity, collisions, springs)
- **Student projects:** students write their own scenes with an AI – see the logic gates, the 3D film scenes and the ray tracer in the [examples](examples/)

### Example gallery

The app's **Gallery** button shows teacher and student examples as cards, filtered by topic, tag and search; one click loads an example (and can be undone). A newly uploaded example shows up with no app release. Examples download from GitHub; offline, the last downloaded list and the examples already opened on the device are available. All examples are in the [`examples`](examples/) folder.

### Main features

- **Bilingual interface** (HU/EN switch); scene labels and the comments in the example code are bilingual too.
- **Your own scenes** on the Code tab: sliders, switches, physics (`update`), drawing (`draw`), readouts and charts.
- **Writing code with AI:** the Help tab copies the AI instructions with one click (see below).
- **Drawing tools:** shapes, arrows, vectors, phasors, moving arrows, field-line loops, a three-phase stator, 3D view, a physics world (gravity, collisions, springs), complex numbers.
- **Upload and animate pictures** (e.g. a rotating rotor), with a pivot point.
- **Markup tab:** arrows, field lines, current paths and labels drawn with the mouse; their size, width and colour can follow variables. `boundArrow` settings stay in sync between the code and the tab in both directions.
- **Keyboard control:** sliders, switches and buttons can get keys, scene code can read keys (`key`, `onKey`), and phones show touch buttons for them on the canvas; without code too: 1–9 picks a slider and the arrow keys move it. The ⌨ button on the canvas or the ? key lists the scene's keys.
- **Full screen and phone view:** canvas-only full screen (with floating buttons) and a graph strip you resize by dragging; on a phone a bottom bar switches between canvas, controls, code, pictures, markup and help, and turning the phone sideways fills the screen with the canvas.
- **Save and export:** scene file (`.animlab.json`), standalone HTML file, video (WebM) and snapshot (PNG).
- **Help** with commented step-by-step examples, the [programming guide](docs/programming-guide-en.md) in English and the detailed [Hungarian guide](docs/programozasi-utmutato.md) covering every model.

### Usage

1. Open the [web version](https://btomori.github.io/animlab/), or download `index.html` and open it in any browser.
2. Pick an example with the **Gallery** button and adjust the sliders on the **Controls** tab.
3. The **Code** tab shows the scene's program; edit it and press **Ctrl+Enter** to run.
4. **Save** writes the scene to a file; **Export → Standalone HTML file** makes a single file you can hand out to students.

### Saving and sharing

| You want to… | Choose | You get |
| --- | --- | --- |
| Continue editing later | **Save** | an `.animlab.json` file; **Open** loads it |
| Send it to students or colleagues in a chat | **Export → Share in a chat** | a standalone `.html` file via the phone's share sheet (Messenger, WhatsApp, Teams, e-mail); the recipient opens it in a browser, even offline |
| Send a link | Put the scene into its own folder inside [`examples`](examples/) | `https://btomori.github.io/animlab/?scene=examples/teacher/lengo-labda` – opens from any chat |

**Open** also loads an exported `.html` file for editing, so a recipient can build on a scene you sent.

### Examples and student work

The [`examples`](examples/) folder holds teacher examples and scenes made by students. Every example has its own folder with the scene, a description (sources, classroom use) and a `media` subfolder for pictures and videos; each one opens with a link. New teacher examples for colleagues: gear ratio, flowchart, network map and a slide presentation for any subject. Students submit new scenes with the **Issues → New issue → New example** form; details are in [`examples/README.md`](examples/README.md).

Keys: Space or P – play/pause, → – step, R – restart, 1–9 – pick a slider, then ← → move it (Shift = faster, Esc = done), Ctrl+S – save, Ctrl+O – open. If a scene uses a key itself (the arrows, for example), the scene wins; P always works.

### Writing scenes with an AI assistant

You don't need to know how to program: any free AI chat (ChatGPT, Gemini, Copilot, Claude…) can write a scene once it has read the AnimLab [AI instructions](docs/animlab-ai-instructions.md). They are written for machines: the complete command set, rules that prevent common errors and four tested examples.

1. **Copy the instructions:** AnimLab → **Help** tab → **Writing code with an AI assistant** → **Copy AI instructions**. (Or open [`docs/animlab-ai-instructions.md`](docs/animlab-ai-instructions.md) and copy all of it.)
2. **Paste:** start a new chat in the AI app and paste them as the first message.
3. **Ask:** describe what you want – what the scene shows, which sliders, readouts and graphs, and who it is for.
4. **Run:** paste the code you get: **New** → **Code** tab → Ctrl+Enter.
5. **Fix:** if something is wrong, tell the AI what you see, or paste the red error message with its line number. Ask for one change at a time.

A short example – the request:

> Make a scene with a ball swinging left and right on a string. The frequency should be a slider from 0 to 2 Hz. Show the displacement and plot it.

A good answer gives code like this (paste it in and it runs):

```javascript
stage(1000, 600, "#ffffff");                                  // canvas: 1000 × 600 px, white background
title({hu: "Lengő labda", en: "Swinging ball"});
param("f", {hu: "Frekvencia f", en: "Frequency f"}, 0, 2, 0.5, 0.05, "Hz");   // slider → P.f
let phase = 0;                                                // phase angle (rad), the state variable
update(dt => { phase += 2 * PI * P.f * dt; });                // physics: the phase grows by ω·dt, ω = 2πf
draw(t => {                                                   // drawing, every frame
  const x = 500 + 300 * sin(phase);                           // centre 500 px, amplitude 300 px
  line(500, 100, x, 300, {stroke: C.gray, lw: 2});            // the string
  circle(x, 300, 30, {fill: C.blue});                         // the ball
  show({hu: "Kitérés", en: "Displacement"}, x - 500, "px");   // a readout on the Controls tab
  plot("x", x - 500, {unit: "px"});                           // a live graph
});
```

Name the physical model (ideal or with losses), the units and the ranges; the more precise the request, the less fixing it needs. An AI can still make mistakes: before a lesson, check the formulas and the readouts against a value you calculate by hand. The instructions were tested with the free Gemini 3.5 Flash-Lite; the results are in the [`tests`](tests/) folder.

---

## Fájlok / Files

| Fájl / File | Tartalom / Contents |
| --- | --- |
| `index.html` | Az alkalmazás / The application |
| `docs/animlab-ai-instructions.md` | AI-utasítások (AI-csevegőbe illesztendő) / AI instructions (paste into an AI chat) |
| `docs/programozasi-utmutato.md` | Programozási útmutató (magyar) / Programming guide (Hungarian) |
| `docs/programming-guide-en.md` | Programozási útmutató (angol) / Programming guide (English) |
| `examples/` | Tanári minták és diákmunkák, beküldési útmutató / Teacher examples and student work, how to submit |
| `docs/dev-notes.md` | Fejlesztői jegyzet saját módosításokhoz: a fájl felépítése és szabályai / Developer notes for your own modifications: how the file is built and its rules |
| `TODO.md` | Teendők és tervek / To-do and plans |
| `.github/ISSUE_TEMPLATE/uj-pelda.yml` | Űrlap új példa beküldéséhez / Form for submitting a new example |
| `tests/gemini-2026-11-03/` | Az AI-utasítások tesztje Geminivel: beszélgetések, kódok, képek, jelentés / Test of the AI instructions with Gemini: sessions, codes, screenshots, report |

## Licenc / License

[MIT](LICENSE) © 2026 Tömöri Balázs Gergely
