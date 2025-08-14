@echo off
REM Change to script directory
cd /d %~dp0

REM Check if requirements are already installed (marker file)
if not exist backend\.requirements_installed (
    echo Installing Python requirements...
    pip install -r backend\requirements.txt && echo. > backend\.requirements_installed
) else (
    echo Python requirements already installed. Skipping installation.
)

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org and add it to your PATH.
    pause
    exit /b
)

REM Check if npm is installed
where npm >nul 2>nul
if errorlevel 1 (
    echo npm is not installed. Please install Node.js (which includes npm) and add it to your PATH.
    pause
    exit /b
)

REM Check if serve is installed globally
npm list -g serve >nul 2>nul
if errorlevel 1 (
    echo Installing 'serve' globally...
    npm install -g serve
)

REM Set backend port to 8000
set BACKEND_PORT=8000
set FRONTEND_PORT=8080

REM Start the backend server in production mode
start "Backend" cmd /k python -m uvicorn backend.main:app --host 0.0.0.0 --port %BACKEND_PORT%

REM Build frontend
cd frontend
if not exist node_modules (
    call npm install
)
call npm run build

REM Start the frontend server in production mode
start "Frontend" cmd /k serve dist -l %FRONTEND_PORT%

REM Note: Manual process management is required on Windows.
