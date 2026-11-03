# Gemini re-test session – AnimLab AI instructions v2

- Date: 2026-11-03, evening (Europe/Budapest), a new chat after the v1 session
- Model: Gemini 3.5 Flash-Lite, signed out, free tier
- Codes are byte-identical to Gemini's answers (length and checksum checked)

## 0. Setup

**User:**

[The full text of `00-instructions-sent-v2.md` (30,153 characters, checksum verified), followed by:]
Értetted? Válaszolj röviden.

**Gemini:**

Igen, értettem. Készen állok az AnimLab-szkriptek megírására a megadott szempontok és szabályok alapján. Írd le, milyen animációt vagy szimulációt szeretnél!

## 1. T1

**User:**

Készíts egy jelenetet Ohm törvényéről: telep, izzó és ellenállás sorosan. Csúszkák: U 0–24 V, R 1–100 Ω. Az izzó fényereje kövesse a teljesítményt. Mozgó nyilak mutassák az áramot, a sebességük legyen arányos vele. Írd ki az I-t és a P-t, és rajzolj grafikont az áramról.

**Gemini:**

Ez a szimuláció bemutatja egy soros áramkör működését egy telepnel, egy változtatható ellenállással és egy izzóval.
Mit próbálj ki? Állítsd át a feszültséget (U) vagy az ellenállást (R): láthatod, hogy az áram erőssége (I) és az izzó fényereje közvetlenül követi a változásokat, a mozgó narancssárga nyilak sebessége pedig hűen mutatja az áram nagyságát.

Code (`gemini-codes/T1-ohm-gemini-v2.js`):

```javascript
stage(1000, 600, "#fbfbf8");
title({hu: "Ohm törvénye: áramkör izzóval és ellenállással", en: "Ohm's law: circuit with bulb and resistor"});
param("U", {hu: "Telep feszültsége U", en: "Supply voltage U"}, 0, 24, 12, 0.5, "V");
param("R", {hu: "Soros ellenállás R", en: "Series resistor R"}, 1, 100, 20, 1, "Ω");
plotWindow(10);

let posI = 0;                                   // áram nyilak eltolódása (px) / current arrows offset
const R_lamp = 15;                              // az izzó állandó hidegellenállása (Ω) / bulb resistance

update(dt => {
  const R_tot = P.R + R_lamp;
  const I = P.U / max(R_tot, 1e-3);             // Ohm törvénye: I = U / (R + R_L)
  posI += 80 * I * dt;                          // nyilak sebessége arányos az árammal / arrow speed proportional to current
});

draw(t => {
  const R_tot = P.R + R_lamp;
  const I = P.U / max(R_tot, 1e-3);
  const U_lamp = I * R_lamp;
  const P_lamp = U_lamp * I;                    // izzó teljesítménye P = U_izzó * I (W)
  
  const wireStyle = {stroke: C.ink, lw: 3};
  
  // Bekötés / Wires & Components (IEC 60617 szimbólumok)
  // Telep bal oldalon (x: 200, y: 300)
  line(200, 300, 200, 150, wireStyle);
  polyline([[200, 150], [420, 150]], wireStyle);
  
  // Ellenállás felül (téglalap)
  rect(420, 130, 160, 40, {stroke: C.ink, lw: 3, fill: "#fff"});
  polyline([[580, 150], [800, 150], [800, 240]], wireStyle);
  
  // Izzó jobb oldalon (kör X-szel) és fényerő (sárga ragyogás)
  const glowAlpha = clamp(P_lamp / 25, 0, 0.8);
  if (glowAlpha > 0.01) {
    circle(800, 300, 40 + P_lamp * 0.6, {fill: C.yellow, stroke: null, alpha: glowAlpha * 0.35});
  }
  circle(800, 300, 30, {stroke: C.ink, lw: 3, fill: "#fff"});
  line(800 - 21, 300 - 21, 800 + 21, 300 + 21, wireStyle);
  line(800 - 21, 300 + 21, 800 + 21, 300 - 21, wireStyle);

  // Visszatérő huzal alul
  polyline([[800, 360], [800, 450], [200, 450], [200, 320]], wireStyle);
  
  // Telep jelek (+ hosszú vékony, - rövid vastag)
  line(180, 300, 220, 300, {stroke: C.ink, lw: 3});
  line(190, 320, 210, 320, {stroke: C.ink, lw: 7});
  text("U", 160, 312, {size: 20, bold: true});

  text("R", 500, 120, {size: 18, bold: true, align: "center"});
  text({hu: "Izzó", en: "Bulb"}, 800, 242, {size: 16, bold: true, align: "center"});

  // Mozgó áramnyilak a huzalokon (ha van áram)
  if (I > 0.005) {
    const paths = [
      [[200, 300], [200, 150], [420, 150]],
      [[580, 150], [800, 150], [800, 240]],
      [[800, 360], [800, 450], [200, 450], [200, 320]]
    ];
    for (const path of paths) {
      flow(path, {pos: posI, dir: 1, color: C.orange, line: false, alpha: clamp(0.3 + I * 2, 0, 1)});
    }
  }

  // Értékek kijelzése / Readouts and plots
  show({hu: "Áram (I)", en: "Current (I)"}, I, "A", 2);
  show({hu: "Izzó teljesítménye (P)", en: "Bulb power (P)"}, P_lamp, "W", 2);
  show({hu: "Teljes ellenállás (R_tot)", en: "Total resistance (R_tot)"}, R_tot, "Ω", 1);

  plot({hu: "Áram I", en: "Current I"}, I, {unit: "A", color: C.orange, min: 0});
  plot({hu: "Teljesítmény P", en: "Power P"}, P_lamp, {unit: "W", color: C.yellow, min: 0});
  val({I, P_lamp, R_tot});
});
```

