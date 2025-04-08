# Custom Auth Service

## Setup Instructions

1. Install **Node.js v22**.
2. Clone this repository and navigate to the `auth-service` directory:
   ```bash
   cd ./auth-service
   ```
3. Install the dependencies:
   ```bash
   npm i
   ```
4. Start the server:
   ```bash
   npm run start
   ```
5. Or run unit tests with 
   ```bash
   npm test
   ```
6. The server will start on `http://localhost:8000/`

### Environment Variables
Ensure you set up the following environment variables in a `.env` file:

```plaintext
ACCESS_TOKEN_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret-key
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
DATABASE_URL=your-postgres-db
```

---

## API Endpoints
All endpoints are prefixed with: /auth

### Authentication Routes

GET `/auth/google/callback`

Google OAuth2 callback. On success, sends a message with the access token to the parent window and closes the popup.

POST `/auth/register`

Register a new user.  
Body:
```json
{
  "username": "your-name",
  "email": "you@example.com",
  "password": "your-password"
}
```

POST `/auth/login`

Log in an existing user with email and password.
Body:
```json
{
  "email": "you@example.com",
  "password": "your-password"
}
```

POST `/auth/token`

Generate a new access token using a valid refresh token.  
Body:
```json
{
  "token": "your-refresh-token"
}
```

---

## Testing

The project uses Jest for testing.

Run all tests:
npm test

---
