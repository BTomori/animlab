# AnimLab Programming Guide

2026-11-03 · Tömöri Balázs Gergely

## 1. Introduction

Every AnimLab scene is a short JavaScript program. The program creates the sliders, computes the physics and draws the picture. This guide shows the building blocks one by one; every example can be pasted into the Code tab and run with Ctrl+Enter.

### The three parts of a scene

1.  **The top of the script** runs once: when the scene loads and on every restart (⟲ button or the R key). Create sliders (`param`) and switches (`toggle`) here, and give your state variables their starting values (`let omega = 0;`).

2.  **`update(dt => { … })`** is the physics. It runs many times per second in small time steps; `dt` is the step length in seconds (at most 1/240 s). Compute how quantities change here, for example the angular speed from the torque.

3.  **`draw(t => { … })`** is the drawing. It runs once per frame (about 60 times per second), even while paused. `t` is the elapsed simulation time in seconds.

The two are separate on purpose: `update` only calculates, `draw` only draws what `update` calculated. Slow motion or a slow computer therefore never changes the physics.

### Coordinates

- **On the canvas** everything is in pixels. The default size is 1000 × 600 px, set by `stage(1000, 600, "#fbfbf8")`. The origin is the **top-left corner**; x grows to the right and y grows **downwards**, so (500, 300) is the centre.

- **In the physics world** (`world`) you work in metres and y grows **upwards**, as in a physics lesson. `wx(m)`, `wy(m)` and `ws(m)` convert metres to pixels.

- **In 3D** x points right, y up and z towards the viewer. `view3d` sets the viewpoint.

- **Angles are always in radians.** `deg(30)` converts degrees to radians, `todeg(…)` converts back.

### Time and slow motion

Simulation time is real time multiplied by the **Speed** slider. At 0.1×, one real second shows 0.1 s of simulation. The 50 Hz AC examples start at 0.002×, so one 20 ms period takes 10 s on screen. A script sets its starting speed with `timeScale(0.002)`.

### The screen

| Tab      | What it is for                                                                                      |
|----------|-----------------------------------------------------------------------------------------------------|
| Controls | The script's sliders, switches, buttons and readouts (`show`)                                       |
| Code     | The scene program; Ctrl+Enter or the Run button restarts it                                         |
| Images   | Uploaded pictures; `image("name", x, y)` draws them                                                 |
| Markup   | Arrows, field loops and labels drawn with the mouse, and customisation of the arrows the code draws |
| Help     | Lessons with examples and the list of commands                                                      |

The toolbar holds **New**, **Open**, **Save** and **Export**, the example list, and the play, step, restart and full-screen buttons. The HU/EN switch changes the language of the whole interface and of every scene label.

## 2. Your first scene

The scene below is a ball swinging left and right with a speed slider. Choose **New**, delete the template on the Code tab, paste this in and press Ctrl+Enter.

``` javascript
stage(1000, 600, "#ffffff");                     // canvas: 1000 px wide, 600 px high, white background
title({hu: "Lengő labda", en: "Swinging ball"});  // title in both languages

// A slider: id "f", label, min 0, max 2, default 0.5, step 0.05, unit Hz
param("f", {hu: "Frekvencia f", en: "Frequency f"}, 0, 2, 0.5, 0.05, "Hz");

let phase = 0;                                   // state variable: the phase angle in radians

update(dt => {                                   // physics, dt = one time step (s)
  phase += 2 * PI * P.f * dt;                    // the phase grows by ω·dt, ω = 2πf
});

draw(t => {                                      // drawing, every frame
  grid(50);                                      // light background grid, 50 px squares
  // x = centre + amplitude · sin(phase): centre 500 px, amplitude 300 px
  const x = 500 + 300 * sin(phase);
  line(500, 100, x, 300, {stroke: C.gray, lw: 2});   // the string, from the pivot (500, 100) to the ball
  circle(x, 300, 30, {fill: C.blue});            // the ball: centre (x, 300), radius 30 px
  show({hu: "Kitérés", en: "Displacement"}, x - 500, "px");   // a readout on the Controls tab
  plot("x", x - 500, {unit: "px"});              // a live graph under the canvas
});
```

### The JavaScript you need

| Syntax                              | Meaning                                                    |
|-------------------------------------|------------------------------------------------------------|
| `// text`                           | A comment; the program ignores it                          |
| `let v = 0;`                        | A variable that changes (state: angle, speed)              |
| `const k = 2;`                      | A value that is set once inside a block                    |
| `x => { … }`                        | A function with one argument; `update` and `draw` take one |
| `{fill: C.blue, lw: 3}`             | An object: named settings, used for styles and options     |
| `[[0, 0], [10, 5]]`                 | An array: a list of points or values                       |
| `if (P.show) { … }`                 | Run the block only when the condition is true              |
| `for (let k = 0; k < 8; k++) { … }` | Repeat the block 8 times, k = 0 … 7                        |
| `a ? b : c`                         | b when a is true, otherwise c                              |

