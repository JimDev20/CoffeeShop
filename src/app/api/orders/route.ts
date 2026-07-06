import { NextResponse } from "next/server";

const orders: any[] = [];

export async function GET() {
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = {
      id: orders.length + 1,
      ...body,
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
