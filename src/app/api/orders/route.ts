import { NextResponse } from "next/server";
import { OrderService } from "@/services/OrderService";
import { auth } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validations";

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
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
    }

    const session = await auth();
    const orderData = {
      ...parsed.data,
      user_id: session?.user?.id ? Number(session.user.id) : undefined,
    };

    const order = await orderService.create(orderData);
    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