Maths functions are available without `Math.`: `sin`, `cos`, `tan`, `atan2`, `sqrt`, `abs`, `pow`, `exp`, `log`, `hypot`, `min`, `max`, `sign`, `round`, `floor`, `ceil`, `PI`, `TAU`, plus the helpers `clamp(v, lo, hi)`, `lerp(a, b, f)`, `mod(a, n)`, `wrap(angle)`, `deg` and `todeg`.

To make an oscillation faster, multiply the time: `sin(2 * PI * f * t)` is exactly an f-hertz oscillation. Integrating the phase in `update`, as above, keeps the ball smooth even while you move the slider.

## 3. Scene setup, controls and readouts

These lines form the frame of every scene: the canvas, the controls on the Controls tab and the values shown to the learner.

### Canvas, title, speed

``` javascript
stage(1000, 600, "#fbfbf8");                   // canvas width, height (px) and background colour
title({hu: "Egyenáramú motor", en: "DC motor"});  // title in the top-left corner, per language
timeScale(0.1);                                // start at 0.1× speed (10× slow motion); first run only
plotWindow(2);                                 // graphs show the last 2 s of simulation time
```

Any text the learner sees can be one string (`"F"`) or a two-language object (`{hu: "Erő", en: "Force"}`); AnimLab shows the one for the selected language. Inside your own code, `tr({hu: …, en: …})` returns the right string and `lang()` returns `"hu"` or `"en"`.

### Slider: `param`

``` javascript
param("U", {hu: "Tápfeszültség U", en: "Supply voltage U"}, -24, 24, 12, 0.5, "V");
```

| Position    | Example          | Meaning                               |
|-------------|------------------|---------------------------------------|
| 1\. id      | `"U"`            | Read the value as `P.U`               |
| 2\. label   | `{hu: …, en: …}` | The slider's name on the Controls tab |
| 3\. minimum | `-24`            | Smallest value                        |
| 4\. maximum | `24`             | Largest value                         |
| 5\. default | `12`             | The starting value                    |
| 6\. step    | `0.5`            | The smallest change                   |
| 7\. unit    | `"V"`            | Unit shown next to the value          |

Read `P.U` **inside** `update` or `draw`. If you copy it at the top of the script (`const U = P.U;`), moving the slider has no effect.

### Switch, list, button

``` javascript
toggle("field", {hu: "Erővonalak", en: "Field lines"}, true);   // checkbox; P.field is true or false
choice("conn", {hu: "Kapcsolás", en: "Connection"},
  [["Y", "Star (Y)"], ["D", "Delta (Δ)"]], "Y");                 // drop-down: [value, label] pairs, default "Y"
button({hu: "Polaritásváltás", en: "Reverse polarity"},
  () => setParam("U", -P.U));                                  // a button; this one flips the sign of U
resetOn("v0", "angle");                                        // restart the scene when these sliders change
button({hu: "Újra", en: "Again"}, reset);                       // reset restarts the scene from the beginning
```

Use `resetOn` for sliders that set starting conditions (launch speed, starting angle). Without it the new value only acts from the current moment on.

### Keyboard

Controls can get keys, the scene code can read keys, and every scene can be adjusted from the keyboard without any code.

``` javascript
param("F", {hu: "Motorerő F", en: "Motor force F"}, 0, 3000, 1200, 50, "N", {keys: "w s"});  // W raises, S lowers F
toggle("air", {hu: "Légellenállás", en: "Air drag"}, true, {key: "l"});    // L turns it on and off
choice("conn", {hu: "Kapcsolás", en: "Connection"}, [["Y", "Y"], ["D", "Δ"]], "Y", {key: "c"});  // C: next item, Shift+C: previous
button({hu: "Újra", en: "Again"}, reset, {key: "Enter"});                 // Enter presses the button

onKey("m", () => { marker = x; }, {label: {hu: "Jelölő", en: "Marker"}});  // once per press (also while paused)
update(dt => {
  if (key("ArrowRight")) x += 2 * dt;                                     // true while the key is held
  if (key("ArrowLeft")) x -= 2 * dt;
});
```

