# Hálózati térkép – egy csomag útja / Network map – the path of a packet

**[▶ Megnyitás az AnimLab-ben / Open in AnimLab](https://btomori.github.io/animlab/?scene=examples/teacher/halozati-terkep)** · jelenetfájl / scene file: [`scene.animlab.json`](scene.animlab.json) · [média / media](media/)

Készítette / made by: Tanár / teacher · AI: Claude

## Magyar

Kis helyi hálózat routerrel, két switch-csel és végpontokkal. A ping csomag a legkevesebb ugrásból álló úton megy a címzetthez (szélességi keresés), a válasz visszajön. Egy kábel elvágható: a csomag új utat keres.

**Kipróbálásra:** Küldj pinget PC 1-ről a nyomtatóra, majd vágd el a Switch A – Switch B kábelt (X billentyű). Az eszközök és kábelek két listában vannak, könnyen bővíthetők.

## English

A small local network with a router, two switches and end devices. The ping packet takes the path with the fewest hops to the destination (breadth-first search), and the reply comes back. A cable can be cut: the packet finds a new route.

**Try this:** Ping the printer from PC 1, then cut the Switch A – Switch B cable (key X). The devices and cables are in two lists and easy to extend.
