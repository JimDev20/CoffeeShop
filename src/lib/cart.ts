import type { ProductRow } from "@/services/ProductService";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToCart(product: ProductRow, quantity = 1): { added: number } {
  const cart = readCart();
  const found = cart.find((item) => item.id === product.id);
  const available = product.stock - (found?.quantity ?? 0);
  if (available <= 0) return { added: 0 };

  const added = Math.min(quantity, available);
  if (found) {
    found.quantity += added;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: added,
      image: product.image,
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  return { added };
}
