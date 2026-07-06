import sql from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface Order {
  id: number;
  customer_name: string;
  total: string;
  status: string;
  created_at: string;
  items: string;
}

const statusStyles: Record<string, "default" | "warning" | "success" | "secondary" | "destructive"> = {
  pending: "warning",
  confirmed: "default",
  preparing: "default",
  delivered: "success",
  cancelled: "destructive",
};

export default async function AdminOrdersPage() {
  let orders: Order[] = [];

  try {
    const result = await sql`
      SELECT * FROM orders ORDER BY created_at DESC
    `;
    orders = result as unknown as Order[];
  } catch (e) {
    console.error("Failed to load orders:", e);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Orders</h1>
        <p className="text-stone-500 mt-1">Manage customer orders</p>
      </div>

      <div className="space-y-3">
        {orders.length === 0 && (
          <p className="text-stone-400 text-center py-8">No orders yet.</p>
        )}
        {orders.map((order) => {
          let itemCount = 0;
          try { const parsed = JSON.parse(order.items); itemCount = Array.isArray(parsed) ? parsed.length : 1; } catch { itemCount = 1; }
          const date = new Date(order.created_at).toLocaleDateString();
          return (
            <Card key={order.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 text-amber-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-800">#{order.id}</span>
                    <span className="text-sm text-stone-500">{order.customer_name}</span>
                  </div>
                  <p className="text-sm text-stone-500">{date} &middot; {itemCount} items</p>
                </div>
                <p className="font-bold text-amber-800">₱{Number(order.total).toLocaleString()}</p>
                <Badge variant={statusStyles[order.status] || "secondary"}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                <Button variant="outline" size="sm">Update</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
