# 0 to Shipped Resume Parser

The project contains a React/Vite frontend in `frontend/` and an Express/MongoDB API in `backend/`.
The backend is organized into `routes/`, `controller/`, `service/`, `config/`, and `middleware/`,
with `server.js` as its entry point and `utils.js` for shared helpers.
The API accepts a resume PDF and a job description, saves a mock comparison record, and returns
sample score and skill data. AI-based resume/JD analysis is not implemented yet.

Uploaded PDF bytes are held in memory only for request validation and are never written to MongoDB
or disk. MongoDB stores the PDF filename and size, job description, mock score, skill lists, and
timestamps.

## Requirements

- Node.js 20.19+ or 22.12+
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

1. Install frontend and backend dependencies from the repository root:

   ```sh
   npm install --prefix frontend
   npm install --prefix backend
   ```

2. Create `backend/.env` from `backend/.env.example` and set `MONGODB_URI` to your MongoDB
   connection string.

3. Start the API and frontend in separate terminals from the repository root:

   ```sh
   npm run dev --prefix backend
   ```

   ```sh
   npm run dev --prefix frontend
   ```

   Vite runs at `http://localhost:5173` and proxies `/api` requests to Express at
   `http://localhost:5000`.

## Deploying to Vercel

Deploy this repository as one Vercel project with the repository root as its project root. The root
`vercel.json` defines two services: `backend` (root `backend/`) and `frontend` (root `frontend/`).
Requests to `/api/*` are routed to the backend; all other paths are routed to the frontend.

Set `MONGODB_URI` in the Vercel project's environment variables. The frontend calls the same-origin
`/api` path, so no frontend API URL or service binding is needed. Locally, Vite proxies `/api`
requests to the backend at `http://localhost:5000`.

The backend reuses its MongoDB connection between warm function invocations. Uploaded PDF data
remains in request memory and is not persisted.

## API

- `GET /api/health` — API and database connection status.
- `POST /api/analyses` — multipart form with `resume` (PDF, max 10 MB) and `jobDescription`
  (required, max 50,000 characters).

## Validation

```sh
npm run build --prefix frontend
npm test --prefix backend
```
