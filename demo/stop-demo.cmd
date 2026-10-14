@echo off
rem Stops the backend, frontend and kiosk browser. Pass /quiet to skip the final pause.
setlocal

taskkill /fi "WINDOWTITLE eq TCG Backend*" /t /f >nul 2>&1
taskkill /fi "WINDOWTITLE eq TCG Frontend*" /t /f >nul 2>&1
taskkill /im InfoSupport.TradingCardGenerator.Api.exe /f >nul 2>&1

rem Fallback: free the ports in case a previous run left orphaned processes behind
for %%P in (5000 3000) do (
    for /f "tokens=5" %%I in ('netstat -ano ^| findstr /r /c:"127.0.0.1:%%P .*LISTENING" /c:"\[::1\]:%%P .*LISTENING" /c:"0.0.0.0:%%P .*LISTENING" /c:"\[::\]:%%P .*LISTENING"') do (
        taskkill /pid %%I /t /f >nul 2>&1
    )
)

rem Only close the kiosk Chrome (dedicated profile), not any other Chrome windows
powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'chrome.exe' -and $_.CommandLine -like '*TradingCardGenerator\ChromeKiosk*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }" >nul 2>&1

if /i not "%~1"=="/quiet" (
    echo Demo stopped.
    timeout /t 3 >nul
)
exit /b 0
