"""Общий разбор app.js: находит строковые литералы и в них фразы на русском (между разметкой и кавычками)."""
import re
CYR = re.compile('[А-Яа-яЁё]')
_PH = re.compile(r'\\.|([^<>"\'\\]*[А-Яа-яЁё][^<>"\'\\]*)', re.S)
def iter_phrases(seg):
    """(начало, конец, текст) русских фраз в содержимом литерала; экранированные символы (\\n, \\') фразу разрывают и в неё не попадают"""
    for m in _PH.finditer(seg):
        if m.group(1): yield m.start(1), m.end(1), m.group(1)


def literals(s):
    """[(start, end, quote)] границы строковых литералов (без кавычек); комментарии и регулярки пропускаем."""
    out = []; i = 0; n = len(s)
    while i < n:
        c = s[i]
        if c in '\'"`':
            q = c; j = i + 1
            while j < n and s[j] != q:
                if s[j] == '\\': j += 2; continue
                if s[j] == '\n' and q != '`': break
                j += 1
            out.append((i + 1, j, q)); i = j + 1
        elif c == '/' and s[i + 1:i + 2] == '/':
            j = s.find('\n', i); i = j if j > 0 else n
        elif c == '/' and s[i + 1:i + 2] == '*':
            j = s.find('*/', i); i = j + 2
        else: i += 1
    return out

def phrases(s):
    """уникальные фразы в порядке первого появления (обрезанные по краям пробелов)"""
    seen = {}; 
    for a, b, q in literals(s):
        for st, en, raw in iter_phrases(s[a:b]):
            p = raw.strip()
            if p and p not in seen: seen[p] = len(seen)
    return list(seen)
