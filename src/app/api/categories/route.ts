import { NextResponse } from "next/server";

const categories = [
  { id: 1, name: "Coffee Beans", slug: "coffee-beans", description: "Single origin & blended beans" },
  { id: 2, name: "Ground Coffee", slug: "ground-coffee", description: "Pre-ground for convenience" },
  { id: 3, name: "Capsules", slug: "capsules", description: "Compatible with all machines" },
  { id: 4, name: "Accessories", slug: "accessories", description: "Brew like a pro" },
];

export async function GET() {
  return NextResponse.json({ categories });
}
