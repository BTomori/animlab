# Példák / Examples

Minden példának saját mappája van: a `teacher` mappában tanári minták, a `students` mappában a diákok által készített jelenetek.
Every example has its own folder: teacher examples in `teacher`, scenes made by students in `students`.

| Példa / Example | Készítette / Made by | Link |
| --- | --- | --- |
| [Lengő labda / Swinging ball](teacher/lengo-labda/) | Tanár / teacher | [▶ megnyitás / open](https://btomori.github.io/animlab/?scene=examples/teacher/lengo-labda) |
| [Változó nyíl / Changing arrow](teacher/valtozo-nyil/) | Tanár / teacher | [▶ megnyitás / open](https://btomori.github.io/animlab/?scene=examples/teacher/valtozo-nyil) |
| [Toyota THS-II (Prius II) hibrid hajtáslánc / hybrid drivetrain](teacher/toyota-ths2-hajtaslanc/) | Tanár / teacher | [▶ megnyitás / open](https://btomori.github.io/animlab/?scene=examples/teacher/toyota-ths2-hajtaslanc) |
| [Elhagyott ház / Abandoned house](students/13d_AD_elhagyott-haz/) | A. D., 13.D | [▶ megnyitás / open](https://btomori.github.io/animlab/?scene=examples/students/13d_AD_elhagyott-haz) |
| [Logikai kapuk / Logic gates](students/13e_B_logikai-kapuk/) | B., 13.E | [▶ megnyitás / open](https://btomori.github.io/animlab/?scene=examples/students/13e_B_logikai-kapuk) |

## Egy példa mappája / The folder of an example

```
examples/teacher/toyota-ths2-hajtaslanc/
  scene.animlab.json   ← a jelenet, mindig ezen a néven / the scene, always this name
  README.md            ← leírás HU/EN, órai használat, források / description HU/EN, classroom use, sources
  media/               ← képek, rövid videók, PDF-ek, feladatlapok / pictures, short videos, PDFs, worksheets
```

- A `README.md` a GitHubon a mappa megnyitásakor magától megjelenik, ezért ide kerül minden, ami a példához tartozik: leírás, források, képek, a megnyitó link. / GitHub shows the `README.md` automatically when the folder is opened, so everything that belongs to the example goes here: description, sources, pictures, the link that opens it.
- Képet a README-be így teszel / to put a picture into the README: `![leírás / description](media/kep.png)`
- **Videók / videos:** a GitHub a 100 MB-nál nagyobb fájlt nem fogadja el, 50 MB felett figyelmeztet. A rövid, tömörített klipek mehetnek a `media/` mappába, a hosszabbakat tedd YouTube-ra vagy Google Drive-ra, és a README-ből linkeld. / GitHub refuses files over 100 MB and warns above 50 MB. Short, compressed clips can go into `media/`; put longer videos on YouTube or Google Drive and link them from the README.
- A jelenet képei a `scene.animlab.json` fájlban vannak, a `media/` csak a kiegészítő anyagoknak kell. / The scene's own pictures are inside `scene.animlab.json`; `media/` is only for extra material.
- [`index.json`](index.json): az összes példa listája (cím, szerző, osztály, rövid leírás). Ebből lesz később a programon belüli galéria, ezért új példánál ide is vegyél fel egy elemet. / A list of all examples (title, author, class, short description). It will become the gallery inside the app later, so add an entry here for every new example.

## Megnyitás / Opening a scene

- **Linkkel (legegyszerűbb) / with a link (easiest):** a mappa elérési útját tedd a `?scene=` után. Ezt a linket bármelyik üzenetben elküldheted, és telefonon is megnyílik. / Put the folder's path after `?scene=`. You can send this link in any chat, and it opens on phones too.
  `https://btomori.github.io/animlab/?scene=examples/teacher/lengo-labda`
- A fájl teljes útja is működik (`…/lengo-labda/scene.animlab.json`), és a régi, mappák előtti linkek (`…/teacher/lengo-labda.animlab.json`) is továbbra is megnyílnak. / The full file path works too, and old links from before the folders still open.
- **Fájlként / as a file:** töltsd le a `scene.animlab.json` (vagy exportált `.html`) fájlt, majd AnimLab → **Megnyitás**. / Download `scene.animlab.json` (or an exported `.html`), then AnimLab → **Open**.

## Új példa beküldése (diákoknak) / Submitting a new example (for students)

1. Készítsd el a jelenetet az AnimLab-ben (saját kóddal vagy AI segítségével), és adj neki beszédes nevet a cím mezőben.
2. **Mentés** → egy `.animlab.json` fájlt kapsz. (Az exportált `.html` is jó.)
3. A tárolóban: **Issues → New issue → Új példa beküldése**. Töltsd ki az űrlapot, és húzd rá a fájlt a „Fájl” mezőre. Ha a `.json` fájlt nem fogadja el, tömörítsd `.zip`-be. Képeket, rövid videót és forrásokat is csatolhatsz.
4. A tanár átnézi, és saját mappába teszi a `students` mappában.

1. Make the scene in AnimLab (your own code or with AI help) and give it a clear name in the title field.
2. **Save** → you get a `.animlab.json` file. (An exported `.html` works too.)
3. In the repository: **Issues → New issue → New example**. Fill in the form and drag the file onto the "File" field. If the `.json` is not accepted, zip it. You can attach pictures, a short video and sources too.
4. The teacher reviews it and puts it into its own folder inside `students`.

**Mappanév / folder name:** `evfolyam-osztaly_monogram_tema`, például / for example `11h_KB_transzformator`.

**Személyes adat / personal data:** a tároló nyilvános. Csak monogramot és osztályt írj; teljes név, elérhetőség, arc vagy felismerhető személy ne legyen se a jelenetben, se a képeken és videókon. / The repository is public. Use initials and class only; no full names, contact details, faces or recognisable people in the scene, the pictures or the videos.

## Mielőtt beküldöd / Before you submit

- [ ] Hiba nélkül fut (nincs piros hibaüzenet). / It runs without errors (no red error message).
- [ ] A csúszkák működnek, és az értékek fizikailag helyesek (egy értéket kézzel ellenőriztél). / The sliders work and the values are physically right (you checked one by hand).
- [ ] A feliratok magyarul és angolul is megvannak (`{hu: "…", en: "…"}`). / Labels exist in Hungarian and English.
- [ ] A kódban kommentek magyarázzák a számokat és a képleteket. / Comments in the code explain the numbers and formulas.
- [ ] Ha AI segített, írd bele a leírásba, melyik. / If an AI helped, say which one in the description.
- [ ] Ha forrást használtál (könyv, weboldal, adatlap), add meg. / If you used a source (book, website, datasheet), give it.

## Tanároknak: példa felvétele / For teachers: adding an example

A GitHub weboldalán / on the GitHub website:

1. A gépeden készíts egy mappát a fenti név szerint (pl. `13d_AD_elhagyott-haz`), tedd bele a jelenetet `scene.animlab.json` néven, a képeket és videókat pedig egy `media` almappába. / On your computer, make a folder named as above (e.g. `13d_AD_elhagyott-haz`), put the scene in it as `scene.animlab.json`, and the pictures and videos into a `media` subfolder.
2. A GitHubon nyisd meg a `examples/students/` (vagy `teacher/`) mappát → **Add file → Upload files**. / On GitHub, open `examples/students/` (or `teacher/`) → **Add file → Upload files**.
3. Húzd rá az egész mappát a feltöltő mezőre: a GitHub megtartja a mappaszerkezetet. / Drag the whole folder onto the upload area: GitHub keeps the folder structure.
4. **Add file → Create new file** → `13d_AD_elhagyott-haz/README.md`: másold be egy meglévő példa README-jét, és írd át (cím, megnyitó link, készítő, AI, leírás, források). / Copy the README of an existing example and edit it (title, open link, author, AI, description, sources).
5. Vedd fel a példát a fenti táblázatba, a [`students/README.md`](students/README.md) táblázatába és az [`index.json`](index.json) fájlba. / Add the example to the table above, to the table in `students/README.md` and to `index.json`.
6. A commit üzenetébe írd be az issue számát (pl. `Closes #12`), így az issue magától lezárul. / Put the issue number in the commit message (e.g. `Closes #12`) so the issue closes itself.
