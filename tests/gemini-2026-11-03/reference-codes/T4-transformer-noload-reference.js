// T4 – Egyfázisú ideális transzformátor üresjárás-kapcsolóval / Single-phase ideal transformer with a no-load switch
// Ideális: nincs veszteség, nincs szórás, a mágnesező áram elhanyagolható.
// Ideal: no losses, no leakage, negligible magnetising current.
stage(1000, 600, "#fbfbf8");
title({hu: "Egyfázisú transzformátor üresjárás-kapcsolóval", en: "Single-phase transformer with a no-load switch"});
param("U1", {hu: "Primer feszültség U₁ (effektív)", en: "Primary voltage U₁ (RMS)"}, 0, 400, 230, 5, "V");
param("N1", {hu: "Primer menetszám N₁", en: "Primary turns N₁"}, 10, 1000, 500, 10, "");
param("N2", {hu: "Szekunder menetszám N₂", en: "Secondary turns N₂"}, 10, 1000, 50, 10, "");
param("R", {hu: "Terhelő ellenállás R", en: "Load resistance R"}, 1, 500, 10, 1, "Ω");
toggle("open", {hu: "Üresjárás", en: "No load"}, false);   // bekapcsolva a terhelés le van választva / on: the load is disconnected
const f = 50;            // hálózati frekvencia (Hz) / mains frequency
timeScale(0.002);        // 1 valódi s = 2 ms → egy 20 ms-os periódus 10 s alatt fut le / one 20 ms period takes 10 s
plotWindow(2 / f);       // a grafikon két periódust mutat: 2 · 20 ms = 0,04 s / the graph shows two periods

let wt = 0;              // ωt, fázisszög (rad) / phase angle
let pos1 = 0, pos2 = 0, posF = 0;   // a mozgó nyilak eltolása (px) / offsets of the moving arrows
const kV = 70;           // nyílsebesség a csúcsértéknél (px/s) / arrow speed at the peak value

update(dt => {
  wt += 2 * PI * f * dt;
  // A nyilak sebessége a pillanatértékkel arányos, a csúcsértékre normálva: így mindig látszik az irány és a fázis
  // Arrow speed ∝ instantaneous value, normalised to the peak: direction and phase are always visible
  pos1 += kV * sin(wt) * dt;        // primer és szekunder áram: fázisban u₁-gyel (ohmos terhelés) / currents in phase with u₁
  pos2 += kV * sin(wt) * dt;
  posF += kV * -cos(wt) * dt;       // fluxus: Φ = −Φ̂·cos(ωt), 90°-ot késik u₁-hez képest / flux lags u₁ by 90°
});

