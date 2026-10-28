@echo off
chcp 65001 >nul
set "T=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\GameCatalogServer.cmd"
> "%T%" echo @echo off
>> "%T%" echo cd /d "%~dp0"
>> "%T%" echo start "Game Catalog Server" /min cmd /c "node server.mjs"
echo.
echo   Готово: сервер будет сам запускаться при входе в Windows (свёрнутым окном).
echo   Отключить: файл "6. Выключить автозапуск".
echo   Если вы переместите эту папку, запустите этот файл снова.
echo.
pause
