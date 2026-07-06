import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const email = "jimparado042@gmail.com";
  const password = await bcrypt.hash("kinsaka12", 12);
  const name = "Jim Parado";

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;

  if (existing.length > 0) {
    await sql`UPDATE users SET role = 'admin', password = ${password}, name = ${name} WHERE email = ${email}`;
    console.log("Updated existing user to admin");
  } else {
    await sql`INSERT INTO users (name, email, password, role) VALUES (${name}, ${email}, ${password}, 'admin')`;
    console.log("Created new admin user");
  }
  console.log("Done! You can now log in at /auth/login");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
