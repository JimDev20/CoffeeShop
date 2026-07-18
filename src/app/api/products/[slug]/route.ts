import { NextResponse } from "next/server";
import { ProductService } from "@/services/ProductService";

const productService = new ProductService();

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const product = await productService.getBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
