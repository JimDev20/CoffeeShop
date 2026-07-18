import { NextResponse } from "next/server";
import { OrderService } from "@/services/OrderService";
import { auth } from "@/lib/auth";

const orderService = new OrderService();

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let orders;
    if (session.user?.role === "admin") {
      orders = await orderService.getAll();
    } else {
      orders = await orderService.getByEmail(session.user?.email || "");
    }
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

    const session = await auth();
    if (session?.user?.id) {
      body.user_id = Number(session.user.id);
    }

    const order = await orderService.create(body);
    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
