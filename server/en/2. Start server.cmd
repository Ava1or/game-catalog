@echo off
chcp 65001 >nul
title Game Catalog - server
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js was not found. First run the file "1. Install Node.js"
  echo   or install Node.js manually from nodejs.org ^(the LTS button^).
  echo   After installing, close this window and run this file again.
  echo.
  pause
  exit /b 1
)
node server.mjs
echo.
echo   The server has stopped. To start it again, close this window and open the file again.
pause
