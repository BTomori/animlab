# Gemini test session – AnimLab AI instructions v1

- Date: 2026-11-03, 21:53–22:09 (Europe/Budapest)
- Model: Gemini 3.5 Flash-Lite, signed out (gemini.google.com, free tier), one continuous chat
- Driven by Claude through the Claude desktop app's built-in browser
- Codes below are byte-identical to what Gemini returned (verified by length and checksum); the prose was copied from the page, with duplicated maths glyphs removed.
- Gemini's prose sits **before** its code block when it says something before the code, otherwise after it; here it is always listed first, then the code.

## 0. Setup

**User:**

[The full text of `00-instructions-sent-v1.md` (22,524 characters, checksum verified identical to the file), followed by:]
Értetted? Válaszolj röviden.

**Gemini:**

Igen, értettem az utasításokat, és készen állok az AnimLab jelenetkódok megírására.

## 1. T1 – Ohm's law

**User:**

Készíts egy jelenetet Ohm törvényéről: telep, izzó és ellenállás sorosan. Csúszkák: U 0–24 V, R 1–100 Ω. Az izzó fényereje kövesse a teljesítményt. Mozgó nyilak mutassák az áramot, a sebességük legyen arányos vele. Írd ki az I-t és a P-t, és rajzolj grafikont az áramról.

**Gemini:**

Ez a szimuláció egy soros áramkörön keresztül mutatja be Ohm törvényét és az elektromos teljesítmény összefüggéseit.
Próbáld növelni a feszültséget (U), vagy csökkenteni az ellenállást (R), hogy lássd, hogyan nő az áram (I) és válik fényesebbé az izzó!
Az áramot mozgó narancssárga nyilak jelzik, amelyek sebessége pontosan az áramerősséget követi.

Code (`gemini-codes/T1-ohm-gemini.js`):

```javascript
// 1) BEÁLLÍTÁSOK ÉS KEZDETI ÁLLAPOT
stage(1000, 600, "#fbfbf8");
title({hu: "Ohm törvénye: telep, izzó és ellenállás sorosan", en: "Ohm's law: battery, bulb and resistor in series"});

// Csúszkák a felhasználói beállításokhoz
param("U", {hu: "Feszültség U", en: "Voltage U"}, 0, 24, 12, 0.5, "V");
param("R", {hu: "Ellenállás R", en: "Resistance R"}, 1, 100, 20, 1, "Ω");
plotWindow(10);

const R_bulb = 15; // Ω, az izzó fix belső ellenállása

// 2) FIZIKAI SZÁMÍTÁSOK (update)
// Az állapottér változók deklarálása
let I = 0, P_bulb = 0;

update(dt => {
  // Teljes ellenállás a soros kapcsolás miatt: R_tot = R + R_bulb
  const R_tot = P.R + R_bulb;
  
  // Ohm törvénye: I = U / R
  I = R_tot > 0 ? P.U / R_tot : 0;
  
  // Izzó teljesítménye: P = I² * R_bulb
  P_bulb = I * I * R_bulb;
});

// 3) RAJZOLÁS ÉS VIZUALIZÁCIÓ (draw)
draw(t => {
  const R_tot = P.R + R_bulb;
  const I_val = R_tot > 0 ? P.U / R_tot : 0;
  const P_val = I_val * I_val * R_bulb;

  // --- ÁRAMKÖR VEZETÉKEI ÉS ALKATRÉSZEI ---
  // Felső vezeték és ellenállás
  polyline([[200, 450], [200, 150], [500, 150]], {stroke: C.ink, lw: 3});
  rect(420, 135, 160, 30, {stroke: C.ink, lw: 3, fill: "#fff"}); // Külső ellenállás
  text("R", 500, 120, {size: 18, bold: true, align: "center"});

  polyline([[580, 150], [800, 150], [800, 300]], {stroke: C.ink, lw: 3});

  // Izzó rajzolása (A fényerő / sárga szín az izzó teljesítményétől függ)
  const glowAlpha = clamp(P_val / 30, 0.1, 1.0);
  const bulbFill = P_val > 0.5 ? `rgba(255, 215, 0, ${glowAlpha})` : "#fff";
  circle(800, 350, 35, {stroke: C.ink, lw: 3, fill: bulbFill});
  // Izzószál keresztben
  line(780, 330, 820, 370, {stroke: C.ink, lw: 2});
  line(780, 370, 820, 330, {stroke: C.ink, lw: 2});
  text({hu: "Izzó", en: "Bulb"}, 800, 405, {size: 16, align: "center"});

  // Alsó vezeték visszavezetése
  polyline([[800, 400], [800, 450], [200, 450]], {stroke: C.ink, lw: 3});

  // Telep (áramforrás) a bal oldalon
  line(170, 300, 230, 300, {stroke: C.ink, lw: 3});
  line(185, 320, 215, 320, {stroke: C.ink, lw: 7});
  text("U", 150, 318, {size: 20, bold: true});

  // --- MOZGÓ NYILAK (ÁRAM IRÁNYA ÉS SEBESSÉGE) ---
  // A nyilak sebessége arányos az áramerősséggel (I)
  flow([[200, 450], [200, 150], [800, 150], [800, 450]], {
    speed: 100 * I_val, 
    color: C.orange, 
    line: false
  });

  // --- KIÍRÁSOK ÉS GRAFIKONOK ---
  show({hu: "Áramerősség (I)", en: "Current (I)"}, I_val, "A", 2);
  show({hu: "Izzó teljesítménye (P)", en: "Bulb power (P)"}, P_val, "W", 2);
  show({hu: "Teljes ellenállás", en: "Total resistance"}, R_tot, "Ω", 1);

  // Élő grafikon az áramról és a teljesítményről
  plot("I", I_val, {unit: "A", color: C.blue, min: 0});
  plot("P", P_val, {unit: "W", color: C.orange, min: 0});

  val({I: I_val, P: P_val});
});
```

