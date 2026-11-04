# Logikai kapuk – fényrendszer / Logic gates – light system

**[▶ Megnyitás az AnimLab-ben / Open in AnimLab](https://btomori.github.io/animlab/?scene=examples/students/13e_B_logikai-kapuk)** · jelenetfájl / scene file: [`scene.animlab.json`](scene.animlab.json) · [média / media](media/)

| | |
| --- | --- |
| Készítette / Made by | B., 13.E |
| AI segítség / AI help | Claude Sonnet |

## Magyar

A hét alapkapu egy képen: ÉS, NEM-ÉS, VAGY, NEM-VAGY, KIZÁRÓ VAGY, EGYENLŐSÉG és NEM. Az A és B kapcsoló jele két sínen jut el minden kapuhoz; a kapuk kimenete egy-egy lámpát kapcsol. Az 1-es jelű vezeték narancssárga, mozgó nyilakkal, a 0-s szürke. A kapuk alakjelképesek, a lámpák jele kör X-szel (IEC 60617). Jobb oldalon az igazságtábla, benne kiemelve az éppen érvényes sor.

**Beállítások:** automatikus ciklus (00 → 01 → 10 → 11) állítható lépésidővel, vagy kézi A és B kapcsoló; az A, a B és az összes kimenet negálása (a vezetéken megjelenik egy inverter). Grafikonon az a, b bemenet és az ÉS, VAGY, KIZÁRÓ VAGY kimenet.

**Kipróbálásra:** kapcsold be az A és a B negálását, és hasonlítsd össze az ÉS kapu lámpáját a NEM-VAGY kapu lámpájával kikapcsolt negálás mellett (De Morgan-azonosság: ¬a · ¬b = ¬(a + b)).

## English

All seven basic gates in one picture: AND, NAND, OR, NOR, XOR, XNOR and NOT. Switches A and B feed every gate through two buses; each gate output drives a lamp. A wire at 1 is orange with moving arrows, a wire at 0 is grey. The gates use distinctive-shape symbols and the lamps are circles with an X (IEC 60617). On the right, the truth table highlights the row that is currently true.

**Settings:** auto-cycle (00 → 01 → 10 → 11) with an adjustable step time, or manual switches A and B; negation of A, of B and of all outputs (an inverter appears on the wire). The graphs show inputs a, b and the AND, OR, XOR outputs.

**Try this:** turn on the negation of both A and B, and compare the AND lamp with the NOR lamp when negation is off (De Morgan's law: ¬a · ¬b = ¬(a + b)).
