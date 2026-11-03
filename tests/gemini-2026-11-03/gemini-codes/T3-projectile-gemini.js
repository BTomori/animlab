// 1) BEÁLLÍTÁSOK ÉS KEZDETI ÁLLAPOT
stage(1000, 600, "#fbfbf8");
title({hu: "Ferde hajítás légellenállás nélkül", en: "Projectile motion without air resistance"});

// Csúszkák a kezdősebességhez és a hajítási szöghöz
param("v0", {hu: "Kezdősebesség v₀", en: "Initial velocity v₀"}, 1, 20, 14, 0.5, "m/s");
param("angle", {hu: "Hajítási szög α", en: "Launch angle α"}, 0, 90, 45, 1, "°");
button({hu: "Újraindítás", en: "Restart"}, reset);
// Ha a csúszkák értéke változik, a szimuláció automatikusan újrakezdődik
resetOn("v0", "angle");

// Fizikai világ beállítása: 1 m = 25 képpont, origó a bal alsó sarokban (x=80, y=520)
world({gravity: 9.81, scale: 25, origin: [80, 520], ground: true, restitution: 0});

// Kezdősebesség komponensek kiszámítása radiánban megadott szögből
const alphaRad = deg(P.angle);
const v0x = P.v0 * cos(alphaRad);
const v0y = P.v0 * sin(alphaRad);

// Labda létrehozása (trail: nyomvonal, showV: sebességvektor rajzolása)
const labda = ball({
  x: 0, y: 0,
  vx: v0x, vy: v0y,
  r: 0.4, m: 1, 
  color: C.blue, 
  trail: true, 
  showV: true
});

// Állapotváltozók a mért értékek követésére
let maxHMeasured = 0;
let rangeMeasured = 0;
let landed = false;

// 2) FIZIKAI SZÁMÍTÁSOK (update)
update(dt => {
  // Magasság és távolság mérése amíg a labda a levegőben van (y >= 0)
  if (labda.y >= 0) {
    if (labda.y > maxHMeasured) {
      maxHMeasured = labda.y;
    }
    if (!landed) {
      rangeMeasured = labda.x;
    }
  }
  
  // Becsapódás érzékelése
  if (labda.onGround || labda.y < 0) {
    landed = true;
  }
});

// 3) RAJZOLÁS ÉS VIZUALIZÁCIÓ (draw)
draw(t => {
  // A fizikai világ elemeinek (föld, nyomvonal, labda, sebességvektor) kirajzolása
  drawWorld();

  const g = 9.81;
  const v0 = P.v0;
  const alpha = deg(P.angle);

  // Elméleti képletek ferde hajításra (légellenállás nélkül):
  // H_max = (v0 * sin(α))² / (2 * g)
  const H_theo = pow(v0 * sin(alpha), 2) / (2 * g);
  
  // R_max = (v0² * sin(2α)) / g
  const R_theo = (v0 * v0 * sin(2 * alpha)) / g;

  // Readoutok (adatok kiírása a vezérlőpanelre)
  show({hu: "Mért legnagyobb magasság", en: "Measured max height"}, maxHMeasured, "m", 2);
  show({hu: "Elméleti legnagyobb magasság", en: "Theoretical max height"}, H_theo, "m", 2);
  show({hu: "Mért hajítás távolsága", en: "Measured range"}, rangeMeasured, "m", 2);
  show({hu: "Elméleti hajítás távolsága", en: "Theoretical range"}, R_theo, "m", 2);

  val({ maxHMeasured, H_theo, rangeMeasured, R_theo });
});
