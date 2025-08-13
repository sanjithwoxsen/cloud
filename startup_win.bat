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

REM Start the backend server from project root
start "Backend" cmd /k python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port %BACKEND_PORT%

REM Start the frontend server
cd frontend
start "Frontend" cmd /k npm run dev

REM Note: Process management (waiting and killing) is not as simple in Windows batch scripts.
REM You may need to close the windows manually or use additional tools for process control.
