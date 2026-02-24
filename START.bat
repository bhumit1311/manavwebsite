@echo off
title Shraddha Videology — Server
echo ============================================
echo   Shraddha Videology — Starting Server...
echo ============================================
echo.

:: Check if Node.js is installed
node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download it from: https://nodejs.org
    pause
    exit /b
)

:: Install packages if needed
if not exist "node_modules" (
    echo Installing packages for the first time...
    echo This takes about 1 minute. Please wait...
    npm install
    echo.
)

echo  Starting server...
echo.

:: Start server in background, wait 2 seconds, then open browser
start "" /B node server.js

:: Wait 2 seconds for server to boot
timeout /t 2 /nobreak >nul

:: Open browser automatically
echo  Opening browser...
start "" "http://localhost:3001/admin.html"

echo.
echo ============================================
echo   Server is ON!
echo.
echo   Portfolio : http://localhost:3001
echo   Admin     : http://localhost:3001/admin.html
echo.
echo   Browser opened automatically!
echo   Press CTRL+C to stop the server.
echo ============================================
echo.

:: Keep window alive (so CTRL+C can kill node)
:loop
timeout /t 60 /nobreak >nul
goto loop
