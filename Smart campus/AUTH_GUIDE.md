# Smart Campus Event Management System - With Authentication

## New Features Added

### 1. **Login System** (login.html)
- Clean, modern login interface matching the dashboard design
- Email and password authentication
- Remember Me checkbox for persistent sessions
- Smooth animations and gradient backgrounds
- Form validation with error handling
- Redirect to dashboard on successful login

### 2. **Registration System** (register.html)
- User-friendly account creation form
- Fields: First Name, Last Name, Email, Student ID, Password
- Password strength indicator with visual feedback
- Password confirmation validation
- Terms & Conditions agreement required
- Email validation
- Duplicate email prevention
- Smooth form scrolling on mobile

### 3. **Authentication Manager** (auth.js)
The core authentication module handles:
- User registration with data validation
- Login with password verification
- Session management with localStorage
- Password strength calculation
- Email validation
- User data persistence
- Logout functionality
- Remember Me functionality

### 4. **User Profile Display** (in index.html)
Located in the header, includes:
- User avatar with initials
- Full name and email display
- Student ID in dropdown
- Profile dropdown menu
- Responsive design (hides text on mobile, shows avatar only)

### 5. **Logout Button**
- Convenient logout option in dropdown menu
- Confirmation dialog before logout
- Clears session and redirects to login page
- Secure session termination

---

## File Structure

```
Smart campus/
├── login.html           # Login page
├── register.html        # Registration page
├── index.html           # Main dashboard (updated)
├── style.css            # Styles (updated with auth UI)
├── script.js            # Event manager (updated with auth checks)
├── auth.js              # Authentication manager (NEW)
├── README.md            # Original documentation
└── AUTH_GUIDE.md        # This file
```

---

## How Authentication Works

### Registration Flow
1. User clicks "Create Account" on login page
2. Fills in registration form with details
3. System validates all fields
4. Password strength indicator shows strength
5. User agrees to terms & conditions
6. Account created and stored in localStorage
7. Redirects to login page

### Login Flow
1. User enters email and password
2. System validates credentials
3. Checks if email exists in users database
4. Verifies password hash matches
5. Creates session with user data
6. Redirects to dashboard
7. User profile displays in header

### Access Control
- Dashboard (index.html) checks authentication on load
- Unauthorized users redirected to login
- Events show Edit/Delete buttons only for creator
- Only event creator can edit/delete their events

### Data Storage
All data stored in browser's localStorage:
- `campusUsers` - User accounts database
- `currentUser` - Currently logged-in user session
- `campusEvents` - Event data
- `rememberMe` - Remember Me preference

---

## Test Accounts

To test the system, you can create accounts during registration.

**Example Registration:**
- First Name: John
- Last Name: Doe
- Email: john@campus.edu
- Student ID: STU123456
- Password: Test@123
- Confirm Password: Test@123

---

## Security Features

### Password Management
- Minimum 6 characters required
- Simple hash function for demo (suitable for local storage)
- Password confirmation required during registration
- Password strength indicator guides users

### Email Validation
- Validates email format (user@domain.xxx)
- Prevents duplicate email registration
- Case-insensitive email matching

### Session Management
- Sessions stored in localStorage
- Automatic logout on browser close (if Remember Me not checked)
- User context maintained across page navigation
- Logout clears all session data

### Data Validation
- All form fields validated before submission
- Client-side validation for user experience
- Empty field prevention
- Type-specific validation (email, numbers, etc.)

---

## User Interface

### Login Page
- Gradient background matching campaign brand
- White card with header and footer sections
- Responsive design for all screen sizes
- Social login prompt area (ready for expansion)
- Forgot password link (ready for implementation)

### Registration Page
- Multi-field form with proper spacing
- Password strength visual indicator
- Inline validation messages
- Terms & conditions checkbox
- Mobile-optimized scrollable form

### Dashboard Header
- User profile with avatar (shows initials)
- Name and email display
- Dropdown menu on hover
- Student ID visible in dropdown
- Logout button with confirmation

---

## Responsive Design

### Desktop (1024px+)
- Full header with user info displayed
- Side-by-side layout maintained
- Dropdown menu visible on hover

### Tablet (768px - 1023px)
- Adjusted spacing and font sizes
- User info still visible
- Touch-friendly buttons

### Mobile (< 768px)
- Compact header
- Avatar only (text hidden)
- Dropdown menu repositioned
- Full-width forms
- Optimized form field layout

---

## Features Yet to Implement

For production deployment, consider adding:
- Backend API integration
- Secure password hashing (bcrypt)
- Email verification
- Password reset functionality
- Two-factor authentication
- OAuth/Social login
- User profile editing
- Profile picture uploads
- Activity logging
- Admin dashboard
- User management panel
- Role-based access control (Admin, Moderator, Student)

---

## Usage Instructions

### For Users

1. **First Time Access:**
   - Open index.html
   - Auto-redirected to login.html
   - Click "Create Account"
   - Fill registration form
   - Account created (redirects to login)

2. **Login:**
   - Enter email and password
   - Optional: Check "Remember Me"
   - Click "Sign In"
   - Redirected to dashboard

3. **Dashboard:**
   - View all events in grid layout
   - Filter by category
   - Search events
   - Create new events (auto-filled organizer name)
   - Register for events
   - View event details
   - Edit/Delete own events only

4. **Logout:**
   - Click user profile in header
   - Click "Logout"
   - Confirm logout
   - Redirected to login page
   - Session cleared

### For Developers

#### Accessing Current User
```javascript
const user = window.authManager.getCurrentUser();
// Returns: { id, firstName, lastName, email, studentId }
```

#### Checking Authentication
```javascript
if (window.authManager.isAuthenticated()) {
    // User is logged in
}
```

#### Manual Logout
```javascript
window.authManager.logout();
```

#### Adding New User
```javascript
const newUser = {
    firstName: "...",
    lastName: "...",
    email: "...",
    studentId: "...",
    password: authManager.hashPassword("...")
};
window.authManager.users.push(newUser);
window.authManager.saveUsersToStorage();
```

---

## Troubleshooting

### Not Redirecting to Login
- Clear browser localStorage
- Check browser console for errors
- Ensure auth.js loads before script.js

### Password Not Validating
- Minimum 6 characters required
- Check exact email used during registration
- Password is case-sensitive

### Profile Not Displaying
- Verify user is logged in
- Check browser console for errors
- Ensure currentUser is stored in localStorage

### Events Not Saving
- Check browser localStorage quota
- Clear old data if storage full
- Verify JavaScript is enabled

---

## Browser Compatibility

Works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Future Enhancements

1. **Email Verification**: Send confirmation email to verify account
2. **Password Reset**: Allow users to reset forgotten passwords
3. **Profile Editor**: Let users update their profile information
4. **Advanced Search**: Filter by date range, attendee count, etc.
5. **Event Calendar**: Calendar view of events
6. **Notifications**: Email/SMS reminders for registered events
7. **Event Reviews**: Allow users to rate and review events
8. **Social Features**: Follow users, share events
9. **Mobile App**: Native iOS/Android application
10. **Analytics**: Dashboard showing event statistics

---

## License

This authentication system is part of the Smart Campus Event Management System and follows the same license terms.

---

## Support & Feedback

For issues, questions, or feature requests, please contact the development team.
