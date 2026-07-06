import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const categories = await sql`
      SELECT * FROM categories WHERE is_active = true ORDER BY sort_order, name
    `;
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
