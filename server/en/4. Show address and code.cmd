@echo off
chcp 65001 >nul
title Server address and code
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js was not found. First do step 2 of INSTRUCTIONS.html.
  echo.
  pause
  exit /b 1
)
node server.mjs --info
pause
