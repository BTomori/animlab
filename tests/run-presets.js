// Smoke test: loads every example scene of AnimLab, checks for errors and prints the first readouts.
// Futtatás / run:  npm i playwright && npx playwright install chromium && node tests/run-presets.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../index.html')); await p.waitForTimeout(700);
  const ids = await p.$$eval('#presetSel option', o => o.map(x => x.value).filter(Boolean));
  let bad = 0;
  for (const id of ids) {
    await p.selectOption('#presetSel', id); await p.waitForTimeout(1500);
    const se = await p.$eval('#stageErr', e => e.hidden ? '' : e.textContent);
    const ro = await p.$$eval('#readouts .ro', r => r.slice(0, 3).map(x => x.innerText.replace(/\s+/g, ' ')).join(' | '));
    if (se) bad++;
    console.log((se ? 'FAIL ' : 'ok   ') + id.padEnd(12), se || ro);
  }
  console.log(`${ids.length} scenes, ${bad} failed, page errors: ${errs.length}`);
  await b.close(); process.exit(bad || errs.length ? 1 : 0);
})();
