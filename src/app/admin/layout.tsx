import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Coffee, LayoutDashboard, Package, ShoppingCart, Users, LogOut } from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <aside className="w-64 bg-stone-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-stone-700">
          <Link href="/admin" className="flex items-center gap-2 text-lg font-bold">
            <Coffee className="h-6 w-6 text-amber-400" />
            <span>Brew & Co.</span>
          </Link>
          <p className="text-xs text-stone-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-stone-700">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
