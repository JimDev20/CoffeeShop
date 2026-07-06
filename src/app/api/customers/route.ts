import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const customers = await sql`
      SELECT u.*,
        COALESCE((SELECT COUNT(*) FROM orders WHERE user_id = u.id), 0) as order_count,
        COALESCE((SELECT SUM(CAST(total AS numeric)) FROM orders WHERE user_id = u.id), 0) as total_spent
      FROM users u
      ORDER BY u.created_at DESC
    `;
    return NextResponse.json({ customers, total: customers.length });
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
