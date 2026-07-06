import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const products = await sql`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_available = true
      ORDER BY p.name
    `;
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, price, category_id, image, stock, is_available, is_featured, weight, origin, roast_level } = body;

    if (!name || !slug || !price) {
      return NextResponse.json({ error: "name, slug, and price are required" }, { status: 400 });
    }

    const [product] = await sql`
      INSERT INTO products (name, slug, description, price, category_id, image, stock, is_available, is_featured, weight, origin, roast_level)
      VALUES (${name}, ${slug}, ${description || null}, ${price}, ${category_id || null}, ${image || null}, ${stock || 0}, ${is_available ?? true}, ${is_featured ?? false}, ${weight || null}, ${origin || null}, ${roast_level || null})
      RETURNING *
    `;

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
