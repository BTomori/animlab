# AnimLab programozási útmutató

2026-11-03 · Tömöri Balázs Gergely

## 1. Bevezetés: hogyan működik egy AnimLab-jelenet

Az AnimLab-ban minden jelenet egy rövid JavaScript-program: ez a program hozza létre a csúszkákat, számolja a fizikát, és rajzolja meg a képet. Ez az útmutató lépésről lépésre bemutatja a program építőköveit, majd mind a 13 mintamodell kódját.

### A jelenet három része

1.  **A szkript eleje** – egyszer fut le, betöltéskor és minden újraindításkor (⟲ gomb vagy R billentyű). Itt hozod létre a csúszkákat (`param`), a kapcsolókat (`toggle`), és itt adsz kezdőértéket a változóknak (például `let omega = 0;`).

2.  **Az `update(dt => { … })` függvény** – a fizika. Nagyon sokszor fut, kis időlépésekben: a `dt` egy lépés hossza másodpercben, legfeljebb 1/240 s. Itt számolod ki, hogyan változnak a mennyiségek, például a szögsebesség a nyomatékból.

3.  **A `draw(t => { … })` függvény** – a rajzolás. Minden képkockán egyszer fut (másodpercenként kb. 60-szor), szünetben is. A `t` az eltelt szimulációs idő másodpercben.

A kettő szándékosan külön van. Az `update` csak számol, a `draw` csak rajzol abból, amit az `update` kiszámolt. Így a lassítás vagy a gép sebessége nem változtatja meg a fizikát.

### Koordináták

- **A vásznon:** képpontban (px) mérünk. Az alapméret 1000 × 600 px, ezt a `stage(1000, 600, "#fbfbf8")` sor állítja be. Az origó a **bal felső sarok**, az x jobbra, az y **lefelé** nő. A (500, 300) tehát a vászon közepe.

- **A fizikai világban** (`world`) méterben számolunk, és az y **felfelé** nő, ahogy a fizikaórán megszokott. A `wx(m)`, `wy(m)`, `ws(m)` függvények váltják át a métert képpontra.

- **3D-ben** az x jobbra, az y felfelé, a z a néző felé mutat. A `view3d` állítja, honnan nézzük a jelenetet.

- **A szögek mindig radiánban** vannak. Fokból a `deg(30)` vált át, radiánból fokba a `todeg(…)`.

### Idő és lassítás

A szimulációs idő a valódi idő és a **Sebesség** csúszka szorzata. A 0,1× azt jelenti, hogy 1 valódi másodperc alatt 0,1 s telik el a szimulációban. A 50 Hz-es váltakozó áramú példák 0,002×-es lassítással indulnak: így egy periódus (20 ms) a képernyőn 10 s alatt zajlik le. A kezdő lassítást a szkriptben a `timeScale(0.002)` sor adja meg.

### Hol mit találsz a felületen

| Fül      | Mire való                                                                           |
|----------|-------------------------------------------------------------------------------------|
| Vezérlők | A szkript csúszkái, kapcsolói, gombjai és a mért értékek (`show`)                   |
| Kód      | A jelenet programja; Ctrl+Enter vagy a Futtatás gomb indítja újra                   |
| Képek    | Feltöltött képek, a kódban `image("név", x, y)` rajzolja őket                       |
| Jelölők  | Egérrel rajzolt nyilak, hurkok, feliratok, és a kódban rajzolt nyilak testreszabása |
| Súgó     | Útmutató példákkal és a parancsok listája                                           |

### Fájlok

- **Mentés:** egy `.animlab.json` fájlba kerül a kód, a csúszkák állása, a képek és a jelölők. A **Megnyitás** ezt tölti vissza.

- **Exportálás → Önálló HTML-fájl:** egyetlen fájl, ami internet nélkül, bármely böngészőben megnyílik a jelenettel együtt. Ezt adhatod oda a tanulóknak.

- **Exportálás → Videó / PNG:** felvétel vagy állókép a vászonról, például diasorba.

## 2. JavaScript-alapok, amire szükség van

Az AnimLab-hoz a JavaScript nyelvnek csak egy kis része kell. Ha ezt a néhány szabályt megérted, minden mintamodellt el tudsz olvasni.

### Megjegyzés (komment)

A `//` után a sor végéig tartó szöveget a gép nem hajtja végre, csak az embernek szól. A mintapéldákban a megjegyzések magyarul és angolul is ott vannak, perjellel elválasztva: `// tekercsellenállás / winding resistance`.

### Változók

``` javascript
const r = 120;      // állandó: később nem változik (itt a forgórész sugara px-ben)
let omega = 0;      // változó: értéke módosulhat (itt a szögsebesség rad/s-ban)
omega = omega + 2;  // új érték: a régi + 2
omega += 2;         // ugyanez rövidebben
```

A tizedesjel a kódban mindig **pont**: `0.5`, nem `0,5`. A `1e-4` jelentése 1·10⁻⁴ = 0,0001 (például cm² → m² átváltás).

### Műveletek és matematikai függvények

- `+ - * /` az alapműveletek, `**` a hatvány: `x ** 2` = x².

- `sin(a)`, `cos(a)`, `tan(a)`, `sqrt(x)`, `abs(x)`, `min(a, b)`, `max(a, b)`, `sign(x)` (előjel: −1, 0 vagy 1), `PI` (π). Az AnimLab-ban ezek a `Math.` előtag nélkül is működnek.

- `clamp(v, a, b)` a `v` értéket az \[a; b\] tartományba szorítja.

### Függvények és nyílfüggvények

A függvény egy újrahasználható számítás. Kétféleképpen írható:

``` javascript
function teljesitmeny(U, I) {   // név és bemenő adatok (paraméterek)
  return U * I;                 // a függvény eredménye
}
const teljesitmeny2 = (U, I) => U * I;   // nyílfüggvény: ugyanez röviden
```

Az `update(dt => { … })` is egy nyílfüggvényt kap: a `dt =>` azt jelenti, hogy „a függvény bemenete a dt, a kapcsos zárójelben pedig az van, amit vele csinálunk”.

### Objektum és tömb

- **Objektum** = névvel ellátott adatok csomagja kapcsos zárójelben: `{fill: C.blue, lw: 3}`. A mintapéldákban így adjuk meg a stílust (kitöltés, vonalvastagság) és a kétnyelvű feliratot: `{hu: "Feszültség", en: "Voltage"}`. Egy elem elérése ponttal: `P.U` a P objektum U nevű eleme.

- **Tömb** = sorszámozott lista szögletes zárójelben: `[0, 120, 240]`. Elemei 0-tól számozódnak: `a[0]` az első. Egy pont gyakran kételemű tömb: `[x, y]`.

### Feltétel és ciklus

``` javascript
if (P.field) {                     // ha a kapcsoló be van kapcsolva…
  // …akkor ez fut le
} else {
  // …különben ez
}
for (let k = 0; k < 3; k++) {      // k = 0, 1, 2: háromszor fut, pl. a három fázisra
  // itt használható a k
}
const a = P.U > 0 ? 1 : -1;        // rövid feltétel: ha U > 0, akkor 1, különben −1
```

### Fok és radián

A szögfüggvények radiánt várnak: 360° = 2π rad, 180° = π rad. Az `rotate(deg(45))` 45 fokkal forgat, a `sin(deg(30))` értéke 0,5.

## 3. A jelenet építőkövei

Ez a fejezet a jelenet „vázát” adja: a vásznat, a kezelőszerveket, a fizikát és a kiírt értékeket. Minden mintamodell ugyanezekből a sorokból indul.

### Vászon, felirat, lassítás

``` javascript
stage(1000, 600, "#fbfbf8");   // vászon: szélesség 1000 px, magasság 600 px, háttérszín (hexa kód)
title({hu: "Egyenáramú motor", en: "DC motor"});   // cím a bal felső sarokban, nyelvenként
timeScale(0.1);                 // induláskor 0,1× sebesség (10× lassítás)
plotWindow(2);                  // a grafikonok az utolsó 2 s szimulációs időt mutatják
```

### Csúszka: `param`

``` javascript
param("U", {hu: "Tápfeszültség U", en: "Supply voltage U"}, -24, 24, 12, 0.5, "V");
```

| Helye         | Példa          | Jelentése                                        |
|---------------|----------------|--------------------------------------------------|
| 1\. azonosító | "U"            | Ezzel a névvel olvasod ki az értéket: `P.U`      |
| 2\. felirat   | {hu: …, en: …} | A csúszka neve a Vezérlők fülön, mindkét nyelven |
| 3\. minimum   | -24            | A legkisebb beállítható érték                    |
| 4\. maximum   | 24             | A legnagyobb beállítható érték                   |
| 5\. alapérték | 12             | Ezzel indul a jelenet                            |
| 6\. lépés     | 0.5            | Ennyivel változik egy „kattintásra”              |
| 7\. egység    | "V"            | A csúszka mellett megjelenő mértékegység         |

