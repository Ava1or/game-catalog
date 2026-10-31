@echo off
chcp 65001 >nul
title Install Node.js
echo.
echo   Installing Node.js (a free program the server needs).
echo   If Windows asks for permission, click "Yes".
echo.
where node >nul 2>nul
if not errorlevel 1 (
  echo   Node.js is already installed. You do not need to do anything.
  echo   Go on to the file "2. Start server".
  echo.
  pause
  exit /b 0
)
where winget >nul 2>nul
if errorlevel 1 (
  echo   This version of Windows has no automatic installer.
  echo   Open nodejs.org, click the LTS button, run the downloaded file
  echo   and click "Next" everywhere. Details: INSTRUCTIONS.html, step 2.
  echo.
  pause
  exit /b 1
)
winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
echo.
echo   Done. Close this window and run the file "2. Start server".
echo   If an error appeared, install Node.js manually: INSTRUCTIONS.html, step 2.
echo.
pause
