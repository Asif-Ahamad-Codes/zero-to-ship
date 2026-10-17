import "dotenv/config";
import mongoose from "mongoose";
import { createApp } from "./app.js";

const port = Number(process.env.PORT || 5000);
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI is required. Copy backend/.env.example to backend/.env and set it.");
  process.exit(1);
}

try {
  await mongoose.connect(mongoUri);
  const server = createApp().listen(port, () => {
    console.log(`Resume parser API listening on http://localhost:${port}`);
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => {
      server.close((serverError) => {
        if (serverError) {
          console.error("Could not close the API server cleanly:", serverError.message);
          process.exitCode = 1;
        }

        mongoose.disconnect().catch((disconnectError) => {
          console.error("Could not disconnect from MongoDB cleanly:", disconnectError.message);
          process.exitCode = 1;
        });
      });
    });
  }
} catch (error) {
  console.error("Could not connect to MongoDB:", error.message);
  process.exit(1);
}