Fontos: a `P.U` értéket az `update` vagy a `draw` **belsejében** olvasd. Ha a szkript elején `const U = P.U;` sorral elmented, a csúszka mozgatása nem hat rá.

### Kapcsoló, lista, gomb

``` javascript
toggle("field", {hu: "Erővonalak", en: "Field lines"}, true);   // pipa; P.field értéke true vagy false
choice("conn", {hu: "Kapcsolás", en: "Connection"},
  [["Y", "Csillag"], ["D", "Delta"]], "Y");                     // legördülő lista: [érték, felirat] párok, alapérték "Y"
button({hu: "Polaritásváltás", en: "Reverse polarity"},
  () => setParam("U", -P.U));                                     // gomb: megnyomáskor U előjelet vált
resetOn("v0", "ang");     // ha ezek a csúszkák változnak, a jelenet elölről indul (kezdőfeltételekhez)
button({hu: "Újra", en: "Again"}, reset);   // a reset függvény elölről indítja a jelenetet
```

### Billentyűzet

A vezérlők billentyűt kaphatnak, a jelenet kódja figyelheti a billentyűket, és kód nélkül is minden jelenet állítható billentyűzetről.

``` javascript
param("F", {hu: "Motorerő F", en: "Motor force F"}, 0, 3000, 1200, 50, "N", {keys: "w s"});  // W növeli, S csökkenti F-et
toggle("air", {hu: "Légellenállás", en: "Air drag"}, true, {key: "l"});    // L ki-be kapcsolja
choice("conn", {hu: "Kapcsolás", en: "Connection"}, [["Y", "Y"], ["D", "Δ"]], "Y", {key: "c"});  // C: következő elem, Shift+C: előző
button({hu: "Újra", en: "Again"}, reset, {key: "Enter"});                 // az Enter megnyomja a gombot

onKey("m", () => { marker = x; }, {label: {hu: "Jelölő", en: "Marker"}});  // lenyomásonként egyszer fut (szünetben is)
update(dt => {
  if (key("ArrowRight")) x += 2 * dt;                                     // igaz, amíg a billentyű nyomva van
  if (key("ArrowLeft")) x -= 2 * dt;
});
```

- **Billentyű a csúszkán:** az első billentyű növeli, a második csökkenti az értéket. Egy koppintás egy lépés, nyomva tartva folyamatosan állít (10 másodperc alatt a teljes tartomány, vagy `{rate: 5}` egység másodpercenként), Shift-tel 10× gyorsabban. A Vezérlők fülön kis billentyűjel mutatja.
- **Billentyűnevek:** `"a"` … `"z"` (a kis- és nagybetű mindegy), `"0"` … `"9"`, `" "` (szóköz), `"ArrowLeft"`, `"ArrowRight"`, `"ArrowUp"`, `"ArrowDown"`, `"Enter"`, `"Shift"`; a `key(["a", "ArrowLeft"])` igaz, ha bármelyik nyomva van.
- **Telefon, táblagép:** a `key()` és `onKey()` billentyűi maguktól gombként jelennek meg a vásznon. A `label` a gomb felirata: `key(" ", {label: {hu: "Fék", en: "Brake"}})`.
- **Kód nélkül, minden jelenetnél:** az 1–9 kiválaszt egy csúszkát (a Vezérlők fülön kiemelve, a vásznon a neve látszik, csak-vászon módban is), a nyilak állítják; Shift = 10×, Esc vagy 0 = kész. A saját billentyű nélküli kapcsolókat a felső betűsor váltja a Vezérlők sorrendjében: Q, W, E, T, Z (angol kiosztáson Y), U, I, O; az R és a P kimarad, mert az újraindítás és a lejátszás billentyűje.
- **Billentyűlista:** a jelenet összes billentyűje a leírásával a vászon jobb felső sarkában lévő ⌨ gombbal vagy a ? billentyűvel nyílik meg, a Vezérlők fülön pedig egy összecsukható sor; amíg nincs megnyitva, nem foglal helyet. A vezérlők maguktól leírják magukat; a `key()` és `onKey()` billentyűihez `help` szöveget adj: `key("ArrowRight", {help: {hu: "előre", en: "forward"}})`.
- **Ütközések:** a program a Szóközt lejátszásra, az R-t újraindításra, a →-t léptetésre használja. Ha a jelenet lefoglalja valamelyiket, a jelenet nyer; a P mindig tartalék lejátszás / szünet. Saját vezérléshez a betűk (W/A/S/D) és a nyilak a legjobbak; egy `text` felirat a vásznon mondja meg, melyik billentyű mit csinál.

A **Kocsi nyilakkal** példa (Galéria gomb) és a Súgó fül **Billentyűzet** leckéje mindezt bemutatja.

### Fizika: `update`

``` javascript
let omega = 0, theta = 0;          // állapotváltozók: szögsebesség (rad/s) és szög (rad)
update(dt => {                     // dt: egy lépés hossza másodpercben (legfeljebb 1/240 s)
  const M = 0.2;                   // a motor nyomatéka (N·m) – itt állandónak vesszük
  omega += M / 0.01 * dt;          // Δω = (M / J) · Δt, J = 0,01 kg·m²
  theta += omega * dt;             // Δθ = ω · Δt
});
```

Ez az **Euler-módszer**: a gyorsulásból kis lépésekben sebességet, abból helyet számolunk. Kis `dt` mellett ez elég pontos. A mintamodellek ahol kell, egy lépésen belül még 10 kisebb lépést is tesznek (allépések).

### Rajzolás: `draw`

``` javascript
draw(t => {                        // t: az eltelt szimulációs idő (s)
  const x = 500 + 120 * cos(theta);   // a körív pontja: középpont 500, sugár 120 px
  const y = 300 - 120 * sin(theta);   // mínusz, mert a vásznon az y lefelé nő
  circle(x, y, 15, {fill: C.red});
});
```

### Mért értékek, grafikonok, közzétett értékek

``` javascript
show({hu: "Fordulatszám n", en: "Speed n"}, n, "1/min");      // sor a Mért értékek listában: felirat, érték, egység
show("cos φ", pf, "", 3);                                     // 4. argumentum: tizedesjegyek száma
plot({hu: "Áram I", en: "Current I"}, I, {unit: "A", color: C.orange});   // élő grafikon a vászon alatt
plot("i₁", i1, {unit: "A", group: "i"});                      // azonos group = közös sáv (pl. három fázisáram)
val({e, I, n});                                                // értékek a Jelölők fül számára (6. fejezet)
```

A `show`, `plot` és `val` sorokat a `draw` belsejébe írd, mert ott minden képkockán frissül az érték.

## 4. Rajzolás

Minden rajzoló parancs ugyanazt a mintát követi: előbb a hely és a méret képpontban, a végén egy stílus-objektum. A rajzoló parancsok a `draw` belsejében dolgoznak.

### Alapalakzatok

| Parancs                                  | Argumentumok                                  | Mit rajzol                                              |
|------------------------------------------|-----------------------------------------------|---------------------------------------------------------|
| `circle(x, y, r, stílus)`                | középpont x, y; sugár r                       | Kör                                                     |
| `rect(x, y, w, h, stílus)`               | bal felső sarok x, y; szélesség w; magasság h | Téglalap; `{radius: 8}` lekerekíti a sarkait            |
| `box(cx, cy, w, h, szög, stílus)`        | középpont; méret; elforgatás radiánban        | A középpontja körül elforgatott téglalap                |
| `ellipse(x, y, rx, ry, stílus, szög)`    | középpont; két féltengely                     | Ellipszis                                               |
| `line(x1, y1, x2, y2, stílus)`           | kezdő- és végpont                             | Szakasz                                                 |
| `polygon([[x, y], …], stílus)`           | csúcsok listája                               | Zárt sokszög (háromszög, lejtő)                         |
| `polyline([[x, y], …], stílus)`          | pontok listája                                | Nyitott törött vonal (vezeték, pálya)                   |
| `arc(x, y, r, a0, a1, stílus)`           | középpont; sugár; kezdő- és zárószög (rad)    | Körív, a vásznon az óramutató járásának megfelelően     |
| `spring(x1, y1, x2, y2, {coils, width})` | két végpont; menetszám; szélesség             | Rugó                                                    |
| `ground(y)` · `grid(50)`                 | a talaj magassága; a rács lépésköze           | Sraffozott talaj, háttérrács                            |
| `current(x, y, irány, r)`                | hely; irány (\>0 vagy \<0); sugár             | Áramirány: ⊙ kifelé (irány \> 0), ⊗ befelé (irány \< 0) |

### Stílus és színek

