import { BaseService } from "./BaseService";

export interface OrderRow {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  notes: string | null;
  total: string;
  status: string;
  payment_status: string;
  items: string;
  created_at: string;
  user_id: number | null;
  paymongo_session_id: string | null;
  paymongo_payment_id: string | null;
}

export interface CreateOrderDTO {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  notes?: string;
  items: unknown[];
  total: number;
  user_id?: number;
}

export class OrderService extends BaseService {
  async getAll(): Promise<OrderRow[]> {
    return this.db`
      SELECT * FROM orders ORDER BY created_at DESC
    ` as unknown as OrderRow[];
  }

  async getByEmail(email: string): Promise<OrderRow[]> {
    return this.db`
      SELECT * FROM orders WHERE customer_email = ${email} ORDER BY created_at DESC
    ` as unknown as OrderRow[];
  }

  async getTotalRevenue(): Promise<number> {
    const [row] = await this.db`SELECT COALESCE(SUM(CAST(total AS numeric)), 0) as total FROM orders WHERE status != 'cancelled'`;
    return Number((row as { total: string }).total);
  }

  async getCount(): Promise<number> {
    const [row] = await this.db`SELECT COUNT(*) as count FROM orders`;
    return Number((row as { count: number }).count);
  }

  async getById(id: number): Promise<OrderRow | null> {
    const [order] = await this.db`SELECT * FROM orders WHERE id = ${id} LIMIT 1`;
    return (order as unknown as OrderRow) || null;
  }

  async updateStatus(id: number, status: string): Promise<OrderRow | null> {
    const [order] = await this.db`
      UPDATE orders SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return (order as unknown as OrderRow) || null;
  }

  async updatePaymentStatus(id: number, paymentStatus: string, paymentId?: string): Promise<void> {
    await this.db`
      UPDATE orders SET
        payment_status = ${paymentStatus},
        paymongo_payment_id = ${paymentId ?? null},
        updated_at = NOW()
      WHERE id = ${id}
    `;
  }

  async findBySessionId(sessionId: string): Promise<OrderRow | null> {
    const [order] = await this.db`SELECT * FROM orders WHERE paymongo_session_id = ${sessionId} LIMIT 1`;
    return (order as unknown as OrderRow) || null;
  }

  async updatePaymongoSessionId(orderId: number, sessionId: string): Promise<void> {
    await this.db`
      UPDATE orders SET paymongo_session_id = ${sessionId}, updated_at = NOW()
      WHERE id = ${orderId}
    `;
  }

  async create(data: CreateOrderDTO): Promise<OrderRow> {
    const [order] = await this.db`
      INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, notes, total, items, user_id, status, payment_status)
      VALUES (${data.customer_name}, ${data.customer_email}, ${data.customer_phone ?? null}, ${data.shipping_address}, ${data.notes ?? null}, ${data.total}, ${JSON.stringify(data.items)}, ${data.user_id ?? null}, 'pending', 'unpaid')
      RETURNING *
    `;
    return order as unknown as OrderRow;
  }

  parseItems(items: string): unknown[] {
    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  itemCount(items: string): number {
    return this.parseItems(items).length;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }
}