## 2. T2

**User:**

Egyfázisú transzformátor: csúszkák U1 0–400 V, N1 és N2 10–1000, terhelő ellenállás 1–500 Ω. Rajzold meg a vasmagot, a két tekercset és az áramokat mozgó nyilakkal. Írd ki U2, I1, I2 értékét, és ábrázold u1-et és u2-t két perióduson át. 50 Hz, lassítva úgy, hogy egy periódus 10 s legyen. 11. évfolyamnak, ideális transzformátor.

**Gemini:**

Ez a szimuláció egy ideális egyfázisú transzformátort mutat be zárt vasmagon, két tekercs kölcsönös induktív kapcsolatával.
Próbáld ki: Változtasd a menetszámokat (N1, N2) az áttétel (U2 = U1·N2/N1) szemléltetéséhez, vagy állítsd át a terhelő ellenállást (R), hogy lásd a szekunder és primer áramok változását! A lassított időskála révén jól megfigyelhető a váltakozó feszültségek lefutása és fázisa.

Code (`gemini-codes/T2-transformer-gemini-v2.js`):

```javascript
stage(1000, 600, "#fbfbf8");
title({hu: "Ideális egyfázisú transzformátor működése", en: "Operation of an ideal single-phase transformer"});
timeScale(0.002); // 50 Hz: egy 20 ms-os periódus 10 másodperc alatt fut le a szemléltetéshez
param("U1", {hu: "Primer feszültség U₁ (eff)", en: "Primary voltage U₁ (RMS)"}, 0, 400, 230, 5, "V");
param("N1", {hu: "Primer menetszám N₁", en: "Primary turns N₁"}, 10, 1000, 200, 10, "");
param("N2", {hu: "Szekunder menetszám N₂", en: "Secondary turns N₂"}, 10, 1000, 100, 10, "");
param("R", {hu: "Terhelő ellenállás R", en: "Load resistance R"}, 1, 500, 50, 1, "Ω");
plotWindow(0.04); // Két periódus időtartama (2 * 0.02 s = 0.04 s)

let wt = 0;                                   // fázisszög ωt (rad)
let posI1 = 0, posI2 = 0;                     // mozgó áramnyilak pozíciója (px)

update(dt => {
  const omega = 2 * PI * 50;                  // 50 Hz hálózati frekvencia
  wt += omega * dt;
  
  const U1_eff = P.U1;
  const U2_eff = U1_eff * (P.N2 / max(P.N1, 1));
  const R_safe = max(P.R, 1e-3);
  const I2_eff = U2_eff / R_safe;
  const I1_eff = I2_eff * (P.N2 / max(P.N1, 1));
  
  // Pillanatértékek a mozgó nyilak sebességéhez
  const i1 = (U1_eff * sqrt(2) / max(P.N1, 1)) * sin(wt);
  const i2 = (I2_eff * sqrt(2)) * sin(wt);
  
  posI1 += 50 * i1 * dt;
  posI2 += 50 * i2 * dt;
});

draw(t => {
  const omega = 2 * PI * 50;
  const U1_eff = P.U1;
  const U2_eff = U1_eff * (P.N2 / max(P.N1, 1));
  const I2_eff = U2_eff / max(P.R, 1e-3);
  const I1_eff = I2_eff * (P.N2 / max(P.N1, 1));
  
  const u1 = U1_eff * sqrt(2) * sin(wt);
  const u2 = U2_eff * sqrt(2) * sin(wt);
  const i1 = (U1_eff * sqrt(2) / max(P.N1, 1)) * sin(wt);
  const i2 = (I2_eff * sqrt(2)) * sin(wt);

  // --- VASMAG ÉS TEKERCSEK (IEC stílus) ---
  const cx = 500, cy = 200, coreW = 300, coreH = 180;
  // Vas mag keret
  rect(cx - coreW/2, cy - coreH/2, coreW, coreH, {stroke: C.ink, lw: 4, fill: "#e5e5df", radius: 4});
  rect(cx - coreW/2 + 65, cy - coreH/2 + 35, coreW - 130, coreH - 70, {fill: "#fbfbf8", stroke: null}); // belső ablak
  text("Fe", cx, cy - coreH/2 - 12, {size: 14, bold: true, align: "center", color: C.gray});

  // Primer tekercs (bal oszlop)
  rect(cx - coreW/2 - 14, cy - 50, 28, 100, {stroke: C.copper, lw: 3, fill: C.copper, alpha: 0.5, radius: 4});
  text("N₁ = " + P.N1, cx - coreW/2, cy - 65, {size: 14, bold: true, align: "center"});

  // Szekunder tekercs (jobb oszlop)
  rect(cx + coreW/2 - 14, cy - 50, 28, 100, {stroke: C.copper, lw: 3, fill: C.copper, alpha: 0.5, radius: 4});
  text("N₂ = " + P.N2, cx + coreW/2, cy - 65, {size: 14, bold: true, align: "center"});

  // Külső vezetékek és szimbólumok
  const wire = {stroke: C.ink, lw: 2.5};
  // Primer kör (bal oldali AC forrás)
  polyline([[cx - coreW/2 - 14, cy - 50], [280, cy - 50], [280, cy + 50], [cx - coreW/2 - 14, cy + 50]], wire);
  circle(280, cy, 22, {fill: "#fff", stroke: C.ink, lw: 2.5});
  text("~", 280, cy - 2, {size: 20, bold: true, align: "center", baseline: "middle"});
  text("U₁", 230, cy, {size: 16, bold: true, align: "center"});

  // Szekunder kör (jobb oldali terhelő ellenállás R)
  polyline([[cx + coreW/2 + 14, cy - 50], [720, cy - 50], [720, cy + 50], [cx + coreW/2 + 14, cy + 50]], wire);
  rect(705, cy - 20, 30, 40, {stroke: C.ink, lw: 2.5, fill: "#fff"});
  text("R", 750, cy + 5, {size: 16, bold: true, align: "center"});

  // Mozgó áramnyilak (csak a huzalokon)
  if (abs(i1) > 0.01) {
    flow([[cx - coreW/2 - 14, cy - 50], [280, cy - 50], [280, cy + 50], [cx - coreW/2 - 14, cy + 50]], 
         {pos: posI1, dir: sign(i1) || 1, color: C.orange, line: false, alpha: clamp(0.3 + abs(i1)*2, 0, 1)});
  }
  if (abs(i2) > 0.01) {
    flow([[cx + coreW/2 + 14, cy - 50], [720, cy - 50], [720, cy + 50], [cx + coreW/2 + 14, cy + 50]], 
         {pos: posI2, dir: sign(i2) || 1, color: C.teal, line: false, alpha: clamp(0.3 + abs(i2)*2, 0, 1)});
  }

  // Számított értékek kiírása
  show({hu: "Szekunder feszültség U₂", en: "Secondary voltage U₂"}, U2_eff, "V", 1);
  show({hu: "Primer áram I₁", en: "Primary current I₁"}, I1_eff, "A", 2);
  show({hu: "Szekunder áram I₂", en: "Secondary current I₂"}, I2_eff, "A", 2);
  show({hu: "Áttételi tényező (N₁/N₂)", en: "Transformation ratio (N₁/N₂)"}, P.N1 / max(P.N2, 1), "", 2);

  // Oszcilloszkóp grafikonok két perióduson át (u₁ és u₂)
  plot({hu: "Primer feszültség u₁(t)", en: "Primary voltage u₁(t)"}, u1, {unit: "V", color: C.blue, min: -450, max: 450, group: "fesz"});
  plot({hu: "Szekunder feszültség u₂(t)", en: "Secondary voltage u₂(t)"}, u2, {unit: "V", color: C.orange, min: -450, max: 450, group: "fesz"});
  
  val({U2_eff, I1_eff, I2_eff, u1, u2});
});
```