``` javascript
{fill: C.blue,      // kitöltőszín (zárt alakzatoknál)
 stroke: C.ink,     // körvonal- vagy vonalszín
 lw: 3,             // vonalvastagság px-ben
 dash: [6, 4],      // szaggatott vonal: 6 px vonal, 4 px szünet
 alpha: 0.5,        // átlátszóság: 0 = láthatatlan, 1 = teljesen fedett
 radius: 8}         // lekerekítés (csak rect)
```

Stílus helyett egyetlen szín is megadható, például `circle(100, 100, 30, "red")`. A beépített színek: `C.red`, `C.blue`, `C.green`, `C.orange`, `C.purple`, `C.teal`, `C.yellow`, `C.gray`, `C.ink` (sötét), `C.copper` (réz), `C.N` és `C.S` (mágnespólusok), `C.L1`, `C.L2`, `C.L3` (fázisszínek az IEC szerint: barna, fekete, szürke).

### Szöveg és kép

``` javascript
text("U = " + fmt(P.U, 1) + " V", 830, 530,   // szöveg, x, y (a szöveg alapvonala)
     {size: 16, color: C.ink, align: "center", bold: true});   // betűméret, szín, igazítás, félkövér
image("rotor", 500, 300, {w: 200, angle: deg(30), alpha: 1});  // feltöltött kép: név, középpont, szélesség, elforgatás
```

Az `fmt(érték, tizedesjegyek)` a számot a választott nyelv tizedesjelével írja ki (magyarul vesszővel). A képet előbb a Képek fülön kell feltölteni; a neve ott látható és átírható.

### Mozgatás és forgatás: `push`, `translate`, `rotate`, `pop`

``` javascript
push();                  // a koordináta-rendszer mentése
translate(200, 430);     // az origó átkerül a (200; 430) pontba
rotate(deg(45));         // a koordináta-rendszer 45°-kal elfordul (a vásznon az óramutató irányában)
rect(-40, -40, 80, 80);  // az új origó körüli 80×80-as négyzet → elforgatott négyzet
pop();                   // vissza az eredeti koordináta-rendszerhez
```

### Nyilak, vektorok, fázorok

``` javascript
arrow(100, 300, 250, 300, {stroke: C.red, lw: 3});           // nyíl a kezdőponttól a hegyéig
vector(x, y, dx, dy, {stroke: C.red, lw: 3}, "F");            // vektor: kezdőpont + elmozdulás, felirattal a hegynél
phasor(250, 335, 180, deg(90), {stroke: C.L1, lw: 3}, "U₁");  // hossz + szög (rad, 0 = jobbra, + = óramutatóval ellentétes)
```

A `vector` hosszát érdemes egy fizikai mennyiségből számolni, például `vector(x, y, 0, -F * 5, …)`: így 1 N erő 5 px hosszú nyilat ad, és a nyíl az erővel együtt nő. A mínusz jel felfelé mutató nyilat ad.

### Mozgó nyilak: áramlás és erővonal-hurok

``` javascript
flow([[100, 400], [300, 400], [300, 250]],   // törött vonal, rajta haladó nyílhegyekkel
     {speed: 60, spacing: 80, color: C.blue, lw: 3});   // sebesség px/s (negatív = visszafelé), nyílhegyek távolsága
fieldLoop(500, 300, 200, 80, 0, {speed: 60});   // ellipszis alakú erővonal: középpont, két féltengely, dölés, sebesség
```

Ha a sebesség időben változik (például az árammal arányos), használd a `pos` és `dir` mezőt. A `pos` a nyílhegyek eltolása, amit az `update`-ben integrálsz (`pos += v * dt`), a `dir` előjele pedig a nyílhegyek iránya. Így a nyilak nem ugrálnak.

### Az idő szerinti mozgás példája, soronként

``` javascript
draw(t => {
  // x = középpont + amplitúdó · sin(t):
  //   200 = a lengés KÖZÉPPONTJA (px), 100 = az AMPLITÚDÓ (px),
  //   t = idő (s), sin(t) –1 és +1 között változik → x 100 és 300 között leng, 2π ≈ 6,28 s-os periódussal
  const x = 200 + 100 * sin(t);
  circle(x, 220, 40, {fill: C.green});           // kör: középpont (x; 220), sugár 40 px, zöld kitöltés
  box(500, 430, 160, 50, t, {fill: C.purple});   // téglalap középpontja (500; 430), 160×50 px, elforgatás = t rad → 1 rad/s-mal forog
});
```

Gyorsabb lengéshez szorozd meg az időt: `sin(2 * PI * f * t)` pontosan f hertzes rezgést ad.

## 5. Fizikai világ, 3D, komplex számok, háromfázisú segédek

Ezek a kész „szerszámok” sok számolást lespórolnak: a fizikai világ magától mozgatja a testeket, a 3D réteg térbeli rajzot ad, a komplex számokkal pedig a váltakozó áramú képletek egy sorban leírhatók.

### Fizikai világ (Newton-mechanika)

``` javascript
const W = world({gravity: 9.81,      // nehézségi gyorsulás m/s² (0 = súly nélküli tér)
                 scale: 50,          // 50 px = 1 m
                 origin: [40, 560],  // a (0 m; 0 m) pont helye a vásznon, px
                 ground: true,       // van talaj y = 0 m-nél
                 walls: true,        // van bal és jobb fal
                 restitution: 0.75,  // visszapattanási szám: 1 = rugalmas, 0 = rugalmatlan
                 friction: 0.2});    // gurulási súrlódás a talajon
const b = ball({x: 2, y: 9,          // kezdőhely m-ben
                vx: 4, vy: 0,        // kezdősebesség m/s-ban
                r: 0.4, m: 1,        // sugár m-ben, tömeg kg-ban
                color: C.orange, trail: 80});   // szín, a nyomvonal hossza (pontok száma)
update(dt => { b.applyForce(0, 5); });   // további erő N-ban, minden lépésben újra meg kell adni
```

A világ minden lépésben kiszámolja a gyorsulást (a = F/m − g), a sebességet és a helyet, kezeli a talajt, a falakat és az ütközéseket. A test adatai olvashatók: `b.x`, `b.y`, `b.vx`, `b.vy`, `b.speed`, `b.onGround`. A `link(b1, b2, {k: 50})` rugót köt két test közé (vagy `link([0, 5], b, …)`: rögzített pont és test közé). A képátváltás: `wx(b.x)` és `wy(b.y)` adja a test helyét képpontban.

### 3D rajzolás

``` javascript
view3d({x: 480, y: 335,      // a 3D tér középpontja a vásznon, px
        scale: 82,           // 1 egység = 82 px
        yaw: deg(-38),       // elforgatás a függőleges tengely körül
        pitch: deg(20),      // dölés: pozitív = felülről nézzük
        dist: 16});          // perspektíva: kisebb = erősebb távlat
begin3();                                                 // innentől mélység szerint rendezett rajz
box3([-3.5, 0, 0], [1.3, 3.4, 4.0], {fill: C.N});         // téglatest: középpont [x, y, z], méret [sx, sy, sz]
wire3([[0, 0, -2.6], [0, 0, 2.9]], {color: "#9aa3b1", lw: 6});   // fényes cső (tengely, rúd, tekercs)
arrow3([0, 0, 0], [0, 1.7, 0], {stroke: C.purple, lw: 3});      // 3D nyíl
flow3(pontok, {pos: p, dir: 1, color: C.blue}, true);     // mozgó nyílhegyek egy 3D útvonalon (true = zárt)
text3("N", [-3.5, 2.4, 0], {size: 28, color: C.N});      // felirat egy 3D pontban
end3();                                                   // kirajzolás: a távoli elemek előbb, a közeliek rájuk
```

Segédfüggvények: `circle3(középpont, "x", r)` egy tengely körüli kör pontjait adja (például a kalicka véggyűrűje), `rot3(p, "z", szög)` egy pontot forgat el, `p3(p)` megadja, hová esik egy 3D pont a vásznon.

### Komplex számok a fázorokhoz

Váltakozó áramon a feszültséget és az áramot fázorral, vagyis komplex számmal írjuk le: a hossza az effektív érték, a szöge a fázisa.

``` javascript
const Z = complex(40, 30);              // Z = 40 + j30 Ω (R = 40 Ω, X = 30 Ω)
const U = cpolar(230.9, 0);             // Ū = 230,9 V ∠ 0° (hossz, szög)
const I = U.div(Z);                     // Ī = Ū / Z  →  4,62 A ∠ −36,9°
I.abs();  I.arg();                      // nagyság (A) és szög (rad)
const S = U.mul(I.conj());              // S = Ū·Ī* = P + jQ
```

Műveletek: `.add` (+), `.sub` (−), `.mul` (·), `.div` (/), `.scale(k)` (valós számmal szorzás), `.conj()` (konjugált), `.rot(a)` (elforgatás). Egy fázor pillanatértéke: u(t) = √2 · \|Ū\| · sin(ωt + φ).

### Háromfázisú segédek

