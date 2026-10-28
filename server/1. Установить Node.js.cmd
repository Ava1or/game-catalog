@echo off
chcp 65001 >nul
title Установка Node.js
echo.
echo   Устанавливаем Node.js (бесплатная программа, нужная серверу).
echo   Если Windows спросит разрешение, нажмите "Да".
echo.
where node >nul 2>nul
if not errorlevel 1 (
  echo   Node.js уже установлен. Ничего делать не нужно.
  echo   Переходите к файлу "2. Запустить сервер".
  echo.
  pause
  exit /b 0
)
where winget >nul 2>nul
if errorlevel 1 (
  echo   В этой версии Windows нет автоматической установки.
  echo   Откройте сайт nodejs.org, нажмите кнопку LTS, запустите скачанный файл
  echo   и везде нажимайте "Next". Подробно: в файле ИНСТРУКЦИЯ.html, шаг 2.
  echo.
  pause
  exit /b 1
)
winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
echo.
echo   Готово. Закройте это окно и запустите файл "2. Запустить сервер".
echo   Если появилась ошибка, установите Node.js вручную: ИНСТРУКЦИЯ.html, шаг 2.
echo.
pause