## 3. T3

**User:**

Ferde hajítás légellenállás nélkül. Csúszkák: kezdősebesség 1–20 m/s, szög 0–90°. Indításkor induljon újra a labda, hagyjon nyomvonalat, és a sebességvektor látsszon. Írd ki a legnagyobb magasságot és a hajítás távolságát mérve és elméletből is.

**Gemini:**

Mit mutat a jelenet? Egy test ferde hajítását valós fizikai környezetben, légellenállás nélkül. A szimuláció valós időben méri a maximális magasságot és a becsapódási távolságot, miközben a kék jelölésekkel az elméleti értékeket is mutatja.
Hogyan használd? A csúszkákkal (v0 és α) állítsd be a kezdősebességet és a hajítási szöget. A paraméterek változtatásakor a szimuláció automatikusan újrakezdődik (resetOn), így azonnal összehasonlíthatod a mért eredményeket az elméleti képletekkel.

Code (`gemini-codes/T3-projectile-gemini-v2.js`):

```javascript
stage(1000, 600, "#fbfbf8");
title({hu: "Ferde hajítás (légellenállás nélkül)", en: "Projectile motion (no air resistance)"});
param("v0", {hu: "Kezdősebesség v₀", en: "Launch speed v₀"}, 1, 20, 10, 0.5, "m/s");
param("ang", {hu: "Hajítási szög α", en: "Launch angle α"}, 0, 90, 45, 1, "°");
resetOn("v0", "ang");                          // Új kezdőfeltétel esetén az indítás újrakezdődik
button({hu: "Újraindítás", en: "Restart"}, reset);
plotWindow(4);

const g = 9.81;                                // Nehézségi gyorsulás (m/s²)
// 20 px = 1 m skálázás a fizikai világban
world({gravity: g, scale: 20, origin: [70, 540], ground: true, restitution: 0, friction: 0});

const r = 0.3;                                 // A labda sugara (m)
const a0 = deg(P.ang);
// A labda a talajon áll: a középpontja r magasan van (y = r)
const b = ball({x: 0, y: r, vx: P.v0 * cos(a0), vy: P.v0 * sin(a0), r, m: 1, color: C.orange, trail: 600, showV: true});

let tFly = 0, hMax = 0, landed = false, xLand = 0;
update(dt => {
  if (landed) return;
  tFly += dt;
  hMax = max(hMax, b.y - r);                   // Magasság = a labda alja a talaj fölött
  // Becsapódás ellenőrzése: a világ talajra érkezett és eltelt egy kis idő
  if (b.onGround && tFly > 0.02) {
    landed = true; 
    xLand = b.x;
    b.fixed = true;                            // Megállítjuk, hogy ne guruljon tovább
  }
});

draw(t => {
  // Távolságjelölések 5 méterenként a talaj mentén
  for (let m = 0; m <= 45; m += 5) {
    line(wx(m), wy(0), wx(m), wy(0) + 8, {stroke: C.gray, lw: 1.5});
    text(m + " m", wx(m), wy(0) + 24, {size: 12, color: C.gray, align: "center"});
  }

  const a = deg(P.ang);
  const H = pow(P.v0 * sin(a), 2) / (2 * g);   // Elméleti legnagyobb magasság: H = (v₀·sin α)² / 2g
  const D = P.v0 * P.v0 * sin(2 * a) / g;      // Elméleti hajítási távolság: D = v₀²·sin 2α / g
  const T = 2 * P.v0 * sin(a) / g;             // Elméleti repülési idő

  // Elméleti becsapódási pont és maximális magasság vonal jelölése kék színnel
  polygon([[wx(D), wy(0)], [wx(D) - 7, wy(0) - 12], [wx(D) + 7, wy(0) - 12]], {fill: C.blue, stroke: null, alpha: 0.6});
  line(wx(D / 2) - 30, wy(H + r), wx(D / 2) + 30, wy(H + r), {stroke: C.blue, dash: [5, 4], lw: 1.5});
  text({hu: "kék: elmélet", en: "blue: theory"}, 930, 80, {size: 13, color: C.blue, align: "right"});

  drawWorld();                                 // Talaj, nyomvonal, labda és a sebességvektor kirajzolása

  // Értékek kijelzése a kezelőfelületen
  show({hu: "Legnagyobb magasság – mért", en: "Maximum height – measured"}, hMax, "m", 2);
  show({hu: "Legnagyobb magasság – elmélet", en: "Maximum height – theory"}, H, "m", 2);
  show({hu: "Hajítás távolsága – mért", en: "Range – measured"}, landed ? xLand : "…", "m", 2);
  show({hu: "Hajítás távolsága – elmélet", en: "Range – theory"}, D, "m", 2);
  show({hu: "Repülési idő (mért / elmélet)", en: "Flight time (measured / theory)"}, fmt(tFly, 2) + " / " + fmt(T, 2), "s");

  plot({hu: "Magasság", en: "Height"}, b.y - r, {unit: "m", color: C.orange, min: 0});
  val({hMax, xLand, H, D});
});
```

