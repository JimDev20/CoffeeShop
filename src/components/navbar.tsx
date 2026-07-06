"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, ShoppingCart, Coffee } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-amber-800">
          <Coffee className="h-6 w-6" />
          <span>Brew & Co.</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors">Home</Link>
          <Link href="/menu" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors">Menu</Link>
          {session && (
            <Link href="/orders" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors">Orders</Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors">Admin</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          {session ? (
            <Button variant="ghost" size="sm" onClick={() => signOut()} className="hidden md:block">
              Sign Out
            </Button>
          ) : (
            <Link href="/auth/login" className="hidden md:block">
              <Button variant="default" size="sm">Sign In</Button>
            </Link>
          )}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white p-4">
          <div className="flex flex-col gap-3">
            <Link href="/" className="text-sm font-medium text-stone-600 hover:text-amber-700 py-2" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/menu" className="text-sm font-medium text-stone-600 hover:text-amber-700 py-2" onClick={() => setIsOpen(false)}>Menu</Link>
            {session && (
              <Link href="/orders" className="text-sm font-medium text-stone-600 hover:text-amber-700 py-2" onClick={() => setIsOpen(false)}>Orders</Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="text-sm font-medium text-stone-600 hover:text-amber-700 py-2" onClick={() => setIsOpen(false)}>Admin</Link>
            )}
            {session ? (
              <Button variant="ghost" className="w-full" onClick={() => signOut()}>Sign Out</Button>
            ) : (
              <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                <Button variant="default" className="w-full">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
