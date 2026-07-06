import { BaseService } from "./BaseService";

export interface CustomerRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
  order_count: number;
  total_spent: string;
}

export class CustomerService extends BaseService {
  async getAll(): Promise<CustomerRow[]> {
    return this.db`
      SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
        COALESCE((SELECT COUNT(*) FROM orders WHERE user_id = u.id), 0) as order_count,
        COALESCE((SELECT SUM(CAST(total AS numeric)) FROM orders WHERE user_id = u.id), 0) as total_spent
      FROM users u
      WHERE u.role = 'customer'
      ORDER BY u.created_at DESC
    ` as unknown as CustomerRow[];
  }

  async getCount(): Promise<number> {
    const [row] = await this.db`SELECT COUNT(*) as count FROM users WHERE role = 'customer'`;
    return Number((row as { count: number }).count);
  }
}
