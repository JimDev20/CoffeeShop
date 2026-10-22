"use client";

import { Package } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface OrderRow {
  id: number;
  customer_name: string;
  customer_email: string;
  total: string;
  status: string;
  created_at: string;
  items: string;
}

const statusTone: Record<string, string> = {
  pending: "bg-tone-light",
  confirmed: "bg-tone-medium",
  preparing: "bg-tone-medium",
  ready: "bg-field",
  delivered: "bg-field",
  cancelled: "bg-[#8c2f24]",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function itemCount(items: string): number {
  try {
    const parsed = JSON.parse(items);
    return Array.isArray(parsed) ? parsed.length : 1;
  } catch {
    return 1;
  }
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) {
      setLoading(false); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        const userOrders =
          data.orders?.filter((o: OrderRow) => o.customer_email === session?.user?.email) || [];
        if (active) setOrders(userOrders);
      } catch {
        if (active) setOrders([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [session]);

  if (status === "loading" || loading) {
    return <div className="page-shell py-24 text-center text-muted">Loading orders...</div>;
  }

  if (!session) {
    return (
      <div className="page-shell">
        <div className="page-head">
          <h1 className="page-title">Your orders.</h1>
          <p className="section-lead mt-6">Sign in to see what you have ordered and where it is.</p>
        </div>
        <Link href="/auth/login" className="btn-pill">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-head">
        <h1 className="page-title">Your orders.</h1>
        <p className="section-lead mt-6">Every order, from the first bag to the last.</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-start gap-6 pb-24">
          <div className="grid h-28 w-28 place-content-center rounded-full bg-surface">
            <Package className="h-10 w-10 text-muted" aria-hidden="true" />
          </div>
          <h2 className="section-title">No orders yet.</h2>
          <p className="section-lead">The first one starts with a bag of coffee.</p>
          <Link href="/menu" className="btn-pill">
            Browse the shelf
          </Link>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className="list-row">
              <span className="grid h-14 w-14 place-content-center rounded-full bg-surface">
                <Package className="h-6 w-6 text-muted" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-lg font-medium">Order #{order.id}</span>
                <span className="mt-1 block text-sm text-muted">
                  {formatDate(order.created_at)} / {itemCount(order.items)} item(s)
                </span>
                <span className="mt-2 inline-flex items-center gap-2 text-[0.8125rem] capitalize">
                  <span
                    className={`h-2 w-2 rounded-full ${statusTone[order.status] || "bg-tone-medium"}`}
                    aria-hidden="true"
                  />
                  {order.status}
                </span>
              </span>
              <span className="text-right text-lg font-medium">
                ₱{Number(order.total).toLocaleString()}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
