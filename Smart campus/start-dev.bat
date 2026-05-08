@echo off
REM Smart Campus - Start All Servers

title Smart Campus - Backend & Frontend

REM Colors for console
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   Smart Campus Event Management System - Startup Script       ║
echo ║                    Starting Backend...                         ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Start Backend
start cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    Starting Frontend...                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Start Frontend
start cmd /k "cd frontend && npm start"

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║              ✓ Both servers are starting!                     ║
echo ║                                                                ║
echo ║  Backend will run on:  http://localhost:5000                 ║
echo ║  Frontend will run on: http://localhost:3000                 ║
echo ║                                                                ║
echo ║  Press any key to close this window                           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

pause
