#!/usr/bin/env node
// AnimLab build: összeállítja az index.html fájlt a src/ mappából / assembles index.html from src/
//
//   node build.js           →  megírja az index.html-t / writes index.html
//   node build.js --check   →  csak összehasonlít: 1-es kilépési kód és az első eltérő sor, ha az index.html elavult
//                              / compare only: exit code 1 and the first differing line when index.html is stale
//   node build.js --watch   →  újraépít, ha a src/ (vagy egy beillesztett fájl) változik / rebuilds when src/ changes
//
// Nincs függősége, csak Node.js kell hozzá (a program használatához nem, csak a módosításához).
// No dependencies, only Node.js (needed for modifying the app, not for using it).
//
// A src/app.html a váz. Benne egy sor végén álló jelölő
//     <!-- @include path -->
// helyére (a jelölő utáni sortöréssel együtt) a fájl tartalma kerül; az útvonal a src/ mappához képest értendő.
// A `path#field` alak egy JSON-fájl egy mezőjét illeszti be (így kerül be a Sablon az examples/teacher/sablon példából).
// Az AI-utasítások a docs/animlab-ai-instructions.md fájlból jönnek: egyik sincs külön másolatban.
// Minden beillesztett fájl a saját záró sortörésével végződik, így a kimenet soronként ugyanaz, mint a kézzel írt fájl volt;
// az egyetlen hozzáadott sor a <!DOCTYPE> utáni figyelmeztető megjegyzés.
// Sorvégek: a kimenet mindig LF; a bemenetek CRLF sorvégét LF-re váltja, a BOM-ot eldobja.
//
// src/app.html is the shell. A marker at the end of a line,
//     <!-- @include path -->
// is replaced (together with the line break after it) by the file's content; the path is relative to src/.
// The `path#field` form inserts one field of a JSON file (that is how the Template comes from examples/teacher/sablon).
// The AI instructions come from docs/animlab-ai-instructions.md: neither has a separate copy.
// Every included file ends with its own final line break, so the output is line for line the former hand-written file;
// the only added line is the notice comment after <!DOCTYPE>.
// Line ends: the output is always LF; CRLF in the inputs becomes LF, a BOM is dropped.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const SHELL = path.join(SRC, 'app.html');
const OUT = path.join(ROOT, 'index.html');
const MARKER = /^(.*)<!-- @include (\S+) -->\n/gm;
// Figyelmeztetés a kész fájl elején (a <!DOCTYPE> után) / notice at the top of the built file (after <!DOCTYPE>)
const NOTICE = '<!-- Generált fájl: a forrás a src mappában van, szerkesztés után: node build.js / Generated file: the source is in src/, after editing run: node build.js -->\n';

const norm = s => s.replace(/^﻿/, '').replace(/\r\n/g, '\n');
const readText = f => norm(fs.readFileSync(f, 'utf8'));
const rel = f => path.relative(ROOT, f).split(path.sep).join('/');

// Összeállítás a memóriában / assemble in memory: { html, used: Set of absolute paths }
function build() {
  const used = new Set();
  let shell;
  try { shell = readText(SHELL); } catch (e) { throw new Error('missing shell: ' + rel(SHELL)); }
  const html = shell.replace(MARKER, (m, before, spec) => {
    const [name, field] = spec.split('#');
    const file = path.resolve(SRC, name);
    let text;
    try { text = readText(file); } catch (e) { throw new Error('missing include: ' + spec + '  (' + rel(file) + ')'); }
    if (field !== undefined) {
      let json;
      try { json = JSON.parse(text); } catch (e) { throw new Error('not valid JSON: ' + rel(file)); }
      if (typeof json[field] !== 'string') throw new Error('no string field "' + field + '" in ' + rel(file));
      text = json[field];
    }
    used.add(file);
    return before + text;
  });
  if (/<!-- @include /.test(html)) throw new Error('an @include marker is not at the end of its line in src/app.html');
  // minden src/ alatti fájlt be kell illeszteni / every file under src/ must be included
  const unused = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (p !== SHELL && !used.has(p)) unused.push(rel(p));
    }
  })(SRC);
  if (unused.length) throw new Error('not included by any @include: ' + unused.join(', '));
  const doctype = '<!DOCTYPE html>\n';
  const out = html.startsWith(doctype) ? doctype + NOTICE + html.slice(doctype.length) : NOTICE + html;
  return { html: out, used };
}

function write() {
  const { html, used } = build();
  fs.writeFileSync(OUT, html, 'utf8');
  const lines = html.split('\n').length - 1;
  console.log('built index.html: ' + used.size + ' files included, ' + lines + ' lines, ' + Buffer.byteLength(html) + ' bytes');
  return used;
}

function check() {
  const { html } = build();
  let old;
  try { old = readText(OUT); } catch (e) { fail('index.html is missing: run  node build.js'); }
  if (old === html) { console.log('build --check: index.html is up to date'); return; }
  const a = old.split('\n'), b = html.split('\n');
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const show = s => s === undefined ? '<end of file>' : JSON.stringify(s.length > 100 ? s.slice(0, 100) + '…' : s);
  fail('index.html is stale (hand-edited or not rebuilt): first difference at line ' + (i + 1) + '\n' +
       '  index.html: ' + show(a[i]) + '\n' +
       '  built:      ' + show(b[i]) + '\n' +
       '  → edit src/ and run  node build.js');
}

function watch() {
  const tryWrite = () => { try { return write(); } catch (e) { console.error('BUILD ERROR: ' + e.message); return null; } };
  const watched = new Set();
  let timer = null;
  const rebuild = () => {
    const used = tryWrite();
    // beillesztett fájlok a src/ mappán kívül is figyelve / included files outside src/ are watched too
    for (const f of used || []) if (!f.startsWith(SRC + path.sep) && !watched.has(f)) {
      watched.add(f);
      try { fs.watch(f, trigger); } catch (e) { /* ignore */ }
    }
  };
  const trigger = (ev, name) => { clearTimeout(timer); timer = setTimeout(() => { console.log('[' + new Date().toLocaleTimeString() + '] ' + (name || ev)); rebuild(); }, 150); };
  rebuild();
  fs.watch(SRC, { recursive: true }, trigger);
  console.log('watching src/ … (Ctrl+C to stop)');
}

function fail(msg) { console.error(msg); process.exit(1); }

const arg = process.argv[2];
try {
  if (arg === '--check') check();
  else if (arg === '--watch') watch();
  else if (arg === undefined) write();
  else fail('usage: node build.js [--check | --watch]');
} catch (e) {
  fail('BUILD ERROR: ' + e.message);
}
