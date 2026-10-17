import "dotenv/config";
import { createApp } from "./app.js";
import { createDatabaseMiddleware } from "./config/database.js";

const app = createApp({ databaseMiddleware: createDatabaseMiddleware() });

export default app;