## 2. T2 – Transformer

**User:**

Egyfázisú transzformátor: csúszkák U1 0–400 V, N1 és N2 10–1000, terhelő ellenállás 1–500 Ω. Rajzold meg a vasmagot, a két tekercset és az áramokat mozgó nyilakkal. Írd ki U2, I1, I2 értékét, és ábrázold u1-et és u2-t két perióduson át. 50 Hz, lassítva úgy, hogy egy periódus 10 s legyen. 11. évfolyamnak, ideális transzformátor.

**Gemini:**

Jelenet áttekintése:
Amit mutat: Egy ideális egyfázisú transzformátor működését szemlélteti vasmagon lévő két tekercsel, változtatható menetszámmal (N1, N2), bemeneti feszültséggel (U1) és terhelő ellenállással (R).
Főbb csúszkák kipróbáláshoz:
Állítsd át a menetszámokat (N1 és N2), hogy lásd a feszültség átalakulását (lépcsőzetes növelés vagy csökkentés).
Változtasd a terhelő ellenállást (R), hogy megfigyeld az Ohm-törvény szerinti szekunder áram változását (I2).
Grafikon: Az alsó plot ablakban valós időben követhető a primer feszültség (u1, kék) és a szekunder feszültség (u2, piros) szinuszos lefolyása, figyelembe véve az áttétel arányát.

Code (`gemini-codes/T2-transformer-gemini.js`):