- **Slider keys:** the first key raises, the second lowers the value. A tap moves one step, holding moves it smoothly (the whole range in 10 seconds, or `{rate: 5}` units per second), Shift makes it 10× faster. A small key badge shows on the Controls tab.
- **Key names:** `"a"` … `"z"` (case does not matter), `"0"` … `"9"`, `" "` (Space), `"ArrowLeft"`, `"ArrowRight"`, `"ArrowUp"`, `"ArrowDown"`, `"Enter"`, `"Shift"`; `key(["a", "ArrowLeft"])` is true if any of them is held.
- **Phones and tablets:** the keys used with `key()` and `onKey()` appear as buttons on the canvas automatically. `label` sets the text of the button: `key(" ", {label: {hu: "Fék", en: "Brake"}})`.
- **Without code, in every scene:** press 1–9 to pick a slider (it is highlighted on the Controls tab and named on the canvas, also in canvas-only full screen), then move it with the arrow keys; Shift = 10×, Esc or 0 = done.
- **Key list:** every key of the scene, with its description, opens with the ⌨ button in the top-right corner of the canvas or the ? key, and is one collapsible line on the Controls tab, so it takes no room until opened. Controls describe themselves; for `key()` and `onKey()` give a `help` text: `key("ArrowRight", {help: {hu: "előre", en: "forward"}})`.
- **Conflicts:** the app uses Space = play/pause, R = restart, → = step. If the scene binds one of these, the scene wins; P always works as a backup play/pause key. Prefer letters (W/A/S/D) and the arrows for your own controls, and say which keys do what in a `text` hint on the canvas.

The **Cart with the arrow keys** example scene and the **Keyboard** lesson on the Help tab show all of this in action.

### Readouts, graphs and published values

``` javascript
show({hu: "Fordulatszám n", en: "Speed n"}, n, "1/min");      // a row in the readout list: label, value, unit
show("cos φ", pf, "", 3);                                    // 4th argument: number of decimals
plot({hu: "Áram I", en: "Current I"}, I, {unit: "A", color: C.orange});   // a live graph under the canvas
plot("i₁", i1, {unit: "A", group: "i"});                     // same group = same lane (e.g. three phase currents)
val({e, I, n});                                              // publish values for the Markup tab (section 8)
```

Put `show`, `plot` and `val` inside `draw`, without conditions, so they refresh every frame. `plot` also accepts `min` and `max` to fix the vertical range. `fmt(value, decimals)` formats a number with the decimal separator of the selected language (a comma in Hungarian).

## 4. Drawing

Every drawing command follows one pattern: position and size in pixels first, a style object last. Drawing commands only work inside `draw`; called anywhere else they draw nothing and AnimLab shows a warning.

### Basic shapes

| Command                                  | Arguments                                 | Draws                                                              |
|------------------------------------------|-------------------------------------------|--------------------------------------------------------------------|
| `circle(x, y, r, style)`                 | centre x, y; radius r                     | A circle                                                           |
| `rect(x, y, w, h, style)`                | top-left corner; width; height            | A rectangle; `{radius: 8}` rounds the corners                      |
| `box(cx, cy, w, h, angle, style)`        | centre; size; rotation in radians         | A rectangle rotated about its centre                               |
| `ellipse(x, y, rx, ry, style, angle)`    | centre; two semi-axes; rotation           | An ellipse                                                         |
| `ring(x, y, r1, r2, style)`              | centre; inner and outer radius            | An annulus (stator, bearing)                                       |
| `line(x1, y1, x2, y2, style)`            | start and end point                       | A line segment                                                     |
| `polyline([[x, y], …], style)`           | list of points                            | An open broken line (wire, path)                                   |
| `polygon([[x, y], …], style)`            | list of corners                           | A closed polygon (triangle, incline)                               |
| `arc(x, y, r, a0, a1, style)`            | centre; radius; start and end angle (rad) | An arc, clockwise on the canvas; `{ccw: true}` reverses it         |
| `spring(x1, y1, x2, y2, {coils, width})` | two end points; number of coils; width    | A spring                                                           |
| `ground(y)` · `grid(50)`                 | ground height; grid spacing               | Hatched ground, background grid                                    |
| `current(x, y, dir, r, style)`           | position; direction; radius               | Current symbol: ⊙ out of the page (dir \> 0), ⊗ into it (dir \< 0) |

### Style and colours

``` javascript
{fill: C.blue,      // fill colour (closed shapes)
 stroke: C.ink,     // outline or line colour; null = no outline
 lw: 3,             // line width in px
 dash: [6, 4],      // dashed line: 6 px dash, 4 px gap
 alpha: 0.5,        // opacity: 0 = invisible, 1 = solid
 radius: 8}         // rounded corners (rect only)
```

