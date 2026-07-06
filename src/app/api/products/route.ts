import { NextResponse } from "next/server";
import { ProductService } from "@/services/ProductService";

const productService = new ProductService();

export async function GET() {
  try {
    const products = await productService.getAll();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, price } = body;

    if (!name || !slug || !price) {
      return NextResponse.json({ error: "name, slug, and price are required" }, { status: 400 });
    }

    const product = await productService.create(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
