@echo off
chcp 65001 >nul
title Адрес и код сервера
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Не найден Node.js. Сначала выполните шаг 2 из ИНСТРУКЦИИ.html.
  echo.
  pause
  exit /b 1
)
node server.mjs --info
pause
