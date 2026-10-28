@echo off
chcp 65001 >nul
set "T=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\GameCatalogServer.cmd"
if exist "%T%" del "%T%"
echo.
echo   Автозапуск выключен.
echo.
pause
