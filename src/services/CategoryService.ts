import { BaseService } from "./BaseService";

export interface CategoryRow {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
}

export class CategoryService extends BaseService {
  async getAllActive(): Promise<CategoryRow[]> {
    return this.db`
      SELECT * FROM categories WHERE is_active = true ORDER BY sort_order, name
    ` as unknown as CategoryRow[];
  }
}
