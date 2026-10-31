@echo off
chcp 65001 >nul
title Allow access to the server on the home network
net session >nul 2>nul
if errorlevel 1 (
  echo.
  echo   This file must be run as administrator:
  echo   close this window, right-click the file
  echo   and choose "Run as administrator".
  echo.
  pause
  exit /b 1
)
netsh advfirewall firewall delete rule name="GameCatalogServer" >nul 2>nul
netsh advfirewall firewall add rule name="GameCatalogServer" dir=in action=allow protocol=TCP localport=8787 profile=private,domain
echo.
echo   Done: your phone and other computers on the home network can now connect to the server (port 8787).
echo   If you changed the port in config.json, put the new one in this file.
echo.
pause
