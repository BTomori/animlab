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
