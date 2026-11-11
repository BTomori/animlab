/* ───────────── guide (short lessons with runnable examples) ───────────── */
const GUIDE = [
  {t: {hu: 'Rajzolás', en: 'Drawing'},
   d: {hu: 'Ami a draw(t => { … }) belsejében van, az minden képkockán lefut: ide írod az alakzatokat, nyilakat, szöveget. A vásznon x jobbra, y lefelé nő, képpontban (1000×600), az origó a bal felső sarok.',
       en: 'Everything inside draw(t => { … }) runs on every frame: put your shapes, arrows and text there. On the canvas x grows to the right and y grows downwards, in pixels (1000×600); the origin is the top-left corner.'},
   code: `// ⟨Vászon: szélesség 1000 px, magasság 600 px, háttérszín (hexa kód)|Canvas: width 1000 px, height 600 px, background colour (hex code)⟩
stage(1000, 600, "#ffffff");

// ⟨draw: minden képkockán lefut; t = eltelt idő másodpercben|draw: runs on every frame; t = elapsed time in seconds⟩
draw(t => {
  // ⟨Kör: középpont x = 200, y = 300 (px), sugár 60 px, kék kitöltés|Circle: centre x = 200, y = 300 (px), radius 60 px, blue fill⟩
  circle(200, 300, 60, {fill: C.blue});

  // ⟨Téglalap: bal felső sarok (330; 240), szélesség 160, magasság 120 px, narancs, 10 px-es lekerekítés|Rectangle: top-left corner (330; 240), width 160, height 120 px, orange, 10 px rounded corners⟩
  rect(330, 240, 160, 120, {fill: C.orange, radius: 10});

  // ⟨Nyíl: kezdőpont (560; 300) → hegy (820; 300), piros, 4 px vastag|Arrow: tail (560; 300) → tip (820; 300), red, 4 px thick⟩
  arrow(560, 300, 820, 300, {stroke: C.red, lw: 4});

  // ⟨Szöveg: tartalom, x = 330, y = 150 (az alapvonal), 32 px-es félkövér betű|Text: content, x = 330, y = 150 (baseline), 32 px bold⟩
  text("Hello AnimLab!", 330, 150, {size: 32, bold: true});
});`},
  {t: {hu: 'Mozgás az idővel', en: 'Motion over time'},
   d: {hu: 'A t az eltelt idő másodpercben. Ha egy helyet vagy szöget t-ből számolsz, az alakzat mozogni kezd. A szögek radiánban vannak, fokból a deg() vált át.',
       en: 't is the elapsed time in seconds. Compute a position or an angle from t and the shape starts to move. Angles are in radians; deg() converts from degrees.'},
   code: `draw(t => {
  // ⟨Rezgés: x = középpont + amplitúdó · sin(t)|Oscillation: x = centre + amplitude · sin(t)⟩
  // ⟨  500 = a lengés KÖZÉPPONTJA (px), 300 = az AMPLITÚDÓ (px)|  500 = CENTRE of the swing (px), 300 = AMPLITUDE (px)⟩
  // ⟨  sin(t) −1 és +1 között vált → x 200 és 800 px között leng|  sin(t) runs from −1 to +1 → x swings between 200 and 800 px⟩
  // ⟨  egy lengés 2π ≈ 6,28 s; f Hz-hez írd: sin(2 * PI * f * t)|  one swing takes 2π ≈ 6.28 s; for f Hz write: sin(2 * PI * f * t)⟩
  const x = 500 + 300 * sin(t);

  // ⟨Kör a mozgó x helyen: y = 220 px, sugár 40 px, zöld|Circle at the moving x: y = 220 px, radius 40 px, green⟩
  circle(x, 220, 40, {fill: C.green});

  // ⟨Elforgatott téglalap: középpont (500; 430), 160 × 50 px, szög = t radián → 1 rad/s-mal forog|Rotated rectangle: centre (500; 430), 160 × 50 px, angle = t radians → turns at 1 rad/s⟩
  box(500, 430, 160, 50, t, {fill: C.purple});

  // ⟨A koordináta-rendszer elmentése, mielőtt elmozdítjuk|Save the coordinate system before moving it⟩
  push();
  // ⟨Az origó áthelyezése a (200; 430) pontba|Move the origin to the point (200; 430)⟩
  translate(200, 430);
  // ⟨Elforgatás 45 fokkal (a deg() fokból radiánt csinál)|Rotate by 45 degrees (deg() turns degrees into radians)⟩
  rotate(deg(45));
  // ⟨80 × 80-as négyzet az új origó körül: bal felső sarka (−40; −40)|80 × 80 square around the new origin: top-left corner (−40; −40)⟩
  rect(-40, -40, 80, 80, {stroke: C.ink, lw: 3});
  // ⟨Vissza az eredeti koordináta-rendszerhez|Back to the original coordinate system⟩
  pop();
});`},
  {t: {hu: 'Csúszkák és kapcsolók', en: 'Sliders and switches'},
   d: {hu: 'A param() csúszkát, a toggle() kapcsolót tesz a Vezérlők fülre. Az értéküket P.név adja – a draw vagy update belsejében olvasd, így húzás közben azonnal frissül.',
       en: 'param() adds a slider and toggle() a switch to the Controls tab. Their value is P.name – read it inside draw or update so it follows the slider live.'},
   code: `// ⟨Csúszka: azonosító "r" (értéke P.r), felirat két nyelven, min 20, max 250, alapérték 120, lépés 1, egység px|Slider: id "r" (value P.r), label in two languages, min 20, max 250, default 120, step 1, unit px⟩
param("r", {hu: "Sugár", en: "Radius"}, 20, 250, 120, 1, "px");

// ⟨Csúszka: fordulatszám 0 … 120 1/min, alapérték 30|Slider: speed 0 … 120 rpm, default 30⟩
param("n", {hu: "Fordulatszám", en: "Speed"}, 0, 120, 30, 1, "1/min");

// ⟨Kapcsoló: azonosító "ray" (P.ray = true vagy false), alapból bekapcsolva|Switch: id "ray" (P.ray = true or false), on by default⟩
toggle("ray", {hu: "Sugár rajzolása", en: "Draw the radius"}, true);

draw(t => {
  // ⟨Szög radiánban: idő · fordulat/s · 2π (n 1/min-ben → n/60 fordulat/s)|Angle in radians: time · rev/s · 2π (n in rpm → n/60 rev/s)⟩
  const a = t * P.n * 2 * PI / 60;
  // ⟨A körpályán mozgó pont: középpont (500; 300), sugár P.r; y-nál mínusz, mert a vásznon y lefelé nő|Point on the circle: centre (500; 300), radius P.r; minus for y because y grows downwards⟩
  const x = 500 + P.r * cos(a), y = 300 - P.r * sin(a);
  // ⟨A pálya: szürke, szaggatott (6 px vonal, 6 px szünet)|The path: grey, dashed (6 px dash, 6 px gap)⟩
  circle(500, 300, P.r, {stroke: C.gray, dash: [6, 6]});
  // ⟨Csak akkor rajzolja a sugarat, ha a kapcsoló be van kapcsolva|Draws the radius only when the switch is on⟩
  if (P.ray) arrow(500, 300, x, y, {stroke: C.ink});
  // ⟨A mozgó pont: 16 px sugarú piros kör|The moving point: red circle of radius 16 px⟩
  circle(x, y, 16, {fill: C.red});
});`},
  {t: {hu: 'Saját fizika: update', en: 'Your own physics: update'},
   d: {hu: 'Az update(dt => { … }) sok kis lépésben fut; dt a lépés hossza (legfeljebb 1/240 s). A változók a szkript elején kapnak kezdőértéket, a lépésben a gyorsulásból sebességet, abból helyet számolsz. A show() kiírja, a plot() grafikonon mutatja az értéket.',
       en: 'update(dt => { … }) runs in many small steps; dt is the step length (at most 1/240 s). Variables get their starting values at the top of the script; each step turns acceleration into speed and speed into position. show() lists a value, plot() charts it.'},
   code: `// ⟨Húzóerő-csúszka: 0 … 3000 N, alapérték 1000 N, lépés 10 N|Pulling-force slider: 0 … 3000 N, default 1000 N, step 10 N⟩
param("F", {hu: "Húzóerő F", en: "Pulling force F"}, 0, 3000, 1000, 10, "N");
// ⟨Tömeg-csúszka: 500 … 2000 kg, alapérték 1000 kg|Mass slider: 500 … 2000 kg, default 1000 kg⟩
param("m", {hu: "Tömeg m", en: "Mass m"}, 500, 2000, 1000, 10, "kg");
// ⟨Gomb: a reset az egész szkriptet elölről futtatja (x és v újra 0)|Button: reset runs the whole script again (x and v back to 0)⟩
button({hu: "Újra", en: "Again"}, reset);

// ⟨Állapotváltozók: hely x (m) és sebesség v (m/s); let, mert változni fognak|State variables: position x (m) and speed v (m/s); let, because they will change⟩
let x = 0, v = 0;

// ⟨update: sok kis lépésben fut, dt = egy lépés hossza (s)|update: runs in many small steps, dt = length of one step (s)⟩
update(dt => {
  // ⟨Newton II. törvénye: a = F / m (m/s²)|Newton's second law: a = F / m (m/s²)⟩
  const a = P.F / P.m;
  // ⟨A sebesség nő: Δv = a · Δt|Speed grows: Δv = a · Δt⟩
  v += a * dt;
  // ⟨A hely nő: Δx = v · Δt|Position grows: Δx = v · Δt⟩
  x += v * dt;
  // ⟨38 m után elölről kezdi (ennyi fér ki a vásznon)|Starts over after 38 m (that is what fits on the canvas)⟩
  if (x > 38) { x = 0; v = 0; }
});

draw(t => {
  // ⟨Sraffozott talaj y = 420 px magasságban|Hatched ground at y = 420 px⟩
  ground(420);
  // ⟨Méterből képpont: 40 px-es bal margó + 22 px/m|Metres to pixels: 40 px left margin + 22 px per metre⟩
  const px = 40 + x * 22;
  // ⟨A kocsi: bal felső sarok (px; 360), 110 × 60 px, kék, lekerekített|The car: top-left corner (px; 360), 110 × 60 px, blue, rounded⟩
  rect(px, 360, 110, 60, {fill: C.blue, radius: 8});
  // ⟨Erővektor a kocsi elejéről: hossza F/15 px (1000 N → 67 px), felirat „F”|Force vector from the car's front: length F/15 px (1000 N → 67 px), label "F"⟩
  vector(px + 110, 390, P.F / 15, 0, {stroke: C.red, lw: 3}, "F");
  // ⟨Mért értékek a Vezérlők fülön: felirat, érték, egység|Readouts on the Controls tab: label, value, unit⟩
  show({hu: "Sebesség v", en: "Speed v"}, v, "m/s");
  show({hu: "Megtett út x", en: "Distance x"}, x, "m");
  // ⟨Élő grafikon a vászon alatt: a sebesség az idő függvényében|Live chart under the canvas: speed over time⟩
  plot({hu: "Sebesség v", en: "Speed v"}, v, {unit: "m/s"});
});`},
  {t: {hu: 'Fizikai világ: golyók', en: 'Physics world: balls'},
   d: {hu: 'A world() kész Newton-világot ad méterben, y felfelé: gravitáció, talaj, falak, ütközés. A ball() golyót tesz bele, a világ magától kirajzolódik. A wx() és wy() méterből képpontot számol.',
       en: 'world() gives you a ready Newtonian world in metres, y up: gravity, ground, walls, collisions. ball() adds a ball and the world draws itself. wx() and wy() turn metres into pixels.'},
   code: `// ⟨Visszapattanási szám: 0 = nem pattan vissza, 1 = teljesen rugalmas|Restitution: 0 = no bounce, 1 = fully elastic⟩
param("e", {hu: "Visszapattanás e", en: "Bounciness e"}, 0, 1, 0.8, 0.05, "");
// ⟨Gravitáció: 0 … 20 m/s², alapérték 9,81 (Föld)|Gravity: 0 … 20 m/s², default 9.81 (Earth)⟩
param("g", {hu: "Gravitáció g", en: "Gravity g"}, 0, 20, 9.81, 0.01, "m/s²");
button({hu: "Újra", en: "Again"}, reset);

// ⟨Fizikai világ: 50 px = 1 m, van talaj (y = 0 m) és két oldalfal|Physics world: 50 px = 1 m, with ground (y = 0 m) and two side walls⟩
const W = world({scale: 50, ground: true, walls: true});
// ⟨Első golyó: hely (2 m; 9 m), vízszintes sebesség 4 m/s, sugár 0,4 m, narancs, 80 pontos nyomvonal|First ball: position (2 m; 9 m), horizontal speed 4 m/s, radius 0.4 m, orange, 80-point trail⟩
const b = ball({x: 2, y: 9, vx: 4, r: 0.4, color: C.orange, trail: 80});
// ⟨Második golyó: (10 m; 5 m), sugár 0,6 m, tömeg 3 kg, kék – álló helyzetből esik|Second ball: (10 m; 5 m), radius 0.6 m, mass 3 kg, blue – falls from rest⟩
ball({x: 10, y: 5, r: 0.6, m: 3, color: C.blue});

update(dt => {
  // ⟨A csúszkák értéke menet közben átíródik a világba|Slider values are copied into the world while it runs⟩
  W.e = P.e;
  W.g = P.g;
});

draw(t => {
  // ⟨A talaj, a falak és a golyók kirajzolása|Draw the ground, the walls and the balls⟩
  drawWorld();
  // ⟨Sebességvektor: kezdőpont a golyó helye pixelben, hossza 10 px/(m/s); y-nál mínusz, mert a világban y felfelé nő|Velocity vector: starts at the ball's pixel position, 10 px per m/s; minus for y because y is up in the world⟩
  vector(wx(b.x), wy(b.y), b.vx * 10, -b.vy * 10, {stroke: C.ink}, "v");
  // ⟨Magasság: a középpont magassága mínusz a sugár = az alja|Height: centre height minus radius = its bottom⟩
  show({hu: "Magasság", en: "Height"}, b.y - b.r, "m");
  // ⟨Grafikon, a függőleges tengely 0-tól indul|Chart, the vertical axis starts at 0⟩
  plot({hu: "Magasság", en: "Height"}, b.y - b.r, {unit: "m", min: 0});
});`},
  {t: {hu: 'Rugó és rezgés', en: 'Spring and oscillation'},
   d: {hu: 'A link() rugót köt egy rögzített pont és egy golyó közé. A resetOn("m") miatt a tömeg változtatásakor újraindul, a rugóállandó menet közben is állítható.',
       en: 'link() ties a spring between a fixed point and a ball. resetOn("m") restarts the scene when the mass changes; the spring constant can change while it runs.'},
   code: `// ⟨Rugóállandó: 20 … 200 N/m|Spring constant: 20 … 200 N/m⟩
param("k", {hu: "Rugóállandó k", en: "Spring constant k"}, 20, 200, 40, 1, "N/m");
// ⟨Tömeg: 0,5 … 5 kg|Mass: 0.5 … 5 kg⟩
param("m", {hu: "Tömeg m", en: "Mass m"}, 0.5, 5, 1, 0.1, "kg");
// ⟨A tömeg változtatásakor újraindul (a golyó ezzel a tömeggel jön létre)|Restart when the mass changes (the ball is created with that mass)⟩
resetOn("m");

// ⟨Világ: 100 px = 1 m, az origó (a felfüggesztés) a vásznon (500; 70) px-nél, talaj nélkül|World: 100 px = 1 m, origin (suspension point) at (500; 70) px on the canvas, no ground⟩
const W = world({scale: 100, origin: [500, 70], ground: false});
// ⟨Golyó 2,6 m-rel a felfüggesztés alatt, sugár 0,22 m, tömeg P.m|Ball 2.6 m below the suspension point, radius 0.22 m, mass P.m⟩
const b = ball({x: 0, y: -2.6, r: 0.22, m: P.m, color: C.blue});
// ⟨Rugó a rögzített [0, 0] pont és a golyó között: k = P.k, nyugalmi hossz 2 m, kis csillapítás|Spring between the fixed point [0, 0] and the ball: k = P.k, rest length 2 m, light damping⟩
const s = link([0, 0], b, {k: P.k, len: 2, damping: 0.1});

// ⟨A rugóállandó menet közben is követi a csúszkát|The spring constant follows the slider while running⟩
update(dt => { s.k = P.k; });

draw(t => {
  // ⟨Az elméleti lengésidő a képletből|The theoretical period from the formula⟩
  show({hu: "Lengésidő T = 2π√(m/k)", en: "Period T = 2π√(m/k)"}, 2 * PI * sqrt(P.m / P.k), "s");
  // ⟨A golyó helyzete az idő függvényében: szinuszos görbe|Ball position over time: a sine curve⟩
  plot({hu: "Helyzet y", en: "Position y"}, b.y, {unit: "m"});
});`},
  {t: {hu: 'Képek és két nyelv', en: 'Pictures and two languages'},
   d: {hu: 'Tölts fel egy képet a Képek fülön „kep” néven, és az image() kirajzolja – forgatva, méretezve. Minden felirat lehet {hu: …, en: …} objektum; a HU/EN gomb választ közülük.',
       en: 'Upload a picture on the Images tab named “kep” and image() draws it, rotated and scaled. Any label can be a {hu: …, en: …} object; the HU/EN switch picks one.'},
   code: `// ⟨Cím két nyelven: a HU/EN gomb választ|Title in two languages: the HU/EN switch picks one⟩
title({hu: "Saját kép", en: "My picture"});
// ⟨Elforgatás 0 … 360 fok|Rotation 0 … 360 degrees⟩
param("a", {hu: "Elforgatás", en: "Rotation"}, 0, 360, 0, 1, "°");
// ⟨A kép szélessége 50 … 600 px (a magasság az oldalarányból jön)|Picture width 50 … 600 px (the height follows the aspect ratio)⟩
param("w", {hu: "Szélesség", en: "Width"}, 50, 600, 300, 1, "px");

draw(t => {
  // ⟨Kép: a Képek fülön feltöltött „kep”, középpontja (500; 300), szélesség P.w, elforgatás P.a fok|Picture: "kep" uploaded on the Images tab, centre (500; 300), width P.w, rotated by P.a degrees⟩
  image("kep", 500, 300, {w: P.w, angle: deg(P.a)});
  // ⟨Kétnyelvű felirat középre igazítva (x = 500, y = 560), szürke|Two-language label, centred (x = 500, y = 560), grey⟩
  text({hu: "Képek fül → tölts fel egy képet „kep” néven",
        en: "Images tab → upload a picture named “kep”"},
       500, 560, {size: 18, align: "center", color: C.gray});
  // ⟨tr() a mostani nyelvű szöveget adja, fmt() a számot a nyelv tizedesjelével (0 tizedes)|tr() gives the text in the current language, fmt() formats the number (0 decimals)⟩
  text(tr({hu: "Szög: ", en: "Angle: "}) + fmt(P.a, 0) + "°", 40, 90, {size: 20});
});`},
  {t: {hu: 'Billentyűzet', en: 'Keyboard'},
   d: {hu: 'A csúszka, a kapcsoló és a gomb billentyűt is kaphat ({keys: "q a"}, {key: "s"}). A key("ArrowLeft") igaz, amíg a billentyű nyomva van, az onKey() lenyomásonként egyszer fut. Telefonon ezekhez gombok jelennek meg a vásznon. Kód nélkül is: 1–9 kiválaszt egy csúszkát, a nyilak állítják.',
       en: 'A slider, a switch and a button can get keys too ({keys: "q a"}, {key: "s"}). key("ArrowLeft") is true while the key is held, onKey() runs once per press. On a phone these get buttons on the canvas. Without code too: 1–9 picks a slider, the arrows move it.'},
   code: `// ⟨Csúszka billentyűkkel: Q növeli, A csökkenti; nyomva tartva folyamatosan, Shift = 10× gyorsabb|Slider with keys: Q raises, A lowers it; smoothly while held, Shift = 10× faster⟩
param("v", {hu: "Sebesség", en: "Speed"}, 50, 600, 250, 10, "px/s", {keys: "q a"});
// ⟨Kapcsoló: a G billentyű ki-be kapcsolja|Switch: the G key turns it on and off⟩
toggle("grid", {hu: "Rács", en: "Grid"}, true, {key: "g"});

let x = 500, y = 300, color = C.blue;
const colors = [C.blue, C.red, C.green, C.orange];

// ⟨Lenyomásonként egyszer: a C billentyű színt vált; a label a telefonos gomb felirata|Once per press: the C key changes the colour; label is the text on the phone button⟩
onKey("c", () => { color = colors[(colors.indexOf(color) + 1) % colors.length]; }, {label: {hu: "Szín", en: "Colour"}, help: {hu: "szín váltása", en: "change the colour"}});

// ⟨{help}: leírás a billentyűlistában (⌨ gomb a vásznon, ? billentyű, Vezérlők fül)|{help}: text in the key list (⌨ button on the canvas, ? key, Controls tab)⟩
const MOVE = {help: {hu: "mozgatás", en: "move"}};

update(dt => {
  // ⟨key(): igaz, amíg nyomva van – a nyilak mozgatják a kört|key(): true while held – the arrow keys move the circle⟩
  if (key("ArrowLeft", MOVE)) x -= P.v * dt;
  if (key("ArrowRight", MOVE)) x += P.v * dt;
  if (key("ArrowUp", MOVE)) y -= P.v * dt;
  if (key("ArrowDown", MOVE)) y += P.v * dt;
  // ⟨A vásznon belül tartjuk|Keep it on the canvas⟩
  x = clamp(x, 40, 960); y = clamp(y, 40, 560);
});

draw(t => {
  if (P.grid) grid(50);
  circle(x, y, 40, {fill: color});
  text({hu: "Nyilak: mozgatás · C: szín · Q / A: sebesség · G: rács · P: szünet",
        en: "Arrows: move · C: colour · Q / A: speed · G: grid · P: pause"}, 500, 585, {size: 15, align: "center", color: C.gray});
});`},
];
const GUIDE_TIPS = {
  hu: ['Futtatás: <kbd>Ctrl</kbd>+<kbd>Enter</kbd> vagy a Futtatás gomb. A hibát pirossal, sorszámmal írja ki – kattints rá, és a hibás sorra ugrik.',
       'A P.név értékét a draw vagy update belsejében olvasd. Ha a szkript elején const-ba mented, a csúszka nem hat rá.',
       'A szögek radiánban vannak: rotate(deg(30)).',
       'A vásznon y lefelé nő; a fizikai világban (world) felfelé, méterben.',
       'Ne adj változónak beépített nevet (circle, C, P…) – ezt hibaként jelzi.',
       'Elrontottad? A felugró sáv Visszavonás gombja visszahozza az előző jelenetet.'],
  en: ['Run: <kbd>Ctrl</kbd>+<kbd>Enter</kbd> or the Run button. Errors show in red with a line number – click one to jump to that line.',
       'Read P.name inside draw or update. If you copy it into a const at the top of the script, the slider no longer affects it.',
       'Angles are in radians: rotate(deg(30)).',
       'On the canvas y grows downwards; in the physics world it grows upwards, in metres.',
       'Don’t name a variable after a built-in (circle, C, P…) – it is reported as an error.',
       'Broke something? The Undo button in the pop-up bar brings back the previous scene.'],
};
const guideCode = code => code.replace(/⟨([^|⟩]*)\|([^⟩]*)⟩/g, (m, hu, en) => (LANG === 'hu' ? hu : en));

