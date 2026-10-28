@echo off
chcp 65001 >nul
title Каталог игр - сервер
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Не найден Node.js. Сначала запустите файл "1. Установить Node.js"
  echo   или установите Node.js вручную с сайта nodejs.org ^(кнопка LTS^).
  echo   После установки закройте это окно и запустите этот файл снова.
  echo.
  pause
  exit /b 1
)
node server.mjs
echo.
echo   Сервер остановлен. Чтобы запустить снова, закройте это окно и откройте файл заново.
pause
