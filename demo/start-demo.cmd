@echo off
rem Starts the Trading Card Generator demo: backend, frontend and a full-screen kiosk browser.
setlocal
title Trading Card Generator - Launcher
cd /d "%~dp0.."
set "ROOT=%CD%"
set "API_DIR=%ROOT%\demo\publish\api"
set "WEB_DIR=%ROOT%\src\InfoSupport.TradingCardGenerator.Web"
set "LOGS=%ROOT%\demo\logs"
set "DEMO_PAGE=medieval"

echo.
echo  ===============================================
echo    Trading Card Generator - starting the demo
echo    Please wait, this takes about 30 seconds...
echo  ===============================================
echo.

if not exist "%~dp0secrets.cmd" (echo [ERROR] demo\secrets.cmd is missing. Run prepare-demo.cmd first. & goto :failed)
if not exist "%API_DIR%\InfoSupport.TradingCardGenerator.Api.exe" (echo [ERROR] Backend is not built. Run prepare-demo.cmd first. & goto :failed)
if not exist "%WEB_DIR%\.next\BUILD_ID" (echo [ERROR] Frontend is not built. Run prepare-demo.cmd first. & goto :failed)

call "%~dp0secrets.cmd"

rem Clean up anything left over from a previous run
call "%~dp0stop-demo.cmd" /quiet

rem Keep the laptop and screen awake while plugged in
powercfg /change standby-timeout-ac 0 >nul 2>&1
powercfg /change monitor-timeout-ac 0 >nul 2>&1

if not exist "%LOGS%" mkdir "%LOGS%"
if exist "%LOGS%\backend.log" move /y "%LOGS%\backend.log" "%LOGS%\backend.previous.log" >nul
if exist "%LOGS%\frontend.log" move /y "%LOGS%\frontend.log" "%LOGS%\frontend.previous.log" >nul

set "ASPNETCORE_ENVIRONMENT=Production"
set "ASPNETCORE_URLS=http://localhost:5000"
set "PORT=3000"

echo [1/3] Starting backend...
start "TCG Backend" /min /d "%API_DIR%" cmd /c ""%API_DIR%\InfoSupport.TradingCardGenerator.Api.exe" > "%LOGS%\backend.log" 2>&1"
call :wait_for "http://localhost:5000/cards/medieval/scenes" "backend" || goto :failed

echo [2/3] Starting frontend...
start "TCG Frontend" /min /d "%WEB_DIR%" cmd /c "npm run start > "%LOGS%\frontend.log" 2>&1"
call :wait_for "http://localhost:3000/%DEMO_PAGE%" "frontend" || goto :failed

echo [3/3] Opening the browser...
rem --use-fake-ui-for-media-stream auto-accepts the camera prompt so the kiosk never blocks on it
start "" msedge --kiosk "http://localhost:3000/%DEMO_PAGE%" --edge-kiosk-type=fullscreen --no-first-run --use-fake-ui-for-media-stream

echo.
echo The demo is running. You can close this window.
echo To exit the full-screen browser press Alt+F4. To stop everything run stop-demo.cmd.
timeout /t 10 >nul
exit /b 0

:wait_for
rem Polls a URL for up to ~2 minutes
set /a ATTEMPTS=0
:wait_loop
curl -s -f -o nul --max-time 5 "%~1" && exit /b 0
set /a ATTEMPTS+=1
if %ATTEMPTS% geq 60 (
    echo [ERROR] The %~2 did not start in time.
    exit /b 1
)
timeout /t 2 /nobreak >nul
goto :wait_loop

:failed
echo.
echo  ===============================================
echo    The demo could not start.
echo    1. Restart the laptop and try again.
echo    2. Still broken? Send the files in
echo       %LOGS%
echo       to the demo owner.
echo  ===============================================
call "%~dp0stop-demo.cmd" /quiet
pause
exit /b 1
