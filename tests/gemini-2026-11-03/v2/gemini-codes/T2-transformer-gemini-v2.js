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
