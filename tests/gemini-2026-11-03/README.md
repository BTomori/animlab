# Gemini test of the AnimLab AI instructions – 2026-11-03

Gemini 3.5 Flash-Lite (signed out, free tier) was given the AnimLab AI instructions and the six prompts of the test scenario. Every code it returned was run in AnimLab next to a reference code with the same slider values. The faults found with v1 of the instructions led to v2 (now `docs/animlab-ai-instructions.md`), which was re-tested in a new chat.

- `test-report.pdf` – the report: results, findings with screenshots, root causes, corrections, re-test
- `gemini-session/` – v1 transcript (all prompts, answers, codes) and the v1 instructions as sent
- `gemini-codes/` – Gemini's v1 codes, byte-identical to its answers; `T5-broken-input.js` is the code with the planted error
- `reference-codes/` – the reference codes (T1–T6, plus T3b used in the re-test)
- `screenshots/` – each scene, and `compare-*.png` side by side (Gemini left, reference right)
- `v2/` – the re-test with v2: transcript, codes, screenshots, `results-v2.json`
- `harness/` – `compare.js` and `compare-v2.js` run the scenes in AnimLab (Node + Playwright, `rotor.png` is the picture for T6); `lint.py` checks the codes against the instruction rules

Note: the screenshots and results were made with the AnimLab version of 2026-11-03 evening. The current `index.html` also smooths moving arrows whose speed changes without `pos`, so Gemini's v1 transformer arrows no longer jump there.
