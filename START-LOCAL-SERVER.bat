@echo off
setlocal
title JanSathi AI - Local Server
cd /d "%~dp0"

echo ==========================================
echo          Starting JanSathi AI
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not on PATH.
  echo Install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

if not exist "package.json" (
  echo ERROR: package.json was not found.
  echo Put this file beside package.json in your project root.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing project dependencies for the first run...
  call npm.cmd install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

echo Starting the development server.
echo Keep this window open while using the local website.
echo Press Ctrl+C to stop it.
echo.
call npm.cmd run dev
echo.
echo The server has stopped.
pause
