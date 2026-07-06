import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  console.warn("DATABASE_URL not configured.");
}

const sql = neon(connectionString || "postgres://placeholder");

export { sql };
export const db = sql;