```javascript
// 1) BEÁLLÍTÁSOK ÉS KEZDETI ÁLLAPOT
stage(1000, 600, "#fbfbf8");
title({hu: "Egyfázisú ideális transzformátor", en: "Single-phase ideal transformer"});

// Csúszkák a fizikai paraméterekhez
param("U1", {hu: "Primer feszültség U₁", en: "Primary voltage U₁"}, 0, 400, 230, 5, "V");
param("N1", {hu: "Primer menetszám N₁", en: "Primary turns N₁"}, 10, 1000, 200, 10, "");
param("N2", {hu: "Szekunder menetszám N₂", en: "Secondary turns N₂"}, 10, 1000, 100, 10, "");
param("R", {hu: "Terhelő ellenállás R", en: "Load resistance R"}, 1, 500, 50, 1, "Ω");

// Lassú szimuláció: 50 Hz-es váltakozó áram, de timeScale segítségével 
// egy periódus (20 ms) 10 másodpercig tart a szemléltetéshez (időlépték = 0.002).
timeScale(0.002);
plotWindow(0.4); // 400 ms ablak a grafikonhoz

// Fázisszög (ωt) állapotváltozó integrálása
let wt = 0;
update(dt => {
  const f = 50; // 50 Hz hálózati frekvencia
  wt += 2 * PI * f * dt;
});

// 3) RAJZOLÁS ÉS VIZUALIZÁCIÓ (draw)
draw(t => {
  const f = 50;
  const U1_eff = P.U1;
  const omega = 2 * PI * f;
  
  // Pillanatnyi primer feszültség: u₁(t) = U₁₀ * sin(ωt)
  const U1_peak = U1_eff * sqrt(2);
  const u1 = U1_peak * sin(wt);

  // Ideális transzformátor áttétele: U₂ / U₁ = N₂ / N₁
  const ratio = P.N2 / P.N1;
  const u2 = u1 * ratio;
  const U2_eff = U1_eff * ratio;

  // Szekunder áram Ohm törvénye alapján (ha R > 0)
  const I2_eff = P.R > 0 ? U2_eff / P.R : 0;
  const I1_eff = I2_eff * ratio; // Az energiamegmaradás alapján I₁ / I₂ = N₂ / N₁

  // --- VASMAG ÉS TEKERCSEK RAJZOLÁSA ---
  const cx = 500, cy = 270;
  
  // Vasmag (középen nyolcas alakú vaslemez vasmag vázlat)
  rect(cx - 130, cy - 110, 260, 220, {stroke: C.ink, lw: 4, fill: "#e8e8e4", radius: 10});
  // Vasmag ablaka (kivágás a közepén)
  rect(cx - 70, cy - 70, 140, 140, {fill: "#fbfbf8", stroke: null});

  // Primer tekercs (bal oldali szár)
  box(cx - 100, cy, 50, 120, 0, {fill: C.copper, stroke: C.ink, lw: 2, radius: 4});
  text("N₁", cx - 100, cy - 75, {size: 16, bold: true, align: "center"});
  text({hu: "Primer", en: "Primary"}, cx - 100, cy + 75, {size: 14, align: "center"});

  // Szekunder tekercs (jobb oldali szár)
  box(cx + 100, cy, 50, 120, 0, {fill: C.copper, stroke: C.ink, lw: 2, radius: 4});
  text("N₂", cx + 100, cy - 75, {size: 16, bold: true, align: "center"});
  text({hu: "Szekunder", en: "Secondary"}, cx + 100, cy + 75, {size: 14, align: "center"});

  // --- VEZETÉKEK ÉS TERHELÉS ---
  // Primer betáplálás (balra)
  polyline([[cx - 220, cy - 30], [cx - 100, cy - 30]], {stroke: C.ink, lw: 3});
  polyline([[cx - 220, cy + 30], [cx - 100, cy + 30]], {stroke: C.ink, lw: 3});
  text("u₁", cx - 235, cy, {size: 18, bold: true});

  // Szekunder kör és terhelő ellenállás (jobbra lent)
  polyline([[cx + 100, cy - 30], [cx + 250, cy - 30], [cx + 250, cy + 50]], {stroke: C.ink, lw: 3});
  // Ellenállás jelképes cikk-cakk vagy doboz
  rect(cx + 230, cy + 50, 40, 80, {fill: "#fff", stroke: C.ink, lw: 2});
  text("R", cx + 250, cy + 90, {size: 16, bold: true, align: "center"});
  polyline([[cx + 250, cy + 130], [cx + 250, cy + 180], [cx + 100, cy + 180], [cx + 100, cy + 30]], {stroke: C.ink, lw: 3});

  // --- MOZGÓ ÁRAMIRÁNY NYILAK ---
  // A primer és szekunder oldali áramok mozgása a fázis függvényében
  flow([[cx - 220, cy - 30], [cx - 100, cy - 30]], {
    speed: 80 * sin(wt), 
    color: C.orange, 
    line: false
  });
  
  flow([[cx + 100, cy - 30], [cx + 250, cy - 30]], {
    speed: 80 * sin(wt), 
    color: C.teal, 
    line: false
  });

  // --- ADATOK KIÍRÁSA ÉS MÉRÉSI EREDMÉNYEK ---
  show({hu: "Szekunder feszültség (U₂)", en: "Secondary voltage (U₂)"}, U2_eff, "V", 1);
  show({hu: "Primer áram (I₁)", en: "Primary current (I₁)"}, I1_eff, "A", 2);
  show({hu: "Szekunder áram (I₂)", en: "Secondary current (I₂)"}, I2_eff, "A", 2);
  show({hu: "Feszültségáttétel (U₂/U₁)", en: "Voltage ratio (U₂/U₁)"}, ratio, "", 2);

  // --- GRAFIKONOK (u₁ és u₂ feszültségek időbeni lefolyása) ---
  plot("u1", u1, {unit: "V", color: C.blue});
  plot("u2", u2, {unit: "V", color: C.red});

  val({u1, u2, U2_eff, I1_eff, I2_eff});
});
```

