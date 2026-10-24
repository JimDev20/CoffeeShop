import { NextResponse } from "next/server";
import { DiscountService } from "@/services/DiscountService";
import { auth } from "@/lib/auth";
import { createDiscountCodeSchema, updateDiscountCodeSchema } from "@/lib/validations";

const discountService = new DiscountService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
      const discount = await discountService.getActiveByCode(code);
      if (!discount) {
        return NextResponse.json({ error: "Invalid or inactive discount code" }, { status: 404 });
      }
      return NextResponse.json({ discount: { code: discount.code, percent: discount.percent } });
    }

    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const discounts = await discountService.getAll();
    return NextResponse.json({ discounts });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createDiscountCodeSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
    }

    const discount = await discountService.create(parsed.data);
    return NextResponse.json({ discount }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Code already exists or is invalid" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateDiscountCodeSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
    }

    const discount = await discountService.setActive(parsed.data.id, parsed.data.is_active);
    if (!discount) {
      return NextResponse.json({ error: "Discount code not found" }, { status: 404 });
    }
    return NextResponse.json({ discount });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Valid id is required" }, { status: 400 });
    }

    await discountService.delete(Number(id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
