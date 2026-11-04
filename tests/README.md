# Tesztek / Tests

## `run-presets.js` – minden mintajelenet betöltése / loads every example scene

Ellenőrzi, hogy mind a 21 mintajelenet hiba nélkül fut, és kiírja az első mért értékeket.
Checks that all 21 example scenes run without errors and prints their first readouts.

```bash
npm i playwright
npx playwright install chromium
node tests/run-presets.js
```

## `ths2-arrows.js` – a Toyota THS-II jelenet teljesítménynyilai / power arrows of the Toyota THS-II scene

Böngésző nélkül lefuttatja a jelenet fizikáját és rajzát 19 üzemállapotban (a teljes bemutató ciklus is), és minden képkockán minden nyílra ellenőrzi: a nyílfej arra mutat, amerre a nyíl halad; ez a fizikai teljesítményáramlás iránya; MG1 és MG2 villamos és mechanikus teljesítményének előjele egyezik; egyik nyíl sem villog oda-vissza.
Runs the scene's physics and drawing without a browser in 19 operating states (including the full demo cycle) and checks every arrow in every frame: the head points the way the arrow moves; that is the physical power direction; MG1/MG2 electric and mechanical power have the same sign; no arrow flickers back and forth.

```bash
node tests/ths2-arrows.js
```

## `gemini-2026-11-03/` – az AI-utasítások tesztje / test of the AI instructions

2026. november 3-án a Gemini 3.5 Flash-Lite ingyenes változata kapta meg az AI-utasításokat és hat tesztkérést. Minden kódját lefuttattuk az AnimLab-ben egy általunk írt referenciakód mellett, azonos csúszkaállásokkal. Az első változat (v1) hibái alapján javítottuk az utasításokat (v2), és újrateszteltük.

On 3 November 2026 the free Gemini 3.5 Flash-Lite got the AI instructions and six test prompts. Every code it returned was run in AnimLab next to a reference code, with the same slider values. The faults found with the first version (v1) led to the corrected instructions (v2), which were then re-tested.

| | v1 | v2 |
| --- | --- | --- |
| Ohm-törvény / Ohm's law | részben / partial | ✓ |
| Transzformátor / transformer | részben / partial | ✓ |
| Ferde hajítás / projectile | ✗ (mért távolság 0,02 m / measured range 0.02 m) | ✓ |
| Pattogó labda / bouncing ball (új / new) | – | ✓ |
| Üresjárás-kapcsoló / no-load switch | ✓ | – |
| Hibajavítás / error fix | ✓ | – |
| Forgórész képből / rotor photo | ✓ (átfogalmazás után / after rewording) | ✓ |

- `test-report.pdf` – a teljes jelentés (angol) / the full report (English)
- `gemini-session/`, `v2/gemini-session/` – a beszélgetések minden kéréssel, válasszal és kóddal / the transcripts with every prompt, answer and code
- `gemini-codes/`, `v2/gemini-codes/` – a Gemini kódjai bájtra pontosan / Gemini's codes, byte-identical
- `reference-codes/` – a referenciakódok / the reference codes
- `screenshots/`, `v2/screenshots/` – képernyőképek; `compare-*.png`: balra a Gemini, jobbra a referencia / screenshots; `compare-*.png`: Gemini left, reference right
- `harness/` – a futtató és ellenőrző szkriptek / the scripts that ran and checked the scenes: `node tests/gemini-2026-11-03/harness/compare.js`, `compare-v2.js`, `python3 tests/gemini-2026-11-03/harness/lint.py`