function renderHelp() {
  const L = LANG === 'hu';
  let html = `<nav class="help-nav"><button type="button" class="link-btn" data-jump="ai">${L ? 'Kód írása AI-jal' : 'Writing code with AI'}</button> · <button type="button" class="link-btn" data-jump="guide">${L ? 'Útmutató' : 'Guide'}</button> · <button type="button" class="link-btn" data-jump="ref">${L ? 'Parancsok' : 'Command reference'}</button></nav>`;
  // Jelenet írása mesterséges intelligenciával: a beépített utasítások egy kattintással másolhatók
  // Writing a scene with an AI assistant: the built-in instructions can be copied with one click
  html += `<h3 id="help-ai">${L ? 'Kód írása AI segítségével' : 'Writing code with an AI assistant'}</h3>`;
  html += helpAiText(L);
  html += `<div class="lesson-btns"><button type="button" class="btn primary" data-ai="copy">${L ? 'AI-utasítások másolása' : 'Copy AI instructions'}</button><button type="button" class="btn" data-ai="save">${L ? 'Mentés fájlba (.md)' : 'Save as a file (.md)'}</button></div>`;
  html += `<textarea id="aiText" class="ai-text" readonly hidden></textarea>`;
  // Átvezetés az útmutatóhoz / lead-in to the guide
  html += `<p>${L ? 'Ha magad is szeretnél kódolni, itt van néhány gyakorlat, amit kipróbálhatsz.' : 'If you want to explore coding yourself, here are some exercises to try.'}</p>`;
  html += `<h3 id="help-guide">${L ? 'Útmutató 7 lépésben' : 'Guide in 7 steps'}</h3>`;
  html += `<p class="muted">${L ? 'Minden lépés egy kis, működő példa. A „Kipróbálom” betölti a Kód fülre – ott írd át, és futtasd újra.' : 'Each step is a small working example. “Try it” loads it into the Code tab – change it there and run it again.'}</p>`;
  GUIDE.forEach((s, i) => {
    html += `<section class="lesson"><h4><span class="num">${i + 1}</span>${esc(s.t[LANG])}</h4><p>${esc(s.d[LANG])}</p><pre>${esc(guideCode(s.code))}</pre><div class="lesson-btns"><button type="button" class="btn primary" data-try="${i}">${L ? 'Kipróbálom' : 'Try it'}</button><button type="button" class="btn" data-copyex="${i}">${L ? 'Másolás' : 'Copy'}</button></div></section>`;
  });
  html += `<h4>${L ? 'Ha valami nem megy' : 'When something goes wrong'}</h4><ul class="tips">${GUIDE_TIPS[LANG].map(x => `<li>${x}</li>`).join('')}</ul>`;
  html += `<h3 id="help-ref">${L ? 'Parancsok' : 'Command reference'}</h3>`;
  html += HELP.intro[LANG];
  for (const sec of HELP.sections) {
    html += `<h4>${esc(sec.t[LANG])}</h4><dl>`;
    for (const [sig, hu, en] of sec.items) html += `<dt><code>${esc(sig)}</code></dt><dd>${esc(LANG === 'hu' ? hu : en)}</dd>`;
    html += '</dl>';
  }
  html += HELP.keys[LANG];
  $('#help').innerHTML = html;
}

