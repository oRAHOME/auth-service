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
5. The server will start on `http://localhost:8000/`

### Environment Variables
Ensure you set up the following environment variables in a `.env` file:

```plaintext
ACCESS_TOKEN_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret-key
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

---
