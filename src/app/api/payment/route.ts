import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, description, items, customer } = body;

    if (!amount || !customer?.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // PayMongo API: Create Payment Intent
    const paymongoRes = await fetch("https://api.paymongo.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: Math.round(amount * 100),
            payment_method_allowed: ["card", "gcash", "paymaya"],
            currency: "PHP",
            description: description || "Coffee Shop Order",
            statement_descriptor: "BREW & CO.",
          },
        },
      }),
    });

    if (!paymongoRes.ok) {
      const error = await paymongoRes.json();
      return NextResponse.json({ error: error.errors?.[0]?.detail || "Payment failed" }, { status: 400 });
    }

    const paymentIntent = await paymongoRes.json();

    // Create Payment Method for GCash
    const methodRes = await fetch("https://api.paymongo.com/v1/payment_methods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            type: "gcash",
            details: { phone_number: customer.phone || "" },
            billing: {
              name: customer.name || "",
              email: customer.email,
              phone: customer.phone || "",
            },
          },
        },
      }),
    });

    const paymentMethod = await methodRes.json();

    // Attach payment method to intent
    const attachRes = await fetch(
      `https://api.paymongo.com/v1/payment_intents/${paymentIntent.data.id}/attach`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              payment_method: paymentMethod.data.id,
              return_url: `${request.headers.get("origin")}/orders`,
            },
          },
        }),
      }
    );

    const attached = await attachRes.json();

    return NextResponse.json({
      success: true,
      paymentIntent: attached.data,
      checkoutUrl: attached.data.attributes?.next_action?.redirect?.url,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
