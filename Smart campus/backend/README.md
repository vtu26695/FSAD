# Smart Campus Event Management System - Backend

A professional Node.js + Express backend for the Smart Campus Event Management System with MySQL database integration.

## Technologies

- **Node.js** with Express.js
- **MySQL 2** for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** for cross-origin requests

## Features

- User authentication (Registration & Login)
- Event CRUD operations
- Event filtering and search
- Event registration management
- User profile management
- JWT-based authorization

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=smart_campus
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

### 3. Start the Backend Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Events
- `GET /api/events` - Get all events (with optional filters)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (protected)
- `PUT /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)
- `POST /api/events/:eventId/register` - Register for event (protected)
- `DELETE /api/events/:eventId/register` - Unregister from event (protected)
- `GET /api/events/user/my-events` - Get user's registered events (protected)

## Database Schema

### Users Table
- id (Primary Key)
- firstName
- lastName
- email (Unique)
- studentId
- password (hashed)
- avatar
- createdAt
- updatedAt

### Events Table
- id (Primary Key)
- title
- description
- date
- time
- location
- category
- capacity
- registeredCount
- organizer
- image
- createdBy (Foreign Key -> users.id)
- createdAt
- updatedAt

### Registrations Table
- id (Primary Key)
- userId (Foreign Key -> users.id)
- eventId (Foreign Key -> events.id)
- registeredAt
- Unique constraint on (userId, eventId)

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Input validation with express-validator
- CORS protection
- SQL injection prevention with parameterized queries

## License

ISC
