# 🚀 Installation & Setup Guide

## Step 1: Prerequisites Check

Before starting, make sure you have:

- ✅ Node.js (v14 or higher) - [Download](https://nodejs.org/)
- ✅ MySQL Server (v5.7 or higher) - [Download](https://www.mysql.com/downloads/)
- ✅ npm or yarn package manager (comes with Node.js)
- ✅ Git (optional but recommended) - [Download](https://git-scm.com/)

Verify installations:
```bash
node --version
npm --version
mysql --version
```

## Step 2: Database Setup

### Option A: Automatic (Recommended)
The backend automatically creates tables on first run. Just ensure MySQL is running.

### Option B: Manual
1. Open MySQL CLI or MySQL Workbench
2. Create database:
```sql
CREATE DATABASE smart_campus;
```

3. The backend will create all tables automatically when it starts.

## Step 3: Backend Installation

1. Open terminal and navigate to the project:
```bash
cd "C:\Users\munna\Downloads\Smart campus"
```

2. Navigate to backend folder:
```bash
cd backend
```

3. Install dependencies:
```bash
npm install
```

4. Create `.env` file with your configuration:
```bash
# Windows (PowerShell)
echo @"
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=smart_campus
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
"@ > .env
```

Or create it manually with these contents:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=smart_campus
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

5. Verify the .env file was created:
```bash
cat .env
```

## Step 4: Frontend Installation

1. Navigate to frontend folder (from project root):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 5: Running the Application

### Terminal 1 - Start Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
✓ Database connected successfully
✓ Backend server running on http://localhost:5000
```

### Terminal 2 - Start Frontend Server

```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!
You can now view smart-campus-frontend in the browser.
  Local: http://localhost:3000
```

## Step 6: Access the Application

1. Open your browser
2. Go to `http://localhost:3000`
3. You should see the Smart Campus login page

## 🔧 Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -r node_modules
npm install
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change React port:
set PORT=3001 && npm start
```

### Issue: "Cannot connect to MySQL"

**Solution:**
1. Check if MySQL is running:
   - Windows: Check Services or use `mysql.server status`
   - Mac: `brew services list`
   - Linux: `sudo service mysql status`

2. Start MySQL if not running:
   - Windows: Use MySQL installer or `mysql.server start`
   - Mac: `brew services start mysql`
   - Linux: `sudo service mysql start`

3. Check database credentials in `.env` file

### Issue: "JWT Secret not defined"

**Solution:**
Make sure `.env` file has `JWT_SECRET` variable set

### Issue: "CORS error" in browser console

**Solution:**
1. Ensure backend is running on port 5000
2. Check that frontend `.env` has correct API URL
3. Restart both servers

## 📝 First Time User Guide

### 1. Create an Account
- Click "Create New Account" on login page
- Fill in your details:
  - First Name: e.g., "John"
  - Last Name: e.g., "Doe"
  - Email: e.g., "john.doe@college.edu"
  - Student ID: e.g., "STU123456"
  - Password: Choose a strong password (min 6 characters)
- Click "Create Account"

### 2. Browse Events
- You'll be redirected to the events page
- Browse all available events
- Use search bar to find specific events
- Use category filter to narrow down events

### 3. Register for an Event
- Click "View Details" on any event card
- Click "Register for Event" button
- You'll see confirmation message

### 4. View Your Events
- Click "My Events" in the navigation bar
- See all events you're registered for

### 5. Create an Event
- Click "+ Create Event" button
- Fill in event details
- Click "Create Event"
- Your event will appear in the listings

## 🔐 Security Notes

- Change `JWT_SECRET` in production
- Never commit `.env` file to version control
- Use strong passwords (min 12 characters recommended)
- Keep Node.js and npm updated
- Regularly update dependencies: `npm update`

## 📦 Project Dependencies

### Backend
- express: Web framework
- mysql2: MySQL driver
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- express-validator: Input validation
- cors: Cross-origin support

### Frontend
- react: UI library
- react-router-dom: Navigation
- tailwindcss: Styling
- axios: HTTP client
- react-icons: Icon library
- react-toastify: Notifications

## 🎯 Next Steps

1. **Customize Configuration**
   - Update JWT_SECRET in production
   - Configure database credentials
   - Set appropriate API endpoints

2. **Development**
   - Read backend/README.md for API details
   - Read frontend/README.md for component info
   - Check individual file comments for implementation details

3. **Deployment**
   - Build frontend: `npm run build`
   - Deploy backend to server (Heroku, AWS, etc.)
   - Deploy frontend to hosting (Vercel, Netlify, etc.)

## 📞 Need Help?

- Check individual README files in backend/ and frontend/ folders
- Review API documentation in backend/README.md
- Check .env configuration
- Review browser console for errors
- Check terminal output for server logs

## ✅ Verification Checklist

- [ ] Node.js and npm installed
- [ ] MySQL server running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend .env file created
- [ ] Backend server running on :5000
- [ ] Frontend server running on :3000
- [ ] Can access http://localhost:3000
- [ ] Can create account
- [ ] Can browse events
- [ ] Can register for events

---

**Congratulations! 🎉 Smart Campus is ready to use!**
