"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
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

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        const userOrders = data.orders?.filter(
          (o: Order) => o.customer_email === session?.user?.email
        ) || [];
        setOrders(userOrders);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user?.email) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-stone-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-800 mb-8">My <span className="text-amber-700">Orders</span></h1>

      {orders.length === 0 ? (
        <p className="text-stone-400 text-center py-16">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            let itemCount = 0;
            try { const parsed = JSON.parse(order.items); itemCount = Array.isArray(parsed) ? parsed.length : 1; } catch { itemCount = 1; }
            const date = new Date(order.created_at).toLocaleDateString();
            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                        <Package className="h-6 w-6 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-800">Order #{order.id}</p>
                        <p className="text-sm text-stone-500">{date} &middot; {itemCount} item(s)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-800">₱{Number(order.total).toLocaleString()}</p>
                      <Badge variant={statusStyles[order.status] || "secondary"} className="mt-1">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