## 4. T3b (new prompt, not in v1)

**User:**

Pattogó labda: egy labdát h0 magasról elengedünk, és a talajon visszapattan. Csúszkák: kezdőmagasság h0 1–15 m, visszapattanási tényező e 0–1. Hagyjon nyomvonalat. Írd ki a pattanások számát, és az első visszapattanás után elért magasságot mérve és elméletből (h1 = e²·h0).

**Gemini:**

Mit mutat a jelenet? Egy szabadon eső és a talajról visszapattanó labda mozgását, amely a visszapattanási tényező (e) függvényében veszít mechanikai energiájából.
Hogyan próbáld ki? A csúszkákkal állítsd be a kezdőmagasságot (h0) és a visszapattanási tényezőt (e). Figyeld meg, hogy a valós mérés hogyan egyezik meg az elméleti h1 = e²·h0 képlettel!

Code (`gemini-codes/T3b-bouncing-ball-gemini-v2.js`):

```javascript
stage(1000, 600, "#fbfbf8");
title({hu: "Pattogó labda és energiaveszteség", en: "Bouncing ball and energy loss"});
param("h0", {hu: "Kezdőmagasság h₀", en: "Initial height h₀"}, 1, 15, 5, 0.5, "m");
param("e", {hu: "Visszapattanási tényező e", en: "Restitution coefficient e"}, 0, 1, 0.8, 0.05, "");
resetOn("h0", "e");                             // Kezdőmagasság vagy e változásakor újrakezdődik a szimuláció
button({hu: "Újraindítás", en: "Restart"}, reset);
plotWindow(6);

const g = 9.81;                                // Nehézségi gyorsulás (m/s²)
// 30 px = 1 m skálázás; origin a bal alsó sarok közelében
world({gravity: g, scale: 30, origin: [200, 560], ground: true, restitution: P.e, friction: 0});

const r = 0.3;                                 // A labda sugara (m)
// A labda a h₀ magasságból indul (a középpontja h₀ + r magasságban van)
const b = ball({x: 0, y: P.h0 + r, vx: 0, vy: 0, r, m: 1, color: C.orange, trail: 500, showV: true});

let bounceCount = 0;                           // Pattanások számlálója
let h1Measured = 0;                            // Első pattanás utáni mért maximum magasság
let wasOnGround = false;
let measuringFirstBounce = false;

update(dt => {
  // Pattanás érzékelése (amikor a labda eléri a talajt)
  if (b.onGround && !wasOnGround) {
    bounceCount++;
    if (bounceCount === 1) {
      measuringFirstBounce = true;
    } else if (bounceCount === 2) {
      measuringFirstBounce = false;            // Az első pattanás utáni emelkedés lezárult
    }
  }
  wasOnGround = b.onGround;

  // Az első pattanást követő legmagasabb pont mérése
  if (measuringFirstBounce) {
    h1Measured = max(h1Measured, b.y - r);
  }
});

draw(t => {
  // Magasságjelölések 2 méterenként a bal oldalon
  for (let m = 0; m <= 15; m += 2) {
    line(wx(0) - 10, wy(m), wx(0), wy(m), {stroke: C.gray, lw: 1.5});
    text(m + " m", wx(0) - 15, wy(m), {size: 12, color: C.gray, align: "right", baseline: "middle"});
  }

  drawWorld();                                 // Talaj, nyomvonal és a labda kirajzolása

  const h1Theory = P.e * P.e * P.h0;           // Elméleti magasság: h₁ = e²·h₀

  // Értékek kijelzése
  show({hu: "Pattanások száma", en: "Bounce count"}, bounceCount, "");
  show({hu: "Első pattanás utáni magasság – mért", en: "Height after 1st bounce – measured"}, bounceCount > 0 ? h1Measured : "…", "m", 2);
  show({hu: "Első pattanás utáni magasság – elmélet (e²·h₀)", en: "Height after 1st bounce – theory (e²·h₀)"}, h1Theory, "m", 2);
  show({hu: "Aktuális magasság", en: "Current height"}, max(0, b.y - r), "m", 2);

  plot({hu: "Magasság h(t)", en: "Height h(t)"}, max(0, b.y - r), {unit: "m", color: C.orange, min: 0});
  val({bounceCount, h1Measured, h1Theory});
});
```