## 3. T3 – Projectile

**User:**

Ferde hajítás légellenállás nélkül. Csúszkák: kezdősebesség 1–20 m/s, szög 0–90°. Indításkor induljon újra a labda, hagyjon nyomvonalat, és a sebességvektor látsszon. Írd ki a legnagyobb magasságot és a hajítás távolságát mérve és elméletből is.

**Gemini:**

A jelenet áttekintése:
Amit mutat: Egy pontszerű test ferde hajítását mutatja be homogén gravitációs mezőben, légellenállás nélkül. A labda mozgását kék nyomvonal és sebességvektor kíséri.
Kipróbálásra ajánlott beállítások:
Állítsd a szöget pontosan 45°-ra, hogy látsd a maximális hatótávolságot.
Változtasd a kezdősebességet (v0), és figyeld meg, hogyan növekszik a mért és az elméleti magasság, illetve távolság.
Működés: A csúszkák (sebesség vagy szög) bármilyen módosítása vagy az Újraindítás gomb megnyomása azonnal újrakezdi a hajítást tiszta lappal.

Code (`gemini-codes/T3-projectile-gemini.js`):

```javascript
// 1) BEÁLLÍTÁSOK ÉS KEZDETI ÁLLAPOT
stage(1000, 600, "#fbfbf8");
title({hu: "Ferde hajítás légellenállás nélkül", en: "Projectile motion without air resistance"});

// Csúszkák a kezdősebességhez és a hajítási szöghöz
param("v0", {hu: "Kezdősebesség v₀", en: "Initial velocity v₀"}, 1, 20, 14, 0.5, "m/s");
param("angle", {hu: "Hajítási szög α", en: "Launch angle α"}, 0, 90, 45, 1, "°");
button({hu: "Újraindítás", en: "Restart"}, reset);
// Ha a csúszkák értéke változik, a szimuláció automatikusan újrakezdődik
resetOn("v0", "angle");

// Fizikai világ beállítása: 1 m = 25 képpont, origó a bal alsó sarokban (x=80, y=520)
world({gravity: 9.81, scale: 25, origin: [80, 520], ground: true, restitution: 0});

// Kezdősebesség komponensek kiszámítása radiánban megadott szögből
const alphaRad = deg(P.angle);
const v0x = P.v0 * cos(alphaRad);
const v0y = P.v0 * sin(alphaRad);

// Labda létrehozása (trail: nyomvonal, showV: sebességvektor rajzolása)
const labda = ball({
  x: 0, y: 0,
  vx: v0x, vy: v0y,
  r: 0.4, m: 1, 
  color: C.blue, 
  trail: true, 
  showV: true
});

// Állapotváltozók a mért értékek követésére
let maxHMeasured = 0;
let rangeMeasured = 0;
let landed = false;

// 2) FIZIKAI SZÁMÍTÁSOK (update)
update(dt => {
  // Magasság és távolság mérése amíg a labda a levegőben van (y >= 0)
  if (labda.y >= 0) {
    if (labda.y > maxHMeasured) {
      maxHMeasured = labda.y;
    }
    if (!landed) {
      rangeMeasured = labda.x;
    }
  }
  
  // Becsapódás érzékelése
  if (labda.onGround || labda.y < 0) {
    landed = true;
  }
});

// 3) RAJZOLÁS ÉS VIZUALIZÁCIÓ (draw)
draw(t => {
  // A fizikai világ elemeinek (föld, nyomvonal, labda, sebességvektor) kirajzolása
  drawWorld();

  const g = 9.81;
  const v0 = P.v0;
  const alpha = deg(P.angle);

  // Elméleti képletek ferde hajításra (légellenállás nélkül):
  // H_max = (v0 * sin(α))² / (2 * g)
  const H_theo = pow(v0 * sin(alpha), 2) / (2 * g);
  
  // R_max = (v0² * sin(2α)) / g
  const R_theo = (v0 * v0 * sin(2 * alpha)) / g;

  // Readoutok (adatok kiírása a vezérlőpanelre)
  show({hu: "Mért legnagyobb magasság", en: "Measured max height"}, maxHMeasured, "m", 2);
  show({hu: "Elméleti legnagyobb magasság", en: "Theoretical max height"}, H_theo, "m", 2);
  show({hu: "Mért hajítás távolsága", en: "Measured range"}, rangeMeasured, "m", 2);
  show({hu: "Elméleti hajítás távolsága", en: "Theoretical range"}, R_theo, "m", 2);

  val({ maxHMeasured, H_theo, rangeMeasured, R_theo });
});
```

