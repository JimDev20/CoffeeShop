import { NextResponse } from "next/server";
import { CustomerService } from "@/services/CustomerService";
import { auth } from "@/lib/auth";

const customerService = new CustomerService();

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customers = await customerService.getAll();
    return NextResponse.json({ customers, total: customers.length });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
