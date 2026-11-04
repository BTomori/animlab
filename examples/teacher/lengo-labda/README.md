# Lengő labda / Swinging ball

**[▶ Megnyitás az AnimLab-ben / Open in AnimLab](https://btomori.github.io/animlab/?scene=examples/teacher/lengo-labda)** · jelenetfájl / scene file: [`scene.animlab.json`](scene.animlab.json) · [média / media](media/)

## Magyar

A legrövidebb teljes AnimLab-jelenet: egy fonálon lengő labda, amelynek a frekvenciáját csúszka állítja. Kezdőknek mintának szánjuk, mert minden alapelem megvan benne, soronként kommentezve:

- `param` → csúszka, értéke `P.f`;
- `update` → állapotváltozó (a fázis) léptetése: φ += 2π·f·dt;
- `draw` → rajzolás, mért érték (`show`) és élő grafikon (`plot`).

**Kipróbálásra:** állítsd a frekvenciát 0-ra (a labda megáll ott, ahol éppen van), majd 2 Hz-re. Figyeld, hogy a grafikonon a kitérés szinuszos.

## English

The shortest complete AnimLab scene: a ball swinging on a string, with its frequency set by a slider. It is meant as a starter template, because it has every basic element, commented line by line:

- `param` → slider, its value is `P.f`;
- `update` → stepping a state variable (the phase): φ += 2π·f·dt;
- `draw` → drawing, a readout (`show`) and a live graph (`plot`).

**Try this:** set the frequency to 0 (the ball stops where it is), then to 2 Hz. Notice that the displacement in the graph is sinusoidal.
