# GymPRO Standalone Backend Server

This is an independent, standalone Node.js REST API server for GymPRO, completely decoupled from the Next.js frontend. It can be run on its own port (`5000`), deployed to Railway, Render, or Heroku, or used to power mobile apps (React Native / Flutter).

## Features
- **Standalone Runtime:** Runs directly on Node.js without Next.js dependencies.
- **Supabase Integration:** Connects directly to the cloud PostgreSQL database.
- **Full CORS Enabled:** Ready for requests from `localhost:3000`, mobile devices, or custom frontend origins.
- **REST Endpoints:**
  - `GET /health` — Server health status
  - `GET /api/members` / `POST /api/members` — Member roster & enrollments
  - `GET /api/attendance` / `POST /api/attendance` — Optical scan check-ins
  - `GET /api/payments` / `POST /api/payments` — Cash/UPI financial ledger
  - `GET /api/equipment` — Equipment registry
  - `GET /api/leads` / `POST /api/leads` — Prospect inquiries

## Running the Backend
From the root directory or inside `backend/`:
```bash
node backend/server.js
```
The server will boot at `http://localhost:5000`.
