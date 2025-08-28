# Frontend

This folder contains the frontend code for the ReWear project. The frontend is built using React and TypeScript, and it is powered by Vite for fast development and build processes.

## Project Structure

The `src` directory contains the main source code for the frontend application. Below is an overview of the key folders and files:

- **assets/**: Contains static assets like images.
- **components/**: Reusable UI components organized by feature or domain.
- **hooks/**: Custom React hooks for shared logic.
- **pages/**: Page components representing different routes in the application.
- **store/**: State management files using Zustand.
- **util/**: Utility functions and API helpers.

## Getting Started

To get started with the frontend, follow these steps:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` to view the application.

## Scripts

The following scripts are available in the `package.json` file:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code quality issues.
