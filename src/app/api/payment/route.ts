import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, description, items, payment_method } = body;

    if (!amount) {
      return NextResponse.json({ error: "amount is required" }, { status: 400 });
    }

    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({
        error: "Payment gateway not configured. Order created without payment.",
        checkout_url: null,
        order_created: true,
      }, { status: 200 });
    }

    const paymongoAmount = Math.round(amount * 100);

    const payload: Record<string, unknown> = {
      data: {
        attributes: {
          amount: paymongoAmount,
          currency: "PHP",
          description: description || "Coffee Shop Order",
          statement_descriptor: "BREW & CO.",
        },
      },
    };

    const pm = payment_method === "card" ? "card" : "gcash";
    const endpoint = pm === "card"
      ? "https://api.paymongo.com/v1/checkout_sessions"
      : "https://api.paymongo.com/v1/checkout_sessions";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("PayMongo error:", JSON.stringify(errorData));
      return NextResponse.json({
        error: "Payment gateway error. Order created without payment.",
        checkout_url: null,
        order_created: true,
      }, { status: 200 });
    }

    const data = await response.json();
    const checkoutUrl = data?.data?.attributes?.checkout_url;

    return NextResponse.json({ checkout_url: checkoutUrl, order_created: true });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({
      error: "Payment processing error. Order created without payment.",
      checkout_url: null,
      order_created: true,
    }, { status: 200 });
  }
}
