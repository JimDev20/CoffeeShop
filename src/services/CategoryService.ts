import { BaseService } from "./BaseService";

export interface CategoryRow {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateCategoryDTO {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export class CategoryService extends BaseService {
  async getAllActive(): Promise<CategoryRow[]> {
    return this.db`
      SELECT * FROM categories WHERE is_active = true ORDER BY sort_order, name
    ` as unknown as CategoryRow[];
  }

  async getAll(): Promise<CategoryRow[]> {
    return this.db`
      SELECT * FROM categories ORDER BY sort_order, name
    ` as unknown as CategoryRow[];
  }

  async getById(id: number): Promise<CategoryRow | null> {
    const [category] = await this.db`SELECT * FROM categories WHERE id = ${id} LIMIT 1`;
    return (category as unknown as CategoryRow) || null;
  }

  async create(data: CreateCategoryDTO): Promise<CategoryRow> {
    const [category] = await this.db`
      INSERT INTO categories (name, slug, description, image, sort_order, is_active)
      VALUES (${data.name}, ${data.slug}, ${data.description ?? null}, ${data.image ?? null}, ${data.sort_order ?? 0}, ${data.is_active ?? true})
      RETURNING *
    `;
    return category as unknown as CategoryRow;
  }

  async update(id: number, data: Partial<CreateCategoryDTO>): Promise<CategoryRow | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const [category] = await this.db`
      UPDATE categories SET
        name = ${data.name ?? existing.name},
        slug = ${data.slug ?? existing.slug},
        description = ${data.description ?? existing.description},
        image = ${data.image ?? existing.image},
        sort_order = ${data.sort_order ?? existing.sort_order},
        is_active = ${data.is_active ?? existing.is_active}
      WHERE id = ${id}
      RETURNING *
    `;
    return (category as unknown as CategoryRow) || null;
  }

  async delete(id: number): Promise<boolean> {
    await this.db`DELETE FROM categories WHERE id = ${id}`;
    return true;
  }
}
