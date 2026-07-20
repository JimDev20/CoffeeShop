"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import Pagination from "@/components/ui/pagination";

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  total: string;
  status: string;
  payment_status: string;
  created_at: string;
  items: string;
}

const statusStyles: Record<string, "default" | "warning" | "success" | "secondary" | "destructive"> = {
  pending: "warning",
  confirmed: "default",
  preparing: "default",
  ready: "secondary",
  delivered: "success",
  cancelled: "destructive",
};

const statusOptions = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString();
}

function itemCount(items: string): number {
  try {
    const parsed = JSON.parse(items);
    return Array.isArray(parsed) ? parsed.length : 1;
  } catch {
    return 1;
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchOrders]);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch {
      // handle error silently
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center text-stone-500">Loading orders...</div>;
  }

  const totalPages = Math.ceil(orders.length / perPage);
  const paginatedOrders = orders.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Orders</h1>
        <p className="text-stone-500 mt-1">Manage customer orders</p>
      </div>

      <div className="space-y-3">
        {orders.length === 0 && <p className="text-stone-400 text-center py-8">No orders yet.</p>}
        {paginatedOrders.map((order) => (
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
                <p className="text-sm text-stone-500">{formatDate(order.created_at)} · {itemCount(order.items)} items</p>
              </div>
              <p className="font-bold text-amber-800">₱{Number(order.total).toLocaleString()}</p>
              <Badge variant={statusStyles[order.status] || "secondary"}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <select
                className="border border-stone-300 rounded-lg px-2 py-1 text-sm text-stone-700 bg-white"
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                disabled={updatingId === order.id}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
