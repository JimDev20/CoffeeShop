import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

const orders = [
  { id: 1, customer: "John Doe", total: 1180, status: "delivered", date: "2024-01-15", items: 3 },
  { id: 2, customer: "Jane Smith", total: 730, status: "preparing", date: "2024-01-20", items: 2 },
  { id: 3, customer: "Bob Johnson", total: 450, status: "pending", date: "2024-01-25", items: 1 },
];

const statusStyles: Record<string, "default" | "warning" | "success" | "secondary" | "destructive"> = {
  pending: "warning",
  confirmed: "default",
  preparing: "default",
  delivered: "success",
  cancelled: "destructive",
};

export default function AdminOrdersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Orders</h1>
        <p className="text-stone-500 mt-1">Manage customer orders</p>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 text-amber-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800">#{order.id}</span>
                  <span className="text-sm text-stone-500">{order.customer}</span>
                </div>
                <p className="text-sm text-stone-500">{order.date} &middot; {order.items} items</p>
              </div>
              <p className="font-bold text-amber-800">₱{order.total.toLocaleString()}</p>
              <Badge variant={statusStyles[order.status] || "secondary"}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <Button variant="outline" size="sm">Update</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