## 5. T6

**User:**

Egyenáramú motor, a forgórész egy feltöltött kép legyen, ami a tengelye körül forog. A fordulatszám csúszkával állítható legyen 0–120 1/min között.

**Gemini:**

Mit mutat a jelenet? Egy egyenáramú motor vázlatos állórészét és a tengelye körül forgó forgórészt, amelynek fordulatszáma a csúszkával állítható 0 és 120 1/min között.
Fontos teendő: Ahhoz, hogy a forgórész megjelenjen, tölts fel egy tetszőleges képet a bal oldali Images fülön pontosan rotor néven! (Ha nincs feltöltve kép, egy piros keretes helyőrző jelenik meg a helyén).
Hogyan próbáld ki? Állítsd a csúszkát tetszőleges értékre, és figyeld meg a kép forgási sebességét, valamint az alsó grafikonon a fordulatszám alakulását.

Code (`gemini-codes/T6-dcmotor-photo-gemini-v2.js`):

```javascript
stage(1000, 600, "#fbfbf8");
title({hu: "Egyenáramú motor forgórésze", en: "DC motor rotor"});
param("n", {hu: "Fordulatszám n", en: "Speed n"}, 0, 120, 60, 1, "1/min");
plotWindow(10);

let angle = 0;                                  // Forgórész elfordulási szöge (rad) / Rotor angle

update(dt => {
  // Fordulatszám átváltása 1/min-ről rad/s-re: ω = n * 2π / 60
  const omega = P.n * (2 * PI) / 60;
  angle += omega * dt;                          // Szög integrálása időben
});

draw(t => {
  const cx = 500, cy = 300;                     // Motor középpontja a vásznon
  
  // Stator / Ház vázlatos rajza (állórész körvonal és sarkok)
  circle(cx, cy, 180, {stroke: C.ink, lw: 4, fill: "#e5e5df"});
  circle(cx, cy, 140, {stroke: C.ink, lw: 2, fill: "#fbfbf8"});
  
  // Mágnes sarkok jelölése (É és D pólus)
  rect(cx - 30, cy - 170, 60, 25, {fill: C.red, stroke: null});
  text("É (N)", cx, cy - 158, {size: 14, bold: true, color: "#fff", align: "center"});
  
  rect(cx - 30, cy + 145, 60, 25, {fill: C.blue, stroke: null});
  text("D (S)", cx, cy + 158, {size: 14, bold: true, color: "#fff", align: "center"});

  // Forgórész kép rajzolása (A feltöltött képet "rotor" néven kell feltölteni az Images fülön!)
  image("rotor", cx, cy, {w: 220, angle: angle});

  // Tengely középpontja
  circle(cx, cy, 8, {fill: C.ink, stroke: null});

  // Értékek kijelzése és grafikon
  show({hu: "Fordulatszám (n)", en: "Speed (n)"}, P.n, "1/min", 0);
  show({hu: "Szögsebesség (ω)", en: "Angular velocity (ω)"}, P.n * 2 * PI / 60, "rad/s", 2);

  plot({hu: "Fordulatszám n", en: "Speed n"}, P.n, {unit: "1/min", color: C.blue, min: 0, max: 120});
  val({n: P.n});
});
```
