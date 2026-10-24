"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Tag, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface DiscountCode {
  id: number;
  code: string;
  percent: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchDiscounts = useCallback(async () => {
    try {
      const res = await fetch("/api/discounts");
      const data = await res.json();
      setDiscounts(data.discounts || []);
    } catch {
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiscounts(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchDiscounts]);

  const handleCreate = async () => {
    if (!code.trim() || percent < 1) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), percent }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not create discount code");
      }
      setCode("");
      setPercent(10);
      fetchDiscounts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create discount code");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (discount: DiscountCode) => {
    await fetch("/api/discounts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: discount.id, is_active: !discount.is_active }),
    });
    fetchDiscounts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this discount code?")) return;
    await fetch(`/api/discounts?id=${id}`, { method: "DELETE" });
    fetchDiscounts();
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center text-stone-500">Loading discounts...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Discounts</h1>
        <p className="text-stone-500 mt-1">Create promo codes for checkout</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-48">
              <label htmlFor="discount-code" className="block text-sm font-medium text-stone-600 mb-1">
                Code
              </label>
              <Input
                id="discount-code"
                placeholder="e.g. WELCOME10"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </div>
            <div className="w-36">
              <label htmlFor="discount-percent" className="block text-sm font-medium text-stone-600 mb-1">
                Percent off
              </label>
              <Input
                id="discount-percent"
                type="number"
                min={1}
                max={100}
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
              />
            </div>
            <Button
              className="bg-amber-700 hover:bg-amber-800"
              onClick={handleCreate}
              disabled={saving || !code.trim() || percent < 1 || percent > 100}
            >
              <Plus className="h-4 w-4 mr-2" /> {saving ? "Creating..." : "Create"}
            </Button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {discounts.length === 0 && <p className="text-stone-400 text-center py-8">No discount codes yet.</p>}
        {discounts.map((discount) => (
          <Card key={discount.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Tag className="h-5 w-5 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-stone-800">{discount.code}</h3>
                <p className="text-sm text-stone-500">
                  {discount.percent}% off · created {new Date(discount.created_at).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={discount.is_active ? "success" : "destructive"}>
                {discount.is_active ? "Active" : "Paused"}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => toggleActive(discount)}>
                {discount.is_active ? "Pause" : "Activate"}
              </Button>
              <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(discount.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