``` javascript
const i = phases(10, th);            // [i₁, i₂, i₃] = 10·sin(th − k·120°), k = 0, 1, 2
const axes = [0, deg(120), deg(240)];  // a három tekercs tengelyének iránya
const B = fieldVec(i, axes);         // eredő mezővektor: {x, y, mag (nagyság), angle (szög)}
stator3(320, 320, {p: 1,             // állorész: középpont, póluspárok száma
                   i: i, imax: 10,   // a három áram és a csúcsérték (a halványuláshoz)
                   axes: axes});     // tekercstengelyek
```

A `stator3` a hornyokban ⊙/⊗ jellel mutatja az áram irányát; minél kisebb az áram, annál halványabb a jel. A `fieldVec` a három tekercs mezőjét vektorosan összeadja; szimmetrikus háromfázisú áramnál az eredő állandó nagyságú (1,5× egy fázisé) és egyenletesen forog.

## 6. A Jelölők fül

A Jelölők fülön kód írása nélkül rajzolhatsz nyilakat a vászonra, és átállíthatod a kód által rajzolt nyilakat is. Minden beállítás a jelenettel együtt mentődik.

### Egérrel rajzolt jelölők

| Eszköz         | Használat                                             | Mire jó                                         |
|----------------|-------------------------------------------------------|-------------------------------------------------|
| Nyíl           | Húzz a nyíl elejétől a hegyéig                        | Erő, feszültség, áram jelölése egy képen        |
| Erővonal-hurok | Húzz egy téglalapot                                   | Ellipszis alakú erővonal mozgó nyilakkal        |
| Áramút         | Kattints pontonként, dupla kattintás vagy Enter zárja | Áram egy vezetőben, rúdban                      |
| Felirat        | Kattints a helyére                                    | Betűjel vagy élő érték                          |
| Mozgatás       | Fogd meg és húzd                                      | Egy jelölő áthelyezése                          |
| Koordináta     | Kattints                                              | A pont x, y értéke a vágólapra kerül (a kódhoz) |

Minden jelölőnél állítható a szín, a vastagság, a mozgó nyilak sebessége (px/s, negatív = visszafelé) és a forgás (°/s). A forgás **síkban** a jelölőt egy pont körül forgatja, **tengely körül (3D)** pedig úgy, mintha a jelölő egy vízszintes tengely körül fordulna (például erővonal egy oldalnézeti forgórészképen). A forgáspontot a **Forgáspont** gombbal, a vászonra kattintva jelölöd ki.

### Változóhoz kötött jelölők

A jelenet a `draw`-ban a `val()` paranccsal teszi elérhetővé a változóit, például az egyenáramú motor: `val({e, I, M, n});`. A Jelölők fül kilistázza ezeket („Használható változók”), és a csúszkák értéke is elérhető `P.` előtaggal.

- **Hossz × (kifejezés):** a megrajzolt nyíl ennyiszeresére nyúlik. Az `e / max(abs(P.U), 1)` azt jelenti, hogy amikor az ellen-EMF eléri a tápfeszültséget, a nyíl éppen a megrajzolt hosszú; negatív értéknél a nyíl megfordul.

- **Áramlás × (kifejezés):** a mozgó nyilak sebessége szorzódik vele, például `I / 5`.

- **Felirat:** a kapcsos zárójelbe írt kifejezés értéke jelenik meg. Az `e = {e:1} V` egy tizedesre kerekítve írja ki az e-t, a `{P.U - e:1}` a kettő különbségét.

A hibás kifejezés mezője piros lesz, és a jelölő ilyenkor az eredeti méretében látszik.

### A kódban rajzolt nyilak testreszabása

A „Kódban rajzolt nyilak és jelölők” rész kilistázza mindazt, amit a jelenet kódja `arrow`, `vector`, `phasor`, `flow`, `fieldLoop`, `arrow3` vagy `flow3` paranccsal rajzol. Ha egy sor fölé viszed az egeret, az elem sárgán kiemelődik a vásznon. Minden elemnél beállítható:

- láthatóság (a pipa kikapcsolva elrejti),

- szín (↺ vissza az eredetire),

- vastagság × és hossz / méret × (szorzók),

- felirat (vektornál; üresen hagyva az eredeti marad, és itt is használható a `{…}` értékkiírás).

A kód ettől nem változik. Ha egy parancs többször is fut (például az összes erővonal-nyíl egy ciklusban), a stílusban megadott névvel egy sorba gyűjthetők: `arrow(x1, y1, x2, y2, {stroke: C.gray, id: "erővonal-nyíl"})`.

### Jelölőkből kód

A **Kód másolása** gomb a jelölőket JavaScript-sorokká alakítja, az **Áthelyezés a kódba** pedig be is írja őket a szkript végére egy új `draw` blokkban. Ez jó kiindulópont, ha egy egérrel elhelyezett nyilat később programból szeretnél mozgatni.

### Változóhoz kötött nyíl a kódban: `boundArrow`

A `boundArrow` olyan nyíl, amelynek minden beállítása egy helyen, a kódban van leírva, és a Jelölők fül pontosan ezeket mutatja. Ha a fülön átírsz egy értéket, az azonnal látszik a vásznon, és be is íródik a kód megfelelő sorába. Ha a kódban írod át, Futtatás után a fül frissül.

``` javascript
boundArrow("i-nyíl", {          // név: ezen a néven látszik a Jelölők fülön
  x: 500, y: 300,                // kezdőpont (px)
  angle: 0,                      // irány fokban: 0 = jobbra, 90 = fel, −90 = le
  length: "30 * i",              // hossz px-ben – kifejezés; negatív értéknél a nyíl megfordul
  width: "2 + abs(i)",           // vastagság px-ben – kifejezés
  color: "#2f6fd6",              // szín (színkötésnél: a szín az alsó határnál)
  colorBy: "abs(i)",             // a szín ettől függ (üres = fix szín)
  colorMin: 0, colorMax: 10,     // a színátmenet határai
  colorTo: "#d64045",            // szín a felső határnál
  label: "i = {i:1} A"           // felirat; {i:1} = i értéke egy tizedessel
});
```

A kifejezésekben a `val()`-lal közzétett változók (ehhez a `draw`-ban: `val({i});`) és a csúszkák `P.név` értékei használhatók. A sor a szkript tetejére kerül, a `draw`-on kívülre: egyszer kell leírni, a rajzolást a program végzi. A Jelölők fülön minden ilyen nyílhoz látszik a pillanatnyi hossz, vastagság és szín is; a **Mozgatás** eszközzel a kezdőpontja húzható, és az új x, y is beíródik a kódba. Az egérrel rajzolt nyilakat az **Áthelyezés a kódba** gomb `boundArrow` sorokká alakítja. Az egyenáramú motor, a szinkronmotor és az aszinkronmotor példája is így rajzolja a változó hosszú nyilait.

## 7. A mintamodellek részletes leírása

Mind a 13 mintamodell a Galéria gombbal tölthető be, és a Kód fülön soronként kommentezve olvasható. Minden modellnél ugyanaz a sorrend: mit mutat, milyen képleteken alapul, melyik csúszka mit jelent, hogyan épül fel a kód, és mit érdemes kipróbálni.

### 7.1 Egyenáramú motor

**Mit mutat:** egy N menetes tekercs forog két állandó mágnes között. A kétszegmenses kommutátor félfordulatonként megfordítja az áramot, ezért a nyomaték mindig egy irányba hajt. Látható a Lorentz-erő, a forgás iránya, az áramkör a teleppel, valamint a tápfeszültség (U) és az ellen-EMF (e) nyílja.

**A modell képletei** (θ a tekercs szöge, ω a szögsebessége):

``` latex
k = N \cdot B \cdot A \qquad e = k\,\omega\,|\cos\theta| \qquad I = \frac{U - e}{R} \qquad M = k\,I\,|\cos\theta|
```

``` latex
J\,\frac{d\omega}{dt} = M - M_t - b\,\omega
```

Az \|cos θ\| a kommutátor hatása: az áram előjele mindig úgy vált, hogy a nyomaték ne váltson irányt. Amikor a tekercs síkja merőleges az erővonalakra (θ = 90°), a nyomaték nulla: ez a holtpont, amin a forgórész a lendületével jut át.

| Csúszka         | Jelentés                   | Egység | Hatása                                                                  |
|-----------------|----------------------------|--------|-------------------------------------------------------------------------|
| U               | Tápfeszültség              | V      | Nagyobb U → nagyobb fordulatszám; előjelváltás → ellentétes forgás      |
| N               | Menetszám                  | –      | Nagyobb N → nagyobb k, kisebb üresjárási fordulatszám, nagyobb nyomaték |
| B               | Mágneses indukció          | T      | Mint N; az erővonalak sűrűsége is változik                              |
| A               | Tekercs felülete           | cm²    | Mint N                                                                  |
| R               | Tekercsellenállás          | Ω      | Az indítási áram U/R                                                    |
| Terhelőnyomaték | A tengelyt fékező nyomaték | N·m    | Nagyobb terhelés → kisebb fordulatszám, nagyobb áram                    |
| J               | Tehetetlenségi nyomaték    | kg·cm² | Nagyobb J → lassabb felpörgés                                           |

