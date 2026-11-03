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
