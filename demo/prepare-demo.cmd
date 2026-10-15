@echo off
rem One-time setup: builds the backend and frontend so start-demo.cmd can run them.
rem Run this again after pulling new code.
setlocal
title Trading Card Generator - Prepare
cd /d "%~dp0.."
set "ROOT=%CD%"

where dotnet >nul 2>&1 || (echo [ERROR] .NET SDK not found. Install the .NET 10 SDK first. & goto :failed)
where npm >nul 2>&1 || (echo [ERROR] Node.js not found. Install Node.js LTS first. & goto :failed)
where curl >nul 2>&1 || (echo [ERROR] curl not found. It ships with Windows 10 1803+. & goto :failed)

echo.
echo [1/4] Building backend...
dotnet publish "%ROOT%\src\InfoSupport.TradingCardGenerator.Api\InfoSupport.TradingCardGenerator.Api.csproj" -c Release -o "%ROOT%\demo\publish\api" --nologo
if errorlevel 1 (echo [ERROR] Backend build failed. & goto :failed)

echo.
echo [2/4] Installing frontend packages...
pushd "%ROOT%\src\InfoSupport.TradingCardGenerator.Web"
call npm ci
if errorlevel 1 (popd & echo [ERROR] npm ci failed. & goto :failed)

echo.
echo [3/4] Building frontend...
call npm run build
if errorlevel 1 (popd & echo [ERROR] Frontend build failed. & goto :failed)
popd

echo.
echo [4/4] Configuring Chrome to print to the Windows default printer...
rem Kiosk printing otherwise uses the last printer picked in Chrome (often "Save as PDF").
rem Writing a Chrome policy needs admin rights, so Windows asks for permission once.
reg query "HKLM\SOFTWARE\Policies\Google\Chrome" /v PrintPreviewUseSystemDefaultPrinter 2>nul | find "0x1" >nul
if errorlevel 1 (
    powershell -NoProfile -Command "Start-Process reg -Verb RunAs -Wait -WindowStyle Hidden -ArgumentList 'add','HKLM\SOFTWARE\Policies\Google\Chrome','/v','PrintPreviewUseSystemDefaultPrinter','/t','REG_DWORD','/d','1','/f'"
    reg query "HKLM\SOFTWARE\Policies\Google\Chrome" /v PrintPreviewUseSystemDefaultPrinter 2>nul | find "0x1" >nul
    if errorlevel 1 (echo [ERROR] Could not configure Chrome printing. Run this again and click Yes on the admin prompt. & goto :failed)
)

if not exist "%~dp0secrets.cmd" (
    copy "%~dp0secrets.example.cmd" "%~dp0secrets.cmd" >nul
    echo.
    echo [ACTION NEEDED] Fill in the endpoints and API keys in the file that opens now, then save it.
    notepad "%~dp0secrets.cmd"
)

echo.
echo Done. Double-click start-demo.cmd to run the demo.
pause
exit /b 0

:failed
echo.
echo Setup did NOT complete. See the messages above.
pause
exit /b 1
