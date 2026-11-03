// T6 – Egyenáramú motor forgó forgórész-fényképpel / DC motor with a rotating rotor photo
// Kép: Képek fül → tölts fel egy homlokképet a forgórészről „rotor” néven. A kép közepe legyen a tengely
// (ha nem az, állítsd a pivot értékét, a „Forgáspont mutatása” kapcsolóval ellenőrizve).
// Picture: Images tab → upload a front view of the rotor named "rotor". Its centre should be the shaft
// (if not, change pivot and check it with the "Show pivot" switch).
stage(1000, 600, "#fbfbf8");
title({hu: "Egyenáramú motor – forgó forgórész", en: "DC motor – rotating rotor"});
param("n", {hu: "Fordulatszám n", en: "Speed n"}, 0, 120, 60, 1, "1/min");
toggle("pv", {hu: "Forgáspont mutatása", en: "Show pivot"}, false);

const cx0 = 380, cy0 = 320, rRot = 150;   // a tengely helye és a forgórész sugara (px) / shaft position, rotor radius
let theta = 0;                             // a forgórész szöge (rad), az óramutatóval ellentétesen nő / rotor angle, anticlockwise

update(dt => {
  const omega = 2 * PI * P.n / 60;         // ω = 2π·n/60 (rad/s), n fordulat/perc / n in rev/min
  theta += omega * dt;
});

draw(t => {
  const omega = 2 * PI * P.n / 60;
  // Állórész-ház és a két állandó mágnes / stator housing and the two permanent magnets
  rect(62, 100, 636, 440, {stroke: "#9aa3b1", lw: 16, radius: 28});
  rect(70, 170, 120, 300, {fill: C.N, radius: 4});
  rect(570, 170, 120, 300, {fill: C.S, radius: 4});
  text("N", 130, 320, {size: 46, bold: true, color: "#fff", align: "center", baseline: "middle"});
  text("S", 630, 320, {size: 46, bold: true, color: "#fff", align: "center", baseline: "middle"});
  // Erővonalak N-től S felé, a forgórész mögött / field lines from N to S, behind the rotor
  for (let k = -3; k <= 3; k++) arrow(190, cy0 + k * 38, 570, cy0 + k * 38, {stroke: C.gray, lw: 1, alpha: 0.5, head: 8, id: "field"});

  // A forgórész képe: a canvas az óramutató irányába forgat, ezért −θ, hogy θ növekedésével balra forogjon
  // The rotor photo: canvas rotation is clockwise, so −θ makes it turn anticlockwise as θ grows
  image("rotor", cx0, cy0, {w: 2 * rRot, angle: -theta, showPivot: P.pv});

  // Forgásirány: ív-nyíl ω felirattal (csak ha forog) / direction: an arc arrow labelled ω (only when turning)
  if (P.n > 0) {
    arc(cx0, cy0, rRot + 22, -PI * 0.75, -PI * 0.25, {stroke: C.ink, lw: 2.5});
    const ae = -PI * 0.75;                 // az ív bal vége: a nyílhegy ott van (balra forog) / arrowhead at the left end
    const ex = cx0 + (rRot + 22) * cos(ae), ey = cy0 + (rRot + 22) * sin(ae);
    arrow(ex + 14, ey - 10, ex, ey, {stroke: C.ink, lw: 2.5});
    text("ω", cx0, cy0 - rRot - 34, {size: 20, bold: true, italic: true, align: "center"});
  }

  // Adatok a jobb oldalon / data on the right
  text("n = " + fmt(P.n, 0) + " 1/min", 760, 260, {size: 20, bold: true});
  text("ω = " + fmt(omega, 2) + " rad/s", 760, 295, {size: 18});
  text("T = " + (P.n > 0 ? fmt(60 / P.n, 2) + " s" : "—"), 760, 330, {size: 18});

  show({hu: "Fordulatszám n", en: "Speed n"}, P.n, "1/min", 0);
  show({hu: "Szögsebesség ω = 2π·n/60", en: "Angular speed ω = 2π·n/60"}, omega, "rad/s", 3);
  show({hu: "Egy fordulat ideje T = 60/n", en: "Time per revolution T = 60/n"}, P.n > 0 ? 60 / P.n : "—", "s", 2);
  show({hu: "Forgórész szöge", en: "Rotor angle"}, mod(todeg(theta), 360), "°", 0);
  val({n: P.n, omega, theta});
});
