# AI ChatBot Authentication Setup

## Google OAuth 2.0 Integration

This project assumes "Continue with Google" functionality via Passport.js on the backend.

### Backend Setup

1.  **Dependencies**:
    *   `passport`
    *   `passport-google-oauth20`
    *   `dotenv`
    *   `express-session` (optional, not strictly used in stateless JWT flow but good for passport init)

2.  **Environment Variables (`.env`)**:
    Ensure your `.env` file in the `Backend` directory contains the following:
    ```env
    GOOGLE_CLIENT_ID=your_google_client_id_here
    GOOGLE_CLIENT_SECRET=your_google_client_secret_here
    JWT_SECRET=your_jwt_secret_here
    ```

3.  **Files Modified**:
    *   `src/config/passport.js`: Created to configure the `GoogleStrategy`. It checks DB for user by email. If not found, creates a new user with a random password.
    *   `src/app.js`: Updated to initialize passport and load the config. Removed inline auth logic.
    *   `src/routes/auth.routes.js`: Added `/google` and `/google/callback` routes.
    *   `src/controllers/auth.controller.js`: Added `googleCallback` to handle the post-auth redirect logic.

### Frontend Setup

1.  **Auth Page**:
    *   The "Continue with Google" button simply redirects the browser to `http://localhost:3000/api/auth/google`.

2.  **App.jsx**:
    *   Added logic in `AppContent` to listen for `token` and `user` query parameters in the URL.
    *   If found, it saves them to `localStorage` and redirects to `/chat`.

### Flow

1.  User clicks "Continue with Google" on Frontend.
2.  Browser redirects to Backend `/api/auth/google`.
3.  Backend redirects to Google Login.
4.  User logs in.
5.  Google redirects back to Backend `/api/auth/google/callback`.
6.  Backend verifies user, creates/finds record in MongoDB.
7.  Backend generates JWT token.
8.  Backend redirects browser back to Frontend `http://localhost:5173?token=...&user=...`.
9.  Frontend `App.jsx` picks up token, saves it, and navigates to `/chat`.
