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

REM Set backend port to 8000
set BACKEND_PORT=8000
set FRONTEND_PORT=8080

REM Start the backend server in production mode
start "Backend" cmd /k python -m uvicorn backend.main:app --host 0.0.0.0 --port %BACKEND_PORT%

REM Build frontend
cd frontend
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
call npm install
call npm run build

REM Start the frontend server in production mode
call npm install -g serve
start "Frontend" cmd /k serve dist -l %FRONTEND_PORT%

REM Note: Manual process management is required on Windows.
