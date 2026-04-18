# Urban Infrastructure Management Dashboard (UIHIS)
UIHIIS is a smart city platform that allows citizens to report urban infrastructure issues (potholes, broken streetlights, water leaks, garbage overflow, etc.), visualizes these issues on an interactive city map, and computes an Infrastructure Health Score for different city areas based on reported issues.

## Project Structure

This project consists of two main folders:
- `backend`: A Node.js/Express REST API using MongoDB.
- `frontend/UIMD`: A React single-page application built with Vite and TailwindCSS.

## Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v16.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas cluster)
- Git

---

## Setup Instructions

Follow these steps to run the application locally on your machine.

### 1. Clone the repository

```bash
git clone https://github.com/Saransh-Niroulaa/Urban-Infrastructure-Issue-Reporting-System-UIIRS.git
cd Urban-Infrastructure-Issue-Reporting-System-UIIRS
```

### 2. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add the following context (configure your own secrets):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```
   The API will run on `http://localhost:5000`.

### 3. Frontend Setup

1. Open a new terminal instance and navigate to the frontend directory:
   ```bash
   cd frontend/UIMD
   ```
2. Install the required frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the frontend app by visiting the URL Vite provides (typically `http://localhost:5173`).

---

## Usage
- Keep both the frontend (`npm run dev`) and backend (`node server.js`) running simultaneously for full functionality.
- Navigate to the frontend URL to start interacting with the map, reporting issues, and monitoring the infrastructure health.
