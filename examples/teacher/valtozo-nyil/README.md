# Változó nyíl / Changing arrow

**[▶ Megnyitás az AnimLab-ben / Open in AnimLab](https://btomori.github.io/animlab/?scene=examples/teacher/valtozo-nyil)** · jelenetfájl / scene file: [`scene.animlab.json`](scene.animlab.json) · [média / media](media/)

## Magyar

Szinuszos váltakozó áram, i = Î·sin(2πft), egyetlen nyíllal ábrázolva. A nyíl egy `boundArrow`: a hossza, a vastagsága és a színe a kódban megadott kifejezésekből számolódik (`30 * i`, `2 + abs(i)`, kékből pirosba |i| szerint), a felirata pedig az aktuális értéket mutatja.

**Kipróbálásra:**

- Figyeld, hogy a nyíl negatív áramnál megfordul.
- Nyisd meg a **Jelölők** fület, és kattints a nyílra: a beállításai ott is szerkeszthetők, és a változás visszaíródik a kódba.

## English

A sinusoidal alternating current, i = Î·sin(2πft), shown with a single arrow. The arrow is a `boundArrow`: its length, width and colour come from expressions in the code (`30 * i`, `2 + abs(i)`, blue to red by |i|), and its label shows the current value.

**Try this:**

- Notice that the arrow turns around when the current is negative.
- Open the **Markup** tab and click the arrow: its settings can be edited there too, and the change is written back into the code.
