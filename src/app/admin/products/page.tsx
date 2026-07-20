/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Coffee, Edit, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import Pagination from "@/components/ui/pagination";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: number | null;
  category_name: string | null;
  stock: number;
  is_available: boolean;
  is_featured: boolean;
  weight: string | null;
  origin: string | null;
  roast_level: string | null;
  image: string | null;
}

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id: number | null;
  stock: number;
  is_available: boolean;
  is_featured: boolean;
  weight: string;
  origin: string;
  roast_level: string;
  image: string;
}

const emptyForm: ProductForm = {
  name: "", slug: "", description: "", price: 0, category_id: null,
  stock: 0, is_available: true, is_featured: false, weight: "", origin: "", roast_level: "", image: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchProducts]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: Number(product.price),
      category_id: product.category_id,
      stock: product.stock,
      is_available: product.is_available,
      is_featured: product.is_featured,
      weight: product.weight || "",
      origin: product.origin || "",
      roast_level: product.roast_level || "",
      image: product.image || "",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.price) return;
    setSaving(true);
    try {
      if (editingId) {
        await fetch("/api/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...form }),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setShowForm(false);
      fetchProducts();
    } catch {
      // handle error silently
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    fetchProducts();
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center text-stone-500">Loading products...</div>;
  }

  const totalPages = Math.ceil(products.length / perPage);
  const paginatedProducts = products.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Products</h1>
          <p className="text-stone-500 mt-1">Manage your product catalog</p>
        </div>
        <Button className="bg-amber-700 hover:bg-amber-800" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-800">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <Input placeholder="Price" type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              <Input placeholder="Stock" type="number" value={form.stock || ""} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              <Input placeholder="Weight (e.g. 250g)" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
              <Input placeholder="Origin" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
              <Input placeholder="Roast Level" value={form.roast_level} onChange={(e) => setForm({ ...form, roast_level: e.target.value })} />
              <Input placeholder="Category ID" type="number" value={form.category_id || ""} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) || null })} />
              <Input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            {form.image && (
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-stone-100">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-stone-600">
                <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="rounded" />
                Available
              </label>
              <label className="flex items-center gap-2 text-sm text-stone-600">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded" />
                Featured
              </label>
            </div>
            <div className="flex gap-2">
              <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {products.length === 0 && <p className="text-stone-400 text-center py-8">No products yet.</p>}
        {paginatedProducts.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Coffee className="h-6 w-6 text-stone-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-stone-800">{product.name}</h3>
                <p className="text-sm text-stone-500">{product.category_name || "Uncategorized"}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-800">₱{Number(product.price).toLocaleString()}</p>
                <p className="text-xs text-stone-500">Stock: {product.stock}</p>
              </div>
              <Badge variant={product.is_available ? "success" : "destructive"}>
                {product.is_available ? "Active" : "Inactive"}
              </Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
