@echo off
chcp 65001 >nul
set "T=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\GameCatalogServer.cmd"
> "%T%" echo @echo off
>> "%T%" echo cd /d "%~dp0"
>> "%T%" echo start "Game Catalog Server" /min cmd /c "node server.mjs"
echo.
echo   Done: the server will start by itself when you sign in to Windows (in a minimized window).
echo   To turn it off, use the file "6. Disable autostart".
echo   If you move this folder, run this file again.
echo.
pause
