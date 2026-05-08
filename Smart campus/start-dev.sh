#!/bin/bash

# Smart Campus - Start All Servers (Mac/Linux)

clear

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   Smart Campus Event Management System - Startup Script       ║"
echo "║                   Starting Services...                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to handle Ctrl+C
trap cleanup INT

# Check if node_modules exist
echo "Checking dependencies..."

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Start Backend
echo ""
echo "Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start Frontend
echo ""
echo "Starting Frontend Server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              ✓ Both servers are running!                      ║"
echo "║                                                                ║"
echo "║  Backend:  http://localhost:5000                             ║"
echo "║  Frontend: http://localhost:3000                             ║"
echo "║                                                                ║"
echo "║  Press Ctrl+C to stop all services                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
