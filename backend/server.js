import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

const port = Number(process.env.PORT || 5000);

try {
  await connectDatabase(process.env.MONGODB_URI);
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
