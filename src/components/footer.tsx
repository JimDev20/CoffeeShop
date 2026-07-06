import { Coffee, Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold text-amber-800">
              <Coffee className="h-6 w-6" />
              <span>Brew & Co.</span>
            </div>
            <p className="text-sm text-stone-500">
              Crafting the perfect cup since 2024. Freshly roasted coffee delivered to your door.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-stone-800 mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link href="/menu" className="text-sm text-stone-500 hover:text-amber-700">Menu</Link>
              <Link href="/orders" className="text-sm text-stone-500 hover:text-amber-700">Orders</Link>
              <Link href="/cart" className="text-sm text-stone-500 hover:text-amber-700">Cart</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-stone-800 mb-3">Support</h3>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-stone-500">24/7 Customer Support</span>
              <span className="text-sm text-stone-500">Fast & Reliable Delivery</span>
              <span className="text-sm text-stone-500">Freshness Guaranteed</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-stone-800 mb-3">Follow Us</h3>
            <div className="flex gap-3">
              <Facebook className="h-5 w-5 text-stone-400 hover:text-amber-700 cursor-pointer" />
              <Instagram className="h-5 w-5 text-stone-400 hover:text-amber-700 cursor-pointer" />
              <Twitter className="h-5 w-5 text-stone-400 hover:text-amber-700 cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="border-t border-stone-200 mt-8 pt-8 text-center text-sm text-stone-400">
          &copy; {new Date().getFullYear()} Brew & Co. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
