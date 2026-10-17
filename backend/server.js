import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

const port = Number(process.env.PORT || 5000);
const app = createApp();

export default async function handler(request, response) {
  try {
    await connectDatabase(process.env.MONGODB_URI);
    return app(request, response);
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    return response.status(503).json({ error: "The database is currently unavailable." });
  }
}

if (!process.env.VERCEL) {
  try {
    await connectDatabase(process.env.MONGODB_URI);
    const server = app.listen(port, () => {
      console.log(`Resume parser API listening on http://localhost:${port}`);
    });

    for (const signal of ["SIGINT", "SIGTERM"]) {
      process.once(signal, () => {
        server.close((serverError) => {
          if (serverError) {
            console.error("Could not close the API server cleanly:", serverError.message);
            process.exitCode = 1;
          }

          disconnectDatabase().catch((disconnectError) => {
            console.error("Could not disconnect from MongoDB cleanly:", disconnectError.message);
            process.exitCode = 1;
          });
        });
      });
    }
  } catch (error) {
    console.error("Could not start the API:", error.message);
    process.exit(1);
  }
}
