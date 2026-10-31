#!/usr/bin/env python3
"""Генерирует www/app.en.js из www/app.js: русские фразы внутри строковых литералов заменяются по таблицам en_*.py.
Фрагменты между /*i18n:keep*/ и /*i18n:end*/ не переводятся (там русские слова для разбора импорта).
Запуск: python3 tools/i18n/build_en.py"""
import os, re, sys, importlib.util
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.dirname(os.path.dirname(here))
sys.path.insert(0, here)
from extract import literals, phrases, iter_phrases

def load_table(name='en.json'):
    import json
    return json.load(open(os.path.join(here, name), encoding='utf-8'))

def keep_phrases(s):
    """фразы, которые встречаются только внутри /*i18n:keep*/…/*i18n:end*/ (их переводить не нужно)"""
    keep = [(m.end(), s.find('/*i18n:end*/', m.end())) for m in re.finditer(r'/\*i18n:keep\*/', s)]
    inside, outside = set(), set()
    for a, b, q in literals(s):
        for st, en_, raw in iter_phrases(s[a:b]):
            c = raw.strip()
            if c: (inside if any(x <= a < y for x, y in keep) else outside).add(c)
    return inside - outside

def build(src_path=os.path.join(root, 'www', 'app.js'), out_path=os.path.join(root, 'www', 'app.en.js'), table='en.json', header='app.js', strict=True):
    s = open(src_path, encoding='utf-8').read()
    ph = phrases(s); en = load_table(table)
    keepset = keep_phrases(s)
    missing = [p for p in ph if p not in en and p not in keepset]
    if missing and strict:
        raise SystemExit('Нет перевода для фраз (добавьте в tools/i18n/en.json):\n  ' + '\n  '.join(missing[:30]))
    keep = [(m.end(), s.find('/*i18n:end*/', m.end())) for m in re.finditer(r'/\*i18n:keep\*/', s)]
    inkeep = lambda p: any(a <= p < b for a, b in keep)
    out = []; pos = 0
    for a, b, q in literals(s):
        if inkeep(a): continue
        seg = s[a:b]; new = []; p = 0
        for st0, en0, raw in iter_phrases(seg):
            core = raw.strip()
            if not core: continue
            lead = raw[:len(raw) - len(raw.lstrip())]; trail = raw[len(raw.rstrip()):]
            tr = en.get(core)
            if tr is None: continue
            esc = tr.replace('\\', '\\\\').replace(q, '\\' + q) if q != '`' else tr
            new.append((st0, en0, lead + esc + trail))
        for st, en_, txt in reversed(new): seg = seg[:st] + txt + seg[en_:]
        out.append((a, b, seg))
    res = s
    for a, b, seg in reversed(out): res = res[:a] + seg + res[b:]
    res = res.replace("const LANG = 'ru';", "const LANG = 'en';", 1)
    res = ('// Auto-generated from ' + header + ' (tools/i18n/build_en.py). Do not edit by hand.\n') + res
    open(out_path, 'w', encoding='utf-8').write(res)
    left = []
    for i, l in enumerate(res.split('\n'), 1):  # русский текст вне комментариев и вне keep-фрагментов
        if l.lstrip().startswith(('//', '/*', '*')) or not re.search('[А-Яа-яЁё]', l) or 'i18n:keep' in l: continue
        code = re.sub(r'/\*.*?\*/', '', l.split(' // ')[0])
        left += [(i, m.strip()) for m in re.findall(r'[^<>"\'\\]*[А-Яа-яЁё][^<>"\'\\]*', code) if m.strip()]
    return res, left

if __name__ == '__main__':
    res, left = build()
    print('Готово: app.en.js. Русский текст вне комментариев и keep-фрагментов:', len(left))
    for i, x in left[:15]: print('  строка', i, x[:70])
