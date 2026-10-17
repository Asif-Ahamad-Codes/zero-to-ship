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

Create two Vercel projects from this repository:

1. Set the frontend project's **Root Directory** to `frontend`. Its `vercel.json` builds the Vite
   app and serves the SPA from `dist/`.
2. Set the backend project's **Root Directory** to `backend`. Its `vercel.json` routes requests to
   the Express serverless handler in `server.js`.
3. In the backend project's environment variables, set `MONGODB_URI` to your MongoDB connection
   string and `FRONTEND_ORIGIN` to the deployed frontend origin (for example,
   `https://your-frontend-project.vercel.app`).
4. In the frontend project's environment variables, set `VITE_API_URL` to the deployed backend
   origin (for example, `https://your-backend-project.vercel.app`), then redeploy the frontend.

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
