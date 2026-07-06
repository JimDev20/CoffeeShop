import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sql = neon(connectionString);

async function seed() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await sql`
    INSERT INTO users (name, email, password, role)
    VALUES ('Admin', 'admin@brewco.com', ${hashedPassword}, 'admin')
    ON CONFLICT (email) DO NOTHING
  `;
  console.log("Admin user created (admin@brewco.com / admin123)");

  // Create categories
  const categories = [
    { name: "Coffee Beans", slug: "coffee-beans", sort_order: 1 },
    { name: "Ground Coffee", slug: "ground-coffee", sort_order: 2 },
    { name: "Capsules", slug: "capsules", sort_order: 3 },
    { name: "Accessories", slug: "accessories", sort_order: 4 },
  ];

  for (const cat of categories) {
    await sql`
      INSERT INTO categories (name, slug, sort_order)
      VALUES (${cat.name}, ${cat.slug}, ${cat.sort_order})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log("Categories created");

  // Create products
  const [beansCat, groundCat, capsulesCat, accessoriesCat] = await Promise.all(
    categories.map((c) => sql`SELECT id FROM categories WHERE slug = ${c.slug}`)
  );

  const products = [
    { name: "Ethiopian Yirgacheffe", slug: "ethiopian-yirgacheffe", description: "Floral, fruity, wine-like", price: 450, category_id: beansCat[0]?.id, image: null, stock: 50, is_available: true, is_featured: true, weight: "200g", origin: "Ethiopia", roast_level: "Light" },
    { name: "Colombian Supremo", slug: "colombian-supremo", description: "Caramel, nutty, smooth", price: 420, category_id: beansCat[0]?.id, image: null, stock: 35, is_available: true, is_featured: true, weight: "200g", origin: "Colombia", roast_level: "Medium" },
    { name: "Dark Roast Espresso", slug: "dark-roast-espresso", description: "Bold, chocolate, rich", price: 380, category_id: beansCat[0]?.id, image: null, stock: 40, is_available: true, is_featured: false, weight: "200g", origin: "Brazil", roast_level: "Dark" },
    { name: "Breakfast Blend", slug: "breakfast-blend", description: "Balanced, bright, medium", price: 350, category_id: groundCat[0]?.id, image: null, stock: 30, is_available: true, is_featured: false, weight: "250g", origin: "Blend", roast_level: "Medium" },
    { name: "French Roast", slug: "french-roast", description: "Smoky, intense, dark", price: 370, category_id: groundCat[0]?.id, image: null, stock: 25, is_available: true, is_featured: false, weight: "250g", origin: "Blend", roast_level: "Dark" },
    { name: "Espresso Capsules x10", slug: "espresso-capsules", description: "Compatible with Nespresso", price: 280, category_id: capsulesCat[0]?.id, image: null, stock: 100, is_available: true, is_featured: false, weight: null, origin: null, roast_level: null },
    { name: "Ceramic Pour Over", slug: "ceramic-pour-over", description: "Handcrafted ceramic dripper", price: 650, category_id: accessoriesCat[0]?.id, image: null, stock: 20, is_available: true, is_featured: false, weight: null, origin: null, roast_level: null },
    { name: "Coffee Grinder Pro", slug: "coffee-grinder-pro", description: "Adjustable burr grinder", price: 1200, category_id: accessoriesCat[0]?.id, image: null, stock: 15, is_available: true, is_featured: true, weight: null, origin: null, roast_level: null },
  ];

  for (const product of products) {
    await sql`
      INSERT INTO products (name, slug, description, price, category_id, image, stock, is_available, is_featured, weight, origin, roast_level)
      VALUES (${product.name}, ${product.slug}, ${product.description}, ${product.price}, ${product.category_id}, ${product.image}, ${product.stock}, ${product.is_available}, ${product.is_featured}, ${product.weight}, ${product.origin}, ${product.roast_level})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log("Products created");

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
