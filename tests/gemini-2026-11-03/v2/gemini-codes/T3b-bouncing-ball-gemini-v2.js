stage(1000, 600, "#fbfbf8");
title({hu: "Pattogó labda és energiaveszteség", en: "Bouncing ball and energy loss"});
param("h0", {hu: "Kezdőmagasság h₀", en: "Initial height h₀"}, 1, 15, 5, 0.5, "m");
param("e", {hu: "Visszapattanási tényező e", en: "Restitution coefficient e"}, 0, 1, 0.8, 0.05, "");
resetOn("h0", "e");                             // Kezdőmagasság vagy e változásakor újrakezdődik a szimuláció
button({hu: "Újraindítás", en: "Restart"}, reset);
plotWindow(6);

const g = 9.81;                                // Nehézségi gyorsulás (m/s²)
// 30 px = 1 m skálázás; origin a bal alsó sarok közelében
world({gravity: g, scale: 30, origin: [200, 560], ground: true, restitution: P.e, friction: 0});

const r = 0.3;                                 // A labda sugara (m)
// A labda a h₀ magasságból indul (a középpontja h₀ + r magasságban van)
const b = ball({x: 0, y: P.h0 + r, vx: 0, vy: 0, r, m: 1, color: C.orange, trail: 500, showV: true});

let bounceCount = 0;                           // Pattanások számlálója
let h1Measured = 0;                            // Első pattanás utáni mért maximum magasság
let wasOnGround = false;
let measuringFirstBounce = false;

update(dt => {
  // Pattanás érzékelése (amikor a labda eléri a talajt)
  if (b.onGround && !wasOnGround) {
    bounceCount++;
    if (bounceCount === 1) {
      measuringFirstBounce = true;
    } else if (bounceCount === 2) {
      measuringFirstBounce = false;            // Az első pattanás utáni emelkedés lezárult
    }
  }
  wasOnGround = b.onGround;

  // Az első pattanást követő legmagasabb pont mérése
  if (measuringFirstBounce) {
    h1Measured = max(h1Measured, b.y - r);
  }
});

draw(t => {
  // Magasságjelölések 2 méterenként a bal oldalon
  for (let m = 0; m <= 15; m += 2) {
    line(wx(0) - 10, wy(m), wx(0), wy(m), {stroke: C.gray, lw: 1.5});
    text(m + " m", wx(0) - 15, wy(m), {size: 12, color: C.gray, align: "right", baseline: "middle"});
  }

  drawWorld();                                 // Talaj, nyomvonal és a labda kirajzolása

  const h1Theory = P.e * P.e * P.h0;           // Elméleti magasság: h₁ = e²·h₀

  // Értékek kijelzése
  show({hu: "Pattanások száma", en: "Bounce count"}, bounceCount, "");
  show({hu: "Első pattanás utáni magasság – mért", en: "Height after 1st bounce – measured"}, bounceCount > 0 ? h1Measured : "…", "m", 2);
  show({hu: "Első pattanás utáni magasság – elmélet (e²·h₀)", en: "Height after 1st bounce – theory (e²·h₀)"}, h1Theory, "m", 2);
  show({hu: "Aktuális magasság", en: "Current height"}, max(0, b.y - r), "m", 2);

  plot({hu: "Magasság h(t)", en: "Height h(t)"}, max(0, b.y - r), {unit: "m", color: C.orange, min: 0});
  val({bounceCount, h1Measured, h1Theory});
});
