import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

const orders = [
  { id: 1, date: "2024-01-15", total: 1180, status: "delivered", items: 3 },
  { id: 2, date: "2024-01-20", total: 730, status: "preparing", items: 2 },
  { id: 3, date: "2024-01-25", total: 450, status: "pending", items: 1 },
];

const statusStyles: Record<string, "default" | "warning" | "success" | "secondary" | "destructive"> = {
  pending: "warning",
  preparing: "default",
  delivered: "success",
  cancelled: "destructive",
};

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-800 mb-8">My <span className="text-amber-700">Orders</span></h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Package className="h-6 w-6 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">Order #{order.id}</p>
                    <p className="text-sm text-stone-500">{order.date} &middot; {order.items} item(s)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-800">₱{order.total.toLocaleString()}</p>
                  <Badge variant={statusStyles[order.status] || "secondary"} className="mt-1">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
