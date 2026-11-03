// T1 – Ohm törvénye: telep, ellenállás és izzó sorosan / Ohm's law: battery, resistor and lamp in series
// Kapcsolási rajz szabványos (IEC 60617) jelekkel: telep = hosszú vékony (+) és rövid vastag (−) vonal,
// ellenállás = téglalap, izzó = kör benne X-szel. / Schematic with standard IEC 60617 symbols.
stage(1000, 600, "#fbfbf8");
title({hu: "Ohm törvénye – soros kör izzóval", en: "Ohm's law – series circuit with a lamp"});
param("U", {hu: "Tápfeszültség U", en: "Supply voltage U"}, 0, 24, 12, 0.5, "V");
param("R", {hu: "Ellenállás R", en: "Resistance R"}, 1, 100, 6, 1, "Ω");
plotWindow(10);

// Az izzó ellenállása izzó állapotban: egy 12 V / 12 W-os izzónál R_L = U²/P = 12 Ω (állandónak vesszük)
// Lamp resistance when lit: a 12 V / 12 W lamp has R_L = U²/P = 12 Ω (taken as constant)
const RL = 12;
const kV = 60;          // a mozgó nyilak sebessége: 1 A = 60 px/s / arrow speed: 1 A = 60 px/s
let pos = 0;            // a nyílhegyek eltolása (px), az áramból integrálva / arrowhead offset, integrated from the current

update(dt => {
  const I = P.U / (P.R + RL);   // soros kör: I = U / (R + R_L) / series circuit
  pos += kV * I * dt;           // a nyilak az árammal arányos sebességgel haladnak / arrows move at a speed ∝ I
});

draw(t => {
  const I = P.U / (P.R + RL);          // áram (A) / current
  const UR = I * P.R, UL = I * RL;     // feszültségesések (V) / voltage drops
  const PL = I * I * RL;               // az izzó teljesítménye (W) / lamp power
  const PR = I * I * P.R;              // az ellenálláson hővé váló teljesítmény (W) / power in the resistor

  // Elrendezés (px) / layout: telep balra, ellenállás fent, izzó jobbra / battery left, resistor top, lamp right
  const xB = 150, yP = 280, yN = 320;  // telep: x, pozitív és negatív lemez y-ja / battery plates
  const xR1 = 420, xR2 = 580, yT = 150; // ellenállás vége / resistor ends on the top wire
  const xL = 850, yL = 300, rL = 32;    // izzó középpontja és sugara / lamp centre and radius
  const yB = 450;                       // alsó vezeték / bottom wire

  // A vezeték három szakasza – mindegyik az alkatrészeknél ér véget, így a nyilak nem futnak át rajtuk
  // The wire in three pieces – each stops at a component, so the arrows never run across one
  const w1 = [[xB, yP], [xB, yT], [xR1, yT]];              // + pólustól az ellenállásig / from + to the resistor
  const w2 = [[xR2, yT], [xL, yT], [xL, yL - rL]];         // ellenállástól az izzóig / resistor to lamp
  const w3 = [[xL, yL + rL], [xL, yB], [xB, yB], [xB, yN]]; // izzótól a − pólusig / lamp back to −
  for (const w of [w1, w2, w3]) polyline(w, {stroke: C.ink, lw: 3});

  // Mozgó nyilak: csak ha folyik áram; kis áramnál halványak / moving arrows only with current; faint when small
  if (I > 0.005) {
    for (const w of [w1, w2, w3]) {
      flow(w, {pos, dir: 1, spacing: 60, size: 11, color: C.orange, line: false, alpha: clamp(0.35 + I / 1.5, 0, 1)});
    }
  }

  // Telep / battery
  line(xB - 32, yP, xB + 32, yP, {stroke: C.ink, lw: 3});   // + lemez (hosszú) / + plate (long)
  line(xB - 16, yN, xB + 16, yN, {stroke: C.ink, lw: 8});   // − lemez (rövid, vastag) / − plate (short, thick)
  text("+", xB + 40, yP - 6, {size: 22, bold: true, color: C.red});
  text("−", xB + 40, yN + 14, {size: 22, bold: true, color: C.blue});
  text("U = " + fmt(P.U, 1) + " V", xB - 45, (yP + yN) / 2 + 6, {size: 18, bold: true, align: "right"});

  // Ellenállás / resistor
  rect(xR1, yT - 18, xR2 - xR1, 36, {fill: "#ffffff", stroke: C.ink, lw: 3});
  text("R = " + fmt(P.R, 0) + " Ω", (xR1 + xR2) / 2, yT - 30, {size: 18, bold: true, align: "center"});
  text("U_R = " + fmt(UR, 2) + " V", (xR1 + xR2) / 2, yT + 45, {size: 15, color: C.gray, align: "center"});

  // Izzó: a fénykör és a bura színe a teljesítményt követi (12 W-nál teljes fényerő)
  // Lamp: glow and bulb colour follow the power (full brightness at its rated 12 W)
  const glow = clamp(PL / 12, 0, 1);
  if (glow > 0.01) circle(xL, yL, rL + 8 + 45 * glow, {fill: C.yellow, stroke: null, alpha: 0.12 + 0.4 * glow});
  circle(xL, yL, rL, {fill: glow > 0.01 ? "rgba(255, 214, 80, " + (0.25 + 0.75 * glow) + ")" : "#ffffff", stroke: C.ink, lw: 3});
  const k = rL * 0.7;   // az X a kör belsejében / the X inside the circle
  line(xL - k, yL - k, xL + k, yL + k, {stroke: C.ink, lw: 2.5});
  line(xL - k, yL + k, xL + k, yL - k, {stroke: C.ink, lw: 2.5});
  text({hu: "izzó, R_L = 12 Ω", en: "lamp, R_L = 12 Ω"}, xL - rL - 14, yL + 6, {size: 15, align: "right"});
  text("P = " + fmt(PL, 2) + " W", xL - rL - 14, yL + 28, {size: 15, bold: true, align: "right"});

  show({hu: "Áram I = U / (R + R_L)", en: "Current I = U / (R + R_L)"}, I, "A", 3);
  show({hu: "Az izzó teljesítménye P = I²·R_L", en: "Lamp power P = I²·R_L"}, PL, "W", 2);
  show({hu: "Feszültség az ellenálláson U_R", en: "Voltage across the resistor U_R"}, UR, "V", 2);
  show({hu: "Feszültség az izzón U_L", en: "Voltage across the lamp U_L"}, UL, "V", 2);
  show({hu: "Teljes teljesítmény U·I", en: "Total power U·I"}, P.U * I, "W", 2);
  plot("I", I, {unit: "A", color: C.orange, min: 0});
  val({I, PL, PR});
});
