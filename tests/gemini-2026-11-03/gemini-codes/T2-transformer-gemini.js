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
