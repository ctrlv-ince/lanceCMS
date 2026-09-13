@echo off
title PocketBase Backend
color 0A
echo.
echo  ██████╗  ██████╗  ██████╗██╗  ██╗███████╗████████╗██████╗  █████╗ ███████╗███████╗
echo  ██╔══██╗██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██╔════╝
echo  ██████╔╝██║   ██║██║     █████╔╝ █████╗     ██║   ██████╔╝███████║███████╗█████╗
echo  ██╔═══╝ ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║   ██╔══██╗██╔══██║╚════██║██╔══╝
echo  ██║     ╚██████╔╝╚██████╗██║  ██╗███████╗   ██║   ██████╔╝██║  ██║███████║███████╗
echo  ╚═╝      ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝
echo.
echo  Starting PocketBase backend on http://localhost:8090
echo  Admin dashboard: http://localhost:8090/_/
echo  API endpoint:    http://localhost:8090/api/
echo.

REM Check if pocketbase.exe exists
if not exist "pocketbase.exe" (
    echo  [ERROR] pocketbase.exe not found in backend/ folder!
    echo.
    echo  Please download PocketBase for Windows:
    echo  https://github.com/pocketbase/pocketbase/releases
    echo.
    echo  1. Download pocketbase_X.X.X_windows_amd64.zip
    echo  2. Extract pocketbase.exe to this folder (decap-svelte\backend\)
    echo  3. Run this script again
    echo.
    pause
    exit /b 1
)

echo  [OK] pocketbase.exe found. Starting server...
echo.
pocketbase.exe serve --http="localhost:8090"
pause
