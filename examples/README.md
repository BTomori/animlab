# Példák / Examples

Ebben a mappában AnimLab-jelenetek vannak: a `teacher` mappában tanári minták, a `students` mappában a diákok által készített jelenetek.
This folder holds AnimLab scenes: teacher examples in `teacher`, scenes made by students in `students`.

| Mappa / Folder | Tartalom / Contents |
| --- | --- |
| [`teacher/`](teacher/) | Tanári minták / teacher examples |
| [`students/`](students/) | Diákok jelenetei / students' scenes |

## Megnyitás / Opening a scene

- **Linkkel (legegyszerűbb) / with a link (easiest):** a fájl elérési útját tedd a `?scene=` után. Ezt a linket bármelyik üzenetben elküldheted, és telefonon is megnyílik. / Put the file's path after `?scene=`. You can send this link in any chat, and it opens on phones too.
  `https://btomori.github.io/animlab/?scene=examples/teacher/lengo-labda.animlab.json`
- **Fájlként / as a file:** töltsd le a `.animlab.json` (vagy exportált `.html`) fájlt, majd AnimLab → **Megnyitás**. / Download the `.animlab.json` (or exported `.html`) file, then AnimLab → **Open**.

| Példa / Example | Link |
| --- | --- |
| Lengő labda / swinging ball | [megnyitás / open](https://btomori.github.io/animlab/?scene=examples/teacher/lengo-labda.animlab.json) |
| Változóhoz kötött nyíl / arrow bound to a variable | [megnyitás / open](https://btomori.github.io/animlab/?scene=examples/teacher/valtozo-nyil.animlab.json) |

## Új példa beküldése (diákoknak) / Submitting a new example (for students)

1. Készítsd el a jelenetet az AnimLab-ben (saját kóddal vagy AI segítségével), és adj neki beszédes nevet a cím mezőben.
2. **Mentés** → egy `.animlab.json` fájlt kapsz. (Az exportált `.html` is jó.)
3. A tárolóban: **Issues → New issue → Új példa beküldése**. Töltsd ki az űrlapot, és húzd rá a fájlt a „Fájl” mezőre. Ha a `.json` fájlt nem fogadja el, tömörítsd `.zip`-be.
4. A tanár átnézi, és felteszi a `students` mappába.

1. Make the scene in AnimLab (your own code or with AI help) and give it a clear name in the title field.
2. **Save** → you get a `.animlab.json` file. (An exported `.html` works too.)
3. In the repository: **Issues → New issue → New example**. Fill in the form and drag the file onto the "File" field. If the `.json` is not accepted, zip it.
4. The teacher reviews it and adds it to the `students` folder.

**Fájlnév / file name:** `evfolyam-osztaly_monogram_tema.animlab.json`, például / for example `11h_KB_transzformator.animlab.json`.

**Személyes adat / personal data:** a tároló nyilvános. Csak monogramot és osztályt írj, teljes nevet, arcképet vagy elérhetőséget ne. / The repository is public. Use initials and class only, no full names, photos of people or contact details.

## Mielőtt beküldöd / Before you submit

- [ ] Hiba nélkül fut (nincs piros hibaüzenet). / It runs without errors (no red error message).
- [ ] A csúszkák működnek, és az értékek fizikailag helyesek (egy értéket kézzel ellenőriztél). / The sliders work and the values are physically right (you checked one by hand).
- [ ] A feliratok magyarul és angolul is megvannak (`{hu: "…", en: "…"}`). / Labels exist in Hungarian and English.
- [ ] A kódban kommentek magyarázzák a számokat és a képleteket. / Comments in the code explain the numbers and formulas.
- [ ] Ha AI segített, írd bele a leírásba, melyik. / If an AI helped, say which one in the description.

## Tanároknak: példa felvétele / For teachers: adding an example

- **Beküldött issue-ból / from a submitted issue:** töltsd le a csatolt fájlt, nevezd át a fenti minta szerint, majd **Add file → Upload files** a `examples/students/` mappában. A commit üzenetébe írd be az issue számát (pl. `Closes #12`), így az issue magától lezárul. / Download the attached file, rename it as above, then **Add file → Upload files** in `examples/students/`. Put the issue number in the commit message (e.g. `Closes #12`) so the issue closes itself.
- **Közvetlenül / directly:** ugyanígy, **Add file → Upload files**. / The same way, with **Add file → Upload files**.
- Új sort a fenti táblázatba is felvehetsz a linkkel. / You can also add a row with its link to the table above.
