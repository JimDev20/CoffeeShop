import { BaseService } from "./BaseService";

export interface DiscountCodeRow {
  id: number;
  code: string;
  percent: number;
  is_active: boolean;
  created_at: string;
}

export class DiscountService extends BaseService {
  async getAll(): Promise<DiscountCodeRow[]> {
    return this.db`
      SELECT * FROM discount_codes ORDER BY created_at DESC
    ` as unknown as DiscountCodeRow[];
  }

  async getActiveByCode(code: string): Promise<DiscountCodeRow | null> {
    const [discount] = await this.db`
      SELECT * FROM discount_codes
      WHERE code = ${code.trim().toUpperCase()} AND is_active = true
      LIMIT 1
    `;
    return (discount as unknown as DiscountCodeRow) || null;
  }

  async create(data: { code: string; percent: number }): Promise<DiscountCodeRow> {
    const [discount] = await this.db`
      INSERT INTO discount_codes (code, percent)
      VALUES (${data.code.trim().toUpperCase()}, ${data.percent})
      RETURNING *
    `;
    return discount as unknown as DiscountCodeRow;
  }

  async setActive(id: number, isActive: boolean): Promise<DiscountCodeRow | null> {
    const [discount] = await this.db`
      UPDATE discount_codes SET is_active = ${isActive}
      WHERE id = ${id}
      RETURNING *
    `;
    return (discount as unknown as DiscountCodeRow) || null;
  }

  async delete(id: number): Promise<void> {
    await this.db`DELETE FROM discount_codes WHERE id = ${id}`;
  }
}
