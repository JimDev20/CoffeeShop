import { NextResponse } from "next/server";
import { PaymentService } from "@/services/PaymentService";

const paymentService = new PaymentService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, description, items } = body;

    if (!amount) {
      return NextResponse.json({ error: "amount is required" }, { status: 400 });
    }

    const result = await paymentService.createCheckoutSession({ amount, description, items });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({
      checkout_url: null,
      order_created: true,
      error: "Payment processing error",
    }, { status: 200 });
  }
}
