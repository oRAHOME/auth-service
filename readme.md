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
5. The server will start on `http://localhost:8000`.
## API Documentation

### Base URL
All routes are prefixed with `/auth`. The base URL is:
```
http://localhost:8000/auth
```

---

### Endpoints

#### **1. Register a User**

- **URL**: `/register`
- **Method**: `POST`
- **Description**: Register a new user with a username, password, and associated devices.

- **Request Body**:
  ```json
  {
    "username": "JohnDoe",
    "password": "mySecurePassword123",
    "devices": [
      { "name": "switch", "type": "light", "state": "off" },
      { "name": "heater", "type": "heater", "state": "off" }
    ]
  }
  ```

- **Success Response**:
  - **Status**: `201 Created`
  - **Body**:
    ```json
    {
      "message": "User created"
    }
    ```

- **Error Responses**:
  - **Status**: `400 Bad Request`
    ```json
    {
      "message": "User already exists"
    }
    ```
  - **Status**: `500 Internal Server Error`
    ```json
    {
      "message": "Error creating user"
    }
    ```

---

#### **2. Login a User**

- **URL**: `/login`
- **Method**: `POST`
- **Description**: Authenticate a user and retrieve an access token and refresh token.

- **Request Body**:
  ```json
  {
    "username": "JohnDoe",
    "password": "mySecurePassword123"
  }
  ```

- **Success Response**:
  - **Status**: `200 OK`
  - **Body**:
    ```json
    {
      "accessToken": "<JWT_ACCESS_TOKEN>",
      "refreshToken": "<JWT_REFRESH_TOKEN>"
    }
    ```

- **Error Responses**:
  - **Status**: `400 Bad Request`
    ```json
    {
      "message": "User not found"
    }
    ```
  - **Status**: `401 Unauthorized`
    ```json
    {
      "message": "Incorrect credentials"
    }
    ```
  - **Status**: `500 Internal Server Error`
    ```json
    {
      "message": "Error logging in"
    }
    ```

---

#### **3. Refresh Access Token**

- **URL**: `/token`
- **Method**: `POST`
- **Description**: Generate a new access token using a valid refresh token.

- **Request Body**:
  ```json
  {
    "token": "<JWT_REFRESH_TOKEN>"
  }
  ```

- **Success Response**:
  - **Status**: `200 OK`
  - **Body**:
    ```json
    {
      "accessToken": "<NEW_JWT_ACCESS_TOKEN>"
    }
    ```

- **Error Responses**:
  - **Status**: `401 Unauthorized`
    ```json
    {
      "message": "Refresh token not provided"
    }
    ```
  - **Status**: `403 Forbidden`
    ```json
    {
      "message": "Invalid refresh token"
    }
    ```

---

#### **4. Logout a User**

- **URL**: `/logout`
- **Method**: `DELETE`
- **Description**: Invalidate a user's refresh token.

- **Request Body**:
  ```json
  {
    "token": "<JWT_REFRESH_TOKEN>"
  }
  ```

- **Success Response**:
  - **Status**: `204 No Content`

---

#### **5. Get User Information**

- **URL**: `/users`
- **Method**: `GET`
- **Description**: Retrieve the authenticated user's data (requires a valid access token).

- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_ACCESS_TOKEN>"
  }
  ```

- **Success Response**:
  - **Status**: `200 OK`
  - **Body**:
    ```json
    [
      {
        "name": "JohnDoe",
        "devices": [
          { "name": "switch", "type": "light", "state": "off" },
          { "name": "heater", "type": "heater", "state": "off" }
        ]
      }
    ]
    ```

- **Error Responses**:
  - **Status**: `401 Unauthorized`
    ```json
    {
      "message": "Access token not provided"
    }
    ```
  - **Status**: `403 Forbidden`
    ```json
    {
      "message": "Invalid or expired access token"
    }
    ```

---

### Environment Variables
Ensure you set up the following environment variables in a `.env` file:

```plaintext
ACCESS_TOKEN_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret-key
```

---
