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
echo [1/3] Building backend...
dotnet publish "%ROOT%\src\InfoSupport.TradingCardGenerator.Api\InfoSupport.TradingCardGenerator.Api.csproj" -c Release -o "%ROOT%\demo\publish\api" --nologo
if errorlevel 1 (echo [ERROR] Backend build failed. & goto :failed)

echo.
echo [2/3] Installing frontend packages...
pushd "%ROOT%\src\InfoSupport.TradingCardGenerator.Web"
call npm ci
if errorlevel 1 (popd & echo [ERROR] npm ci failed. & goto :failed)

echo.
echo [3/3] Building frontend...
call npm run build
if errorlevel 1 (popd & echo [ERROR] Frontend build failed. & goto :failed)
popd

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
