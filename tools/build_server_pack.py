#!/usr/bin/env python3
"""Собирает архивы сервера: game-catalog-server.zip (русский) и game-catalog-server-en.zip (английский).
В каждом: сервер, веб-версия (www), скрипты запуска и инструкция. Запуск: python3 tools/build_server_pack.py [папка_для_архивов]"""
import os, re, sys, zipfile, tempfile
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(root, 'tools', 'i18n'))
import build_en
out_dir = sys.argv[1] if len(sys.argv) > 1 else root
os.makedirs(out_dir, exist_ok=True)
SKIP = {'game-catalog-server.zip', 'game-catalog-server-en.zip'}  # сами архивы лежат в www только в сборке apk

CSS = """body{font:16px/1.6 system-ui,Segoe UI,Arial,sans-serif;max-width:820px;margin:0 auto;padding:24px 16px 60px;color:#1b1b20;background:#fff}
h1{font-size:26px;margin:0 0 4px}h3{margin:28px 0 6px;font-size:20px;color:#c4580a;border-bottom:1px solid #e3e3e8;padding-bottom:4px}h4{margin:14px 0 4px}
code,kbd{background:#f2f3f6;border:1px solid #dcdde4;border-radius:6px;padding:1px 6px;font-family:Consolas,monospace;font-size:14px;word-break:break-all}
.note{background:#fff2e8;border-left:4px solid #ff7a1a;border-radius:8px;padding:10px 14px;margin:14px 0}
.warn{background:#fdeceb;border-left:4px solid #e5484d;border-radius:8px;padding:10px 14px;margin:14px 0}
table{border-collapse:collapse;width:100%;margin:10px 0}td,th{border:1px solid #dcdde4;padding:8px 10px;text-align:left;vertical-align:top}th{background:#f2f3f6}
li{margin:6px 0}"""

def page(lang, guide):
    title, h1, intro = (('Каталог игр: свой сервер, инструкция', 'Каталог игр: свой сервер в домашней сети', 'Инструкция для тех, кто не очень дружит с компьютером. Делайте шаги по порядку.') if lang == 'ru' else
                        ('Game Catalog: own server, guide', 'Game Catalog: your own server on the home network', 'A guide for people who are not very comfortable with computers. Follow the steps in order.'))
    return ('<!doctype html>\n<html lang="%s"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n<title>%s</title>\n<style>\n%s\n</style></head><body>\n<h1>%s</h1>\n<p>%s</p>\n%s\n</body></html>\n' % (lang, title, CSS, h1, intro, guide))

def build(lang):
    files = []
    srv = os.path.join(root, 'server') if lang == 'ru' else os.path.join(root, 'server', 'en')
    for n in sorted(os.listdir(srv)):
        f = os.path.join(srv, n)
        if os.path.isfile(f) and n != 'server.mjs': files.append((n, f))
    if lang == 'ru':
        files.append(('server.mjs', os.path.join(root, 'server', 'server.mjs')))
    else:
        tmp = os.path.join(tempfile.mkdtemp(), 'server.mjs')
        build_en.build(os.path.join(root, 'server', 'server.mjs'), tmp, 'server_en.json', 'server.mjs')
        files.append(('server.mjs', tmp))
        files.append(('config.json', b'{\n  "lang": "en"\n}\n'))
    www = os.path.join(root, 'www')
    for base, _, names in os.walk(www):
        for n in sorted(names):
            if n in SKIP: continue
            full = os.path.join(base, n); files.append(('www/' + os.path.relpath(full, www).replace(os.sep, '/'), full))
    g = open(os.path.join(www, 'guide.html' if lang == 'ru' else 'guide.en.html'), encoding='utf-8').read()
    files.append(('ИНСТРУКЦИЯ.html' if lang == 'ru' else 'INSTRUCTIONS.html', page(lang, g).encode('utf-8')))
    out = os.path.join(out_dir, 'game-catalog-server.zip' if lang == 'ru' else 'game-catalog-server-en.zip')
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
        for name, src in files:
            if isinstance(src, bytes): z.writestr(name, src)
            else: z.write(src, name)
    print('Готово:', out, '(' + str(len(files)) + ' файлов)')

if __name__ == '__main__':
    build('ru'); build('en')