A single colour also works as a style: `circle(100, 100, 30, "red")` fills, `line(0, 0, 100, 0, "red")` strokes. Any CSS colour is accepted (`"#2f6fd6"`, `"rgba(0,0,0,0.3)"`). Built-in colours: `C.red`, `C.blue`, `C.green`, `C.orange`, `C.purple`, `C.teal`, `C.yellow`, `C.gray`, `C.light`, `C.ink` (near black), `C.copper`, `C.white`, `C.N` and `C.S` (magnet poles), `C.L1`, `C.L2`, `C.L3` (IEC phase colours: brown, black, grey).

### Text

``` javascript
text("U = " + fmt(P.U, 1) + " V", 830, 530,          // string, x, y (y is the text baseline)
     {size: 16, color: C.ink, align: "center", bold: true});   // size, colour, alignment, bold
text({hu: "kommutátor", en: "commutator"}, 830, 230, {size: 14, color: C.gray, align: "center"});
```

Text options: `size`, `color`, `bold`, `italic`, `align` (`"left"`, `"center"`, `"right"`), `baseline` (`"middle"` centres vertically), `bg` (a background colour behind the text) and `alpha`. A `\n` in the string starts a new line.

### Pictures

Upload a picture on the Images tab first; the name shown there (editable) is the one you use in the code.

``` javascript
image("rotor", 360, 320, {          // picture name, then the position (x, y) of its pivot point
  w: 300,                           // width in px; the height follows the picture's aspect ratio (or give h)
  angle: -theta,                    // rotation in radians about the pivot (positive = clockwise on the canvas)
  pivot: [0.5, 0.5],                // which point of the picture sits on (x, y): fractions of width and height
  alpha: 1,                         // opacity
  flip: false,                      // true = mirror left-right
  showPivot: false});               // true = a red dot marks the pivot, handy while lining a picture up
```

For a rotating part, crop the picture so the shaft is in its centre, or set `pivot` to where the shaft is (for example `[0.48, 0.52]`). Turn on `showPivot` until the dot sits on the shaft. If the name is wrong or the file cannot be loaded, a red dashed frame with the reason appears in its place. PNG, JPG, WebP and SVG all work; an SVG without the `xmlns` attribute is repaired automatically.

### Moving and rotating: `push`, `translate`, `rotate`, `pop`

``` javascript
push();                  // save the coordinate system
translate(200, 430);     // move the origin to (200, 430)
rotate(deg(45));         // rotate the coordinate system 45° (clockwise on the canvas)
rect(-40, -40, 80, 80);  // an 80×80 square round the new origin → a rotated square
pop();                   // back to the original coordinate system
```

`scale(k)` or `scale(kx, ky)` enlarges everything drawn after it. Always close a `push` with a `pop`.

### Arrows, vectors, phasors

``` javascript
arrow(100, 300, 250, 300, {stroke: C.red, lw: 3});           // from the tail to the tip
vector(x, y, dx, dy, {stroke: C.red, lw: 3}, "F");            // start point + displacement, label at the tip
phasor(250, 335, 180, deg(90), {stroke: C.L1, lw: 3}, "U₁");  // length + angle (rad, 0 = right, + = anticlockwise)
```

Scale a vector's length from a physical quantity, for example `vector(x, y, 0, -F * 5, …)`: 1 N then draws 5 px and the arrow grows with the force. The minus sign points it upwards. Arrows also accept `head` (arrowhead size in px) and `id` (a name for the Markup tab, section 8).

### Moving arrows: current flow and field loops

``` javascript
flow([[100, 400], [300, 400], [300, 250]],          // a broken line with arrowheads moving along it
     {speed: 60, spacing: 80, color: C.blue, lw: 3}); // speed px/s (negative = backwards), arrowhead spacing px
fieldLoop(500, 300, 200, 80, 0, {speed: 60});         // elliptical field line: centre, two semi-axes, tilt, speed
```

When the speed changes over time (proportional to the current, say), use `pos` and `dir` instead of `speed`. Integrate `pos` in `update` (`pos += 40 * I * dt`) and pass the sign of the current as `dir`; the arrowheads then never jump. Other options: `closed: true` (a loop), `line: false` (arrowheads only), `size` (arrowhead size), `arrowColor`, `dash`.

## 5. Motion and physics

You can move things in two ways: write the equations yourself in `update`, or let the built-in physics world move balls and springs for you.

### Your own equations in `update`

