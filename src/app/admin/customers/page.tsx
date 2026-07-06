import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone, MapPin } from "lucide-react";

const customers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+63 912 345 6789", orders: 12, total: 8450, status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+63 923 456 7890", orders: 8, total: 5320, status: "active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "+63 934 567 8901", orders: 3, total: 1280, status: "inactive" },
  { id: 4, name: "Alice Williams", email: "alice@example.com", phone: "+63 945 678 9012", orders: 15, total: 12350, status: "active" },
];

export default function AdminCustomersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Customers</h1>
        <p className="text-stone-500 mt-1">View and manage your customers ({customers.length} total)</p>
      </div>

      <div className="space-y-3">
        {customers.map((customer) => (
          <Card key={customer.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800">{customer.name}</span>
                  <Badge variant={customer.status === "active" ? "success" : "secondary"}>
                    {customer.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-stone-500">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {customer.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {customer.phone}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-stone-800">{customer.orders} orders</p>
                <p className="text-sm text-amber-700 font-medium">₱{customer.total.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
