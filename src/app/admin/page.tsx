import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Users, ShoppingCart, DollarSign } from "lucide-react";
import Link from "next/link";

const stats = [
  { icon: DollarSign, label: "Total Revenue", value: "₱45,230", color: "text-green-600", bg: "bg-green-100" },
  { icon: ShoppingCart, label: "Total Orders", value: "156", color: "text-amber-600", bg: "bg-amber-100" },
  { icon: Users, label: "Customers", value: "128", color: "text-blue-600", bg: "bg-blue-100" },
  { icon: Coffee, label: "Products", value: "24", color: "text-stone-600", bg: "bg-stone-100" },
];

const adminLinks = [
  { href: "/admin/products", label: "Manage Products", desc: "Add, edit, or remove products" },
  { href: "/admin/orders", label: "Manage Orders", desc: "View and update order status" },
  { href: "/admin/customers", label: "Manage Customers", desc: "View customer information" },
];

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Admin <span className="text-amber-700">Dashboard</span></h1>
        <p className="text-stone-500 mt-1">Manage your coffee shop</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
              <p className="text-sm text-stone-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adminLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="group hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="group-hover:text-amber-700 transition-colors">{link.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-500">{link.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
