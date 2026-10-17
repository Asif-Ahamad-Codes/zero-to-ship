import mongoose from "mongoose";

export async function connectDatabase(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is required.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    return mongoose.connection.asPromise();
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");
  return mongoose.connection;
}

export function disconnectDatabase() {
  return mongoose.disconnect();
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

export function createDatabaseMiddleware() {
  return async (_request, response, next) => {
    try {
      await connectDatabase(process.env.MONGODB_URI);
      next();
    } catch (error) {
      console.error("Could not connect to MongoDB:", error.message);
      response.status(503).json({ error: "The database is currently unavailable." });
    }
  };
}
