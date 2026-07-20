import { NextResponse } from "next/server";
import { PaymentService } from "@/services/PaymentService";
import { OrderService } from "@/services/OrderService";

const paymentService = new PaymentService();
const orderService = new OrderService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, description, items, order_id, customer_email } = body;

    if (!amount) {
      return NextResponse.json({ error: "amount is required" }, { status: 400 });
    }

    const result = await paymentService.createCheckoutSession({
      amount,
      description,
      items,
      order_id,
      customer_email,
    });

    if (result.session_id && order_id) {
      await orderService.updatePaymongoSessionId(order_id, result.session_id);
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({
      checkout_url: null,
      session_id: null,
      order_created: true,
      error: "Payment processing error",
    }, { status: 200 });
  }
}
