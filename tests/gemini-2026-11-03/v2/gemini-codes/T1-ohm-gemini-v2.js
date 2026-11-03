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
