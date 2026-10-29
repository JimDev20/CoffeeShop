"use client";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import type { ProductRow } from "@/services/ProductService";
import { Check, Plus } from "lucide-react";
import { useState } from "react";

type AddState = "idle" | "added" | "limit";

export default function QuickAddButton({ product }: { product: ProductRow }) {
  const [state, setState] = useState<AddState>("idle");
  const soldOut = product.stock <= 0;

  const handleAdd = () => {
    const { added } = addToCart(product);
    setState(added > 0 ? "added" : "limit");
    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <Button
      size="sm"
      onClick={handleAdd}
      disabled={soldOut}
      aria-label={soldOut ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
    >
      <span aria-live="polite" className="inline-flex items-center gap-1.5">
        {soldOut ? (
          "Sold out"
        ) : state === "added" ? (
          <>
            <Check className="h-4 w-4" aria-hidden="true" />
            Added
          </>
        ) : state === "limit" ? (
          "Max"
        ) : (
          <>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add
          </>
        )}
      </span>
    </Button>
  );
}