**A kód lépésről lépésre**

1.  A szkript eleje létrehozza a csúszkákat, a két kapcsolót (erővonalak, Lorentz-erők) és a Polaritásváltás gombot, ami a `setParam("U", -P.U)` sorral megfordítja U előjelét.

2.  Az állapotváltozók: `theta` (szög), `omega` (szögsebesség), valamint `I`, `e`, `M`, hogy a rajzolás is lássa őket.

3.  Az `update` minden lépésben kiszámolja k-t (a cm²-t `1e-4`-gyel m²-re váltva), az ellen-EMF-et, az áramot és a nyomatékot, majd a mozgásegyenletből az új szögsebességet és szöget. Ha a motor áll, és a nyomatéka nem győzi le a terhelést, állva marad (tapadás).

4.  A `draw` előbb az állorészt rajzolja (koszorú, N és S mágnes), aztán az erővonalakat, amelyek száma B-vel arányos.

5.  A tekercs két vezetőjének helye `cx + r·cos θ`, `cy − r·sin θ` (a mínusz a lefelé növő y miatt kell). Az áram irányát a `current` jel mutatja: a jobb oldali vezetőben kifelé (⊙), a balban befelé (⊗).

6.  A Lorentz-erő F = N·B·I·l, ahol l = √A a vezető hossza; a nyilak hossza 5 px/N, legfeljebb 150 px.

7.  A kommutátor két félgyűrűje (narancs és türkiz) a tekerccsel együtt forog, a kefék állnak; a színek mutatják, melyik vezető melyik szegmenshez tartozik.

8.  Végül a mért értékek (`show`), a grafikonok (`plot`: fordulatszám, áram, nyomaték) és a `val({e, I, M, n})` sor, amely a Jelölők fül számára teszi elérhetővé az értékeket. Ebből dolgozik az U- és e-nyíl a kapcsolási rajzon.

**Kipróbálható**

- Figyeld meg indításkor: az áram először nagy (U/R), majd ahogy nő a fordulatszám és vele az ellen-EMF, csökken. Az I·R = U − e felirat ezt számszerűen mutatja.

- Növeld a terhelőnyomatékot: a fordulatszám esik, az e-nyíl rövidül, az áram nő.

- Hasonlítsd össze a mért és az elméleti üresjárási fordulatszámot: n₀ = 4U / (πk) · 30/π.

### 7.2 Generátor (váltakozó / egyen)

**Mit mutat:** ugyanaz a tekercs, de most kívülről forgatjuk, és a mágneses térben feszültség indukálódik benne. Csúszógyűrűvel váltakozó feszültséget kapunk, kommutátorral lüktető egyenfeszültséget. Az izzó a teljesítménnyel arányosan világít.

``` latex
u = N\,B\,A\,\omega\,\cos\theta \qquad \hat U = N\,B\,A\,\omega \qquad U_{\mathrm{eff}} = \frac{\hat U}{\sqrt 2} \qquad i = \frac{u}{R_t}
```

| Csúszka / kapcsoló | Jelentés                                                   | Egység    |
|--------------------|------------------------------------------------------------|-----------|
| n                  | A forgatás fordulatszáma                                   | 1/min     |
| N, B, A            | Menetszám, indukció, felület                               | –, T, cm² |
| R                  | A terhelés (izzó) ellenállása                              | Ω         |
| Kommutátor         | Ki: csúszógyűrű, váltakozó feszültség; be: egyenirányított | –         |

**A kód**

1.  Az `update` a fordulatszámból számol szögsebességet (ω = n·π/30), növeli a szöget, és kiszámolja a tekercsben indukált feszültséget. Kommutátorral ennek abszolútértéke jut a terhelésre.

2.  A `draw` a motorhoz hasonlóan rajzolja az állorészt és a tekercset. A vezetők sebességét zöld v nyilak mutatják, az indukált áram irányát a v × B szabály adja (⊙/⊗).

3.  Az izzó fényereje `glow = p / 3`, ahol p = u·i a pillanatnyi teljesítmény; a sárga udvar átlátszósága ezzel változik.

4.  A grafikonon az u(t) és az i(t) látható: csúszógyűrűvel szinuszos, kommutátorral „félhullámok sorozata”.

**Kipróbálható:** kétszerezd meg a fordulatszámot – a csúcsfeszültség és a frekvencia is kétszeresére nő. Kapcsold be a kommutátort, és hasonlítsd össze a középértéket (2Û/π) az effektív értékkel (Û/√2).

### 7.3 Háromfázisú rendszer (csillag / delta)

**Mit mutat:** háromfázisú hálózat három impedanciával terhelve. Bal oldalon a forgó fázorábra, jobb oldalon a kapcsolási rajz a pillanatnyi áramok nyilaival, alul a feszültségek és áramok hullámformái.

``` latex
U_f = \frac{U_v}{\sqrt 3} \qquad \bar U_k = U_f \angle (-k \cdot 120^\circ) \qquad Z_k = R_k + jX \qquad \bar I = \frac{\bar U}{Z}
```

``` latex
\text{Csillag: } \bar I_N = \bar I_1 + \bar I_2 + \bar I_3 \qquad \text{Delta: } \bar I_1 = \bar I_{12} - \bar I_{31} \qquad S = \sum \bar U \bar I^{*} = P + jQ
```

| Csúszka / lista                    | Jelentés                                                              | Egység |
|------------------------------------|-----------------------------------------------------------------------|--------|
| Uᵥ                                 | Vonali feszültség                                                     | V      |
| f                                  | Frekvencia                                                            | Hz     |
| R₁, R₂, R₃                         | Fázisonkénti ellenállás (különböző érték = aszimmetrikus terhelés)    | Ω      |
| X                                  | Közös reaktancia 50 Hz-en: + induktív, − kapacitív; Xₗ ∝ f, X_C ∝ 1/f | Ω      |
| Kapcsolás                          | Csillag nullavezetővel vagy delta                                     | –      |
| Forgó fázorok, Vonali feszültségek | A fázorábra forog-e, látszódnak-e az U₁₂… fázorok                     | –      |

**A kód**

1.  A `solve()` függvény komplex számokkal számol: előbb az impedanciákat, a fázisfeszültségeket és a vonali feszültségeket (U₁₂ = U₁ − U₂) állítja elő, aztán a kapcsolástól függően az áramokat és a teljesítményt.

2.  Az `inst(z, th)` függvény egy fázorból pillanatértéket készít: √2·\|z\|·sin(ωt + φ). Ebből rajzolódnak a hullámformák.

3.  A `th` változó az ωt szög, amit az `update` integrál; így a frekvencia változtatásakor a hullám nem ugrik.

4.  A fázorábrán a feszültség és az áram külön léptékű (az áram szaggatott vonallal). Forgó módban minden fázor függőleges vetülete éppen a pillanatérték.

5.  A kapcsolási rajzon a piros nyilak hossza a pillanatnyi vonali árammal arányos, az irányuk az előjelével vált.

**Kipróbálható:** állíts be különböző R₁, R₂, R₃ értéket csillagkapcsolásban – megjelenik a nullavezető árama. Válts deltara: a vonali áram √3-szorosa a fázisáramnak. Tedd X-et negatívvá: az áram siet a feszültséghez képest, Q negatív lesz.

### 7.4 Forgó mágneses mező

**Mit mutat:** három, 120°-onként elhelyezett tekercsben háromfázisú áram folyik. Mindegyik tekercs a saját tengelye mentén lüktető mezőt kelt (B₁, B₂, B₃), de ezek vektori összege (B) állandó nagyságú és egyenletesen forog. A jobb oldali kis ábra az áramfázorokat mutatja.

``` latex
i_k = \hat I \sin(\omega t - k\cdot 120^\circ) \qquad \vec B = \vec B_1 + \vec B_2 + \vec B_3,\quad |\vec B| = 1{,}5\,\hat B \qquad n_s = \frac{60\,f}{p}
```

| Csúszka / kapcsoló               | Jelentés                                                        |
|----------------------------------|-----------------------------------------------------------------|
| f, Î                             | Frekvencia (Hz) és az áram csúcsértéke (A)                      |
| p                                | Póluspárok száma (1–3): több póluspárnál a mező lassabban forog |
| Fázissorrend-csere               | L2 és L3 felcserélése: a mező ellenkező irányba forog           |
| L3 fázis kiesése                 | Egyfázisú üzem: a mező nem forog, csak lüktet                   |
| Fázisonkénti mezővektorok, pálya | A B₁…B₃ vektorok, illetve az eredő végpontjának nyomvonala      |

