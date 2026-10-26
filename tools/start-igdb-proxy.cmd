@echo off
chcp 65001 >nul
rem Впишите свои значения. Секрет не публикуйте и не отправляйте в чаты.
set IGDB_CLIENT_ID=ВСТАВЬТЕ_CLIENT_ID
set IGDB_CLIENT_SECRET=ВСТАВЬТЕ_CLIENT_SECRET
rem Адрес сайта без пути и без / на конце (если Apache на порту 8080: http://localhost:8080)
set ALLOWED_ORIGIN=http://localhost
set PORT=8787
node "%~dp0igdb-proxy.mjs"
pause
