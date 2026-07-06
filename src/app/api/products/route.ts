import { NextResponse } from "next/server";

const products = [
  { id: 1, name: "Ethiopian Yirgacheffe", slug: "ethiopian-yirgacheffe", category: "Coffee Beans", price: 450, desc: "Floral, fruity, wine-like", stock: 50, available: true, featured: true },
  { id: 2, name: "Colombian Supremo", slug: "colombian-supremo", category: "Coffee Beans", price: 420, desc: "Caramel, nutty, smooth", stock: 35, available: true, featured: true },
  { id: 3, name: "Dark Roast Espresso", slug: "dark-roast-espresso", category: "Coffee Beans", price: 380, desc: "Bold, chocolate, rich", stock: 40, available: true, featured: false },
  { id: 4, name: "Breakfast Blend", slug: "breakfast-blend", category: "Ground Coffee", price: 350, desc: "Balanced, bright, medium", stock: 25, available: true, featured: false },
  { id: 5, name: "French Roast", slug: "french-roast", category: "Ground Coffee", price: 370, desc: "Smoky, intense, dark", stock: 20, available: true, featured: false },
  { id: 6, name: "Espresso Capsules x10", slug: "espresso-capsules", category: "Capsules", price: 280, desc: "Compatible with Nespresso", stock: 100, available: true, featured: false },
  { id: 7, name: "Ceramic Pour Over", slug: "ceramic-pour-over", category: "Accessories", price: 650, desc: "Handcrafted ceramic dripper", stock: 15, available: true, featured: false },
  { id: 8, name: "Coffee Grinder Pro", slug: "coffee-grinder-pro", category: "Accessories", price: 1200, desc: "Adjustable burr grinder", stock: 10, available: true, featured: false },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const slug = searchParams.get("slug");

  let result = products;

  if (category) {
    result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (slug) {
    result = result.filter((p) => p.slug === slug);
  }

  return NextResponse.json({ products: result });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = { id: products.length + 1, ...body };
    products.push(newProduct);
    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
