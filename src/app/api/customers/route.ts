import { NextResponse } from "next/server";
import { CustomerService } from "@/services/CustomerService";

const customerService = new CustomerService();

export async function GET() {
  try {
    const customers = await customerService.getAll();
    return NextResponse.json({ customers, total: customers.length });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