## 4. T4 – Modification

**User:**

A 2. teszt transzformátorához adj egy kapcsolót „Üresjárás” néven. Bekapcsolva szakadjon meg a terhelés, és I2 legyen nulla.

**Gemini:**

Újdonság: Mostantól elérhető egy „Üresjárás” nevű kapcsoló a vezérlőpulton.
Működés: Bekapcsolt állapotában a szekunder kör megszakad, így a szekunder áram (I2) értéke pontosan 0-vá válik, szemléltetve az ideális üresjárási állapotot.

Code (`gemini-codes/T4-transformer-noload-gemini.js`):

```javascript
// 1) BEÁLLÍTÁSOK ÉS KEZDETI ÁLLAPOT
stage(1000, 600, "#fbfbf8");
title({hu: "Egyfázisú ideális transzformátor üresjárással", en: "Single-phase ideal transformer with no-load test"});

// Csúszkák és kapcsolók a fizikai paraméterekhez
param("U1", {hu: "Primer feszültség U₁", en: "Primary voltage U₁"}, 0, 400, 230, 5, "V");
param("N1", {hu: "Primer menetszám N₁", en: "Primary turns N₁"}, 10, 1000, 200, 10, "");
param("N2", {hu: "Szekunder menetszám N₂", en: "Secondary turns N₂"}, 10, 1000, 100, 10, "");
param("R", {hu: "Terhelő ellenállás R", en: "Load resistance R"}, 1, 500, 50, 1, "Ω");
toggle("noLoad", {hu: "Üresjárás", en: "No-load"}, false);

timeScale(0.002);
plotWindow(0.4);

let wt = 0;
update(dt => {
  const f = 50;
  wt += 2 * PI * f * dt;
});

// 3) RAJZOLÁS ÉS VIZUALIZÁCIÓ (draw)
draw(t => {
  const f = 50;
  const U1_eff = P.U1;
  const omega = 2 * PI * f;
  
  const U1_peak = U1_eff * sqrt(2);
  const u1 = U1_peak * sin(wt);

  const ratio = P.N2 / P.N1;
  const u2 = u1 * ratio;
  const U2_eff = U1_eff * ratio;

  // Ha az üresjárás be van kapcsolva, a szekunder áram nulla (szakadás)
  const I2_eff = P.noLoad ? 0 : (P.R > 0 ? U2_eff / P.R : 0);
  const I1_eff = I2_eff * ratio; 

  const cx = 500, cy = 270;
  
  // Vasmag
  rect(cx - 130, cy - 110, 260, 220, {stroke: C.ink, lw: 4, fill: "#e8e8e4", radius: 10});
  rect(cx - 70, cy - 70, 140, 140, {fill: "#fbfbf8", stroke: null});

  // Tekercsek
  box(cx - 100, cy, 50, 120, 0, {fill: C.copper, stroke: C.ink, lw: 2, radius: 4});
  text("N₁", cx - 100, cy - 75, {size: 16, bold: true, align: "center"});
  text({hu: "Primer", en: "Primary"}, cx - 100, cy + 75, {size: 14, align: "center"});

  box(cx + 100, cy, 50, 120, 0, {fill: C.copper, stroke: C.ink, lw: 2, radius: 4});
  text("N₂", cx + 100, cy - 75, {size: 16, bold: true, align: "center"});
  text({hu: "Szekunder", en: "Secondary"}, cx + 100, cy + 75, {size: 14, align: "center"});

  // Vezetékek
  polyline([[cx - 220, cy - 30], [cx - 100, cy - 30]], {stroke: C.ink, lw: 3});
  polyline([[cx - 220, cy + 30], [cx - 100, cy + 30]], {stroke: C.ink, lw: 3});
  text("u₁", cx - 235, cy, {size: 18, bold: true});

  // Szekunder kör és az üresjárcsi kapcsoló vizualizációja
  polyline([[cx + 100, cy - 30], [cx + 170, cy - 30]], {stroke: C.ink, lw: 3});
  
  if (P.noLoad) {
    // Nyitott kapcsoló jelzése
    line(170 + cx, cy - 30, 200 + cx, cy - 50, {stroke: C.red, lw: 3});
    text({hu: "Üresjárás (Nyitva)", en: "No-load (Open)"}, cx + 225, cy - 55, {size: 12, color: C.red});
  } else {
    // Zárt kapcsolat
    line(170 + cx, cy - 30, 200 + cx, cy - 30, {stroke: C.ink, lw: 3});
  }

  polyline([[cx + 200, cy - 30], [cx + 250, cy - 30], [cx + 250, cy + 50]], {stroke: C.ink, lw: 3});
  rect(cx + 230, cy + 50, 40, 80, {fill: "#fff", stroke: C.ink, lw: 2});
  text("R", cx + 250, cy + 90, {size: 16, bold: true, align: "center"});
  polyline([[cx + 250, cy + 130], [cx + 250, cy + 180], [cx + 100, cy + 180], [cx + 100, cy + 30]], {stroke: C.ink, lw: 3});

  // Mozgó áramirány nyilak (üresjárásban a szekunder oldalon nincsenek áramlatok)
  flow([[cx - 220, cy - 30], [cx - 100, cy - 30]], {
    speed: 80 * sin(wt) * (P.noLoad ? 0.05 : 1), 
    color: C.orange, 
    line: false
  });
  
  if (!P.noLoad) {
    flow([[cx + 100, cy - 30], [cx + 250, cy - 30]], {
      speed: 80 * sin(wt), 
      color: C.teal, 
      line: false
    });
  }

  // Kiírások
  show({hu: "Szekunder feszültség (U₂)", en: "Secondary voltage (U₂)"}, U2_eff, "V", 1);
  show({hu: "Primer áram (I₁)", en: "Primary current (I₁)"}, I1_eff, "A", 2);
  show({hu: "Szekunder áram (I₂)", en: "Secondary current (I₂)"}, I2_eff, "A", 2);

  // Grafikonok
  plot("u1", u1, {unit: "V", color: C.blue});
  plot("u2", u2, {unit: "V", color: C.red});

  val({u1, u2, U2_eff, I1_eff, I2_eff});
});
```

