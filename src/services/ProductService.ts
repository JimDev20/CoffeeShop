import { BaseService } from "./BaseService";

export interface ProductRow {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: number | null;
  category_name: string | null;
  image: string | null;
  stock: number;
  is_available: boolean;
  is_featured: boolean;
  weight: string | null;
  origin: string | null;
  roast_level: string | null;
}

export interface CreateProductDTO {
  name: string;
  slug: string;
  description?: string;
  price: number;
  category_id?: number;
  image?: string;
  stock?: number;
  is_available?: boolean;
  is_featured?: boolean;
  weight?: string;
  origin?: string;
  roast_level?: string;
}

export class ProductService extends BaseService {
  async getAllAvailable(): Promise<ProductRow[]> {
    return this.db`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_available = true
      ORDER BY p.name
    ` as unknown as ProductRow[];
  }

  async getAll(): Promise<ProductRow[]> {
    return this.db`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.name
    ` as unknown as ProductRow[];
  }

  async getBySlug(slug: string): Promise<ProductRow | null> {
    const [product] = await this.db`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ${slug}
      LIMIT 1
    `;
    return (product as unknown as ProductRow) || null;
  }

  async getById(id: number): Promise<ProductRow | null> {
    const [product] = await this.db`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ${id}
      LIMIT 1
    `;
    return (product as unknown as ProductRow) || null;
  }

  async update(id: number, data: Partial<CreateProductDTO>): Promise<ProductRow | null> {
    const [product] = await this.db`
      UPDATE products SET
        name = ${data.name ?? ""},
        slug = ${data.slug ?? ""},
        description = ${data.description ?? null},
        price = ${data.price ?? 0},
        category_id = ${data.category_id ?? null},
        image = ${data.image ?? null},
        stock = ${data.stock ?? 0},
        is_available = ${data.is_available ?? true},
        is_featured = ${data.is_featured ?? false},
        weight = ${data.weight ?? null},
        origin = ${data.origin ?? null},
        roast_level = ${data.roast_level ?? null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return (product as unknown as ProductRow) || null;
  }

  async delete(id: number): Promise<boolean> {
    await this.db`DELETE FROM products WHERE id = ${id}`;
    return true;
  }

  async getAvailableCount(): Promise<number> {
    const [row] = await this.db`SELECT COUNT(*) as count FROM products WHERE is_available = true`;
    return Number((row as { count: number }).count);
  }

  async getFeatured(limit = 4): Promise<ProductRow[]> {
    return this.db`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_available = true AND p.is_featured = true
      ORDER BY p.name
      LIMIT ${limit}
    ` as unknown as ProductRow[];
  }

  async create(data: CreateProductDTO): Promise<ProductRow> {
    const [product] = await this.db`
      INSERT INTO products (name, slug, description, price, category_id, image, stock, is_available, is_featured, weight, origin, roast_level)
      VALUES (${data.name}, ${data.slug}, ${data.description ?? null}, ${data.price}, ${data.category_id ?? null}, ${data.image ?? null}, ${data.stock ?? 0}, ${data.is_available ?? true}, ${data.is_featured ?? false}, ${data.weight ?? null}, ${data.origin ?? null}, ${data.roast_level ?? null})
      RETURNING *
    `;
    return product as unknown as ProductRow;
  }
}
