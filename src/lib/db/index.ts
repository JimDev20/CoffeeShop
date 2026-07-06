import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  console.warn("DATABASE_URL not configured. Database features will be unavailable.");
}

const sql = neon(connectionString || "postgres://placeholder");

export const db = drizzle(sql, { schema });
