#!/bin/bash

# Change to script directory
cd "$(dirname "$0")"

# Check if requirements are already installed (marker file)
if [ ! -f "backend/.requirements_installed" ]; then
    echo "Installing Python requirements..."
    pip install -r backend/requirements.txt && touch backend/.requirements_installed
else
    echo "Python requirements already installed. Skipping installation."
fi

# Set backend port to 8000
BACKEND_PORT=8000

# Start the backend server from project root
echo "Starting backend server..."
python3 -m uvicorn backend.main:app --reload --host 127.0.0.1 --port $BACKEND_PORT &
BACKEND_PID=$!

# Start the frontend server
cd frontend
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
trap "kill $BACKEND_PID $FRONTEND_PID" SIGINT SIGTERM
wait $BACKEND_PID $FRONTEND_PID
