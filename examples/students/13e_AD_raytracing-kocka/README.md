# Sugárkövetés: kocka és padló / Ray tracing: cube and floor

**[▶ Megnyitás az AnimLab-ben / Open in AnimLab](https://btomori.github.io/animlab/?scene=examples/students/13e_AD_raytracing-kocka)** · jelenetfájl / scene file: [`scene.animlab.json`](scene.animlab.json) · [média / media](media/)

| | |
| --- | --- |
| Készítette / Made by | A. D., 13.E |
| AI segítség / AI help | Claude |

## Magyar

Saját sugárkövető (ray tracer) egy AnimLab-jelenetben: a kép minden pixelére egy sugarat indít a kamerából, és kiszámolja, mit talál el. A színes lapú, megdöntött kocka egy sakktábla-padló fölött lebeg és forog; a fényforrás pontszerű, a távoli padló beleolvad a horizont színébe.

A számolás lépései a kódban kommentekkel: sugár–kocka metszés a „réteg-módszerrel”, sugár–sík metszés a padlóhoz, Lambert-féle megvilágítás és csillanás, árnyéksugár a fényforrás felé, tükrözés az r = d − 2(d·n)n képlettel, végül gammakorrekció.

**Beállítások:** pixelméret (kisebb = élesebb, de lassabb), a kocka forgási sebessége, a kamera körbeforgatása, a fény iránya, a padló és a kocka tükrözése, a visszaverődések száma, árnyékok. A mért értékek: a pixelek száma és a kocka elfordulása.

**Kipróbálásra:** kapcsold ki az árnyékokat, majd forgasd a fényt; állítsd a visszaverődések számát 0-ról 3-ra erős tükrözés mellett, és figyeld, hogyan jelenik meg a kocka képe a padlón, a padlóé pedig a kocka lapjain.

## English

A ray tracer written inside an AnimLab scene: for every pixel of the picture it sends a ray from the camera and works out what it hits. A tilted cube with coloured faces hovers and spins above a checkerboard floor; the light is a point source, and the far floor fades into the horizon colour.

The steps, commented in the code: ray–cube intersection with the slab method, ray–plane intersection for the floor, Lambert shading with a specular highlight, a shadow ray towards the light, mirror reflection with r = d − 2(d·n)n, and finally gamma correction.

**Settings:** pixel size (smaller = sharper but slower), cube spin speed, camera orbit, light direction, floor and cube reflectivity, number of reflection bounces, shadows. Readouts: pixel count and cube rotation.

**Try this:** switch shadows off, then move the light; set the bounces from 0 to 3 with strong reflectivity, and watch the cube appear in the floor and the floor appear in the cube's faces.

## Köszönet / Thanks

Szeretném külön megköszönni A. D. munkáját, amivel egészen új lehetőségeket mutat be az AnimLab felhasználására.
Special thanks to A. D. for this work, which shows entirely new ways of using AnimLab.