## 5. T5a – Error message only

**User:**

Ezt a hibát kaptam: Hiba a szkriptben (sor 55): missing ) after argument list

**Gemini:**

Ez a hibaüzenet azt jelenti, hogy a JavaScript-kódban (valószínűleg az 55. sor környékén) lemaradt egy zárójel ) egy függvényhívás, számítás vagy feltétel végéről.
Kérlek, másold be ide a kódodat (vagy az 55. sor körüli részletet), és szívesen átnézem és kijavítom neked!

## 6. T5b – (send glitch: only the first line arrived)

**User:**

Itt a kódom:

**Gemini:**

Úgy látom, a kód maga lemaradt! 😊
Kérlek, illeszd be ide a kódodat (vagy az érintett részletet), és örömmel átnézem, hogy megkeressük és kijavítsuk a hiányzó zárójelet!

## 7. T5c – Broken code sent

**User:**

Itt a kódom, amiben a hiba van:

[the full text of `gemini-codes/T5-broken-input.js`: the T4 code with the closing `)` removed on line 55]

**Gemini:**

Megtaláltam a hibát! Az 55. sorban a polyline sor végén egy nyitó zárójel maradt a zárójel helyett:
```javascript
polyline([[cx - 220, cy + 30], [cx - 100, cy + 30]], {stroke: C.ink, lw: 3};
```
Itt a végén ) kell legyen a zárójel helyett:
```javascript
polyline([[cx - 220, cy + 30], [cx - 100, cy + 30]], {stroke: C.ink, lw: 3});
```
Íme a teljes, javított kód, amit már másolhatsz is:

Code (`gemini-codes/T5-fixed-gemini.js`):