**A kód**

1.  A `currentPhasors()` megadja a három áram csúcsértékét és fázisát. Fáziskiesésnél az 1. és 2. tekercs sorba kerül az U₁₂ vonali feszültségre, ezért i₁ = −i₂, i₃ = 0.

2.  A `stator3` rajzolja az állorészt a hornyokban az áramirányokkal; az áramok előjele szerint ⊙ vagy ⊗.

3.  A `fieldVec(i, axes)` a három áramot a tekercstengelyek irányában vektorként összeadja. Az eredmény szöge villamos szög; p póluspárnál a mechanikai szög ennek p-ed része, ezért rajzol a kód p darab nyilat.

4.  A nyomvonalat a nyíl végpontjának helyeiből gyűjti: ha a mező forog, kör lesz; fáziskiesésnél egyenes szakasz.

5.  A jobb oldali ábrán a három áramfázor forog; a függőleges vetületek (színes pontok) éppen az áramok pillanatértékei.

**Kipróbálható:** kövesd egy teljes perióduson át a B nyíl hosszát – nem változik. Kapcsold be az L3 kiesését, és nézd meg, miért nem indul egy háromfázisú motor egy fázisról. Állíts p = 2-t: a szinkron fordulatszám 3000-ről 1500 1/min-re csökken.

### 7.5 Aszinkron (kalickás) motor

**Mit mutat:** a forgó mező áramot indukál a kalicka rudaiban, és ez nyomatékot ad. A motor álló helyzetből indul, felpörög, majd a szinkron fordulatszámnál kicsit lassabban, s szlippel forog. Jobb oldalon az M(n) jelleggörbe a terhelés vonalával és a pillanatnyi munkaponttal.

**A modell:** a közelítő helyettesítő kapcsolás fázisonként, csillagkapcsolásban (a mágnesező ág a kapcsokon van).

``` latex
s = \frac{n_s - n}{n_s} \qquad \bar I_2' = \frac{\bar U_f}{\left(R_1 + \frac{R_2'}{s}\right) + jX} \qquad \bar I_m = \frac{\bar U_f}{jX_m} \qquad \bar I_1 = \bar I_2' + \bar I_m
```

``` latex
M = \frac{3\, I_2'^2\, R_2'}{s\,\omega_s} \qquad J\,\frac{d\omega}{dt} = M - M_t \qquad s_b = \frac{R_2'}{\sqrt{R_1^2 + X^2}} \qquad M_b = \frac{3\,U_f^2}{2\,\omega_s\left(R_1 + \sqrt{R_1^2 + X^2}\right)}
```

| Csúszka              | Jelentés                                                                      | Egység   |
|----------------------|-------------------------------------------------------------------------------|----------|
| U, f, p              | Vonali feszültség, frekvencia, póluspárok                                     | V, Hz, – |
| R₁, R₂'              | Állorész- és (állórészre redukált) forgórész-ellenállás                       | Ω        |
| X, Xₘ                | Szórási és mágnesező reaktancia 50 Hz-en (a frekvenciával arányosan változik) | Ω        |
| Mₜ, terhelés jellege | Terhelőnyomaték: állandó vagy ventilátor jellegű (∝ n²)                       | N·m      |
| J                    | Tehetetlenségi nyomaték                                                       | kg·m²    |
| Forgásirány-váltás   | L2 ↔ L3 csere                                                                 | –        |

**A kód**

1.  A `machine(w)` függvény egy adott forgórész-szögsebességnél kiszámolja a szlipet, a helyettesítő kapcsolás áramait (komplex számokkal) és a nyomatékot. A frekvenciával arányos reaktanciák miatt az U/f vezérlés is kipróbálható.

2.  A `loadTorque` adja a terhelőnyomatékot; álló motornál legfeljebb akkora, mint a motor nyomatéka, így a terhelés nem forgatja visszafelé a tengelyt.

3.  Az `update` egy lépésen belül 10 allépésben integrálja a mozgásegyenletet, és növeli a hálózat szögét (th).

4.  A `draw` az állorészben az I₁ áram pillanatértékeit mutatja. Három mezővektor látszik: B₁ az állorészáramé, Bδ a mágnesező áramé (légrésmező), B₂ = Bδ − B₁ a forgórészé.

5.  A kalicka rudjaiban az áram ott a legnagyobb (⊙), ahol a forgórész-mező tengelyétől 90°-kal előrébb járunk; a halványabb jel kisebb áramot jelent.

6.  Az M(n) görbe 121 ponton a `machine` függvényből készül, mellette a terhelés szaggatott vonala; a piros pont a munkapont.

7.  A `val(...)` sor teszi elérhetővé az E₂ = s·E₂₀ és az I₂' értékét a jobb alsó nyilaknak: felpörgés közben mindkettő rövidül.

**Kipróbálható:** nézd az indítási áramot az áramgrafikonon, és figyeld, hogyan csökken a névleges értékre. Növeld a terhelést a billenőnyomaték fölé: a motor lefékez. Csökkentsd a frekvenciát és a feszültséget arányosan (pl. 25 Hz, 200 V): a görbe balra tolódik, a billenőnyomaték nagyjából megmarad.

### 7.6 Szinkronmotor

**Mit mutat:** egyenárammal gerjesztett, hengeres forgórészű gép, amely pontosan a szinkron fordulatszámon forog. A terhelés növelésével a forgórész δ terhelési szöggel lemarad a hálózati mező mögött. Ha a terhelés meghaladja a billenőnyomatékot, a gép kiesik a szinkronizmusból. A fázorábra a gerjesztés hatását mutatja a teljesítménytényezőre.

``` latex
M = \frac{3\,U_f\,E_0}{\omega_s\,X_d}\sin\delta + D\,(\omega_s - \omega) \qquad \bar I = \frac{\bar U - \bar E_0}{jX_d} \qquad J\,\frac{d\omega}{dt} = M - M_t
```

Az első tag a szinkronozó nyomaték, a második a csillapító kalickáé: ez csak akkor hat, ha a forgórész eltér a szinkron fordulatszámtól, és lecsillapítja a lengéseket.

| Csúszka  | Jelentés                                                                                                              | Egység   |
|----------|-----------------------------------------------------------------------------------------------------------------------|----------|
| U, f, p  | Vonali feszültség, frekvencia, póluspárok                                                                             | V, Hz, – |
| E₀ / U_f | Gerjesztés: az indukált feszültség a fázisfeszültség hányszorosában (1 alatt alulgerjesztett, fölötte túlgerjesztett) | –        |
| X_d      | Szinkron reaktancia 50 Hz-en                                                                                          | Ω        |
| Mₜ       | Terhelőnyomaték                                                                                                       | N·m      |
| D        | A csillapító kalicka erőssége                                                                                         | N·m·s    |
| J        | Tehetetlenségi nyomaték                                                                                               | kg·m²    |

**A kód**

1.  A `model()` a csúszkákból kiszámolja a fázisfeszültséget, E₀-t, a reaktanciát és a billenőnyomatékot (M_max = 3·U_f·E₀ / (ω_s·X_d), δ = 90°-nál).

2.  Induláskor a forgórész már a szinkron fordulatszámon forog, a terheléshez illő δ₀ = arcsin(Mₜ / M_max) szöggel, így nincs indítási lengés.

3.  A `loadAngle()` a hálózati mező és a forgórész É-i pólusának szögkülönbsége villamos szögben (δ = ωt − π − p·θ_m), −π és π közé hozva.

4.  Az `update` 10 allépésben integrálja a mozgásegyenletet. Ha a terhelést hirtelen változtatod, δ lengésbe jön, és a csillapítás fokozatosan beállítja.

5.  A `draw` a fázorokkal számol: Ū = U_f∠0, Ē₀ = E₀∠−δ, Ī = (Ū − Ē₀)/(jX). A forgórészen 2p pólus látszik (N = északi, piros; S = déli, kék), a szaggatott piros vonal a hálózati mező tengelye, köztük a δ ív.

6.  A mezővektorok: B₁ az állorészáramé, B₂ a gerjesztésé (a forgórész tengelyében), Bδ = B₁ + B₂ az eredő.

7.  A Jelölők fül nyilai a `val({M, Mmax, ML, …})` értékeiből rajzolják az M és Mₜ nyomatéknyílat közös skálán.

**Kipróbálható:** emeld a terhelést lépésenként, és figyeld a δ grafikonon a lengést és a beállást. Lépd túl M_max-ot: δ fűrészfog alakban fut, a gép kiesett. Változtasd a gerjesztést 0,8 és 1,4 között: a jelleg induktívról kapacitívra vált (ez a fázisjavító szinkronmotor elve).

### 7.7 3D: forgó vezetőkeret mágneses térben

