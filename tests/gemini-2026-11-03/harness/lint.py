# Static checks of each scene against the rules in the AI instructions
import re, os, json
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))   # run from anywhere
def lint(path):
    s = open(path, encoding='utf-8').read(); L = s.split('\n')
    code = [l for l in L if l.strip() and not l.strip().startswith('//')]
    com = sum(1 for l in L if '//' in l)
    r = {}
    r['lines'] = len(L); r['comment_lines'] = com
    r['forbidden_api'] = bool(re.search(r'\b(document|window|setTimeout|setInterval|requestAnimationFrame|import|require)\b', '\n'.join(code)))
    # plain-string user labels in title/param/toggle/choice/button/show (not bilingual)
    plain = re.findall(r'\b(?:title|param|toggle|choice|show)\(\s*(?:"[^"]*",\s*)?"([^"]{3,})"', s)
    r['plain_labels'] = [p for p in plain if not re.fullmatch(r'[A-Za-z_]\w*', p)]
    # flow/flow3 with a speed that varies (contains sin/cos or a variable) but no pos
    bad = []
    for m in re.finditer(r'flow3?\((.*?)\}\s*(?:,\s*true)?\)', s, re.S):
        body = m.group(1)
        sp = re.search(r'speed:\s*([^,}\n]+)', body)
        if sp and not re.fullmatch(r'\s*-?\d+(\.\d+)?\s*', sp.group(1)) and 'pos:' not in body: bad.append(sp.group(1).strip())
    r['flow_varying_speed_without_pos'] = bad
    r['flow_hidden_when_zero'] = bool(re.search(r'if\s*\([^)]*(I|i|abs|live)[^)]*\)\s*(\{|\n|flow|for)', s)) and 'flow(' in s
    pw = re.search(r'plotWindow\(([^)]*)\)', s); r['plotWindow'] = pw.group(1) if pw else None
    tr = re.search(r'trail:\s*([^,}\n]+)', s); r['trail'] = tr.group(1).strip() if tr else None
    by = re.search(r'ball\(\{[^}]*?\by:\s*([^,}\n]+)', s, re.S); r['ball_start_y'] = by.group(1).strip() if by else None
    r['resetOn'] = 'resetOn(' in s
    return r
out = {}
for d in ['gemini-codes', 'reference-codes']:
    for f in sorted(os.listdir(d)):
        if f.endswith('.js') and 'broken' not in f: out[d + '/' + f] = lint(d + '/' + f)
json.dump(out, open('harness/lint.json', 'w'), indent=1, ensure_ascii=False)
for k, v in out.items(): print(k, v)
