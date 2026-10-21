"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

function getCartCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(cart)
      ? cart.reduce((sum: number, item: { quantity?: number }) => sum + (item.quantity || 1), 0)
      : 0;
  } catch {
    return 0;
  }
}

function SeedMark() {
  return (
    <svg viewBox="0 0 34 24" aria-hidden="true" className="h-5 w-7">
      <circle cx="11" cy="12" r="10" fill="currentColor" />
      <circle cx="23" cy="12" r="10" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      setCartCount(getCartCount());
    }

    const handleStorage = () => setCartCount(getCartCount());
    window.addEventListener("storage", handleStorage);

    const interval = setInterval(() => {
      setCartCount(getCartCount());
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-bone">
      <nav className="page-shell flex items-center justify-between gap-4 py-3" aria-label="Main">
        <Link href="/" className="flex items-center gap-2.5 font-display text-2xl leading-none tracking-tight">
          <SeedMark />
          <span>Brew &amp; Co.</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/menu" className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-ink">
            Menu
          </Link>
          <Link href="/#roast" className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-ink">
            Roast levels
          </Link>
          <Link href="/#story" className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-ink">
            Our story
          </Link>
          {session && (
            <Link href="/orders" className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-ink">
              Orders
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-field px-4 text-sm font-medium text-field-ink transition-colors hover:bg-field-strong"
          >
            Cart
            {cartCount > 0 && (
              <span className="grid h-5 min-w-5 place-content-center rounded-full bg-bone px-1 text-[11px] font-semibold text-ink">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
            <span className="sr-only">({cartCount} items)</span>
          </Link>

          {session ? (
            <button
              type="button"
              onClick={() => signOut()}
              className="hidden text-sm underline underline-offset-4 hover:decoration-2 md:inline-flex"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="hidden text-sm underline underline-offset-4 hover:decoration-2 md:inline-flex"
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="grid h-10 w-10 place-content-center rounded-full hover:bg-surface md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </nav>

      {isOpen && (
        <div id="mobile-menu" className="bg-surface md:hidden">
          <div className="page-shell flex flex-col gap-1 py-6">
            <Link href="/menu" onClick={() => setIsOpen(false)} className="py-2 font-display text-2xl">
              Menu
            </Link>
            <Link href="/#roast" onClick={() => setIsOpen(false)} className="py-2 font-display text-2xl">
              Roast levels
            </Link>
            <Link href="/#story" onClick={() => setIsOpen(false)} className="py-2 font-display text-2xl">
              Our story
            </Link>
            {session && (
              <Link href="/orders" onClick={() => setIsOpen(false)} className="py-2 font-display text-2xl">
                Orders
              </Link>
            )}
            <div className="mt-3 flex items-center gap-5 text-sm">
              {session ? (
                <button type="button" onClick={() => signOut()} className="underline underline-offset-4">
                  Sign out
                </button>
              ) : (
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="underline underline-offset-4">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
