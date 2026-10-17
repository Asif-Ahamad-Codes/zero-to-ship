# 0 to Shipped Resume Parser

The project contains a React/Vite frontend in `frontend/` and an Express/MongoDB API in `backend/`.
The backend is organized into `routes/`, `controller/`, `service/`, `config/`, and `middleware/`,
with `server.js` as its entry point and `utils.js` for shared helpers.
The API accepts a resume PDF and a job description, extracts selectable PDF text in memory, sends
the text and job description to Labd AI, and saves the returned comparison record.

Uploaded PDF bytes and extracted text are held in memory only and are never written to MongoDB or
disk. Resume text and the job description are sent to Labd AI. MongoDB stores the PDF filename and
size, job description, AI score, skill lists, summary, and timestamps.

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
   connection string and `LABD_API_KEY` to your Labd API key. Keep this key on the backend; never
   expose it as a frontend variable.

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

Set `MONGODB_URI` and `LABD_API_KEY` in the Vercel project's environment variables. The frontend
calls the same-origin `/api` path, so no frontend API URL or service binding is needed. Locally,
Vite proxies `/api` requests to the backend at `http://localhost:5000`.

The backend reuses its MongoDB connection between warm function invocations. Uploaded PDF data and
extracted resume text are not persisted, but the extracted text and job description are sent to
Labd AI for analysis.

The backend extracts selectable text from PDFs in memory (scanned-image PDFs are not supported),
then asks Labd for a JSON score, matched skills, missing skills, and summary. `LABD_API_KEY` is sent
only in the backend's `Authorization` header. Labd allowance and rate-limit responses are surfaced
as actionable errors; AI results are saved only after a valid response is received.

## API

- `GET /api/health` — API and database connection status.
- `POST /api/analyses` — multipart form with `resume` (PDF, max 10 MB) and `jobDescription`
  (required, max 50,000 characters).

## Validation

```sh
npm run build --prefix frontend
npm test --prefix backend
```
