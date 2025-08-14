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
FRONTEND_PORT=8080

# Start the backend server in production mode (no reload)
echo "Starting backend server (production)..."
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port $BACKEND_PORT &
BACKEND_PID=$!

# Start the frontend server in production mode (build and serve dist)
cd frontend
export ROLLUP_NO_NATIVE=true
rm -rf node_modules package-lock.json
npm install
npm run build

echo "Starting frontend server (production)..."
npx serve dist -l $FRONTEND_PORT &
FRONTEND_PID=$!

# Wait for both processes
trap "kill $BACKEND_PID $FRONTEND_PID" SIGINT SIGTERM
wait $BACKEND_PID $FRONTEND_PID
