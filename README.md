# 0 to Shipped Resume Parser

The project contains a React/Vite frontend in `frontend/` and an Express/MongoDB API in `backend/`.
The API accepts a resume PDF and a job description, saves a mock comparison record, and returns
sample score and skill data. AI-based resume/JD analysis is not implemented yet.

Uploaded PDF bytes are held in memory only for request validation and are never written to MongoDB
or disk. MongoDB stores the PDF filename and size, job description, mock score, skill lists, and
timestamps.

## Requirements

- Node.js 20.19+ or 22.12+
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

1. Install the workspace dependencies from the repository root:

   ```sh
   npm install
   ```

2. Create `backend/.env` from `backend/.env.example` and set `MONGODB_URI` to your MongoDB
   connection string.

3. Start the frontend and API from the repository root:

   ```sh
   npm run dev
   ```

   Vite runs at `http://localhost:5173` and proxies `/api` requests to Express at
   `http://localhost:5000`.

## API

- `GET /api/health` — API and database connection status.
- `POST /api/analyses` — multipart form with `resume` (PDF, max 10 MB) and `jobDescription`
  (required, max 50,000 characters).

## Validation

```sh
npm run build
npm run test --workspace backend
```
