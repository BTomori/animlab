// T3b – Pattogó labda / Bouncing ball (re-test prompt, not in the worked examples)
stage(1000, 600, "#fbfbf8");
title({hu: "Pattogó labda", en: "Bouncing ball"});
param("h0", {hu: "Kezdőmagasság h₀", en: "Drop height h₀"}, 1, 15, 5, 0.5, "m");
param("e", {hu: "Visszapattanási tényező e", en: "Coefficient of restitution e"}, 0, 1, 0.8, 0.05, "");
resetOn("h0", "e");                            // új kezdőfeltétel → új ejtés / new initial condition → new drop
button({hu: "Újra", en: "Again"}, reset);
plotWindow(8);

const g = 9.81;
// 30 px = 1 m: 15 m + a labda = 459 px, elfér a cím alatt / 15 m fits under the title
world({gravity: g, scale: 30, origin: [500, 560], ground: true, restitution: P.e, friction: 0});
const r = 0.3;                                 // a labda sugara (m) / ball radius
// A labda alja van h₀ magasan, ezért a középpontja h₀ + r / the ball's bottom is at h₀, so its centre is at h₀ + r
const b = ball({x: 0, y: P.h0 + r, r, m: 1, color: C.orange, trail: 800});

let bounces = 0, wasDown = false, h1 = 0, after1 = false;
update(dt => {
  const down = b.onGround;
  if (down && !wasDown && b.speed > 0.05) { bounces++; after1 = bounces === 1; }   // új talajérintés = pattanás / a new ground contact = a bounce
  if (bounces >= 2) after1 = false;
  if (after1) h1 = max(h1, b.y - r);           // az első pattanás utáni csúcs / apex after the first bounce
  wasDown = down;
});

draw(t => {
  for (let m = 0; m <= 15; m += 5) {           // magasságskála / height scale
    line(wx(-3), wy(m), wx(-2.6), wy(m), {stroke: C.gray, lw: 1.5});
    text(m + " m", wx(-3.1), wy(m) + 4, {size: 12, color: C.gray, align: "right"});
  }
  const h1t = P.e * P.e * P.h0;                // h₁ = e²·h₀ (energia: v' = e·v, h = v²/2g) / energy: v' = e·v
  line(wx(-1.5), wy(h1t), wx(1.5), wy(h1t), {stroke: C.blue, dash: [5, 4], lw: 1.5});
  text({hu: "elmélet: h₁ = e²·h₀", en: "theory: h₁ = e²·h₀"}, wx(1.7), wy(h1t) + 4, {size: 13, color: C.blue});
  drawWorld();
  show({hu: "Pattanások száma", en: "Number of bounces"}, bounces, "", 0);
  show({hu: "h₁ – mért", en: "h₁ – measured"}, bounces >= 1 ? h1 : "…", "m", 2);
  show({hu: "h₁ – elmélet e²·h₀", en: "h₁ – theory e²·h₀"}, h1t, "m", 2);
  show({hu: "Magasság", en: "Height"}, b.y - r, "m", 2);
  plot({hu: "Magasság", en: "Height"}, b.y - r, {unit: "m", color: C.orange, min: 0});
  val({bounces, h1, h1t});
});