```javascript
// 1) BEÁLLÍTÁSOK ÉS KEZDETI ÁLLAPOT
stage(1000, 600, "#fbfbf8");
title({hu: "Egyfázisú ideális transzformátor üresjárással", en: "Single-phase ideal transformer with no-load test"});

// Csúszkák és kapcsolók a fizikai paraméterekhez
param("U1", {hu: "Primer feszültség U₁", en: "Primary voltage U₁"}, 0, 400, 230, 5, "V");
param("N1", {hu: "Primer menetszám N₁", en: "Primary turns N₁"}, 10, 1000, 200, 10, "");
param("N2", {hu: "Szekunder menetszám N₂", en: "Secondary turns N₂"}, 10, 1000, 100, 10, "");
param("R", {hu: "Terhelő ellenállás R", en: "Load resistance R"}, 1, 500, 50, 1, "Ω");
toggle("noLoad", {hu: "Üresjárás", en: "No-load"}, false);

timeScale(0.002);
plotWindow(0.4);

let wt = 0;
update(dt => {
  const f = 50;
  wt += 2 * PI * f * dt;
});

// 3) RAJZOLÁS ÉS VIZUALIZÁCIÓ (draw)
draw(t => {
  const f = 50;
  const U1_eff = P.U1;
  const omega = 2 * PI * f;
  
  const U1_peak = U1_eff * sqrt(2);
  const u1 = U1_peak * sin(wt);

  const ratio = P.N2 / P.N1;
  const u2 = u1 * ratio;
  const U2_eff = U1_eff * ratio;

  // Ha az üresjárás be van kapcsolva, a szekunder áram nulla (szakadás)
  const I2_eff = P.noLoad ? 0 : (P.R > 0 ? U2_eff / P.R : 0);
  const I1_eff = I2_eff * ratio; 

  const cx = 500, cy = 270;
  
  // Vasmag
  rect(cx - 130, cy - 110, 260, 220, {stroke: C.ink, lw: 4, fill: "#e8e8e4", radius: 10});
  rect(cx - 70, cy - 70, 140, 140, {fill: "#fbfbf8", stroke: null});

  // Tekercsek
  box(cx - 100, cy, 50, 120, 0, {fill: C.copper, stroke: C.ink, lw: 2, radius: 4});
  text("N₁", cx - 100, cy - 75, {size: 16, bold: true, align: "center"});
  text({hu: "Primer", en: "Primary"}, cx - 100, cy + 75, {size: 14, align: "center"});

  box(cx + 100, cy, 50, 120, 0, {fill: C.copper, stroke: C.ink, lw: 2, radius: 4});
  text("N₂", cx + 100, cy - 75, {size: 16, bold: true, align: "center"});
  text({hu: "Szekunder", en: "Secondary"}, cx + 100, cy + 75, {size: 14, align: "center"});

  // Vezetékek
  polyline([[cx - 220, cy - 30], [cx - 100, cy - 30]], {stroke: C.ink, lw: 3});
  polyline([[cx - 220, cy + 30], [cx - 100, cy + 30]], {stroke: C.ink, lw: 3});
  text("u₁", cx - 235, cy, {size: 18, bold: true});

  // Szekunder kör és az üresjárási kapcsoló vizualizációja
  polyline([[cx + 100, cy - 30], [cx + 170, cy - 30]], {stroke: C.ink, lw: 3});
  
  if (P.noLoad) {
    // Nyitott kapcsoló jelzése
    line(170 + cx, cy - 30, 200 + cx, cy - 50, {stroke: C.red, lw: 3});
    text({hu: "Üresjárás (Nyitva)", en: "No-load (Open)"}, cx + 225, cy - 55, {size: 12, color: C.red});
  } else {
    // Zárt kapcsolat
    line(170 + cx, cy - 30, 200 + cx, cy - 30, {stroke: C.ink, lw: 3});
  }

  polyline([[cx + 200, cy - 30], [cx + 250, cy - 30], [cx + 250, cy + 50]], {stroke: C.ink, lw: 3});
  rect(cx + 230, cy + 50, 40, 80, {fill: "#fff", stroke: C.ink, lw: 2});
  text("R", cx + 250, cy + 90, {size: 16, bold: true, align: "center"});
  polyline([[cx + 250, cy + 130], [cx + 250, cy + 180], [cx + 100, cy + 180], [cx + 100, cy + 30]], {stroke: C.ink, lw: 3});

  // Mozgó áramirány nyilak (üresjárásban a szekunder oldalon nincsenek áramlatok)
  flow([[cx - 220, cy - 30], [cx - 100, cy - 30]], {
    speed: 80 * sin(wt) * (P.noLoad ? 0.05 : 1), 
    color: C.orange, 
    line: false
  });
  
  if (!P.noLoad) {
    flow([[cx + 100, cy - 30], [cx + 250, cy - 30]], {
      speed: 80 * sin(wt), 
      color: C.teal, 
      line: false
    });
  }

  // Kiírások
  show({hu: "Szekunder feszültség (U₂)", en: "Secondary voltage (U₂)"}, U2_eff, "V", 1);
  show({hu: "Primer áram (I₁)", en: "Primary current (I₁)"}, I1_eff, "A", 2);
  show({hu: "Szekunder áram (I₂)", en: "Secondary current (I₂)"}, I2_eff, "A", 2);

  // Grafikonok
  plot("u1", u1, {unit: "V", color: C.blue});
  plot("u2", u2, {unit: "V", color: C.red});

  val({u1, u2, U2_eff, I1_eff, I2_eff});
});
```

