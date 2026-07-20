"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
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
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
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
          items: items.map((i) => ({ name: i.name, quantity: i.quantity, amount: i.price })),
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
    return <div className="container mx-auto px-4 py-12 text-center text-stone-500">Loading cart...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-800 mb-8">Your <span className="text-amber-700">Cart</span></h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="h-16 w-16 mx-auto text-stone-300 mb-4" />
          <h2 className="text-xl font-semibold text-stone-600 mb-2">Your cart is empty</h2>
          <p className="text-stone-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/menu">
            <Button>Browse Menu</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-stone-100 rounded-lg flex items-center justify-center shrink-0">
                    <ShoppingCart className="h-8 w-8 text-stone-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-stone-800">{item.name}</h3>
                    <p className="text-amber-800 font-bold">₱{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, -1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="font-semibold text-stone-800 w-20 text-right">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-stone-800">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Subtotal</span>
                    <span className="font-medium">₱{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Delivery</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-amber-800">₱{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <Textarea placeholder="Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                  <Textarea placeholder="Order Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  className="w-full bg-amber-700 hover:bg-amber-800"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={checkingOut}
                >
                  {checkingOut ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
