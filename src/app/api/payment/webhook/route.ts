import { NextResponse } from "next/server";
import { OrderService } from "@/services/OrderService";
import crypto from "crypto";

const orderService = new OrderService();

export async function POST(request: Request) {
  const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;

  try {
    const body = await request.text();
    const signature = request.headers.get("paymongo-signature") || "";

    if (webhookSecret && signature) {
      const [timestampPart, signaturePart] = signature.split(",");
      const sigTimestamp = timestampPart?.replace("t=", "");
      const sigSignature = signaturePart?.replace("v1=", "");

      if (!sigTimestamp || !sigSignature) {
        return NextResponse.json({ error: "Invalid signature format" }, { status: 400 });
      }

      const signedPayload = `${sigTimestamp}.${body}`;
      const expected = crypto.createHmac("sha256", webhookSecret).update(signedPayload).digest("hex");

      if (expected !== sigSignature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = JSON.parse(body);
    const eventType = event?.data?.attributes?.type;
    const resourceData = event?.data?.attributes?.data;

    if (!eventType || !resourceData) {
      return NextResponse.json({ received: true });
    }

    const sessionId = resourceData.id;
    const paymentStatus = resourceData.attributes?.payment_status;

    if (!sessionId) {
      return NextResponse.json({ received: true });
    }

    const order = await orderService.findBySessionId(sessionId);

    if (!order) {
      return NextResponse.json({ received: true });
    }

    if (eventType === "checkout_session.payment.paid" || paymentStatus === "paid") {
      await orderService.updatePaymentStatus(order.id, "paid", resourceData.attributes?.payment_intent?.id || sessionId);
      await orderService.updateStatus(order.id, "confirmed");
    } else if (eventType === "checkout_session.payment.failed" || paymentStatus === "failed") {
      await orderService.updatePaymentStatus(order.id, "failed", sessionId);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
