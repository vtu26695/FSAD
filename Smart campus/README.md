# Smart Campus Event Management System

A modern, professional web application for managing and discovering campus events. Built with React.js, Node.js, Express, and MySQL.

## 🎯 Overview

Smart Campus is a full-stack event management system designed for educational institutions. It allows students and faculty to create, discover, and register for campus events across multiple categories.

## ✨ Key Features

### User Management
- User registration and login with JWT authentication
- Secure password hashing
- User profile management
- Student ID tracking

### Event Management
- Create, read, update, and delete events
- Event categorization (Academic, Sports, Cultural, Social, Workshop, Seminar)
- Event capacity tracking
- Event registration and unregistration
- Event search and filtering
- Event organizer information

### User Interface
- Responsive design (mobile, tablet, desktop)
- Modern, professional UI with Tailwind CSS
- Real-time notifications with React Toastify
- Intuitive navigation
- Event cards with key information
- Detailed event pages

## 🏗️ Architecture

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MySQL
- **Authentication**: JWT
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing

### Frontend
- **Framework**: React.js with Hooks
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Icons**: React Icons

## 📁 Project Structure

```
Smart campus/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── eventController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── eventRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── server.js
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .gitignore
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── README.md
│
└── README.md (this file)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your database configuration:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smart_campus
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will open on `http://localhost:3000`

## 📊 Database Setup

The backend automatically creates the required tables on startup. However, you can manually set up the database:

```sql
CREATE DATABASE smart_campus;
USE smart_campus;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  studentId VARCHAR(50) UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  category ENUM('Academic', 'Sports', 'Cultural', 'Social', 'Workshop', 'Seminar') DEFAULT 'Academic',
  capacity INT DEFAULT 100,
  registeredCount INT DEFAULT 0,
  organizer VARCHAR(255),
  image VARCHAR(255),
  createdBy INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  eventId INT NOT NULL,
  registeredAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
  UNIQUE KEY unique_registration (userId, eventId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 🔐 Security Features

- Password hashing with bcryptjs (10 rounds)
- JWT token-based authentication
- Input validation and sanitization
- CORS protection
- SQL injection prevention with parameterized queries
- Protected routes requiring authentication
- Token expiration (24 hours)

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop browsers (1024px and above)
- Tablets (768px - 1024px)
- Mobile devices (below 768px)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile (protected)

### Events
- `GET /api/events` - Get all events
- `GET /api/events?category=Academic` - Filter events by category
- `GET /api/events?search=term` - Search events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (protected)
- `PUT /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)
- `POST /api/events/:eventId/register` - Register for event (protected)
- `DELETE /api/events/:eventId/register` - Unregister from event (protected)
- `GET /api/events/user/my-events` - Get user's registered events (protected)

## 🎨 UI Components

- **Navbar** - Header with navigation and user profile
- **EventCard** - Event display component with registration button
- **EventDetailPage** - Detailed event information
- **LoginPage** - User login form
- **RegisterPage** - User registration form
- **EventsPage** - Events listing with filters and search
- **CreateEventPage** - Event creation form
- **MyEventsPage** - User's registered events

## 🛠️ Technologies Used

### Frontend
- React 18
- React Router DOM v6
- Tailwind CSS
- Axios
- React Icons
- React Toastify
- date-fns

### Backend
- Node.js
- Express.js
- MySQL 2
- JWT
- bcryptjs
- express-validator
- CORS

## 📝 License

ISC

## 👨‍💻 Development

### Running Both Servers

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### Build for Production

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
```

## 🐛 Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify database name exists

### Port Already in Use
- Backend default: 5000
- Frontend default: 3000
- Change ports in environment variables if needed

### API Connection Issues
- Ensure backend server is running
- Check CORS configuration
- Verify API URL in frontend `.env`

## 📞 Support

For issues or questions, please refer to the individual README files in the backend and frontend directories.

---

**Happy Event Managing! 🎓**
2. No server or dependencies required - works completely client-side
3. Click "+ Create Event" to add your first event

## How to Use

### Creating an Event
1. Click the "+ Create Event" button
2. Fill in event details:
   - Event Title (required)
   - Date and Time (required)
   - Location (required)
   - Category (required)
   - Description (optional)
   - Capacity (optional)
   - Organizer (optional)
3. Click "Save Event"

### Viewing Event Details
1. Click "View Details" on any event card
2. See complete event information
3. Click "Register" to register for the event
4. Close by clicking the X or "Close" button

### Filtering Events
1. Use the sidebar navigation to filter by category
2. Use the search bar to find events by keyword
3. Filters combine for refined results

### Editing an Event
1. Click "Edit" on the event card
2. Modify the event details
3. Click "Save Event" to update

### Deleting an Event
1. Click "Delete" on the event card
2. Confirm the deletion in the popup dialog
3. Event is permanently removed

## Event Categories

- **Academic**: Lectures, seminars, workshops
- **Sports**: Athletic events, competitions
- **Cultural**: Arts, music, festivals
- **Social**: Networking, mixers, gatherings

## Data Storage

All event data is stored in the browser's local storage. This means:
- Events persist between browser sessions
- Data is stored locally on your device
- No server communication required
- Data is cleared if browser cache is cleared

## Browser Compatibility

Works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Features Breakdown

### EventManager Class (script.js)

The main class that manages all event operations:

```javascript
class EventManager {
    // Initialize the application
    init()
    
    // Event CRUD operations
    handleFormSubmit(e)
    openAddModal()
    openEditModal(eventId)
    deleteEvent(eventId)
    
    // Filtering and Search
    handleFilterChange(e)
    handleSearch(e)
    getFilteredEvents()
    
    // Display Management
    render()
    createEventCard(event)
    showEventDetails(eventId)
    
    // Registration
    registerForEvent(eventId)
    
    // Storage
    saveToLocalStorage()
    loadFromLocalStorage()
    
    // Utilities
    showToast(message, type)
    formatDateAndTime(date, time)
}
```

## Styling Highlights

- **Gradient Backgrounds**: Modern gradient colors for headers and buttons
- **Card Layout**: Responsive grid layout for event cards
- **Animations**: Smooth transitions and animations
- **Mobile Responsive**: Adapts to screens of all sizes
- **Accessibility**: Good contrast ratios and readable fonts

## Future Enhancement Ideas

- Database integration (Firebase, MongoDB)
- User authentication
- Email notifications
- Event calendar view
- Attendee list management
- Event feedback/rating system
- Recurring events
- Event reminders
- Integration with calendar apps
- Analytics dashboard

## License

This project is open source and available for educational and campus use.

## Support

For issues or suggestions, please contact the development team.
