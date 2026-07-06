import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const orders = await sql`
      SELECT * FROM orders ORDER BY created_at DESC
    `;
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, customer_email, customer_phone, shipping_address, notes, items, total } = body;

    if (!customer_name || !customer_email || !shipping_address || !items || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [order] = await sql`
      INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, notes, total, items, status, payment_status)
      VALUES (${customer_name}, ${customer_email}, ${customer_phone || null}, ${shipping_address}, ${notes || null}, ${total}, ${JSON.stringify(items)}, 'pending', 'unpaid')
      RETURNING *
    `;

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