## 8. T6a – Rotor photo (first wording)

**User:**

Egyenáramú motor, a forgórész egy feltöltött kép legyen, ami a tengelye körül forog. A fordulatszám csúszkával állítható legyen 0–120 1/min között.

**Gemini:**

Be vagy jelentkezve? Képeket tudok keresni, de úgy tűnik, most nem tudok neked létrehozni. Az is lehetséges, hogy a képalkotás még nem elérhető a te régiódban.

## 9. T6b – Rotor photo (reworded)

**User:**

Nem képet kérek, hanem AnimLab-jelenetet (kódot): egyenáramú motor, amelynek a forgórésze egy általam feltöltött kép, és a tengelye körül forog. A fordulatszám csúszkával állítható legyen 0–120 1/min között.

**Gemini:**

Mit mutat: Egy egyenáramú motor vázlatos állórészét (stator N és S pólusokkal) és egy középen forgó rotort, amely a saját feltöltött képedet jeleníti meg.
Használat: Tölts fel egy képet az AnimLab Images fülén pontosan rotor néven. A csúszkával 0 és 120 1/min között szabályozhatod a motor fordulatszámát.
Want me to add torque and current load indicators to this DC motor model?

Code (`gemini-codes/T6-dcmotor-photo-gemini.js`):

```javascript
// 1) BEÁLLÍTÁSOK ÉS KEZDETI ÁLLAPOT
stage(1000, 600, "#fbfbf8");
title({hu: "Egyenáramú motor forgórész (feltöltött képpel)", en: "DC motor rotor with uploaded image"});

// Fordulatszám csúszka 0 - 120 1/min (fordulat per perc)
param("n", {hu: "Fordulatszám n", en: "Speed n"}, 0, 120, 60, 1, "1/min");

// Forgásszög állapotváltozó (radiánban)
let angle = 0;

update(dt => {
  // A fordulatszám átszámítása rad/s-ra: n [1/min] * (2 * PI / 60)
  const omega = (P.n * 2 * PI) / 60;
  angle += omega * dt;
});

// 3) RAJZOLÁS ÉS VIZUALIZÁCIÓ (draw)
draw(t => {
  const cx = 500, cy = 300;

  // Stator (motorháza külső gyűrűje)
  circle(cx, cy, 180, {stroke: C.ink, lw: 6, fill: "#e8e8e4"});
  
  // Állandó mágnesek a sztatórban (északi és déli pólus)
  arc(cx, cy, 180, -PI/4, PI/4, {stroke: C.N, lw: 12});
  text("N", cx + 140, cy, {size: 20, bold: true, color: C.N, align: "center"});
  
  arc(cx, cy, 180, 3*PI/4, 5*PI/4, {stroke: C.S, lw: 12});
  text("S", cx - 140, cy, {size: 20, bold: true, color: C.S, align: "center"});

  // Forgórész kép rajzolása 
  // Fontos: tölts fel egy képet az AnimLab Images fülére "rotor" néven!
  image("rotor", cx, cy, {w: 200, h: 200, angle: angle});

  // Forgástengely a közepén
  circle(cx, cy, 15, {fill: C.ink, stroke: null});

  // Értékek kiírása
  show({hu: "Fordulatszám n", en: "Speed n"}, P.n, "1/min");
  show({hu: "Szögsebesség ω", en: "Angular velocity ω"}, (P.n * 2 * PI) / 60, "rad/s", 2);

  val({n: P.n, angle});
});
```
