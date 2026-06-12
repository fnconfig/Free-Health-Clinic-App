import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER;
const password = process.env.SQL_ADMIN_PASSWORD;

if (!databaseUrl && (!sqlHost || !sqlDbName || !user || !password)) {
  throw new Error("Either DATABASE_URL or (SQL_HOST, SQL_DB_NAME, SQL_ADMIN_USER, SQL_ADMIN_PASSWORD) must be set in environment variables.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: databaseUrl ? {
    url: databaseUrl,
    ssl: { rejectUnauthorized: false },
  } : {
    host: sqlHost!,
    user: user!,
    password: password!,
    database: sqlDbName!,
    ssl: false,
  },
  verbose: true,
});
