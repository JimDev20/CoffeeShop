"use client";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { ProductRow } from "@/services/ProductService";

export default function AddToCartButton({ product }: { product: ProductRow }) {
  const [added, setAdded] = useState(false);
  const [atLimit, setAtLimit] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const soldOut = product.stock <= 0;

  const handleAdd = () => {
    const { added: count } = addToCart(product, quantity);
    if (count === 0) {
      setAtLimit(true);
      setTimeout(() => setAtLimit(false), 2000);
      return;
    }

    setAtLimit(false);
    setQuantity(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div
        className="inline-flex w-fit items-center gap-1 rounded-full bg-surface p-1"
        role="group"
        aria-label="Quantity"
      >
        <button
          type="button"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          disabled={quantity <= 1 || soldOut}
          className="grid h-10 w-10 place-content-center rounded-full hover:bg-surface-strong disabled:opacity-40"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="w-8 text-center text-sm font-medium" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
          disabled={quantity >= product.stock || soldOut}
          className="grid h-10 w-10 place-content-center rounded-full hover:bg-surface-strong disabled:opacity-40"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <Button className="w-full sm:w-auto" size="lg" onClick={handleAdd} disabled={soldOut}>
        <span aria-live="polite">
          {soldOut ? (
            "Out of stock"
          ) : added ? (
            <span className="inline-flex items-center">
              <Check className="mr-2 h-5 w-5" /> Added to cart
            </span>
          ) : atLimit ? (
            `Only ${product.stock} in stock`
          ) : (
            <span className="inline-flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add {quantity} to cart
            </span>
          )}
        </span>
      </Button>
    </div>
  );
}
