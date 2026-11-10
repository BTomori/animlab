/* ───────────── state ───────────── */
let scene = {name: '', script: '', params: {}, assets: {}, marks: [], overrides: {}, timeScale: 1};
let R = null;
let firstRun = true;
let ctlSig = null;
let ctlEls = {};
let needsRerun = false;
let playing = true, speed = 1, acc = 0, stepReq = false, lastNow = performance.now();
let lastRunScript = '';
let runCounter = 0;
const imgCache = new Map();
let g = null;                     // the 2D context while a scene draws

const stageCv = $('#stage'), stageCtx = stageCv.getContext('2d');
const plotCv = $('#plot'), plotCtx = plotCv.getContext('2d');
let stageK = 1, dpr = Math.max(1, window.devicePixelRatio || 1);

function freshRuntime() {
  return {
    P: {}, defs: [], updates: [], draws: [], world: null, stageW: 1000, stageH: 600, bg: '#fbfbf8',
    title: null, titleColor: '#1d2430', readouts: new Map(), plots: new Map(), pending: new Map(),
    plotWindow: 10, t: 0, resetOn: new Set(), worldDrawn: false, advanced: false, error: null, depth: 0, vals: {}, bound: new Map(), runId: ++runCounter,
    // billentyűzet: onKey kezelők, a key()-jel figyelt billentyűk, feliratok az érintőgombokhoz, vezérlők billentyűi
    // keyboard: onKey handlers, keys polled with key(), labels for the touch buttons, keys of the controls
    keyOn: new Map(), keyPoll: new Set(), keyLabel: new Map(), keyHelp: new Map(), ctlKeys: new Map(),
  };
}

