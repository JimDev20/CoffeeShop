import { NextResponse } from "next/server";
import { OrderService } from "@/services/OrderService";

const orderService = new OrderService();

export async function GET() {
  try {
    const orders = await orderService.getAll();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, customer_email, shipping_address, items, total } = body;

    if (!customer_name || !customer_email || !shipping_address || !items || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await orderService.create(body);
    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