``` javascript
let omega = 0, theta = 0;          // state: angular speed (rad/s) and angle (rad)
update((dt, t) => {                // dt: step length (s, at most 1/240 s); t: simulation time (s)
  const M = 0.2 - 0.01 * omega;    // torque (N·m): drive minus friction proportional to speed
  omega += M / 0.01 * dt;          // Δω = (M / J) · Δt, with J = 0.01 kg·m²
  theta += omega * dt;             // Δθ = ω · Δt
});
```

This is the **Euler method**: acceleration gives velocity, velocity gives position, in small steps. With a small `dt` it is accurate enough. For stiff systems (a large inductance, a strong spring) do several smaller sub-steps inside one call: `for (let k = 0; k < 10; k++) { … dt / 10 … }`.

Keep every value that must survive between frames in a `let` variable at the top of the script, never inside `update` or `draw`.

### The physics world (Newtonian mechanics)

``` javascript
const W = world({gravity: 9.81,      // gravitational acceleration m/s² (0 = weightless)
                 scale: 50,          // 50 px = 1 m
                 origin: [40, 560],  // where (0 m, 0 m) is on the canvas, px
                 ground: true,       // a floor at y = 0 m
                 walls: true,        // left and right walls
                 restitution: 0.75,  // coefficient of restitution: 1 = elastic, 0 = inelastic
                 friction: 0.2,      // rolling friction on the floor
                 drag: 0});          // air drag (1/s)
const b = ball({x: 2, y: 9,          // starting position, m
                vx: 4, vy: 0,        // starting velocity, m/s
                r: 0.4, m: 1,        // radius m, mass kg
                color: C.orange, trail: 80,   // colour, trail length (points)
                label: "1", showV: true});    // text on the ball, velocity arrow
update(dt => { b.applyForce(0, 5); });   // an extra force in N; give it again in every step
draw(t => {
  drawWorld();                                        // floor, walls, springs, balls and trails
  show({hu: "Sebesség", en: "Speed"}, b.speed, "m/s");
});
```

The world steps itself right after your `update`: it computes acceleration (a = F/m − g), velocity and position and handles the floor, the walls and collisions between balls. Readable ball data: `b.x`, `b.y`, `b.vx`, `b.vy`, `b.ax`, `b.ay`, `b.speed`, `b.onGround`, `b.hits`. Options: `fixed: true` (does not move), `hidden: true`, `e` (its own restitution).

`link(b1, b2, {k: 50, damping: 0.5, len: 2})` connects two balls with a spring; `link([0, 5], b, …)` connects a fixed point to a ball. To draw your own shapes at a ball's place, convert metres to pixels: `wx(b.x)`, `wy(b.y)` and `ws(b.r)`.

## 6. AC and three-phase helpers

Complex numbers turn AC formulas into one line each, and the three-phase helpers draw a stator and compute its rotating field.

### Complex numbers for phasors

On AC, voltage and current are phasors, that is complex numbers: the length is the RMS value, the angle is the phase.

``` javascript
const Z = complex(40, 30);              // Z = 40 + j30 Ω (R = 40 Ω, X = 30 Ω)
const U = cpolar(230.9, 0);             // Ū = 230.9 V ∠ 0° (length, angle)
const I = U.div(Z);                     // Ī = Ū / Z  →  4.62 A ∠ −36.9°
I.abs();  I.arg();                      // magnitude (A) and angle (rad)
const S = U.mul(I.conj());              // S = Ū·Ī* = P + jQ;  S.re = P (W), S.im = Q (var)
```

Operations: `.add` (+), `.sub` (−), `.mul` (·), `.div` (/), `.scale(k)` (times a real number), `.conj()` (conjugate), `.rot(a)` (rotate by a radians). Each also accepts a plain number. The instantaneous value of a phasor is u(t) = √2 · \|Ū\| · sin(ωt + φ).

### Three-phase helpers

``` javascript
const i = phases(10, th);              // [i₁, i₂, i₃] = 10·sin(th − k·120°), k = 0, 1, 2
const axes = [0, deg(120), deg(240)];  // directions of the three coil axes
const B = fieldVec(i, axes);           // resultant field vector: {x, y, mag, angle}
stator3(320, 320, {p: 1,               // stator: centre, number of pole pairs
                   i: i, imax: 10,     // the three currents and their peak (for fading)
                   axes: axes});       // coil axes
phasor(320, 320, 100 * B.mag / 15, B.angle, {stroke: C.red, lw: 4}, "B");   // draw the field as a phasor
```

`stator3` shows the current direction in each slot with ⊙/⊗; the smaller the current, the fainter the symbol. Further options: `ri` and `ro` (inner and outer radius, default 175 and 245 px), `colors`, `labels: false`. `fieldVec` adds the three coil fields as vectors; with balanced three-phase currents the resultant has constant magnitude (1.5× one phase) and turns evenly. `phases(amp, angle, phi)` takes an optional phase shift `phi`.

