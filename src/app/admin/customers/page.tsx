import sql from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone } from "lucide-react";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  order_count: number;
  total_spent: string;
  created_at: string;
}

export default async function AdminCustomersPage() {
  let customers: Customer[] = [];

  try {
    const result = await sql`
      SELECT u.id, u.name, u.email, u.phone, u.created_at,
        COALESCE((SELECT COUNT(*) FROM orders WHERE user_id = u.id), 0) as order_count,
        COALESCE((SELECT SUM(CAST(total AS numeric)) FROM orders WHERE user_id = u.id), 0) as total_spent
      FROM users u
      WHERE u.role = 'customer'
      ORDER BY u.created_at DESC
    `;
    customers = result as unknown as Customer[];
  } catch (e) {
    console.error("Failed to load customers:", e);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Customers</h1>
        <p className="text-stone-500 mt-1">View and manage your customers ({customers.length} total)</p>
      </div>

      <div className="space-y-3">
        {customers.length === 0 && (
          <p className="text-stone-400 text-center py-8">No customers yet.</p>
        )}
        {customers.map((customer) => (
          <Card key={customer.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800">{customer.name}</span>
                  <Badge variant={customer.order_count > 0 ? "success" : "secondary"}>
                    {customer.order_count > 0 ? "active" : "inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-stone-500">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {customer.email}</span>
                  {customer.phone && (
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {customer.phone}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-stone-800">{customer.order_count} orders</p>
                <p className="text-sm text-amber-700 font-medium">₱{Number(customer.total_spent).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
