# Smart Campus Event Management System - Frontend

A professional React.js frontend for the Smart Campus Event Management System with Tailwind CSS styling.

## Technologies

- **React 18** with React Router DOM
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Icons** for icons
- **React Toastify** for notifications
- **date-fns** for date formatting

## Features

- User authentication (Login & Register)
- Browse all events with filtering
- Search events
- Filter by event category
- Event registration management
- View event details
- Create, edit, and delete events (for event creators)
- Responsive design for mobile and desktop
- Professional UI with Tailwind CSS

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Frontend Server

```bash
npm start
```

The application will open on `http://localhost:3000`

### 3. Environment Configuration

The API URL is configured to use `http://localhost:5000` by default. To change it, create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── EventCard.js
│   │   └── ProtectedRoute.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── EventsPage.js
│   │   ├── EventDetailPage.js
│   │   ├── CreateEventPage.js
│   │   └── MyEventsPage.js
│   ├── services/
│   │   ├── api.js
│   │   └── authService.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Pages

- **Login Page** - User login with email and password
- **Register Page** - New user registration
- **Events Page** - Browse and search all events
- **Event Detail Page** - View event details and register/unregister
- **Create Event Page** - Create new event (authenticated users)
- **My Events Page** - View registered events (authenticated users)

## Components

- **Navbar** - Navigation with user profile and logout
- **EventCard** - Event display card with action buttons
- **ProtectedRoute** - Route protection for authenticated users

## API Integration

All API calls are made through the Axios client configured in `services/api.js` with:
- Automatic token attachment to requests
- Automatic redirect to login on 401 errors
- Error handling and logging

## Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is attached to all subsequent API requests
4. On token expiration or 401 error, user is redirected to login
5. AuthContext manages global authentication state

## Build

To create a production build:

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## License

ISC