**Mit mutat:** egy téglalap alakú vezetőkeret forog az N és S pólus között, térbeli nézetben. A keret oldalaiban az indukált áram irányát mozgó kék nyilak mutatják, a lila nyíl a keret normálvektora, a zöld az oldal sebessége.

``` latex
\Phi = B\,A\cos\alpha\ (\alpha = \theta + 90^\circ) \qquad u = -N\,\frac{d\Phi}{dt} = N\,B\,A\,\omega\cos\theta
```

| Csúszka                  | Jelentés                                                     |
|--------------------------|--------------------------------------------------------------|
| n, B, N, A               | Fordulatszám (1/min), indukció (T), menetszám, felület (cm²) |
| Nézet: elforgatás, dölés | A 3D kamera iránya fokban                                    |

**A kód**

1.  A 3D tengelyek: x jobbra (az erővonalak iránya), y felfelé, z a forgástengely. A `view3d` a nézetet, a `begin3`…`end3` a takarást (mélység szerinti rendezés) intézi.

2.  A pólusok `box3` téglatestek; az erővonalak egyenes `path3` vonalak, rajtuk `flow3` mozgó nyilakkal.

3.  A keret négy sarka `[a·cos θ, a·sin θ, ±L]` és az ellentétes oldal: θ növelésével a keret a z tengely körül fordul. A `wire3` fényes csőként rajzolja.

4.  Az indukált áram irányát a v × B szabály adja: az „A” oldalon −z irányú, ha cos θ \> 0. A nyilak eltolását (`curPos`) az `update` integrálja, a nyilak átlátszósága \|cos θ\|-val arányos.

5.  A grafikonon Φ(t) és u(t) egymás alatt: jól látszik a 90°-os eltérés.

**Kipróbálható:** állítsd meg ott, ahol a fluxus maximális – ott a feszültség nulla, mert az oldalak éppen párhuzamosan mozognak az erővonalakkal. Forgasd el a nézetet, hogy a keretet felülről is lásd.

### 7.8 3D: kalickás forgórész forgó mezőben

**Mit mutat:** kalickás forgórész (rúdak és rövidrezáró gyűrűk), körülötte a három nyereg alakú állorész-tekercs, és a forgó mező erővonalai. A rudakon a kék nyíl hossza az árammal, a lila nyíl hossza az indukált feszültséggel arányos.

``` latex
e \propto s\cos(\beta - \varphi) \qquad i = \frac{e}{Z_2},\quad Z_2 = R_2 + j\,s\,X_2 \qquad \varphi_2 = \operatorname{arctg}\frac{s\,X_2}{R_2}
```

Az e a rudak feszültsége (β a rúd szöge, φ a mező iránya), az i az áram, amely φ₂ szöggel késik: ezért a kék és a lila nyilak mintázata kissé elcsúszik egymáshoz képest.

| Csúszka / lista  | Jelentés                                                               |
|------------------|------------------------------------------------------------------------|
| f                | A táplálás frekvenciája (Hz)                                           |
| s                | Szlip: 0 = a forgórész együtt forog a mezővel, 1 = áll                 |
| X₂ / R₂          | A forgórész reaktanciájának és ellenállásának aránya álló forgórésznél |
| Nyilak a rudakon | Feszültség és áram, csak az egyik, vagy egyik sem                      |
| Nézet, kapcsolók | Kamera; tekercsek és erővonalak láthatósága                            |

**A kód**

1.  Az `update` két szöget léptet: a mezőét (`th`, ωt) és a forgórészét (`thr`), amely (1 − s)-szer lassabban forog.

2.  A `fieldAngle()` a három fázisáramból a `fieldVec` segítségével adja a mező irányát a keresztmetszetben.

3.  A `barValues(j)` egy rúdra kiszámolja a feszültséget és az áramot (−1 … 1). A `draw` ebből `arrow3` nyilat rajzol a rúd közepére: a hossza ±1,45 egység szorozva az értékkel, az iránya az előjel.

4.  Az erővonalak két keresztmetszetben zárt hurkok: a forgórészen át a mező irányában haladnak, és kívül térnek vissza. Az N és S (északi és déli pólus) felirat a mezővel együtt forog.

5.  Az állorész-tekercsek nyereg alakúak: a menőoldal a tekercstengelytől 90°-kal előrébb van, a végek körívek. Bennük mozgó nyilak mutatják a fázisáramot.

**Kipróbálható:** állítsd a szlipet 0-ra: a rudakon minden nyíl eltűnik, mert a mező nem halad el a rudak mellett – ezért nem érheti el az aszinkron motor a szinkron fordulatszámot. Növeld az X₂/R₂ arányt nagy szlipnél: az áram egyre jobban késik a feszültséghez képest.

### 7.9 Ferde hajítás

**Mit mutat:** egy labdát v₀ sebességgel, α szögben elhajítunk h magasságból. Látszik a pálya, a sebességvektor és két összetevője, valamint a légellenállás nélküli elméleti parabola.

``` latex
x = v_0\cos\alpha\cdot t \qquad y = h + v_0\sin\alpha\cdot t - \frac{g\,t^2}{2} \qquad \vec F_{\text{lég}} = -k\,m\,|\vec v|\,\vec v
```

| Csúszka  | Jelentés                                       | Egység    |
|----------|------------------------------------------------|-----------|
| v₀, α, h | Kezdősebesség, hajítási szög, kezdőmagasság    | m/s, °, m |
| g        | Nehézségi gyorsulás (Földön 9,81, Holdon 1,62) | m/s²      |
| k        | Légellenállási tényező                         | 1/m       |
| e        | Visszapattanási szám a talajon                 | –         |

**A kód**

1.  A `world` méterben számoló világot hoz létre (20 px = 1 m), a `ball` a labdát a kezdősebesség összetevőivel: vₓ = v₀·cos α, vᵧ = v₀·sin α.

2.  A `resetOn("v0", "ang", "h", "g")` miatt ezek változtatásakor a hajítás újraindul, mert kezdőfeltételek.

3.  Az `update` a légellenállást `applyForce`-szal adja hozzá, feljegyzi a legnagyobb magasságot, és az első földet éréskor a hajítás távolságát.

4.  A `draw` megrajzolja a tengelybeosztást, a szaggatott elméleti parabolát, a hajítószerkezetet (`push`/`rotate`), aztán a világot és a három sebességvektort (6 px/(m/s)).

**Kipróbálható:** keresd meg, melyik szögnél a legnagyobb a távolság (h = 0-nál 45°). Kapcsolj be légellenállást: a pálya elválik a parabolától, az optimális szög kisebb lesz.

### 7.10 Lejtő súrlódással

**Mit mutat:** egy hasáb a lejtőn. Látható a nehézségi erő (mg), a nyomóerő (N), a súrlódási erő (Fs) és az mg két összetevője.

``` latex
F_\parallel = m\,g\sin\alpha \qquad N = m\,g\cos\alpha \qquad F_s = \mu N \qquad a = g\,(\sin\alpha - \mu\cos\alpha)\ \text{ha}\ \operatorname{tg}\alpha > \mu
```

| Csúszka | Jelentés             | Egység |
|---------|----------------------|--------|
| α       | Hajlásszög           | °      |
| μ       | Súrlódási együttható | –      |
| m       | Tömeg                | kg     |
| g       | Nehézségi gyorsulás  | m/s²   |

**A kód**

1.  Az `update` kiszámolja a lejtő irányú erőt, a nyomóerőt és a súrlódást. A test akkor mozog, ha már csúzik, vagy ha tg α \> μ; különben a tapadási súrlódás állva tartja.

2.  A `draw` a lejtőt úgy méretezi, hogy minden szögnél elférjen. A test helyét a lejtő mentén mért s útból számolja, és `box`-szal −α szögben elforgatva rajzolja.

3.  Az erővektorok léptéke úgy van megválasztva, hogy az mg mindig 110 px hosszú legyen; a többi erő ehhez képest arányos. Így a tömeg változtatása a rajzot nem, csak a számokat változtatja – és látszik, hogy a gyorsulás független a tömegtől.

**Kipróbálható:** μ = 0,25 mellett keresd meg azt a szöget, ahol a test éppen megindul (tg α = μ → α ≈ 14°).

### 7.11 Ütközés (lendület, energia)

**Mit mutat:** két golyó egyenes ütközése súrlódásmentes pályán, alul a lendület és a mozgási energia oszlopdiagramjával.

``` latex
m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2' \qquad e = \frac{v_2' - v_1'}{v_1 - v_2} \qquad v_1' = \frac{m_1 v_1 + m_2 v_2 - m_2\,e\,(v_1 - v_2)}{m_1 + m_2}
```

| Csúszka | Jelentés                                                 | Egység |
|---------|----------------------------------------------------------|--------|
| m₁, m₂  | A két golyó tömege                                       | kg     |
| v₁, v₂  | Kezdősebesség (negatív = balra)                          | m/s    |
| e       | Ütközési szám: 1 = rugalmas, 0 = tökéletesen rugalmatlan | –      |

