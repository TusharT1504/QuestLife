# Authentication System

This project now has a complete authentication system integrated with the backend using JWT tokens.

## Features

✅ **Login & Signup Forms** - Connected to backend API endpoints
✅ **JWT Token Management** - Automatic token storage and retrieval
✅ **Form Validation** - Client-side validation with error handling
✅ **Loading States** - Visual feedback during API calls
✅ **Error Handling** - Graceful error display for users
✅ **Authentication Context** - Global state management
✅ **Protected Routes** - Ready for future implementation

## API Endpoints

### Signup
- **Endpoint**: `POST /api/auth/signup`
- **Body**: `{ username, email, password }`
- **Response**: `{ token }`

### Login
- **Endpoint**: `POST /api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ token }`

## How It Works

1. **Authentication Service** (`src/services/authService.js`)
   - Handles all API calls to the backend
   - Manages JWT token storage in localStorage
   - Provides helper functions for authentication

2. **Auth Context** (`src/context/AuthContext.jsx`)
   - Manages global authentication state
   - Provides login, signup, and logout functions
   - Automatically checks authentication status on app load

3. **Login Component** (`src/pages/Login.jsx`)
   - Form validation and error handling
   - Loading states during API calls
   - Redirects to home page after successful login

4. **Signup Component** (`src/pages/Signup.jsx`)
   - Comprehensive form validation
   - Password confirmation check
   - Redirects to home page after successful signup

5. **Navbar Component** (`src/components/Navbar.jsx`)
   - Shows login/signup links when not authenticated
   - Shows user avatar and logout button when authenticated
   - Uses AuthContext for state management

## Usage

### Login
1. Navigate to `/login`
2. Enter email and password
3. Click "Sign In"
4. On success, redirected to home page

### Signup
1. Navigate to `/signup`
2. Fill in username, email, password, and confirm password
3. Click "Create Account"
4. On success, redirected to home page

### Logout
1. Click the logout button in the navbar
2. User is logged out and redirected to home page

## Security Features

- JWT tokens stored in localStorage
- Automatic token inclusion in API requests
- Form validation prevents empty submissions
- Error handling for invalid credentials
- Secure password requirements (minimum 6 characters)

## Backend Requirements

Make sure your backend server is running on `http://localhost:5000` and has the following:

1. **Environment Variables**:
   - `JWT_SECRET` - Secret key for JWT token signing
   - `PORT` - Server port (defaults to 5000)

2. **Database Connection**:
   - MongoDB connection configured
   - User model with username, email, and password fields

3. **Middleware**:
   - CORS enabled for frontend requests
   - Body parsing middleware
   - JWT authentication middleware

## Testing

1. Start the backend server: `cd Backend && npm start`
2. Start the frontend: `cd Frontend && npm run dev`
3. Test signup with a new account
4. Test login with the created account
5. Test logout functionality

The authentication system is now fully functional and ready for use! 