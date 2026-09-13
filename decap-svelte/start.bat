@echo off
title DecapCMS — Full Stack Launcher
color 0B
echo.
echo  ==========================================
echo   DecapCMS Stack Launcher
echo   SvelteKit + Decap CMS + PocketBase
echo  ==========================================
echo.

REM ─── Check PocketBase ────────────────────────────────────────────────────────
if not exist "backend\pocketbase.exe" (
    echo  [WARNING] backend\pocketbase.exe not found!
    echo.
    echo  Download it from: https://github.com/pocketbase/pocketbase/releases
    echo  Then place pocketbase.exe in the 'backend' folder.
    echo.
    echo  Starting SvelteKit only...
    echo.
    goto :start_frontend
)

echo  [1/2] Starting PocketBase backend (port 8090)...
start "PocketBase Backend" cmd /k "cd /d %~dp0backend && pocketbase.exe serve --http=localhost:8090"
timeout /t 2 /nobreak >nul
echo  [OK] PocketBase started: http://localhost:8090
echo       Admin UI:            http://localhost:8090/_/
echo.

:start_frontend
REM ─── Check Node.js ───────────────────────────────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo  [2/2] Starting SvelteKit frontend (port 5173)...
cd /d %~dp0frontend

REM Install deps if node_modules missing
if not exist "node_modules" (
    echo  [INFO] node_modules not found. Running npm install...
    npm install
    echo.
)

start "SvelteKit Frontend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
echo  [OK] SvelteKit started: http://localhost:5173
echo       Admin Panel:         http://localhost:5173/admin/
echo.

echo  ==========================================
echo   All services running!
echo  ==========================================
echo.
echo   Frontend:    http://localhost:5173
echo   Admin CMS:   http://localhost:5173/admin/
echo   PocketBase:  http://localhost:8090
echo   PB Admin:    http://localhost:8090/_/
echo.
echo  Press any key to exit this launcher...
echo  (The server windows will keep running)
echo.
pause
