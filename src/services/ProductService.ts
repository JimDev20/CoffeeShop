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

  async getAvailableCount(): Promise<number> {
    const [row] = await this.db`SELECT COUNT(*) as count FROM products WHERE is_available = true`;
    return Number((row as { count: number }).count);
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
