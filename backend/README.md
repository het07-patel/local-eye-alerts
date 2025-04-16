
# StreetSense Backend

This is the backend service for the StreetSense application, a platform for reporting and tracking local infrastructure problems in Surat city.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get a specific problem
- `POST /api/problems` - Create a new problem (requires authentication)
- `PATCH /api/problems/:id/status` - Update a problem status (requires authentication)
- `POST /api/problems/:id/upvote` - Upvote a problem (requires authentication)

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user profile (requires authentication)
