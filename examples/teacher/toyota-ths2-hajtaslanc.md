# Toyota THS-II (Prius II) hajtáslánc – teljesítményáramlás / power flow

Jelenet / scene: [`toyota-ths2-hajtaslanc.animlab.json`](toyota-ths2-hajtaslanc.animlab.json) ·
[megnyitás / open](https://btomori.github.io/animlab/?scene=examples/teacher/toyota-ths2-hajtaslanc.animlab.json)

[Magyar](#magyar) · [English](#english)

---

## Magyar

### Forrás

A forrás nem Toyota-dokumentum, hanem John M. Miller 2005-ös workshop-diasora: *Comparative Assessment of Hybrid Vehicle Power Split Transmissions* (a hibrid járművek teljesítményosztó hajtásainak összehasonlítása). Ennek a Toyotáról szóló része a THS-I/THS-II rendszert, vagyis a Prius hajtásláncát tárgyalja. A jelenet a THS-II (Prius II) modellje, ebből a forrásból:

- **Prius II adatok:** bolygómű 78/30 (k = 2,6), végáttétel 4,0, gördülési sugár 0,3045 m, motor 57 kW / 111 N·m, MG2 400 N·m / 50 kW, akkumulátor 201,6 V / 6 Ah / 21 kW, hatásfokok 0,82 és 0,855.
- **Egyenletek:** menetellenállás, a bolygómű fordulatszám- és nyomatékegyenletei, valamint az akkuáram képlete a 71. diáról.
- **Üzemmódok nevei:** a 35–41. diák alapján.

### Mit látunk a képernyőn?

- **Motor:** mozgó dugattyúk, a munkaütemben felvillanó égéssel.
- **Tengelyek:** láthatóan forognak a motortól a bolygóműig, onnan MG1-hez és MG2-höz, majd a differenciálművön át a kerekekig.
- **Bolygómű:** szemből ábrázolva; a napkerék, a négy bolygókerék, a bolygókar és a gyűrűs kerék helyesen kapcsolódó fogakkal forog.
- **Teljesítménynyilak:** minden tengelyen és kábelen, kW-ban feliratozva; a sebességük a teljesítmény nagyságát, az irányuk az áramlás irányát mutatja.
- **Adatkártyák minden elemhez:** a be- és kimenő fordulatszám, nyomaték és teljesítmény a motorra, MG1-re, MG2-re, a bolygóműre, az akkumulátorra és a járműre.
- **Emelőkar-ábra és teljesítménymérleg:** a 44. dia mintájára, valamint egy teljesítménymérleg, amelynek összegei kijönnek.

### Csúszkák

Gázpedál, fékpedál, járműsebesség, akkumulátor töltöttsége (SOC), útemelkedés, választókar (D/N/R), és hogy a rajzon mennyire lassítjuk a forgást. Vezetés közben a sebesség és a SOC csúszkája a pillanatnyi értéket mutatja; ha valamelyiket elhúzzuk, az autó átveszi az új értéket. A „rögzített sebesség” beállítás a sebességet a csúszkán tartja, mint egy görgős fékpadon.

### Alapnézet

Egy 87 másodperces automatikus bemutató, amely végigmegy minden üzemállapoton:

1. álló helyzet (READY)
2. tisztán elektromos hajtás
3. motorindítás
4. normál teljesítményosztás
5. teljesítménynövelés (boost)
6. negatív teljesítményosztás
7. üzemanyag-elzárás visszatápláló fékezéssel
8. csak súrlódó fékezés
9. akkutöltés álló helyzetben
10. teljesítményosztás akkutöltéssel
11. hátramenet

A vezérlőkön kézi vezetésre lehet váltani.

### Ellenőrzés a forrással

48 km/h-nál (30 mph) elektromos hajtásban a modell kb. 175 N menetellenállást és 2,86 kW-ot ad a gyűrűs keréken. A forrás 50. diáján 172 N és 2,81 kW szerepel; ott kicsit eltérnek a járműadatok (Prius I).

### Feltételezett értékek

Ezek nem szerepelnek a forrásban; a kód megjegyzéseiben „(assumed)” jelzés áll mellettük:

- a motor tehetetlenségi nyomatéka
- az akkumulátor belső ellenállása
- a segédüzemi terhelés
- MG1 legnagyobb nyomatéka
- a kúszó- és a gurulási erő
- a motor legjobb hatásfokú munkavonala, amelyet a 42. dia jelleggörbéjéről szemmel olvastunk le

A jelenet 643 soros, minden felirata kétnyelvű, a kód megjegyzésekkel ellátott.

---

## English

### Source

The source is not a Toyota document. It is John M. Miller's 2005 workshop slides, *Comparative Assessment of Hybrid Vehicle Power Split Transmissions*, and its Toyota section covers THS-I/THS-II, the Prius drive system. The scene models the THS-II (Prius II) from it:

- **Prius II figures:** gear set 78/30 (k = 2.6), final drive 4.0, tyre radius 0.3045 m, engine 57 kW / 111 N·m, MG2 400 N·m / 50 kW, battery 201.6 V / 6 Ah / 21 kW, efficiencies 0.82 and 0.855.
- **Equations:** road load, the planetary speed and torque equations, and the battery current formula from slide 71.
- **Mode names:** taken from slides 35–41.

### What you see on screen

- **Engine:** moving pistons, with flashes on the firing stroke.
- **Shafts:** visibly turning from the engine into the gear set, out to MG1 and MG2, and down through the differential to the wheels.
- **Planetary gear set:** shown face-on, with the sun, the four planets, the planet carrier and the ring all rotating with correctly meshing teeth.
- **Power arrows:** on every shaft and cable, labelled in kW; their speed shows how much power flows and their direction shows which way.
- **Cards for each component:** speed, torque and power going in and out, for the engine, MG1, MG2, the gear set, battery and vehicle.
- **Lever diagram and power-balance bars:** as on slide 44, plus a power balance whose figures add up.

### Sliders

Accelerator, brake, vehicle speed, battery charge level, road grade, gear selector (D/N/R), and how much the drawn rotation is slowed down. The speed and charge sliders follow the live values while you drive; if you drag one, the car takes over the new value. There is also a "held speed" option that pins the speed to the slider like a roller dyno.

### Default view

An 87-second automatic demo that cycles through every state:

1. standstill (READY)
2. pure electric drive
3. engine start
4. normal power split
5. power boost
6. negative split
7. fuel cut with regenerative braking
8. friction-only braking
9. battery charging at standstill
10. power split with charging
11. reverse

You can switch to manual driving from the controls.

### Check against the source

At 30 mph (48 km/h) in electric drive the model gives about 175 N of road load and 2.86 kW at the ring gear. Slide 50 of the source gives 172 N and 2.81 kW; its car data differ slightly (Prius I).

### Assumed values

These are not in the source and are marked "(assumed)" in the code comments:

- engine inertia
- the battery's internal resistance
- the auxiliary load
- MG1's maximum torque
- creep and coasting forces
- the engine's best-efficiency operating line, read off the map on slide 42 by eye

The scene has 643 lines, all text is bilingual and the code is commented.