**A kód:** a `world` itt gravitáció és talaj nélkül működik; a két `ball` sugara a tömeg köbgyökével arányos. Az ütközést a világ számolja (lendületmegmaradás + ütközési szám). A `bar()` függvény egy vízszintes oszlopot rajzol egy értékhez; a Mért értékek között az elméleti v₁' és v₂' is ott van, össze lehet vetni a szimulációval.

**Kipróbálható:** e = 1 mellett ΣE állandó; e = 0 mellett a golyók együtt haladnak tovább, és az energia egy része elvész, a lendület viszont mindkét esetben megmarad.

### 7.12 Matematikai inga

**Mit mutat:** fonálon függő test lengése, mellette szürkével a kis kitérésű közelítés. Látszik az mg és a visszaérítő összetevője (mg·sin θ), valamint a sebesség.

``` latex
\ddot\theta = -\frac{g}{L}\sin\theta - c\,\dot\theta \qquad T_0 = 2\pi\sqrt{\frac{L}{g}}
```

| Csúszka | Jelentés            | Egység |
|---------|---------------------|--------|
| L       | Fonálhossz          | m      |
| θ₀      | Kezdeti kitérés     | °      |
| g       | Nehézségi gyorsulás | m/s²   |
| c       | Csillapítás         | 1/s    |

**A kód:** az `update` a mozgásegyenletet integrálja (a sin θ miatt nagy kitérésnél is pontos), és a nullaátmenetekből méri a lengésidőt. A `draw` a test helyét (L·sin θ; L·cos θ) alapján rajzolja, a szürke „szellem” pedig a θ₀·cos(√(g/L)·t) közelítést követi.

**Kipróbálható:** 10°-nál a két inga együtt mozog; 90° fölött a valódi inga egyre jobban lemarad – a mért lengésidő nagyobb, mint T₀. A fonál négyszerezése a lengésidőt kétszerezi.

### 7.13 Sablon: alakzatok, képek, fizika

**Mit mutat:** egy üres kiinduló jelenet minden alapelemmel: kör, téglalap, forgó hasáb, nyíl, háromszög, mozgó rugó, egy feltölthető kép helye („kep” néven) és pattogó labdák a fizikai világban.

**A kód:** két csúszka (forgási sebesség, gravitáció) és egy gomb. Az `update` növeli a forgási szöget, és menet közben átírja a világ gravitációját (`W.g = P.grav`). A `draw` sorban megrajzolja az alakzatokat, a képet és a világot, majd kiírja az első labda magasságát.

**Kipróbálható:** tölts fel egy képet a Képek fülön, nevezd „kep”-nek, és nézd, ahogy forog. Ebből a sablonból érdemes saját jelenetet kezdeni (Galéria → Sablon). Az Új gomb egy rövidebb, üres jelenetet ad.

## 8. Gyakori hibák és gyorsreferencia

Ha a jelenet nem azt csinálja, amit vársz, a legtöbbször az alábbi hibák egyike az ok. A hibát a program pirossal, sorszámmal írja ki; rákattintva a Kód fül a hibás sorra ugrik.

| Tünet                                           | Ok                                                                   | Megoldás                                                                     |
|-------------------------------------------------|----------------------------------------------------------------------|------------------------------------------------------------------------------|
| „Identifier 'circle' has already been declared” | Egy változónak beépített nevet adtál (circle, C, P, phases…)         | Nevezd át a változót, pl. `kor`, `cx0`                                       |
| „… is not defined”                              | Elírt név, vagy a változó egy másik függvény belsejében létezik csak | Ellenőrizd a betűket; a közös változót a szkript elején hozd létre `let`-tel |
| „Unexpected token”                              | Hiányzó vagy fölösleges zárójel, vessző                              | Nézd meg a jelzett sort és az előtte lévőt                                   |
| A csúszka mozgatása nem hat                     | A `P.x` értéket a szkript elején mentetted el                        | A `P.x`-et az `update`/`draw` belsejében olvasd                              |
| A csúszka nem a kódban írt alapértéken áll      | A program megjegyzi a legutóbbi állást                               | „Csúszkák alapértékre” gomb a Vezérlők fülön                                 |
| Az alakzat 57-szer gyorsabban forog             | Fokot adtál meg radián helyett                                       | `rotate(deg(30))`                                                            |
| Az alakzat fejjel lefelé mozog                  | A vásznon az y lefelé nő                                             | Felfelé mozgáshoz vond ki: `y = 300 - …`                                     |
| A mozgás akadós vagy túl gyors                  | A valódi jelenség túl gyors (pl. 50 Hz)                              | Állítsd a Sebesség csúszkát, vagy írd a szkriptbe: `timeScale(0.002)`        |
| A grafikon üres                                 | A `plot` az `update`-ben vagy egy `if` mögött van                    | A `plot`-ot a `draw`-ba írd, feltétel nélkül                                 |

### Gyorsreferencia

| Terület        | Parancsok                                                                                                                                                 |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Jelenet        | `stage` · `title` · `timeScale` · `plotWindow`                                                                                                            |
| Kezelőszervek  | `param` · `toggle` · `choice` · `button` · `setParam` · `resetOn` · `reset`                                                                               |
| Billentyűzet   | `{keys: "q a"}` · `{key: "s"}` · `key(név)` · `onKey(név, fn, {label})` · 1–9 + nyilak                                                                    |
| Működés        | `update(dt => …)` · `draw(t => …)`                                                                                                                        |
| Kiírás         | `show` · `plot` · `val` · `fmt` · `tr`                                                                                                                    |
| Alakzatok      | `circle` · `rect` · `box` · `ellipse` · `line` · `polyline` · `polygon` · `arc` · `spring` · `ground` · `grid` · `ring`                                   |
| Szöveg, kép    | `text` · `image`                                                                                                                                          |
| Nyilak         | `arrow` · `vector` · `phasor` · `current` · `flow` · `fieldLoop`                                                                                          |
| Transzformáció | `push` · `translate` · `rotate` · `scale` · `pop`                                                                                                         |
| Fizikai világ  | `world` · `ball` · `link` · `applyForce` · `drawWorld` · `wx` · `wy` · `ws`                                                                               |
| 3D             | `view3d` · `begin3` · `end3` · `wire3` · `path3` · `arrow3` · `flow3` · `box3` · `face3` · `text3` · `circle3` · `rot3` · `p3`                            |
| Váltakozó áram | `complex` · `cpolar` · `phases` · `fieldVec` · `stator3` · `wrap`                                                                                         |
| Matematika     | `sin` `cos` `tan` `atan2` `sqrt` `cbrt` `abs` `pow` `exp` `log` `hypot` `min` `max` `sign` `round` `floor` `ceil` `clamp` `lerp` `mod` `deg` `todeg` `PI` |

A Súgó fülön minden parancs leírása megtalálható mindkét nyelven, az Útmutató rész nyolc lépése pedig a **Kipróbálom** gombbal azonnal betölthető.

## 9. Jelenet írása AI segítségével

Bármelyik ingyenes AI-csevegő (ChatGPT, Gemini, Copilot, Claude…) megírja a jelenetet, ha előbb elolvassa az AnimLab AI-utasításait. Az utasítások be vannak építve az alkalmazásba, és a GitHub-tárolóban is megvannak (`docs/animlab-ai-instructions.md`).

1.  AnimLab: **Súgó** fül → **Kód írása AI segítségével** → **AI-utasítások másolása**.

2.  Nyiss új csevegést az AI-alkalmazásban, és illeszd be első üzenetként.

3.  Írd le, milyen animációt szeretnél: mit mutasson, milyen csúszkák, mért értékek és grafikonok legyenek, kinek szól.

4.  A kapott kódot másold be: **Új** → **Kód** fül → Ctrl+Enter.

5.  Ha hibát látsz, írd le az AI-nak, vagy másold be neki a piros hibaüzenetet a sorszámmal. Egyszerre egy változtatást kérj.

Példa kérés:

> Készíts egy jelenetet Ohm törvényéről: telep, ellenállás és izzó sorosan. Csúszkák: U 0–24 V, R 1–100 Ω. Az izzó fényereje kövesse a teljesítményt, mozgó nyilak mutassák az áramot. Írd ki az I-t és a P-t, és rajzolj grafikont az áramról. Kapcsolási rajz szabványos jelekkel, 9. évfolyamnak.

Nevezd meg a fizikai modellt (ideális vagy veszteséges), a mértékegységeket és a tartományokat. Ellenőrizd a képleteket és a kiírt értékeket egy kézzel kiszámolt példán, mielőtt órán használod. Az utasításokat 2026. november 3-án a Gemini 3.5 Flash-Lite ingyenes változatával teszteltük; az eredmények a tároló `tests` mappájában vannak.
