"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export default function CartPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- initializing state from localStorage */
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(saved);
    if (session?.user?.name) setName(session.user.name);
    if (session?.user?.email) setEmail(session.user.email);
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [session]);

  const saveCart = (updated: CartItem[]) => {
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const updateQty = (id: number, delta: number) => {
    saveCart(
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    saveCart(items.filter((item) => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!name || !email || !address) {
      setError("Please fill in name, email, and delivery address.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setCheckingOut(true);
    setError("");

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          shipping_address: address,
          notes,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total,
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.error || "Failed to create order");
      }

      const orderData = await orderRes.json();
      const orderId = orderData.order?.id;

      const payRes = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          description: `Coffee Shop Order - ${name}`,
          items: items.map((item) => ({ name: item.name, quantity: item.quantity, amount: item.price })),
          order_id: orderId,
          customer_email: email,
        }),
      });

      const payData = await payRes.json();

      if (payData.checkout_url) {
        localStorage.removeItem("cart");
        // eslint-disable-next-line react-hooks/immutability
        window.location.href = payData.checkout_url;
      } else {
        localStorage.removeItem("cart");
        setItems([]);
        alert("Order placed successfully! We will contact you for payment.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (!loaded) {
    return <div className="page-shell py-24 text-center text-muted">Loading cart...</div>;
  }

  return (
    <div className="page-shell">
      <div className="page-head">
        <h1 className="page-title">Your cart.</h1>
        <p className="section-lead mt-6">
          {items.length > 0
            ? "Check the lot, set the quantity, then tell us where it is going."
            : "A bag, a grinder or a box of capsules is waiting on the shelf."}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-start gap-6 pb-24">
          <div className="grid h-28 w-28 place-content-center rounded-full bg-field text-field-ink">
            <ShoppingCart className="h-10 w-10" aria-hidden="true" />
          </div>
          <h2 className="section-title">The cart is empty.</h2>
          <p className="section-lead">Start with the coffee or take a look at the brewing gear.</p>
          <Link href="/menu" className="btn-pill">
            Browse the shelf
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12 pb-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <ul>
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-4 py-6 sm:flex-nowrap sm:gap-6"
                >
                  <div className="grid h-16 w-16 shrink-0 place-content-center overflow-hidden rounded-full bg-surface">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-8 w-8 text-ink" aria-hidden="true">
                        <ellipse cx="12" cy="12" rx="6" ry="9" transform="rotate(32 12 12)" fill="currentColor" />
                      </svg>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-medium">{item.name}</h2>
                    <p className="mt-1 text-sm text-muted">₱{item.price.toLocaleString()} each</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      className="grid h-9 w-9 place-content-center rounded-full bg-surface hover:bg-surface-strong"
                      aria-label={`Reduce quantity of ${item.name}`}
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-7 text-center font-medium" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      className="grid h-9 w-9 place-content-center rounded-full bg-surface hover:bg-surface-strong"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <p className="w-24 text-right font-medium">₱{(item.price * item.quantity).toLocaleString()}</p>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="inline-flex items-center gap-1 text-sm text-[#7a2a1f] underline underline-offset-4"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit bg-surface p-6 md:p-8">
            <h2 className="font-display text-[1.375rem] leading-none">Order summary</h2>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>₱{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery</span>
                <span>Free</span>
              </div>
              <div className="flex items-baseline justify-between pt-3">
                <span className="font-medium">Total</span>
                <span className="font-display text-[1.375rem] leading-none">₱{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <label className="block">
                <span className="sr-only">Full name</span>
                <Input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label className="block">
                <span className="sr-only">Email</span>
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label className="block">
                <span className="sr-only">Phone</span>
                <Input placeholder="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
              </label>
              <label className="block">
                <span className="sr-only">Delivery address</span>
                <Textarea
                  placeholder="Delivery address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </label>
              <label className="block">
                <span className="sr-only">Order notes (optional)</span>
                <Textarea
                  placeholder="Order notes (optional)"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </label>
            </div>

            {error && (
              <p className="mt-4 text-sm text-[#7a2a1f]" role="alert">
                {error}
              </p>
            )}

            <Button className="mt-6 w-full" size="lg" onClick={handleCheckout} disabled={checkingOut}>
              {checkingOut ? "Processing..." : "Proceed to checkout"}
            </Button>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              You will be sent to PayMongo to finish payment. Delivery details are kept with the order.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