Speed these scenes down: 50 Hz is far too fast to watch. `timeScale(0.002)` at the top of the script makes one period last 10 s.

## 7. 3D drawing

The 3D layer projects points given as `[x, y, z]` onto the canvas; x points right, y up, z towards the viewer. Shapes drawn between `begin3()` and `end3()` are sorted by depth, so near parts cover far ones.

``` javascript
param("yaw", {hu: "Nézőpont", en: "View angle"}, -90, 90, -38, 1, "°");
param("pitch", {hu: "Dölés", en: "Tilt"}, -10, 60, 20, 1, "°");
draw(t => {
  view3d({x: 480, y: 335,       // centre of the 3D space on the canvas, px
          scale: 82,            // 1 unit = 82 px
          yaw: deg(P.yaw),      // rotation about the vertical axis
          pitch: deg(P.pitch),  // tilt: positive = seen from above
          dist: 16});           // perspective: smaller = stronger perspective, 0 = none
  begin3();                                                 // depth-sorted drawing starts
  box3([-3.5, 0, 0], [1.3, 3.4, 4.0], {fill: C.N});         // box: centre [x, y, z], size [sx, sy, sz]
  box3([3.5, 0, 0], [1.3, 3.4, 4.0], {fill: C.S});
  wire3([[0, 0, -2.6], [0, 0, 2.9]], {color: "#9aa3b1", lw: 6});   // shiny tube (shaft, bar, coil)
  const loop = [[0, -1, -2], [0, 1, -2], [0, 1, 2], [0, -1, 2]].map(p => rot3(p, "z", t));   // a coil turning about z
  wire3(loop, {color: C.copper, lw: 7}, true);              // true = closed
  arrow3([0, 0, 0], [0, 1.7, 0], {stroke: C.purple, lw: 3}); // 3D arrow
  flow3(loop, {speed: 1.5, spacing: 1.2, color: C.orange}, true);   // moving arrowheads; speed and spacing in 3D units
  text3("N", [-3.5, 2.4, 0], {size: 28, bold: true, color: C.N, align: "center"});   // label at a 3D point
  end3();                                                   // draw: far elements first, near ones on top
});
```

| Command                        | Purpose                                                                                                    |
|--------------------------------|------------------------------------------------------------------------------------------------------------|
| `path3(points, style, closed)` | Thin line through 3D points                                                                                |
| `face3(points, style)`         | Filled flat polygon (a coil face, a pole shoe)                                                             |
| `circle3(centre, axis, r, n)`  | Returns the points of a circle round an axis (`"x"`, `"y"`, `"z"` or `[ax, ay, az]`), e.g. a cage end ring |
| `rot3(p, axis, angle)`         | Returns point p rotated about an axis through the origin                                                   |
| `p3(p)`                        | Returns where a 3D point lands on the canvas: `[x, y, depth]`                                              |

In 3D, give `flow3` a `spacing` and a `speed` in 3D units (about 1); the 2D defaults (80 and 60) are far too large for a model a few units across.

Add yaw and tilt sliders, as above, so learners can turn the model.

## 8. The Markup tab

On the Markup tab you can draw arrows on the canvas without writing code, and restyle the arrows the code draws. All of it is saved with the scene.

### Marks drawn with the mouse

| Tool         | How                                                  | Good for                                               |
|--------------|------------------------------------------------------|--------------------------------------------------------|
| Arrow        | Drag from the tail to the tip                        | Force, voltage or current on a picture                 |
| Field loop   | Drag a rectangle                                     | An elliptical field line with moving arrows            |
| Current path | Click point by point; double-click or Enter finishes | Current in a conductor or bar                          |
| Label        | Click where it goes                                  | A letter or a live value                               |
| Move         | Grab and drag                                        | Moving a mark                                          |
| Coordinate   | Click                                                | Copies the point's x, y to the clipboard, for the code |

Each mark has a colour, width, flow speed (px/s, negative = backwards) and spin (°/s). Spin **in the plane** turns the mark round a pivot; spin **about an axis (3D)** turns it as if round a horizontal axis, for example a field line on a side view of a rotor. Set the pivot with the **Pivot** button and a click on the canvas.

### Marks bound to variables

A scene publishes its variables in `draw` with `val()`, for example the DC motor: `val({e, I, M, n});`. The Markup tab lists them under "Variables you can use"; slider values are available as `P.name`.

- **Length / size × (expression):** the arrow stretches by this factor. `e / max(abs(P.U), 1)` makes the arrow its drawn length when the back-EMF reaches the supply voltage; a negative value reverses it.

