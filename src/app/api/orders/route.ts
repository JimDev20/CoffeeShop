import { NextResponse } from "next/server";
import { OrderService } from "@/services/OrderService";
import { DiscountService } from "@/services/DiscountService";
import { ProductService } from "@/services/ProductService";
import { auth } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validations";

const orderService = new OrderService();
const discountService = new DiscountService();
const productService = new ProductService();

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let orders;
    if (session.user?.role === "admin") {
      orders = await orderService.getAll();
    } else {
      orders = await orderService.getByEmail(session.user?.email || "");
    }
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
    }

    const session = await auth();
    const { discount_code: discountCodeInput } = parsed.data;

    const quantities = new Map<number, number>();
    for (const item of parsed.data.items) {
      const productId = item.id ?? item.productId;
      if (!productId) {
        return NextResponse.json({ error: `Missing product for "${item.name}".` }, { status: 400 });
      }
      quantities.set(productId, (quantities.get(productId) ?? 0) + item.quantity);
    }

    const products = new Map<number, Awaited<ReturnType<ProductService["getById"]>>>();
    for (const [productId, quantity] of quantities) {
      const product = await productService.getById(productId);
      if (!product || !product.is_available) {
        return NextResponse.json({ error: "An item in your cart is no longer available." }, { status: 400 });
      }
      if (product.stock < quantity) {
        return NextResponse.json(
          { error: `Only ${product.stock} of ${product.name} left in stock.` },
          { status: 400 }
        );
      }
      products.set(productId, product);
    }

    const items: { productId: number; name: string; price: number; quantity: number; image?: string }[] = [];
    for (const [productId, quantity] of quantities) {
      const product = products.get(productId);
      if (!product) continue;
      items.push({
        productId,
        name: product.name,
        price: Number(product.price),
        quantity,
        image: product.image ?? undefined,
      });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let discountCode: string | null = null;
    let discountAmount = 0;
    if (discountCodeInput) {
      const discount = await discountService.getActiveByCode(discountCodeInput);
      if (!discount) {
        return NextResponse.json({ error: "Invalid or inactive discount code" }, { status: 400 });
      }
      discountCode = discount.code;
      discountAmount = Math.round(subtotal * discount.percent) / 100;
    }

    const total = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);

    const reserved: { id: number; quantity: number }[] = [];
    for (const item of items) {
      const reservedNow = await productService.decrementStock(item.productId, item.quantity);
      if (!reservedNow) {
        await Promise.all(reserved.map((entry) => productService.restoreStock(entry.id, entry.quantity)));
        return NextResponse.json(
          { error: "Stock changed while checking out. Please review your cart." },
          { status: 409 }
        );
      }
      reserved.push({ id: item.productId, quantity: item.quantity });
    }

    try {
      const order = await orderService.create({
        customer_name: parsed.data.customer_name,
        customer_email: parsed.data.customer_email,
        customer_phone: parsed.data.customer_phone,
        shipping_address: parsed.data.shipping_address,
        notes: parsed.data.notes,
        items,
        user_id: session?.user?.id ? Number(session.user.id) : undefined,
        total,
        discount_code: discountCode,
        discount_amount: discountAmount,
      });
      return NextResponse.json({ order }, { status: 201 });
    } catch (error) {
      await Promise.all(reserved.map((entry) => productService.restoreStock(entry.id, entry.quantity)));
      throw error;
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