// A „Kód írása AI segítségével” szakasz szövege / text of the "Writing code with an AI assistant" section
function helpAiText(L) {
  return L
    ? `<p>Bármelyik ingyenes AI-csevegő (ChatGPT, Gemini, Copilot, Claude…) megírja a jelenetet, ha előbb elolvassa az AnimLab AI-utasításait. Ezek az alkalmazásba vannak építve, internet nélkül is elérhetők.</p><ol class="tips"><li>Nyomd meg az <b>AI-utasítások másolása</b> gombot.</li><li>Nyiss új csevegést az AI-alkalmazásban, és illeszd be első üzenetként.</li><li>Írd le, milyen animációt szeretnél: mit mutasson, milyen csúszkák, mért értékek és grafikonok legyenek, kinek szól.</li><li>A kapott kódot másold be: <b>Új</b> → <b>Kód</b> fül → Ctrl+Enter.</li><li>Ha hibát látsz, írd le az AI-nak, vagy másold be neki a piros hibaüzenetet a sorszámmal. Egyszerre egy változtatást kérj.</li></ol><p class="muted">Példa kérés:</p><pre>Készíts egy jelenetet Ohm törvényéről: telep, ellenállás és izzó sorosan. Csúszkák: U 0–24 V, R 1–100 Ω. Az izzó fényereje kövesse a teljesítményt, mozgó nyilak mutassák az áramot. Írd ki az I-t és a P-t, és rajzolj grafikont az áramról. Kapcsolási rajz szabványos jelekkel, 9. évfolyamnak.</pre><p class="muted">Ellenőrizd a képleteket és a kiírt értékeket egy kézzel kiszámolt példán, mielőtt órán használod.</p>`
    : `<p>Any free AI chat (ChatGPT, Gemini, Copilot, Claude…) can write a scene once it has read the AnimLab AI instructions. They are built into the app and work offline.</p><ol class="tips"><li>Press <b>Copy AI instructions</b>.</li><li>Start a new chat in the AI app and paste them as the first message.</li><li>Describe the animation: what it shows, which sliders, readouts and graphs, and who it is for.</li><li>Paste the code you get: <b>New</b> → <b>Code</b> tab → Ctrl+Enter.</li><li>If something is wrong, tell the AI what you see or paste the red error message with its line number. Ask for one change at a time.</li></ol><p class="muted">Example request:</p><pre>Make a scene about Ohm's law: battery, resistor and lamp in series. Sliders: U 0–24 V, R 1–100 Ω. The lamp's brightness follows its power and moving arrows show the current. Show I and P, and plot the current. Schematic with standard symbols, for 9th grade.</pre><p class="muted">Check the formulas and the readouts against a value you calculate by hand before you use the scene in class.</p>`;
}