- **Flow × (expression):** multiplies the speed of the moving arrowheads, e.g. `I / 5`.

- **Width × and colour by value:** the width follows an expression; the colour blends from the lower-limit colour to the upper-limit colour as the value runs from the lower to the upper limit.

- **Label:** an expression in braces is replaced by its value. `e = {e:1} V` prints e with one decimal; `{P.U - e:1}` prints the difference.

A wrong expression turns its field red, and the mark is then drawn at its original size.

### Customising arrows drawn by the code

The list "Arrows and marks drawn by the code" shows everything the code draws with `arrow`, `vector`, `phasor`, `flow`, `fieldLoop`, `arrow3` or `flow3`. Hover a row to highlight the item in yellow. For each one you can set visibility, colour, width ×, length / size × (also bound to an expression) and the label. The code itself does not change. When one command runs many times (all the field-line arrows in a loop), give it a name in its style to gather them in one row: `arrow(x1, y1, x2, y2, {stroke: C.gray, id: "field-arrow"})`.

**Copy as code** turns your mouse-drawn marks into JavaScript lines; **Move into the code** writes them into the script as `boundArrow` lines.

### Arrows declared in the code: `boundArrow`

A `boundArrow` keeps every setting of an arrow in one line of code, and the Markup tab shows exactly those settings. Change a value on the tab and the canvas updates at once and the code line is rewritten; change it in the code and the tab follows after Run.

``` javascript
boundArrow("i-arrow", {        // name shown on the Markup tab
  x: 500, y: 300,              // start point, px
  angle: 0,                    // direction in degrees: 0 = right, 90 = up, −90 = down
  length: "30 * i",            // length in px – an expression; negative reverses the arrow
  width: "2 + abs(i)",         // width in px – an expression
  color: "#2f6fd6",            // colour (with colour binding: the colour at the lower limit)
  colorBy: "abs(i)",           // the colour follows this (empty = fixed colour)
  colorMin: 0, colorMax: 10,   // limits of the colour blend
  colorTo: "#d64045",          // colour at the upper limit
  label: "i = {i:1} A"         // label; {i:1} = the value of i with one decimal
});
```

The expressions can use the values published with `val()` (here `val({i});` in `draw`) and slider values `P.name`. Write the line at the top of the script, outside `draw`: AnimLab draws it for you. With the **Move** tool you can drag the start point and the new x, y is written into the code. The DC motor, synchronous motor and induction motor examples draw their variable arrows this way.

## 9. Saving, sharing and exporting

A scene is saved as one `.animlab.json` file; for learners, export it as a standalone HTML file that opens in any browser without internet.

| Action                            | What you get                                                                                          |
|-----------------------------------|-------------------------------------------------------------------------------------------------------|
| **Save**                          | An `.animlab.json` file with the code, slider positions, pictures and markup. **Open** loads it back. |
| **Export → Standalone HTML file** | One file with AnimLab and the scene inside; it opens offline in any browser. Give this to learners.   |
| **Export → Record video**         | A WebM recording of the canvas, for slides or a video lesson. Stop it with the red badge.             |
| **Export → Snapshot (PNG)**       | The current frame as a picture.                                                                       |
| Autosave                          | The browser keeps the last scene. Large pictures may not fit there, so save important work to a file. |

