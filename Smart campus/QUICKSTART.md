# 🚀 Quick Start Guide

## One-Command Startup (Windows)

If you're on Windows, simply double-click:
```
start-dev.bat
```

This will automatically open two terminal windows and start both servers.

## Step-by-Step Manual Startup

### Windows PowerShell / CMD:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Mac/Linux:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Or use the shell script:
```bash
chmod +x start-dev.sh
./start-dev.sh
```

## First Time Setup

If this is your first time running the project:

**Terminal 1:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2:**
```bash
cd frontend
npm install
npm start
```

## Access Your Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## Test the App

1. Click "Create New Account"
2. Fill in the registration form
3. You're now logged in!
4. Browse events or create a new one
5. Register for events
6. Check "My Events" to see registrations

## Troubleshooting

### Still Getting Errors?

1. Check that MySQL is running
2. Make sure Node.js is installed (`node --version`)
3. Delete `node_modules` and reinstall dependencies
4. Check the SETUP.md for detailed troubleshooting

### Port Already in Use?

Change ports in environment variables or use:
```bash
# Windows - Kill process on port
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Next Steps

- Read SETUP.md for detailed configuration
- Check backend/README.md for API documentation
- Check frontend/README.md for component info
- Review individual file comments for implementation details

## Support Files

- 📄 README.md - Main documentation
- 📄 SETUP.md - Detailed setup guide
- 📄 IMPLEMENTATION_SUMMARY.md - Technical details
- 📄 backend/README.md - API documentation
- 📄 frontend/README.md - Frontend guide

---

**Ready to manage campus events! 🎓**
