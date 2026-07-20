import { NextResponse } from "next/server";
import { OrderService } from "@/services/OrderService";

const orderService = new OrderService();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  if (orderId) {
    return NextResponse.redirect(new URL(`/orders/${orderId}`, request.url));
  }

  if (sessionId) {
    const order = await orderService.findBySessionId(sessionId);
    if (order) {
      return NextResponse.redirect(new URL(`/orders/${order.id}`, request.url));
    }
  }

  return NextResponse.redirect(new URL("/orders", request.url));
}
