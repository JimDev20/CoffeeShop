"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import Pagination from "@/components/ui/pagination";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  order_count: number;
  total_spent: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchCustomers]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center text-stone-500">Loading customers...</div>;
  }

  const totalPages = Math.ceil(customers.length / perPage);
  const paginatedCustomers = customers.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Customers</h1>
        <p className="text-stone-500 mt-1">View and manage your customers ({customers.length} total)</p>
      </div>

      <div className="space-y-3">
        {customers.length === 0 && <p className="text-stone-400 text-center py-8">No customers yet.</p>}
        {paginatedCustomers.map((customer) => (
          <Card key={customer.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800">{customer.name}</span>
                  <Badge variant={customer.order_count > 0 ? "success" : "secondary"}>
                    {customer.order_count > 0 ? "active" : "inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-stone-500">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {customer.email}</span>
                  {customer.phone && (
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {customer.phone}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-stone-800">{customer.order_count} orders</p>
                <p className="text-sm text-amber-700 font-medium">₱{Number(customer.total_spent).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
