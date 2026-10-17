import mongoose from "mongoose";

export async function connectDatabase(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is required.");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");
}

export function disconnectDatabase() {
  return mongoose.disconnect();
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
