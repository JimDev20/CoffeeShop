"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { ProductRow } from "@/services/ProductService";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export default function AddToCartButton({ product }: { product: ProductRow }) {
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  const handleAdd = () => {
    let existing: CartItem[] = [];
    try {
      existing = JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      existing = [];
    }
    const found = existing.find((i) => i.id === product.id);
    if (found) {
      found.quantity += 1;
    } else {
      existing.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: 1,
        image: product.image,
      });
    }
    localStorage.setItem("cart", JSON.stringify(existing));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button className="w-full md:w-auto" size="lg" onClick={handleAdd} disabled={soldOut}>
      <span aria-live="polite">
        {soldOut ? (
          "Out of stock"
        ) : added ? (
          <span className="inline-flex items-center">
            <Check className="mr-2 h-5 w-5" /> Added to cart
          </span>
        ) : (
          <span className="inline-flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" /> Add to cart
          </span>
        )}
      </span>
    </Button>
  );
}
