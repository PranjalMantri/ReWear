# Backend Documentation

## Overview

The backend of the ReWear project is built using Node.js and TypeScript. It provides APIs for managing users, items, notifications, redemptions, and swaps. The backend is structured to ensure scalability, maintainability, and ease of development.

## Project Structure

```
backend/
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── src/                # Source code
│   ├── server.ts       # Entry point of the application
│   ├── controller/     # Controllers for handling requests
│   ├── db/             # Database connection logic
│   ├── middlewares/    # Middleware functions
│   ├── model/          # Database models
│   ├── routes/         # API routes
│   ├── types/          # Type definitions
│   └── util/           # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- A running MongoDB instance

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PranjalMantri/ReWear.git
   ```
2. Navigate to the backend folder:
   ```bash
   cd ReWear/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the `backend` directory by copying the `.env.example` file:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your configuration values (e.g., database URI, JWT secret).

### Running the Application

- Start the development server:
  ```bash
  npm run dev
  ```
- The server will run at `http://localhost:3000` by default.

### Building for Production

- Build the project:
  ```bash
  npm run build
  ```
- Start the production server:
  ```bash
  npm start
  ```

## API Endpoints

### Users

- **POST** `/api/users` - Create a new user
- **GET** `/api/users/:id` - Get user details

### Items

- **POST** `/api/items` - Create a new item
- **GET** `/api/items` - Get all items

### Notifications

- **GET** `/api/notifications` - Get all notifications

### Redemptions

- **POST** `/api/redemptions` - Redeem points

### Swaps

- **POST** `/api/swaps` - Initiate a swap

## Folder Details

### `src/controller`

Contains the logic for handling incoming requests and sending responses.

### `src/db`

Handles the database connection setup.

### `src/middlewares`

Contains middleware functions for authentication, error handling, and file uploads.

### `src/model`

Defines the database models for the application.

### `src/routes`

Defines the API routes and maps them to their respective controllers.

### `src/util`

Contains utility functions such as error handling, JWT management, and asynchronous handlers.
