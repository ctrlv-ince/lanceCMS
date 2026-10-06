@echo off
echo Detecting local IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4 Address"') do (
    set HOST_IP=%%a
)
set HOST_IP=%HOST_IP: =%

if "%HOST_IP%"=="" (
    echo Could not detect IP address. Defaulting to localhost.
    set HOST_IP=localhost
) else (
    echo Starting Docker with HOST_IP: %HOST_IP%
)

docker compose up -d %*
echo.
echo Directus is accessible at: http://%HOST_IP%:8055
echo Angular Frontend is at:    http://%HOST_IP%
echo Projects Dashboard is at:  http://%HOST_IP%:3000
echo.
pause
