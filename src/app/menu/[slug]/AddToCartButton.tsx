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

  const handleAdd = () => {
    const existing: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
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
    <Button
      className="w-full bg-amber-700 hover:bg-amber-800"
      size="lg"
      onClick={handleAdd}
    >
      {added ? (
        <>
          <Check className="h-5 w-5 mr-2" /> Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
        </>
      )}
    </Button>
  );
}
