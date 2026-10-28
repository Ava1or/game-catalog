@echo off
chcp 65001 >nul
title Разрешить доступ к серверу в домашней сети
net session >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Этот файл нужно запускать от имени администратора:
  echo   закройте окно, щёлкните по файлу ПРАВОЙ кнопкой мыши
  echo   и выберите "Запуск от имени администратора".
  echo.
  pause
  exit /b 1
)
netsh advfirewall firewall delete rule name="GameCatalogServer" >nul 2>nul
netsh advfirewall firewall add rule name="GameCatalogServer" dir=in action=allow protocol=TCP localport=8787 profile=private,domain
echo.
echo   Готово: телефон и другие компьютеры в домашней сети могут подключаться к серверу (порт 8787).
echo   Если в config.json вы поменяли порт, нужно указать новый в этом файле.
echo.
pause
