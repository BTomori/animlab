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