AnimLab itself is a single HTML file and is free and open source at [github.com/BTomori/animlab](https://github.com/BTomori/animlab). Download `index.html` and open it; nothing needs installing.

## 10. Writing scenes with an AI assistant

Any free AI chat (ChatGPT, Gemini, Copilot, Claude and others) can write an AnimLab scene for you if it first reads the AnimLab instructions. The instructions are written for machines: the complete API, the rules that prevent errors and three tested examples. They are on the [AnimLab AI instructions](animlab-ai-instructions.md) page, which has a Copy button, and in the file `animlab-ai-instructions.md`.

1.  Open the AI instructions page and press **Copy**, or in AnimLab itself open the Help tab, go to Writing code with an AI assistant and press Copy AI instructions (this works offline too).

2.  Start a new chat in the AI app and paste it as your first message.

3.  In the same message or the next one, describe the animation: what it shows, which quantities the learner should change with sliders, what readouts and graphs you want, and for which age group.

4.  Copy the code from the answer. In AnimLab choose **New**, open the Code tab, replace everything with the code and press Ctrl+Enter.

5.  If something is wrong, tell the AI what you see, or paste the red error message with its line number. Ask for one change at a time.

6.  When it works, **Save** the scene, or export it as a standalone HTML file for learners.

### A good request

> Make a scene that shows a single-phase transformer. Sliders: primary voltage 0–400 V, turns N1 and N2 (10–1000), load resistance 1–500 Ω. Draw the core, the two windings and moving arrows for the currents whose speed follows the current. Show U2, I1, I2 and the power, and plot u1 and u2 over two periods. 50 Hz, slowed down so one period lasts 10 s. For 11th-grade electrical students.

Name the physical model you want (ideal or with losses), the units and the ranges. The more precisely you describe it, the less fixing it needs. A free AI may still make mistakes: check the formulas and the readouts against a value you can calculate by hand before you show the scene in class.

If the scene needs a photo (a rotor, a machine), the AI will use `image("name", …)` and tell you the name; upload your picture under that name on the Images tab.

## 11. Common mistakes and quick reference

When a scene fails, AnimLab shows the error in red with its line number; click it to jump to that line on the Code tab.

| Symptom                                              | Cause                                                          | Fix                                                                |
|------------------------------------------------------|----------------------------------------------------------------|--------------------------------------------------------------------|
| "Identifier 'circle' has already been declared"      | A variable has a built-in name (circle, C, P, phases…)         | Rename it, e.g. `circ0`, `cx0`                                     |
| "… is not defined"                                   | A typo, or the variable only exists inside another function    | Check the spelling; declare shared variables at the top with `let` |
| "Unexpected token"                                   | A missing or extra bracket or comma                            | Look at the reported line and the one before it                    |
| Warning: "… runs outside draw"                       | A drawing command sits at the top of the script or in `update` | Move it inside `draw(t => { … })`                                  |
| Moving the slider has no effect                      | `P.x` was copied at the top of the script                      | Read `P.x` inside `update`/`draw`                                  |
| The slider is not at the default written in the code | AnimLab remembers the last position                            | "Reset sliders to defaults" on the Controls tab                    |
| A shape spins 57× too fast                           | Degrees given instead of radians                               | `rotate(deg(30))`                                                  |
| Motion is upside down                                | On the canvas y grows downwards                                | Subtract for upward motion: `y = 300 - …`                          |
| A picture rotates round the wrong point              | The shaft is not at the picture's centre                       | Set `pivot`, check with `showPivot: true`                          |
| A red frame instead of the picture                   | No picture with that name, or the file cannot be loaded        | Check the name on the Images tab; re-save the file as PNG or JPG   |
| Motion is jerky or too fast                          | The real process is too fast (50 Hz)                           | Use the Speed slider, or `timeScale(0.002)` in the script          |
| An empty graph                                       | `plot` is in `update` or behind an `if`                        | Call `plot` in `draw`, unconditionally                             |

### Quick reference

| Area           | Commands                                                                                                                                                        |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Scene          | `stage` · `title` · `timeScale` · `plotWindow`                                                                                                                  |
| Controls       | `param` · `toggle` · `choice` · `button` · `setParam` · `resetOn` · `reset`                                                                                     |
| Keyboard       | `{keys: "q a"}` · `{key: "s"}` · `key(name)` · `onKey(name, fn, {label})` · 1–9 + arrows                                                                        |
| Running        | `update((dt, t) => …)` · `draw(t => …)`                                                                                                                         |
| Output         | `show` · `plot` · `val` · `fmt` · `tr` · `lang`                                                                                                                 |
| Shapes         | `circle` · `rect` · `box` · `ellipse` · `ring` · `line` · `polyline` · `polygon` · `arc` · `spring` · `ground` · `grid`                                         |
| Text, pictures | `text` · `image`                                                                                                                                                |
| Arrows         | `arrow` · `vector` · `phasor` · `current` · `flow` · `fieldLoop` · `boundArrow`                                                                                 |
| Transform      | `push` · `translate` · `rotate` · `scale` · `pop`                                                                                                               |
| Physics world  | `world` · `ball` · `link` · `applyForce` · `drawWorld` · `wx` · `wy` · `ws`                                                                                     |
| 3D             | `view3d` · `begin3` · `end3` · `wire3` · `path3` · `arrow3` · `flow3` · `box3` · `face3` · `text3` · `circle3` · `rot3` · `p3`                                  |
| AC             | `complex` · `cpolar` · `phases` · `fieldVec` · `stator3` · `wrap`                                                                                               |
| Maths          | `sin` `cos` `tan` `atan2` `sqrt` `cbrt` `abs` `pow` `exp` `log` `hypot` `min` `max` `sign` `round` `floor` `ceil` `clamp` `lerp` `mod` `deg` `todeg` `PI` `TAU` |

The Help tab describes every command in both languages, and its lessons load straight into the editor with the **Try it** button.