draw(t => {
  const k = P.N2 / P.N1;                 // áttétel / turns ratio
  const U2 = P.U1 * k;                   // U₂ = U₁ · N₂/N₁
  // Üresjárásban a szekunder kör szakadt: I₂ = 0, így ideális transzformátornál I₁ = 0 is
  // (valódi transzformátornál a kis mágnesező áram ilyenkor is folyik). / No load: the secondary circuit is open,
  // I₂ = 0, so for an ideal transformer I₁ = 0 too (a real one still draws a small magnetising current).
  const I2 = P.open ? 0 : U2 / P.R;      // Ohm törvénye a terhelésen / Ohm's law on the load
  const I1 = I2 * k;                     // I₁ = I₂ · N₂/N₁ (teljesítmény-egyensúly / power balance)
  const u1 = sqrt(2) * P.U1 * sin(wt);   // pillanatértékek / instantaneous values
  const u2 = u1 * k;
  const live = P.U1 > 0;

  // Vasmag: külső keret és ablak / iron core: outer frame and window
  rect(330, 160, 340, 280, {fill: "#c9ced6", stroke: "#8a93a3", lw: 2});
  rect(400, 230, 200, 140, {fill: "#fbfbf8", stroke: "#8a93a3", lw: 2});
  // Fluxus a vasmag középvonalán, az előjele szerint körbe / flux along the core's centre line
  if (live) flow([[365, 195], [635, 195], [635, 405], [365, 405]], {closed: true, pos: posF, dir: sign(-cos(wt)) || 1,
    spacing: 90, size: 12, color: C.purple, line: false, alpha: 0.35 + 0.65 * abs(cos(wt))});
  text("Φ", 500, 185, {size: 18, bold: true, italic: true, color: C.purple, align: "center"});

  // Tekercsek: 8 rajzolt menet száranként (a valódi menetszám a csúszkán) / 8 drawn turns per leg
  for (let n = 0; n < 8; n++) {
    const y = 252 + n * 14;
    line(318, y, 412, y + 6, {stroke: C.copper, lw: 5});   // primer a bal száron / primary on the left leg
    line(588, y, 682, y + 6, {stroke: C.copper, lw: 5});   // szekunder a jobb száron / secondary on the right leg
  }
  text("N₁ = " + fmt(P.N1, 0), 365, 225, {size: 15, bold: true, align: "center"});
  text("N₂ = " + fmt(P.N2, 0), 635, 225, {size: 15, bold: true, align: "center"});

  // Primer kör: váltakozó forrás (kör ~ jellel) / primary circuit: AC source (circle with ~)
  const p1 = [[170, 268], [170, 245], [318, 245]], p2 = [[318, 355], [170, 355], [170, 332]];
  const s1a = [[682, 245], [730, 245]], s1b = [[770, 245], [830, 245], [830, 265]], s2 = [[830, 335], [830, 355], [682, 355]];
  for (const w of [p1, p2, s1a, s1b, s2]) polyline(w, {stroke: C.ink, lw: 3});
  // Kapcsoló a szekunder körben: zárva vízszintes, nyitva felhajtva / switch in the secondary: closed flat, open tilted up
  circle(730, 245, 4, {fill: C.ink}); circle(770, 245, 4, {fill: C.ink});
  if (P.open) line(730, 245, 764, 222, {stroke: C.red, lw: 3}); else line(730, 245, 770, 245, {stroke: C.ink, lw: 3});
  text(P.open ? {hu: "nyitva", en: "open"} : {hu: "zárva", en: "closed"}, 750, 212, {size: 13, color: P.open ? C.red : C.gray, align: "center"});
  circle(170, 300, 32, {fill: "#ffffff", stroke: C.ink, lw: 3});
  text("~", 170, 312, {size: 34, align: "center"});
  text("U₁ = " + fmt(P.U1, 0) + " V", 120, 305, {size: 16, bold: true, align: "right"});
  // Terhelés / load
  rect(815, 265, 30, 70, {fill: "#ffffff", stroke: C.ink, lw: 3});
  text("R", 860, 306, {size: 18, bold: true});
  text("U₂ = " + fmt(U2, 1) + " V", 860, 330, {size: 15});

  // Áramnyilak: a pillanatnyi áram irányában, nulla körül elhalványulnak / current arrows fade out near zero
  if (live && !P.open) {                 // üresjárásban (ideálisan) nem folyik áram / no current at no load (ideal)
    const a = abs(sin(wt));
    for (const w of [p1, p2]) flow(w, {pos: pos1, dir: sign(sin(wt)) || 1, spacing: 55, size: 11, color: C.orange, line: false, alpha: a});
    for (const w of [s1a, s1b, s2]) flow(w, {pos: pos2, dir: sign(sin(wt)) || 1, spacing: 55, size: 11, color: C.teal, line: false, alpha: a});
  }
  text("i₁", 245, 232, {size: 17, bold: true, italic: true, color: C.orange, align: "center"});
  text("i₂", P.open ? 805 : 755, 232, {size: 17, bold: true, italic: true, color: C.teal, align: "center"});

  show({hu: "Szekunder feszültség U₂ = U₁·N₂/N₁", en: "Secondary voltage U₂ = U₁·N₂/N₁"}, U2, "V", 2);
  show({hu: "Primer áram I₁ = I₂·N₂/N₁", en: "Primary current I₁ = I₂·N₂/N₁"}, I1, "A", 3);
  show({hu: "Szekunder áram I₂ = U₂/R", en: "Secondary current I₂ = U₂/R"}, I2, "A", 3);
  show({hu: "Áttétel N₁/N₂", en: "Turns ratio N₁/N₂"}, P.N1 / P.N2, "", 2);
  show({hu: "Teljesítmény P = U₂·I₂", en: "Power P = U₂·I₂"}, U2 * I2, "W", 1);
  plot("u₁", u1, {unit: "V", color: C.blue});
  plot("u₂", u2, {unit: "V", color: C.red});
  val({U2, I1, I2});
});
