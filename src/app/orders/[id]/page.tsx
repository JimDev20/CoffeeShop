"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, MapPin, Phone, Mail, FileText } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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

const statusStyles: Record<string, "default" | "warning" | "success" | "secondary" | "destructive"> = {
  pending: "warning",
  confirmed: "default",
  preparing: "default",
  ready: "success",
  delivered: "success",
  cancelled: "destructive",
};

const paymentStyles: Record<string, "default" | "warning" | "success" | "destructive" | "secondary"> = {
  unpaid: "warning",
  paid: "success",
  failed: "destructive",
  refunded: "secondary",
};

const statusSteps = ["pending", "confirmed", "preparing", "ready", "delivered"];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
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
    return () => { active = false; };
  }, [session, orderId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center text-stone-500">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-stone-400 mb-4">Order not found.</p>
        <Link href="/orders"><Button variant="outline">Back to Orders</Button></Link>
      </div>
    );
  }

  const items = parseItems(order.items);
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/orders" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-700 transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Order #{order.id}</h1>
          <p className="text-stone-500 mt-1">{formatDate(order.created_at)}</p>
        </div>
        <div className="text-right">
          <Badge variant={statusStyles[order.status] || "secondary"} className="text-sm">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
          <p className="text-xs text-stone-500 mt-1">
            Payment: <Badge variant={paymentStyles[order.payment_status] || "secondary"} className="text-xs ml-1">
              {order.payment_status}
            </Badge>
          </p>
        </div>
      </div>

      {order.status !== "cancelled" && currentStep >= 0 && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-initial">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i <= currentStep ? "bg-amber-700 text-white" : "bg-stone-200 text-stone-500"
                    }`}>
                      {i + 1}
                    </div>
                    <span className="text-xs text-stone-500 mt-1 capitalize">{step}</span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${i < currentStep ? "bg-amber-700" : "bg-stone-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <Package className="h-4 w-4" /> Order Items
              </h2>
              <div className="divide-y">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                      ) : (
                        <Package className="h-5 w-5 text-stone-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-800">{item.name}</p>
                      <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-stone-800">₱{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-amber-800">₱{Number(order.total).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-stone-800">Delivery Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-stone-400 mt-0.5" />
                  <span className="text-stone-600">{order.customer_email}</span>
                </div>
                {order.customer_phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-stone-400 mt-0.5" />
                    <span className="text-stone-600">{order.customer_phone}</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-stone-400 mt-0.5" />
                  <span className="text-stone-600">{order.shipping_address}</span>
                </div>
                {order.notes && (
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-stone-400 mt-0.5" />
                    <span className="text-stone-600">{order.notes}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full" onClick={() => router.push("/menu")}>
            Order Again
          </Button>
        </div>
      </div>
    </div>
  );
}
