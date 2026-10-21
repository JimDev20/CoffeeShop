"use client";

/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MapPin, Phone, FileText } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderItem {
  id?: number;
  productId?: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
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
  updated_at: string;
}

const statusTone: Record<string, string> = {
  pending: "bg-tone-light",
  confirmed: "bg-tone-medium",
  preparing: "bg-tone-medium",
  ready: "bg-field",
  delivered: "bg-field",
  cancelled: "bg-[#8c2f24]",
};

const statusSteps = ["pending", "confirmed", "preparing", "ready", "delivered"];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseItems(items: string): OrderItem[] {
  try {
    const parsed = JSON.parse(items);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function OrderDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        const found = data.orders?.find((o: Order) => o.id === orderId);
        if (active) setOrder(found || null);
      } catch {
        if (active) setOrder(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [session, orderId]);

  if (loading) {
    return <div className="page-shell py-24 text-center text-muted">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="page-shell">
        <div className="page-head">
          <h1 className="page-title">Order not found.</h1>
          <p className="section-lead mt-6">It may belong to a different account.</p>
        </div>
        <Link href="/orders" className="btn-pill">
          Back to orders
        </Link>
      </div>
    );
  }

  const items = parseItems(order.items);
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="page-shell">
      <div className="py-8">
        <Link href="/orders" className="inline-flex items-center gap-2 text-sm underline underline-offset-4">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to orders
        </Link>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="page-title">Order #{order.id}</h1>
          <p className="mt-3 text-sm text-muted">{formatDate(order.created_at)}</p>
        </div>
        <p className="inline-flex items-center gap-2 text-sm capitalize">
          <span className={`h-2.5 w-2.5 rounded-full ${statusTone[order.status] || "bg-tone-medium"}`} aria-hidden="true" />
          {order.status} / payment {order.payment_status}
        </p>
      </div>

      {order.status !== "cancelled" && currentStep >= 0 && (
        <ol className="mt-10 flex items-start gap-2" aria-label="Order progress">
          {statusSteps.map((step, index) => (
            <li key={step} className="flex flex-1 flex-col items-center gap-2 last:flex-none">
              <div className="flex w-full items-center gap-2">
                <span
                  className={`grid h-8 w-8 shrink-0 place-content-center rounded-full text-sm ${
                    index <= currentStep ? "bg-field text-field-ink" : "bg-surface text-muted"
                  }`}
                >
                  {index + 1}
                </span>
                {index < statusSteps.length - 1 && (
                  <span
                    className={`h-px flex-1 ${index < currentStep ? "bg-field" : "bg-surface-strong"}`}
                    aria-hidden="true"
                  />
                )}
              </div>
              <span className={`text-xs capitalize ${index <= currentStep ? "text-ink" : "text-muted"}`}>{step}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-12 grid grid-cols-1 gap-12 pb-24 md:grid-cols-[1.2fr_0.8fr] md:gap-16">
        <div>
          <h2 className="font-display text-3xl leading-none">Items</h2>
          <ul className="mt-4">
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-4 py-5">
                <span className="grid h-14 w-14 shrink-0 place-content-center overflow-hidden rounded-full bg-surface">
                  {item.image ? (
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-7 w-7 text-ink" aria-hidden="true">
                      <ellipse cx="12" cy="12" rx="6" ry="9" transform="rotate(32 12 12)" fill="currentColor" />
                    </svg>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{item.name}</span>
                  <span className="mt-1 block text-sm text-muted">
                    ₱{item.price.toLocaleString()} / qty {item.quantity}
                  </span>
                </span>
                <span className="font-medium">₱{(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-medium">Total</span>
            <span className="font-display text-3xl leading-none">₱{Number(order.total).toLocaleString()}</span>
          </div>
        </div>

        <aside className="h-fit bg-surface p-6 md:p-8">
          <h2 className="font-display text-2xl leading-none">Delivery</h2>
          <div className="mt-5 space-y-4 text-sm">
            <p className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              {order.customer_email}
            </p>
            {order.customer_phone && (
              <p className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                {order.customer_phone}
              </p>
            )}
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              {order.shipping_address}
            </p>
            {order.notes && (
              <p className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                {order.notes}
              </p>
            )}
          </div>
          <Button variant="outline" className="mt-8 w-full" onClick={() => router.push("/menu")}>
            Order again
          </Button>
        </aside>
      </div>
    </div>
  );
}
