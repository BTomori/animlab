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
