#!/usr/bin/env python3
"""Собирает архив game-catalog-server.zip: сервер, веб-версия (www), скрипты запуска и ИНСТРУКЦИЯ.html.
Запуск: python3 tools/build_server_pack.py [папка_для_архива]"""
import os, sys, zipfile

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out_dir = sys.argv[1] if len(sys.argv) > 1 else root
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, 'game-catalog-server.zip')

guide = open(os.path.join(root, 'www', 'guide.html'), encoding='utf-8').read()
page = '''<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Каталог игр: свой сервер, инструкция</title>
<style>
body{font:16px/1.6 system-ui,Segoe UI,Arial,sans-serif;max-width:820px;margin:0 auto;padding:24px 16px 60px;color:#1b1b20;background:#fff}
h1{font-size:26px;margin:0 0 4px}h3{margin:28px 0 6px;font-size:20px;color:#c4580a;border-bottom:1px solid #e3e3e8;padding-bottom:4px}h4{margin:14px 0 4px}
code,kbd{background:#f2f3f6;border:1px solid #dcdde4;border-radius:6px;padding:1px 6px;font-family:Consolas,monospace;font-size:14px;word-break:break-all}
.note{background:#fff2e8;border-left:4px solid #ff7a1a;border-radius:8px;padding:10px 14px;margin:14px 0}
.warn{background:#fdeceb;border-left:4px solid #e5484d;border-radius:8px;padding:10px 14px;margin:14px 0}
table{border-collapse:collapse;width:100%;margin:10px 0}td,th{border:1px solid #dcdde4;padding:8px 10px;text-align:left;vertical-align:top}th{background:#f2f3f6}
li{margin:6px 0}
</style></head><body>
<h1>Каталог игр: свой сервер в домашней сети</h1>
<p>Инструкция для тех, кто не очень дружит с компьютером. Делайте шаги по порядку.</p>
''' + guide + '\n</body></html>\n'

files = []  # (путь в архиве, путь на диске или байты)
for n in sorted(os.listdir(os.path.join(root, 'server'))):
    files.append((n, os.path.join(root, 'server', n)))
for base, _, names in os.walk(os.path.join(root, 'www')):
    for n in sorted(names):
        full = os.path.join(base, n); files.append(('www/' + os.path.relpath(full, os.path.join(root, 'www')).replace(os.sep, '/'), full))
files.append(('ИНСТРУКЦИЯ.html', page.encode('utf-8')))

with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for name, src in files:
        if isinstance(src, bytes): z.writestr(name, src)
        else: z.write(src, name)
print('Готово:', out, '(' + str(len(files)) + ' файлов)')
